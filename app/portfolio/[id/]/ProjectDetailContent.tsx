"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import { GithubIcon, ExternalLinkIcon, ArrowLeftIcon, CodeIcon, BriefcaseIcon, StarIcon, CheckIcon } from "@/components/icons";
import { fadeIn } from "@/lib/animations";
import { Terminal, Shield, Cpu, Layers, Zap, Rocket, Globe, Database } from "lucide-react";

interface Props {
  project: Project;
}

export default function ProjectDetailContent({ project }: Props) {
  const isEduScale = project.id === "eduscale";

  return (
    <main className={`min-h-screen bg-background pb-20 ${isEduScale ? 'selection:bg-primary/30' : ''}`}>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className={`object-cover ${isEduScale ? 'brightness-[0.3]' : 'brightness-[0.4]'} transition-transform duration-[2000ms] hover:scale-105`}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {isEduScale && (
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none" />
        )}
        
        <div className="container relative h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link 
              href="/portfolio" 
              className="group inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-all hover:-translate-x-1"
            >
              <ArrowLeftIcon className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold tracking-tight">Explore More Architecture</span>
            </Link>
            
            <div className="max-w-4xl">
               {isEduScale && (
                <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary/30">
                  Engineering Showcase 2026
                </div>
              )}
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-5 py-2 bg-white/5 backdrop-blur-xl text-white/90 rounded-2xl text-xs font-bold border border-white/10 hover:border-primary/50 transition-colors shadow-2xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mt-16 lg:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Project Overview */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.2)}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <BriefcaseIcon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tight uppercase">System Architecture</h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                {project.detailedDescription || project.description}
              </p>
            </motion.section>

             {/* Problem Section */}
             {project.problem && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.25)}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-destructive/5 rounded-[2.5rem] border border-destructive/10" />
                <div className="relative p-10 lg:p-14 space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 rotate-3 group-hover:rotate-0 transition-transform">
                      <Shield className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-3xl font-black text-destructive uppercase tracking-tight">The Core Problem</h3>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {project.problem}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Solution Section */}
            {project.solution && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] border border-primary/10" />
                <div className="relative p-10 lg:p-14 space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 -rotate-3 group-hover:rotate-0 transition-transform">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black text-primary uppercase tracking-tight">The Engineering Solution</h3>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Engineering Challenges */}
            {project.engineeringChallenges && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.4)}
                className="space-y-8"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Cpu className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight uppercase">Technical Complexity</h2>
                </div>
                <div className="p-10 lg:p-14 rounded-[2.5rem] bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Terminal className="w-32 h-32" />
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed font-medium relative z-10">
                    {project.engineeringChallenges}
                  </p>
                </div>
              </motion.section>
            )}

            {/* Features Feed */}
            {project.features && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.5)}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Layers className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight uppercase">Platform Capabilities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.features.map((feature) => (
                    <div 
                      key={feature}
                      className="p-8 rounded-[2rem] bg-card border border-border hover:border-primary/50 transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                        <Rocket className="w-24 h-24" />
                      </div>
                      <div className="flex items-start gap-4 h-full">
                        <div className="mt-1 p-1 bg-primary/10 rounded-lg">
                          <CheckIcon className="w-5 h-5 text-primary opacity-70" />
                        </div>
                        <span className="text-lg text-muted-foreground group-hover:text-text-primary transition-colors font-semibold leading-tight">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Project Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.6)}
                className="space-y-12"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight uppercase">Interface Gallery</h2>
                </div>
                <div className="grid grid-cols-1 gap-12">
                  {project.gallery.map((img) => (
                    <div 
                      key={img}
                      className="relative rounded-[3rem] overflow-hidden border border-border bg-card group shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} screenshot`}
                        width={1920}
                        height={1080}
                        className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.01]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-center">
                        <p className="text-white text-xl font-bold tracking-tight">Production Snapshot: {project.title} Web Application</p>
                        <p className="text-white/60 text-sm mt-2 font-mono uppercase tracking-[0.2em]">{img.split('/').pop()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-10 rounded-[2.5rem] bg-card/50 backdrop-blur-xl border border-border sticky top-24 shadow-2xl space-y-10"
            >
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground flex items-center gap-3">
                  <span className="w-4 h-[1px] bg-primary" /> Deployments
                </h3>
                <div className="space-y-4">
                  {project.github && (
                    <Button asChild className="w-full justify-between h-14 text-base font-black rounded-2xl group shadow-xl shadow-primary/10">
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center">
                          <GithubIcon className="w-6 h-6 mr-4" />
                          Source Architecture
                        </span>
                        <ArrowLeftIcon className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </a>
                    </Button>
                  )}
                  {project.live && (
                    <Button asChild variant="outline" className="w-full justify-between h-14 text-base font-bold bg-transparent border-2 border-border hover:border-primary rounded-2xl group transition-all">
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <span className="flex items-center">
                          <ExternalLinkIcon className="w-6 h-6 mr-4" />
                          Live Infrastructure
                        </span>
                        <ArrowLeftIcon className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <div className="h-[1px] bg-border/50" />

              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-muted-foreground flex items-center gap-3">
                   <span className="w-4 h-[1px] bg-primary" /> Engineering Stack
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-secondary/80 text-secondary-foreground border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-border/50" />

              <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 space-y-6">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-primary" />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">Inquiry</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Interested in a technical deep-dive into the backend scalability of this project?
                </p>
                <Button asChild variant="link" className="px-0 h-auto font-black text-primary hover:text-primary/80 group text-lg">
                  <Link href="/contact" className="flex items-center">
                    Initiate Discussion 
                    <ArrowLeftIcon className="w-5 h-5 ml-2 rotate-180 transition-transform group-hover:translate-x-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
