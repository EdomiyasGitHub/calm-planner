import { describe, expect, it } from "vitest";
import { app, type Env } from "../src/index";

function fakeEnv(db: Partial<D1Database>): Env {
  return {
    DB: db as D1Database,
    ASSETS: { fetch: async () => new Response("asset") } as unknown as Fetcher,
    APP_ENV: "test",
  };
}

const workingDb = {
  prepare: () =>
    ({
      bind: () => ({ first: async () => ({ value: "1" }) }),
    }) as unknown as D1PreparedStatement,
};

const brokenDb = {
  prepare: () =>
    ({
      bind: () => ({
        first: async () => {
          throw new Error("D1_ERROR: daily limit exceeded");
        },
      }),
    }) as unknown as D1PreparedStatement,
};

describe("GET /api/v1/health", () => {
  it("reports ok with the schema version", async () => {
    const res = await app.request("/api/v1/health", {}, fakeEnv(workingDb));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ app: "Calm Planner", api: "v1", db: "ok", schemaVersion: "1" });
  });

  it("returns 503 when the database fails", async () => {
    const res = await app.request("/api/v1/health", {}, fakeEnv(brokenDb));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ db: "error" });
  });
});

describe("routing", () => {
  it("returns JSON 404 for unknown API routes", async () => {
    const res = await app.request("/api/v1/nope", {}, fakeEnv(workingDb));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "not_found" });
  });

  it("hands non-API routes to static assets", async () => {
    const res = await app.request("/today", {}, fakeEnv(workingDb));
    expect(await res.text()).toBe("asset");
  });
});
