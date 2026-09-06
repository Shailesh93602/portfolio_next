import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "Dwell — documentation | Shailesh Chaudhari";
const DESCRIPTION =
  "User guide and troubleshooting for Dwell, a Jira Cloud app that measures how long work sat in each status, in working hours rather than raw elapsed time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/dwell` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/dwell`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("Dwell")}&type=page&description=${encodeURIComponent("Time in status, in working hours")}`,
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

const lastUpdated = "September 6, 2026";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Dwell",
      item: `${SITE_URL}/dwell`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const H3 = "mt-8 text-xl font-semibold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";
const UL =
  "mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg";

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
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
      {children}
    </code>
  );
}

export default function DwellDocsPage() {
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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dwell</h1>
        <p className={P}>
          A Jira Cloud app that measures how long work actually sat in each
          status, counted against your working calendar rather than raw elapsed
          time. Documentation and troubleshooting.{" "}
          <Link href="/dwell/privacy" className="underline underline-offset-4">
            Privacy policy
          </Link>
          .
        </p>

        <h2 className={H2}>The one idea</h2>
        <p className={P}>
          Jira records when an issue changed status. It does not tell you how
          long it sat anywhere. Most reports answer that by subtracting two
          timestamps, which counts nights, weekends and public holidays as
          working time. A ticket raised on Friday afternoon and picked up on
          Monday morning did not take three days of anybody&apos;s attention.
        </p>

        <h2 className={H2}>Running your first report</h2>
        <ul className={UL}>
          <Item>
            Open{" "}
            <strong className="font-semibold text-foreground">
              Apps → Dwell
            </strong>{" "}
            in Jira.
          </Item>
          <Item>
            Put a JQL query in the box, for example{" "}
            <Code>project = ENG AND created &gt;= -30d</Code>.
          </Item>
          <Item>
            Choose{" "}
            <strong className="font-semibold text-foreground">
              Working hours
            </strong>
            , or Calendar time if your team genuinely runs around the clock.
          </Item>
          <Item>
            Set your timezone, working week, day start and end, then press Run
            report.
          </Item>
        </ul>

        <h2 className={H2}>What the settings mean</h2>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">Measure</strong> —
            working hours excludes nights, weekends and holidays. Calendar time
            counts every millisecond.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">Timezone</strong>{" "}
            — the zone your working day is defined in. Daylight saving is
            handled, so a spring-forward day really is an hour shorter.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Working week
            </strong>{" "}
            — Saturday/Sunday, Friday/Saturday, Sunday only, or all seven days.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Day starts and ends
            </strong>{" "}
            — 24-hour time, such as <Code>09:00</Code> and <Code>17:00</Code>.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">Holidays</strong>{" "}
            — comma separated, such as <Code>2026-01-26, 2026-08-15</Code>. Each
            is excluded entirely.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">Targets</strong> —
            optional, such as <Code>In Review: 8h, Blocked: 2d</Code>. Breaches
            are measured in working time, because an SLA that counts the weekend
            is not one anybody agreed to.
          </Item>
        </ul>
        <p className={P}>
          Save these settings stores them against your Atlassian account rather
          than the site, so two people on the same Jira can measure against
          different hours.
        </p>

        <h2 className={H2}>Cycle time</h2>
        <p className={P}>
          Measured from the first time an issue enters an in-progress status to
          the first time it reaches a done status. Which statuses count is read
          from Jira&apos;s own status categories, so there is nothing to
          configure and it stays correct across projects that name their
          statuses differently. Issues that never finished are excluded rather
          than counted as zero.
        </p>

        <h2 className={H2}>The dashboard gadget</h2>
        <p className={P}>
          Add{" "}
          <strong className="font-semibold text-foreground">
            Dwell — time in status
          </strong>{" "}
          to any Jira dashboard. It shows median working time per status for
          whatever you last saved on the Dwell page, using the same calendar. It
          has no settings of its own on purpose: a second place to configure the
          same thing is a second place for the two to disagree.
        </p>

        <h2 className={H2}>Reading the numbers honestly</h2>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">
              Median, not average.
            </strong>{" "}
            Cycle times have long tails, and one ticket stuck across a shutdown
            drags an average somewhere no team recognises. The 85th percentile
            is the number to quote for a realistic worst case.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Partial history.
            </strong>{" "}
            Jira paginates very long changelogs. Issues where only part was
            returned are labelled, and their totals are a lower bound. Flagged
            rather than hidden, because a visibly incomplete number is more
            useful than a silently wrong one.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Re-entry counts.
            </strong>{" "}
            An issue that entered review four times is telling you something the
            total alone does not.
          </Item>
        </ul>

        <h2 className={H2}>Limits</h2>
        <ul className={UL}>
          <Item>
            A report covers up to 200 issues. Narrow the JQL for a complete
            picture of a larger set; a report that quietly truncates is worse
            than one that says so.
          </Item>
          <Item>
            Dwell is not a time-tracking tool. It measures how long work sat in
            a status, not how long a person spent on it. If you need hours per
            person, you want a worklog app.
          </Item>
        </ul>

        <h2 className={H2} id="troubleshooting">
          Troubleshooting
        </h2>

        <h3 className={H3}>
          A blank page, or a loading placeholder that never finishes
        </h3>
        <p className={P}>
          Almost always a DNS or network problem on your side, not the app.
          Every Forge app on the Atlassian Marketplace loads its interface from{" "}
          <Code>*.cdn.prod.atlassian-dev.net</Code>. If your network cannot
          resolve that domain, Jira draws the frame and then waits for an app
          that never loads, with no error message.
        </p>
        <p className={P}>
          Confirm it in ten seconds by running{" "}
          <Code>nslookup probe.cdn.prod.atlassian-dev.net</Code>. If that
          returns nothing, that is your answer.
        </p>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">
              Router or ISP DNS.
            </strong>{" "}
            Point the machine at a public resolver. On macOS,{" "}
            <Code>sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 1.1.1.1</Code>{" "}
            then <Code>sudo dscacheutil -flushcache</Code>. On Windows, set DNS
            in the adapter&apos;s IPv4 properties.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Corporate firewall or proxy.
            </strong>{" "}
            Ask IT to allow <Code>*.cdn.prod.atlassian-dev.net</Code>. Atlassian
            documents it as required for any Forge app.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              A browser extension.
            </strong>{" "}
            Ad blockers sometimes block third-party frames. Pause them for your
            Jira site and reload.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              DNS filtering
            </strong>{" "}
            such as a Pi-hole, NextDNS or OpenDNS with an aggressive blocklist.
          </Item>
        </ul>

        <h3 className={H3}>Other things</h3>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">
              &quot;Jira rejected the search&quot;
            </strong>{" "}
            — the JQL is invalid or you cannot see the projects it names. Try
            the same query in Jira&apos;s own issue search.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              The numbers look too small
            </strong>{" "}
            — check the Measure setting, and your holidays list. On working
            hours a Friday-to-Monday ticket shows hours, not days, because that
            is what actually happened.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              The numbers look too big
            </strong>{" "}
            — check the working day and week. A day of 00:00 to 23:59 counts
            everything.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              A target produced no breaches
            </strong>{" "}
            — the report warns when a target names a status no issue has. Check
            the spelling against the status names in the report.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              The gadget disagrees with the page
            </strong>{" "}
            — it cannot, unless the page&apos;s settings were changed without
            saving. Press Save these settings and reload the dashboard.
          </Item>
        </ul>

        <h2 className={H2}>Reporting a problem</h2>
        <p className={P}>
          Send the JQL, the settings you used, and roughly what you expected. If
          you can include an issue key where the number looks wrong, that is the
          fastest possible bug report: the calculation is deterministic, so one
          example usually reproduces it exactly.
        </p>
      </div>
    </>
  );
}
