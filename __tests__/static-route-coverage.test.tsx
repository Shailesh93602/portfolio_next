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

// The Marketplace listing links this page, so it must match dwell/docs/privacy.md:
// the app reads the assignee (FIELDS in dwell/src/resolvers/jira.js), calls two
// endpoints under a broad scope, and Runs on Atlassian eligibility is unverified.
// The content checks the dwell repo's check:urls runs live are in
// __tests__/statuspulse-listing-pages.test.tsx.
function sectionText(container: HTMLElement, heading: string): string {
  const h2 = Array.from(container.querySelectorAll("h2")).find(
    (h) => h.textContent === heading
  );
  if (!h2) throw new Error(`no h2 "${heading}"`);
  let text = "";
  for (
    let el = h2.nextElementSibling;
    el && el.tagName !== "H2";
    el = el.nextElementSibling
  ) {
    text += el.textContent ?? "";
  }
  return text;
}

describe("/statuspulse/privacy matches what the app does", () => {
  it("lists the assignee among the fields read", () => {
    const { container } = render(<StatusPulsePrivacy />);
    const reads = sectionText(container, "What the app reads");
    expect(reads).toMatch(/creation date, assignee\s+display name/);
    expect(reads).not.toMatch(/same fields/);
  });

  it("discloses the breadth of read:jira-work and the two endpoints called", () => {
    const { container } = render(<StatusPulsePrivacy />);
    const perms = sectionText(container, "Permissions the app requests");
    expect(perms).toMatch(/grants more than StatusPulse uses/);
    expect(perms).toContain("POST /rest/api/3/search/jql");
    expect(perms).toContain("GET /rest/api/3/status");
  });

  it("is dated no earlier than the source policy that added personal-data reporting (17 Oct 2026)", () => {
    const { container } = render(<StatusPulsePrivacy />);
    const m = (container.textContent ?? "").match(
      /Last updated: ([A-Za-z]+ \d+, \d{4})/
    );
    expect(m).not.toBeNull();
    expect(new Date(m![1]).getTime()).toBeGreaterThanOrEqual(
      new Date("October 17, 2026").getTime()
    );
  });

  it("does not claim Runs on Atlassian eligibility", () => {
    const { container } = render(<StatusPulsePrivacy />);
    expect(container.textContent ?? "").not.toMatch(/qualifies for/i);
  });
});
