/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronUpIcon, ChevronDownIcon } from "@/components/icons";
import { itemVariants } from "@/constants";
import { ExperienceSection } from "@/components/ExperienceSection";
import { EducationSection } from "@/components/EducationSection";
import AchievementsSection from "@/components/Achievements";
import SkillsSection from "@/components/SkillsSection";
import { HobbiesSection } from "@/components/HobbiesSection";

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
        className="flex flex-col items-center gap-16 lg:flex-row"
      >
        <motion.div
          variants={itemVariants}
          className="flex w-full justify-center lg:w-1/3"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 animate-pulse rounded-full bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] opacity-75 blur"></div>
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full">
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                width={300}
                height={300}
                className="profile-glow h-full w-full rounded-full border-4 border-background object-cover shadow-lg"
                priority
              />
            </div>
          </div>
        </motion.div>
        <div className="w-full lg:w-2/3">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left"
          >
            <div className="mb-8 space-y-4">
              <h1 className="text-5xl font-bold">
                About <span className="text-primary">Me</span>
              </h1>
              {/* <h2 className="text-3xl font-semibold text-primary">
                Fullstack Developer
              </h2> */}
              <motion.p
                variants={itemVariants}
                className="text-text-secondary text-lg leading-relaxed"
              >
                I&apos;m a Software Engineer from Bhavnagar, Gujarat. Right now
                I&apos;m at ContextQA building developer tools — Chrome
                extensions for automated web testing and accessibility auditing.
                Before that I spent a year at eSparkBiz shipping features for
                EdTech, e-commerce, and corporate training platforms. I like
                working on systems where correctness matters: real-time sync,
                auth flows, data pipelines.
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

                  <EducationSection />

                  <AchievementsSection />
                  <SkillsSection />
                  <HobbiesSection />
                  <motion.blockquote
                    variants={itemVariants}
                    className="text-text-secondary my-8 border-l-4 border-primary py-4 pl-6 text-lg italic"
                  >
                    &quot;Code is like humor. When you have to explain it,
                    it&apos;s bad.&quot;
                  </motion.blockquote>
                </>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              className="hover:bg-card-hover group mt-8 flex w-full items-center justify-center rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary"
              onClick={() => setShowFullContent(!showFullContent)}
              aria-expanded={showFullContent}
            >
              <span className="text-text-primary mr-2 text-lg font-semibold">
                {showFullContent ? "Show Less" : "Show More"}
              </span>
              {showFullContent ? (
                <ChevronUpIcon className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-primary transition-transform group-hover:translate-y-1" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
