# Finishing Phase 0: your steps

Phase 0 is accepted when three things are true:

1. The app runs on your computer.
2. A push to GitHub publishes the app online automatically, and the GitHub checks pass.
3. The app opens on your Android phone and shows **Database ready**.

Do the parts in order; each builds on the one before. The Google Play Console account is **not** needed for Phase 0. Have it verified before Phase 5.

Commands are shown for macOS/Linux. Where Windows (PowerShell) differs, it's noted.

---

## Part A: Run it on your computer (about 20 minutes)

**Goal:** see the app in your browser, talking to a local copy of the server and database.

1. **Install the tools** (skip any you have):
   - Node.js 22 or newer: https://nodejs.org (the LTS version)
   - Git: https://git-scm.com
2. **Unzip** `calm-planner-phase0.zip` somewhere you keep projects, then open a terminal in the `calm-planner` folder.
3. **Turn on pnpm** (it ships with Node):
   ```bash
   corepack enable
   ```
4. **Install the project's libraries:**
   ```bash
   pnpm install
   ```
5. **Create the local database tables:**
   ```bash
   pnpm --filter api db:migrate:local
   ```
   You should see `0001_app_meta.sql ✅`.
6. **Build the web app once** (the local server needs a built copy to serve):
   ```bash
   pnpm --filter web build
   ```
7. **Start everything:**
   ```bash
   pnpm dev
   ```
8. **Open** http://localhost:5173 in your browser.

**Success looks like:** a "System check" card that says **API v1 · development** and **Database ready (schema 1)**, with four tabs at the bottom.

**If it says "Server unreachable":** the API part didn't start. Look in the terminal for an error from `wrangler`, and check that step 5 ran.

Stop the app with `Ctrl + C`. Also run the automated checks once:
```bash
pnpm check
```
All tests should pass.

---

## Part B: Put the code on GitHub (about 10 minutes)

**Goal:** your code is saved online, and GitHub runs the checks on every change.

1. On https://github.com, click **New repository**.
   - Name: `calm-planner`
   - Visibility: **Public** (GitHub's automated jobs are free for public repositories, and it's your portfolio)
   - Do **not** tick "Add a README" or any other option. The repository must be empty.
2. In your terminal, inside the `calm-planner` folder (replace `YOUR-USERNAME`):
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/calm-planner.git
   git push -u origin main
   ```
   The zip already contains the first commit, so there is nothing to commit first.
3. On GitHub, open the **Actions** tab.

**Success looks like:** a green tick on the **CI** job. The **Deploy** job will fail for now. That's expected, because Part C hasn't given it access to Cloudflare yet.

---

## Part C: Publish it online with Cloudflare (about 20 minutes)

**Goal:** the app has a public web address, and every push to GitHub updates it automatically.

### C1. First publish, by hand

1. Create a free account at https://dash.cloudflare.com/sign-up.
2. In your terminal, log in (a browser window opens; click **Allow**):
   ```bash
   pnpm --filter api exec wrangler login
   ```
3. Create the online database:
   ```bash
   pnpm --filter api exec wrangler d1 create calm-planner-prod
   ```
   It prints a `database_id` (a long code like `3f2a9c1e-...`). Copy it.
4. Open `apps/api/wrangler.jsonc`, find `"database_id": "00000000-0000-0000-0000-000000000000"`, and replace the zeros with your copied ID.
5. Create the tables online, then publish:
   ```bash
   pnpm build
   pnpm --filter api db:migrate:remote
   pnpm --filter api deploy
   ```
   The last command prints your address, like `https://calm-planner.YOUR-NAME.workers.dev`. Save it; you'll need it in C2 and Part D.
6. Open that address in your browser, and also `/api/v1/health` on it.

**Success looks like:** the same System check card as Part A, and the health page shows `"db":"ok"`.

7. Save the database ID change to GitHub:
   ```bash
   git add apps/api/wrangler.jsonc
   git commit -m "Set production database id"
   git push
   ```

### C2. Automatic publishing from GitHub

GitHub needs permission to publish to your Cloudflare account.

1. **Create a Cloudflare API token:** in the Cloudflare dashboard, go to **My Profile → API Tokens → Create Token**, choose the **Edit Cloudflare Workers** template, then **Add more** permissions: **Account → D1 → Edit**. Create it and copy the token (it's shown only once).
2. **Find your Account ID:** in the Cloudflare dashboard, open **Workers & Pages**. The Account ID is in the right-hand sidebar. Copy it.
3. **Add them to GitHub:** in your repository go to **Settings → Secrets and variables → Actions**.
   - On the **Secrets** tab, add `CLOUDFLARE_API_TOKEN` (the token) and `CLOUDFLARE_ACCOUNT_ID` (the ID).
   - On the **Variables** tab, add `PRODUCTION_URL` with your workers.dev address (no slash at the end).
4. **Test it:** make any small change (for example, add a line to `README.md`), then commit and push it.

**Success looks like:** in the **Actions** tab, both **CI** and **Deploy** show green ticks, and the Deploy job's last step ("Smoke test") prints the health result.

---

## Part D: Run it on your Android phone (about 30–45 minutes, most of it downloads)

**Goal:** the same app opens on your phone and reaches your online server.

1. **Install Android Studio** from https://developer.android.com/studio. On first launch, accept the default setup; it downloads the Android SDK (this takes a while).
2. **Prepare your phone:**
   - Settings → About phone → tap **Build number** 7 times to enable Developer options.
   - Settings → Developer options → turn on **USB debugging**.
   - Connect the phone to your computer with a USB cable and tap **Allow** on the phone's prompt.
3. **Build the app for Android**, pointing it at your online server (use your address from C1):

   macOS / Linux:
   ```bash
   cd apps/web
   VITE_API_BASE=https://calm-planner.YOUR-NAME.workers.dev pnpm android:sync
   pnpm android:open
   ```
   Windows (PowerShell):
   ```powershell
   cd apps/web
   $env:VITE_API_BASE="https://calm-planner.YOUR-NAME.workers.dev"; pnpm android:sync
   pnpm android:open
   ```
4. Android Studio opens the project. Wait for the "Gradle sync" bar at the bottom to finish (the first time takes several minutes).
5. At the top, choose your phone in the device menu, then press the green **Run** button.

**Success looks like:** the app opens on your phone with **Database ready (schema 1)**.

**If it says "Server unreachable":** check that you used your exact workers.dev address in step 3 with `https://` and no slash at the end, and that the phone has internet. Then run step 3 again.

---

## When you're done

Tell me which parts succeeded (and paste any error message). Once all four parts work, Phase 0 is accepted and we start Phase 1: core model and local task management.
