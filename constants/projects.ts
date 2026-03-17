export interface ShowcaseItem {
  title: string;
  imageLight?: string;
  imageDark?: string;
  image?: string; // fallback if only one theme
  description?: string;
}

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
  challengesSolved?: string;
  gallery?: string[]; // Legacy basic gallery
  showcases?: ShowcaseItem[]; // Standardized high-fidelity preview layout
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
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Supabase", "Socket.io", "Redis", "Node.js"],
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
    challengesSolved: "The primary challenge was building the 'Battle Zone'—a distributed real-time state machine that synchronizes test execution results across thousands of concurrent users. I implemented a Redis-backed message broker with Bull queues to ensure reliable delivery of code execution logs and leaderboard updates with sub-200ms latency.",
    showcases: [
      {
        title: "Unified User Dashboard",
        description: "A centralized hub tracking enrolled roadmaps, ongoing battle states, and overall technical progress. Completely unified between Light and Dark modes.",
        imageDark: "/Images/eduscale/dashboard_dark.png",
        imageLight: "/Images/eduscale/dashboard_light.png"
      },
      {
        title: "Interactive Career Roadmaps",
        description: "Node-based curriculum visualization allowing students to track granular progress and unlock specialized technical tracks.",
        imageDark: "/Images/eduscale/roadmap_dark.png",
        imageLight: "/Images/eduscale/roadmap_light.png"
      },
      {
        title: "Technical Assessment Suite",
        description: "A specialized multi-language execution environment providing integrated testing, static analysis, and time complexity benchmarking.",
        imageDark: "/Images/eduscale/challenges_dark.png",
        imageLight: "/Images/eduscale/challenges_light.png"
      },
      {
        title: "Real-time Battle Zone",
        description: "A competitive arena powered by WebSockets, allowing sub-second real-time multiplayer coding showdowns with live leaderboards.",
        imageDark: "/Images/eduscale/battle_dark.png",
        imageLight: "/Images/eduscale/battle_light.png"
      }
    ]
  },
  {
    id: "vibe-testing",
    title: "Vibe Testing (ContextQA)",
    description:
      "AI-Powered Web Testing Chrome Extension that automates UI testing using advanced AI agents and real-time execution engines.",
    image: "/Images/vibe_testing/full_report.png",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Chrome Extension", "AI/ML", "WebSockets"],
    detailedDescription: "Vibe Testing (also known as ContextQA) is a sophisticated Chrome extension designed for the modern web ecosystem. It integrates with AI agents to perform autonomous UI validation, broken link detection, performance analysis, and accessibility testing. It specifically targets sites built on platforms like v0.dev and Replit, providing real-time feedback and screenshots of execution.",
    architecture: {
      layers: [
        { name: "Frontend (Extension)", items: ["Next.js", "Tailwind CSS", "React", "Chrome Extension API"] },
        { name: "Backend (Intelligence)", items: ["Python (AI Agent)", "Node.js (Execution)", "Playwright Engine"] },
        { name: "Communication", items: ["Socket.io (Live Logs)", "Browser Storage"] }
      ],
      description: "A hybrid architecture combining a lightweight browser extension with a powerful remote AI execution engine for autonomous web testing."
    },
    features: [
      "AI-driven autonomous UI testing and validation",
      "Real-time communication with execution engine via WebSockets",
      "Integrated broken link detection and SEO analysis",
      "WCAG 2.1 AA accessibility compliance testing",
      "Live log streaming and visual state updates with screenshots",
      "One-click fix suggestions for AI-generated code"
    ],
    techStack: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, Manifest V3",
      "Backend: Node.js, Python (AI Agent), Playwright",
      "Communication: Socket.io, Browser Local Storage"
    ],
    problem: "Rapid web development outpaces traditional testing. Developers lack a way to perform real-time, automated UI validation on dynamically generated, AI-driven websites without complex manual setup.",
    solution: "A high-performance Chrome extension that leverages AI agents to capture live browser state and perform complex UI tests. It provides detailed reports with prioritized bugs and actionable fix suggestions.",
    challengesSolved: "Architecting a real-time, bi-directional communication bridge between the browser extension and a remote testing engine while ensuring sub-200ms latency for live log streaming and visual state updates.",
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
    tags: ["Node.js", "Next.js", "React", "TypeScript", "Tailwind CSS", "Accessibility", "Chrome Extension"],
    detailedDescription: "AxeTos (part of the ContextQA suite) is a comprehensive solution for web accessibility. It combines a powerful Chrome extension with a dedicated Node.js backend to audit websites against WCAG A, AA, and AAA standards. Beyond just identifying issues, it offers a revolutionary 'instant fix' capability via script injection.",
    architecture: {
      layers: [
        { name: "Frontend (Extension)", items: ["Next.js", "Tailwind CSS", "TypeScript", "Chrome Scripting API"] },
        { name: "Backend (Service)", items: ["Node.js", "Express.js", "Axe-core Engine"] },
        { name: "Infrastructure", items: ["AWS S3 (Script Storage)"] }
      ],
      description: "A comprehensive auditing and remediation suite that identifies accessibility violations and generates persistent fixes."
    },
    features: [
      "Automated WCAG A/AA/AAA standards auditing",
      "Component-level issue visualization in the UI",
      "Intelligent fix suggestions with live preview",
      "Script generation for permanent, development-free fixes",
      "High-performance Node.js backend for complex analysis"
    ],
    techStack: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, Chrome Scripting API",
      "Backend: Node.js, Express.js, Axe-core",
      "Infrastructure: AWS S3"
    ],
    problem: "Web accessibility (WCAG) compliance is a critical but often manual and neglected process. Identifying and fixing thousands of accessibility violations across large-scale sites creates a significant developmental bottleneck.",
    solution: "Comprehensive auditing suite that runs detailed WCAG A/AA/AAA diagnostics. It features a unique remediation engine that applies persistent fixes via script injection, allowing for 'zero-code' accessibility fixes.",
    challengesSolved: "Building a non-destructive DOM manipulation engine that could reliably apply accessibility fixes (like contrast adjustments and ARIA role remediation) across varied third-party frameworks without interfering with existing site logic."
  },
  {
    id: "khatago",
    title: "KhataGO",
    description: "WhatsApp-first AI Accounting & Billing platform for small businesses, featuring real-time transaction recording via chat and automated i18n support.",
    image: "/Images/khatago/landing.png",
    isShowcase: true,
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Supabase", "Gemini AI", "i18n", "Node.js", "Redis"],
    live: "https://khatago.vercel.app/",
    github: "https://github.com/Shailesh93602/khatago",
    detailedDescription: "KhataGO is a revolutionary WhatsApp-first SaaS billing platform designed for the Indian MSME market. It leverages Gemini AI to parse natural language messages and images of receipts directly from WhatsApp, automatically recording transactions into a cloud-based ledger.",
    architecture: {
      layers: [
        { name: "Interface", items: ["WhatsApp Cloud API", "Next.js (Web Dashboard)", "Tailwind CSS"] },
        { name: "Intelligence", items: ["Google Gemini AI", "Node.js (Webhooks)"] },
        { name: "Data & Ops", items: ["Prisma ORM", "PostgreSQL (Supabase)", "Redis / Bull Queues"] }
      ],
      description: "An event-driven, WhatsApp-first architecture designed for simplicity and scalability in small business accounting."
    },
    features: [
      "Natural Language WhatsApp Bot: Record sales, purchases, and expenses like you talk.",
      "AI Receipt Processing: Send bill photos to WhatsApp - the AI extracts and records all details.",
      "CA & Accountant Portal: Date-range exports in CSV and Tally-ready formats.",
      "Dynamic i18n Engine: Full UI in 3+ languages (English, Hindi, Gujarati).",
      "Financial Analytics: Real-time charts for sales, purchases, and net profit trends.",
      "Zero-App Footprint: Manage your entire business accounting without ever leaving WhatsApp."
    ],
    techStack: [
      "Frontend: Next.js (App Router), React, Tailwind CSS, Recharts, i18next",
      "Backend: Node.js, Express (TypeScript), Prisma ORM, PostgreSQL",
      "AI & Messaging: Google Gemini AI, WhatsApp Cloud API, Redis/Bull Queues",
      "Infrastructure: Supabase (Auth & Real-time), Vercel"
    ],
    problem: "Small business owners in India struggle with complex accounting software. They often rely on manual notebooks (Khatas), which lead to data loss, calculation errors, and delays in GST compliance.",
    solution: "A 'zero-learning-curve' platform that works where the user already is: WhatsApp. By combining the simplicity of chat with the power of AI, KhataGO makes business accounting as easy as sending a message.",
    challengesSolved: "The biggest challenge was building a resilient, low-latency messaging pipeline. I architected an event-driven system using Redis and Bull queues to handle Gemini AI calls and Tally XML generation as background tasks, ensuring the WhatsApp bot remains responsive while processing complex business data.",
    userFlow: [
      { step: "Onboarding", description: "Business owners register via the web portal and connect their WhatsApp Business API." },
      { step: "Master Data Setup", description: "Configure customer/vendor records and categories in the web dashboard." },
      { step: "Transaction Logging", description: "Send text messages or photos of bills directly to the KhataGO WhatsApp bot." },
      { step: "AI Processing OCR", description: "The AI agent processes receipts via OCR and creates draft transactions automatically." },
      { step: "Reporting & Export", description: "Review monthly GST summaries and export Tally-compatible XML vouchers for accountants." }
    ],
    showcases: [
      {
        title: "Business Ledger Dashboard",
        description: "A responsive, single-page summary tracking daily, weekly, and monthly incoming/outgoing financial trends.",
        image: "/Images/khatago/dashboard.png",
      },
      {
        title: "Transaction Activity Feed",
        description: "A chronological list of all categorized invoices, expenses, and payments with immediate export and edit capabilities.",
        image: "/Images/khatago/transactions.png",
      },
      {
        title: "Monthly Revenue & GST Portal",
        description: "An integrated report generation interface allowing CA firms to download precise GST-ready and Tally XML statements.",
        image: "/Images/khatago/reports.png"
      }
    ]
  }
];
