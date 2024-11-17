"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Cricket Auction System",
    description:
      "A web application developed for the college cricket league, simplifying the player registration and auction process. Built with Node.js, Express.js, EJS, and MongoDB.",
    liveLink: "https://sportifygec.onrender.com/",
    codeLink: "https://github.com/yourusername/cricket-auction-system",
    image: "/images/portfolio1.png",
  },
  {
    title: "Jarvis AI",
    description:
      "An advanced Android app built with Java and XML, enabling voice commands for effortless task management on smartphones.",
    liveLink: null,
    codeLink: "https://github.com/Shailesh93602/jarvis-ai",
    image: "/images/portfolio1.png",
  },
  {
    title: "MasteryPrep",
    description:
      "An online platform to learn programming fundamentals for technical interviews, built with the MERN stack.",
    liveLink: "https://masteryprep.example.com",
    codeLink: "https://www.github.com/shailesh93602/MasteryPrep/",
    image: "/images/portfolio1.png",
  },
  {
    title: "TODO List",
    description:
      "A user-friendly task management application, built with HTML, CSS, and JavaScript.",
    liveLink: "https://shailesh93602.github.io/todolist/",
    codeLink: "https://github.com/Shailesh93602/todolist",
    image: "/images/portfolio1.png",
  },
  {
    title: "Tic Tac Toe",
    description:
      "A simple web-based game with sound effects, built with HTML, CSS, and JavaScript.",
    liveLink: "https://shailesh93602.github.io/tictactoe/",
    codeLink: "https://github.com/Shailesh93602/tictactoe",
    image: "/images/portfolio1.png",
  },
  {
    title: "Book E Sell",
    description:
      "A full-stack web application for buying and selling books online, built with React, Node.js, Express, and MongoDB.",
    liveLink: "https://book-e-sell.example.com",
    codeLink: "https://github.com/Shailesh93602/book-e-sell",
    image: "/images/portfolio1.png",
  },
];

export default function Portfolio() {
  return (
    <div className="container mx-auto px-4 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-12 text-center text-text-primary">
          Latest Projects
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark relative rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48">
        <Image
          src={project.image}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 transform hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 hover:opacity-70 transition-opacity duration-300 flex items-end justify-start p-4">
          <h2 className="text-text-primary text-xl font-semibold">
            {project.title}
          </h2>
        </div>
      </div>
      <div className="p-6 pb-10">
        <p className="text-text-secondary mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex space-x-4 absolute bottom-2 left-2">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-text-primary font-semibold rounded-md hover:bg-primary-dark transition-colors duration-300"
            >
              Visit <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          )}
          <a
            href={project.codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-background text-text-primary font-semibold rounded-md hover:bg-background-light transition-colors duration-300"
          >
            Code <Github className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
