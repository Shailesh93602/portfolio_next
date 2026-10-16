import React from "react";
import { render } from "@testing-library/react";

import sitemap from "@/app/sitemap";
import routeModified from "@/lib/route-modified.json";
import { STATIC_ROUTES } from "@/e2e/routes";
import { SITE_URL } from "@/lib/blog-constants";
import StatusPulsePrivacy from "@/app/statuspulse/privacy/page";

/**
 * e2e/routes.ts feeds the asset, a11y, meta and mobile-overflow browser specs.
 * A page missing from it is checked by none of them, which is how the four
 * /statuspulse pages shipped untested and outside the sitemap.
 */
describe("every static route is covered", () => {
  it("includes the StatusPulse pages the Marketplace listing links to", () => {
    for (const r of [
      "/statuspulse",
      "/statuspulse/privacy",
      "/statuspulse/terms",
      "/statuspulse/contact",
    ]) {
      expect(STATIC_ROUTES).toContain(r);
    }
  });

  it.each(STATIC_ROUTES.map((r) => [r]))(
    "%s has a git-derived date in lib/route-modified.json",
    (route) => {
      const dates = routeModified as Record<string, string | null>;
      expect(dates[route]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  );

  it("the sitemap lists every static route", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    for (const r of STATIC_ROUTES) {
      expect(urls).toContain(`${SITE_URL}${r}`);
    }
  });
});

describe("/statuspulse/privacy on a phone", () => {
  it("lets long inline URLs wrap instead of widening the page", () => {
    const { container } = render(<StatusPulsePrivacy />);
    const longest = Array.from(container.querySelectorAll("code")).find((c) =>
      c.textContent?.includes("/statuspulse/icon-144.png")
    );
    expect(longest).toBeDefined();
    expect(longest!.className).toMatch(/\bbreak-all\b/);
  });
});
