import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "StatusPulse Support Desk | Shailesh Chaudhari";
const DESCRIPTION =
  "Official customer support, technical inquiries, and feedback desk for StatusPulse — Time in Status, SLA & Cycle Time for Jira.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse/contact` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse/contact`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("StatusPulse Support")}&type=page&description=${encodeURIComponent("Customer Support & Inquiries")}`,
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
      name: "Customer Support",
      item: `${SITE_URL}/statuspulse/contact`,
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

export default function StatusPulseContactPage() {
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
          StatusPulse Support Desk
        </h1>
        <p className={P}>
          Welcome to the official support channel for{" "}
          <Link
            href="/statuspulse"
            className="font-medium text-foreground underline underline-offset-4"
          >
            StatusPulse
          </Link>{" "}
          on the Atlassian Marketplace. We are dedicated to ensuring your Jira
          team gets prompt assistance.
        </p>

        <h2 className={H2}>Direct Support Channels</h2>
        <div className="mt-6 rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">
            Email Support
          </h3>
          <p className="mt-2 text-muted-foreground">
            For bug reports, technical inquiries, feedback, or custom timezone
            requests:
          </p>
          <p className="mt-4 font-mono text-lg font-semibold text-primary">
            <a
              href="mailto:shailesh93602@gmail.com?subject=[StatusPulse%20Support]"
              className="underline underline-offset-4"
            >
              shailesh93602@gmail.com
            </a>
          </p>
          <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
            <strong>Response SLA:</strong> We respond within{" "}
            <strong>24 to 48 business hours</strong> (Monday through Friday).
          </div>
        </div>

        <h2 className={H2}>Helpful Resources</h2>
        <ul className={UL}>
          <Item>
            <Link
              href="/statuspulse"
              className="font-medium text-foreground underline underline-offset-4"
            >
              User Guide & Documentation
            </Link>{" "}
            — Detailed instructions for running reports, calendar definitions,
            and dashboard gadgets.
          </Item>
          <Item>
            <Link
              href="/statuspulse/privacy"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Privacy Policy
            </Link>{" "}
            — Security overview, in-tenant Forge hosting, and data handling
            details.
          </Item>
          <Item>
            <Link
              href="/statuspulse/terms"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            — App licensing and service expectations.
          </Item>
        </ul>

        <h2 className={H2}>Reporting a Calculation Discrepancy</h2>
        <p className={P}>
          When emailing regarding a calculation question or potential bug,
          including the following details allows us to isolate the issue
          immediately:
        </p>
        <ul className={UL}>
          <Item>The JQL query used.</Item>
          <Item>
            Your configured working calendar (timezone, start/end times, and
            excluded days).
          </Item>
          <Item>
            An example Jira issue key showing the unexpected duration.
          </Item>
        </ul>
      </div>
    </>
  );
}
