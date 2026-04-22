"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  CodeIcon,
  BriefcaseIcon,
  StarIcon,
  CheckIcon,
} from "@/components/icons";
import { fadeIn } from "@/lib/animations";
import ArchitectureDiagram from "@/components/Showcase/ArchitectureDiagram";
import KeyMetrics from "@/components/Showcase/KeyMetrics";
import ThemeComparison from "@/components/Showcase/ThemeComparison";
import StripeCaseStudy from "@/components/Showcase/StripeCaseStudy";

import { Badge } from "@/components/ui/badge";

interface Props {
  project: Project;
}

export default function ProjectDetailContent({ project }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (project.isShowcase) {
    return (
      <article className="min-h-screen bg-background">
        <motion.div
          className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-primary"
          style={{ scaleX }}
        />

        {/* Immersive Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="scale-105 object-cover brightness-[0.3]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

          <div className="container relative flex h-full flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl space-y-6"
            >
              <Link
                href="/portfolio"
                className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/80 transition-colors hover:text-primary"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Featured Project
              </Link>
              <h1 className="break-words text-[2.5rem] font-black uppercase italic leading-none tracking-tighter text-white sm:text-6xl md:text-8xl">
                {project.title}
              </h1>
              <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-white/70 md:text-2xl">
                {project.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {project.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-center gap-4 pt-8">
                {project.live && (
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-full px-8 text-lg font-bold"
                  >
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Launch Experience{" "}
                      <ExternalLinkIcon className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-full border-white/10 bg-white/5 px-8 text-lg font-bold text-white hover:bg-white/10"
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="mr-2 h-5 w-5" /> Repository
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Scroll to Explore
            </span>
            <div className="h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        <div className="container space-y-32 py-24">
          {/* Key Metrics Section */}
          <section>
            <h2 className="mb-12 text-center text-sm font-black uppercase tracking-[0.4em] text-primary">
              Performance & Impact
            </h2>
            <KeyMetrics metrics={project.keyMetrics} />
          </section>

          {/* Problem & Solution Section */}
          <section className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {project.problem && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.25)}
                className="space-y-4 rounded-[2rem] border border-destructive/10 bg-destructive/5 p-8"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <StarIcon className="h-5 w-5 rotate-45 text-destructive" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">
                    The Problem
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.problem}
                </p>
              </motion.div>
            )}

            {project.solution && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-4 rounded-[2rem] border border-primary/10 bg-primary/5 p-8"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    The Solution
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.solution}
                </p>
              </motion.div>
            )}
          </section>

          {/* Deep Dive & Architecture */}
          <section className="space-y-16">
            <div className="mb-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.2)}
                className="space-y-8"
              >
                <div className="mb-2 inline-flex rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                  <CodeIcon className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight md:text-5xl">
                  System Architecture
                </h3>
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {project.detailedDescription}
                </p>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-4 rounded-[2rem] border border-border bg-card p-8 text-muted-foreground"
              >
                <p className="mb-6 text-lg font-semibold text-foreground">
                  Core Engineering Achievements:
                </p>
                <div className="space-y-4">
                  {project.features?.slice(0, 3).map((f) => (
                    <div key={f.split(":")[0]} className="flex gap-3">
                      <CheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                      <span className="leading-relaxed">{f.split(":")[0]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <ArchitectureDiagram architecture={project.architecture} />
          </section>

          {/* Unified Visual Showcase / High Fidelity Presentation */}
          {project.showcases && project.showcases.length > 0 && (
            <section className="space-y-16">
              <div className="mx-auto mb-20 max-w-3xl space-y-4 text-center">
                <h2 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
                  Visual Showcase
                </h2>
                <p className="text-xl leading-relaxed text-muted-foreground">
                  A high-fidelity walkthrough of the core interfaces and user
                  experiences, designed with modern aesthetics.
                </p>
              </div>

              <div className="space-y-32">
                {project.showcases.map((showcase, idx) => (
                  <motion.div
                    key={showcase.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
                  >
                    <div
                      className={`space-y-6 lg:col-span-4 ${idx % 2 === 1 ? "lg:order-2" : ""}`}
                    >
                      <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-black text-primary">
                        0{idx + 1}
                      </div>
                      <h3 className="text-3xl font-bold">{showcase.title}</h3>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        {showcase.description}
                      </p>
                    </div>

                    <div
                      className={`relative lg:col-span-8 ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                    >
                      <div className="absolute inset-0 scale-90 rounded-full bg-primary/5 blur-[100px]" />

                      <div className="glassmorphism relative z-10 w-full rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/10 to-transparent p-4 shadow-2xl">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-black ring-1 ring-white/10">
                          {showcase.imageDark && showcase.imageLight ? (
                            <ThemeComparison
                              title=""
                              darkImage={showcase.imageDark}
                              lightImage={showcase.imageLight}
                            />
                          ) : (
                            <Image
                              src={
                                showcase.image ||
                                showcase.imageDark ||
                                showcase.imageLight ||
                                ""
                              }
                              alt={showcase.title}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-1000 hover:scale-[1.02]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Legacy Gallery fallback for other Showcase Projects */}
          {(!project.showcases || project.showcases.length === 0) &&
            project.gallery &&
            project.gallery.length > 0 && (
              <section className="space-y-12">
                <div className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
                  <h2 className="text-4xl font-bold uppercase italic tracking-tight md:text-5xl">
                    Project Gallery
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">
                    A visual walkthrough of the platform's core interfaces and
                    user experiences.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {project.gallery.map((img, idx) => (
                    <motion.div
                      key={img}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative aspect-video overflow-hidden rounded-3xl border border-border shadow-2xl"
                    >
                      {img.endsWith(".webm") || img.endsWith(".mp4") ? (
                        <video
                          src={img}
                          className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <Image
                          src={img}
                          alt={`${project.title} screenshot ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-8 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm font-bold uppercase tracking-wider text-white">
                          View Full Resolution
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          {/* Development Narrative */}
          <section className="group relative overflow-hidden rounded-[3rem] border border-border bg-card p-12 md:p-20">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px] transition-colors group-hover:bg-primary/10" />
            <div className="relative z-10 grid grid-cols-1 gap-20 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
                    The Engineering Challenge
                  </h4>
                  <h3 className="line-clamp-3 text-3xl font-bold leading-tight">
                    {project.challengesSolved?.split("?")[0]}
                  </h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 text-lg italic leading-relaxed text-muted-foreground">
                    &quot;{project.challengesSolved}&quot;
                  </div>
                  {project.id === "eduscale" && (
                    <div className="flex gap-6">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-foreground">
                          Next.js 15
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Framework
                        </p>
                      </div>
                      <div className="h-10 w-px bg-border" />
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-foreground">
                          PostgreSQL
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Engine
                        </p>
                      </div>
                      <div className="h-10 w-px bg-border" />
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-primary">High</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                          Complexity
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
                    User Journey
                  </h4>
                  <div className="space-y-8 pt-4">
                    {project.userFlow?.map((step) => (
                      <div
                        key={step.step}
                        className="group/step flex items-start gap-6"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-black text-primary transition-all group-hover/step:bg-primary group-hover/step:text-white">
                          {(project.userFlow?.indexOf(step) ?? 0) + 1}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                            {step.step}
                          </p>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {project.id === "stripe-payments-demo" && (
            <section className="py-4">
              <StripeCaseStudy />
            </section>
          )}

          {/* Incidents — real bugs + fixes, shown when the project has any */}
          {project.incidents && project.incidents.length > 0 && (
            <section className="space-y-12">
              <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/80">
                  Incidents &amp; fixes
                </p>
                <h2 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
                  Real bugs, real fixes
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The case-study sections above cover what the system does
                  well. These are the times it didn&apos;t — what broke, what
                  I got wrong on the first hypothesis, and how we confirmed
                  the fix held.
                </p>
              </div>

              <div className="space-y-8">
                {project.incidents.map((incident, idx) => (
                  <motion.article
                    key={incident.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="overflow-hidden rounded-[2rem] border border-border bg-card"
                  >
                    <header className="flex items-center gap-4 border-b border-border bg-muted/30 px-8 py-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl font-bold md:text-2xl">
                        {incident.title}
                      </h3>
                    </header>
                    <div className="grid gap-10 px-8 py-8 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-destructive/80">
                          Symptom
                        </p>
                        <p className="leading-relaxed text-foreground">
                          {incident.symptom}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                          First hypothesis (and where it went wrong)
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                          {incident.hypothesis}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-primary">
                          Fix
                        </p>
                        <p className="leading-relaxed text-foreground">
                          {incident.fix}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-primary/70">
                          Confirmed by
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                          {incident.confirmed}
                        </p>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* Action Footer */}
          <section className="py-20 text-center">
            <div className="mx-auto max-w-3xl space-y-8">
              <h2 className="text-4xl font-bold italic tracking-tight">
                Interested in the full engineering breakdown?
              </h2>
              <p className="text-xl leading-relaxed text-muted-foreground">
                I'm always open to discussing technical implementations, from
                state management strategies to infrastructure scaling.
              </p>
              <div className="flex justify-center gap-6 pt-8">
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
        </div>
      </article>
    );
  }

  // Fallback for non-showcase projects (Existing generic UI)
  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

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

      <div className="container mt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-16 lg:col-span-2">
            {/* Project Overview */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.2)}
              className="space-y-6"
            >
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <BriefcaseIcon className="h-8 w-8 text-primary" />
                Engineering Overview
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {project.detailedDescription || project.description}
              </p>
            </motion.section>

            {/* Problem Section */}
            {project.problem && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.25)}
                className="space-y-4 rounded-2xl border border-destructive/10 bg-destructive/5 p-8"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-destructive/10 p-2">
                    <StarIcon className="h-5 w-5 rotate-45 text-destructive" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">
                    The Problem
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.problem}
                </p>
              </motion.section>
            )}

            {/* Solution Section */}
            {project.solution && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-4 rounded-2xl border border-primary/10 bg-primary/5 p-8"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <CheckIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    The Solution
                  </h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {project.solution}
                </p>
              </motion.section>
            )}

            {/* Engineering Challenges */}
            {project.challengesSolved && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.4)}
                className="space-y-6"
              >
                <h2 className="flex items-center gap-3 text-3xl font-bold">
                  <CodeIcon className="h-8 w-8 text-primary" />
                  Key Engineering Challenges
                </h2>
                <div className="space-y-4 rounded-2xl border border-border bg-card p-8">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {project.challengesSolved}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Features Feed */}
            {project.features && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.5)}
                className="space-y-6"
              >
                <h2 className="flex items-center gap-3 text-3xl font-bold">
                  <StarIcon className="h-8 w-8 text-primary" />
                  Core Capabilities
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {project.features.map((feature) => (
                    <div
                      key={feature}
                      className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50"
                    >
                      <div className="flex items-start gap-3">
                        <CheckIcon className="mt-0.5 h-5 w-5 text-primary opacity-50 transition-opacity group-hover:opacity-100" />
                        <span className="group-hover:text-foreground text-muted-foreground transition-colors">
                          {feature}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Architecture Diagram for Non-Showcase */}
            {project.architecture && (
              <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.6)}
                className="space-y-6 pt-8"
              >
                <h2 className="flex items-center gap-3 text-3xl font-bold">
                  <CodeIcon className="h-8 w-8 text-primary" />
                  System Architecture
                </h2>
                <ArchitectureDiagram architecture={project.architecture} />
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-24 rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/20"
            >
              <h3 className="mb-6 text-xl font-bold">Quick Actions</h3>
              <div className="space-y-4">
                {project.github && (
                  <Button
                    asChild
                    className="h-12 w-full justify-start text-base"
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="mr-3 h-5 w-5" />
                      View Source
                    </a>
                  </Button>
                )}
                {project.live && (
                  <Button
                    asChild
                    variant="outline"
                    className="h-12 w-full justify-start text-base"
                  >
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLinkIcon className="mr-3 h-5 w-5" />
                      Live Preview
                    </a>
                  </Button>
                )}
              </div>

              <hr className="my-8 border-border" />

              <h3 className="mb-4 text-lg font-bold">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <hr className="my-8 border-border" />

              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Inquiry
                </h4>
                <p className="text-sm text-muted-foreground">
                  Interested in discussing this engineering approach?
                </p>
                <Button
                  asChild
                  variant="link"
                  className="h-auto px-0 font-bold text-primary hover:text-primary/80"
                >
                  <Link href="/contact">Message Shailesh →</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
}
