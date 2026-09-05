

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
