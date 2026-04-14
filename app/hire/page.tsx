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
            I&apos;m a Software Engineer who builds full-stack web applications,
            Chrome extensions, and real-time systems. I write TypeScript, ship
            fast, and don&apos;t disappear after the first PR.
          </p>

          <h2>What I work on</h2>
          <ul>
            <li>
              Full-stack web apps — Next.js frontend, Node.js / Express backend
            </li>
            <li>
              Chrome extensions (content scripts, service workers, backend APIs)
            </li>
            <li>
              Real-time features — Socket.io, Redis pub/sub, event-driven queues
            </li>
            <li>
              Performance work — Core Web Vitals, bundle analysis, edge caching
            </li>
            <li>Database design — PostgreSQL, MongoDB, Prisma, Supabase</li>
            <li>API integrations — REST, third-party SDKs, WebSockets</li>
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
