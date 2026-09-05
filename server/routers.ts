/* Green Ledger direction: storage actions are protected, typed, and explicit about ownership and file limits. */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { createStoredFile, listStoredFiles } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

function safeFileName(fileName: string) {
  return fileName.trim().replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 160) || "upload";
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  files: router({
    list: protectedProcedure.query(({ ctx }) => listStoredFiles(ctx.user.id)),
    upload: protectedProcedure
      .input(z.object({
        fileName: z.string().min(1).max(255),
        mimeType: z.string().min(1).max(150),
        sizeBytes: z.number().int().positive().max(MAX_FILE_BYTES),
        contentBase64: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!allowedMimeTypes.has(input.mimeType)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Only JPG, PNG, WebP, and PDF files are supported." });
        }
        const bytes = Buffer.from(input.contentBase64, "base64");
        if (bytes.byteLength !== input.sizeBytes || bytes.byteLength > MAX_FILE_BYTES) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "The file size is invalid or exceeds 8 MB." });
        }
        const fileName = safeFileName(input.fileName);
        const { key, url } = await storagePut(`${ctx.user.id}-files/${fileName}`, bytes, input.mimeType);
        return createStoredFile({
          ownerId: ctx.user.id,
          fileName,
          fileKey: key,
          url,
          mimeType: input.mimeType,
          sizeBytes: bytes.byteLength,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
