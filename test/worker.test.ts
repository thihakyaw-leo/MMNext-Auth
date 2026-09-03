import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

// Test suite for MMNext Auth Server - using minimal test worker
describe("MMNext Auth Server - Basic Tests", () => {
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

	// Test 5: Verify CORS headers are not blocking (basic check)
	it("handles preflight requests gracefully", async () => {
		const response = await SELF.fetch("https://example.com/health", {
			method: "OPTIONS",
		});
		// Should not crash - any valid response is fine
		expect(response.status).toBeLessThan(500);
	});
});
