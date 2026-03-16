"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/constants/projects";
import { Button } from "@/components/ui/button";
import { GithubIcon, ExternalLinkIcon, ArrowLeftIcon, CodeIcon, BriefcaseIcon, StarIcon, CheckIcon } from "@/components/icons";
import { fadeIn } from "@/lib/animations";
import ArchitectureDiagram from "@/components/Showcase/ArchitectureDiagram";
import KeyMetrics from "@/components/Showcase/KeyMetrics";
import ThemeComparison from "@/components/Showcase/ThemeComparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Props {
  project: Project;
}

export default function ProjectDetailContent({ project }: Props) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (project.isShowcase) {
    return (
      <main className="min-h-screen bg-background">
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left" style={{ scaleX }} />
        
        {/* Immersive Hero Section */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover brightness-[0.3] scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
          
          <div className="container relative h-full flex flex-col items-center justify-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 max-w-4xl"
            >
              <Link 
                href="/portfolio" 
                className="inline-flex items-center gap-2 text-primary/80 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest mb-4"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Featured Project
              </Link>
              <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
                {project.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {project.tags.slice(0, 5).map((tag) => (
                  <span 
                    key={tag}
                    className="px-6 py-2 bg-white/5 backdrop-blur-xl text-white rounded-full text-xs font-bold border border-white/10 uppercase tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 justify-center pt-8">
                {project.live && (
                  <Button asChild size="lg" className="h-14 px-8 text-lg font-bold rounded-full">
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      Launch Experience <ExternalLinkIcon className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                )}
                {project.github && (
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="mr-2 w-5 h-5" /> Repository
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll to Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        <div className="container py-24 space-y-32">
          {/* Key Metrics Section */}
          <section>
             <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-12 text-center opacity-50">Performance & Impact</h2>
             <KeyMetrics metrics={project.keyMetrics} />
          </section>

          {/* Problem & Solution Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {project.problem && (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.25)}
                className="space-y-4 p-8 rounded-[2rem] bg-destructive/5 border border-destructive/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <StarIcon className="w-5 h-5 text-destructive rotate-45" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">The Problem</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.problem}
                </p>
              </motion.div>
            )}

            {project.solution && (
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-4 p-8 rounded-[2rem] bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">The Solution</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.solution}
                </p>
              </motion.div>
            )}
          </section>

          {/* Deep Dive & Architecture */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.2)}
              className="space-y-8"
            >
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary mb-2">
                <CodeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight">System Architecture</h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {project.detailedDescription}
              </p>
              <div className="space-y-4 pt-4 text-muted-foreground">
                 <p className="font-semibold text-foreground">Core Engineering Achievements:</p>
                 <div className="space-y-3">
                   {project.features?.slice(0, 3).map((f) => (
                      <div key={f.split(':')[0]} className="flex gap-3">
                        <CheckIcon className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span>{f.split(':')[0]}</span>
                      </div>
                   ))}
                 </div>
              </div>
            </motion.div>
            <ArchitectureDiagram architecture={project.architecture} />
          </section>

          {/* Visual Showcase (Light/Dark Comparison for EduScale) */}
          {project.id === "eduscale" && (
            <section className="space-y-12">
              <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic uppercase">Visual Fidelity</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Crafted with attention to detail, supporting both Light and Dark environments with unique semantic tokens and micro-interactions.
                </p>
              </div>
              
              <Tabs defaultValue="dashboard" className="w-full">
                <div className="flex justify-center mb-10">
                  <TabsList className="bg-card border border-border p-1 rounded-full h-auto">
                    <TabsTrigger value="dashboard" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-bold tracking-wider">DASHBOARD</TabsTrigger>
                    <TabsTrigger value="roadmap" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-bold tracking-wider">ROADMAPS</TabsTrigger>
                    <TabsTrigger value="challenges" className="rounded-full px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-bold tracking-wider">CHALLENGES</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="dashboard" className="outline-none">
                  <ThemeComparison 
                    title="Unified User Dashboard"
                    darkImage="/Images/eduscale_dashboard_dark.png" 
                    lightImage="/Images/eduscale_dashboard_light.png" 
                  />
                </TabsContent>
                <TabsContent value="roadmap" className="outline-none">
                  <ThemeComparison 
                    title="Interactive Career Roadmaps"
                    darkImage="/Images/eduscale_roadmap_dark.png" 
                    lightImage="/Images/eduscale_roadmap_light.png" 
                  />
                </TabsContent>
                <TabsContent value="challenges" className="outline-none">
                  <ThemeComparison 
                    title="Technical Assessment Suite"
                    darkImage="/Images/eduscale_challenges_dark.png" 
                    lightImage="/Images/eduscale_challenges_light.png" 
                  />
                </TabsContent>
              </Tabs>
            </section>
          )}

          {/* Generic Gallery for other Showcase Projects */}
          {project.id !== "eduscale" && project.gallery && project.gallery.length > 0 && (
            <section className="space-y-12">
              <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic uppercase">Project Gallery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A visual walkthrough of the platform's core interfaces and user experiences.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.gallery.map((img, idx) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl group"
                  >
                    <Image
                      src={img}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                      <p className="text-white font-bold tracking-wider uppercase text-sm">View Full Resolution</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Development Narrative */}
          <section className="bg-card border border-border rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">The Engineering Challenge</h4>
                    <h3 className="text-3xl font-bold leading-tight line-clamp-3">{project.challengesSolved?.split('?')[0]}</h3>
                 </div>
                 <div className="space-y-8">
                   <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 italic text-muted-foreground leading-relaxed text-lg">
                      &quot;{project.challengesSolved}&quot;
                   </div>
                   {project.id === "eduscale" && (
                     <div className="flex gap-6">
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-foreground">Next.js 15</p>
                          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Framework</p>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-foreground">PostgreSQL</p>
                          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Engine</p>
                        </div>
                        <div className="w-px h-10 bg-border" />
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-primary">High</p>
                          <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground">Complexity</p>
                        </div>
                     </div>
                   )}
                 </div>
              </div>
              
              <div className="space-y-12">
                 <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">User Journey</h4>
                    <div className="space-y-8 pt-4">
                       {project.userFlow?.map((step) => (
                          <div key={step.step} className="flex gap-6 items-start group/step">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shrink-0 group-hover/step:bg-primary group-hover/step:text-white transition-all">
                              {project.userFlow?.indexOf(step)! + 1}
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">{step.step}</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Action Footer */}
          <section className="text-center py-20">
             <div className="space-y-8 max-w-3xl mx-auto">
               <h2 className="text-4xl font-bold tracking-tight italic">Interested in the full engineering breakdown?</h2>
               <p className="text-xl text-muted-foreground leading-relaxed">
                 I'm always open to discussing technical implementations, from state management strategies to infrastructure scaling.
               </p>
               <div className="flex justify-center gap-6 pt-8">
                 <Button asChild size="lg" className="h-16 px-10 text-lg font-bold rounded-full">
                   <Link href="/contact">Start a Discussion</Link>
                 </Button>
                 <Button asChild variant="outline" size="lg" className="h-16 px-10 text-lg font-bold rounded-full">
                   <Link href="/portfolio">Explore Other Projects</Link>
                 </Button>
               </div>
             </div>
          </section>
        </div>
      </main>
    );
  }

  // Fallback for non-showcase projects (Existing generic UI)
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
          <div className="lg:col-span-2 space-y-16">
            
            {/* Project Overview */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn(0.2)}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BriefcaseIcon className="w-8 h-8 text-primary" />
                Engineering Overview
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
                className="space-y-4 p-8 rounded-2xl bg-destructive/5 border border-destructive/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <StarIcon className="w-5 h-5 text-destructive rotate-45" />
                  </div>
                  <h3 className="text-2xl font-bold text-destructive">The Problem</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.problem}
                </p>
              </motion.section>
            )}

            {/* Solution Section */}
            {project.solution && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.3)}
                className="space-y-4 p-8 rounded-2xl bg-primary/5 border border-primary/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">The Solution</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.solution}
                </p>
              </motion.section>
            )}

            {/* Engineering Challenges */}
            {project.challengesSolved && (
              <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn(0.4)}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <CodeIcon className="w-8 h-8 text-primary" />
                  Key Engineering Challenges
                </h2>
                <div className="p-8 rounded-2xl bg-card border border-border space-y-4">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.challengesSolved}
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
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <StarIcon className="w-8 h-8 text-primary" />
                  Core Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.map((feature) => (
                    <div 
                      key={feature}
                      className="p-5 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-primary mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <span className="text-muted-foreground group-hover:text-text-primary transition-colors">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-2xl bg-card border border-border sticky top-24 shadow-xl shadow-black/20"
            >
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {project.github && (
                  <Button asChild className="w-full justify-start h-12 text-base">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="w-5 h-5 mr-3" />
                      View Source
                    </a>
                  </Button>
                )}
                {project.live && (
                  <Button asChild variant="outline" className="w-full justify-start h-12 text-base">
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkIcon className="w-5 h-5 mr-3" />
                      Live Preview
                    </a>
                  </Button>
                )}
              </div>

              <hr className="my-8 border-border" />

              <h3 className="text-lg font-bold mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>

              <hr className="my-8 border-border" />

              <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Inquiry</h4>
                <p className="text-sm text-muted-foreground">
                  Interested in discussing this engineering approach?
                </p>
                <Button asChild variant="link" className="px-0 h-auto font-bold text-primary hover:text-primary/80">
                  <Link href="/contact">Message Shailesh →</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
