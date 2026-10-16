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

const lastUpdated = "October 12, 2026";

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
          A native Jira Cloud app that measures how long work actually sat in
          each status, counted against your working calendar rather than raw
          elapsed time. Time in status, SLA breach tracking, and cycle time
          reports with zero per-project configuration.
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

        <h2 className={H2}>The Core Idea</h2>
        <p className={P}>
          Jira records when an issue changed status, but never tells you how
          long it sat anywhere. Standard reports subtract timestamps, counting
          nights, weekends, and holidays as working time. A ticket raised on
          Friday afternoon and picked up on Monday morning did not consume three
          days of engineering time. StatusPulse counts only real business hours.
        </p>

        <h2 className={H2}>Running Your First Report</h2>
        <ul className={UL}>
          <Item>
            Open{" "}
            <strong className="font-semibold text-foreground">
              Apps → StatusPulse
            </strong>{" "}
            in Jira.
          </Item>
          <Item>
            Enter any JQL query, such as{" "}
            <Code>project = ENG AND created &gt;= -30d</Code>.
          </Item>
          <Item>
            Select{" "}
            <strong className="font-semibold text-foreground">
              Working hours
            </strong>{" "}
            (or Calendar time if your team operates 24/7).
          </Item>
          <Item>
            Set your timezone, working schedule, day start and end, and click{" "}
            <strong className="font-semibold text-foreground">
              Run report
            </strong>
            .
          </Item>
        </ul>

        <h2 className={H2}>Configuration & Working Calendar</h2>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">Measure</strong> —
            Working hours excludes off-hours, weekends, and holidays. Calendar
            time counts elapsed clock time.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">Timezone</strong>{" "}
            — Any major timezone, including half-hour offsets like Asia/Kolkata,
            with daylight saving handled accurately.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Working week
            </strong>{" "}
            — Mon–Fri, Sun–Thu (Middle East), Sat/Sun only, or customized
            workdays.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Business Hours
            </strong>{" "}
            — 24-hour format, such as <Code>09:00</Code> to <Code>17:00</Code>.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">Holidays</strong>{" "}
            — Comma-separated ISO dates (<Code>2026-01-26, 2026-08-15</Code>)
            excluded from duration calculations.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              SLA Targets
            </strong>{" "}
            — Set target durations per status (e.g.{" "}
            <Code>In Review: 8h, Blocked: 2d</Code>) to highlight breaches in
            business time.
          </Item>
        </ul>
        <p className={P}>
          Settings are saved per Atlassian account, allowing team members on the
          same site to use calendars tailored to their working hours.
        </p>

        <h2 className={H2}>Cycle Time & Auto-Detection</h2>
        <p className={P}>
          Cycle time is calculated from the first transition into an In Progress
          category to the first Done status. StatusPulse reads Jira&apos;s
          native workflow categories, eliminating manual status-mapping per
          project. Unfinished work is excluded rather than counted as zero.
        </p>

        <h2 className={H2}>Jira Dashboard Gadget</h2>
        <p className={P}>
          Add the{" "}
          <strong className="font-semibold text-foreground">
            StatusPulse — time in status
          </strong>{" "}
          gadget to any Jira dashboard. It displays median working duration per
          status mirroring your saved report settings without duplicating
          configuration.
        </p>

        <h2 className={H2}>Privacy & Architecture</h2>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">
              100% In-Tenant Forge:
            </strong>{" "}
            Runs entirely on Atlassian cloud infrastructure with no external
            servers.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Zero External Data Egress:
            </strong>{" "}
            Issue data is processed in-memory and never sent to third parties or
            logged outside your site.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Read-Only Permissions:
            </strong>{" "}
            Requests <Code>read:jira-work</Code> and <Code>storage:app</Code>.
            The app cannot create, edit, or delete any Jira content.
          </Item>
        </ul>

        <h2 className={H2} id="support">
          Customer Support & Inquiries
        </h2>
        <p className={P}>
          Need assistance, have a feature suggestion, or encountered an issue?
        </p>
        <ul className={UL}>
          <Item>
            <strong className="font-semibold text-foreground">
              Email Support:
            </strong>{" "}
            <a
              href="mailto:shailesh93602@gmail.com"
              className="text-primary underline underline-offset-4"
            >
              shailesh93602@gmail.com
            </a>
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Response SLA:
            </strong>{" "}
            We respond to all inquiries within 24 to 48 business hours.
          </Item>
          <Item>
            <strong className="font-semibold text-foreground">
              Direct Contact Page:
            </strong>{" "}
            <Link
              href="/statuspulse/contact"
              className="text-primary underline underline-offset-4"
            >
              StatusPulse Support Desk
            </Link>
          </Item>
        </ul>

        <h2 className={H2} id="troubleshooting">
          Troubleshooting FAQ
        </h2>
        <h3 className={H3}>Gadget or page shows a blank placeholder</h3>
        <p className={P}>
          All Forge apps load UI bundles from{" "}
          <Code>*.cdn.prod.atlassian-dev.net</Code>. If your corporate network
          or ad blocker blocks this domain, whitelist it in your browser or
          proxy.
        </p>
        <h3 className={H3}>&quot;Jira rejected the search&quot;</h3>
        <p className={P}>
          Verify that your JQL query is valid and that your user account has
          read permissions for all referenced projects.
        </p>
      </div>
    </>
  );
}
