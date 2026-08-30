import sitemap from "@/app/sitemap";
import routeModified from "@/lib/route-modified.json";

/**
 * The sitemap must not claim pages changed when they did not.
 *
 * It used to set `lastModified: new Date()` on all nine static routes, so every
 * deploy asserted every page had changed that day. Against git that was wrong
 * by four months for /about and /contact. Google discounts lastModified on
 * sites where it never disagrees with the crawl date, so the false freshness
 * cost the field its value on the pages that HAD genuinely changed.
 */
describe("sitemap lastModified is real", () => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  it("has a date for every static route", () => {
    const dates = routeModified as Record<string, string | null>;
    for (const r of [
      "/",
      "/blogs",
      "/about",
      "/contact",
      "/portfolio",
      "/services",
      "/engineering",
      "/statistics",
      "/now",
    ]) {
      expect(dates[r]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("never dates a page in the future", async () => {
    const entries = await sitemap();
    const tomorrow = new Date(Date.now() + 86_400_000);
    for (const e of entries) {
      expect(new Date(e.lastModified as Date).getTime()).toBeLessThan(
        tomorrow.getTime()
      );
    }
  });

  it("does not mark every STATIC route as changed today", async () => {
    // The regression this guards is `new Date()` on the static routes.
    //
    // Scoped to static routes deliberately: an earlier version compared against
    // ALL entries and did not fail when the bug was reintroduced, because the
    // blog posts carry real dates and kept the total above the "today" count.
    // A test that does not fail on the defect it names is decoration.
    const entries = await sitemap();
    const staticPaths = Object.keys(routeModified).filter(
      (r) => !r.startsWith("__")
    );
    const staticEntries = entries.filter((e) =>
      staticPaths.includes(new URL(e.url).pathname)
    );
    expect(staticEntries.length).toBe(staticPaths.length);
    const today = staticEntries.filter(
      (e) => new Date(e.lastModified as Date) >= startOfToday
    );
    expect(today.length).toBeLessThan(staticEntries.length);
  });

  it("static routes match the committed git dates exactly", async () => {
    const entries = await sitemap();
    const dates = routeModified as Record<string, string>;
    for (const [route, day] of Object.entries(dates)) {
      if (route.startsWith("__")) continue;
      const path = route === "/" ? "/" : route;
      const entry = entries.find((e) => new URL(e.url).pathname === path);
      if (!entry) throw new Error(`no sitemap entry for ${route}`);
      expect(
        new Date(entry.lastModified as Date).toISOString().slice(0, 10)
      ).toBe(day);
    }
  });
});
