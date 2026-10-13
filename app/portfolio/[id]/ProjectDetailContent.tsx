"use client";

import type { Project } from "@/constants/projects";
import ShowcaseProject from "@/components/ProjectDetail/ShowcaseProject";
import StandardProject from "@/components/ProjectDetail/StandardProject";

interface Props {
  project: Project;
}

/** Showcase projects get the immersive case study; the rest the two-column page. */
export default function ProjectDetailContent({ project }: Props) {
  return project.isShowcase ? (
    <ShowcaseProject project={project} />
  ) : (
    <StandardProject project={project} />
  );
}
