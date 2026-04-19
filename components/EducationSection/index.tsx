"use client";

import { motion } from "framer-motion";
import { GraduationCapIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { education, itemVariants } from "@/constants";

export function EducationSection() {
  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-foreground mb-8 flex items-center text-2xl font-semibold">
        <GraduationCapIcon className="mr-3 h-7 w-7 text-primary" />
        Education
      </h3>

      <div className="relative pl-8">
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

        <div className="space-y-6">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-8 top-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-card bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <GraduationCapIcon className="h-3.5 w-3.5 text-white" />
                </div>
              </div>

              <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="mb-1 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {edu.degree}
                      </h4>
                      <p className="font-medium text-muted-foreground">
                        {edu.institution}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {edu.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <div className="rounded-full bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
                        {edu.period}
                      </div>
                      {edu.score && (
                        <Badge
                          variant="secondary"
                          className="border-primary/20 bg-primary/10 text-primary"
                        >
                          {edu.scoreLabel ?? "Score"}: {edu.score}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="ml-1 mt-1 space-y-2">
                      {edu.highlights.map((h, i) => (
                        <li
                          key={i}
                          className="text-muted-foreground flex items-start text-sm leading-relaxed"
                        >
                          <span className="mr-2 mt-1 text-primary">•</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
