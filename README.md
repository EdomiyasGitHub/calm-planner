# Calm Planner (working title)

A calm, predictable personal planner: type a task in plain language and a deterministic engine finds a realistic time for it. Web app + Android app from one TypeScript codebase, running on Cloudflare's free plan.

The full plan lives in the **Build & Deploy Handbook**. This README covers running the code.

## Structure

```
apps/web      React + Vite app (also the Android app via Capacitor, in apps/web/android)
apps/api      Cloudflare Worker (Hono): serves the web files and /api/*, uses D1
packages/core Pure domain logic shared by web and API
docs/adr      Architecture decision records
```

## Requirements

- Node.js 22+ with Corepack (`corepack enable` gives you pnpm)
- Android Studio (for the Android app only)

## Run locally

```bash
corepack enable
pnpm install
pnpm --filter api db:migrate:local   # create the local database
pnpm --filter web build              # the Worker serves this build
pnpm dev                             # web on http://localhost:5173, API on :8787
```

Open http://localhost:5173. The "System check" card should say **Database ready (schema 1)**.

## Checks

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm check        # all three
```

## Deploy (first time)

1. `pnpm --filter api exec wrangler login`
2. `pnpm --filter api exec wrangler d1 create calm-planner-prod` and paste the printed `database_id` into `apps/api/wrangler.jsonc`.
3. `pnpm build && pnpm --filter api db:migrate:remote && pnpm --filter api deploy`
4. Note the printed `https://calm-planner.<account>.workers.dev` URL and open `/api/v1/health`.

After that, GitHub Actions deploys on every push to `main`. Add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, and a repository variable `PRODUCTION_URL` (the workers.dev URL).

## Android smoke test

```bash
cd apps/web
VITE_API_BASE=https://calm-planner.<account>.workers.dev pnpm android:sync
pnpm android:open     # opens Android Studio
```

In Android Studio, plug in your phone (USB debugging on) and press Run. The app should open and show **Database ready**.

> The Android app's `appId` (`com.calmplanner.app` in `apps/web/capacitor.config.ts`) can't change after the first Play Store upload. Set the final one before Phase 11.
