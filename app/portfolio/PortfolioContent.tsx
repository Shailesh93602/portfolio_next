"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    image: "/Images/portfolio1.png",
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
    title: "Book E Sell",
    description:
      "A full-stack web application for buying and selling books online, built with React, Node.js, Express, and MongoDB.",
    image: "/Images/portfolio1.png",
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

  const filteredProjects = selectedTags.length
    ? projects.filter((project) =>
        selectedTags.every((tag) => project.tags.includes(tag))
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
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        role="main"
        aria-label="Projects showcase"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text-primary">
            My Projects
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Here are some of the projects I&apos;ve worked on. Each project is
            unique and showcases different aspects of my skills and expertise.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div
            className="flex flex-wrap gap-2 justify-center"
            role="group"
            aria-label="Filter projects by technology"
          >
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => toggleTag(tag)}
                className="rounded-full"
                aria-pressed={selectedTags.includes(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
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
                      alt={`Screenshot of ${project.title}`}
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
