"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon, ExternalLinkIcon } from "@/components/icons";

function SourceLink({ project }: { project: Project }) {
  if (!project.github) return null;
  if (project.githubPrivate) {
    return (
      <div
        className="flex h-12 w-full items-center justify-start rounded-md border border-dashed px-4 text-base text-muted-foreground"
        title="This repository is private"
      >
        <GithubIcon className="mr-3 h-5 w-5" />
        Private repository
      </div>
    );
  }
  return (
    <Button asChild className="h-12 w-full justify-start text-base">
      <a href={project.github} target="_blank" rel="noopener noreferrer">
        <GithubIcon className="mr-3 h-5 w-5" />
        View Source
      </a>
    </Button>
  );
}

/** Sticky "Quick Actions" card: source + live links, tech stack, contact. */
export default function StandardSidebar({ project }: { project: Project }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="sticky top-24 rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/20"
      >
        <h3 className="mb-6 text-xl font-bold">Quick Actions</h3>
        <div className="space-y-4">
          <SourceLink project={project} />
          {project.live && (
            <Button
              asChild
              variant="outline"
              className="h-12 w-full justify-start text-base"
            >
              <a href={project.live} target="_blank" rel="noopener noreferrer">
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
  );
}
