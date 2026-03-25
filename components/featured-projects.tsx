"use client";

import React from "react";
// framer-motion removed to reduce initial bundle size; use CSS transitions instead
import { GithubIcon } from "@/components/icons";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { projects as allProjects } from "@/constants/projects";

const projects = allProjects.slice(0, 3);

export function FeaturedProjects() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center transition-transform duration-500">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
            Featured <span className="italic text-primary">Milestones</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            High-impact engineering solutions that bridge the gap between
            complex problems and elegant code.
          </p>
        </div>

        <div className="space-y-16">
          {/* Hero Project Highlight */}
          {projects.length > 0 && (
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/5 transition-all duration-700 hover:border-primary/40 hover:shadow-primary/20 hover:ring-primary/20">
              {/* Decorative Glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-[100px] transition-colors duration-700 group-hover:bg-primary/20" />

              <Link
                href={`/portfolio/${projects[0].id}`}
                className="relative z-10 flex flex-col lg:flex-row"
              >
                <div className="relative h-72 overflow-hidden lg:h-[520px] lg:w-[60%]">
                  <Image
                    src={projects[0].image}
                    alt={projects[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 hidden bg-gradient-to-r from-background/90 via-background/20 to-transparent lg:block" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent lg:hidden" />

                  <div className="absolute left-8 top-8 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl">
                        Featured
                      </span>
                      <span className="rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-xl">
                        Showcase
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-center p-10 lg:p-14">
                  <div className="mb-4 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-primary opacity-80">
                    <span className="h-[1px] w-8 bg-primary" />
                    Project Analysis
                  </div>
                  <h3 className="mb-8 text-4xl font-black leading-[1.1] tracking-tighter transition-colors group-hover:text-primary lg:text-6xl">
                    {projects[0].title}
                  </h3>
                  <p className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground lg:text-xl">
                    {projects[0].description}
                  </p>

                  <div className="mb-10 flex flex-wrap gap-2.5">
                    {projects[0].tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-xl border border-border/50 bg-secondary/50 px-4 py-2 text-xs font-bold text-secondary-foreground backdrop-blur-sm transition-colors hover:border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      asChild
                      className="h-14 rounded-2xl px-10 text-base font-black shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95"
                    >
                      <Link href={`/portfolio/${projects[0].id}`}>
                        Deep Dive into Case Study
                      </Link>
                    </Button>
                    {projects[0].live && (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="h-14 rounded-2xl border-2 border-border bg-transparent px-10 text-base font-bold transition-all hover:border-primary hover:text-primary active:scale-95"
                      >
                        <Link
                          href={projects[0].live}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Application
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Secondary Projects Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {projects.slice(1).map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 shadow-xl backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:shadow-primary/5"
              >
                <Link href={`/portfolio/${project.id}`} className="block">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:rotate-1 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-2xl font-bold transition-colors group-hover:text-primary">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs opacity-50">
                        0{projects.indexOf(project) + 1}
                      </span>
                    </div>
                    <p className="mb-6 line-clamp-2 leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-border/50 bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className="flex gap-3 px-8 pb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-10 flex-1 rounded-xl border-border/50 font-bold transition-all hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Link href={`/portfolio/${project.id}`}>Details</Link>
                  </Button>
                  {project.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex h-10 w-10 items-center justify-center rounded-xl border-border/50 p-2 transition-all hover:border-primary/50 hover:bg-primary/10"
                    >
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View Source"
                      >
                        <GithubIcon className="h-5 w-5 text-muted-foreground group-hover/btn:text-primary" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
