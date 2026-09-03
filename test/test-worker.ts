// Minimal test worker for MMNext Auth - no OpenAuth dependencies
export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		// Health check endpoint
		if (url.pathname === "/health") {
			return Response.json({
				status: "ok",
				service: "MMNext",
				version: "1.0.0",
				timestamp: new Date().toISOString(),
			}, {
				headers: {
					"X-Service-Name": "MMNext",
					"X-Service-Version": "1.0.0",
				},
			});
		}

		// Demo redirect for testing
		if (url.pathname === "/") {
			url.searchParams.set("redirect_uri", url.origin + "/callback");
			url.searchParams.set("client_id", "mmnext-pos-client");
			url.searchParams.set("response_type", "code");
			url.pathname = "/authorize";
			return Response.redirect(url.toString());
		} else if (url.pathname === "/callback") {
			return Response.json({
				message: "OAuth flow complete!",
				service: "MMNext",
				params: Object.fromEntries(url.searchParams.entries()),
			}, {
				headers: {
					"X-Service-Name": "MMNext",
				},
			});
		}

		// Authorize endpoint - return simple HTML
		if (url.pathname === "/authorize") {
			return new Response(`
<!DOCTYPE html>
<html>
<head>
	<title>Sign in to MMNext</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		body { font-family: system-ui, sans-serif; max-width: 400px; margin: 2rem auto; padding: 0 1rem; }
		.card { border: 1px solid #dee2e6; border-radius: 8px; padding: 2rem; background: white; }
		h1 { color: #0d6efd; text-align: center; margin-bottom: 1.5rem; }
		.form-group { margin-bottom: 1rem; }
		label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
		input { width: 100%; padding: 0.5rem; border: 1px solid #dee2e6; border-radius: 4px; box-sizing: border-box; }
		button { width: 100%; padding: 0.75rem; background: #0d6efd; color: white; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
		button:hover { background: #0b5ed7; }
	</style>
</head>
<body>
	<div class="card">
		<h1>Sign in to MMNext</h1>
		<form method="POST">
			<div class="form-group">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" required placeholder="Enter your email">
			</div>
			<button type="submit">Send Code</button>
		</form>
		<p style="text-align: center; margin-top: 1rem; color: #6c757d;">
			Enter the verification code sent to your email
		</p>
	</div>
</body>
</html>
`, {
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		// Unknown route
		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
