/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Briefcase,
  Trophy,
  Code,
  Heart,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Star,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SOCIAL_LINKS } from "@/lib/constants";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface Achievement {
  title: string;
  description: string;
  link?: string;
  iconName: "trophy" | "code" | "award" | "star";
}

interface SkillItem {
  name: string;
  level: number;
}

interface Skill {
  category: string;
  items: SkillItem[];
}

interface Hobby {
  title: string;
  description: string;
  icon: string;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function AboutContent() {
  const [showFullContent, setShowFullContent] = useState<boolean>(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col lg:flex-row items-center gap-16"
      >
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/3 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] rounded-full blur opacity-75 animate-pulse"></div>
            <Image
              src="/Images/home.webp"
              alt="Shailesh Chaudhari"
              width={300}
              height={300}
              className="relative rounded-full shadow-lg border-4 border-background profile-glow"
              priority
            />
          </div>
        </motion.div>
        <div className="w-full lg:w-2/3">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            <div className="space-y-4 mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] bg-clip-text text-transparent">
                About Me
              </h1>
              <h2 className="text-3xl font-semibold text-primary">
                Fullstack Developer
              </h2>
              <motion.p
                variants={itemVariants}
                className="text-lg text-text-secondary leading-relaxed"
              >
                I am a passionate Full Stack Developer based in Gujarat, India,
                dedicated to crafting high-quality, user-centric web
                applications. With a strong foundation in both front-end and
                back-end technologies, I strive to deliver seamless user
                experiences and efficient solutions.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate={showFullContent ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-12"
            >
              {showFullContent && (
                <>
                  <ExperienceSection />
                  <AchievementsSection />
                  <SkillsSection />
                  <HobbiesSection />
                  <motion.blockquote
                    variants={itemVariants}
                    className="italic text-text-secondary border-l-4 border-primary pl-6 py-4 my-8 text-lg"
                  >
                    &quot;Code is like humor. When you have to explain it,
                    it&apos;s bad.&quot;
                  </motion.blockquote>
                </>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              className="mt-8 group flex items-center justify-center w-full bg-card hover:bg-card-hover rounded-lg p-4 transition-all duration-300 border border-border hover:border-primary"
              onClick={() => setShowFullContent(!showFullContent)}
              aria-expanded={showFullContent}
            >
              <span className="text-lg font-semibold text-text-primary mr-2">
                {showFullContent ? "Show Less" : "Show More"}
              </span>
              {showFullContent ? (
                <ChevronUp className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary transition-transform group-hover:translate-y-1" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const experiences: Experience[] = [
    {
      title: "Software Developer",
      company: "eSparkBiz Technologies",
      period: "August 2024 - Present",
      description: `Working as a Full Stack Developer, focusing on building high-quality software solutions using cutting-edge technologies. Key responsibilities include:
      • Communicating with clients to gather and analyze project requirements
      • Developing scalable applications using React, Next.js, Node.js, and TypeScript
      • Implementing database solutions using PostgreSQL and Supabase
      • Building responsive UIs with Tailwind CSS
      • Following industry best practices and maintaining code quality
      • Collaborating with team members using version control (Git)
      • Participating in code reviews and technical discussions`,
    },
    {
      title: "Software Developer Intern",
      company: "eSparkBiz Technologies",
      period: "January 2024 - August 2024",
      description: `Gained valuable industry experience through hands-on work with modern web technologies. Key achievements include:
      • Built multiple demo projects to understand team collaboration and industry standards
      • Fixed critical bugs in production applications during initial phases
      • Learned and implemented best practices for software development
      • Worked with React, Next.js, Node.js, TypeScript, and PostgreSQL
      • Participated in team meetings and agile development processes
      • Contributed to code reviews and documentation
      • Developed strong problem-solving and debugging skills`,
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <Briefcase className="w-6 h-6 mr-2 text-primary" />
        Experience
      </h3>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card
            key={index}
            className={`bg-dark border-2 transition-colors duration-300 ${
              expandedIndex === index
                ? "border-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <CardContent className="p-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleToggle(index)}
              >
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">
                    {exp.title}
                  </h4>
                  <p className="text-text-secondary">
                    {exp.company} • {exp.period}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-primary transition-transform duration-300 ${
                    expandedIndex === index ? "rotate-90" : ""
                  }`}
                />
              </div>
              {expandedIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 text-text-secondary whitespace-pre-line"
                >
                  {exp.description}
                </motion.div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function AchievementsSection() {
  const achievements: Achievement[] = [
    {
      title: "Institute Rank 1",
      description:
        "Achieved Institute Rank 1 on GeeksforGeeks coding platform with 604+ problems solved",
      iconName: "trophy",
      link: SOCIAL_LINKS.GEEKSFORGEEKS,
    },
    {
      title: "5 Star Rating on HackerRank",
      description:
        "Achieved 5 star rating in multiple programming skills including Problem Solving and Python",
      iconName: "star",
      link: SOCIAL_LINKS.HACKERRANK,
    },
    {
      title: "CodeChef Problem Solver",
      description:
        "Active competitive programmer with consistent problem-solving on CodeChef platform",
      iconName: "code",
      link: SOCIAL_LINKS.CODECHEF,
    },
    {
      title: "Hackathon Finalist",
      description:
        "Finalist in New India Vibrant Hackathon 2023 - Built ITI Alumni Tracking System using React and PHP, focusing on frontend development",
      iconName: "award",
    },
  ];

  const getIcon = (iconName: Achievement["iconName"]) => {
    switch (iconName) {
      case "trophy":
        return <Trophy className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "code":
        return <Code className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "star":
        return <Star className="w-6 h-6 text-primary mr-3 mt-1" />;
      case "award":
        return <Award className="w-6 h-6 text-primary mr-3 mt-1" />;
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-primary" />
        Achievements
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <Card
            key={index}
            className={`bg-dark transition-colors duration-300 hover:border-primary/50 ${
              achievement.link ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              achievement.link && window.open(achievement.link, "_blank")
            }
          >
            <CardContent className="p-4">
              <div className="flex items-start">
                {getIcon(achievement.iconName)}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">
                    {achievement.title}
                  </h4>
                  <p className="text-text-secondary">
                    {achievement.description}
                  </p>
                  {achievement.link && (
                    <p className="text-primary text-sm mt-1 hover:underline">
                      View Profile →
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

function SkillsSection() {
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
        { name: "Supabase", level: 75 },
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
      ],
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <Code className="w-6 h-6 mr-2 text-primary" />
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

function HobbiesSection() {
  const hobbies: Hobby[] = [
    {
      title: "Chess",
      description: "Strategic thinking and planning through chess matches",
      icon: "♟️",
    },
    {
      title: "Football",
      description: "Playing football for teamwork and physical fitness",
      icon: "⚽",
    },
    {
      title: "Puzzle Solving",
      description:
        "Solving Sudoku puzzles and Rubik's cubes for mental agility",
      icon: "🧩",
    },
    {
      title: "Learning",
      description: "Exploring new technologies and expanding knowledge",
      icon: "📚",
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-2xl font-semibold mb-6 text-text-primary flex items-center">
        <Heart className="w-6 h-6 mr-2 text-primary" />
        Hobbies
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hobbies.map((hobby, index) => (
          <Card key={index} className="bg-dark">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                {hobby.icon}
                <div>
                  <h4 className="text-lg font-semibold text-text-primary">
                    {hobby.title}
                  </h4>
                  <p className="text-text-secondary">{hobby.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
