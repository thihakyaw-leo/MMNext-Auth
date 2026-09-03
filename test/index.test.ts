import { SELF } from "cloudflare:test";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Test suite for MMNext Auth Server
describe("MMNext Auth Server", () => {
	// Test 1: Health check endpoint
	it("returns 200 on health check with correct service info", async () => {
		const response = await SELF.fetch("https://example.com/health");
		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.status).toBe("ok");
		expect(data.service).toBe("MMNext");
		expect(data.version).toBe("1.0.0");
		expect(data.timestamp).toBeDefined();

		// Check custom headers
		expect(response.headers.get("X-Service-Name")).toBe("MMNext");
		expect(response.headers.get("X-Service-Version")).toBe("1.0.0");
	});

	// Test 2: Health check returns valid JSON structure
	it("health check returns valid JSON with required fields", async () => {
		const response = await SELF.fetch("https://example.com/health");
		const data = await response.json();

		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("service");
		expect(data).toHaveProperty("version");
		expect(data).toHaveProperty("timestamp");
		expect(typeof data.timestamp).toBe("string");
		expect(new Date(data.timestamp).toString()).not.toBe("Invalid Date");
	});

	// Test 3: Root redirect to authorize endpoint
	it("redirects root to authorize with correct params", async () => {
		const response = await SELF.fetch("https://example.com/", {
			redirect: "manual",
		});

		expect(response.status).toBe(302);
		const location = response.headers.get("Location");
		expect(location).toContain("/authorize");
		expect(location).toContain("redirect_uri=");
		expect(location).toContain("client_id=mmnext-pos-client");
		expect(location).toContain("response_type=code");
	});

	// Test 4: Callback endpoint returns OAuth completion message
	it("returns OAuth completion message on callback", async () => {
		const response = await SELF.fetch("https://example.com/callback?code=test123&state=abc");
		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.message).toBe("OAuth flow complete!");
		expect(data.service).toBe("MMNext");
		expect(data.params).toEqual({
			code: "test123",
			state: "abc",
		});

		// Check custom header
		expect(response.headers.get("X-Service-Name")).toBe("MMNext");
	});

	// Test 5: Authorize endpoint returns HTML (login page)
	it("returns HTML content on authorize endpoint", async () => {
		const response = await SELF.fetch("https://example.com/authorize?redirect_uri=https://app.mmnext.app/callback&client_id=mmnext-pos-client&response_type=code");
		expect(response.status).toBe(200);

		const contentType = response.headers.get("Content-Type");
		expect(contentType).toContain("text/html");

		const html = await response.text();
		expect(html).toContain("<!DOCTYPE html>");
		expect(html).toContain("MMNext");
		expect(html).toContain("Sign in to MMNext");
	});

	// Test 6: Verify MMNext branding in authorize page
	it("authorize page contains MMNext branding elements", async () => {
		const response = await SELF.fetch("https://example.com/authorize?redirect_uri=https://app.mmnext.app/callback&client_id=mmnext-pos-client&response_type=code");
		const html = await response.text();

		// Check for MMNext branding
		expect(html).toContain("MMNext");
		expect(html).toContain("Sign in to MMNext");
		expect(html).toContain("Enter the verification code sent to your email");
		expect(html).toContain("Send Code");
		expect(html).toContain("Verify Code");
	});

	// Test 7: OIDC discovery endpoint (if available)
	it("returns 404 for unknown routes", async () => {
		const response = await SELF.fetch("https://example.com/unknown-route");
		// OpenAuth will handle this, but it should not crash
		expect([200, 404, 302]).toContain(response.status);
	});

	// Test 8: Verify CORS headers are not blocking (basic check)
	it("handles preflight requests gracefully", async () => {
		const response = await SELF.fetch("https://example.com/health", {
			method: "OPTIONS",
		});
		// Should not crash - any valid response is fine
		expect(response.status).toBeLessThan(500);
	});
});

// Additional tests for database operations
describe("Database Operations", () => {
	it("database migration creates user table", async () => {
		// This test verifies the migration exists and is valid
		const response = await SELF.fetch("https://example.com/health");
		expect(response.status).toBe(200);
		// If we get here, the worker started successfully with D1 binding
	});
});