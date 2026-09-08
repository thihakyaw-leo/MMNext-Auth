import type { D1Database, R2Bucket, KVNamespaceLike } from "./backend/_core/cloudflare";

declare global {
  interface Env {
    ASSETS: { fetch(request: Request): Promise<Response> };
    DB: D1Database;
    CACHE: KVNamespaceLike;
    FILES: R2Bucket;
  }
}

export {};
