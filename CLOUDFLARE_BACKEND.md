# Cloudflare backend architecture

MMNext-Auth now separates backend responsibilities across three Cloudflare primitives:

| Layer | Binding | Responsibility |
|---|---|---|
| Relational data | `DB` → D1 `posapp-db` | Users, stored-file metadata, relational queries and indexes |
| Low-latency metadata | `CACHE` → KV `posapp-kv` | Short-lived user/session lookups and future feature flags or rate-limit state |
| Binary objects | `FILES` → R2 `mmnext-pos-files` | Uploaded images, WebP/JPG/PDF files and object retrieval |

The code uses the Cloudflare bindings whenever a request-scoped runtime environment is present. The existing MySQL/Manus storage providers remain as local-development and rollback fallbacks, so the current test suite does not need a live Cloudflare account.

## Bindings

Bindings are configured in `wrangler.jsonc`:

- `DB`: D1 database ID `093a58fa-544a-47c1-9cfd-f6ac00201fa3` (`posapp-db`)
- `CACHE`: KV namespace ID `012abbdc8df345e3835b2e538cd5132c` (`posapp-kv`)
- `FILES`: R2 bucket `mmnext-pos-files`

For a Pages deployment, the same bindings must also be attached to the Pages project under **Settings → Bindings**, followed by a redeploy. Wrangler configuration is sufficient for local `wrangler pages dev` and Worker-style deployments.

## D1 setup

```bash
pnpm wrangler d1 migrations apply MMNEXT_DB --local
pnpm wrangler d1 migrations apply MMNEXT_DB --remote
pnpm wrangler types
```

The SQL migration is in `migrations/0001_cloudflare_d1.sql`. It creates `users`, `stored_files`, and the owner/created-time index. Do not apply the migration to a production database until the selected D1 database has been backed up or verified as the intended target.

## Runtime behavior

`server/db.ts` uses D1 prepared statements for user upserts, user lookup, file metadata insertion, and file listing. `server/storage.ts` writes file bytes to R2 and returns `/storage/<encoded-key>` URLs. If Cloudflare bindings are unavailable, those modules fall back to the existing MySQL and Manus storage implementations for local development.

The `server/_core/cloudflare.ts` module defines the small binding surface used by the application and provides KV helpers (`cacheGet`, `cachePut`, `cacheDelete`). A Cloudflare adapter should set the request-scoped environment with `setCloudflareEnv({ DB: env.DB, CACHE: env.CACHE, FILES: env.FILES })` before invoking tRPC handlers.

## Security notes

R2 object keys are generated with a random suffix to prevent collisions. File metadata remains in D1 and is associated with the authenticated owner. Keep R2 objects private and serve them through an authenticated route or signed URL; do not expose the bucket publicly. KV is not used as the source of truth for authorization or relational data.
