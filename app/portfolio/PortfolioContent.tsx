"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { XIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { projects } from "@/constants/projects";
import { PortfolioSkeleton } from "./PortfolioSkeleton";


const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function PortfolioContent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setSelectedTags([]);
  };

  const filteredProjects = selectedTags.length
    ? projects.filter((project) =>
        selectedTags.some((tag) => project.tags.includes(tag))
      )
    : projects;

  if (isLoading) {
    return <PortfolioSkeleton />;
  }

  return (
    <div className="container py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn(0.2)}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My <span className="text-primary italic">Projects</span>
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          A showcase of engineering excellence, from distributed systems to AI-driven tools.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1)}
      >
        {/* Filter Section */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <h3 className="text-lg font-semibold">
              Filter by Technology:
            </h3>
            {selectedTags.length > 0 && (
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full"
              >
                <XIcon className="w-4 h-4" />
                Show All
              </Button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredProjects.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center text-muted-foreground py-20 bg-card/30 rounded-[2rem] border border-dashed border-border"
          >
            No projects match the selected filters.
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer(0.05)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredProjects.map((project) => {
              const isShowcase = project.isShowcase;
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className={`${isShowcase ? 'md:col-span-2 lg:col-span-2' : ''} group h-full`}
                >
                  <Card className="h-full relative overflow-hidden bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-[2rem]">
                    <Link href={`/portfolio/${project.id}`} className="flex flex-col h-full">
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {isShowcase && (
                          <div className="absolute top-6 left-6">
                            <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-2xl">
                              Showcase Project
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-8 line-clamp-3 leading-relaxed font-medium">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.tags.slice(0, 6).map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest rounded-xl bg-secondary/80 text-secondary-foreground border border-border/50"
                            >
                              {techMap(tag)}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Helper to shorten long tag names in the grid
function techMap(tag: string) {
  if (tag.length > 15) return tag.substring(0, 12) + "...";
  return tag;
}
