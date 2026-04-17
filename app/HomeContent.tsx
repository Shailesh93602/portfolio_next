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
  SiX,
} from "react-icons/si";
import { Download, Briefcase } from "lucide-react";
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

interface Props {
  featuredPosts: { slug: string; title: string; description: string; image: string; readTime: string; tags: string[]; date: string }[];
}

export default function HomeContent({ featuredPosts }: Props) {
  const [jobTitleIndex, setJobTitleIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobTitleIndex((prevIndex) => (prevIndex + 1) % jobTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:w-1/2"
          >
            <div className="space-y-2">
              <Badge variant="outline" className="text-sm font-medium">
                Available for hire · Open to part-time & freelance
              </Badge>
              <h1 className="text-text-primary text-4xl font-bold lg:text-6xl">
                Hi, I&apos;m Shailesh Chaudhari
              </h1>
              <h2 className="h-12 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-semibold text-primary text-transparent lg:text-3xl">
                {jobTitles[jobTitleIndex]}
              </h2>
            </div>

            <p className="text-text-secondary text-lg leading-relaxed">
              Software Engineer at ContextQA, building developer tools and
              Chrome extensions used in production. I&apos;ve shipped full-stack
              features across 6+ projects — EdTech platforms, AI-powered tools,
              real-time systems. TypeScript everywhere, performance from the
              start.
            </p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Open to part-time, freelance (hourly or project-based) work —
              <Link href="/contact" className="ml-1 text-primary underline">
                contact me
              </Link>
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-primary/25"
              >
                <Link href="/contact">
                  <Briefcase className="mr-2 inline-block h-4 w-4" />
                  Hire Me
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 transition-all duration-300 hover:bg-primary/10"
              >
                <Link
                  href="/Shailesh_Chaudhari_Resume.pdf"
                  target="_blank"
                  download
                >
                  <Download className="mr-2 inline-block h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <SocialLink
                href={SOCIAL_LINKS.LINKEDIN}
                icon={<SiLinkedin className="h-5 w-5" />}
                label="LinkedIn"
              />
              <SocialLink
                href={SOCIAL_LINKS.GITHUB}
                icon={<SiGithub className="h-5 w-5" />}
                label="GitHub"
              />
              <SocialLink
                href={SOCIAL_LINKS.TWITTER}
                icon={<SiX className="h-5 w-5" />}
                label="X"
              />
              <SocialLink
                href={SOCIAL_LINKS.CODECHEF}
                icon={<SiCodechef className="h-5 w-5" />}
                label="CodeChef"
              />
              <SocialLink
                href={SOCIAL_LINKS.HACKERRANK}
                icon={<SiHackerrank className="h-5 w-5" />}
                label="HackerRank"
              />
              <SocialLink
                href={SOCIAL_LINKS.LEETCODE}
                icon={<SiLeetcode className="h-5 w-5" />}
                label="LeetCode"
              />
              <SocialLink
                href={SOCIAL_LINKS.GEEKSFORGEEKS}
                icon={<SiGeeksforgeeks className="h-5 w-5" />}
                label="GeeksforGeeks"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:w-1/2 lg:justify-end"
          >
            <div className="relative h-72 w-72 overflow-hidden rounded-full lg:h-[500px] lg:w-[500px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl" />
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                fill
                priority
                sizes="(max-width: 768px) 288px, 500px"
                className="profile-glow rounded-full border-4 border-primary/20 object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h2 className="text-text-primary mb-4 text-3xl font-bold lg:text-4xl">
            Featured Articles
          </h2>
          <p className="text-text-secondary mx-auto max-w-2xl text-lg">
            Dive into my latest insights on software development,
            problem-solving, and career growth.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts
            .slice(0, 3)
            .map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg group-hover:scale-105">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-text-primary mb-3 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="text-text-secondary mb-4 line-clamp-3 text-sm">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/blogs">View All Articles</Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
