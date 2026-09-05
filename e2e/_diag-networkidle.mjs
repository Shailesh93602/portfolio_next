// TEMPORARY CI diagnostic — removed before merge.
// /portfolio never reaches networkidle on the GitHub runner against `next
// start` (3/3 attempts) but does locally; this prints what is still in flight.
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const t0 = Date.now();
const open = new Map();
page.on("request", (r) => open.set(r, Date.now()));
page.on("requestfinished", (r) => {
  console.log(`done ${Date.now() - t0}ms ${r.resourceType()} ${r.url().slice(0, 140)}`);
  open.delete(r);
});
page.on("requestfailed", (r) => {
  console.log(`FAILED ${Date.now() - t0}ms ${r.url().slice(0, 140)} ${r.failure()?.errorText}`);
  open.delete(r);
});
await page.goto(base + "/portfolio", { waitUntil: "load" });
console.log("load at", Date.now() - t0, "ms");
try {
  await page.waitForLoadState("networkidle", { timeout: 20000 });
  console.log("networkidle at", Date.now() - t0, "ms");
} catch {
  console.log("NO networkidle after 20s; in flight:");
  for (const [r, t] of open)
    console.log(`  ${Date.now() - t}ms ${r.resourceType()} ${r.method()} ${r.url().slice(0, 200)}`);
}
await browser.close();
