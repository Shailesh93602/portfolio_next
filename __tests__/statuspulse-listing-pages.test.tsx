import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import StatusPulseGuide from "@/app/statuspulse/page";
import StatusPulsePrivacy from "@/app/statuspulse/privacy/page";
import StatusPulseTerms from "@/app/statuspulse/terms/page";
import StatusPulseContact from "@/app/statuspulse/contact/page";
import StatusPulseTroubleshooting from "@/app/statuspulse/troubleshooting/page";
import StatusPulseSwitching from "@/app/statuspulse/switching/page";
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
  [
    "/statuspulse/troubleshooting",
    StatusPulseTroubleshooting,
    { mustInclude: ["StatusPulse", "200 issues"] },
  ],
  [
    "/statuspulse/switching",
    StatusPulseSwitching,
    { mustInclude: ["StatusPulse", "nothing to import"] },
  ],
];

const text = (Page: () => React.ReactElement) => {
  const div = document.createElement("div");
  div.innerHTML = renderToStaticMarkup(<Page />);
  return (div.textContent ?? "").replace(/\s+/g, " ");
};

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

  it("the guide links the troubleshooting and switching pages", () => {
    const html = renderToStaticMarkup(<StatusPulseGuide />);
    expect(html).toContain('href="/statuspulse/troubleshooting"');
    expect(html).toContain('href="/statuspulse/switching"');
    // dwell/docs/user-guide.md: By issue shows this visit AND every visit.
    expect(text(StatusPulseGuide)).toMatch(
      /since it last arrived, the total of every visit/
    );
    expect(text(StatusPulseGuide)).toContain("Start from a preset");
  });

  it("troubleshooting quotes the messages the app actually shows", () => {
    // dwell/src/engine/jiraPaging.ts and dwell/src/resolvers/jira.js.
    const t = text(StatusPulseTroubleshooting);
    expect(t).toContain("Showing the first 200 issues");
    expect(t).toContain("Jira rejected the search");
    expect(t).toContain(
      "Could not read Jira's status list, so cycle time is not shown and a status renamed at some point may appear as two rows."
    );
    expect(t).toContain("No weekend — all seven days");
  });

  it("switching lists dwell's three presets and the all-visits column", () => {
    // dwell/src/engine/presets.ts PRESETS and src/frontend/report/tables.jsx.
    const t = text(StatusPulseSwitching);
    for (const s of [
      "Working hours, every issue (the StatusPulse default)",
      "Calendar time (24/7), open issues: how long each has sat in its current status",
      "Calendar time (24/7), every issue",
      "statusCategory != Done ORDER BY updated DESC",
      "order by created DESC",
      "Current status, all visits",
      "Time in current status",
    ]) {
      expect(t).toContain(s);
    }
    // The honest scope note on Pivot Report must survive edits.
    expect(t).toContain("StatusPulse replaces only that part.");
    expect(t).toMatch(
      /no issue-view panel, no epic roll-up, no worklog reporting/
    );
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
