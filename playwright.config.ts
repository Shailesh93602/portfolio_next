import { defineConfig, devices } from "@playwright/test";

// Port 3000 is frequently occupied by another app on a dev machine, which
// silently points the whole suite at the wrong site (every assertion then
// fails for the wrong reason). Pin the target explicitly:
//   PLAYWRIGHT_PORT=3230 npx playwright test
// and the config drives both the baseURL and the auto-started dev server
// from the same value, so they can never drift apart.
const PORT = process.env.PLAYWRIGHT_PORT ?? "3000";
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  // Set PLAYWRIGHT_NO_SERVER=1 when you have already started the server
  // yourself (e.g. `next start -p 3230` against a production build) — the
  // asset + a11y gates should run against the prod build, not `next dev`.
  // Or let Playwright start it and set PLAYWRIGHT_WEB_SERVER_COMMAND to the
  // command to run (CI's e2e job builds first, then passes `next start`), so
  // the readiness wait and the port stay in one place.
  webServer: process.env.PLAYWRIGHT_NO_SERVER
    ? undefined
    : {
        command:
          process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ??
          `npm run dev -- -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
