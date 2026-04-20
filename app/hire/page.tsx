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
      <div className="container mx-auto px-4 py-12">
        <div className="prose prose-invert mx-auto max-w-3xl">
          <h1>Hire {BLOG_AUTHOR.name}</h1>
          <p>
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

          <h2>What I work on</h2>
          <ul>
            <li>
              Full-stack web apps — Next.js + Node.js / NestJS, Prisma,
              PostgreSQL
            </li>
            <li>
              Chrome extensions — content scripts, service workers, DevTools
              panels, backend APIs
            </li>
            <li>
              Real-time systems — Socket.io with Redis adapter for horizontal
              scaling, distributed locks
            </li>
            <li>
              AI integrations — Gemini AI, pgvector semantic search, OCR
              pipelines, webhook deduplication
            </li>
            <li>
              Performance — Core Web Vitals, bundle analysis, ISR vs edge
              caching, AVIF optimization
            </li>
            <li>
              Database design — PostgreSQL (RBAC, RLS), MongoDB, Prisma,
              Supabase
            </li>
          </ul>

          <h2>How I work</h2>
          <p>
            I prefer small, shippable iterations over big-bang deliveries. I
            share working code early, flag blockers quickly, and write tests for
            anything that needs to stay working. I&apos;m remote-first and
            async-friendly.
          </p>

          <h2>Rates &amp; availability</h2>
          <p>
            Open to project-based fixed-price work and hourly retainers.
            Part-time availability alongside my full-time role. Contact me and
            we can figure out what makes sense for your project.
          </p>

          <div className="not-prose mt-8 flex gap-4">
            <Link href="/contact">
              <Button>Contact Me</Button>
            </Link>
            <a
              href="/Shailesh_Chaudhari_Resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline">View Resume</Button>
            </a>
          </div>

          {/* Explicit end-of-page CTA — prose-heavy pages need a second,
              visually louder call-to-action so scrollers never hit a dead end.
              Contact form + direct email + LinkedIn all one click away. */}
          <div className="not-prose mt-16 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5 p-8 text-center">
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
