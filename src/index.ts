import { issuer } from "@openauthjs/openauth";
import {
	CloudflareStorage,
	type CloudflareStorageOptions,
} from "@openauthjs/openauth/storage/cloudflare";
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { createSubjects } from "@openauthjs/openauth/subject";
import { object, string } from "valibot";

// This value should be shared between the OpenAuth server Worker and other
// client Workers that you connect to it, so the types and schema validation are
// consistent.
const subjects = createSubjects({
	user: object({
		id: string(),
		email: string(),
		name: string(),
	}),
});

// MMNext Brand Configuration
const MMNEXT_BRAND = {
	name: "MMNext",
	issuer: "https://auth.mmnext.app",
	theme: {
		title: "MMNext",
		primary: "#17365D",
		favicon: "https://auth.mmnext.app/favicon.ico",
		logo: {
			dark: "https://auth.mmnext.app/logo-dark.svg",
			light: "https://auth.mmnext.app/logo-light.svg",
		},
	},
};

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		// Health check endpoint
		if (url.pathname === "/health") {
			return Response.json({
				status: "ok",
				service: MMNEXT_BRAND.name,
				version: "1.0.0",
				timestamp: new Date().toISOString(),
			}, {
				headers: {
					"X-Service-Name": MMNEXT_BRAND.name,
					"X-Service-Version": "1.0.0",
				},
			});
		}

		// Demo redirect for testing (remove in production)
		if (url.pathname === "/") {
			url.searchParams.set("redirect_uri", url.origin + "/callback");
			url.searchParams.set("client_id", "mmnext-pos-client");
			url.searchParams.set("response_type", "code");
			url.pathname = "/authorize";
			return Response.redirect(url.toString());
		} else if (url.pathname === "/callback") {
			return Response.json({
				message: "OAuth flow complete!",
				service: MMNEXT_BRAND.name,
				params: Object.fromEntries(url.searchParams.entries()),
			}, {
				headers: {
					"X-Service-Name": MMNEXT_BRAND.name,
				},
			});
		}

		// The real OpenAuth server code starts here:
		return issuer({
			storage: CloudflareStorage({
				namespace: env.AUTH_STORAGE as CloudflareStorageOptions["namespace"],
			}),
			subjects,
			providers: {
				password: PasswordProvider(
					PasswordUI({
						// eslint-disable-next-line @typescript-eslint/require-await
						sendCode: async (email, code) => {
							// This is where you would email the verification code to the
							// user, e.g. using Resend:
							// https://resend.com/docs/send-with-cloudflare-workers
							console.log(`[${MMNEXT_BRAND.name}] Sending code ${code} to ${email}`);
						},
						copy: {
							input_code: "Enter the verification code sent to your email",
							title: "Sign in to MMNext",
							description: "Enter your email to receive a verification code",
							submit: "Send Code",
							verify: "Verify Code",
						},
					}),
				),
			},
			theme: MMNEXT_BRAND.theme,
			// Set the JWT issuer to MMNext
			issuer: MMNEXT_BRAND.issuer,
			success: async (ctx, value) => {
				const userId = await getOrCreateUser(env, value.email);
				return ctx.subject("user", {
					id: userId,
					email: value.email,
					name: value.email.split("@")[0], // Use email prefix as default name
				});
			},
		}).fetch(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;

async function getOrCreateUser(env: Env, email: string): Promise<string> {
	const result = await env.AUTH_DB.prepare(
		`
		INSERT INTO user (email)
		VALUES (?)
		ON CONFLICT (email) DO UPDATE SET email = email
		RETURNING id;
		`,
	)
		.bind(email)
		.first<{ id: string }>();
	if (!result) {
		throw new Error(`Unable to process user: ${email}`);
	}
	console.log(`[${MMNEXT_BRAND.name}] Found or created user ${result.id} with email ${email}`);
	return result.id;
}
