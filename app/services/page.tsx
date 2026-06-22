export { metadata } from "./metadata";
import Link from "next/link";
import {
  Layers,
  Radio,
  Sparkles,
  ShieldCheck,
  Gauge,
  Database,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";
import { CONTACT_INFO } from "@/lib/constants";

// Concise, personal-brand services overview. The detailed, business-facing
// version lives on the Exavel site; this is the "light" portfolio page.
const services: {
  icon: LucideIcon;
  title: string;
  blurb: string;
}[] = [
  {
    icon: Layers,
    title: "Full-stack web apps",
    blurb:
      "Next.js + Node.js / NestJS, Prisma, PostgreSQL. Typed end-to-end, tested where it matters.",
  },
  {
    icon: Radio,
    title: "Real-time systems",
    blurb:
      "Socket.io with the Redis adapter for horizontal scaling, distributed locks, presence, and live updates.",
  },
  {
    icon: Sparkles,
    title: "AI integrations",
    blurb:
      "Gemini function-calling, pgvector semantic search, RAG with citations, and OCR pipelines that stay grounded.",
  },
  {
    icon: ShieldCheck,
    title: "Payments & webhooks",
    blurb:
      "Idempotent webhook handling, HMAC verification, and reservation flows that never double-charge or oversell.",
  },
  {
    icon: Gauge,
    title: "Performance",
    blurb:
      "Core Web Vitals, bundle analysis, image and caching strategy — measurable wins, no Lighthouse theatre.",
  },
  {
    icon: Database,
    title: "Database design",
    blurb:
      "Schema design, RBAC / RLS, migrations, and query work on PostgreSQL, Prisma, and Supabase.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Software Engineering Services",
  provider: { "@id": `${SITE_URL}/#person` },
  serviceType: "Full-Stack Web Development",
  areaServed: "Worldwide",
  description:
    "Full-stack web apps, real-time systems, AI integrations, payments/webhook reliability, performance, and database design.",
  url: `${SITE_URL}/services`,
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Services
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I&apos;m {BLOG_AUTHOR.name}, a software engineer who likes building
            backends that hold up under load. Outside my full-time role I take
            on a small amount of part-time and freelance work — mostly the
            things below. TypeScript everywhere, correctness first, shipped in
            small iterations.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {services.map(({ icon: Icon, title, blurb }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon
                    aria-hidden
                    className="h-5 w-5 text-primary"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blurb}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mt-16 text-2xl font-bold tracking-tight sm:text-3xl">
            How I work
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Remote-first and async-friendly — I share working code early, flag
            blockers fast, and write tests for anything that needs to keep
            working. Open to fixed-price projects and hourly retainers,
            part-time alongside my full-time role.
          </p>

          {/* Single strong CTA to /contact so the page never dead-ends. */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-600/5 p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Have something to build?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Send a one-line description and a rough timeline. I&apos;ll reply
              within a day or two with whether it&apos;s a fit and what it would
              take.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Start a conversation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}?subject=${encodeURIComponent(
                    "Project inquiry"
                  )}`}
                >
                  Email directly
                </a>
              </Button>
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
