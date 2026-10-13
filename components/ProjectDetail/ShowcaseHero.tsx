"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import {
  GithubIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
} from "@/components/icons";

function RepositoryLink({ project }: { project: Project }) {
  if (!project.github) return null;
  if (project.githubPrivate) {
    // A private repo would 404. Saying so is better than a broken link AND
    // better than silently omitting it — an absent repo button reads as
    // "there is no code".
    return (
      <span
        className="inline-flex h-14 items-center rounded-full border border-white/10 bg-white/5 px-8 text-lg font-bold text-white/60"
        title="This repository is private"
      >
        <GithubIcon className="mr-2 h-5 w-5" /> Private repository
      </span>
    );
  }
  return (
    <Button
      asChild
      variant="outline"
      size="lg"
      className="h-14 rounded-full border-white/10 bg-white/5 px-8 text-lg font-bold text-white hover:bg-white/10"
    >
      <a href={project.github} target="_blank" rel="noopener noreferrer">
        <GithubIcon className="mr-2 h-5 w-5" /> Repository
      </a>
    </Button>
  );
}

/** Full-bleed hero for a showcase project: title, tags, launch + repo links. */
export default function ShowcaseHero({ project }: { project: Project }) {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="100vw"
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
            className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:text-primary/80"
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
            <RepositoryLink project={project} />
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
  );
}
