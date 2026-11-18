import { API_VERSION } from "@calm/core";

/**
 * Base URL of the API. Empty on the web (same origin as the Worker).
 * The Android app sets VITE_API_BASE to the production Worker URL at build time.
 */
const API_BASE: string = import.meta.env.VITE_API_BASE ?? "";

export interface Health {
  app: string;
  api: string;
  env: string;
  db: "ok" | "error";
  schemaVersion: string | null;
  time: string;
}

export async function fetchHealth(signal?: AbortSignal): Promise<Health> {
  const res = await fetch(`${API_BASE}/api/${API_VERSION}/health`, signal ? { signal } : {});
  if (!res.ok && res.status !== 503) throw new Error(`Health check failed: ${res.status}`);
  return (await res.json()) as Health;
}
