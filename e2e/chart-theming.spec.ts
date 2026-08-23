import { test, expect } from "@playwright/test";

/**
 * Chart theming on /statistics.
 *
 * The bug this locks out: the charts referenced `var(--color-primary)` and
 * `var(--color-muted-foreground)`, which are **not defined anywhere**. The
 * design tokens are `--primary` and `--muted-foreground`, and they hold raw HSL
 * triples that must be wrapped in `hsl()`.
 *
 * An undefined CSS variable does not error. The stroke falls back to the SVG
 * default — black — which is perfectly readable on the light canvas and
 * invisible on the dark one. So the bug was silent, theme-dependent, and
 * survived every existing test.
 *
 * These assert the resolved paint, not the source string, because a test that
 * only greps for `hsl(var(--primary))` would pass on a token that had been
 * renamed out from under it.
 */

test.describe("/statistics charts are theme-aware", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`chart strokes resolve to a real colour in ${theme} mode`, async ({
      page,
    }) => {
      await page.addInitScript((t) => {
        localStorage.setItem("theme", t);
      }, theme);
      await page.goto("/statistics", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});

      // Recharts renders after hydration; wait for an actual chart surface.
      const svg = page.locator("svg.recharts-surface").first();
      await expect(svg).toBeVisible({ timeout: 15_000 });

      const unresolved = await page.evaluate(() => {
        const bad: string[] = [];
        for (const el of document.querySelectorAll("svg.recharts-surface *")) {
          for (const attr of ["stroke", "fill"]) {
            const raw = el.getAttribute(attr);
            // An undefined custom property survives into the attribute
            // verbatim — that is the fingerprint of the original bug.
            if (raw && raw.includes("var(--color-"))
              bad.push(`${attr}="${raw}"`);
          }
        }
        return bad;
      });

      expect(
        unresolved,
        "an undefined CSS variable leaves var(--color-…) in the attribute and paints SVG-default black"
      ).toEqual([]);
    });
  }

  test("the donut does not clip on a phone", async ({ page }) => {
    // The donut used outer labels at radius 80 inside a 250px box, so on a
    // 390px viewport the left and right labels were cut off by the container.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/statistics", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});

    const pie = page.locator("svg.recharts-surface").last();
    await expect(pie).toBeVisible({ timeout: 15_000 });

    const overflow = await page.evaluate(() => {
      const surfaces = [...document.querySelectorAll("svg.recharts-surface")];
      const vw = document.documentElement.clientWidth;
      return surfaces
        .map((s) => s.getBoundingClientRect())
        .filter((r) => r.left < -1 || r.right > vw + 1).length;
    });
    expect(overflow, "a chart extends past the viewport on a phone").toBe(0);
  });
});
