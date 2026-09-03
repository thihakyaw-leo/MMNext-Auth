import { defineWorkersProject } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersProject({
	test: {
		poolOptions: {
			workers: {
				singleWorker: true,
				wrangler: {
					configPath: "./wrangler.json",
				},
				miniflare: {
					// Bind D1 and KV for testing
					d1Databases: ["AUTH_DB"],
					kvNamespaces: ["AUTH_STORAGE"],
					compatibilityFlags: ["nodejs_compat"],
					compatibilityDate: "2024-09-09",
				},
				// Use test worker for testing
				main: "./test/test-worker.ts",
			},
		},
		include: ["test/worker.test.ts"],
	},
});
