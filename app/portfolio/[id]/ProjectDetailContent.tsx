"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import { GithubIcon, ExternalLinkIcon, ArrowLeftIcon, CodeIcon, BriefcaseIcon, StarIcon } from "@/components/icons";
import { fadeIn } from "@/lib/animations";

interface Props {
  project: Project;
}

export default function ProjectDetailContent({ project }: Props) {
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="container relative h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/portfolio" 
              className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Portfolio
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {project.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.2)}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BriefcaseIcon className="w-8 h-8 text-primary" />
                Project Overview
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.detailedDescription || project.description}
              </p>
            </motion.section>

            {project.features && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <StarIcon className="w-8 h-8 text-primary" />
                  Key Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.4)}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <CodeIcon className="w-8 h-8 text-primary" />
                Technical Implementation
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p>
                  This project was built with a focus on <strong>performance</strong>, <strong>scalability</strong>, and <strong>maintainability</strong>. 
                  Leveraging modern industry standards, the architecture ensures a seamless user experience while providing developers with a robust foundation for future enhancements.
                </p>
                {project.challenges && (
                  <div className="mt-6">
                    <h3 className="text-white text-xl font-semibold mb-2">The Challenge</h3>
                    <p>{project.challenges}</p>
                  </div>
                )}
                {project.solutions && (
                  <div className="mt-4">
                    <h3 className="text-white text-xl font-semibold mb-2">The Solution</h3>
                    <p>{project.solutions}</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-2xl bg-card border border-border sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6">Project Links</h3>
              <div className="space-y-4">
                <Button asChild className="w-full justify-start h-12 text-base">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="w-5 h-5 mr-3" />
                    Source Code
                  </a>
                </Button>
                {project.live && (
                  <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-5 h-5 mr-3" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>

              <hr className="my-8 border-border" />

              <h3 className="text-lg font-bold mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <hr className="my-8 border-border" />

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Interested in this work?
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link href="/contact">Get in touch →</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
