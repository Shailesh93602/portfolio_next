import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "StatusPulse — Terms of Service | Shailesh Chaudhari";
const DESCRIPTION =
  "Terms of service for StatusPulse, an Atlassian Jira Cloud app providing time in status, SLA tracking, and cycle time reporting.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/statuspulse/terms` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/statuspulse/terms`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("StatusPulse Terms")}&type=page&description=${encodeURIComponent("Terms of Service")}`,
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
      name: "Terms of Service",
      item: `${SITE_URL}/statuspulse/terms`,
    },
  ],
};

const H2 = "mt-12 text-2xl font-bold";
const P = "mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg";

export default function StatusPulseTermsPage() {
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
          StatusPulse — Terms of Service
        </h1>
        <p className={P}>
          These Terms of Service govern your installation and use of StatusPulse
          (&quot;the App&quot;), an Atlassian Marketplace app developed by
          Shailesh Chaudhari. By installing or utilizing the App in Jira Cloud,
          you agree to these terms.
        </p>

        <h2 className={H2}>1. Service Description</h2>
        <p className={P}>
          StatusPulse is a native Jira Cloud reporting application that computes
          time in status, cycle times, and SLA breach metrics against your
          working calendar. It runs within the Atlassian Forge execution
          environment.
        </p>

        <h2 className={H2}>2. Privacy & Data Ownership</h2>
        <p className={P}>
          You retain full ownership and control over all data in your Jira Cloud
          instance. StatusPulse does not replicate, store, or transmit your
          issue data to external infrastructure. For detailed privacy practices,
          consult our{" "}
          <Link
            href="/statuspulse/privacy"
            className="text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <h2 className={H2}>3. License & Acceptable Use</h2>
        <p className={P}>
          We grant you a non-exclusive, worldwide, revocable license to install
          and use StatusPulse on your authorized Jira Cloud instances in
          accordance with Atlassian Marketplace Terms of Use. You agree not to
          attempt to reverse engineer, bypass security controls, or misuse the
          App.
        </p>

        <h2 className={H2}>4. Availability & Support</h2>
        <p className={P}>
          StatusPulse relies on Atlassian Forge runtime infrastructure and Jira
          Cloud availability. While we strive for maximum reliability, the App
          is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
          basis. Support is provided via email at{" "}
          <a
            href="mailto:shailesh93602@gmail.com"
            className="text-primary underline underline-offset-4"
          >
            shailesh93602@gmail.com
          </a>{" "}
          with a standard response window of 24–48 business hours.
        </p>

        <h2 className={H2}>
          5. Disclaimer of Warranties & Limitation of Liability
        </h2>
        <p className={P}>
          To the maximum extent permitted by applicable law, the author
          disclaims all warranties, express or implied. In no event shall the
          author be liable for any indirect, incidental, or consequential
          damages resulting from your use or inability to use the App.
        </p>

        <h2 className={H2}>6. Contact</h2>
        <p className={P}>
          For legal inquiries, feedback, or support requests regarding these
          Terms, please reach out via{" "}
          <Link
            href="/statuspulse/contact"
            className="text-primary underline underline-offset-4"
          >
            our support desk
          </Link>{" "}
          or email{" "}
          <a
            href="mailto:shailesh93602@gmail.com"
            className="text-primary underline underline-offset-4"
          >
            shailesh93602@gmail.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
