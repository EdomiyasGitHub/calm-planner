# ADR 0001: Stack and repository structure

- Status: Accepted
- Date: 2026-11-18

## Context

Personal portfolio project with a $0 running budget, no paid AI, one junior developer, Android-first with a desktop web app. See the Build & Deploy Handbook, sections 1, 4 and 15.

## Decision

- One TypeScript monorepo (pnpm workspaces): `packages/core`, `apps/web`, `apps/api`.
- `packages/core` holds all domain logic as pure functions with no UI, network or storage code.
- `apps/web` is a React + Vite app. The Android app is the same build wrapped with Capacitor.
- `apps/api` is one Cloudflare Worker (Hono) that serves both the static web files and `/api/*`, backed by Cloudflare D1.
- Build order: core logic, then web, then the Android wrap; screens designed mobile-first.

## Consequences

- One codebase and one deploy; web and API share an origin, so no CORS or cross-site cookies on the web.
- The Android app calls the API by absolute URL (`VITE_API_BASE`), so it needs token auth rather than cookies (Phase 5).
- Workers Free CPU limits mean heavy scheduling runs on the device, not the server.
