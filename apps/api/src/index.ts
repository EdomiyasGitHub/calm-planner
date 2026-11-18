import { Hono } from "hono";
import { cors } from "hono/cors";
import { API_VERSION, APP_NAME } from "@calm/core";

/** Origins the Android app (Capacitor WebView) uses. The web app is same-origin and needs no CORS. */
export const APP_ORIGINS = ["https://localhost", "capacitor://localhost", "http://localhost"];

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  APP_ENV: string;
}

export const app = new Hono<{ Bindings: Env }>();

const api = new Hono<{ Bindings: Env }>();

api.use(
  "*",
  cors({
    origin: APP_ORIGINS,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-App-Version"],
    maxAge: 86400,
  }),
);

api.get("/health", async (c) => {
  let db: "ok" | "error" = "ok";
  let schemaVersion: string | null = null;
  try {
    const row = await c.env.DB.prepare("SELECT value FROM app_meta WHERE key = ?")
      .bind("schema_version")
      .first<{ value: string }>();
    schemaVersion = row?.value ?? null;
  } catch (err) {
    console.error("health: database check failed", err);
    db = "error";
  }

  const body = {
    app: APP_NAME,
    api: API_VERSION,
    env: c.env.APP_ENV,
    db,
    schemaVersion,
    time: new Date().toISOString(),
  };
  return c.json(body, db === "ok" ? 200 : 503);
});

app.route(`/api/${API_VERSION}`, api);

app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) return c.json({ error: "not_found" }, 404);
  // Anything else is a web route: hand it to the static assets (SPA fallback).
  return c.env.ASSETS.fetch(c.req.raw);
});

app.onError((err, c) => {
  console.error("unhandled", err);
  return c.json({ error: "internal" }, 500);
});

export default app;
