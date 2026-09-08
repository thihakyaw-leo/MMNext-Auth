import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, storedFiles, StoredFile, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { cacheDelete, cacheGet, cachePut, getCloudflareEnv } from "./_core/cloudflare";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); }
  }
  return _db;
}
function asDate(value: string | Date | null | undefined): Date { return value instanceof Date ? value : new Date(value ?? Date.now()); }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const d1 = getCloudflareEnv()?.DB;
  const role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  const now = new Date().toISOString();
  if (d1) {
    await d1.prepare(`INSERT INTO users (openId, name, email, loginMethod, role, lastSignedIn, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(openId) DO UPDATE SET name=excluded.name, email=excluded.email, loginMethod=excluded.loginMethod, role=excluded.role, lastSignedIn=excluded.lastSignedIn, updatedAt=excluded.updatedAt`)
      .bind(user.openId, user.name ?? null, user.email ?? null, user.loginMethod ?? null, role, user.lastSignedIn instanceof Date ? user.lastSignedIn.toISOString() : now, now).run();
    await cacheDelete(`user:${user.openId}`);
    return;
  }
  const db = await getDb();
  if (!db) return;
  await db.insert(users).values({ ...user, role, lastSignedIn: user.lastSignedIn ?? new Date() }).onDuplicateKeyUpdate({ set: { ...user, role, lastSignedIn: user.lastSignedIn ?? new Date() } });
}

export async function getUserByOpenId(openId: string) {
  const d1 = getCloudflareEnv()?.DB;
  if (d1) {
    const cached = await cacheGet<Record<string, unknown>>(`user:${openId}`);
    if (cached) {
      return { ...cached, id: Number(cached.id), createdAt: asDate(cached.createdAt as string), updatedAt: asDate(cached.updatedAt as string), lastSignedIn: asDate(cached.lastSignedIn as string) } as typeof users.$inferSelect;
    }
    const row = await d1.prepare("SELECT * FROM users WHERE openId = ? LIMIT 1").bind(openId).first<Record<string, unknown>>();
    if (!row) return undefined;
    const user = { ...row, id: Number(row.id), createdAt: asDate(row.createdAt as string), updatedAt: asDate(row.updatedAt as string), lastSignedIn: asDate(row.lastSignedIn as string) } as typeof users.$inferSelect;
    await cachePut(`user:${openId}`, user, 300);
    return user;
  }
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createStoredFile(file: Omit<StoredFile, "id" | "createdAt">) {
  const d1 = getCloudflareEnv()?.DB;
  if (d1) {
    const result = await d1.prepare("INSERT INTO stored_files (ownerId, fileName, fileKey, url, mimeType, sizeBytes) VALUES (?, ?, ?, ?, ?, ?) RETURNING *").bind(file.ownerId, file.fileName, file.fileKey, file.url, file.mimeType, file.sizeBytes).first<Record<string, unknown>>();
    if (!result) throw new Error("Failed to create stored file metadata");
    return { ...result, id: Number(result.id), ownerId: Number(result.ownerId), sizeBytes: Number(result.sizeBytes), createdAt: asDate(result.createdAt as string) } as StoredFile;
  }
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(storedFiles).values(file);
  return (await db.select().from(storedFiles).where(eq(storedFiles.fileKey, file.fileKey)).limit(1))[0];
}

export async function listStoredFiles(ownerId: number) {
  const d1 = getCloudflareEnv()?.DB;
  if (d1) {
    const result = await d1.prepare("SELECT * FROM stored_files WHERE ownerId = ? ORDER BY createdAt DESC").bind(ownerId).all<Record<string, unknown>>();
    return result.results.map(row => ({ ...row, id: Number(row.id), ownerId: Number(row.ownerId), sizeBytes: Number(row.sizeBytes), createdAt: asDate(row.createdAt as string) })) as StoredFile[];
  }
  const db = await getDb();
  return db ? db.select().from(storedFiles).where(eq(storedFiles.ownerId, ownerId)).orderBy(desc(storedFiles.createdAt)) : [];
}
