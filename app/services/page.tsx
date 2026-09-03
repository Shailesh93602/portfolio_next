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
import { BLOG_AUTHOR } from "@/lib/blog-constants";

// A neutral "what I work on" page. This route used to be a client-facing
// services landing page (intake CTA, reply-time promise). That aimed the site
// at contract work, which is not what it is for; the URL stays because /hire
// and /hire-me have redirected here for years.
const areas: {
  icon: LucideIcon;
  title: string;
  blurb: string;
}[] = [
  {
    icon: Layers,
    title: "Backend systems in TypeScript/Node",
    blurb:
      "Multi-tenant services, queues and workers, idempotent APIs. Node.js with Express or NestJS, Prisma, PostgreSQL, Redis — typed end to end and tested where it matters.",
  },
  {
    icon: Radio,
    title: "Real-time systems",
    blurb:
      "Socket.io with the Redis adapter across multiple instances, distributed locks for the operations that must happen once, presence and live updates.",
  },
  {
    icon: Sparkles,
    title: "Applied AI inside products",
    blurb:
      "Gemini function/tool calling, multi-model fallback, per-key isolation, bring-your-own-key encryption, evals, MCP tools, and pgvector retrieval that says “I don’t know”.",
  },
  {
    icon: ShieldCheck,
    title: "Webhooks and idempotency",
    blurb:
      "At-least-once delivery turned into exactly-once effects: a unique constraint and an atomic claim in the database rather than a cache that can drift from the truth.",
  },
  {
    icon: Gauge,
    title: "Verification that asserts outcomes",
    blurb:
      "Deterministic simulation, property tests, mutation testing, and a preference for tests that check the row changed over tests that check the page rendered.",
  },
  {
    icon: Database,
    title: "Frontend that passes an audit",
    blurb:
      "React and Next.js with Tailwind and shadcn/ui, checked against WCAG 2.1 AA with axe on every route in CI, in both themes.",
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          What I work on
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          I&apos;m {BLOG_AUTHOR.name}, a software engineer who likes building
          backends that hold up under load. These are the kinds of problems I
          spend my time on, at work and on my own projects. TypeScript
          everywhere, correctness first, shipped in small iterations.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {areas.map(({ icon: Icon, title, blurb }) => (
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
          Async-first and written-first. I share working code early, flag
          blockers as soon as I see them, and write tests for anything that
          needs to keep working. When something is subtly wrong with code that
          already passes its tests, I would rather find it than ship it — the{" "}
          <Link
            href="/engineering"
            className="underline underline-offset-4 hover:text-primary"
          >
            engineering page
          </Link>{" "}
          is a list of the times that mattered.
        </p>

        <p className="mt-10 text-sm text-muted-foreground">
          Questions about any of this?{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 hover:text-primary"
          >
            Get in touch
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
