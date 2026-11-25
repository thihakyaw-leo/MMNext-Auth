import { COOKIE_NAME, ONE_YEAR_MS, OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function normalizeUserInfo(userInfo: Record<string, unknown>, provider?: string) {
  // Normalize user info from different OAuth providers
  const openId = (userInfo.sub as string) || (userInfo.id as string) || (userInfo.openId as string);
  const email = (userInfo.email as string) || (userInfo.mail as string) || (userInfo.userPrincipalName as string);
  const name = (userInfo.name as string) || (userInfo.displayName as string) || (userInfo.given_name as string) || "";
  const picture = (userInfo.picture as string) || (userInfo.avatar_url as string) || (userInfo.photoUrl as string);

  return {
    openId: `${provider || "mmnext"}:${openId}`,
    email: email ?? null,
    name: name || email?.split("@")[0] || "User",
    loginMethod: provider || "mmnext",
    picture: picture ?? null,
  };
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // CSRF guard: the nonce in `state` must match the one-time cookie that
    // startLogin set in the browser that began this login. An attacker can
    // forge `state`, but cannot plant this cookie in the victim's browser.
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

            // Extract provider from userInfo (platform or loginMethod)
            const provider = userInfo.loginMethod || userInfo.platform || "mmnext";

      const normalized = normalizeUserInfo(userInfo as unknown as Record<string, unknown>, provider);

      if (!normalized.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: normalized.openId,
        name: normalized.name,
        email: normalized.email,
        loginMethod: normalized.loginMethod,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(normalized.openId, {
        name: normalized.name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
