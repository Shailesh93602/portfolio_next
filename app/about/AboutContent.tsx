/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { itemVariants } from "@/constants";
import { ExperienceSection } from "@/components/ExperienceSection";
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
        className="flex flex-col lg:flex-row items-center gap-16"
      >
        <motion.div
          variants={itemVariants}
          className="w-full lg:w-1/3 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] rounded-full blur opacity-75 animate-pulse"></div>
            <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden">
              <Image
                src="/Images/shailesh.webp"
                alt="Shailesh Chaudhari"
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-full shadow-lg border-4 border-background profile-glow"
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
            <div className="space-y-4 mb-8">
              <h1 className="text-5xl font-bold">
                About <span className="text-primary">Me</span>
              </h1>
              {/* <h2 className="text-3xl font-semibold text-primary">
                Fullstack Developer
              </h2> */}
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
