"use client";

import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const skills = [
  {
    category: "Frontend",
    skills: [
      { name: "React", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Tailwind CSS", level: 85 },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 80 },
      { name: "NestJS", level: 75 },
      { name: "PostgreSQL", level: 80 },
    ],
  },
  {
    category: "DevOps",
    skills: [
      { name: "Docker", level: 75 },
      { name: "AWS", level: 70 },
      { name: "CI/CD", level: 75 },
      { name: "Git", level: 85 },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "VS Code", level: 90 },
      { name: "GitHub", level: 85 },
      { name: "Figma", level: 70 },
      { name: "Postman", level: 80 },
    ],
  },
];

export function SkillsShowcase() {
  return (
    <section className="container py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn(0.2)}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Skills & Expertise
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Here are the technologies and tools I work with
        </p>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer(0.1)}
        className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {skills.map((category) => (
          <motion.div
            key={category.category}
            variants={fadeIn(0.2)}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <h3 className="mb-4 text-xl font-semibold">{category.category}</h3>
            <div className="space-y-4">
              {category.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
