import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";

/**
 * Mobile horizontal-scroll gate.
 *
 * Every page on this site used to swipe a full screen sideways on a phone. The
 * cause was the mobile nav drawer: `fixed inset-0` parked at `translate-x-full`
 * when closed, so it sat exactly one viewport to the right and the document's
 * scrollWidth came out at exactly 2x the viewport.
 *
 * Two earlier attempts to fix it did not hold, which is why this test exists in
 * this shape. Both failed for the same reason — they clamped `overflow-x` on
 * `html`/`body`, and a `position: fixed` element is attached to the viewport, so
 * no ancestor's overflow can clip it. (Worse, setting `overflow-x` on `body`
 * alone gets propagated to the viewport, leaving body's own used value
 * `visible` — the declaration was applying to an element that had been told to
 * stop honouring it.) The real fix makes the drawer `absolute` inside a `fixed`
 * clipping wrapper, so the wrapper becomes its containing block.
 *
 * The assertion is deliberately on OBSERVED SCROLL, not just on scrollWidth: a
 * page can report a wide scrollWidth and still be unscrollable, and it is the
 * scrolling a user's thumb does that matters.
 */

const MOBILE = { width: 390, height: 844 };

test.describe("mobile: no horizontal scroll", () => {
  test.use({ viewport: MOBILE });

  for (const route of ALL_ROUTES) {
    test(`${route} does not scroll sideways at ${MOBILE.width}px`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});

      const result = await page.evaluate(() => {
        const viewportWidth = document.documentElement.clientWidth;
        // Try to scroll right as far as possible, then read where we ended up.
        window.scrollTo(99999, 0);
        const scrolledX = window.scrollX;
        window.scrollTo(0, 0);
        return {
          viewportWidth,
          scrollWidth: document.documentElement.scrollWidth,
          scrolledX,
        };
      });

      expect(
        result.scrolledX,
        `page scrolled ${result.scrolledX}px sideways — a user can swipe the layout off-screen`,
      ).toBe(0);

      // 1px of slack for sub-pixel rounding on fractional layouts.
      expect(
        result.scrollWidth,
        `scrollWidth ${result.scrollWidth} exceeds viewport ${result.viewportWidth}`,
      ).toBeLessThanOrEqual(result.viewportWidth + 1);
    });
  }

  test("the nav drawer still opens, and still closes", async ({ page }) => {
    // The fix must not have been achieved by breaking the drawer — the cheapest
    // way to stop an off-screen element overflowing is to stop rendering it.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const openButton = page.getByRole("button", { name: /open menu/i });
    await expect(openButton).toBeVisible();
    await openButton.click();

    const drawerLink = page.getByRole("link", { name: "Portfolio", exact: true });
    await expect(drawerLink).toBeVisible();

    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(drawerLink).toBeHidden();

    // And closing it must not have reintroduced the overflow.
    const scrolledX = await page.evaluate(() => {
      window.scrollTo(99999, 0);
      const x = window.scrollX;
      window.scrollTo(0, 0);
      return x;
    });
    expect(scrolledX, "closing the drawer reintroduced horizontal scroll").toBe(0);
  });
});
