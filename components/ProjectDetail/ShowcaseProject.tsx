"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import KeyMetrics from "@/components/Showcase/KeyMetrics";
import CaseStudyCard from "./CaseStudyCard";
import ShowcaseHero from "./ShowcaseHero";
import ShowcaseArchitecture from "./ShowcaseArchitecture";
import ShowcaseScreens from "./ShowcaseScreens";
import ShowcaseNarrative from "./ShowcaseNarrative";
import ShowcaseIncidents from "./ShowcaseIncidents";

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}

function ShowcaseFooter() {
  return (
    <section className="py-20 text-center">
      <div className="mx-auto max-w-3xl space-y-8">
        <h2 className="text-4xl font-bold italic tracking-tight">
          Interested in the full engineering breakdown?
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground">
          Happy to talk through the technical decisions, from state management
          strategies to infrastructure scaling.
        </p>
        {/* flex-wrap: two `size="lg"` buttons with px-10 are ~480px together,
            so on a 390px screen the row pushed the page into horizontal
            scroll instead of stacking. */}
        <div className="flex flex-wrap justify-center gap-6 pt-8">
          <Button
            asChild
            size="lg"
            className="h-16 rounded-full px-10 text-lg font-bold"
          >
            <Link href="/contact">Start a Discussion</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-16 rounded-full px-10 text-lg font-bold"
          >
            <Link href="/portfolio">Explore Other Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/** The immersive case-study layout used for `isShowcase` projects. */
export default function ShowcaseProject({ project }: { project: Project }) {
  return (
    <article className="min-h-screen bg-background">
      <ScrollProgressBar />
      <ShowcaseHero project={project} />

      <div className="container space-y-32 py-24">
        <section>
          <h2 className="mb-12 text-center text-sm font-black uppercase tracking-[0.4em] text-primary">
            Performance & Impact
          </h2>
          <KeyMetrics metrics={project.keyMetrics} />
        </section>

        <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {project.problem && (
            <CaseStudyCard kind="problem" text={project.problem} />
          )}
          {project.solution && (
            <CaseStudyCard kind="solution" text={project.solution} />
          )}
        </section>

        <ShowcaseArchitecture project={project} />
        <ShowcaseScreens project={project} />
        <ShowcaseNarrative project={project} />
        <ShowcaseIncidents incidents={project.incidents} />
        <ShowcaseFooter />
      </div>
    </article>
  );
}
