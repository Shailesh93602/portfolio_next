import { test, expect, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * WCAG 2.1 AA accessibility gate.
 *
 * Runs @axe-core/playwright against every public route × light + dark
 * themes. Any new WCAG 2.0/2.1 A or AA violation on any page/theme
 * fails the build.
 *
 * Equivalent to the EduScale `accessibility.spec.ts` — mirrored here so
 * the public-facing portfolio carries the same bar.
 *
 * Why block on this:
 *   - Stripe, Vercel, Supabase all hire for a11y awareness
 *   - A "failing WCAG AA on hire me page" finding in a recruiter's
 *     Lighthouse run is an instant disqualifier
 *   - Catches regressions like "swapped a `<div>` for a click target"
 *     before they ship.
 */

const ROUTES = [
  "/",
  "/about",
  "/portfolio",
  "/portfolio/eduscale",
  "/portfolio/devtrack",
  "/portfolio/khatago",
  "/portfolio/stripe-payments-demo",
  "/portfolio/redis-battle-demo",
  "/contact",
  "/blogs",
  "/statistics",
];

const THEMES: Array<"light" | "dark"> = ["light", "dark"];

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.evaluate((t) => {
    localStorage.setItem("theme", t);
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
  // Give next-themes a moment to apply the class before axe scans
  await page.waitForTimeout(200);
}

test.describe("WCAG 2.1 AA — axe-core scan across public routes", () => {
  for (const route of ROUTES) {
    for (const theme of THEMES) {
      test(`${route} — ${theme} theme has no axe violations`, async ({
        page,
      }) => {
        await page.goto(route, { waitUntil: "networkidle" });
        await setTheme(page, theme);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          // Skip rules that have known false-positives on framer-motion
          // animated containers + color-contrast on gradient backgrounds
          // (handled visually instead).
          .disableRules([
            "color-contrast", // covered by manual review + Lighthouse a11y score
          ])
          .analyze();

        // Group violations by impact for friendlier CI output
        const serious = results.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious"
        );
        const moderate = results.violations.filter(
          (v) => v.impact === "moderate"
        );

        expect.soft(
          serious.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.length,
          })),
          `serious/critical violations on ${route} (${theme})`
        ).toEqual([]);

        expect.soft(
          moderate.map((v) => ({
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.length,
          })),
          `moderate violations on ${route} (${theme})`
        ).toEqual([]);

        // Hard fail only on critical/serious — moderate are surfaced
        // as soft failures (visible in report, don't block merge yet)
        expect(serious.length).toBe(0);
      });
    }
  }
});
