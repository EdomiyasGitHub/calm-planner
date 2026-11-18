import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { App } from "./App";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("App shell", () => {
  it("shows the four main tabs", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    render(<App />);
    for (const tab of ["Today", "Calendar", "Inbox", "Browse"]) {
      expect(screen.getByRole("button", { name: tab })).toBeTruthy();
    }
  });

  it("shows database status from the health check", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ app: "Calm Planner", api: "v1", env: "test", db: "ok", schemaVersion: "1", time: "" }),
      ),
    );
    render(<App />);
    expect(await screen.findByText(/Database ready \(schema 1\)/)).toBeTruthy();
  });

  it("shows an offline message when the server is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("network"))));
    render(<App />);
    expect(await screen.findByText(/Server unreachable/)).toBeTruthy();
  });
});
