import { COMPANY_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { PROFILE, PROFILE_META } from "@/lib/profile";
import { Achievement, Education, Experience } from "@/types";

export const education: Education[] = [
  {
    degree: "Bachelor of Engineering — Information Technology",
    institution: "Government Engineering College Bhavnagar",
    location: "Bhavnagar, Gujarat, India",
    period: "2020 – 2024",
    score: "7.99",
    scoreLabel: "CGPA",
    highlights: [
      "Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Software Engineering",
      "Hackathon Finalist — New India Vibrant Hackathon 2023 (built ITI Alumni Tracking System)",
    ],
  },
];

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Each card must survive the click on "View Profile". The GfG profile shows
// 650 solved and eSparkBiz as the institute, so the old "while in final year"
// contradicted itself; HackerRank shows one five-star badge (C++), not
// "multiple skills including Problem Solving and Python"; the CodeChef card
// (1★, rating 1219) invited a question with no good answer, so it is gone.
export const achievements: Achievement[] = [
  {
    title: "Institute Rank 1 on GeeksforGeeks",
    description: `${PROFILE_META.gfgLine}.`,
    iconName: "trophy",
    link: SOCIAL_LINKS.GEEKSFORGEEKS,
  },
  {
    title: "5-star C++ on HackerRank",
    description: `${PROFILE.achievements.hackerrank}: the C++ skill badge at five stars.`,
    iconName: "star",
    link: SOCIAL_LINKS.HACKERRANK,
  },
  {
    title: "Hackathon Finalist",
    description:
      "Finalist in New India Vibrant Hackathon 2023 - Built ITI Alumni Tracking System using React and PHP, focusing on frontend development",
    iconName: "award",
  },
];

export const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "ContextQA",
    period: "July 2025 - Present",
    companyUrl: COMPANY_LINKS.CONTEXTQA,
    skills: [
      "Node.js",
      "TypeScript",
      "Express.js",
      "Redis",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "WebSockets",
      "Docker",
      "GKE",
      "Next.js",
      "Chrome Extensions",
    ],
    // Pattern level only. No company metrics, no customer names: those are
    // ContextQA's numbers to publish, and the ones he can least verify in a
    // room. Java/Python is a clause, never a bullet — the work is Node-first.
    description:
      "Node.js backend of the core QA-automation platform: the test-execution engine, live browser-session streaming, the integrations engine and the session control plane on GKE. First 2-3 months: shipped 2 Chrome extensions (Vibe Testing + AxeTos).",
    highlights: [
      "Test-execution engine (Node.js) orchestrating concurrent browser and mobile runs across Playwright, WebdriverIO/Appium and LambdaTest; live browser-session streaming over WebSockets (noVNC proxied through a Node control plane); a debug engine with breakpoints and resume-from-checkpoint.",
      "Primary author of the integrations engine (Node/TypeScript): GitHub App, GitLab and Linear OAuth, Slack Block Kit bot, webhook ingestion — made multi-tenant by moving OAuth handshake state from per-pod memory to Redis with an atomic Lua read-and-delete, resolving tenants by installation id, and keeping the token vault ciphertext-only at rest.",
      "Session control plane on GKE: pre-warmed pod pool over Redis, idempotent stop with first-terminal-wins status ordering, request trace ids via AsyncLocalStorage, stable error codes plus a diagnostics bundle for on-prem customers, pod eviction protection and memory budgeting.",
      "Presigned-URL chokepoint so private S3/MinIO/GCS buckets work on-prem; PR-impact analysis where a webhook and an MCP tool call share one path. Also contribute to the platform's Java (Spring Boot) and Python services.",
      "AxeTos (shipped in first 2-3 months): Chrome extension + Node.js backend for WCAG A/AA/AAA auditing with fix suggestions and precise DOM locators.",
      "Vibe Testing (shipped in first 2-3 months): Chrome extension for AI-assisted UI testing — real-time log streaming over WebSockets, screenshot capture, AI-generated bug scenarios, chat-based fix workflows.",
    ],
  },
  {
    title: "Software Developer",
    company: "eSparkBiz Technologies",
    period: "August 2024 - July 2025",
    companyUrl: COMPANY_LINKS.ESPARKBIZ,
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "TailwindCSS",
      "PostgreSQL",
      "Supabase",
      "OAuth",
      "Stripe",
      "Firebase",
    ],
    description:
      "Full-stack developer across three simultaneous client products in EdTech, e-commerce, and corporate training. Managed competing deadlines across different stacks and codebases.",
    highlights: [
      "Brightmont (EdTech scheduling): Integrated Teachworks scheduling API with Python/Cplex optimization service, synchronized large datasets, built real-time calendar UI with S3 file workflows.",
      "The ASL Shop (Sign Language e-learning): Built Dictionary module with advanced search and Coda sync, implemented Supabase auth from scratch, contributed to course and quiz features.",
      "Proleven (Corporate LMS): Resolved critical production bugs, improved email workflow reliability, streamlined notification trigger systems.",
      "Delivered all three client engagements on schedule.",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "eSparkBiz Technologies",
    period: "January 2024 - August 2024",
    companyUrl: COMPANY_LINKS.ESPARKBIZ,
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express.js",
      "EJS",
      "React.js",
      "Next.js",
      "MySQL",
      "Sequelize",
      "TypeORM",
      "Authentication",
      "Role-based Access Control",
      "NestJS",
      "TailwindCSS",
      "Shadcn UI",
      "PostgreSQL",
      "IndexedDB",
      "Redux",
    ],
    description:
      "Seven-month internship progressing from web fundamentals to production NestJS and Next.js. Owned entire modules, not just tickets.",
    highlights: [
      "Garage Management System: Owned the authentication module end-to-end — role-based access control, session management, and user admin UI in a Node.js/Express/EJS team project.",
      "Advanced from HTML/CSS/MySQL to TypeScript, NestJS, Next.js, Sequelize, TypeORM, and Redux in under 6 months.",
      "Built e-commerce and practice projects to solidify architecture understanding and prepare for client work.",
    ],
  },
];
