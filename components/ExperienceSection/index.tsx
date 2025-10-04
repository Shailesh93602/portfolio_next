import { useState } from "react";
import { motion } from "framer-motion";
import { BriefcaseIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { experiences, itemVariants } from "@/constants";

export function ExperienceSection() {
  // Use a Set so multiple experiences can be expanded independently
  const [expandedSet, setExpandedSet] = useState<{ [key: number]: boolean }>({});

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
          <p key={`p-${i}`} className="mb-2 leading-relaxed">
            {p}
          </p>
        ))}
        {bullets.length > 0 && (
          <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
            {bullets.map((b, i) => (
              <li key={`b-${i}`} className="text-sm text-text-secondary">
                {b.replace(/^•\s*/, '')}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <BriefcaseIcon className="w-6 h-6 mr-2 text-primary" />
        Experience
      </h3>

      <div className="relative pl-8">
        {/* vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              {/* marker */}
              <div className="absolute -left-7 top-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-card shadow-md flex items-center justify-center">
                  <BriefcaseIcon className="w-3 h-3 text-white" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold text-foreground">
                        {exp.title}
                      </h4>
                      <span className="text-sm text-muted-foreground">@ {exp.company}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 md:mt-2">
                      {exp.period}
                    </div>

                    <div className="mt-3">
                      {exp.skills && exp.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {exp.skills.slice(0, 6).map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {!expandedSet[index] ? (
                        renderDescription(exp.description)
                      ) : (
                        // show a short excerpt (first paragraph + up to 3 bullets)
                        <div>
                          {(() => {
                            const lines = exp.description.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                            const paras = lines.filter(l => !l.startsWith('•'));
                            const bullets = lines.filter(l => l.startsWith('•')).slice(0, 3);
                            return (
                              <div>
                                {paras[0] && <p className="mb-2 text-text-secondary">{paras[0]}</p>}
                                {bullets.length > 0 && (
                                  <ul className="list-disc list-inside ml-4 text-sm text-text-secondary">
                                    {bullets.map((b,i) => <li key={i}>{b.replace(/^•\s*/, '')}</li>)}
                                  </ul>
                                )}
                              {exp.highlights && exp.highlights.length > 0 && (
                                <div className="mt-3 border-l-2 border-primary/10 pl-3">
                                  {exp.highlights.map((h, i) => (
                                    <p key={i} className="text-sm text-text-secondary mb-1">• {h}</p>
                                  ))}
                                </div>
                              )}
                              </div>
                            )
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() =>
                        setExpandedSet((prev) => {
                          const next = { ...prev };
                          if(next[index]) delete next[index];
                          else next[index] = true;
                          return next;
                        })
                      }
                      className="text-sm text-primary font-medium hover:underline"
                      aria-expanded={expandedSet[index]}
                    >
                      {expandedSet[index] ? 'Show less' : 'Read more'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}