export interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
}

export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  run(): Promise<{ success: boolean; meta?: Record<string, unknown> }>;
}

export interface D1Database {
  prepare(query: string): D1Statement;
  batch<T = Record<string, unknown>>(statements: D1Statement[]): Promise<D1Result<T>[]>;
}

export interface R2Object {
  body: ReadableStream;
  httpEtag?: string;
  httpMetadata?: { contentType?: string; contentLanguage?: string; contentDisposition?: string; cacheControl?: string };
}

export interface R2Bucket {
  put(key: string, value: ArrayBuffer | ArrayBufferView | string | ReadableStream | Blob, options?: { httpMetadata?: { contentType?: string } }): Promise<R2Object>;
  get(key: string): Promise<R2Object | null>;
  delete(key: string): Promise<void>;
}

export interface CloudflareEnv {
  DB?: D1Database;
  CACHE?: KVNamespaceLike;
  FILES?: R2Bucket;
}

export interface KVNamespaceLike {
  get<T = unknown>(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<T | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

declare global {
  // The Cloudflare adapter sets this for request-scoped access. Node development leaves it unset.
  var __MMNEXT_CLOUDFLARE_ENV: CloudflareEnv | undefined;
}

export function getCloudflareEnv(): CloudflareEnv | undefined {
  return globalThis.__MMNEXT_CLOUDFLARE_ENV;
}

export function setCloudflareEnv(env: CloudflareEnv | undefined): void {
  globalThis.__MMNEXT_CLOUDFLARE_ENV = env;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const cache = getCloudflareEnv()?.CACHE;
  return cache ? cache.get<T>(key, "json") : null;
}

export async function cachePut(key: string, value: unknown, expirationTtl = 3600): Promise<void> {
  const cache = getCloudflareEnv()?.CACHE;
  if (cache) await cache.put(key, JSON.stringify(value), { expirationTtl });
}

export async function cacheDelete(key: string): Promise<void> {
  const cache = getCloudflareEnv()?.CACHE;
  if (cache) await cache.delete(key);
}

export type { CloudflareEnv as RuntimeEnv };

export {};
