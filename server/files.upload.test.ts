/* Green Ledger direction: storage validation protects the workspace before bytes reach object storage. */
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("files.upload", () => {
  const ctx = {
    user: { id: 7, openId: "storage-user", email: "storage@example.com", name: "Storage User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} },
    res: {} as TrpcContext["res"],
  } as TrpcContext;

  it("rejects unsupported mime types before storage upload", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.files.upload({ fileName: "script.exe", mimeType: "application/x-msdownload", sizeBytes: 4, contentBase64: "dGVzdA==" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects mismatched byte size", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.files.upload({ fileName: "receipt.png", mimeType: "image/png", sizeBytes: 99, contentBase64: "dGVzdA==" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
