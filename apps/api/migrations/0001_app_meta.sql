-- Phase 0: a tiny table that proves migrations ran.
CREATE TABLE IF NOT EXISTS app_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR REPLACE INTO app_meta (key, value) VALUES ('schema_version', '1');
