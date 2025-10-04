"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DownloadIcon, BriefcaseIcon } from "@/components/icons";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons";
import SocialLink from "./components/SocialLink";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SOCIAL_LINKS } from "@/lib/constants";
import { getFeaturedPosts } from "@/lib/blog-data";

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

export default function HomeContent() {
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

            <div className="flex flex-wrap items-center gap-6">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <Link href="/contact">
                  <BriefcaseIcon className="w-4 h-4 mr-2 inline-block" />
                  Hire Me
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-2 hover:bg-primary/10 transition-all duration-300"
              >
                <Link
                  href="/Shailesh_Chaudhari_Resume.pdf"
                  target="_blank"
                  download
                >
                  <DownloadIcon className="w-4 h-4 mr-2 inline-block" />
                  Download Resume
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <SocialLink
                href={SOCIAL_LINKS.LINKEDIN}
                icon={<LinkedinIcon className="w-5 h-5" />}
                label="LinkedIn"
              />
              <SocialLink
                href={SOCIAL_LINKS.GITHUB}
                icon={<GithubIcon className="w-5 h-5" />}
                label="GitHub"
              />
              <SocialLink
                href={SOCIAL_LINKS.TWITTER}
                icon={<TwitterIcon className="w-5 h-5" />}
                label="X"
              />
              <SocialLink
                href={SOCIAL_LINKS.CODECHEF}
                icon={<GithubIcon className="w-5 h-5" />}
                label="CodeChef"
              />
              <SocialLink
                href={SOCIAL_LINKS.HACKERRANK}
                icon={<GithubIcon className="w-5 h-5" />}
                label="HackerRank"
              />
              <SocialLink
                href={SOCIAL_LINKS.LEETCODE}
                icon={<GithubIcon className="w-5 h-5" />}
                label="LeetCode"
              />
              <SocialLink
                href={SOCIAL_LINKS.GEEKSFORGEEKS}
                icon={<GithubIcon className="w-5 h-5" />}
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
            <div className="relative w-72 h-72 lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-full blur-3xl" />
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                fill
                priority
                sizes="(max-width: 768px) 288px, 500px"
                className="rounded-full object-cover border-4 border-primary/20 shadow-2xl profile-glow"
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Featured Articles
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Dive into my latest insights on software development, problem-solving, and career growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getFeaturedPosts().slice(0, 3).map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group-hover:scale-105">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      Featured
                    </Badge>
                    <span className="text-sm text-muted-foreground">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary text-sm line-clamp-3 mb-4">
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
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/blogs">
              View All Articles
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
