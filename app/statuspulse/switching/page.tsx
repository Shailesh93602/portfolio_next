import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "StatusPulse — Switching from Another App | Shailesh Chaudhari";
const DESCRIPTION =
  "Moving to StatusPulse from another Jira time-in-status app: nothing to import, three presets, how its numbers map to Issue Time in Status and Pivot Report, and what it does not do.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse/switching` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse/switching`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("Switching to StatusPulse")}&type=page&description=${encodeURIComponent("Time in Status, SLA & Cycle Time for Jira")}`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@ShaileshWork",
  },
};

// Source copy: dwell/docs/switching.md. The preset labels and queries are
// dwell/src/engine/presets.ts PRESETS; the column name is dwell
// src/frontend/report/tables.jsx. dwell's presets.test.ts checks its own copy.
const lastUpdated = "October 18, 2026";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "StatusPulse",
      item: `${SITE_URL}/statuspulse`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Switching",
      item: `${SITE_URL}/statuspulse/switching`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";
const UL =
  "mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg";
const OL =
  "mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg";

// dwell/src/engine/presets.ts — label, query, how time is counted.
const PRESETS = [
  [
    "Working hours, every issue (the StatusPulse default)",
    "order by created DESC",
    "your working hours",
  ],
  [
    "Calendar time (24/7), open issues: how long each has sat in its current status",
    "statusCategory != Done ORDER BY updated DESC",
    "every hour, nights and weekends included",
  ],
  ["Calendar time (24/7), every issue", "order by created DESC", "every hour"],
] as const;
const STRONG = "font-semibold text-foreground";
const TH = "border-b border-border px-3 py-2 text-left font-semibold";
const TD = "border-b border-border px-3 py-2 align-top";

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden
        className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
      />
      <span>{children}</span>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="break-all rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  );
}

export default function StatusPulseSwitchingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <p className="mb-2 text-sm uppercase tracking-wider text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Switching to StatusPulse from another time-in-status app
        </h1>
        <p className={P}>
          <Link href="/statuspulse" className="underline underline-offset-4">
            Back to documentation
          </Link>
        </p>

        <h2 className={H2}>There is nothing to import</h2>
        <p className={P}>
          Time in status is worked out from each issue&apos;s own history in
          Jira. StatusPulse reads that history the first time you run a report,
          so every issue you ever had is already measured. You do not export
          anything from your old app, and you lose nothing by uninstalling it
          later.
        </p>
        <p className={P}>
          What does not carry over is the old app&apos;s <em>settings</em>:
          which query you ran and how time was counted.{" "}
          <strong className={STRONG}>Start from a preset</strong>, at the top of
          the StatusPulse page, sets those in one step. A preset sets only the
          query and how time is counted. It never changes your timezone, working
          week, day or holidays. Press{" "}
          <strong className={STRONG}>Run report</strong>, then{" "}
          <strong className={STRONG}>Save these settings</strong> to keep it.
          The dashboard gadget uses whatever you saved.
        </p>
        <div
          className="mt-6 overflow-x-auto"
          tabIndex={0}
          role="region"
          aria-label="Presets, scrollable horizontally"
        >
          <table className="w-full border-collapse text-sm text-muted-foreground sm:text-base">
            <thead className="text-foreground">
              <tr>
                <th className={TH}>Preset</th>
                <th className={TH}>Query</th>
                <th className={TH}>Counts</th>
              </tr>
            </thead>
            <tbody>
              {PRESETS.map(([label, query, counts]) => (
                <tr key={label}>
                  <td className={TD}>{label}</td>
                  <td className={TD}>
                    <Code>{query}</Code>
                  </td>
                  <td className={TD}>{counts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={H2}>Coming from Issue Time in Status (GTOLA)</h2>
        <p className={P}>
          That app shows, on each issue, how long it has been in its current
          status, adding up earlier visits to the same status, and the time in
          other statuses when you click it.
        </p>
        <ul className={UL}>
          <Item>
            <strong className={STRONG}>Use the preset</strong>{" "}
            <em>{PRESETS[1][0]}</em>.
          </Item>
          <Item>
            <strong className={STRONG}>Their glance number</strong> is
            StatusPulse&apos;s{" "}
            <strong className={STRONG}>Current status, all visits</strong>{" "}
            column in the <em>By issue</em> table.{" "}
            <strong className={STRONG}>Time in current status</strong> is the
            visit in progress only. The two differ once an issue has come back
            to a status.
          </Item>
          <Item>
            <strong className={STRONG}>
              Their per-status breakdown for one issue
            </strong>{" "}
            is in the CSV export, which has one row per issue per status. To
            look at a single issue, put <Code>key = ABC-123</Code> in the query.
          </Item>
          <Item>
            <strong className={STRONG}>What is different:</strong> StatusPulse
            is a report page and a dashboard gadget, not a panel on the issue.
            You get the same numbers for every issue in a query at once, plus
            the median, the 85th percentile, cycle time and SLA targets.
          </Item>
        </ul>

        <h2 className={H2}>Coming from Pivot Report (Colined)</h2>
        <p className={P}>
          Pivot Report is a pivot-table and roll-up tool: epics and custom
          hierarchies, worklogs, capacity, Excel and Confluence export. Time in
          status is one part of it.{" "}
          <strong className={STRONG}>
            StatusPulse replaces only that part.
          </strong>{" "}
          If you use Pivot Report for epic roll-ups or worklogs, keep it.
        </p>
        <p className={P}>
          For the time-in-status part, start with <em>{PRESETS[2][0]}</em> and
          the same JQL filter your pivot used. Then switch{" "}
          <strong className={STRONG}>Measure</strong> to <em>Working hours</em>{" "}
          if you want nights and weekends left out.
        </p>

        <h2 className={H2}>Checking the numbers side by side</h2>
        <p className={P}>
          Run both apps on the same query before you uninstall anything.
          Differences have three usual causes:
        </p>
        <ol className={OL}>
          <li>
            <strong className={STRONG}>
              Working hours versus calendar time.
            </strong>{" "}
            Set StatusPulse to <em>Calendar time</em> to compare like with like.
          </li>
          <li>
            <strong className={STRONG}>Long-lived issues.</strong> Jira returns
            only the most recent part of a long changelog with a search.
            StatusPulse marks those rows <em>partial history</em> and counts
            from the oldest change it received, so its total is a lower bound
            rather than a guess.
          </li>
          <li>
            <strong className={STRONG}>Renamed statuses.</strong> StatusPulse
            keeps a renamed status as one row. Apps that go by the name alone
            show it twice.
          </li>
        </ol>
        <p className={P}>
          If a number still disagrees, send the query and one issue key from the{" "}
          <Link
            href="/statuspulse/contact"
            className="text-primary underline underline-offset-4"
          >
            support page
          </Link>
          .
        </p>

        <h2 className={H2}>What StatusPulse does not do</h2>
        <p className={P}>
          There is no issue-view panel, no epic roll-up, no worklog reporting,
          no Excel file (CSV instead) and no scheduled email. If you need one of
          these every day, StatusPulse is not a full replacement yet.
        </p>
      </div>
    </>
  );
}
