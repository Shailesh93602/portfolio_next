export { metadata } from "./metadata";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";

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
            Software Engineer currently at ContextQA, where I&apos;ve shipped
            Chrome extensions with ~1,900 and ~1,600 merged PRs — automated
            testing and WCAG accessibility tooling. I build distributed systems
            (Redis cluster adapters, Redlock, circuit breakers), AI pipelines
            (Gemini OCR, vector search, webhook deduplication), and full-stack
            web apps. TypeScript everywhere, correctness first.
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
        </div>
      </div>
    </>
  );
}
