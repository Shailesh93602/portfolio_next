export { metadata } from "./metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

const hireMeta = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Freelance Web Development",
  provider: { "@id": `${SITE_URL}/#person` },
  serviceType: "Full-Stack Web Development",
  areaServed: "Worldwide",
  description:
    "Full-stack web development services: Next.js apps, Node.js backends, Chrome extensions, and real-time systems.",
};

export default function HirePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hireMeta) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Hire {BLOG_AUTHOR.name}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Software Engineer at ContextQA, working on the backend of our core
            QA-automation product (test execution engine, VNC streaming,
            Playwright / WebdriverIO / LambdaTest orchestration). First 2-3
            months at ContextQA I shipped 2 Chrome extensions (Vibe Testing,
            AxeTos). Previously ~2 years at EsparkBiz shipping full-stack client
            projects end-to-end. Side projects explore distributed systems
            (Redlock, Socket.io Redis adapter), AI pipelines (Gemini
            function-calling + OCR), and webhook idempotency patterns.
            TypeScript everywhere, correctness first.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight sm:text-3xl">
            What I work on
          </h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  Full-stack web apps
                </strong>{" "}
                — Next.js + Node.js / NestJS, Prisma, PostgreSQL
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  Chrome extensions
                </strong>{" "}
                — content scripts, service workers, DevTools panels, backend
                APIs
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  Real-time systems
                </strong>{" "}
                — Socket.io with Redis adapter for horizontal scaling,
                distributed locks
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  AI integrations
                </strong>{" "}
                — Gemini AI, pgvector semantic search, OCR pipelines, webhook
                deduplication
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  Performance
                </strong>{" "}
                — Core Web Vitals, bundle analysis, ISR vs edge caching, AVIF
                optimization
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>
                <strong className="font-semibold text-foreground">
                  Database design
                </strong>{" "}
                — PostgreSQL (RBAC, RLS), MongoDB, Prisma, Supabase
              </span>
            </li>
          </ul>

          <h2 className="mt-10 text-2xl font-bold tracking-tight sm:text-3xl">
            How I work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            I prefer small, shippable iterations over big-bang deliveries. I
            share working code early, flag blockers quickly, and write tests
            for anything that needs to stay working. I&apos;m remote-first and
            async-friendly.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight sm:text-3xl">
            Rates &amp; availability
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Open to project-based fixed-price work and hourly retainers.
            Part-time availability alongside my full-time role. Contact me and
            we can figure out what makes sense for your project.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact">
              <Button size="lg">Contact Me</Button>
            </Link>
            <a
              href="/Shailesh_Chaudhari_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="lg">
                View Resume
              </Button>
            </a>
          </div>

          {/* Explicit end-of-page CTA — prose-heavy pages need a second,
              visually louder call-to-action so scrollers never hit a dead end.
              Contact form + direct email + LinkedIn all one click away. */}
          <div className="mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5 p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Send a one-line description of what you&apos;re building and the
              rough timeline. I&apos;ll reply within a day or two with whether
              it&apos;s a fit and what it would take.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact">
                <Button size="lg">Start a conversation</Button>
              </Link>
              <a
                href={`mailto:${CONTACT_INFO.EMAIL}?subject=${encodeURIComponent(
                  "Project inquiry"
                )}`}
              >
                <Button variant="outline" size="lg">
                  Email directly
                </Button>
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button variant="ghost" size="lg">
                  LinkedIn
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Typical reply time: under 48 hours · Remote, async-friendly
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
