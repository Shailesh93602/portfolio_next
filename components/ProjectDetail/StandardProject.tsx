"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import {
  ArrowLeftIcon,
  CodeIcon,
  BriefcaseIcon,
  StarIcon,
  CheckIcon,
} from "@/components/icons";
import { fadeInOnScroll } from "@/lib/animations";
import ArchitectureDiagram from "@/components/Showcase/ArchitectureDiagram";
import CaseStudyCard from "./CaseStudyCard";
import StandardSidebar from "./StandardSidebar";

function StandardHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* A generated /api/og cover has the title baked in as text; drawn
          full-bleed it shows a ghost copy of the H1 behind the real one. */}
      {project.image.startsWith("/api/og") ? (
        <div
          data-testid="hero-gradient"
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
        />
      ) : (
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover brightness-[0.4]"
          priority
        />
      )}
      {/* The fade into the page reads over a photo; over the plain gradient
          it washes the white H1 and tags out in light mode. */}
      {!project.image.startsWith("/api/og") && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      )}

      <div className="container relative flex h-full flex-col justify-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/portfolio"
            className="group mb-6 inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Portfolio
          </Link>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** A titled main-column section that fades in on scroll. */
function MainSection({
  delay,
  icon,
  title,
  className = "space-y-6",
  children,
}: {
  delay: number;
  icon: ReactNode;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section {...fadeInOnScroll(delay)} className={className}>
      <h2 className="flex items-center gap-3 text-3xl font-bold">
        {icon}
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function FeatureGrid({ features }: { features: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <div
          key={feature}
          className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50"
        >
          <div className="flex items-start gap-3">
            <CheckIcon className="mt-0.5 h-5 w-5 text-primary opacity-50 transition-opacity group-hover:opacity-100" />
            <span className="text-muted-foreground transition-colors group-hover:text-foreground">
              {feature}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const sectionIcon = "h-8 w-8 text-primary";

function StandardMain({ project }: { project: Project }) {
  return (
    <div className="space-y-16 lg:col-span-2">
      <MainSection
        delay={0.2}
        icon={<BriefcaseIcon className={sectionIcon} />}
        title="Engineering Overview"
      >
        <p className="text-lg leading-relaxed text-muted-foreground">
          {project.detailedDescription || project.description}
        </p>
      </MainSection>

      {project.problem && (
        <CaseStudyCard
          kind="problem"
          text={project.problem}
          as="section"
          rounded="rounded-2xl"
        />
      )}
      {project.solution && (
        <CaseStudyCard
          kind="solution"
          text={project.solution}
          as="section"
          rounded="rounded-2xl"
        />
      )}

      {project.challengesSolved && (
        <MainSection
          delay={0.4}
          icon={<CodeIcon className={sectionIcon} />}
          title="Key Engineering Challenges"
        >
          <div className="space-y-4 rounded-2xl border border-border bg-card p-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.challengesSolved}
            </p>
          </div>
        </MainSection>
      )}

      {project.features && (
        <MainSection
          delay={0.5}
          icon={<StarIcon className={sectionIcon} />}
          title="Core Capabilities"
        >
          <FeatureGrid features={project.features} />
        </MainSection>
      )}

      {project.architecture && (
        <MainSection
          delay={0.6}
          icon={<CodeIcon className={sectionIcon} />}
          title="System Architecture"
          className="space-y-6 pt-8"
        >
          <ArchitectureDiagram architecture={project.architecture} />
        </MainSection>
      )}
    </div>
  );
}

/** The two-column layout used for projects that are not `isShowcase`. */
export default function StandardProject({ project }: { project: Project }) {
  return (
    <article className="min-h-screen bg-background pb-20">
      <StandardHero project={project} />

      <div className="container mt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <StandardMain project={project} />
          <StandardSidebar project={project} />
        </div>
      </div>
    </article>
  );
}
