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

// Source copy: dwell/docs/privacy.md. Keep the two saying the same thing; the
// dwell repo's `npm run check:urls` fetches this page and fails the listing
// if a scope, an endpoint or a stated control is missing from it.
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Privacy",
      item: `${SITE_URL}/statuspulse/privacy`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const H3 = "mt-8 text-xl font-semibold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";
const UL =
  "mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg";
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
          This describes exactly what StatusPulse does with your data. It is
          short because the app does very little.{" "}
          <Link href="/statuspulse" className="underline underline-offset-4">
            Back to documentation
          </Link>
          .
        </p>

        <h2 className={H2}>The short version</h2>
        <p className={P}>
          <strong className={STRONG}>
            StatusPulse stores no issue data anywhere, and nothing leaves your
            Atlassian tenant.
          </strong>
        </p>
        <p className={P}>
          The app runs entirely on Atlassian&apos;s own infrastructure using
          Atlassian Forge. It is built to the requirements of Atlassian&apos;s{" "}
          <strong className={STRONG}>Runs on Atlassian</strong> programme: an
          app may use only Atlassian-hosted compute and storage and may not
          transmit data outside Atlassian. There is no server of ours for your
          data to travel to, because there is no server of ours.
        </p>

        <h2 className={H2}>What the app reads</h2>
        <p className={P}>
          When you run a report, StatusPulse asks Jira for the issues matching
          your JQL, using{" "}
          <strong className={STRONG}>your own permissions</strong>. It never
          sees an issue you could not already open. For each issue it reads:
        </p>
        <ul className={UL}>
          <Item>
            issue key, summary, type, current status, creation date, assignee
            display name
          </Item>
          <Item>the status-change history (the changelog)</Item>
        </ul>
        <p className={P}>
          These are read at the moment you press{" "}
          <strong className={STRONG}>Run report</strong>, used to calculate the
          numbers on screen, and then discarded.{" "}
          <strong className={STRONG}>They are never written to storage.</strong>{" "}
          Close the page and nothing about your issues remains.
        </p>

        <h2 className={H2}>What the app stores</h2>
        <p className={P}>One thing: your report settings.</p>
        <ul className={UL}>
          <Item>
            Your JQL, the measure (working hours or calendar time), timezone,
            working week, day start and end, holiday list and SLA targets.
          </Item>
          <Item>
            Stored in Atlassian&apos;s Forge storage, inside your own
            site&apos;s data boundary.
          </Item>
          <Item>
            Keyed to <strong className={STRONG}>your Atlassian account</strong>,
            so colleagues on the same site do not see or affect yours.
          </Item>
        </ul>
        <p className={P}>
          That is the complete list. No issue content, no summaries, no names,
          no timestamps from your work.
        </p>

        <h2 className={H2}>What the app sends anywhere</h2>
        <p className={P}>Nothing outside Atlassian.</p>
        <p className={P}>
          Two things go to Atlassian itself, and only these: once a week, the{" "}
          <strong className={STRONG}>Atlassian account ids</strong> that have
          saved settings, sent to Atlassian&apos;s personal-data reporting
          service (see &ldquo;Data retention and deletion&rdquo;); and, if a
          calculation fails or your saved settings cannot be read, a generic
          error line in the app&apos;s Forge log, which carries{" "}
          <strong className={STRONG}>
            no issue key, summary, name or query
          </strong>
          .
        </p>
        <p className={P}>
          There are no analytics, no error-reporting service, no third-party
          scripts, no advertising, no tracking pixels, and no external API calls
          of any kind. Sending data out would disqualify the app from Runs on
          Atlassian, and we would rather have the guarantee than the telemetry.
        </p>
        <p className={P}>
          The consequence, stated honestly: we have no idea how you use the app,
          and we rely on you telling us when something is wrong.
        </p>

        <h3 className={H3}>One image, and why it is here</h3>
        <p className={P}>
          There is exactly one address in this app that is not Atlassian&apos;s:
          the{" "}
          <strong className={STRONG}>
            icon shown beside &ldquo;StatusPulse&rdquo; in Jira&apos;s gadget
            picker
          </strong>
          , which is served from{" "}
          <Code>shaileshchaudhari.vercel.app/statuspulse/icon-144.png</Code> —
          the same site as this policy.
        </p>
        <p className={P}>
          Atlassian requires a dashboard gadget&apos;s icon to be given as an
          absolute URL, so it cannot be bundled inside the app. When you open
          the gadget picker, your browser fetches that image the way it fetches
          any image on the web, which means the server hosting it sees the
          request.{" "}
          <strong className={STRONG}>
            No Jira data, no issue content and nothing identifying you is sent
            with it
          </strong>
          , and the app&apos;s own code makes no external request of any kind.
        </p>
        <p className={P}>
          We mention a 144-pixel picture in a privacy policy because the
          alternative is claiming an absolute that is not quite true, and a
          claim like that is worth less than the thing it was protecting.
        </p>

        <h2 className={H2}>Permissions the app requests</h2>
        <ul className={UL}>
          <Item>
            <Code>read:jira-work</Code> — to read the issues and status history
            your query matches. Read-only: StatusPulse cannot create, edit,
            transition or delete anything in your Jira.
          </Item>
          <Item>
            <Code>storage:app</Code> — to save your report settings, as
            described above.
          </Item>
          <Item>
            <Code>report:personal-data</Code> — once a week, to tell Atlassian
            which account ids have saved settings, so the settings of anyone
            whose Atlassian account has been closed are deleted. Nothing else is
            sent.
          </Item>
        </ul>
        <p className={P}>
          <strong className={STRONG}>
            read:jira-work grants more than StatusPulse uses, and your security
            reviewer should know that before they find it.
          </strong>{" "}
          It is Jira&apos;s broad read permission and covers a large part of the
          read API. StatusPulse calls exactly two endpoints:
        </p>
        <ul className={UL}>
          <Item>
            <Code>POST /rest/api/3/search/jql</Code> — the issues your query
            matches, requesting only the fields listed under &ldquo;What the app
            reads&rdquo;, plus the changelog
          </Item>
          <Item>
            <Code>GET /rest/api/3/status</Code> — the list of status names and
            categories on your site, which is what makes cycle time work without
            configuration and keeps a renamed status from appearing twice
          </Item>
        </ul>
        <p className={P}>
          Both are made <strong className={STRONG}>as you</strong>, with your
          permissions, so StatusPulse never sees an issue you could not open.
        </p>
        <p className={P}>
          We use the broad scope deliberately. Atlassian&apos;s own scope
          documentation recommends classic scopes over the narrower granular
          ones, and a scope change after listing — in either direction — is a
          major version that every site administrator has to approve. Asking
          once, and telling you exactly what is called, is the honest version of
          that trade.
        </p>
        <p className={P}>
          If a future version needs a different permission, Atlassian requires a
          major version upgrade that a site administrator must explicitly
          approve. Permissions cannot expand silently.
        </p>

        <h2 className={H2}>Data retention and deletion</h2>
        <p className={P}>
          Your settings persist until you change or delete them, or the app is
          uninstalled.
        </p>
        <ul className={UL}>
          <Item>
            <strong className={STRONG}>Clear my saved settings</strong> on the
            StatusPulse page deletes yours, immediately, and nobody else&apos;s.
          </Item>
          <Item>
            <strong className={STRONG}>
              Closed accounts are cleaned up automatically.
            </strong>{" "}
            Once a week the app reports the account ids that have saved settings
            to Atlassian&apos;s personal-data reporting service and deletes the
            settings of every account Atlassian reports as closed.
          </Item>
          <Item>
            <strong className={STRONG}>
              Uninstalling StatusPulse removes all of its stored data.
            </strong>
          </Item>
        </ul>
        <p className={P}>
          We have no access to the app storage on your site, so we cannot delete
          one person&apos;s saved settings on request; that person can, with the
          button above, and a site admin removes everyone&apos;s by uninstalling
          the app.
        </p>
        <p className={P}>
          Because no issue data is ever stored, there is nothing else to retain
          or delete.
        </p>

        <h2 className={H2}>Sub-processors</h2>
        <p className={P}>
          None. The app has no external dependencies at runtime and no
          third-party services.
        </p>

        <h2 className={H2}>Changes to this policy</h2>
        <p className={P}>
          If this changes materially, the updated date above changes and the
          change is described in the app&apos;s release notes. A change that
          expands what is collected would also require the permission upgrade
          described above, which an administrator must approve.
        </p>

        <h2 className={H2}>Contact</h2>
        <p className={P}>
          Questions, or anything that looks wrong: use the support contact on
          the Marketplace listing, or the{" "}
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
