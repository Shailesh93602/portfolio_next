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
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
            >
              <Link href={`/portfolio/${project.id}`} className="block">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <div className="px-6 pb-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1 hover:bg-primary/10">
                    <Link href={`/portfolio/${project.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {project.github && (
                    <Button variant="outline" size="sm" asChild className="flex-1 hover:bg-primary/10">
                      <Link href={project.github} target="_blank">
                        <GithubIcon className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

          ))}
        </div>
      </div>
    </section>
  );
}
