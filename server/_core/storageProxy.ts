import type { Express } from "express";
import { ENV } from "./env";
import { getCloudflareEnv } from "./cloudflare";

function registerR2Proxy(app: Express) {
  app.get("/storage/*", async (req, res) => {
    const bucket = getCloudflareEnv()?.FILES;
    const encodedKey = (req.params as Record<string, string>)[0];
    if (!bucket || !encodedKey) return;
    try {
      const object = await bucket.get(decodeURIComponent(encodedKey));
      if (!object) {
        res.status(404).send("File not found");
        return;
      }
      if (object.httpMetadata?.contentType) res.type(object.httpMetadata.contentType);
      res.set("Cache-Control", "private, max-age=3600");
      res.status(200);
      object.body.pipeTo(new WritableStream({ write: chunk => { res.write(Buffer.from(chunk)); } }))
        .then(() => res.end())
        .catch(() => { if (!res.headersSent) res.status(502); res.end("Storage proxy error"); });
    } catch (error) {
      console.error("[R2Proxy] failed:", error);
      res.status(502).send("Storage backend error");
    }
  });
}

export function registerStorageProxy(app: Express) {
  registerR2Proxy(app);
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
      });

      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }

      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }

      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
