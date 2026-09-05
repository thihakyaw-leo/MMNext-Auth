

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
