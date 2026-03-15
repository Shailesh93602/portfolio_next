export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  detailedDescription?: string;
  features?: string[];
  techStack?: string[];
  problem?: string;
  solution?: string;
  challenges?: string;
  engineeringChallenges?: string; // Add this for specific focus if needed, but I'll map 'challenges' in UI
    gallery?: string[]; // Add gallery for showcase projects
  isShowcase?: boolean; // Flag for special rendering
  architecture?: {
    layers: { name: string; items: string[] }[];
    description: string;
  };
  keyMetrics?: { label: string; value: string; description: string }[];
  userFlow?: { step: string; description: string }[];
}

export const projects: Project[] = [
  {
    id: "eduscale",
    title: "EduScale",
    description: "A premium, all-in-one engineering learning platform featuring personalized roadmaps, real-time coding battles, and comprehensive placement preparation.",
    image: "/Images/eduscale_landing_dark.png",
    isShowcase: true,
    tags: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Supabase", "Socket.io", "Redis"],
    live: "https://eduscale.vercel.app/",
    github: "https://github.com/Shailesh93602/devscale",
    detailedDescription: "A high-performance EdTech ecosystem architected for sub-second latency and absolute data integrity. Built using Next.js 15 and Supabase, it features a distributed real-time state engine for competitive coding and dynamic career mapping. The platform leverages PostgreSQL for complex relational queries and an event-driven architecture to handle real-time user interactions.",
    architecture: {
      layers: [
        { name: "Frontend", items: ["Next.js 15 (App Router)", "React 19", "Tailwind CSS", "Framer Motion", "Redux Toolkit"] },
        { name: "Backend", items: ["Node.js", "Express.js (TypeScript)", "Prisma ORM", "PostgreSQL"] },
        { name: "Infrastructure", items: ["Supabase Auth", "Redis / Bull Queues", "Socket.io (Real-time)", "Vercel / AWS"] }
      ],
      description: "A micro-structured monolithic architecture optimized for developer experience and real-time interactive learning."
    },
    keyMetrics: [
      { label: "Sync Latency", value: "< 200ms", description: "Real-time state synchronization via WebSocket" },
      { label: "Execution Engine", value: "Sub-second", description: "Remote code execution & test validation" },
      { label: "Data Integrity", value: "99.9%", description: "Atomic transactions & state persistence" }
    ],
    userFlow: [
      { step: "Discovery", description: "Users browse high-quality career roadmaps tailored for engineering roles." },
      { step: "Structured Learning", description: "Personalized progress tracking through modules and coding tasks." },
      { step: "Competitive Practice", description: "Real-time 1v1 or group coding battles to test skills under pressure." },
      { step: "Interview Ready", description: "Mock assessments and AI-driven feedback for placement preparation." }
    ],
    features: [
      "Dynamic Career Roadmaps: structured learning paths with multi-stage progress tracking and milestone achievements.",
      "Real-time Battle Zone: Low-latency competitive coding environment with live rankings and peer challenges.",
      "Coding Challenges: Integrated compiler support for multiple languages with automated test suite validation.",
      "Community Forum: Robust discussion platform for peer learning and resource sharing.",
      "Placement Ready: Curated specialized tracks for interview preparation and technical skill assessments.",
      "Gamified Learning: Achievement badges, streak systems, and global leaderboards to drive engagement."
    ],
    techStack: [
      "Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Redux Toolkit, Zustand",
      "Backend: Node.js, Express.js (TypeScript), Prisma ORM, PostgreSQL",
      "Real-time & AI: Socket.io, Redis, Bull Queues for background tasks, Supabase Auth",
      "Developer Experience: Swagger/OpenAPI, Playwright E2E testing, Husky"
    ],
    problem: "Engineering education is often disjointed, with students moving between static roadmaps, isolated coding editors, and scattered community forums. This lack of integration leads to poor progress tracking and a higher dropout rate during self-paced learning.",
    solution: "A unified Engineering Learning Platform (SaaS) that seamlessly integrates structured curriculum with interactive coding tools and real-time social competition. EduScale provides a 'single source of truth' for the student's entire technical journey.",
    engineeringChallenges: "The primary challenge was building the 'Battle Zone'—a distributed real-time state machine that synchronizes test execution results across thousands of concurrent users. I implemented a Redis-backed message broker with Bull queues to ensure reliable delivery of code execution logs and leaderboard updates with sub-200ms latency.",
    gallery: [
      "/Images/eduscale_landing_dark.png",
      "/Images/eduscale_landing_light.png",
      "/Images/eduscale_dashboard_dark.png",
      "/Images/eduscale_dashboard_light.png",
      "/Images/eduscale_roadmap_dark.png",
      "/Images/eduscale_roadmap_light.png",
      "/Images/eduscale_challenges_dark.png",
      "/Images/eduscale_challenges_light.png"
    ]
  },
  {
    id: "vibe-testing",
    title: "Vibe Testing (ContextQA)",
    description:
      "AI-Powered Web Testing Chrome Extension that automates UI testing using advanced AI agents and real-time execution engines.",
    image: "/Images/vibe_testing/full_report.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Chrome Extension", "AI/ML", "WebSockets"],
    detailedDescription: "Vibe Testing (also known as ContextQA) is a sophisticated Chrome extension designed for the modern web ecosystem. It integrates with AI agents to perform autonomous UI validation, broken link detection, performance analysis, and accessibility testing. It specifically targets sites built on platforms like v0.dev and Replit.",
    features: [
      "AI-driven autonomous UI testing and validation",
      "Real-time communication with execution engine via WebSockets",
      "Integrated broken link detection and SEO analysis",
      "WCAG 2.1 AA accessibility compliance testing",
      "Core Web Vitals performance monitoring",
      "One-click fix suggestions for AI-generated code"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Express.js", "Prisma", "Puppeteer", "Axe-core", "Manifest V3"],
    problem: "Rapid web development outpaces traditional testing. Developers lack a way to perform real-time, automated UI validation on dynamically generated, AI-driven websites without complex manual setup.",
    solution: "A high-performance Chrome extension that leverages AI agents to capture live browser state and perform complex UI tests. It provides detailed reports with prioritized bugs and actionable fix suggestions.",
    engineeringChallenges: "Architecting a real-time, bi-directional communication bridge between the browser extension and a remote testing engine while ensuring sub-200ms latency for live log streaming and visual state updates.",
    gallery: [
      "/Images/vibe_testing/full_report.png",
      "/Images/vibe_testing/live_execution_with_steps_and_screenshots.png",
      "/Images/vibe_testing/bug_summary_in_report.png",
      "/Images/vibe_testing/configure_and_run_test_modal.png",
      "/Images/vibe_testing/popup_after_login.png"
    ]
  },
  {
    id: "axetos",
    title: "AxeTos (ContextQA)",
    description:
      "Professional Accessibility Testing Suite (Chrome Extension + Node.js) for automated WCAG compliance and instant fixes.",
    image: "/Images/portfolio1.png",
    tags: ["Node.js", "Next.js", "TypeScript", "Tailwind CSS", "Accessibility"],
    detailedDescription: "AxeTos (part of the ContextQA suite) is a comprehensive solution for web accessibility. It combines a powerful Chrome extension with a dedicated Node.js backend to audit websites against WCAG A, AA, and AAA standards. Beyond just identifying issues, it offers a revolutionary 'instant fix' capability.",
    features: [
      "Automated WCAG A/AA/AAA standards auditing",
      "Component-level issue visualization in the UI",
      "Intelligent fix suggestions with live preview",
      "Script generation for permanent, development-free fixes",
      "High-performance Node.js backend for complex analysis"
    ],
    techStack: ["Node.js", "Next.js", "TypeScript", "Tailwind CSS", "Express", "Chrome Scripting API"],
    problem: "Web accessibility (WCAG) compliance is a critical but often manual and neglected process. Identifying and fixing thousands of accessibility violations across large-scale sites creates a significant developmental bottleneck.",
    solution: "Comprehensive auditing suite that runs detailed WCAG A/AA/AAA diagnostics. It features a unique remediation engine that applies persistent fixes via script injection, allowing for 'zero-code' accessibility fixes.",
    engineeringChallenges: "Building a non-destructive DOM manipulation engine that could reliably apply accessibility fixes (like contrast adjustments and ARIA role remediation) across varied third-party frameworks without interfering with existing site logic."
  },
  /*
  {
    id: "gecsportify",
    title: "Cricket Auction System",
    description:
      "A web application developed for the college cricket league, simplifying the player registration and auction process. Built with Node.js, Express.js, EJS, and MongoDB.",
    image: "/Images/gecSportify.png",
    tags: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap"],
    github: "https://github.com/Shailesh93602/gecsportify/",
    live: "https://gecsportify.vercel.app/",
    detailedDescription: "GEC Sportify is a comprehensive cricket auction system designed to handle real-time player bidding for college sports leagues. It features a robust backend to manage player statistics, team budgets, and live auction updates.",
    features: [
      "Real-time bidding management",
      "Player profile and statistics tracking",
      "Team budget management with validation",
      "Dynamic auction leaderboard",
      "Admin dashboard for league management"
    ],
    techStack: ["Node.js", "Express.js", "MongoDB", "EJS", "Bootstrap", "WebSockets"],
  },
  {
    id: "jarvis-ai",
    title: "Jarvis AI",
    description:
      "An advanced Android app built with Java and XML, enabling voice commands for effortless task management on smartphones.",
    image: "/Images/portfolio1.png",
    tags: ["Java", "Android", "XML", "Voice Recognition"],
    github: "https://github.com/Shailesh93602/jarvis-ai",
    detailedDescription: "Jarvis AI is a personal assistant application for Android that leverages Google's Voice Recognition API to perform various tasks on the device. It aims to provide a hands-free experience for common smartphone activities.",
    features: [
      "Voice command execution (Call, Text, Apps)",
      "Daily schedule and reminders management",
      "Real-time weather and news updates",
      "Custom voice responses",
      "Integration with device hardware (Camera, Flashlight)"
    ],
    techStack: ["Java", "Android SDK", "XML", "Google Voice API"],
  },
  {
    id: "masteryprep",
    title: "MasteryPrep",
    description:
      "An online platform to learn programming fundamentals for technical interviews, built with the MERN stack.",
    image: "/Images/masteryPrep.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/shailesh93602/MasteryPrep",
    live: "https://masteryprep.netlify.app/",
    detailedDescription: "MasteryPrep is an educational platform focused on preparing students for technical interviews. It provides a curated set of problems, learning resources, and a community space for developers.",
    features: [
      "Curated coding challenges with categories",
      "Interactive learning modules for DSA",
      "User progress tracking and badges",
      "Discussion forums for problem solving",
      "Responsive design for mobile learning"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Tailwind CSS"],
  },
  {
    id: "bookesell",
    title: "Book E-Sell",
    description:
      "A full-stack web application for buying and selling books online, built with React, Node.js, Express, and MongoDB.",
    image: "/Images/portfolio1.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "MERN"],
    github: "https://github.com/Shailesh93602/book-store",
    detailedDescription: "Book E-Sell is a marketplace for second-hand books, allowing users to list their books for sale and buy from others. It streamlines the process of finding affordable educational resources.",
    features: [
      "User authentication and profile management",
      "Book listing with image upload",
      "Advanced search and filtering by category",
      "Inner messaging system for buyers and sellers",
      "Rating and review system"
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"],
  },
  */
];
