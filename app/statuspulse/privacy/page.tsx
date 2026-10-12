import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "StatusPulse — Privacy Policy | Shailesh Chaudhari";
const DESCRIPTION =
  "Privacy policy for StatusPulse, a Jira Cloud app. No issue data is stored, nothing is transmitted outside Atlassian, and the only stored item is your report settings.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse/privacy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse/privacy`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("StatusPulse Privacy")}&type=page&description=${encodeURIComponent("What the app does with your data")}`,
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Privacy",
      item: `${SITE_URL}/statuspulse/privacy`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
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

export default function StatusPulsePrivacyPage() {
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
          StatusPulse — Privacy Policy
        </h1>
        <p className={P}>
          What the StatusPulse Jira app does with your data. The summary is
          short because the app does very little with external infrastructure:
          it runs 100% inside your Atlassian site.{" "}
          <Link href="/statuspulse" className="underline underline-offset-4">
            Back to documentation
          </Link>
          .
        </p>

        <h2 className={H2}>Summary</h2>
        <p className={P}>
          StatusPulse stores no issue data anywhere, and nothing leaves your
          Atlassian tenant. The app runs entirely on Atlassian&apos;s own
          infrastructure using Atlassian Forge and qualifies for
          Atlassian&apos;s Runs on Atlassian program. There are no external
          databases, telemetry agents, or third-party servers.
        </p>

        <h2 className={H2}>What StatusPulse Reads</h2>
        <p className={P}>
          When you execute a report, StatusPulse queries Jira for issues
          matching your specified JQL query, strictly bounded by your personal
          user permissions. For each returned issue, it inspects: key, summary,
          issue type, current status, creation date, and status transition
          timestamps.
        </p>
        <p className={P}>
          These records are computed in-memory to render duration distributions,
          percentiles, and SLA targets, and are immediately discarded. Nothing
          is written to permanent storage.
        </p>

        <h2 className={H2}>What StatusPulse Stores</h2>
        <p className={P}>
          Only one category of data is saved: your report configuration
          settings.
        </p>
        <ul className={UL}>
          <Item>
            Your JQL query, timezone, working hours, excluded holiday dates, and
            target SLA thresholds.
          </Item>
          <Item>
            Stored in Atlassian Forge storage inside your Jira site data
            boundary.
          </Item>
          <Item>
            Keyed to your Atlassian account ID so other users on your Jira
            instance retain their own isolated settings.
          </Item>
        </ul>

        <h2 className={H2}>Data Egress & External Services</h2>
        <p className={P}>
          StatusPulse makes zero external HTTP requests from its backend or
          frontend runtime. No analytics, tracking pixels, crash reporting
          tools, or third-party scripts are embedded.
        </p>
        <p className={P}>
          The sole external asset is the static gadget icon rendered in
          Jira&apos;s gadget directory, loaded securely over HTTPS from{" "}
          <Code>shaileshchaudhari.vercel.app/statuspulse/icon-144.png</Code>.
          This is an absolute URL required by Atlassian&apos;s dashboard gadget
          specification; no user data or identifiers are transmitted with this
          image request.
        </p>

        <h2 className={H2}>Requested Permissions</h2>
        <ul className={UL}>
          <Item>
            <Code>read:jira-work</Code> — Read-only access to query matching
            issues and workflow status metadata. StatusPulse cannot create,
            edit, or delete tickets.
          </Item>
          <Item>
            <Code>storage:app</Code> — To persist your report preferences in
            Forge KVS.
          </Item>
        </ul>

        <h2 className={H2}>Retention & Deletion</h2>
        <p className={P}>
          Report settings are retained until modified or until StatusPulse is
          uninstalled. Uninstalling the app permanently purges all saved
          settings from Forge storage.
        </p>

        <h2 className={H2}>Sub-processors</h2>
        <p className={P}>
          None. StatusPulse operates without third-party subprocessors. All
          compute and storage are provided directly by Atlassian Cloud.
        </p>

        <h2 className={H2}>Contact & Data Requests</h2>
        <p className={P}>
          For privacy inquiries, questions, or data removal requests:
        </p>
        <ul className={UL}>
          <Item>
            Email:{" "}
            <a
              href="mailto:shailesh93602@gmail.com"
              className="text-primary underline underline-offset-4"
            >
              shailesh93602@gmail.com
            </a>
          </Item>
          <Item>
            Support Desk:{" "}
            <Link
              href="/statuspulse/contact"
              className="text-primary underline underline-offset-4"
            >
              StatusPulse Support Page
            </Link>
          </Item>
        </ul>
      </div>
    </>
  );
}
