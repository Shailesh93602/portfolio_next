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
        <div className="text-center mb-12 transition-transform duration-500">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Featured <span className="text-primary italic">Milestones</span></h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            High-impact engineering solutions that bridge the gap between complex problems and elegant code.
          </p>
        </div>

        <div className="space-y-16">
          {/* Hero Project Highlight */}
          {projects.length > 0 && (
            <div className="relative group rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-700 hover:shadow-primary/20 hover:border-primary/40 ring-1 ring-white/5 hover:ring-primary/20">
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />
              
              <Link href={`/portfolio/${projects[0].id}`} className="flex flex-col lg:flex-row relative z-10">
                <div className="relative h-72 lg:h-[520px] lg:w-[60%] overflow-hidden">
                  <Image
                    src={projects[0].image}
                    alt={projects[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent hidden lg:block" />
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent lg:hidden" />
                  
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <div className="flex gap-2">
                       <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-2xl">
                        Featured
                      </span>
                      <span className="px-4 py-1.5 bg-black/60 backdrop-blur-xl text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                        Showcase
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-4 uppercase tracking-widest opacity-80">
                    <span className="w-8 h-[1px] bg-primary" />
                    Project Analysis
                  </div>
                  <h3 className="text-4xl lg:text-6xl font-black mb-8 group-hover:text-primary transition-colors leading-[1.1] tracking-tighter">
                    {projects[0].title}
                  </h3>
                  <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl font-medium">
                    {projects[0].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 mb-10">
                    {projects[0].tags.slice(0, 6).map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-secondary/50 backdrop-blur-sm text-secondary-foreground border border-border/50 rounded-xl text-xs font-bold transition-colors hover:border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Button size="lg" asChild className="px-10 h-14 text-base font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                      <Link href={`/portfolio/${projects[0].id}`}>
                        Deep Dive into Case Study
                      </Link>
                    </Button>
                    {projects[0].live && (
                      <Button variant="outline" size="lg" asChild className="px-10 h-14 text-base font-bold bg-transparent border-2 border-border hover:border-primary hover:text-primary rounded-2xl active:scale-95 transition-all">
                        <Link href={projects[0].live} target="_blank" rel="noopener noreferrer">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.slice(1).map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-[2rem] border border-border bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:border-primary/20"
              >
                <Link href={`/portfolio/${project.id}`} className="block">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs font-mono opacity-50">0{projects.indexOf(project) + 1}</span>
                    </div>
                    <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[10px] font-bold rounded-lg bg-secondary text-secondary-foreground uppercase tracking-widest border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
                <div className="px-8 pb-8 flex gap-3">
                  <Button variant="outline" size="sm" asChild className="flex-1 hover:bg-primary/10 rounded-xl h-10 font-bold border-border/50 transition-all hover:border-primary/50">
                    <Link href={`/portfolio/${project.id}`}>
                      Details
                    </Link>
                  </Button>
                  {project.github && (
                    <Button variant="outline" size="sm" asChild className="p-2 w-10 h-10 hover:bg-primary/10 rounded-xl border-border/50 transition-all hover:border-primary/50 flex items-center justify-center">
                      <a href={project.github} target="_blank" rel="noopener noreferrer" title="View Source">
                        <GithubIcon className="w-5 h-5 text-muted-foreground group-hover/btn:text-primary" />
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
