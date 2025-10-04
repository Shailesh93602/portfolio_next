import { motion } from "framer-motion";
import { CodeIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { itemVariants } from "@/constants";
import { Skill } from "@/types";

export default function SkillsSection() {
  const skills: Skill[] = [
    {
      category: "Frontend",
      items: [
        { name: "React.js", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 90 },
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript", level: 90 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 90 },
        { name: "Express.js", level: 85 },
        { name: "NestJS", level: 80 },
        { name: "REST APIs", level: 90 },
        { name: "GraphQL", level: 75 },
      ],
    },
    {
      category: "Databases",
      items: [
        { name: "MongoDB", level: 90 },
        { name: "PostgreSQL", level: 85 },
        { name: "MySQL", level: 85 },
        { name: "Prisma", level: 80 },
        { name: "Sequelize", level: 80 },
        { name: "TypeORM", level: 75 },
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Git", level: 90 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "CI/CD", level: 80 },
        { name: "Testing", level: 85 },
        { name: "Supabase", level: 75 },
        { name: "OAuth", level: 80 },
        { name: "Stripe", level: 75 },
        { name: "Firebase", level: 75 },
      ],
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <CodeIcon className="w-6 h-6 mr-2 text-primary" />
        Skills
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skillCategory, index) => (
          <Card key={index} className="bg-dark">
            <CardContent className="p-4">
              <h4 className="text-lg font-semibold mb-4 text-text-primary">
                {skillCategory.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillCategory.items.map((skill, skillIndex) => (
                  <motion.span
                    key={skillIndex}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full bg-muted text-text-secondary border border-border hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                  >
                    {skill.name}
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