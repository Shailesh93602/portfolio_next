import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * No page may scroll sideways on a phone.
 *
 * This is the defect a real user meets first and reports never: the page drifts
 * horizontally under the thumb, content sits half off-screen, and it reads as
 * "the site is broken" rather than as a bug worth describing.
 *
 * It was real here on four routes, and it was invisible to every existing gate.
 * The a11y audit passed, every page returned 200, and no ELEMENT was wider than
 * the viewport — the two causes were a grid child without `min-width: 0` and
 * long code lines painting outside a `pre` with `overflow: visible`, neither of
 * which shows up in `getBoundingClientRect()` or in `element.scrollWidth`.
 * Only the document's own scrollWidth moves, which is exactly what this asserts.
 *
 * 390px is the iPhone SE / 12 mini width — the narrowest mainstream phone, so
 * passing here means passing on wider ones.
 */

const MOBILE = { width: 390, height: 844 };

test.describe("mobile layout integrity", () => {
  test.use({ viewport: MOBILE });

  for (const route of ALL_ROUTES) {
    test(`${route} does not scroll horizontally at 390px`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const { scrollWidth, clientWidth, widest } = await page.evaluate(() => {
        const doc = document.documentElement;
        // Name the widest offender so a failure is actionable rather than a
        // number. Clipped descendants are excluded: their rect extends past the
        // viewport by design and they are not what makes the page scroll.
        let widest = "";
        let max = doc.clientWidth;
        for (const el of document.querySelectorAll("*")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          if (r.right > max && r.right <= doc.scrollWidth + 1) {
            max = r.right;
            widest = `${el.tagName}.${String(el.className || "").slice(0, 60)}`;
          }
        }
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          widest,
        };
      });

      expect(
        scrollWidth,
        `${route} overflows by ${scrollWidth - clientWidth}px${widest ? ` — widest: ${widest}` : ""}`
      ).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});
