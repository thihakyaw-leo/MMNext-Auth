import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./backend/routers";
import { createContext } from "./backend/_core/context";
import { setCloudflareEnv, type CloudflareEnv } from "./backend/_core/cloudflare";
import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import { sdk } from "./backend/_core/sdk";
import { getSessionCookieOptions } from "./backend/_core/cookies";
import * as db from "./backend/db";

interface WorkerEnv extends CloudflareEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

type WorkerRequest = {
  protocol: string;
  headers: Record<string, string>;
  query: Record<string, string>;
};

type WorkerResponse = {
  clearCookie(name: string, options: Record<string, unknown>): void;
  cookie(name: string, value: string, options: Record<string, unknown>): void;
};

function makeExpressCompatibleRequest(request: Request): WorkerRequest {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => { headers[key] = value; });
  return {
    protocol: new URL(request.url).protocol.replace(":", ""),
    headers,
    query: Object.fromEntries(new URL(request.url).searchParams.entries()),
  };
}

function makeResponseRecorder(): WorkerResponse & { headers: Headers } {
  const headers = new Headers();
  return {
    headers,
    clearCookie(name, options) {
      headers.append("Set-Cookie", `${name}=; Max-Age=0; Path=${String(options.path ?? "/")}; HttpOnly; Secure; SameSite=None`);
    },
    cookie(name, value, options) {
      headers.append("Set-Cookie", `${name}=${encodeURIComponent(value)}; Max-Age=${Math.floor(Number(options.maxAge ?? 0) / 1000)}; Path=${String(options.path ?? "/")}; HttpOnly; Secure; SameSite=None`);
    },
  };
}

function getQueryParam(req: Request, key: string): string | undefined {
  const url = new URL(req.url);
  return url.searchParams.get(key) ?? undefined;
}

async function handleOAuthCallback(request: Request, env: WorkerEnv): Promise<Response> {
  setCloudflareEnv({ DB: env.DB, CACHE: env.CACHE, FILES: env.FILES });
  try {
    const code = getQueryParam(request, "code");
    const state = getQueryParam(request, "state");

    if (!code || !state) {
      return Response.json({ error: "code and state are required" }, { status: 400 });
    }

    // CSRF guard
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(request.headers.get("cookie") ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      return Response.json({ error: "invalid oauth state" }, { status: 403 });
    }

    const headers = new Headers();
    headers.append("Set-Cookie", `${OAUTH_STATE_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None`);

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      // Extract provider from userInfo
      const provider = (userInfo as any).loginMethod || (userInfo as any).platform || "mmnext";

      // Normalize user info from different providers
      const rawInfo = userInfo as Record<string, unknown>;
      const openId = (rawInfo.sub as string) || (rawInfo.id as string) || (rawInfo.openId as string);
      const email = (rawInfo.email as string) || (rawInfo.mail as string) || (rawInfo.userPrincipalName as string);
      const name = (rawInfo.name as string) || (rawInfo.displayName as string) || (rawInfo.given_name as string) || "";
      const picture = (rawInfo.picture as string) || (rawInfo.avatar_url as string) || (rawInfo.photoUrl as string);

      const normalizedOpenId = `${provider}:${openId}`;

      if (!normalizedOpenId) {
        return Response.json({ error: "openId missing from user info" }, { status: 400 });
      }

      await db.upsertUser({
        openId: normalizedOpenId,
        name: name || email?.split("@")[0] || "User",
        email: email ?? null,
        loginMethod: provider,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(normalizedOpenId, {
        name: name || email?.split("@")[0] || "User",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions({ headers: { cookie: request.headers.get("cookie") ?? "" } } as any);
      headers.append("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(sessionToken)}; Max-Age=${Math.floor(ONE_YEAR_MS / 1000)}; Path=${cookieOptions.path ?? "/"}; HttpOnly; Secure; SameSite=None`);

      return Response.redirect(new URL("/", request.url), 302);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      return Response.json({ error: "OAuth callback failed" }, { status: 500 });
    }
  } finally {
    setCloudflareEnv(undefined);
  }
}

async function handleTrpc(request: Request, env: WorkerEnv): Promise<Response> {
  const req = makeExpressCompatibleRequest(request);
  const res = makeResponseRecorder();
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => createContext({ req, res } as never),
  });
  res.headers.forEach((value, key) => response.headers.append(key, value));
  return response;
}

async function health(env: WorkerEnv): Promise<Response> {
  const checks: Record<string, string> = { d1: "missing", kv: "missing", r2: "missing" };
  if (env.DB) {
    await env.DB.prepare("SELECT 1 AS ok").first();
    checks.d1 = "ok";
  }
  if (env.CACHE) {
    await env.CACHE.put("mmnext-auth:health", new Date().toISOString(), { expirationTtl: 60 });
    checks.kv = (await env.CACHE.get("mmnext-auth:health")) ? "ok" : "error";
  }
  if (env.FILES) checks.r2 = "ok";
  return Response.json({ service: "mmnext-auth", bindings: checks });
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    setCloudflareEnv({ DB: env.DB, CACHE: env.CACHE, FILES: env.FILES });
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/health") return await health(env);
      if (url.pathname === "/api/oauth/callback") return await handleOAuthCallback(request, env);
      if (url.pathname.startsWith("/api/trpc")) return await handleTrpc(request, env);
      return env.ASSETS.fetch(request);
    } finally {
      setCloudflareEnv(undefined);
    }
  },
};
