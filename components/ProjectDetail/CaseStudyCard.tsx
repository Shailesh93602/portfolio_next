"use client";

import { motion } from "framer-motion";
import { StarIcon, CheckIcon } from "@/components/icons";
import { fadeInOnScroll } from "@/lib/animations";

/** Delays match the order the two cards appear in: problem first. */
const KINDS = {
  problem: {
    heading: "The Problem",
    delay: 0.25,
    tone: "border-destructive/10 bg-destructive/5",
    iconBox: "bg-destructive/10",
    headingClass: "text-destructive-accent",
    icon: <StarIcon className="h-5 w-5 rotate-45 text-destructive-accent" />,
  },
  solution: {
    heading: "The Solution",
    delay: 0.3,
    tone: "border-primary/10 bg-primary/5",
    iconBox: "bg-primary/10",
    headingClass: "text-primary",
    icon: <CheckIcon className="h-5 w-5 text-primary" />,
  },
} as const;

interface Props {
  kind: keyof typeof KINDS;
  text: string;
  /** The showcase layout renders these as a grid of divs; the standard one as sections. */
  as?: "div" | "section";
  rounded?: string;
}

/** "The Problem" / "The Solution" card shared by both project layouts. */
export default function CaseStudyCard({
  kind,
  text,
  as = "div",
  rounded = "rounded-[2rem]",
}: Props) {
  const k = KINDS[kind];
  const Tag = as === "section" ? motion.section : motion.div;
  return (
    <Tag
      {...fadeInOnScroll(k.delay)}
      className={`space-y-4 ${rounded} border ${k.tone} p-8`}
    >
      <div className="mb-2 flex items-center gap-3">
        <div className={`rounded-lg ${k.iconBox} p-2`}>{k.icon}</div>
        <h3 className={`text-2xl font-bold ${k.headingClass}`}>{k.heading}</h3>
      </div>
      <p className="text-lg leading-relaxed text-muted-foreground">{text}</p>
    </Tag>
  );
}
