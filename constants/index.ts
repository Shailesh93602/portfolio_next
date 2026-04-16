import { SOCIAL_LINKS } from "@/lib/constants";
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
      "Achieved Institute Rank 1 on GeeksforGeeks while in final year — 604+ problems solved",
    ],
  },
];

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const achievements: Achievement[] = [
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

export const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "ContextQA",
    period: "July 2025 - Present",
    companyUrl: "https://contextqa.com",
    skills: [
      "Next.js",
      "TailwindCSS",
      "Shadcn UI",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "Prisma",
      "Chrome Extensions",
    ],
    description:
      "Shipping production features across two Chrome extensions and the core platform. Both extensions have accumulated 1,600–1,900 merged PRs respectively — fixing bugs, landing features, and reviewing code end-to-end in a production codebase.",
    highlights: [
      "AxeTOS (Accessibility Extension): Chrome extension + Node.js/Express backend for WCAG A/AA/AAA auditing with automated fix suggestions and detailed violation reports with precise DOM locators. ~1,600 merged PRs.",
      "Vibe Testing (Web Testing Extension): Chrome extension for AI-powered UI testing targeting v0.dev/Lovable/Replit apps. Features real-time log streaming via WebSockets, screenshot capture, AI-generated bug scenarios, and chat-based fix workflows. ~1,900 merged PRs.",
      "ContextQA Portal: Resolved critical Node.js/Express.js/Playwright backend bugs and shipped new features improving platform stability and test execution reliability.",
    ],
  },
  {
    title: "Software Developer",
    company: "eSparkBiz Technologies",
    period: "August 2024 - July 2025",
    companyUrl: "https://www.esparkinfo.com/",
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
      "Delivered all three client engagements on schedule with no production incidents.",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "eSparkBiz Technologies",
    period: "January 2024 - August 2024",
    companyUrl: "https://www.esparkinfo.com/",
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
      "Intensive 8-month internship progressing from web fundamentals to production NestJS and Next.js. Owned entire modules, not just tickets.",
    highlights: [
      "Garage Management System: Owned the authentication module end-to-end — role-based access control, session management, and user admin UI in a Node.js/Express/EJS team project.",
      "Advanced from HTML/CSS/MySQL to TypeScript, NestJS, Next.js, Sequelize, TypeORM, and Redux in under 6 months.",
      "Built e-commerce and practice projects to solidify architecture understanding and prepare for client work.",
    ],
  },
];
