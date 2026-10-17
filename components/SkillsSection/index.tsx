import { motion } from "framer-motion";
import { CodeIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants } from "@/constants";
import { Skill } from "@/types";

// The resume's skill rows (resume/resume.json), copied rather than imported so
// the resume's contact block stays out of the client bundle; a test holds them equal.
export const SKILLS: Skill[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "SQL", "C++ (DSA)"],
  },
  {
    category: "Frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "shadcn/ui",
      "accessibility (WCAG 2.1 AA)",
    ],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Socket.io", "Prisma", "REST APIs"],
  },
  { category: "Data", items: ["PostgreSQL", "Redis", "MongoDB"] },
  {
    category: "Infrastructure",
    items: [
      "Docker / Docker Compose",
      "GitHub Actions (CI/CD)",
      "GKE (exposure)",
      "Vercel",
      "Supabase",
      "AWS S3",
    ],
  },
  {
    category: "AI",
    items: [
      "LLM function/tool calling (Gemini)",
      "multi-model fallback",
      "per-key isolation",
      "bring-your-own-key encryption",
      "evals",
      "MCP tools",
      "pgvector RAG",
    ],
  },
];

export default function SkillsSection() {
  return (
    <motion.div variants={itemVariants}>
      <h3 className="mb-6 flex items-center text-2xl font-semibold text-foreground">
        <CodeIcon className="mr-2 h-6 w-6 text-primary" />
        Skills
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {SKILLS.map((skillCategory, index) => (
          <Card key={index} className="bg-background">
            <CardContent className="p-4">
              <h4 className="mb-4 text-lg font-semibold text-foreground">
                {skillCategory.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill) => (
                  <motion.span
                    key={skill}
                    whileHover={{ scale: 1.05 }}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
