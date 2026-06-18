/**
 * Visual UX audit harness (same pattern as the other repos).
 * Renders every page at desktop + mobile in light + dark, scroll-triggers
 * animations/lazy images, full-page screenshots + per-page console/network
 * capture. Reviewed by eye. Output: /tmp/portfolio-ux/<route>__<vp>[__dark].png
 */
import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = "/tmp/portfolio-ux";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const ROUTES = [
  "/",
  "/about",
  "/portfolio",
  "/portfolio/holdfast",
  "/blogs",
  "/blog/best-practices-api-development-express-nestjs",
  "/contact",
  "/hire",
  "/now",
  "/statistics",
];

type Capture = {
  route: string;
  viewport: string;
  theme: string;
  file: string;
  finalUrl: string;
  errors: string[];
  failedRequests: string[];
};
const manifest: Capture[] = [];

async function shoot(
  browser: import("@playwright/test").Browser,
  route: string,
  theme: "light" | "dark",
  onlyViewports?: string[],
) {
  for (const vp of VIEWPORTS) {
    if (onlyViewports && !onlyViewports.includes(vp.name)) continue;
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: theme,
    });
    await ctx.addInitScript((t) => {
      try {
        globalThis.localStorage.setItem("theme", t as string);
      } catch {
        /* ignore */
      }
    }, theme);
    const page = await ctx.newPage();
    const errors: string[] = [];
    const failedRequests: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error")
        errors.push(`console: ${m.text().slice(0, 240)}`);
    });
    page.on("response", (r) => {
      const u = r.url();
      if (r.status() >= 400 && !u.includes("/_next/") && !u.includes("favicon"))
        failedRequests.push(`${r.status()} ${u.split("?")[0]}`);
    });

    await page.goto(route, { waitUntil: "load", timeout: 30000 }).catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page
      .evaluate(async () => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 400) {
          globalThis.scrollTo(0, y);
          await sleep(120);
        }
        globalThis.scrollTo(0, document.body.scrollHeight);
        await sleep(400);
        globalThis.scrollTo(0, 0);
        await sleep(300);
      })
      .catch(() => {});
    await page.waitForTimeout(1200);

    const slug =
      route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "_");
    const suffix = theme === "dark" ? `__${vp.name}__dark` : `__${vp.name}`;
    const file = path.join(OUT, `${slug}${suffix}.png`);
    await page.screenshot({ path: file, fullPage: true }).catch(() => {});

    manifest.push({
      route,
      viewport: vp.name,
      theme,
      file,
      finalUrl: page.url(),
      errors: [...new Set(errors)],
      failedRequests: [...new Set(failedRequests)],
    });
    await ctx.close();
  }
}

test("capture all pages", async ({ browser }) => {
  test.setTimeout(900000);
  fs.mkdirSync(OUT, { recursive: true });
  for (const r of ROUTES) await shoot(browser, r, "light");
  // Dark-mode pass (desktop) for every page.
  for (const r of ROUTES) await shoot(browser, r, "dark", ["desktop"]);
  fs.writeFileSync(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  for (const c of manifest) {
    if (c.errors.length || c.failedRequests.length) {
      console.log(`[UX] ${c.route} (${c.viewport}/${c.theme})`);
      c.errors.slice(0, 3).forEach((e) => console.log(`     ${e}`));
      c.failedRequests.slice(0, 3).forEach((f) => console.log(`     ${f}`));
    }
  }
});
