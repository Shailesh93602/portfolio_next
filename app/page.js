"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { Github, Linkedin, Code, Terminal, BookOpen } from "lucide-react";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
  SiHackerrank,
  SiLinkedin,
  SiGithub,
} from "react-icons/si";

const jobTitles = [
  "Full Stack Developer",
  "Software Engineer",
  "MERN Stack Developer",
  "Node.js Developer",
  "Next.js Developer",
  "React.js Developer",
];

export default function Home() {
  const [jobTitleIndex, setJobTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobTitleIndex((prevIndex) => (prevIndex + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-2 flex flex-col lg:flex-row items-center justify-between">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/2 mb-8 lg:mb-0"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
          Hi, I&apos;m Shailesh Chaudhari
        </h1>
        <h2 className="text-2xl lg:text-3xl text-primary font-semibold mb-4 h-12">
          {jobTitles[jobTitleIndex]}
        </h2>
        <p className="text-text-secondary mb-6">
          I&apos;m a passionate Full Stack Developer specializing in building
          dynamic and scalable web applications. Proficient in modern
          technologies like Node.js, React, and more. Let&apos;s collaborate to
          bring your ideas to life with high-quality code and seamless user
          experiences!
        </p>
        <div className="flex space-x-4 mb-6">
          <SocialLink
            href="https://www.linkedin.com/in/shaileshbhai-chaudhari/"
            icon={<SiLinkedin />}
            label="LinkedIn"
          />
          <SocialLink
            href="https://github.com/shailesh93602"
            icon={<SiGithub />}
            label="GitHub"
          />
          <SocialLink
            href="https://www.codechef.com/users/shaileshbhai03"
            icon={<SiCodechef />}
            label="CodeChef"
          />
          <SocialLink
            href="https://www.hackerrank.com/profile/shailesh93602"
            icon={<SiHackerrank />}
            label="HackerRank"
          />
          <SocialLink
            href="https://leetcode.com/u/Shaileshbhai/"
            icon={<SiLeetcode />}
            label="LeetCode"
          />
          <SocialLink
            href="https://www.geeksforgeeks.org/user/thenameisshaileshbhai"
            icon={<SiGeeksforgeeks />}
            label="GeeksforGeeks"
          />
        </div>
        <Link
          href="/contact"
          className="inline-block bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Hire Me
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:w-1/2 flex justify-center lg:justify-end"
      >
        <div className="relative w-64 h-64 lg:w-80 lg:h-80">
          <Image
            src="/Images/home.webp"
            alt="Shailesh Chaudhari"
            layout="fill"
            objectFit="cover"
            className="rounded-full shadow-lg border-4 border-primary"
          />
        </div>
      </motion.div>
    </div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-primary text-text-secondary hover:bg-primary hover:text-white transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-white"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
      />
      <motion.div
        className="relative z-10"
        initial={{ rotate: 0 }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>
    </motion.a>
  );
}
