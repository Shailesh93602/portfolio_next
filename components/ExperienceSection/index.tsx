import { motion } from "framer-motion";
import { BriefcaseIcon, LaptopIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { experiences, itemVariants } from "@/constants";

export function ExperienceSection() {
  // Helper: convert description text into paragraphs and bullet items
  const renderDescription = (text: string) => {
    // Split by new lines and trim
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    // Lines that start with • are bullets
    const bullets = lines.filter((l) => l.startsWith('•'));
    const paras = lines.filter((l) => !l.startsWith('•'));

    return (
      <div className="text-text-secondary">
        {paras.map((p, i) => (
          <p key={`p-${i}`} className="mb-3 leading-relaxed">
            {p}
          </p>
        ))}
        {bullets.length > 0 && (
          <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
            {bullets.map((b, i) => (
              <li key={`b-${i}`} className="text-sm text-text-secondary leading-relaxed">
                {b.replace(/^•\s*/, '')}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Helper to determine if experience is internship
  const isInternship = (title: string) => title.toLowerCase().includes('intern');

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-8 text-text-primary flex items-center">
        <BriefcaseIcon className="w-7 h-7 mr-3 text-primary" />
        Professional Experience
      </h3>

      <div className="relative pl-8">
        {/* vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

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
                <div className={`w-6 h-6 rounded-full border-3 border-card shadow-lg flex items-center justify-center ${
                  isInternship(exp.title)
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                    : 'bg-gradient-to-br from-primary to-purple-600'
                }`}>
                  {isInternship(exp.title) ? (
                    <LaptopIcon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <BriefcaseIcon className="w-3.5 h-3.5 text-white" />
                  )}
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.title}
                        </h4>
                        {isInternship(exp.title) && (
                          <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-600">
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
                            className="text-primary hover:underline text-sm"
                          >
                            Visit →
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                      {exp.period}
                    </div>
                  </div>

                  <div className="mt-2">
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.skills.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
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
                          <p key={i} className="text-sm text-text-secondary mb-2 flex items-start">
                            <span className="text-primary mr-2 mt-1">•</span>
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