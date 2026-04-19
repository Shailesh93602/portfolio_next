"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
  SiHackerrank,
  SiLinkedin,
  SiGithub,
  SiX,
} from "react-icons/si";
import { Download, Briefcase } from "lucide-react";
import SocialLink from "./components/SocialLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/constants";

const skills = [
  "TypeScript",
  "React.js",
  "Node.js",
  "Next.js",
  "MongoDB",
  "Express.js",
  "Tailwind CSS",
  "PostgreSQL",
];

interface Props {
  featuredPosts: {
    slug: string;
    title: string;
    description: string;
    image: string;
    readTime: string;
    tags: string[];
    date: string;
  }[];
}

export default function HomeContent({ featuredPosts }: Props) {
  return (
    <div>
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:w-1/2"
          >
            <div className="space-y-2">
              <Badge variant="outline" className="text-sm font-medium">
                Available for hire · Open to part-time & freelance
              </Badge>
              <h1 className="text-foreground text-4xl font-bold lg:text-6xl">
                Hi, I&apos;m Shailesh Chaudhari
              </h1>
              <h2 className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-semibold leading-tight text-transparent sm:text-3xl lg:text-3xl">
                Full-stack engineer with a backend focus
              </h2>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">
              ~2.5 years in the industry. Currently at ContextQA working on
              the backend of our core QA-automation product — test execution
              engine, VNC streaming, and multi-cloud browser orchestration
              across Playwright / WebdriverIO / LambdaTest. Comfortable across
              the stack from my EsparkBiz client-project days, but I go deep
              on backend systems: distributed locks (Redlock), real-time
              pub/sub (Socket.io + Redis adapter), webhook idempotency (SETNX),
              AI pipelines (Gemini function-calling). Targeting backend,
              platform, or developer-tooling roles.
            </p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Open to part-time, freelance (hourly or project-based) work —
              <Link href="/contact" className="ml-1 text-primary underline">
                contact me
              </Link>
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-primary/25"
              >
                <Link href="/contact">
                  <Briefcase className="mr-2 inline-block h-4 w-4" />
                  Hire Me
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 transition-all duration-300 hover:bg-primary/10"
              >
                <Link
                  href="/Shailesh_Chaudhari_Resume.pdf"
                  target="_blank"
                  download
                >
                  <Download className="mr-2 inline-block h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <SocialLink
                href={SOCIAL_LINKS.LINKEDIN}
                icon={<SiLinkedin className="h-5 w-5" />}
                label="LinkedIn"
              />
              <SocialLink
                href={SOCIAL_LINKS.GITHUB}
                icon={<SiGithub className="h-5 w-5" />}
                label="GitHub"
              />
              <SocialLink
                href={SOCIAL_LINKS.TWITTER}
                icon={<SiX className="h-5 w-5" />}
                label="X"
              />
              <SocialLink
                href={SOCIAL_LINKS.CODECHEF}
                icon={<SiCodechef className="h-5 w-5" />}
                label="CodeChef"
              />
              <SocialLink
                href={SOCIAL_LINKS.HACKERRANK}
                icon={<SiHackerrank className="h-5 w-5" />}
                label="HackerRank"
              />
              <SocialLink
                href={SOCIAL_LINKS.LEETCODE}
                icon={<SiLeetcode className="h-5 w-5" />}
                label="LeetCode"
              />
              <SocialLink
                href={SOCIAL_LINKS.GEEKSFORGEEKS}
                icon={<SiGeeksforgeeks className="h-5 w-5" />}
                label="GeeksforGeeks"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:w-1/2 lg:justify-end"
          >
            <div className="relative h-72 w-72 overflow-hidden rounded-full lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl" />
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                fill
                priority
                sizes="(max-width: 768px) 288px, 500px"
                className="profile-glow rounded-full border-4 border-primary/20 object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Side projects I'm building */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary/70">
            Side projects
          </p>
          <h2 className="text-foreground text-3xl font-bold lg:text-4xl">
            Things I&apos;m building to learn
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Outside of my day job, these are the small-to-medium projects I work
            on to explore specific backend patterns end-to-end.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              tag: "stripe-payments-demo",
              title: "Webhook idempotency patterns",
              proof:
                "Demo project exploring Stripe webhook handling: Redis SETNX on event IDs with 24h TTL, exponential backoff retry that skips 4xx, and 29 tests covering the duplicate-delivery edge cases.",
              href: "/portfolio/stripe-payments-demo",
              cta: "See the Stripe demo",
            },
            {
              tag: "eduscale",
              title: "Real-time coding platform",
              proof:
                "Side project with 1v1 coding battles. Uses Redlock over Redis to prevent duplicate battle starts, @socket.io/redis-adapter for horizontal scaling, opossum circuit breaker, and prom-client /metrics.",
              href: "/portfolio/eduscale",
              cta: "See how EduScale works",
            },
            {
              tag: "devtrack",
              title: "Dev-productivity dashboard",
              proof:
                "Tracks coding time + streaks with Supabase Realtime postgres_changes for the live activity feed, optimistic UI with rollback on auth failure, and sub-second multi-tab sync indicator.",
              href: "/portfolio/devtrack",
              cta: "See DevTrack's realtime",
            },
          ].map((card, index) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={card.href}
                className="group block h-full rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-foreground mb-3 text-xl font-bold transition-colors group-hover:text-primary">
                  {card.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {card.proof}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  {card.cta}
                  <span
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="text-foreground mb-4 text-3xl font-bold lg:text-4xl">
            Featured Articles
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Dive into my latest insights on software development,
            problem-solving, and career growth.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.slice(0, 3).map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg group-hover:scale-105">
                  <div className="mb-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-foreground mb-3 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/blogs">View All Articles</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
