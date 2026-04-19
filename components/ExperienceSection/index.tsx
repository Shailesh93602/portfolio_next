import { motion } from "framer-motion";
import { BriefcaseIcon, LaptopIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { experiences, itemVariants } from "@/constants";

export function ExperienceSection() {
  // Render plain-text description as a paragraph (no HTML injection)
  const renderDescription = (text: string) => (
    <p className="text-muted-foreground mb-3 leading-relaxed">{text}</p>
  );

  // Helper to determine if experience is internship
  const isInternship = (title: string) =>
    title.toLowerCase().includes("intern");

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-foreground mb-8 flex items-center text-2xl font-semibold">
        <BriefcaseIcon className="mr-3 h-7 w-7 text-primary" />
        Professional Experience
      </h3>

      <div className="relative pl-8">
        {/* vertical line */}
        <div className="absolute bottom-0 left-3 top-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

        <div className="space-y-10">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* marker */}
              <div className="absolute -left-8 top-3">
                <div
                  className={`border-3 flex h-6 w-6 items-center justify-center rounded-full border-card shadow-lg ${
                    isInternship(exp.title)
                      ? "bg-gradient-to-br from-blue-500 to-blue-600"
                      : "bg-gradient-to-br from-primary to-purple-600"
                  }`}
                >
                  {isInternship(exp.title) ? (
                    <LaptopIcon className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <BriefcaseIcon className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
              </div>

              <div className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-3">
                        <h4 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {exp.title}
                        </h4>
                        {isInternship(exp.title) && (
                          <Badge
                            variant="outline"
                            className="border-blue-500/50 text-xs text-blue-600"
                          >
                            Internship
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-medium">@ {exp.company}</span>
                        {exp.companyUrl && (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Visit →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="rounded-full bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
                      {exp.period}
                    </div>
                  </div>

                  <div className="mt-2">
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {exp.skills.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="border-primary/20 bg-primary/10 px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/20"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {renderDescription(exp.description)}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="mt-4 border-l-2 border-primary/20 pl-4">
                        {exp.highlights.map((h, i) => (
                          <p
                            key={i}
                            className="text-muted-foreground mb-2 flex items-start text-sm"
                          >
                            <span className="mr-2 mt-1 text-primary">•</span>
                            {h}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
