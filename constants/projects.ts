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
    description:
      "A premium, all-in-one engineering learning platform featuring personalized roadmaps, real-time coding battles, and comprehensive placement preparation.",
    image: "/Images/eduscale_landing_dark.png",
    isShowcase: true,
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Socket.io",
      "@socket.io/redis-adapter",
      "Redlock",
      "Redis",
      "Bull Queues",
      "Circuit Breaker",
      "Prometheus",
      "Node.js",
    ],
    live: "https://eduscale.vercel.app/",
    github: "https://github.com/Shailesh93602/devscale",
    detailedDescription:
      "A production-grade EdTech platform built around a distributed real-time engine. The backend uses @socket.io/redis-adapter for horizontal Socket.io scaling across multiple Node.js instances, redlock (Redlock algorithm) for distributed locking to prevent race conditions in battle state writes, opossum for circuit-breaker protection on external services, prom-client exposing a Prometheus /metrics endpoint, and Bull queues for reliable background job processing. Frontend is Next.js 15 App Router with Redux Toolkit.",
    architecture: {
      layers: [
        {
          name: "Frontend",
          items: [
            "Next.js 15 (App Router)",
            "React 19",
            "Tailwind CSS",
            "Framer Motion",
            "Redux Toolkit",
          ],
        },
        {
          name: "Backend",
          items: [
            "Node.js + Express.js (TypeScript)",
            "Prisma ORM + PostgreSQL",
            "Socket.io + @socket.io/redis-adapter",
            "redlock (Distributed Lock Manager)",
            "opossum (Circuit Breaker)",
            "prom-client (Prometheus metrics)",
          ],
        },
        {
          name: "Infrastructure",
          items: [
            "Redis Cluster (adapter + locks + cache)",
            "Bull Queues (background jobs)",
            "Supabase Auth",
            "Vercel / AWS",
          ],
        },
      ],
      description:
        "Distributed real-time architecture: Socket.io rooms backed by Redis cluster adapter for multi-instance scaling. Redlock prevents duplicate battle-start race conditions. Circuit breaker wraps the code-execution service. Prometheus metrics on /metrics for observability.",
    },
    keyMetrics: [
      {
        label: "Sync Latency",
        value: "< 200ms",
        description: "Real-time state synchronization via WebSocket",
      },
      {
        label: "Execution Engine",
        value: "Sub-second",
        description: "Remote code execution & test validation",
      },
      {
        label: "Data Integrity",
        value: "99.9%",
        description: "Atomic transactions & state persistence",
      },
    ],
    userFlow: [
      {
        step: "Discovery",
        description:
          "Users browse high-quality career roadmaps tailored for engineering roles.",
      },
      {
        step: "Structured Learning",
        description:
          "Personalized progress tracking through modules and coding tasks.",
      },
      {
        step: "Competitive Practice",
        description:
          "Real-time 1v1 or group coding battles to test skills under pressure.",
      },
      {
        step: "Interview Ready",
        description:
          "Mock assessments and AI-driven feedback for placement preparation.",
      },
    ],
    features: [
      "Dynamic Career Roadmaps: structured learning paths with multi-stage progress tracking and milestone achievements.",
      "Real-time Battle Zone: Low-latency competitive coding environment with live rankings and peer challenges.",
      "Coding Challenges: Integrated compiler support for multiple languages with automated test suite validation.",
      "Community Forum: Robust discussion platform for peer learning and resource sharing.",
      "Placement Ready: Curated specialized tracks for interview preparation and technical skill assessments.",
      "Gamified Learning: Achievement badges, streak systems, and global leaderboards to drive engagement.",
    ],
    techStack: [
      "Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Redux Toolkit, Zustand",
      "Backend: Node.js, Express.js (TypeScript), Prisma ORM, PostgreSQL",
      "Real-time & AI: Socket.io, Redis, Bull Queues for background tasks, Supabase Auth",
      "Developer Experience: Swagger/OpenAPI, Playwright E2E testing, Husky",
    ],
    problem:
      "Engineering education is often disjointed, with students moving between static roadmaps, isolated coding editors, and scattered community forums. This lack of integration leads to poor progress tracking and a higher dropout rate during self-paced learning.",
    solution:
      "A unified Engineering Learning Platform (SaaS) that seamlessly integrates structured curriculum with interactive coding tools and real-time social competition. EduScale provides a 'single source of truth' for the student's entire technical journey.",
    challengesSolved:
      "The hardest problem was preventing race conditions when two users simultaneously start the same battle. The fix: redlock (Redlock algorithm over Redis) acquires a distributed lock before any battle state write, preventing duplicate battle creation. Socket.io horizontal scaling uses @socket.io/redis-adapter so any Node.js instance can broadcast to any room. opossum circuit breaker wraps the remote code-execution service — when it trips, battles degrade gracefully instead of hanging. prom-client exposes active-battle count, queue depth, and p99 latency on /metrics.",
    showcases: [
      {
        title: "Unified User Dashboard",
        description:
          "A centralized hub tracking enrolled roadmaps, ongoing battle states, and overall technical progress. Completely unified between Light and Dark modes.",
        imageDark: "/Images/eduscale/dashboard_dark.png",
        imageLight: "/Images/eduscale/dashboard_light.png",
      },
      {
        title: "Interactive Career Roadmaps",
        description:
          "Node-based curriculum visualization allowing students to track granular progress and unlock specialized technical tracks.",
        imageDark: "/Images/eduscale/roadmap_dark.png",
        imageLight: "/Images/eduscale/roadmap_light.png",
      },
      {
        title: "Technical Assessment Suite",
        description:
          "A specialized multi-language execution environment providing integrated testing, static analysis, and time complexity benchmarking.",
        imageDark: "/Images/eduscale/challenges_dark.png",
        imageLight: "/Images/eduscale/challenges_light.png",
      },
      {
        title: "Real-time Battle Zone",
        description:
          "A competitive arena powered by WebSockets, allowing sub-second real-time multiplayer coding showdowns with live leaderboards.",
        imageDark: "/Images/eduscale/battle_dark.png",
        imageLight: "/Images/eduscale/battle_light.png",
      },
    ],
  },
  {
    id: "devtrack",
    title: "DevTrack",
    description:
      "A premium developer intelligence dashboard that track coding progress, analyzes learning patterns, and provides actionable insights for continuous improvement.",
    image: "/projects/devtrack/dashboard_dark.png",
    isShowcase: true,
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Tailwind CSS",
      "Shadcn UI",
      "Recharts",
    ],
    live: "https://daily-dev-track.vercel.app",
    github: "https://github.com/Shailesh93602/devtrack",
    detailedDescription:
      "DevTrack is a high-performance developer productivity ecosystem built to centralize tracking of DSA progress, project milestones, and daily coding activity. It features a rule-based intelligence engine that generates personalized insights and prescriptive recommendations to help developers build a balanced technical profile.",
    architecture: {
      layers: [
        {
          name: "Frontend",
          items: [
            "Next.js (App Router)",
            "React 19",
            "Tailwind CSS",
            "Shadcn UI",
            "Recharts",
          ],
        },
        {
          name: "Backend / Services",
          items: [
            "Next.js Server Components",
            "Prisma ORM",
            "PostgreSQL (Supabase)",
            "Rule Engine",
          ],
        },
        {
          name: "Infrastructure",
          items: ["Supabase Auth", "PostgreSQL Hosting", "Vercel Deployment"],
        },
      ],
      description:
        "A modern full-stack architecture leveraging server-side business logic and parallel database execution for sub-second dashboard updates.",
    },
    keyMetrics: [
      {
        label: "Dashboard Latency",
        value: "< 300ms",
        description: "Parallelized data aggregation and in-memory scoring",
      },
      {
        label: "Pattern Intelligence",
        value: "Real-time",
        description: "Automated analysis of DSA problem distributions",
      },
      {
        label: "Data Integrity",
        value: "100%",
        description: "Atomic transactions for multi-entity tracking",
      },
    ],
    userFlow: [
      {
        step: "Authentication",
        description:
          "Secure login via Supabase with automatic session management.",
      },
      {
        step: "Dashboard Overview",
        description:
          "Real-time visualization of developer score, streaks, and weekly momentum.",
      },
      {
        step: "Activity Tracking",
        description:
          "Granular logging of daily study topics and DSA problem solving.",
      },
      {
        step: "Intelligent Guidance",
        description:
          "Receive AI-driven recommendations for next learning steps based on analysis.",
      },
    ],
    features: [
      "Developer Scoring System: A comprehensive 0-100 score based on consistency, DSA depth, and project productivity.",
      "Pattern Analysis: Automatically categorizes solved problems and identifies strongest/weakest technical patterns.",
      "Prescriptive Recommendations: Rule-based engine that suggests specific daily tasks to optimize learning high-yield patterns.",
      "Session Tracking: Integrated timing and activity logging for deep-work focus sessions.",
      "Visual Analytics: High-fidelity charts for weekly progress, difficulty distribution, and activity heatmaps.",
      "Dynamic Insights: AI-driven observational feedback on streak milestones and activity trends.",
    ],
    techStack: [
      "Frontend: Next.js 15, React 19, Tailwind CSS v4, Lucide React, Shadcn UI, Recharts",
      "Backend: Next.js Server Actions, Prisma ORM, PostgreSQL (via Supabase)",
      "Services: Scoping Engine, Pattern Intelligence Service, Streak Manager, Recommendation Logic",
      "Dev Tools: Playwright E2E Testing, ESLint, Prettier",
    ],
    problem:
      "Developers often lack a centralized way to track their growth across disparate areas like DSA, projects, and daily consistency. Manual tracking is fragmented, and raw data doesn't offer actionable paths to improvement.",
    solution:
      "DevTrack solves this by providing a unified intelligence layer. It doesn't just record data; it analyzes it using a proprietary scoring and recommendation engine to guide developers toward their technical goals.",
    challengesSolved:
      "The core challenge was building a real-time analytics suite that remains performant as the number of logged activities grows. I implemented a modular service architecture that uses Promise.all for database fetching and handles complex aggregations in-memory before reaching the client.",
    showcases: [
      {
        title: "Intelligence Dashboard",
        description:
          "A centralized hub featuring the Developer Score, streak tracking, and personalized next-step recommendations.",
        imageDark: "/projects/devtrack/dashboard_dark.png",
        imageLight: "/projects/devtrack/dashboard_light.png",
      },
      {
        title: "DSA Tracking & Insights",
        description:
          "Detailed problem tracking with automated pattern analysis and difficulty distribution visualization.",
        imageLight: "/projects/devtrack/dsa_tracking.png",
      },
      {
        title: "Daily Activity Logging",
        description:
          "Streamlined data entry for daily coding logs with topic tagging and progress history.",
        imageLight: "/projects/devtrack/daily_log_form.png",
      },
      {
        title: "Developer Settings",
        description:
          "Premium user management and profile configuration with seamless theme switching.",
        imageLight: "/projects/devtrack/settings_ui.png",
      },
    ],
  },
  {
    id: "vibe-testing",
    title: "Vibe Testing (ContextQA)",
    description:
      "AI-powered web testing Chrome extension built at ContextQA. ~1,900 merged PRs in production — real-time UI testing with AI-generated bug scenarios, screenshot capture, and chat-based fix workflows.",
    image: "/Images/vibe_testing/full_report.png",
    tags: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Chrome Extension",
      "AI/ML",
      "WebSockets",
    ],
    detailedDescription:
      "Vibe Testing (also known as ContextQA) is a sophisticated Chrome extension designed for the modern web ecosystem. It integrates with AI agents to perform autonomous UI validation, broken link detection, performance analysis, and accessibility testing. It specifically targets sites built on platforms like v0.dev and Replit, providing real-time feedback and screenshots of execution.",
    architecture: {
      layers: [
        {
          name: "Frontend (Extension)",
          items: ["Next.js", "Tailwind CSS", "React", "Chrome Extension API"],
        },
        {
          name: "Backend (Intelligence)",
          items: [
            "Python (AI Agent)",
            "Node.js (Execution)",
            "Playwright Engine",
          ],
        },
        {
          name: "Communication",
          items: ["Socket.io (Live Logs)", "Browser Storage"],
        },
      ],
      description:
        "A hybrid architecture combining a lightweight browser extension with a powerful remote AI execution engine for autonomous web testing.",
    },
    features: [
      "AI-driven autonomous UI testing and validation",
      "Real-time communication with execution engine via WebSockets",
      "Integrated broken link detection and SEO analysis",
      "WCAG 2.1 AA accessibility compliance testing",
      "Live log streaming and visual state updates with screenshots",
      "One-click fix suggestions for AI-generated code",
    ],
    techStack: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, Manifest V3",
      "Backend: Node.js, Python (AI Agent), Playwright",
      "Communication: Socket.io, Browser Local Storage",
    ],
    problem:
      "Rapid web development outpaces traditional testing. Developers lack a way to perform real-time, automated UI validation on dynamically generated, AI-driven websites without complex manual setup.",
    solution:
      "A high-performance Chrome extension that leverages AI agents to capture live browser state and perform complex UI tests. It provides detailed reports with prioritized bugs and actionable fix suggestions.",
    challengesSolved:
      "Architecting a real-time, bi-directional communication bridge between the browser extension and a remote testing engine while ensuring sub-200ms latency for live log streaming and visual state updates. Shipped and maintained at production scale — ~1,900 merged PRs across features, bug fixes, and code reviews.",
    gallery: [
      "/Images/vibe_testing/full_report.png",
      "/Images/vibe_testing/live_execution_with_steps_and_screenshots.png",
      "/Images/vibe_testing/bug_summary_in_report.png",
      "/Images/vibe_testing/configure_and_run_test_modal.png",
      "/Images/vibe_testing/popup_after_login.png",
    ],
  },
  {
    id: "axetos",
    title: "AxeTos (ContextQA)",
    description:
      "WCAG A/AA/AAA accessibility testing Chrome extension built at ContextQA. ~1,600 merged PRs in production — automated auditing with precise DOM locators, violation categorization, and persistent script-injection fixes.",
    image: "/Images/portfolio1.png",
    tags: [
      "Node.js",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Accessibility",
      "Chrome Extension",
    ],
    detailedDescription:
      "AxeTos (part of the ContextQA suite) is a comprehensive solution for web accessibility. It combines a powerful Chrome extension with a dedicated Node.js backend to audit websites against WCAG A, AA, and AAA standards. Beyond just identifying issues, it offers a revolutionary 'instant fix' capability via script injection.",
    architecture: {
      layers: [
        {
          name: "Frontend (Extension)",
          items: [
            "Next.js",
            "Tailwind CSS",
            "TypeScript",
            "Chrome Scripting API",
          ],
        },
        {
          name: "Backend (Service)",
          items: ["Node.js", "Express.js", "Axe-core Engine"],
        },
        { name: "Infrastructure", items: ["AWS S3 (Script Storage)"] },
      ],
      description:
        "A comprehensive auditing and remediation suite that identifies accessibility violations and generates persistent fixes.",
    },
    features: [
      "Automated WCAG A/AA/AAA standards auditing",
      "Component-level issue visualization in the UI",
      "Intelligent fix suggestions with live preview",
      "Script generation for permanent, development-free fixes",
      "High-performance Node.js backend for complex analysis",
    ],
    techStack: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS, Chrome Scripting API",
      "Backend: Node.js, Express.js, Axe-core",
      "Infrastructure: AWS S3",
    ],
    problem:
      "Web accessibility (WCAG) compliance is a critical but often manual and neglected process. Identifying and fixing thousands of accessibility violations across large-scale sites creates a significant developmental bottleneck.",
    solution:
      "Comprehensive auditing suite that runs detailed WCAG A/AA/AAA diagnostics. It features a unique remediation engine that applies persistent fixes via script injection, allowing for 'zero-code' accessibility fixes.",
    challengesSolved:
      "Building a non-destructive DOM manipulation engine that reliably applies accessibility fixes (contrast adjustments, ARIA role remediation) across varied third-party frameworks without interfering with existing site logic. Maintained at production scale — ~1,600 merged PRs across features, bug fixes, and code reviews.",
  },
  {
    id: "codesensei-search",
    title: "CodeSenseiSearch",
    description:
      "AI-powered semantic code search engine. Index a codebase and query it in natural language — 'where is auth token refreshed?' returns ranked file+line results using vector embeddings.",
    image: "/Images/portfolio1.png",
    tags: [
      "NestJS",
      "TypeScript",
      "Vector Embeddings",
      "Semantic Search",
      "PostgreSQL",
      "pgvector",
      "OpenAI Embeddings",
      "REST API",
    ],
    github: "https://github.com/Shailesh93602/CodeSenseiSearch",
    detailedDescription:
      "A full NestJS backend that ingests source files, chunks them into meaningful segments (function-level, not line-level), generates vector embeddings, stores them in PostgreSQL with pgvector, and serves a REST API for semantic search. Phase 7 (full search pipeline) is complete. Natural language queries like 'where does the payment retry logic live?' return file paths and line ranges ranked by cosine similarity.",
    architecture: {
      layers: [
        {
          name: "Ingestion",
          items: [
            "File chunker (function/class-level segments)",
            "OpenAI Embeddings API",
            "PostgreSQL + pgvector",
          ],
        },
        {
          name: "Search API",
          items: [
            "NestJS REST API",
            "Query embedding generation",
            "Cosine similarity ranking",
            "File + line range results",
          ],
        },
        {
          name: "Infrastructure",
          items: ["PostgreSQL (pgvector extension)", "NestJS", "TypeScript"],
        },
      ],
      description:
        "Ingestion pipeline chunks source files at the function/class boundary (not line-by-line), embeds each chunk, and stores vectors in pgvector. Search queries are embedded at runtime and matched via cosine similarity — no keyword index required.",
    },
    features: [
      "Natural language code search: 'where is auth handled?' returns ranked file+line results",
      "Function-level chunking for meaningful search granularity (not noisy line-by-line)",
      "pgvector cosine similarity ranking with configurable top-K results",
      "NestJS REST API with Swagger documentation",
      "Supports indexing any TypeScript/JavaScript codebase",
      "Phase 7 complete: full ingestion → embedding → search pipeline working end-to-end",
    ],
    techStack: [
      "Backend: NestJS, TypeScript, Express",
      "AI: OpenAI Embeddings API, vector similarity search",
      "Database: PostgreSQL with pgvector extension",
      "API: REST with Swagger/OpenAPI documentation",
    ],
    problem:
      "grep and file search break down on large codebases — you need to know the exact term to search for. New engineers and AI tools struggle to navigate unfamiliar codebases when the vocabulary is unknown.",
    solution:
      "Embed the entire codebase at function granularity. At query time, embed the natural language question and find the nearest code chunks by cosine similarity. No keyword matching required — semantic meaning drives results.",
    challengesSolved:
      "The key insight was chunking at function/class boundaries rather than fixed line counts. Fixed-size chunks split function bodies mid-logic, producing low-quality embeddings. Boundary-aware chunking keeps semantic units intact, which significantly improves search relevance. Phase 7 delivered a working end-to-end pipeline from raw source files to ranked search results.",
  },
  {
    id: "khatago",
    title: "KhataGO",
    description:
      "WhatsApp-first AI Accounting & Billing platform for small businesses, featuring real-time transaction recording via chat and automated i18n support.",
    image: "/Images/khatago/landing.png",
    isShowcase: true,
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Gemini AI",
      "i18n",
      "Node.js",
      "Redis",
    ],
    live: "https://khatago.vercel.app/",
    detailedDescription:
      "KhataGO is a revolutionary WhatsApp-first SaaS billing platform designed for the Indian MSME market. It leverages Gemini AI to parse natural language messages and images of receipts directly from WhatsApp, automatically recording transactions into a cloud-based ledger.",
    architecture: {
      layers: [
        {
          name: "Interface",
          items: [
            "WhatsApp Cloud API",
            "Next.js (Web Dashboard)",
            "Tailwind CSS",
          ],
        },
        {
          name: "Intelligence",
          items: ["Google Gemini AI", "Node.js (Webhooks)"],
        },
        {
          name: "Data & Ops",
          items: ["Prisma ORM", "PostgreSQL (Supabase)", "Redis / Bull Queues"],
        },
      ],
      description:
        "An event-driven, WhatsApp-first architecture designed for simplicity and scalability in small business accounting.",
    },
    features: [
      "Natural Language WhatsApp Bot: Record sales, purchases, and expenses like you talk.",
      "AI Receipt Processing: Send bill photos to WhatsApp - the AI extracts and records all details.",
      "CA & Accountant Portal: Date-range exports in CSV and Tally-ready formats.",
      "Dynamic i18n Engine: Full UI in 3+ languages (English, Hindi, Gujarati).",
      "Financial Analytics: Real-time charts for sales, purchases, and net profit trends.",
      "Zero-App Footprint: Manage your entire business accounting without ever leaving WhatsApp.",
    ],
    techStack: [
      "Frontend: Next.js (App Router), React, Tailwind CSS, Recharts, i18next",
      "Backend: Node.js, Express (TypeScript), Prisma ORM, PostgreSQL",
      "AI & Messaging: Google Gemini AI, WhatsApp Cloud API, Redis/Bull Queues",
      "Infrastructure: Supabase (Auth & Real-time), Vercel",
    ],
    problem:
      "Small business owners in India struggle with complex accounting software. They often rely on manual notebooks (Khatas), which lead to data loss, calculation errors, and delays in GST compliance.",
    solution:
      "A 'zero-learning-curve' platform that works where the user already is: WhatsApp. By combining the simplicity of chat with the power of AI, KhataGO makes business accounting as easy as sending a message.",
    challengesSolved:
      "Meta's WhatsApp Cloud API sends duplicate webhook events. The deduplication layer hashes the incoming message ID and checks a Redis TTL window before processing — duplicate events are dropped in under 1ms. The Gemini AI OCR pipeline downloads the WhatsApp image URL, sends it to Gemini Vision, and maps the extracted JSON (merchant, amount, date, line items) to a ledger transaction. Tally XML export is non-trivial: Tally's voucher schema requires specific date formatting, ledger name lookups, and GST field structure — wrong XML silently fails to import. Bull queues decouple all three operations so the WhatsApp bot responds immediately while processing happens in the background.",
    userFlow: [
      {
        step: "Onboarding",
        description:
          "Business owners register via the web portal and connect their WhatsApp Business API.",
      },
      {
        step: "Master Data Setup",
        description:
          "Configure customer/vendor records and categories in the web dashboard.",
      },
      {
        step: "Transaction Logging",
        description:
          "Send text messages or photos of bills directly to the KhataGO WhatsApp bot.",
      },
      {
        step: "AI Processing OCR",
        description:
          "The AI agent processes receipts via OCR and creates draft transactions automatically.",
      },
      {
        step: "Reporting & Export",
        description:
          "Review monthly GST summaries and export Tally-compatible XML vouchers for accountants.",
      },
    ],
    showcases: [
      {
        title: "Business Ledger Dashboard",
        description:
          "A responsive, single-page summary tracking daily, weekly, and monthly incoming/outgoing financial trends.",
        image: "/Images/khatago/dashboard.png",
      },
      {
        title: "Transaction Activity Feed",
        description:
          "A chronological list of all categorized invoices, expenses, and payments with immediate export and edit capabilities.",
        image: "/Images/khatago/transactions.png",
      },
      {
        title: "Monthly Revenue & GST Portal",
        description:
          "An integrated report generation interface allowing CA firms to download precise GST-ready and Tally XML statements.",
        image: "/Images/khatago/reports.png",
      },
    ],
  },
];
