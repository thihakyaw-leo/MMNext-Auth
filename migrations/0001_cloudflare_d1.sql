-- Cloudflare D1 schema for MMNext-Auth.
-- Apply locally with: pnpm wrangler d1 migrations apply MMNEXT_DB --local
-- Apply remotely with: pnpm wrangler d1 migrations apply MMNEXT_DB --remote

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  openId TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  loginMethod TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  lastSignedIn TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stored_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ownerId INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fileName TEXT NOT NULL,
  fileKey TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  sizeBytes INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS stored_files_owner_created_idx
  ON stored_files(ownerId, createdAt DESC);
