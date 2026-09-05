/* Green Ledger direction: the public-client handoff uses PKCE and keeps tokens out of the URL after callback. */

type Credentials = { email: string; password: string };

const AUTH_SERVER_URL = (import.meta.env.VITE_AUTH_SERVER_URL || "https://auth.mmnext.app").replace(/\/$/, "");
const CLIENT_ID = import.meta.env.VITE_MMNEXT_CLIENT_ID || "mmnext-pos-web";

function toBase64Url(bytes: ArrayBuffer) {
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(bytes)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createVerifier() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes.buffer);
}

async function createChallenge(verifier: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return toBase64Url(digest);
}

export async function beginAuth({ email }: Credentials) {
  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  const state = crypto.randomUUID();
  const verifier = await createVerifier();
  const challenge = await createChallenge(verifier);
  sessionStorage.setItem("mmnext_auth_state", state);
  sessionStorage.setItem("mmnext_auth_verifier", verifier);
  sessionStorage.setItem("mmnext_auth_email", email);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    login_hint: email,
  });

  window.location.assign(`${AUTH_SERVER_URL}/authorize?${params.toString()}`);
}

export async function completeAuth(search: string) {
  const params = new URLSearchParams(search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const savedState = sessionStorage.getItem("mmnext_auth_state");
  const verifier = sessionStorage.getItem("mmnext_auth_verifier");
  if (!code || !returnedState || returnedState !== savedState || !verifier) throw new Error("Invalid authentication callback.");

  const redirectUri = import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`;
  const response = await fetch(`${AUTH_SERVER_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: CLIENT_ID, redirect_uri: redirectUri, code_verifier: verifier }),
  });
  if (!response.ok) throw new Error("Token exchange failed.");
  const tokens = await response.json();
  sessionStorage.setItem("mmnext_auth_tokens", JSON.stringify(tokens));
  sessionStorage.removeItem("mmnext_auth_state");
  sessionStorage.removeItem("mmnext_auth_verifier");
  return tokens;
}

export const authConfig = { issuer: AUTH_SERVER_URL, clientId: CLIENT_ID };
