# MMNext Auth System - Cloudflare Deployment Guide

## Overview
This guide covers deploying the MMNext Auth System to Cloudflare:
- **Frontend**: Cloudflare Pages (React/Vite SPA)
- **Backend**: Cloudflare Workers (tRPC + OAuth callbacks + D1 + R2)

## Prerequisites
- Cloudflare account
- GitHub repository connected to Cloudflare
- OAuth credentials from Google, GitHub, Microsoft
- MMNext-Auth server URL

---

## Step 1: Cloudflare Login

```bash
npx wrangler login
```
Complete the OAuth flow in your browser when prompted.

---

## Step 2: Create D1 Database

```bash
# Create the database
npx wrangler d1 create mmnext-auth-db

# Note the database_id from output and update wrangler.jsonc
```

Run migrations:
```bash
npx wrangler d1 migrations apply mmnext-auth-db --remote
```

---

## Step 3: Create KV Namespace

```bash
# Create KV namespace for caching
npx wrangler kv:namespace create CACHE

# Note the id and update wrangler.jsonc
```

---

## Step 4: Create R2 Bucket

```bash
# Create R2 bucket for file storage
npx wrangler r2 bucket create mmnext
```

---

## Step 5: Configure Worker Secrets

Set the following secrets using `wrangler secret put`:

```bash
# Required secrets
npx wrangler secret put DATABASE_URL          # D1 connection string (auto-set by binding)
npx wrangler secret put JWT_SECRET            # 32+ char random string for JWT signing
npx wrangler secret put OAUTH_SERVER_URL      # MMNext-Auth server URL (e.g., https://auth.mmnext.com)
npx wrangler secret put VITE_APP_ID           # Your app identifier
npx wrangler secret put BUILT_IN_FORGE_API_URL # Forge API URL
npx wrangler secret put BUILT_IN_FORGE_API_KEY # Forge API key

# Social OAuth providers
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put MICROSOFT_CLIENT_ID
npx wrangler secret put MICROSOFT_CLIENT_SECRET

# Optional
npx wrangler secret put OWNER_OPEN_ID         # Admin user's openId for initial access
```

---

## Step 6: Configure OAuth Redirect URIs

Update each provider's console with production callback URLs:

| Provider | Callback URL |
|----------|--------------|
| Google | `https://<your-worker>.workers.dev/oauth/callback/google` |
| GitHub | `https://<your-worker>.workers.dev/oauth/callback/github` |
| Microsoft | `https://<your-worker>.workers.dev/oauth/callback/microsoft` |

Also configure in MMNext-Auth server.

---

## Step 7: Deploy Worker

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy
```

Note the worker URL (e.g., `https://mmnext-auth.<subdomain>.workers.dev`)

---

## Step 8: Configure Cloudflare Pages

1. Go to Cloudflare Dashboard → Pages
2. Connect to GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `./dist/public`
   - **Root directory**: `/` (or `/client` if monorepo)

4. Add environment variables in Pages project settings:
   - `VITE_API_URL` = Worker URL (e.g., `https://mmnext-auth.xxx.workers.dev`)
   - `VITE_AUTH_REDIRECT_URI` = Production callback URL (e.g., `https://auth.mmnext.com/callback`)
   - `VITE_APP_ID` = Same as worker
   - `VITE_OAUTH_SERVER_URL` = MMNext-Auth server URL

---

## Step 9: Configure Custom Domains (Optional)

### Worker Custom Domain
1. Workers → your-worker → Settings → Triggers → Custom Domains
2. Add domain (e.g., `api.auth.mmnext.com`)

### Pages Custom Domain
1. Pages → your-project → Custom Domains
2. Add domain (e.g., `auth.mmnext.com`)

---

## Step 10: Verify Deployment

Test the following endpoints:
- `GET https://<worker>/health` - Health check
- `GET https://<worker>/oauth/callback/google?code=xxx&state=xxx` - OAuth callback
- `GET https://<pages-domain>/` - Frontend loads
- Social login buttons work on `/login` and `/register`

---

## Environment Variables Summary

### Worker (wrangler.jsonc vars + secrets)
| Variable | Type | Description |
|----------|------|-------------|
| `VITE_APP_ID` | var | App identifier |
| `OAUTH_SERVER_URL` | secret | MMNext-Auth server |
| `JWT_SECRET` | secret | JWT signing key (32+ chars) |
| `BUILT_IN_FORGE_API_URL` | secret | Forge API URL |
| `BUILT_IN_FORGE_API_KEY` | secret | Forge API key |
| `GOOGLE_CLIENT_ID` | secret | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | secret | Google OAuth |
| `GITHUB_CLIENT_ID` | secret | GitHub OAuth |
| `GITHUB_CLIENT_SECRET` | secret | GitHub OAuth |
| `MICROSOFT_CLIENT_ID` | secret | Microsoft OAuth |
| `MICROSOFT_CLIENT_SECRET` | secret | Microsoft OAuth |
| `OWNER_OPEN_ID` | secret | Admin user openId |

### Pages (Environment Variables)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Worker API URL |
| `VITE_AUTH_REDIRECT_URI` | OAuth callback URL |
| `VITE_APP_ID` | App identifier |
| `VITE_OAUTH_SERVER_URL` | MMNext-Auth server |

---

## Database Migrations

The project uses Drizzle ORM. Migrations are in `/migrations` directory.

To generate new migrations:
```bash
npm run db:push
```

To apply to remote D1:
```bash
npx wrangler d1 migrations apply mmnext-auth-db --remote
```

---

## Troubleshooting

### Worker fails to start
- Check `wrangler tail` for logs
- Verify all secrets are set
- Check D1 binding is correct

### OAuth callback fails
- Verify redirect URIs match exactly in provider consoles
- Check state parameter is being passed correctly
- Verify PKCE code_verifier matches

### Frontend can't connect to API
- Check `VITE_API_URL` in Pages env vars
- Verify CORS headers in worker
- Check worker is deployed and healthy

### Social login buttons don't appear
- Ensure build includes latest changes
- Check browser console for JS errors
- Verify icons are imported correctly

---

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build

# Database
npm run db:push                # Generate & run migrations locally
npx wrangler d1 execute mmnext-auth-db --remote --command="SELECT * FROM users"

# Deployment
npx wrangler deploy            # Deploy worker
npx wrangler pages deploy ./dist/public --project-name=mmnext-auth  # Deploy pages manually

# Logs
npx wrangler tail              # Live worker logs
npx wrangler tail --format=json  # JSON logs

# Secrets
npx wrangler secret list       # List all secrets
npx wrangler secret put NAME   # Set secret
npx wrangler secret delete NAME # Delete secret
```

---

## Support

For issues with:
- **Cloudflare**: Check Cloudflare Workers/Pages documentation
- **OAuth**: Verify provider console settings
- **Database**: Check D1/Drizzle migration status
- **Application**: Check worker logs via `wrangler tail`