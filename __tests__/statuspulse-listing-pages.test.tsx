import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import StatusPulseGuide from "@/app/statuspulse/page";
import StatusPulsePrivacy from "@/app/statuspulse/privacy/page";
import StatusPulseTerms from "@/app/statuspulse/terms/page";
import StatusPulseContact from "@/app/statuspulse/contact/page";
import DwellGuide from "@/app/dwell/page";
import DwellPrivacy from "@/app/dwell/privacy/page";

// The rules of dwell/scripts/check-listing-urls.mjs, which fetches these pages
// live; scopes from dwell/manifest.yml, endpoints from dwell/docs/privacy.md.
const SCOPES = ["read:jira-work", "storage:app", "report:personal-data"];
const ENDPOINTS = ["/rest/api/3/search/jql", "/rest/api/3/status"];

const PAGES: [
  string,
  () => React.ReactElement,
  { mustInclude: string[]; mustNotInclude?: string[] },
][] = [
  [
    "/statuspulse",
    StatusPulseGuide,
    {
      mustInclude: ["StatusPulse", "200 issues"],
      mustNotInclude: ["customized workdays", "any major timezone"],
    },
  ],
  [
    "/statuspulse/privacy",
    StatusPulsePrivacy,
    {
      mustInclude: [
        "StatusPulse",
        "assignee",
        "Clear my saved settings",
        ...SCOPES,
        ...ENDPOINTS,
      ],
    },
  ],
  ["/statuspulse/terms", StatusPulseTerms, { mustInclude: ["StatusPulse"] }],
  [
    "/statuspulse/contact",
    StatusPulseContact,
    { mustInclude: ["StatusPulse"] },
  ],
];

describe("StatusPulse pages pass the listing's URL check", () => {
  it.each(PAGES)("%s", (_route, Page, { mustInclude, mustNotInclude = [] }) => {
    const html = renderToStaticMarkup(<Page />).toLowerCase();
    expect(mustInclude.filter((s) => !html.includes(s.toLowerCase()))).toEqual(
      []
    );
    expect(
      mustNotInclude.filter((s) => html.includes(s.toLowerCase()))
    ).toEqual([]);
  });

  it("the guide lists the working weeks the app actually offers (dwell WEEK_OPTIONS)", () => {
    const html = renderToStaticMarkup(<StatusPulseGuide />);
    expect(html).toContain(
      "Saturday/Sunday, Friday/Saturday, Sunday only, or all seven days"
    );
    expect(html).not.toMatch(/Sun–Thu|Sat\/Sun only/);
  });

  it("no StatusPulse page uses the app's old name", () => {
    for (const [, Page] of PAGES) {
      expect(renderToStaticMarkup(<Page />)).not.toMatch(/\bdwell\b/i);
    }
  });
});

describe("the old /dwell pages forward to StatusPulse", () => {
  it.each([
    ["/dwell", DwellGuide, "/statuspulse"],
    ["/dwell/privacy", DwellPrivacy, "/statuspulse/privacy"],
  ])("%s permanently redirects to %s", (_from, Page, to) => {
    let thrown: unknown;
    try {
      Page();
    } catch (e) {
      thrown = e;
    }
    // next/navigation encodes the target and status in the thrown digest.
    const digest = (thrown as { digest?: string })?.digest ?? "";
    expect(digest.split(";")).toEqual(
      expect.arrayContaining(["NEXT_REDIRECT", to, "308"])
    );
  });
});
