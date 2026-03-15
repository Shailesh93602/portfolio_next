"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { XIcon, SearchIcon, FilterIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { projects } from "@/constants/projects";
import { PortfolioSkeleton } from "./PortfolioSkeleton";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
};

export function PortfolioContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const allTags = useMemo(() => 
    Array.from(new Set(projects.flatMap((project) => project.tags))).sort((a, b) => a.localeCompare(b)),
    []
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
                          project.title.toLowerCase().includes(searchStr) ||
                          project.description.toLowerCase().includes(searchStr) ||
                          project.tags.some(t => t.toLowerCase().includes(searchStr));
      
      const matchesTags = selectedTags.every((tag) => project.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const resetFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

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
        {/* Filter & Search Section */}
        <motion.div variants={itemVariants} className="mb-12 space-y-8">
          <div className="max-w-xl mx-auto relative group">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search projects by name, tech, or description..."
              className="pl-12 h-14 rounded-2xl bg-card/50 border-border group-focus-within:border-primary/50 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                <FilterIcon className="w-4 h-4" />
                Technical Stack
              </div>
              {(selectedTags.length > 0 || searchQuery) && (
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105 z-10"
                      : "bg-card/50 text-muted-foreground border-border hover:border-primary/50 backdrop-blur-sm"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-32 bg-card/10 rounded-[3rem] border border-dashed border-border flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                 <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters to broaden your results.</p>
              </div>
              <Button onClick={resetFilters} variant="outline" className="mt-4 rounded-full">
                Show all projects
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results-grid"
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
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Helper to shorten long tag names in the grid
function techMap(tag: string) {
  if (tag.length > 15) return tag.substring(0, 12) + "...";
  return tag;
}
