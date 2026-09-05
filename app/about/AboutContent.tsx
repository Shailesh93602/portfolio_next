"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { itemVariants } from "@/constants";
import { PROFILE } from "@/lib/profile";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import AchievementsSection from "@/components/Achievements";
import SkillsSection from "@/components/SkillsSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// There is no expand/collapse toggle on this page any more. The content was
// already open by default, so the only thing the toggle ever rendered was a
// full-width "Show Less" card under the closing quote — a control for hiding
// the experience and education a visitor came here to read.
export default function AboutContent() {
  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center gap-16 lg:flex-row lg:items-start"
      >
        <motion.div
          variants={itemVariants}
          className="flex w-full justify-center lg:w-1/3"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 animate-pulse rounded-full bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] opacity-75 blur"></div>
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full">
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                width={300}
                height={300}
                className="profile-glow h-full w-full rounded-full border-4 border-background object-cover shadow-lg"
                priority
              />
            </div>
          </div>
        </motion.div>
        <div className="w-full lg:w-2/3">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            <div className="mb-8 space-y-4">
              <h1 className="text-5xl font-bold">
                About <span className="text-primary">Me</span>
              </h1>
              {/* <h2 className="text-3xl font-semibold text-primary">
                Fullstack Developer
              </h2> */}
              <motion.p
                variants={itemVariants}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                I&apos;m a Software Engineer from Patan, Gujarat, currently
                based in Ahmedabad. At ContextQA I work on the Node.js backend
                of the core QA-automation platform: a test-execution engine that
                orchestrates concurrent browser and mobile runs across
                Playwright, WebdriverIO and LambdaTest, live browser-session
                streaming over WebSockets, the integrations engine (GitHub App,
                GitLab and Linear OAuth, a Slack bot — made multi-tenant by
                moving OAuth state into Redis), and a session control plane on
                GKE with a pre-warmed pod pool, idempotent stop and request
                trace ids. The first 2-3 months I shipped 2 Chrome extensions
                (Vibe Testing, AxeTos) before moving to the core product. Before
                ContextQA, I spent {PROFILE.previousRole.tenure} building
                EdTech, e-commerce, and corporate training platforms end-to-end.
                On the side I explore distributed systems (Redlock, Socket.io
                Redis adapter, Prometheus metrics), deterministic simulation and
                mutation testing (BALLAST), AI pipelines (Gemini
                function-calling, OCR), and webhook idempotency patterns. I
                reach for correctness over convenience.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-12"
            >
              <ExperienceSection />

              <EducationSection />

              <AchievementsSection />
              <SkillsSection />
              {/* Replaced a borrowed aphorism ("Code is like humor...")
                  that implied the opposite of what he does — explaining his
                  work carefully is the thing he is best at. This says what
                  he actually values, in his own words, and links to the
                  evidence rather than asking to be taken on faith. */}
              <motion.blockquote
                variants={itemVariants}
                className="my-8 border-l-4 border-primary py-4 pl-6 text-lg text-muted-foreground"
              >
                <p className="italic">
                  &quot;I would rather ship something I can prove is correct
                  than something that looks clever. Almost every bug I am proud
                  of finding was in code that already compiled, already passed
                  its tests, and had already been reviewed.&quot;
                </p>
                <Link
                  href="/engineering"
                  className="mt-3 inline-block text-base not-italic underline underline-offset-4 hover:text-primary"
                >
                  The full list, and why each one looked correct &rarr;
                </Link>
              </motion.blockquote>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
