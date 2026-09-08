

## MMNext-Auth configuration

The login page uses an OAuth 2.0 authorization-code flow with PKCE. Configure these frontend variables in the Cloudflare Pages build environment or Bitbucket repository variables:

| Variable | Purpose | Example |
|---|---|---|
| `VITE_AUTH_SERVER_URL` | MMNext-Auth issuer URL | `https://auth.mmnext.app` |
| `VITE_MMNEXT_CLIENT_ID` | Public OAuth client ID registered for the POS web app | `mmnext-pos-web` |
| `VITE_AUTH_REDIRECT_URI` | Exact callback URL registered in MMNext-Auth | `https://pos.example.com/auth/callback` |

The callback page validates the OAuth `state`, exchanges the authorization code using PKCE, and stores the returned token response in session storage. Confirm that the Auth Server allows the deployed POS origin through CORS and that the redirect URI is registered exactly, including protocol and path.

## Bitbucket and Cloudflare Pages

The repository includes `bitbucket-pipelines.yml`. Add `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CLOUDFLARE_PAGES_PROJECT` as secured Bitbucket repository variables, then add the three `VITE_*` variables above. The pipeline runs type checking and production builds for pull requests, and deploys the `main` branch to Cloudflare Pages.

The frontend assets are stored through the project asset storage and the supplied MMNext mark is used in the login surface. The generated visual assets are deliberately limited to the brand rail texture, architectural panel art, decorative motif, and compact app mark.


## Password recovery behavior

The current MMNext-Auth server source uses the OpenAuth `PasswordProvider` with `PasswordUI` to email a verification code; it does not store a conventional password or expose a standalone password-reset endpoint. The login page therefore presents **Forgot password?** as an account-recovery action that opens the same secure email-code authorization flow with `provider=password`, `prompt=login`, and PKCE. The server must have a real email delivery provider configured in `sendCode`; logging the code is suitable only for local testing.


## Full-stack File Storage

This project now runs on the full-stack web-db-user scaffold with Express, tRPC, Drizzle, Manus OAuth context, and built-in S3-compatible storage helpers. The protected `/files` route provides a Green Ledger upload workspace for JPG, PNG, WebP, and PDF files up to 8 MB.

Uploaded bytes are sent to the server, written with `storagePut()` to built-in object storage, and only the metadata reference (`fileKey`, URL, MIME type, size, owner, and timestamp) is stored in the `stored_files` database table. The list procedure is protected and filters records by the signed-in user ID. No manual S3 credentials are required because the platform injects the storage configuration.

Before using `/files` in production, verify that Manus OAuth is configured and that the signed-in user session is available. The schema migration creates `users` and `stored_files`; it has been applied to the project database. The upload route intentionally has no delete operation because the storage layer does not expose a delete helper in this template.


### Required configuration

| Variable or configuration | Required | Purpose |
|---|---:|---|
| `DATABASE_URL` | Yes | MySQL/TiDB connection used for users and stored file metadata. |
| `JWT_SECRET` | Yes | Session cookie signing for the full-stack auth context. |
| `VITE_APP_ID` | Yes | Manus OAuth application identifier. |
| `OAUTH_SERVER_URL` | Yes | OAuth backend base URL. |
| `VITE_OAUTH_PORTAL_URL` | Yes | Frontend OAuth sign-in portal. |
| `BUILT_IN_FORGE_API_URL` | Platform-provided | Server-side storage presign API endpoint. |
| `BUILT_IN_FORGE_API_KEY` | Platform-provided | Server-side authorization for built-in storage. |

Do not commit `.env` files or manually expose server-side storage credentials. Configure the OAuth callback to include the deployed `/api/oauth/callback` URL, then open `/files` after authentication. The File Storage screen uses the platform-provided storage helpers and does not require a separate S3 bucket or access key.


## Cloudflare deployment guide

### Recommended architecture

The browser bundle can be deployed to Cloudflare Pages from the GitHub `main` branch. The full-stack server bundle must remain available at a server runtime because it provides Express, tRPC, Manus OAuth callback handling, Drizzle/MySQL access, and the built-in storage proxy. Set `VITE_API_BASE_URL` to that backend origin so the Pages frontend sends `/api/trpc` traffic to the full-stack server. Cloudflare Pages is not a drop-in replacement for the current MySQL-backed Express runtime without a separate Workers adapter and database migration.

Cloudflare’s Git integration supports GitHub repositories and can automatically deploy pushes to the selected production branch. The Pages build settings for the frontend are:

| Setting | Value |
|---|---|
| Framework preset | React (Vite) or None |
| Root directory | `/` |
| Build command | `pnpm build` |
| Build output directory | `dist/public` |
| Production branch | `main` |
| Node version | `22` |

The repository includes `wrangler.pages.toml` and a Bitbucket pipeline that deploys `dist/public` with Wrangler. Cloudflare Pages also supports the same output directory through the dashboard’s Git integration settings. The build directory and command convention are consistent with Cloudflare’s React/Vite guidance [1].

### Cloudflare Pages environment variables

Set these in **Workers & Pages → your Pages project → Settings → Environment variables** for both Preview and Production where applicable:

| Variable | Example | Purpose |
|---|---|---|
| `VITE_AUTH_SERVER_URL` | `https://auth.example.com` | MMNext-Auth authorization and token endpoint. |
| `VITE_MMNEXT_CLIENT_ID` | `mmnext-pos-web` | OAuth client registered with MMNext-Auth. |
| `VITE_AUTH_REDIRECT_URI` | `https://pos.example.com/auth/callback` | Exact OAuth callback used by the deployed frontend. |
| `VITE_API_BASE_URL` | `https://api.example.com` | Full-stack server origin for tRPC requests. |

Do not put `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_KEY`, or other server-only secrets into Pages `VITE_*` variables. Configure those on the backend runtime as encrypted secrets/environment variables. Cloudflare’s documentation recommends secrets rather than plaintext variables for sensitive values [2].

### GitHub Pages setup

1. Open **Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git**.
2. Authorize GitHub and select `thihakyaw-leo/MMNext-Auth`.
3. Select `main` as the production branch.
4. Use the build settings shown above and add the four `VITE_*` variables.
5. Save and deploy. Every subsequent push to `main` will trigger a production deployment; other branches can be used for preview deployments [3].
6. Add the final Pages domain to the MMNext-Auth client’s allowed redirect URIs. The callback must match the deployed URL exactly, including `/auth/callback`.
7. Add the custom domain under **Pages → Custom domains**, then update the OAuth redirect URI and `VITE_AUTH_REDIRECT_URI` to the custom domain.

### Bitbucket pipeline setup

If Bitbucket remains the deployment runner, add `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT`, `VITE_AUTH_SERVER_URL`, `VITE_MMNEXT_CLIENT_ID`, `VITE_AUTH_REDIRECT_URI`, and `VITE_API_BASE_URL` as repository variables. The existing `bitbucket-pipelines.yml` installs dependencies, builds the project, and runs `wrangler pages deploy dist/public --config wrangler.pages.toml` on `main`.

### Backend requirements

The full-stack API origin must serve the following paths over HTTPS: `/api/trpc`, `/api/oauth/callback`, `/manus-storage/*`, and the production frontend fallback/static route if it also serves the application. It must allow the Pages origin in CORS/session configuration and must use a production `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY`. Cloudflare Workers can run Express with the `nodejs_compat` flag, but converting this MySQL-backed server to Workers requires an explicit adapter and a compatible database strategy; the current repository does not silently claim that conversion [4].

### References

[1]: https://developers.cloudflare.com/pages/configuration/build-configuration/ "Cloudflare Pages build configuration"
[2]: https://developers.cloudflare.com/workers/configuration/environment-variables/ "Cloudflare Workers environment variables and secrets"
[3]: https://developers.cloudflare.com/pages/get-started/git-integration/ "Cloudflare Pages Git integration"
[4]: https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/ "Deploy an Express.js application on Cloudflare Workers"


### Cloudflare Workers configuration from build logs

If the Cloudflare project is configured as a **Worker** rather than a Pages project, use the repository’s `wrangler.jsonc` explicitly. It defines the Worker name `mmnext-pos`, the `nodejs_compat` compatibility flag, SPA fallback handling, and the `dist/public` asset directory. This prevents Wrangler from attempting an interactive Vite auto-setup during a non-interactive deployment. The Worker asset configuration deploys the browser frontend; the Express/tRPC/MySQL backend still needs a compatible server runtime and must be exposed through `VITE_API_BASE_URL`.

The build log’s analytics warnings were caused by optional `%VITE_ANALYTICS_ENDPOINT%` and `%VITE_ANALYTICS_WEBSITE_ID%` placeholders. They have been removed from `client/index.html`, so those variables are no longer required for a clean Cloudflare build.
