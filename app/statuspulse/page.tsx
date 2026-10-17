import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

// Kept under the 70-char SERP cap that e2e/meta-and-schema.spec.ts enforces.
const TITLE =
  "StatusPulse — Time in Status & SLA for Jira | Shailesh Chaudhari";
const DESCRIPTION =
  "Documentation, user guide, and support for StatusPulse — a native Atlassian Jira Cloud app that measures how long work sat in each status in working hours.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("StatusPulse")}&type=page&description=${encodeURIComponent("Time in Status, SLA & Cycle Time for Jira")}`,
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

// Source copy: dwell/docs/user-guide.md and dwell/docs/troubleshooting.md.
// The dwell repo's `npm run check:urls` fetches this page and fails the
// listing if it overclaims (the code has four fixed weeks and nine zones).
const lastUpdated = "October 17, 2026";

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
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const H3 = "mt-8 text-xl font-semibold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";
const UL =
  "mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg";
const OL =
  "mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg";
const STRONG = "font-semibold text-foreground";

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

function Setting({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Item>
      <strong className={STRONG}>{name}</strong> — {children}
    </Item>
  );
}

export default function StatusPulseDocsPage() {
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
          StatusPulse
        </h1>
        <p className={P}>
          StatusPulse tells you how long work actually sat in each Jira status,
          measured against your working calendar rather than raw elapsed time.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
          <Link
            href="/statuspulse/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/statuspulse/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link
            href="/statuspulse/contact"
            className="underline underline-offset-4 hover:text-primary"
          >
            Customer Support
          </Link>
        </div>

        <h2 className={H2}>The one idea</h2>
        <p className={P}>
          Jira knows <em>when</em> an issue changed status. It does not tell you{" "}
          <em>how long</em> it sat anywhere. Most tools answer that by
          subtracting two timestamps, which counts nights, weekends and public
          holidays as working time. A ticket raised on Friday afternoon and
          picked up on Monday morning did not take three days of anybody&apos;s
          attention.
        </p>
        <p className={P}>
          StatusPulse measures the hours your team was actually working.
        </p>

        <h2 className={H2}>Running your first report</h2>
        <ol className={OL}>
          <li>
            Open <strong className={STRONG}>Apps → StatusPulse</strong> in Jira.
          </li>
          <li>
            Put a JQL query in the box. If you are not sure, start with{" "}
            <Code>project = ENG AND created &gt;= -30d</Code>.
          </li>
          <li>
            Choose <strong className={STRONG}>Working hours</strong> (the
            default) or <strong className={STRONG}>Calendar time</strong> if
            your team genuinely runs 24/7.
          </li>
          <li>Set your timezone, working week, day start and end.</li>
          <li>
            Press <strong className={STRONG}>Run report</strong>.
          </li>
        </ol>
        <p className={P}>You get two tables.</p>
        <p className={P}>
          <strong className={STRONG}>Where the time goes</strong> — median and
          85th percentile working time per status, across every issue in your
          query. This is the one to look at first: the top row is where your
          process actually spends its time.
        </p>
        <p className={P}>
          <strong className={STRONG}>By issue</strong> — one row per issue,
          showing its current status, how long it has been sitting there{" "}
          <em>since it last arrived</em>, and which status consumed the most of
          its life. Those are different numbers on an issue that came back from
          review, and the column means the second one.
        </p>

        <h2 className={H2}>The settings</h2>
        <ul className={UL}>
          <Setting name="Measure">
            <em>Working hours</em> excludes nights, weekends and holidays.{" "}
            <em>Calendar time</em> counts every millisecond.
          </Setting>
          <Setting name="Timezone">
            the zone your working day is defined in, chosen from a list of nine
            common zones (including Asia/Kolkata, UTC, Europe/London and
            America/New_York). Daylight saving is handled: a spring-forward day
            really is an hour shorter.
          </Setting>
          <Setting name="Working week">
            Saturday/Sunday, Friday/Saturday, Sunday only, or all seven days.
          </Setting>
          <Setting name="Day starts / ends">
            24-hour time, e.g. <Code>09:00</Code> and <Code>17:00</Code>.
          </Setting>
          <Setting name="Holidays">
            comma-separated dates, e.g.{" "}
            <Code>2026-01-26, 2026-08-15, 2026-10-02</Code>. Each one is
            excluded entirely.
          </Setting>
          <Setting name="Targets">
            optional SLA targets, e.g. <Code>In Review: 8h, Blocked: 2d</Code>,
            checked against working time. With Working hours, <Code>d</Code> is
            one of your working days and <Code>w</Code> one working week —{" "}
            <Code>2d</Code> on a 09:00–17:00 day is 16 hours, not 48 — and every{" "}
            <Code>d</Code> in the report means the same. With Calendar time,{" "}
            <Code>d</Code> is 24 hours.
          </Setting>
        </ul>
        <p className={P}>
          <strong className={STRONG}>Save these settings</strong> stores them
          against your Atlassian account, not the site. Two people on the same
          Jira can measure against different hours, which matters for
          distributed teams.{" "}
          <strong className={STRONG}>Clear my saved settings</strong> deletes
          yours; the page keeps what is on screen until you reload it.
        </p>

        <h2 className={H2}>The dashboard gadget</h2>
        <p className={P}>
          Add <strong className={STRONG}>StatusPulse — time in status</strong>{" "}
          to any Jira dashboard. It shows median working time per status for
          whatever you last saved on the StatusPulse page, using the same
          calendar.
        </p>
        <p className={P}>
          It has no settings of its own, on purpose. A second place to configure
          the same thing is a second place for the two to disagree. Change the
          query on the page and the gadget follows.
        </p>
        <p className={P}>
          <strong className={STRONG}>One consequence, stated plainly:</strong>{" "}
          settings are saved per Atlassian account, so on a dashboard several
          people look at, each person&apos;s gadget shows <em>their own</em>{" "}
          saved query and working calendar. If your team needs one agreed number
          on a shared dashboard, agree the query and have everyone save the same
          one — or tell us, and a shared gadget configuration becomes a
          considered feature rather than a default nobody asked for.
        </p>

        <h2 className={H2}>Exporting</h2>
        <p className={P}>
          Press <strong className={STRONG}>Show CSV</strong> after a report. The
          export is one row per issue per status, which is the shape a pivot
          table wants. Hours are decimal, so they add up. A column-per-status
          layout was deliberately avoided: status names differ between projects,
          so that sheet goes ragged the moment your JQL spans two of them.
        </p>

        <h2 className={H2}>Reading the numbers honestly</h2>
        <ul className={UL}>
          <Item>
            <strong className={STRONG}>Median, not average.</strong> Cycle-time
            distributions have long tails. One ticket stuck across a shutdown
            drags an average somewhere no team recognises. The 85th percentile
            column is the number to quote for a realistic worst case.
          </Item>
          <Item>
            <strong className={STRONG}>
              &ldquo;Partial history&rdquo; badge.
            </strong>{" "}
            Jira caps how much changelog it returns with a search, and it
            returns the most recent entries — so on a very long-lived issue it
            is the <em>early</em> life that is missing. StatusPulse measures
            those issues from the oldest entry Jira actually sent and counts the
            unknown period against no status at all. Their totals are a lower
            bound, and the row is flagged rather than hidden.
          </Item>
          <Item>
            <strong className={STRONG}>Re-entry counts.</strong> An issue that
            entered <em>In Review</em> four times is telling you something the
            total alone does not.
          </Item>
          <Item>
            <strong className={STRONG}>
              A renamed status is still one row.
            </strong>{" "}
            StatusPulse matches on the status identifiers Jira sends alongside
            the names, so a status renamed from <em>QA</em> to <em>Testing</em>{" "}
            appears once, under the name it has today. If StatusPulse cannot
            read your site&apos;s status list it says so, and in that case a
            renamed status may appear twice.
          </Item>
        </ul>

        <h2 className={H2}>Limits</h2>
        <ul className={UL}>
          <Item>
            A report covers up to <strong className={STRONG}>200 issues</strong>
            . Narrow the JQL for a complete picture of a larger set; a report
            that quietly truncates is worse than one that says so.
          </Item>
          <Item>
            StatusPulse reads Jira issue data only. Nothing leaves your
            Atlassian tenant — see the{" "}
            <Link
              href="/statuspulse/privacy"
              className="text-primary underline underline-offset-4"
            >
              privacy policy
            </Link>{" "}
            for exactly what is read, stored and sent.
          </Item>
          <Item>
            It is not a time-tracking tool. It measures how long work sat in a
            status, not how long a person spent on it. If you need to know who
            worked how many hours, you want a worklog app.
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
          Every Forge app loads its interface from{" "}
          <Code>*.cdn.prod.atlassian-dev.net</Code>. If your network cannot
          resolve or reach that domain, Jira draws the frame and then waits for
          an app that never loads, with no error message. Confirm it by running{" "}
          <Code>nslookup probe.cdn.prod.atlassian-dev.net</Code>: if that
          returns nothing or <Code>NXDOMAIN</Code>, that is your answer.
        </p>
        <ul className={UL}>
          <Item>
            <strong className={STRONG}>Router or ISP DNS.</strong> Point the
            machine at a public resolver such as <Code>8.8.8.8</Code> and{" "}
            <Code>1.1.1.1</Code>, then flush the DNS cache.
          </Item>
          <Item>
            <strong className={STRONG}>Corporate firewall or proxy.</strong> Ask
            IT to allow <Code>*.cdn.prod.atlassian-dev.net</Code>, which
            Atlassian documents as required for Forge apps.
          </Item>
          <Item>
            <strong className={STRONG}>A browser extension.</strong> Ad blockers
            sometimes block third-party frames. Pause them for your Jira site
            and reload.
          </Item>
          <Item>
            <strong className={STRONG}>DNS filtering</strong> such as a Pi-hole,
            NextDNS or OpenDNS with an aggressive blocklist.
          </Item>
        </ul>
        <h3 className={H3}>&ldquo;Jira rejected the search&rdquo;</h3>
        <p className={P}>
          The JQL is not valid, or you cannot see the projects it names. Try the
          same query in Jira&apos;s own issue search first.
        </p>
        <h3 className={H3}>&ldquo;Showing the first 200 issues&rdquo;</h3>
        <p className={P}>
          Narrow the query by project, date range or issue type. Two accurate
          reports beat one truncated one.
        </p>
        <h3 className={H3}>The numbers look too small or too big</h3>
        <p className={P}>
          Check the Measure setting and your holidays list: on Working hours a
          Friday-evening-to-Monday ticket shows a few hours, not three days.
          Then check the working day and week: a day of <Code>00:00</Code>–
          <Code>23:59</Code> counts everything.
        </p>
        <h3 className={H3}>The gadget shows different numbers from the page</h3>
        <p className={P}>
          For one person it should not: the page&apos;s settings were changed
          and not saved. Press Save these settings and reload the dashboard. Two
          people on the same dashboard can see different numbers by design,
          because each runs their own saved settings.
        </p>
        <h3 className={H3}>
          The StatusPulse icon is missing from the gadget picker
        </h3>
        <p className={P}>
          The icon is served from{" "}
          <Code>shaileshchaudhari.vercel.app/statuspulse/icon-144.png</Code>. If
          your network blocks that address the gadget still works — only its
          picture is missing.
        </p>

        <h2 className={H2} id="support">
          Reporting a problem
        </h2>
        <p className={P}>
          Send the JQL, the settings you used, and roughly what you expected. If
          you can include an issue key where the number looks wrong, that is the
          fastest possible bug report: the calculation is deterministic, so one
          example usually reproduces it exactly. Email{" "}
          <a
            href="mailto:shailesh93602@gmail.com"
            className="text-primary underline underline-offset-4"
          >
            shailesh93602@gmail.com
          </a>{" "}
          or use the{" "}
          <Link
            href="/statuspulse/contact"
            className="text-primary underline underline-offset-4"
          >
            StatusPulse support desk
          </Link>
          .
        </p>
      </div>
    </>
  );
}
