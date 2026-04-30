import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "What I'm doing now — Shailesh Chaudhari";
const DESCRIPTION =
  "A Now page (nownownow.com convention) — what Shailesh Chaudhari is currently focused on at work and on the side. Updated periodically.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/now` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/now`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("Now")}&type=page&description=${encodeURIComponent("What I'm focused on this month")}`,
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

// Updated: 2026-04-30
const lastUpdated = "April 30, 2026";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Now", item: `${SITE_URL}/now` },
  ],
};

export default function NowPage() {
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
          What I&apos;m doing now
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          A{" "}
          <a
            href="https://nownownow.com/about"
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            Now page
          </a>
          {" "}— a single source of truth for what I&apos;m actively working on
          this month, beyond the project portfolio. Recruiters and friends
          asking &quot;what are you up to&quot; get a current answer instead of
          a months-old LinkedIn post.
        </p>

        <h2 className="mt-12 text-2xl font-bold">At work — ContextQA</h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">Test execution engine:</strong>{" "}
              backend work on the QA-automation orchestrator — Playwright /
              WebdriverIO / LambdaTest job scheduling, retry semantics, artifact collection.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">VNC streaming:</strong>{" "}
              piping live test sessions from headless browsers to the dashboard for visual debugging.
            </span>
          </li>
        </ul>

        <h2 className="mt-12 text-2xl font-bold">On the side</h2>
        <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">SEO / GEO / AEO sweep</strong>{" "}
              across every public project — favicons, OG images, JSON-LD,
              FAQ schema, llms.txt for AI crawlers. The infrastructure work
              behind landing in the right results when recruiters search.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">razorpay-patterns-demo:</strong>{" "}
              India-accessible sibling of stripe-payments-demo. Phase 1 (HMAC
              + idempotency) live; Phase 2 (BillingAccount + subscriptions)
              merged into KhataGO.
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>
              <strong className="font-semibold text-foreground">Open to part-time / freelance:</strong>{" "}
              particularly distributed systems, payment infrastructure,
              real-time platforms, AI-pipeline backends. Targeting Stripe,
              Vercel, Supabase as next employer.
            </span>
          </li>
        </ul>

        <h2 className="mt-12 text-2xl font-bold">Reading / learning</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Distributed systems patterns from{" "}
          <em>Designing Data-Intensive Applications</em>; Stripe / Square
          engineering blogs on idempotency and webhook design; the Vercel
          edge runtime docs to better understand the constraints my Vercel-deployed
          NestJS apps run under.
        </p>

        <div className="mt-16 flex flex-wrap gap-4 border-t pt-8">
          <Link href="/portfolio" className="underline underline-offset-4 hover:text-primary">
            See the projects →
          </Link>
          <Link href="/blogs" className="underline underline-offset-4 hover:text-primary">
            Read the blog →
          </Link>
          <Link href="/contact" className="underline underline-offset-4 hover:text-primary">
            Get in touch →
          </Link>
        </div>
      </div>
    </>
  );
}
