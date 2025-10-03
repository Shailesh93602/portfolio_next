"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fadeIn, staggerContainer } from "@/lib/animations";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live?: string;
  id: string;
}

const projects: Project[] = [
  {
    id: "gecsportify",
    title: "Cricket Auction System",
    description:
      "A web application developed for the college cricket league, simplifying the player registration and auction process. Built with Node.js, Express.js, EJS, and MongoDB.",
    image: "/Images/gecSportify.png",
    tags: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap"],
    github: "https://github.com/Shailesh93602/gecsportify/",
    live: "https://gecsportify.vercel.app/",
  },
  {
    id: "jarvis-ai",
    title: "Jarvis AI",
    description:
      "An advanced Android app built with Java and XML, enabling voice commands for effortless task management on smartphones.",
  image: "/Images/shailesh.webp",
    tags: ["Java", "Android", "XML", "Voice Recognition"],
    github: "https://github.com/Shailesh93602/jarvis-ai",
  },
  {
    id: "masteryprep",
    title: "MasteryPrep",
    description:
      "An online platform to learn programming fundamentals for technical interviews, built with the MERN stack.",
    image: "/Images/masteryPrep.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/shailesh93602/MasteryPrep",
    live: "https://masteryprep.netlify.app/",
  },
  {
    id: "todolist",
    title: "TODO List",
    description:
      "A user-friendly task management application, built with HTML, CSS, and JavaScript.",
    image: "/Images/toDoList.png",
    tags: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/Shailesh93602/todolist",
    live: "https://shailesh93602.github.io/todolist/",
  },
  {
    id: "tictactoe",
    title: "Tic Tac Toe",
    description:
      "A simple web-based game with sound effects, built with HTML, CSS, and JavaScript.",
    image: "/Images/ticTacToe.png",
    tags: ["HTML", "CSS", "JavaScript", "Game Development"],
    github: "https://github.com/Shailesh93602/tictactoe",
    live: "https://shailesh93602.github.io/TicTacToe/",
  },
  {
    id: "bookesell",
    title: "Book E-Sell",
    description:
      "A full-stack web application for buying and selling books online, built with React, Node.js, Express, and MongoDB.",
  image: "/Images/shailesh.webp",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/Shailesh93602/book-store",
  },
];

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function PortfolioContent() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
          My <span className="text-primary">Projects</span>
        </h1>
        <p className="text-text-secondary">
          Here are some of the projects I&apos;ve worked on. Each one represents
          a unique challenge and learning experience.
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
            <h3 className="text-lg font-semibold text-text-primary">
              Filter by Technology:
            </h3>
            {selectedTags.length > 0 && (
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Show All
              </Button>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                aria-label={`Filter projects by ${tag} technology`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
              {selectedTags.length > 0 &&
                ` matching ${
                  selectedTags.length > 1 ? "any of" : ""
                } the selected technology`}
            </div>
          )}
        </motion.div>

        {filteredProjects.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center text-text-secondary py-8"
          >
            No projects match the selected filters. Try selecting different
            tags.
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="list"
            aria-label="Projects grid"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                role="listitem"
              >
                <Card className="bg-dark overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 w-full">
                    <Image
                      src={project.image}
                      alt={`Screenshot of ${project.title} project`}
                      fill
                      className="object-cover rounded-t-lg"
                      priority={true}
                    />
                  </div>
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">
                      {project.title}
                    </h3>
                    <p className="text-text-secondary mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} source code on GitHub`}
                          >
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                        {project.live && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            asChild
                          >
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View live demo of ${project.title}`}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Demo
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
