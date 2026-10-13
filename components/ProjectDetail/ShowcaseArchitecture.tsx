"use client";

import { motion } from "framer-motion";
import type { Project } from "@/constants/projects";
import { CodeIcon, CheckIcon } from "@/components/icons";
import { fadeInOnScroll } from "@/lib/animations";
import ArchitectureDiagram from "@/components/Showcase/ArchitectureDiagram";

/** "System Architecture": the long description, top three features, diagram. */
export default function ShowcaseArchitecture({
  project,
}: {
  project: Project;
}) {
  return (
    <section className="space-y-16">
      <div className="mb-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div {...fadeInOnScroll(0.2)} className="space-y-8">
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
          {...fadeInOnScroll(0.3)}
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
  );
}
