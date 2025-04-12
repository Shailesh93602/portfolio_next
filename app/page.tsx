"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
  SiHackerrank,
  SiLinkedin,
  SiGithub,
} from "react-icons/si";
import SocialLink from "./components/SocialLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/constants";

const jobTitles: string[] = [
  "Full Stack Developer",
  "Software Engineer",
  "MERN Stack Developer",
  "Node.js Developer",
  "Next.js Developer",
  "React.js Developer",
];

const skills = [
  "TypeScript",
  "React.js",
  "Node.js",
  "Next.js",
  "MongoDB",
  "Express.js",
  "Tailwind CSS",
  "PostgreSQL",
];

export default function Home() {
  const [jobTitleIndex, setJobTitleIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobTitleIndex((prevIndex) => (prevIndex + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 space-y-6"
        >
          <div className="space-y-2">
            <Badge variant="outline" className="text-sm font-medium">
              Available for hire
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-text-primary">
              Hi, I&apos;m Shailesh Chaudhari
            </h1>
            <h2 className="text-2xl lg:text-3xl text-primary font-semibold h-12 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {jobTitles[jobTitleIndex]}
            </h2>
          </div>

          <p className="text-text-secondary text-lg leading-relaxed">
            I&apos;m a passionate Full Stack Developer specializing in building
            dynamic and scalable web applications. Proficient in modern
            technologies like Node.js, React, and more. Let&apos;s collaborate
            to bring your ideas to life with high-quality code and seamless user
            experiences!
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact">Hire Me</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <SocialLink
              href={SOCIAL_LINKS.LINKEDIN}
              icon={<SiLinkedin className="w-5 h-5" />}
              label="LinkedIn"
            />
            <SocialLink
              href={SOCIAL_LINKS.GITHUB}
              icon={<SiGithub className="w-5 h-5" />}
              label="GitHub"
            />
            <SocialLink
              href={SOCIAL_LINKS.CODECHEF}
              icon={<SiCodechef className="w-5 h-5" />}
              label="CodeChef"
            />
            <SocialLink
              href={SOCIAL_LINKS.HACKERRANK}
              icon={<SiHackerrank className="w-5 h-5" />}
              label="HackerRank"
            />
            <SocialLink
              href={SOCIAL_LINKS.LEETCODE}
              icon={<SiLeetcode className="w-5 h-5" />}
              label="LeetCode"
            />
            <SocialLink
              href={SOCIAL_LINKS.GEEKSFORGEEKS}
              icon={<SiGeeksforgeeks className="w-5 h-5" />}
              label="GeeksforGeeks"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 lg:w-[500px] lg:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
            <Image
              src="/Images/home.webp"
              alt="Shailesh Chaudhari"
              fill
              priority
              className="rounded-full object-cover border-4 border-primary/20 shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
