import type { Metadata } from "next";
import Link from "next/link";

import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "How I verify — Shailesh Chaudhari";
const DESCRIPTION =
  "Real bugs found in my own production code, and why each one looked correct. Deterministic simulation, mutation testing, and the difference between a passing test and a proven outcome.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/engineering` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/engineering`,
    type: "website",
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent("How I verify")}&type=page&description=${encodeURIComponent("Real bugs, and why each looked correct")}`,
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "How I verify",
      item: `${SITE_URL}/engineering`,
    },
  ],
};

interface Finding {
  readonly title: string;
  readonly looked: string;
  readonly was: string;
  readonly lesson: string;
  readonly where: string;
  readonly href: string;
}

/**
 * Every entry links to a PUBLIC write-up — the repo's FINDINGS.md when the
 * repo is public, the blog post telling the same story when it is not
 * (KhataGO is currently private). The point of the page is that it is all
 * checkable; a link that 404s for a visitor defeats it. When KhataGO goes
 * public, point its entries back at its FINDINGS.md.
 */
const findings: readonly Finding[] = [
  {
    title: "A test that asserted nothing for months",
    looked:
      "A green integration test scraping a rendered invoice for its GST figures.",
    was: "An i18n change split one text node into several, so React inserted HTML comment separators into the markup. The probe matched nothing, and a missing value read as zero — the test read the tax as zero against a stored ₹152.54.",
    lesson:
      "A test that reaches through a framework's rendered output is coupled to that framework's rendering decisions, and it fails silently by matching nothing.",
    where: "KhataGO",
    href: "/blog/a-passing-test-only-proves-the-test-passes",
  },
  {
    title: "A lock with no way out of it",
    looked:
      "A correct atomic claim: one conditional UPDATE, two concurrent deliveries, only one winner.",
    was: "There was no path back out. A process that died mid-run left the record claimed forever, and nothing could distinguish an abandoned claim from one still legitimately running.",
    lesson:
      "Mutual exclusion and liveness are different properties. Passing tests for the first say nothing about the second — a lock without an expiry is a deadlock waiting for a crash.",
    where: "KhataGO",
    href: "/blog/khatago-webhook-deduplication-receipt-pipeline",
  },
  {
    title: "An idempotency guard that was not one",
    looked:
      "Documented as idempotent, and idempotent in every sequential test.",
    was: "A read-then-write with no unique constraint behind it. Two concurrent requests both missed the read and both made a paid LLM call. The tell was already in the code — it ordered results by date, which only matters if duplicates can exist.",
    lesson:
      "Code that copes with a condition is evidence someone knew it could happen. Prevent it at the constraint, and let the read be a fast path.",
    where: "EduScale",
    href: "https://github.com/Shailesh93602/DevScale/blob/main/FINDINGS.md",
  },
  {
    title: "A safety guard whose allow-list matched production",
    looked:
      "A guard I had just written to stop tests touching the production database.",
    was: 'I allow-listed the database name "postgres" because it is the default for a CI container. Production is also named "postgres" — so the check would have waved it straight through.',
    lesson:
      "An allow-list whose most permissive entry matches the thing you are guarding against is not an allow-list. This one is mine, found the same week I wrote it.",
    where: "EduScale",
    href: "https://github.com/Shailesh93602/DevScale/blob/main/FINDINGS.md",
  },
  {
    title: "Migrations that never ran",
    looked:
      "A build script that generates the database client on every deploy.",
    was: "Generating the client rebuilds types from the schema; it never touches the database. Deploys shipped code whose types knew about columns that did not exist. One repo had four unapplied migrations in production.",
    lesson:
      "Before making every deploy run migrations I checked what production's migration table actually contained, and found rows with no matching files. Reproducing that drift locally first is the only reason the fix did not break every deploy.",
    where: "KhataGO + EduScale",
    href: "https://github.com/Shailesh93602/DevScale/blob/main/FINDINGS.md",
  },
  {
    title: "Six bugs, half of them in the checker",
    looked: "A verification harness finding bugs in the system under test.",
    was: "As many of them were in the harness. One invariant fired on correctly-refused operations because the checker was consuming the system's own account of what it had done — a checker that trusts the thing it is checking is not a checker.",
    lesson:
      "The most useful thing deterministic simulation taught me was to distrust the oracle as much as the implementation.",
    where: "BALLAST",
    href: "https://github.com/Shailesh93602/ballast/blob/main/docs/LEDGER.md",
  },
];

export default function EngineeringPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          How I verify
        </h1>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
          Anyone can ship a feature now. What is harder — and what I think is
          actually worth showing — is catching the thing that is subtly wrong
          with code that already compiles, already passes its tests, and already
          got reviewed.
        </p>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          These are real defects from my own production code. Several are
          mistakes I made myself and found later. Every one links to a public
          write-up — the repo it came from, or the blog post that tells the full
          story — so none of it has to be taken on trust.
        </p>

        <div className="mt-12 space-y-10">
          {findings.map((finding) => (
            <article
              key={finding.title}
              className="border-l-2 border-primary/30 pl-5"
            >
              <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                {finding.where}
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                {finding.title}
              </h2>

              <dl className="mt-4 space-y-3 text-sm leading-relaxed sm:text-base">
                <div>
                  <dt className="font-medium text-muted-foreground">
                    What it looked like
                  </dt>
                  <dd className="mt-1">{finding.looked}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    What it actually did
                  </dt>
                  <dd className="mt-1">{finding.was}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">
                    What it taught me
                  </dt>
                  <dd className="mt-1">{finding.lesson}</dd>
                </div>
              </dl>

              <a
                href={finding.href}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm underline underline-offset-4 hover:text-primary"
              >
                Read the full write-up →
              </a>
            </article>
          ))}
        </div>

        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            Written up at length
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Three of these have full write-ups, with the diagnosis rather than
            just the conclusion.
          </p>
          <ul className="mt-5 space-y-3">
            {[
              {
                href: "/blog/a-passing-test-only-proves-the-test-passes",
                title: "A passing test only proves the test passes",
                blurb:
                  "Five cases where a green suite was checking something the running code never did — and the question that finds them.",
              },
              {
                href: "/blog/mutation-score-was-100-percent-because-tests-were-broken",
                title:
                  "My mutation score was 100%. That's how I knew something was wrong.",
                blurb:
                  "A mutant is killed when the suite fails — so if the suite already fails, every mutant is killed.",
              },
              {
                href: "/blog/khatago-webhook-deduplication-receipt-pipeline",
                title: "Why we didn't use Redis for webhook deduplication",
                blurb:
                  "SETNX splits the claim from the truth. A crash between them leaves the event permanently claimed and unretryable.",
              },
            ].map((post) => (
              <li key={post.href}>
                <Link
                  href={post.href}
                  className="font-medium underline underline-offset-4 hover:text-primary"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.blurb}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            The thing they have in common
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Most of these were invisible to the type system and to the test
            suite, and several looked <em>more</em> correct in their broken form
            than the fix does. A lock with no expiry looks simpler than one that
            handles staleness. A build step that generates a database client
            looks like it handles the database.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            What found them was not a tool. It was asking, of code that was
            already passing:{" "}
            <strong className="text-foreground">
              what would have to be true for this to be wrong, and is anything
              checking that?
            </strong>
          </p>
        </section>

        {/*
          The site itself as evidence.
          
          Every finding above is about someone else's code — including my own
          past code. This section is the one place the reader can check the
          claim against the thing they are currently looking at.

          Deliberately no test COUNT and no score: a number in page copy is a
          chore that fails on every new test and passes for every bug that
          matters, which is the exact mistake called out in the first finding on
          this page. The gates themselves are stable facts; the numbers behind
          them live in CI where they are re-derived rather than asserted.
        */}
        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            This page, and the site around it
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            It would be a strange thing to write all of the above on a site that
            was not held to it. So, on every pull request:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <li>
              •{" "}
              <strong className="text-foreground">
                Every route is audited with axe against WCAG 2.1 AA
              </strong>{" "}
              — in light and dark, not just the happy theme. Violations fail the
              build.
            </li>
            <li>
              • <strong className="text-foreground">Performance budgets</strong>{" "}
              for LCP, CLS and total blocking time fail the build too, rather
              than being reported and ignored.
            </li>
            <li>
              •{" "}
              <strong className="text-foreground">
                A daily job re-checks the claims on this site
              </strong>{" "}
              against the repositories they point at. When a number here stops
              matching its source, it opens as a failure rather than quietly
              becoming untrue — every false claim it has caught started life as
              a true one.
            </li>
            <li>
              •{" "}
              <strong className="text-foreground">
                A second daily job opens every outbound link
              </strong>
              , because a portfolio full of dead links is the cheapest possible
              way to undermine everything else on it.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
