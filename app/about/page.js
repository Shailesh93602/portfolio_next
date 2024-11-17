"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Trophy, Code, Heart, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
export default function About() {
  const [showFullContent, setShowFullContent] = useState(false);

  const toggleContent = () => setShowFullContent(!showFullContent);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col lg:flex-row items-center gap-12"
      >
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/3 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-primary rounded-full blur opacity-75 animate-pulse"></div>
            <Image
              src="/Images/home.webp"
              alt="Shailesh Chaudhari"
              width={300}
              height={300}
              className="relative rounded-full shadow-lg border-4 border-background"
            />
          </div>
        </motion.div>
        <div className="w-full lg:w-2/3">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl font-bold mb-4 text-text-primary">
              About Me
            </h1>
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Fullstack Developer
            </h2>
            <motion.p
              variants={itemVariants}
              className="text-text-secondary mb-6"
            >
              I am a passionate Full Stack Developer based in Gujarat, India,
              dedicated to crafting high-quality, user-centric web applications.
              With a strong foundation in both front-end and back-end
              technologies, I strive to deliver seamless user experiences and
              efficient solutions.
            </motion.p>
            <motion.div
              initial="hidden"
              animate={showFullContent ? "visible" : "hidden"}
              variants={containerVariants}
              className="space-y-8"
            >
              {showFullContent && (
                <>
                  <ExperienceSection />
                  <AchievementsSection />
                  <SkillsSection />
                  <HobbiesSection />
                  <motion.blockquote
                    variants={itemVariants}
                    className="italic text-text-secondary border-l-4 border-primary pl-4 py-2 my-4"
                  >
                    &quot;Code is like humor. When you have to explain it,
                    it&apos;s bad.&quot;
                  </motion.blockquote>
                </>
              )}
            </motion.div>
            <motion.div variants={itemVariants} className="mt-8">
              <button
                onClick={toggleContent}
                className="px-6 py-3 text-sm font-semibold text-text-primary bg-primary hover:bg-primary-dark rounded-md transition-colors duration-300"
              >
                {showFullContent ? "Show Less" : "Read More"}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const experienceData = [
  {
    title: "Junior Software Developer",
    company: "EsparkBiz",
    period: "08/2024 - Present",
    description:
      "Designing, developing, and optimizing web applications to meet client requirements and business goals.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "TailwindCSS"],
    achievements: [
      "Developing and maintaining scalable, user-centric web applications.",
      "Implementing end-to-end solutions, including both front-end and back-end development.",
      "Collaborating with cross-functional teams to deliver client-focused features.",
      "Integrating third-party APIs and optimizing system performance for scalability.",
      "Ensuring secure and efficient database operations using PostgreSQL.",
      "Writing clean, modular, and reusable code adhering to industry best practices.",
      "Conducting code reviews and providing actionable feedback for quality assurance.",
      "Staying updated with emerging technologies to improve development processes.",
      "Streamlining development workflows by implementing version control and CI/CD pipelines.",
      "Documenting technical workflows and creating guides for team collaboration.",
      "Collaborating with designers to ensure seamless UI/UX integration.",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "EsparkBiz",
    period: "01/2024 - 08/2024",
    description:
      "Assisted in building dynamic web applications and gained proficiency in full-stack development.",
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "JavaScript",
      "TypeScript",
      "PostgreSQL",
      "MySQL",
      "TailwindCSS",
      "Next.js",
      "Nest.js",
    ],
    achievements: [
      "Collaborated on the development of full-stack applications using React and Node.js.",
      "Designed and optimized relational database schemas in PostgreSQL and MySQL.",
      "Implemented APIs for seamless interaction between front-end and back-end services.",
      "Gained hands-on experience with authentication mechanisms and data security.",
      "Integrated third-party APIs to enhance application features and usability.",
      "Resolved software bugs to improve application stability and user satisfaction.",
      "Assisted in the implementation of payment gateways like Stripe for e-commerce solutions.",
      "Developed technical documentation to streamline project handovers.",
      "Participated in Agile workflows, including daily stand-ups and sprint reviews.",
    ],
  },
  {
    title: "Project Intern",
    company: "Tatvasoft",
    period: "07/2023 - 08/2023",
    description:
      "Completed a mini-project to apply theoretical knowledge to real-world development.",
    skills: ["React.js", "Node.js", "JavaScript", "CSS", "Git"],
    achievements: [
      "Built 'Book E Sell,' a web application for buying and selling books online.",
      "Implemented user authentication and CRUD operations for book listings.",
      "Designed and developed the application's front-end using React and back-end with Node.js.",
      "Gained experience in creating RESTful APIs and managing database operations.",
      "Enhanced skills in debugging and testing to ensure application reliability.",
      "Practiced Agile methodologies for rapid project development and delivery.",
      "Presented the completed project to mentors and received positive feedback.",
    ],
  },
];

function ExperienceSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
    >
      <h3 className="text-2xl font-semibold mb-6 flex items-center text-offWhite">
        <Briefcase className="mr-2 text-primary" /> Experience
      </h3>
      <div className="space-y-4">
        {experienceData.map((experience, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`bg-dark rounded-lg shadow-md transition-all duration-300 ${
              expandedIndex === index ? "p-6" : "p-4"
            }`}
          >
            <div
              className="cursor-pointer flex justify-between items-center"
              onClick={() => handleToggle(index)}
            >
              <h4 className="text-xl font-semibold text-primary">
                {experience.title}
              </h4>
              <ChevronRight
                className={`text-primary transition-transform duration-300 ${
                  expandedIndex === index ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
            <p className="text-text-secondary">
              {experience.company} | {experience.period}
            </p>

            {expandedIndex === index && ( // Conditionally render expanded content
              <div className="mt-4">
                <p className="text-text-primary mb-4">
                  {experience.description}
                </p>
                <div className="mb-4">
                  <h5 className="text-lg font-medium text-text-primary mb-2">
                    Skills Used:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="text-lg font-medium text-text-primary mb-2">
                    Key Achievements:
                  </h5>
                  <ul className="list-none space-y-2">
                    {experience.achievements.map(
                      (achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start">
                          <ChevronRight className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-text-secondary">
                            {achievement}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const achievements = [
  {
    title: "Hackathon 2023",
    description: "New India Vibrant Hackathon 2023 Finalist",
  },
  {
    title: "John Hopkins",
    description: "Frontend Development Course by Johns Hopkins University",
  },
  {
    title: "CodeChef",
    description: "Solved 500+ problems.",
    link: "https://www.codechef.com/users/shaileshbhai03",
  },
  {
    title: "GeeksforGeeks",
    description: "Institute rank I",
    link: "https://www.geeksforgeeks.org/user/thenameisshaileshbhai",
  },
];

function AchievementsSection() {
  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-xl font-semibold mb-3 flex items-center text-text-primary">
        <Trophy className="mr-2 text-primary" /> Achievements & Certifications
      </h3>
      <ul className="space-y-2 text-text-secondary">
        {achievements.map((achievement, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full mr-2" />
            <span>{achievement.description}</span>
            <span>{achievement.link && " | "}</span>
            {achievement.link && (
              <a
                href={achievement.link}
                target="_blank"
                className="text-primary"
              >
                {achievement.title}
              </a>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function SkillsSection() {
  const [filter, setFilter] = useState("All");

  const skillCategories = {
    "Frontend Development": [
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "HTML", level: 95 },
      { name: "CSS", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "EJS", level: 80 },
    ],
    "Backend Development": [
      { name: "Node.js", level: 85 },
      { name: "Nest.js", level: 80 },
      { name: "Express.js", level: 85 },
    ],
    Databases: [
      { name: "MongoDB", level: 80 },
      { name: "MySQL", level: 75 },
      { name: "PostgreSQL", level: 75 },
    ],
    "Programming Languages": [
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "C++", level: 70 },
      { name: "Java", level: 75 },
    ],
    "Mobile Development": [
      { name: "Android Studio", level: 70 },
      { name: "Java", level: 75 },
      { name: "XML", level: 80 },
    ],
  };

  const allCategories = ["All", ...Object.keys(skillCategories)];

  const filteredSkills =
    filter === "All"
      ? Object.entries(skillCategories).flatMap(([category, skills]) =>
          skills.map((skill) => ({ ...skill, category }))
        )
      : skillCategories[filter].map((skill) => ({
          ...skill,
          category: filter,
        }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-semibold mb-6 flex items-center text-primary">
        <Code className="mr-2" /> Skills
      </h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            onClick={() => setFilter(category)}
            className={`text-sm border hover:bg-primary hover:text-offWhite ${
              filter === category
                ? "bg-primary border-primary"
                : "bg-dark border-dark"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <motion.div
            key={`${skill.category}-${skill.name}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-dark text-offWhite border-dark">
              <CardContent className="p-4">
                <h4 className="text-lg font-medium mb-2">{skill.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {skill.category}
                </p>
                <Progress value={skill.level} className="h-2 bg-primaryLight" />
                <p className="text-right text-sm text-muted-foreground mt-1">
                  {skill.level}%
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HobbiesSection() {
  return (
    <motion.div variants={itemVariants}>
      <h3 className="text-xl font-semibold mb-3 flex items-center text-text-primary">
        <Heart className="mr-2 text-primary" /> Hobbies & Interests
      </h3>
      <p className="text-text-secondary">Football, Chess, Puzzle Solving</p>
    </motion.div>
  );
}
