"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { XIcon, SearchIcon, FilterIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { projects } from "@/constants/projects";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
};

export function PortfolioContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((project) => project.tags))).sort(
        (a, b) => a.localeCompare(b)
      ),
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
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchStr) ||
        project.description.toLowerCase().includes(searchStr) ||
        project.tags.some((t) => t.toLowerCase().includes(searchStr));

      const matchesTags = selectedTags.every((tag) =>
        project.tags.includes(tag)
      );

      return matchesSearch && matchesTags;
    });
  }, [searchQuery, selectedTags]);

  const resetFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  return (
    <div className="container py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.2)}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My <span className="italic text-primary">Projects</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A showcase of engineering excellence, from distributed systems to
          AI-driven tools.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.1)}
      >
        {/* Filter & Search Section */}
        <motion.div variants={itemVariants} className="mb-12 space-y-8">
          <div className="group relative mx-auto max-w-xl">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search projects by name, tech, or description..."
              className="h-14 rounded-2xl border-border bg-card/50 pl-12 text-lg transition-all group-focus-within:border-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary">
                <FilterIcon className="h-4 w-4" />
                Technical Stack
              </div>
              {(selectedTags.length > 0 || searchQuery) && (
                <Button
                  onClick={resetFilters}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 rounded-full transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <XIcon className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
            {/* Mobile: horizontal snap-scroll so the chip row takes one row,
                 not 6+ wrapped rows pushing every card below the fold.
                 sm and up: wrap as before. */}
            <div className="mx-auto max-w-4xl">
              <div className="-mx-4 flex gap-2 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`shrink-0 whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 sm:px-5 sm:py-2.5 ${
                      selectedTags.includes(tag)
                        ? "z-10 scale-105 border-primary bg-primary text-white shadow-xl shadow-primary/20"
                        : "border-border bg-card/50 text-muted-foreground backdrop-blur-sm hover:border-primary/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="no-results"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={itemVariants}
              className="flex flex-col items-center gap-4 rounded-[3rem] border border-dashed border-border bg-card/10 py-32 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">No projects found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to broaden your results.
                </p>
              </div>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="mt-4 rounded-full"
              >
                Show all projects
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="results-grid"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={staggerContainer(0.05)}
              className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project) => {
                const isShowcase = project.isShowcase;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    variants={itemVariants}
                    className={`${isShowcase ? "md:col-span-2 lg:col-span-2" : ""} group h-full`}
                  >
                    <Card className="relative h-full overflow-hidden rounded-[2rem] border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                      <Link
                        href={`/portfolio/${project.id}`}
                        className="flex h-full flex-col"
                      >
                        <div className="relative h-64 w-full overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {isShowcase && (
                            <div className="absolute left-6 top-6">
                              <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
                                Showcase Project
                              </span>
                            </div>
                          )}
                        </div>
                        <CardContent className="flex-1 p-8">
                          <div className="mb-4 flex items-start justify-between">
                            <h3 className="text-2xl font-bold transition-colors group-hover:text-primary">
                              {project.title}
                            </h3>
                          </div>
                          <p className="mb-8 line-clamp-3 font-medium leading-relaxed text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="mt-auto flex flex-wrap gap-2">
                            {project.tags.slice(0, 6).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-xl border border-border/50 bg-secondary/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-secondary-foreground"
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
