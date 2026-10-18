import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "StatusPulse — Troubleshooting | Shailesh Chaudhari";
const DESCRIPTION =
  "Fixes for StatusPulse, the Jira time-in-status app: a blank app frame, rejected JQL, the 200-issue cap, partial history, renamed statuses and gadget mismatches.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse/troubleshooting` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse/troubleshooting`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("StatusPulse Troubleshooting")}&type=page&description=${encodeURIComponent("Time in Status, SLA & Cycle Time for Jira")}`,
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

// Source copy: dwell/docs/troubleshooting.md. Every message quoted here is a
// string the app emits (dwell/src/resolvers/jira.js, src/engine/jiraPaging.ts).
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
      name: "Troubleshooting",
      item: `${SITE_URL}/statuspulse/troubleshooting`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";
const UL =
  "mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg";
const OL =
  "mt-4 list-decimal space-y-3 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg";
const STRONG = "font-semibold text-foreground";
// Wraps instead of scrolling: a scrolling <pre> would need to be a focus stop.
const PRE =
  "mt-4 whitespace-pre-wrap break-all rounded bg-muted p-4 font-mono text-sm text-foreground";

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

export default function StatusPulseTroubleshootingPage() {
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
          StatusPulse — Troubleshooting
        </h1>
        <p className={P}>
          <Link href="/statuspulse" className="underline underline-offset-4">
            Back to documentation
          </Link>
        </p>

        <h2 className={H2}>
          The app shows a blank page or a loading placeholder that never
          finishes
        </h2>
        <p className={P}>
          <strong className={STRONG}>
            Almost always a DNS or network problem on your side, not the app.
          </strong>
        </p>
        <p className={P}>
          Forge apps — every app on the Atlassian Marketplace built on Forge,
          not just this one — load their interface from{" "}
          <Code>*.cdn.prod.atlassian-dev.net</Code>. If your network cannot
          resolve or reach that domain, Jira draws the frame and then waits for
          an app that never loads. You get an empty panel with no error message,
          which is a genuinely unhelpful failure and not one an app author can
          improve.
        </p>
        <p className={P}>
          <strong className={STRONG}>How to confirm it in ten seconds.</strong>{" "}
          In a terminal:
        </p>
        <pre className={PRE}>nslookup probe.cdn.prod.atlassian-dev.net</pre>
        <p className={P}>
          If that returns an address, DNS is fine and the problem is elsewhere.
          If it returns nothing or <Code>NXDOMAIN</Code>, that is your answer.
        </p>
        <p className={P}>
          <strong className={STRONG}>
            How to fix it, in order of likelihood:
          </strong>
        </p>
        <ol className={OL}>
          <li>
            <strong className={STRONG}>
              Your router or ISP DNS does not resolve the domain.
            </strong>{" "}
            Point the machine at a public resolver. On macOS:
            <pre className={PRE}>
              {`sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 1.1.1.1
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`}
            </pre>
            On Windows, set DNS to <Code>8.8.8.8</Code> and <Code>1.1.1.1</Code>{" "}
            in the adapter&apos;s IPv4 properties.
          </li>
          <li>
            <strong className={STRONG}>A corporate firewall or proxy.</strong>{" "}
            Ask IT to allow <Code>*.cdn.prod.atlassian-dev.net</Code>. Atlassian
            documents this domain as required for Forge apps to run. It is also
            worth excluding <Code>*.atlassian.com</Code>,{" "}
            <Code>*.atlassian.net</Code> and <Code>*.atl-paas.net</Code> from
            TLS inspection.
          </li>
          <li>
            <strong className={STRONG}>A browser extension.</strong> Ad blockers
            and privacy extensions sometimes block third-party frames. Pause
            them for your Jira site and reload.
          </li>
          <li>
            <strong className={STRONG}>A DNS-filtering service</strong> such as
            a Pi-hole, NextDNS or OpenDNS with an aggressive blocklist.
          </li>
        </ol>
        <p className={P}>
          <strong className={STRONG}>How to be sure it is not the app:</strong>{" "}
          open Chrome DevTools, go to Console, and use the frame selector at the
          top left, which normally reads <Code>top</Code>. If the app&apos;s
          frame shows as <Code>chromewebdata</Code>, that is Chrome&apos;s error
          page — the frame never loaded, so no app code ever ran. Nothing an app
          author changes can affect that.
        </p>

        <h2 className={H2}>&ldquo;Jira rejected the search&rdquo;</h2>
        <p className={P}>
          The JQL is not valid, or you cannot see the projects it names. The
          message includes Jira&apos;s own explanation, which is usually more
          precise than anything we could add. Try the same query in Jira&apos;s
          issue search first.
        </p>

        <h2 className={H2}>&ldquo;Showing the first 200 issues&rdquo;</h2>
        <p className={P}>
          A report is capped at 200 issues so it cannot time out halfway and
          show you nothing. Narrow the query by project, date range or issue
          type. Two accurate reports beat one truncated one.
        </p>

        <h2 className={H2}>
          Some issues are marked &ldquo;partial history&rdquo;
        </h2>
        <p className={P}>
          Jira caps how much changelog it returns alongside a search, and it
          returns the <strong className={STRONG}>most recent</strong> entries
          first. So for a long-lived, heavily-edited issue what StatusPulse
          cannot see is that issue&apos;s <em>early</em> life.
        </p>
        <p className={P}>
          StatusPulse measures those issues from the oldest entry Jira did send,
          and charges the unknown period to no status. Their totals are a{" "}
          <strong className={STRONG}>lower bound</strong> — real time in status
          is at least that much, possibly more — and never an over-count. This
          is surfaced rather than hidden so you know which rows to treat
          carefully.
        </p>

        <h2 className={H2}>
          A row says &ldquo;Done&rdquo; but the time next to it looks enormous
        </h2>
        <p className={P}>
          It should not, any more. Before this was fixed, an issue with a
          truncated changelog had its whole unmeasured early life charged to
          whichever status sat at the edge of what Jira returned. If you see a
          number that cannot be right, send us the issue key — the calculation
          is deterministic, so one example reproduces it exactly.
        </p>

        <h2 className={H2}>
          The StatusPulse icon is missing from the gadget picker
        </h2>
        <p className={P}>
          Atlassian requires a dashboard gadget&apos;s icon to be given as a web
          address, so it is served from{" "}
          <Code>shaileshchaudhari.vercel.app/statuspulse/icon-144.png</Code>{" "}
          rather than from inside the app. If your network blocks that address
          the gadget still works perfectly — only its picture is missing.
          Nothing about your Jira is sent when the browser fetches it.
        </p>

        <h2 className={H2}>The numbers look too small</h2>
        <p className={P}>
          Check the <strong className={STRONG}>Measure</strong> setting. On{" "}
          <em>Working hours</em> a ticket raised on Friday evening and resolved
          Monday morning shows a few hours, not three days, because that is what
          actually happened. If your team genuinely works around the clock,
          switch to <em>Calendar time</em>.
        </p>
        <p className={P}>
          Then check your <strong className={STRONG}>holidays</strong> list. A
          holiday is excluded entirely, so a ticket sitting across Diwali or
          Christmas will show less time than the calendar suggests.
        </p>

        <h2 className={H2}>The numbers look too big</h2>
        <p className={P}>
          Check the working day. A day defined as <Code>00:00</Code>–
          <Code>23:59</Code> counts everything. Check the working week too:
          &ldquo;No weekend — all seven days&rdquo; does what it says.
        </p>

        <h2 className={H2}>
          Status names are missing or the report is empty for a non-English Jira
        </h2>
        <p className={P}>
          It should not be. StatusPulse matches status changes on Jira&apos;s
          stable internal field identifier as well as the visible field name,
          specifically so localised instances work. If you see this, it is a bug
          we want to hear about, with your site language.
        </p>

        <h2 className={H2}>A status we renamed appears twice in the report</h2>
        <p className={P}>
          It should not. Jira records the name a status had at the time of each
          transition, so a rename leaves one status wearing two names in the
          history — and StatusPulse rewrites every recorded name to the name
          that status has today, using the identifiers Jira sends alongside the
          names.
        </p>
        <p className={P}>
          There are two cases where it can still happen, and the report says so
          in both:
        </p>
        <ul className={UL}>
          <Item>
            <strong className={STRONG}>
              StatusPulse could not read your site&apos;s status list.
            </strong>{" "}
            You will see the warning{" "}
            <em>
              &ldquo;Could not read Jira&apos;s status list, so cycle time is
              not shown and a status renamed at some point may appear as two
              rows.&rdquo;
            </em>{" "}
            Cycle time will be missing too. It is a permissions or availability
            problem on the <Code>/rest/api/3/status</Code> endpoint.
          </Item>
          <Item>
            <strong className={STRONG}>
              The status was deleted, not renamed.
            </strong>{" "}
            A status Jira no longer knows about keeps the name your history
            recorded, because the alternative is losing the row entirely.
          </Item>
        </ul>
        <p className={P}>
          If neither applies, tell us the two names you are seeing — that is a
          bug.
        </p>

        <h2 className={H2}>The gadget shows different numbers from the page</h2>
        <p className={P}>
          For one person, it should not be able to: the gadget calls the same
          code with the same saved settings. If they disagree, the page&apos;s
          settings were changed and not saved — press{" "}
          <strong className={STRONG}>Save these settings</strong> on the page
          and reload the dashboard.
        </p>
        <p className={P}>
          <strong className={STRONG}>
            Two people looking at the same dashboard is a different question,
            and the answer is by design.
          </strong>{" "}
          Settings are saved against your Atlassian account, not against the
          site or the dashboard, so each viewer&apos;s gadget runs{" "}
          <em>their own</em> saved JQL and working calendar. On a shared
          dashboard that means two people can genuinely see two different
          reports, and neither is wrong.
        </p>
        <p className={P}>
          It works that way because a shared setting would be wrong for
          somebody: two people on one Jira often work different hours, and
          quietly measuring one of them against the other&apos;s calendar is
          exactly the failure this app exists to avoid. If your team needs one
          agreed number on a wall display, agree the query and have everyone
          save the same one — or tell us. A gadget with its own configuration is
          a considered feature we have not built, not an oversight.
        </p>

        <h2 className={H2}>Reporting something we have not covered</h2>
        <p className={P}>
          Tell us the JQL, the settings you used, and roughly what you expected.
          If you can include an issue key where the number looks wrong, that is
          the fastest possible bug report: the calculation is deterministic, so
          one example is usually enough to reproduce it exactly. Use the{" "}
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
