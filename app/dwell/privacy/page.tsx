import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "Dwell — privacy policy | Shailesh Chaudhari";
const DESCRIPTION =
  "Privacy policy for Dwell, a Jira Cloud app. No issue data is stored, nothing is transmitted outside Atlassian, and the only stored item is your own report settings.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/dwell/privacy` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/dwell/privacy`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("Dwell privacy")}&type=page&description=${encodeURIComponent("What the app does with your data")}`,
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Privacy",
      item: `${SITE_URL}/dwell/privacy`,
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

export default function DwellPrivacyPage() {
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
          Dwell — privacy policy
        </h1>
        <p className={P}>
          What the Jira app does with your data. It is short because the app
          does very little.{" "}
          <Link href="/dwell" className="underline underline-offset-4">
            Back to documentation
          </Link>
          .
        </p>

        <h2 className={H2}>The short version</h2>
        <p className={P}>
          Dwell stores no issue data anywhere, and nothing leaves your Atlassian
          tenant. The app runs entirely on Atlassian&apos;s own infrastructure
          using Atlassian Forge, and qualifies for Atlassian&apos;s Runs on
          Atlassian programme, which requires that an app use only
          Atlassian-hosted compute and storage and not transmit data outside
          Atlassian. There is no server of ours for your data to travel to,
          because there is no server of ours.
        </p>

        <h2 className={H2}>What the app reads</h2>
        <p className={P}>
          When you run a report, Dwell asks Jira for the issues matching your
          query, using your own permissions. It never sees an issue you could
          not already open. For each issue it reads the key, summary, type,
          current status, creation date, assignee display name, and the
          status-change history.
        </p>
        <p className={P}>
          These are read at the moment you press Run report, used to calculate
          the numbers on screen, and then discarded. They are never written to
          storage. Close the page and nothing about your issues remains.
        </p>

        <h2 className={H2}>What the app stores</h2>
        <p className={P}>One thing: your report settings.</p>
        <ul className={UL}>
          <Item>
            Your JQL, timezone, working week, day start and end, holiday list
            and SLA targets.
          </Item>
          <Item>
            Stored in Atlassian&apos;s Forge storage, inside your own
            site&apos;s data boundary.
          </Item>
          <Item>
            Keyed to your Atlassian account, so colleagues on the same site do
            not see or affect yours.
          </Item>
        </ul>
        <p className={P}>
          That is the complete list. No issue content, no summaries, no names,
          no timestamps from your work.
        </p>

        <h2 className={H2}>What the app sends anywhere</h2>
        <p className={P}>
          Nothing. There are no analytics, no error-reporting service, no
          third-party scripts, no advertising, no tracking pixels, and no
          external API calls of any kind. Sending data out would disqualify the
          app from Runs on Atlassian, and we would rather have the guarantee
          than the telemetry. The honest consequence is that we have no idea how
          you use the app and rely on you telling us when something is wrong.
        </p>

        <h2 className={H2}>Permissions requested</h2>
        <ul className={UL}>
          <Item>
            <Code>read:jira-work</Code> — to read the issues and status history
            your query matches. Read-only: Dwell cannot create, edit, transition
            or delete anything in your Jira.
          </Item>
          <Item>
            <Code>storage:app</Code> — to save your report settings, as
            described above.
          </Item>
        </ul>
        <p className={P}>
          If a future version needs a different permission, Atlassian requires a
          major version upgrade that a site administrator must explicitly
          approve. Permissions cannot expand silently.
        </p>

        <h2 className={H2}>Retention and deletion</h2>
        <p className={P}>
          Your settings persist until you change them or the app is uninstalled.
          Uninstalling Dwell removes its stored data. If you want your settings
          deleted while keeping the app, ask and we will remove them. Because no
          issue data is ever stored, there is nothing else to retain or delete.
        </p>

        <h2 className={H2}>Sub-processors</h2>
        <p className={P}>
          None. The app has no external dependencies at runtime and no
          third-party services.
        </p>

        <h2 className={H2}>Changes to this policy</h2>
        <p className={P}>
          If this changes materially, the date above changes and the change is
          described in the app&apos;s release notes. A change that expanded what
          is collected would also require the permission upgrade described
          above, which an administrator must approve.
        </p>

        <h2 className={H2}>Contact</h2>
        <p className={P}>
          Questions, deletion requests, or anything that looks wrong: use the
          support contact on the Marketplace listing, or the{" "}
          <Link href="/contact" className="underline underline-offset-4">
            contact page
          </Link>
          .
        </p>
      </div>
    </>
  );
}
