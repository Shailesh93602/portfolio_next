export interface ShowcaseItem {
  title: string;
  imageLight?: string;
  imageDark?: string;
  image?: string; // fallback if only one theme
  description?: string;
}

export interface Incident {
  title: string;
  symptom: string;
  hypothesis: string;
  fix: string;
  confirmed: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  /**
   * The repo is private, so `github` would 404 for every visitor.
   *
   * Set this instead of deleting the URL: the link is still the right one the
   * day it goes public, and a visitor is told WHY there is no link rather than
   * being left to wonder whether the project has any code at all.
   */
  githubPrivate?: boolean;
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
  incidents?: Incident[];
}

const rawProjects: Project[] = [
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
      "Circuit Breaker",
      "Prometheus",
      "Node.js",
    ],
    live: "https://eduscale.vercel.app/",
    github: "https://github.com/Shailesh93602/devscale",
    detailedDescription:
      "An EdTech platform built around a distributed real-time engine. The backend uses @socket.io/redis-adapter for horizontal Socket.io scaling across multiple Node.js instances, redlock for distributed locking on the battle start / submit-answer / complete paths, opossum as a circuit breaker around the remote code-execution service (Judge0), prom-client exposing a Prometheus /metrics endpoint, and Bull queues for email delivery with a dead-letter queue. Frontend is Next.js 16 App Router with Redux Toolkit. The AI layer (code review, tutor, pgvector-backed recommendations) runs on each user's OWN provider key rather than a shared one — encrypted at rest with AES-256-GCM, with the model-fallback cooldowns and the circuit breaker partitioned per key so one tenant's exhausted quota or bad credential cannot degrade another's.",
    architecture: {
      layers: [
        {
          name: "Frontend",
          items: [
            "Next.js 16 (App Router)",
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
            "Redis (adapter + Redlock + cache + rate limiting)",
            "Bull queue + dead-letter queue for email delivery",
            "Supabase Auth",
            "Vercel / AWS",
          ],
        },
      ],
      description:
        "Distributed real-time architecture: Socket.io rooms backed by the Redis adapter for multi-instance scaling. Redlock guards the battle start, answer-submit and battle-complete paths against concurrent writes. An opossum circuit breaker wraps the Judge0 code-execution call. prom-client exposes request-duration, active-connection and memory metrics on /metrics.",
    },
    keyMetrics: [
      {
        label: "Real-time",
        value: "Redis adapter",
        description:
          "Cross-instance battle broadcast via @socket.io/redis-adapter (works across Node instances)",
      },
      {
        label: "Concurrency",
        value: "Redlock",
        description:
          "Distributed lock on the battle start / submit-answer / complete paths, so horizontally-scaled instances can't double-write them",
      },
      {
        label: "Resilience",
        value: "Circuit breaker",
        description:
          "opossum around code execution + Redis-backed rate limiting with in-memory fallback",
      },
      {
        label: "Tenant isolation",
        value: "Per-key blast radius",
        description:
          "Users bring their own LLM key. Model cooldowns and the AI circuit breaker are partitioned per key, so one user's exhausted quota or invalid credential cannot degrade anyone else's — verified by mutation testing, not just by a passing suite",
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
      "Bring-your-own AI keys: users supply their own Gemini key, stored AES-256-GCM encrypted at rest, so nobody's usage is billed to a shared credential.",
    ],
    techStack: [
      "Frontend: Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Redux Toolkit, Zustand",
      "Backend: Node.js, Express.js (TypeScript), Prisma ORM, PostgreSQL",
      "Real-time: Socket.io + @socket.io/redis-adapter, Redis, Redlock, Bull (email queue + DLQ), Supabase Auth",
      "Developer Experience: Swagger/OpenAPI, Playwright E2E testing",
    ],
    problem:
      "Engineering education is often disjointed, with students moving between static roadmaps, isolated coding editors, and scattered community forums. This lack of integration leads to poor progress tracking and a higher dropout rate during self-paced learning.",
    solution:
      "A unified Engineering Learning Platform (SaaS) that seamlessly integrates structured curriculum with interactive coding tools and real-time social competition. EduScale provides a 'single source of truth' for the student's entire technical journey.",
    challengesSolved:
      "The hardest problem was preventing race conditions when two users simultaneously start the same battle. The fix: redlock acquires a distributed lock (fail-fast, retryCount 0) around the battle start, submit-answer and complete handlers, so two instances can't both drive the same transition. Socket.io horizontal scaling uses @socket.io/redis-adapter with two independent ioredis connections — pub and sub have to be separate clients or a long-running write on the pub connection stalls the subscriber. opossum wraps the Judge0 code-execution call so a slow or failing executor degrades the battle instead of hanging it.",
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
          "A competitive arena powered by WebSockets, allowing real-time multiplayer coding showdowns with live leaderboards.",
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
      "Supabase Realtime",
      "Tailwind CSS",
      "Shadcn UI",
      "Recharts",
    ],
    live: "https://daily-dev-track.vercel.app",
    github: "https://github.com/Shailesh93602/devtrack",
    detailedDescription:
      "DevTrack is a developer productivity dashboard tracking DSA progress, project milestones, and daily coding activity. It uses Supabase Realtime (postgres_changes subscriptions) so the activity feed updates live across tabs and devices without polling — a green pulsing indicator shows the WebSocket channel status. The analytics layer generates personalized insights and prescriptive recommendations from historical patterns.",
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
        "A modern full-stack architecture leveraging server-side business logic and parallel database execution for fast dashboard updates.",
    },
    keyMetrics: [
      {
        label: "Dashboard queries",
        value: "9 in parallel",
        description:
          "One Promise.all fan-out instead of a serial waterfall, with the scoring done in memory",
      },
      {
        label: "Pattern Intelligence",
        value: "Real-time",
        description: "Automated analysis of DSA problem distributions",
      },
      {
        label: "Data Integrity",
        value: "$transaction",
        description:
          "Multi-entity writes (projects, milestones) go through Prisma interactive transactions",
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
      "Frontend: Next.js 16, React 19, Tailwind CSS v4, Lucide React, Shadcn UI, Recharts",
      "Backend: Next.js route handlers (19 API routes) + a server action for auth, Prisma ORM, PostgreSQL (via Supabase)",
      "Services: Scoping Engine, Pattern Intelligence Service, Streak Manager, Recommendation Logic",
      "Dev Tools: Playwright E2E Testing, ESLint, Prettier",
    ],
    problem:
      "Developers often lack a centralized way to track their growth across disparate areas like DSA, projects, and daily consistency. Manual tracking is fragmented, and raw data doesn't offer actionable paths to improvement.",
    solution:
      "DevTrack solves this by providing a unified intelligence layer. It doesn't just record data; it analyzes it using a proprietary scoring and recommendation engine to guide developers toward their technical goals.",
    challengesSolved:
      "The core challenge was building a real-time analytics suite that stays responsive as the number of logged activities grows. The dashboard needs nine independent aggregates, so a modular service layer issues them as one Promise.all fan-out rather than a serial waterfall and does the composite scoring in memory before anything reaches the client. The live activity feed is a Supabase Realtime postgres_changes subscription on daily_logs filtered to the current user, so multi-tab sync costs nothing in polling.",
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
      "AI-powered web testing Chrome extension built at ContextQA (shipped during my first 2-3 months on the team) — real-time UI testing with AI-generated bug scenarios, screenshot capture, and chat-based fix workflows.",
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
      "Architecting a real-time, bi-directional communication bridge between the browser extension and a remote testing engine, streaming live execution logs and visual state back to the browser as a run progresses. Shipped in production during my first 2-3 months at ContextQA.",
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
      "WCAG A/AA/AAA accessibility testing Chrome extension built at ContextQA (shipped during my first 2-3 months on the team) — automated auditing with precise DOM locators, violation categorization, and persistent script-injection fixes.",
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
      "Building a non-destructive DOM manipulation engine that reliably applies accessibility fixes (contrast adjustments, ARIA role remediation) across varied third-party frameworks without interfering with existing site logic. Shipped in production during my first 2-3 months at ContextQA.",
  },
  {
    id: "codesensei-search",
    title: "CodeSenseiSearch",
    description:
      "Semantic code-search monorepo — Next.js + NestJS deployed on Vercel, Postgres with pgvector on Supabase, BullMQ workers backed by Upstash Redis, embeddings via Gemini.",
    image: "/Images/portfolio1.png",
    tags: [
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "pgvector",
      "Gemini Embeddings",
      "Monorepo",
    ],
    github: "https://github.com/Shailesh93602/CodeSenseiSearch",
    live: "https://code-sensei-search-web.vercel.app",
    detailedDescription:
      "A monorepo (pnpm workspaces) exploring AI-powered semantic code search. Shipped so far: Next.js landing page with feature showcase, search UI with real-time suggestions and filtering against a ~50-example mock dataset, NestJS backend scaffolding, Prisma schema with a pgvector column, and a Docker Compose for Postgres + Redis + pgAdmin. The ingestion → embedding → retrieval pipeline is prototyped but not yet wired end-to-end; Phase 2 (real content ingestion from GitHub / StackOverflow) is the active work.",
    architecture: {
      layers: [
        {
          name: "Frontend (Phase 1 — shipped)",
          items: [
            "Next.js + Tailwind landing page",
            "Search UI with suggestions, filters, syntax highlighting",
            "Mock dataset (~50 examples) for UX validation",
          ],
        },
        {
          name: "Backend (scaffolded)",
          items: [
            "NestJS REST API skeleton",
            "Prisma schema with pgvector column",
            "Chunker worker (function/class-boundary segmentation)",
          ],
        },
        {
          name: "Infrastructure",
          items: ["PostgreSQL + pgvector", "Redis", "Docker Compose"],
        },
      ],
      description:
        "A pnpm monorepo laying groundwork for semantic code search. Phase 0/1 are complete (monorepo tooling + UI against mock data); the retrieval pipeline is next. Included here as a design + scaffolding sample, not a finished product.",
    },
    features: [
      "pnpm monorepo with shared TypeScript packages (tsconfig, eslint, prettier)",
      "Next.js landing page + search interface with real-time suggestions and multi-field filtering",
      "Prisma schema with pgvector column (dimension tuning pending real embedding model)",
      "Chunker worker that splits source at function/class boundaries (unit-test coverage is an open P1)",
      "Docker Compose for Postgres + Redis + pgAdmin — clone-and-run local setup",
      "CI/CD pipeline + ESLint + Prettier wired across all workspaces",
    ],
    techStack: [
      "Frontend: Next.js 14, Tailwind CSS, Prism.js syntax highlighting",
      "Backend: NestJS, TypeScript, Prisma",
      "Database: PostgreSQL with pgvector extension",
      "Infra: Docker Compose, pnpm workspaces, shared tsconfig",
    ],
    problem:
      "grep and file search break down on large codebases — you need to know the exact term. New engineers and AI tools struggle to navigate unfamiliar code when the vocabulary is unknown. A semantic layer over the codebase could turn 'where is auth handled?' into a ranked list of file + line locations.",
    solution:
      "Monorepo with an ingestion pipeline that chunks source at function/class boundaries (not fixed-line), embeds each chunk, and stores vectors in pgvector. Queries are embedded at runtime and matched via cosine similarity. The UX layer is built against mock data so the interaction design is validated before the retrieval backend is complete.",
    challengesSolved:
      "The scaffolding phase made the key insight concrete: fixed-size chunks split function bodies mid-logic and produce low-quality embeddings, whereas function/class-boundary chunks preserve semantic units. Phase 1 validated the UX affordances needed around results (filters, sort, source badges) by running the UI against mock data first, so the retrieval work can focus on quality rather than on reactive UI changes. Next: wire real embeddings through the chunker, finalise the pgvector index strategy (ivfflat vs hnsw), and add chunker unit tests.",
  },
  {
    id: "khatago",
    title: "KhataGO",
    description:
      "WhatsApp-first accounting platform. Webhook → Gemini function-calling → idempotent ledger write. Handles transactions, receivables, and reconciliation entirely through WhatsApp chat + receipt photos.",
    image: "/Images/khatago/landing.png",
    isShowcase: true,
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Gemini AI",
      "Function-calling",
      "i18n",
      "Node.js",
      "Webhook Idempotency",
    ],
    live: "https://khatago.vercel.app/",
    github: "https://github.com/Shailesh93602/khatago",
    // Private repo. Renders as "Private repository" rather than a link that
    // 404s — the URL stays so flipping it public is a one-line change.
    githubPrivate: true,
    detailedDescription:
      "KhataGO is a WhatsApp-first bookkeeping platform for Indian MSMEs. The backend is a reconciliation pipeline: Meta webhooks arrive with at-least-once delivery, and idempotency is enforced in Postgres rather than a cache — a unique constraint on the WhatsApp message id rejects duplicate deliveries, and a conditional UPDATE (PENDING→PROCESSING) atomically claims each message so concurrent redeliveries produce exactly one Gemini run instead of a double ledger write. Gemini 2.0 Flash with function-calling parses both text ('Sold 500 to Ram') and receipt images (OCR → structured JSON with merchant/amount/date/line items) into 10 tool calls — create_transaction, create_receivable, record_payment_received, get_party_ledger, send_payment_reminder, and others — each mapped to a Prisma write. Results flow back to the user over WhatsApp; a CA portal exports Tally-ready XML vouchers for month-end close.",
    architecture: {
      layers: [
        {
          name: "Ingress",
          items: [
            "WhatsApp Cloud API webhook (Meta)",
            "HMAC verify + x-hub-signature check",
            "DB-enforced dedup (unique waMessageId) + atomic PENDING→PROCESSING claim",
          ],
        },
        {
          name: "AI / Reconciliation",
          items: [
            "Gemini 2.0 Flash with function-calling (8 tools)",
            "Receipt-image pipeline: download → Vision → structured JSON",
            "Tool executor maps function calls to Prisma writes",
            "Chat history windowed to last 10 turns per user",
          ],
        },
        {
          name: "Ledger",
          items: [
            "Prisma ORM + PostgreSQL (Supabase-hosted)",
            "Transactions, Receivables, Payments, Party ledgers",
            "Compound unique keys prevent double-entries",
            "Tally XML export (voucher schema, GST fields)",
          ],
        },
        {
          name: "Interface",
          items: [
            "Next.js (App Router) web dashboard",
            "WhatsApp text + media in 3 languages (en/hi/gu)",
            "Daily reminder cron (Vercel scheduled)",
          ],
        },
      ],
      description:
        "A reconciliation pipeline dressed up as a WhatsApp bot: events in, idempotency-guarded tool-calls transform them into ledger writes, export back to accountants' formats. The interesting engineering is upstream of the UI — dedup, function-calling determinism, double-entry prevention.",
    },
    keyMetrics: [
      {
        label: "Duplicate webhooks",
        value: "0 double-writes",
        description:
          "Unique waMessageId + an atomic PENDING→PROCESSING claim drop Meta's redeliveries before any LLM call",
      },
      {
        label: "Tool calls",
        value: "10",
        description:
          "Gemini function-calling surface: transactions, receivables, payments, ledgers, reminders",
      },
      {
        label: "Languages",
        value: "3",
        description:
          "Full i18n across English, Hindi, and Gujarati for both UI and bot responses",
      },
      {
        label: "Credential storage",
        value: "AES-256-GCM",
        description:
          "Users bring their own Gemini key, encrypted at rest with authenticated encryption and a random IV per write. No read path returns it — not even to the person who saved it",
      },
    ],
    features: [
      "Natural Language WhatsApp Bot: Record sales, purchases, and expenses like you talk.",
      "AI Receipt Processing: Send bill photos to WhatsApp - the AI extracts and records all details.",
      "CA & Accountant Portal: Date-range exports in CSV and Tally-ready formats.",
      "Dynamic i18n Engine: Full UI in 3+ languages (English, Hindi, Gujarati).",
      "Financial Analytics: Real-time charts for sales, purchases, and net profit trends.",
      "Zero-App Footprint: Manage your entire business accounting without ever leaving WhatsApp.",
      "Bring-your-own AI key: add your own Gemini key in Settings, encrypted at rest, removable at any time.",
    ],
    techStack: [
      "Frontend: Next.js (App Router), React, Tailwind CSS, Recharts, i18next",
      "Backend: Node.js, Express (TypeScript), Prisma ORM, PostgreSQL",
      "AI & Messaging: Google Gemini AI (function-calling + Vision OCR), WhatsApp Cloud API",
      "Infrastructure: Supabase (Auth & Real-time), Vercel",
    ],
    problem:
      "Small business owners in India struggle with complex accounting software. They often rely on manual notebooks (Khatas), which lead to data loss, calculation errors, and delays in GST compliance.",
    solution:
      "A 'zero-learning-curve' platform that works where the user already is: WhatsApp. By combining the simplicity of chat with the power of AI, KhataGO makes business accounting as easy as sending a message.",
    challengesSolved:
      "Meta's WhatsApp Cloud API delivers at least once, so the same message arrives twice — and an LLM call is expensive enough that deduplicating after it is too late. Idempotency lives in Postgres instead of a cache: the message id is a unique column, so a duplicate insert fails at the DB, and processing starts with a conditional UPDATE that flips aiStatus PENDING→PROCESSING only if it is still PENDING. If that update changes zero rows, another delivery already claimed the message and this one exits — concurrent redeliveries yield exactly one Gemini run and one ledger write, with no cache to fall out of sync with the audit row. The webhook acknowledges Meta immediately and the AI work runs after the response, so a burst never times out the handler. The Gemini OCR pipeline downloads the WhatsApp image, sends it to Gemini Vision, and maps the extracted JSON (merchant, amount, date, line items) to a ledger transaction. Tally XML export is the fiddly part: the voucher schema needs specific date formatting, ledger name lookups, and GST field structure — wrong XML silently fails to import, so it is covered by 19 unit tests.",
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
  {
    id: "ballast",
    title: "BALLAST",
    description:
      "A deterministic simulation of a multi-tenant session control plane: per-tenant parallel caps, a rolling credit window, and leases over a substrate that lies. The whole execution is a pure function of one integer seed, so any failure replays byte-identically. Correctness comes from invariants, a reference oracle, mechanical mutation testing, and a shrinker that verifies its own output.",
    image: "/Images/portfolio1.png",
    tags: [
      "TypeScript",
      "Deterministic Simulation",
      "Distributed Systems",
      "Property Testing",
      "Mutation Testing",
      "Zero-dependency",
    ],
    github: "https://github.com/Shailesh93602/ballast",
    detailedDescription:
      "BALLAST models the admission problem shared by every multi-tenant platform: each tenant has a cap on concurrent work and a quota per window, capacity is finite and pre-warmed, and workers can stop responding without stopping. It is one process, zero external dependencies — no Docker, no browsers, no network — and every run is reproducible from a single integer seed. That determinism is the point: a concurrency bug that replays byte-identically is just a bug, and it is the irreproducibility that makes these systems hard. Getting there required a seeded xoshiro256** PRNG with independent substreams, rejection sampling so bounded draws are unbiased, an event queue keyed (vtime, seq) so equal-time events are totally ordered, and no unordered iteration anywhere — Map and Object.keys order leaks insertion order into results. Correctness is judged four ways that fail differently: eight invariants checked after every event, a reference oracle written to a deliberately different shape (zero incremental state, recompute from history), mechanical mutation testing to catch tests that assert nothing, and a delta-debugging shrinker that verifies its own output is still a failure, still minimal, and stable.",
    architecture: {
      layers: [
        {
          name: "Determinism spine",
          items: [
            "Seeded xoshiro256** PRNG with independent substreams",
            "Rejection sampling — no modulo bias in bounded draws",
            "Event queue keyed (vtime, seq) — equal-time events totally ordered",
            "One module owns sorted iteration; nothing else may iterate a Map",
          ],
        },
        {
          name: "Control plane",
          items: [
            "Per-tenant cap AND a global pool bound — separate invariants",
            "The cap predicate lives inside the mutation, not before it",
            "Leases with fencing tokens; a stale release is refused, not applied",
            "Replay log: credits decrement on acknowledgement, never on send",
          ],
        },
        {
          name: "Oracle",
          items: [
            "8 invariants checked after every event",
            "Reference implementation with zero incremental state",
            "Mechanical mutation harness over the policy layer",
            "ddmin shrinker that verifies its own output",
          ],
        },
      ],
      description:
        "The determinism spine makes every run reproducible; the control plane is the system under test; the oracle judges it four independent ways, because a test suite that fails only one way is a suite that agrees with itself.",
    },
    features: [
      "Every run is a pure function of one integer seed — byte-identical across a fresh process",
      "Per-tenant caps do not bound the pool: both limits are checked, as separate invariants",
      "Fencing tokens exclude a stale holder that comes back after its lease expired",
      "Reference oracle written to a different shape, so it is unlikely to share a bug",
      "Mutation testing — coverage says a line ran; a surviving mutant says nothing checked it",
      "Shrinker reduces a 10,000-event failure and then verifies the reduction",
      "A flash-sale arm: three never-oversell strategies, where the naive one provably oversells",
      "38 semantic ambiguities decided in writing BEFORE the policy code — git history as proof",
    ],
    techStack: [
      "Language: TypeScript (ESM, strict)",
      "Dependencies: none at runtime — typescript, eslint, prettier and vitest only",
      "Tests: Vitest (182)",
      "Verification: invariants + reference oracle + mutation testing + shrinker",
    ],
    problem:
      "Multi-tenant admission control fails in ways that ordinary tests do not reach. A tenant can exceed its cap; every tenant can be under its cap while the shared pool overflows, because caps sum above capacity; a worker can hold a slot forever after dying; and an at-least-once completion channel can apply an effect twice. All four are timing-dependent, so the bug that matters is the one that does not reproduce.",
    solution:
      "Remove the timing. A virtual clock, a seeded PRNG and a total order on equal-time events make the entire execution a pure function of one seed, so any failure replays exactly. On top of that, four independent checks that fail differently — invariants, a reference oracle of a deliberately different shape, mechanical mutation testing, and a self-verifying shrinker. The hardest problems turned out to be definitional rather than technical, so thirty-eight semantic ambiguities were written down and decided before any policy code existed — three of them are still open questions rather than settled ones, and are marked as such.",
    challengesSolved:
      'The suite found eight real bugs, and about as many were in the checker as in the implementation — which was the most useful thing it taught. One invariant fired on correctly-refused stale releases because the checker was consuming the control plane\'s own account of what it had done; a checker that trusts the thing it is checking is not a checker, so it now records accepted-release facts and judges those. A differential divergence exposed a spec gap rather than a code defect: nothing had ever said whether completion releases the slot. Another came from a definition — the reference used a status map to mean "was claimed", but cancel inserts a status even for a rejected admission, so rejected-then-cancelled runs were billed for credit they never spent. Mutation testing found two pieces of dead code no behavioural test could see, including a double-release branch that was unreachable because the flag guarding it was never set to true. The deeper lesson is written into the design: an ambiguity resolved silently propagates identically into both the implementation and the reference oracle, and the differential test is then structurally blind to it. Two later findings were about the harness rather than the system: the mutation runner judged a mutant killed whenever the suite failed, so with an already-failing suite it reported a flawless 100% while real survivors went unrecorded — the number that should have raised an alarm was the reassuring one, and it now refuses to run against a red baseline. And a retry-limit branch I had written turned out to be unreachable, because contention in the model stopped after the first attempt; a reachability probe over every input shape confirmed it never fired, so the model was made to sustain contention rather than the branch being deleted.',
  },
  {
    id: "grounded",
    title: "Grounded — Production RAG Starter",
    description:
      "A RAG starter that answers only from your sources, cites them, and says “I don't know” instead of hallucinating. Idempotent ingestion (content-hash dedup), retries with backoff, and an eval harness that catches regressions in CI. Runs fully offline — no API key or database required.",
    image: "/Images/portfolio1.png",
    tags: [
      "TypeScript",
      "RAG",
      "Fastify",
      "PostgreSQL",
      "pgvector",
      "OpenAI",
      "Idempotency",
      "Vitest",
    ],
    github: "https://github.com/Shailesh93602/grounded",
    detailedDescription:
      "Grounded is the boring, reliable parts of a RAG system done right, in a codebase small enough to read in 20 minutes. Every answer cites the source chunks it used; if retrieval returns nothing relevant, it refuses (`grounded: false`) instead of guessing. Ingestion is idempotent — chunks are content-hashed so re-ingesting only embeds new or changed content, eliminating wasted API spend on every deploy. Transient embedding/LLM errors retry with backoff while 4xx fail fast. A labelled Q&A eval harness scores retrieval and answers so a prompt or model change can't silently regress quality in CI. Embedder, vector store, and LLM are all swappable via env — the default runs with an in-memory store and extractive answers, so the whole thing is testable offline with no API key and no database.",
    architecture: {
      layers: [
        {
          name: "API",
          items: [
            "Fastify: POST /ingest, POST /ask",
            "Cited answers — every response references its source chunks",
            "“I don't know” guardrail when retrieval is empty",
          ],
        },
        {
          name: "Ingestion",
          items: [
            "Content-hash dedup → embed only new/changed chunks (idempotent)",
            "Retry with backoff on transient errors; 4xx fail fast",
          ],
        },
        {
          name: "Retrieval & Eval",
          items: [
            "pgvector cosine similarity (in-memory store for offline mode)",
            "Eval harness scores retrieval + answers on a labelled set",
          ],
        },
        {
          name: "Pluggable",
          items: [
            "Embedder / store / LLM swappable via env",
            "Default: no API key, no DB — fully offline-testable",
          ],
        },
      ],
      description:
        "An ask request retrieves the top-k chunks, refuses if nothing clears the relevance bar, otherwise composes a cited answer. Ingestion is a near-no-op on unchanged content thanks to content-hash dedup. The eval harness runs the same path against a labelled set so regressions surface in CI.",
    },
    features: [
      "Cited answers — every response references the exact source chunks it used",
      "“I don't know” guardrail — refuses instead of hallucinating when nothing relevant is retrieved",
      "Idempotent ingestion — content-hash dedup means re-ingesting only embeds new/changed chunks",
      "Retries with backoff on transient API errors; 4xx fail fast",
      "Eval harness scores retrieval + answers so prompt/model changes can't silently regress in CI",
      "Provider/store-agnostic and offline-testable — default runs with no API key and no database",
    ],
    techStack: [
      "Language: TypeScript",
      "Server: Fastify",
      "Vector store: PostgreSQL + pgvector (in-memory fallback for offline mode)",
      "LLM/embeddings: OpenAI (swappable via env)",
      "Tests: Vitest — 50 tests; 41 run offline with no API key or DB, the 9 pgvector tests skip unless Postgres is up",
    ],
    problem:
      "Most RAG demos look great until real users hit them: they hallucinate when the answer isn't in the corpus, re-embed everything on every deploy, double-charge on retries, and give you no way to tell whether a prompt change made retrieval quality worse.",
    solution:
      "A small, readable starter that does the reliable parts properly: grounded cited answers with an explicit refusal path, content-hash idempotent ingestion, retry policy that distinguishes transient from fatal, and an eval harness that turns 'did this change make things worse?' into a CI signal instead of a vibe.",
    challengesSolved:
      "The interesting design call was making the whole pipeline runnable with zero external dependencies so it's genuinely testable in CI: an in-memory vector store and an extractive answerer stand in for the real embedder/LLM behind the same interface, so the guardrail, citation, and idempotency logic are all exercised offline. The other was idempotent ingestion — hashing chunk content (not just document IDs) so an edited document re-embeds only the chunks that actually changed, which is what keeps re-ingestion cheap.",
  },
  {
    id: "idempotency-kit",
    title: "idempotency-kit",
    description:
      "Zero-dependency toolkit that makes write endpoints retry-safe and abuse-resistant: an at-most-once idempotency wrapper (the Stripe Idempotency-Key pattern) plus a sliding-window rate limiter, both over a pluggable async store. Deterministic and fully offline-testable.",
    image: "/Images/portfolio1.png",
    tags: [
      "TypeScript",
      "Idempotency",
      "Rate Limiting",
      "Zero-dependency",
      "ESM",
      "Vitest",
    ],
    github: "https://github.com/Shailesh93602/idempotency-kit",
    detailedDescription:
      "idempotency-kit packages two primitives every write API eventually needs. `withIdempotency` runs an operation at most once per key — the Stripe Idempotency-Key pattern — so client double-clicks, network retries, and webhook redeliveries don't charge, send, or create twice. A fingerprint guard rejects an idempotency key that's reused for a different request body, catching a class of client bugs. `RateLimiter` is a sliding-window limiter (smoother than fixed windows — no boundary bursts). Both run on a tiny pluggable async Store: an in-memory store ships in the box, and the one operation that must be atomic lives in the store (a SETNX / Lua script in Redis) rather than smeared across application code, so swapping to a distributed store changes nothing above it. Zero runtime dependencies, fully typed ESM, and deterministic — the clock is injectable, so tests need no real time or network.",
    architecture: {
      layers: [
        {
          name: "Idempotency",
          items: [
            "withIdempotency — at-most-once per key",
            "Fingerprint guard rejects key reuse with a different request",
            "Replay returns the original result (`replayed: true`)",
          ],
        },
        {
          name: "Rate limiting",
          items: [
            "Sliding-window RateLimiter (no fixed-window boundary bursts)",
            "Injectable clock — deterministic in tests",
          ],
        },
        {
          name: "Store",
          items: [
            "Tiny pluggable async Store interface",
            "In-memory store included; Redis/Postgres implement the same interface",
            "The atomic op (SETNX / Lua) lives in the store, not app code",
          ],
        },
      ],
      description:
        "Application code calls the two primitives; correctness-critical atomicity is delegated to the store. The in-memory store makes everything testable offline; a Redis store makes it distributed with no changes above the store boundary.",
    },
    features: [
      "withIdempotency — at-most-once execution per key (Stripe Idempotency-Key pattern)",
      "Fingerprint guard — rejects an idempotency key reused for a different request body",
      "Sliding-window rate limiter — smoother than fixed windows, no boundary bursts",
      "Pluggable async store — in-memory included; Redis/Postgres via the same interface",
      "Zero runtime dependencies, fully typed ESM",
      "Deterministic and offline-testable — inject the clock, no real time or network",
    ],
    techStack: [
      "Language: TypeScript (ESM, fully typed)",
      "Dependencies: none at runtime",
      "Store: in-memory included; Redis/Postgres pluggable",
      "Tests: Vitest (22, deterministic/offline)",
    ],
    problem:
      "Networks retry, clients double-click, and webhooks redeliver — so any write endpoint that isn't explicitly idempotent will eventually charge, send, or create something twice. Teams re-solve this badly in app code (non-atomic check-then-write races) and reach for a fixed-window rate limiter that lets bursts through at the window boundary.",
    solution:
      "Two small, correct primitives behind a pluggable store: an at-most-once idempotency wrapper with a fingerprint guard, and a sliding-window rate limiter. The single operation that must be atomic is isolated in the store (SETNX/Lua in Redis), so the rest is plain, testable code and the same API works in-memory or distributed.",
    challengesSolved:
      "The key correctness decision was confining atomicity to the store boundary: the check-then-write that must not race is a single store operation (a SETNX or Lua script in Redis), so application code can't accidentally introduce a window between the check and the write. Making the clock injectable was the other deliberate choice — sliding-window expiry and idempotency TTLs are time-dependent, and a real clock makes those tests flaky, so the whole kit is deterministic and runs offline in CI.",
  },
  {
    id: "promptproof",
    title: "promptproof",
    description:
      "Zero-dependency LLM eval + regression-diff kit. Define eval cases, grade outputs, save a baseline, and fail CI on any pass→fail. Graders for exact / includes / regex / JSON-shape / token-overlap, plus bring-your-own. Runs offline — no API key needed to test the harness.",
    image: "/Images/portfolio1.png",
    tags: [
      "TypeScript",
      "LLM Eval",
      "Regression Testing",
      "CI",
      "Zero-dependency",
      "Vitest",
    ],
    github: "https://github.com/Shailesh93602/promptproof",
    detailedDescription:
      "promptproof is the small, boring tool that stops a prompt change from quietly breaking three things you weren't looking at. You define eval cases (input + expected + graders), run the suite, and save a baseline; on every change it diffs the new run against the baseline and gives a straight answer to 'did this make things worse?' — as a list of pass→fail regressions, not a feeling. It ships graders for exact match, substring includes, regex (with negate), JSON-shape, and an offline token-overlap scorer, and you can add your own in one function. The harness itself has zero runtime dependencies and runs offline in CI — you bring your model behind a single function, so testing the tool needs no API key.",
    architecture: {
      layers: [
        {
          name: "Suite",
          items: [
            "Cases: input + expected + graders",
            "runSuite() executes a case against your model function",
          ],
        },
        {
          name: "Graders",
          items: [
            "exact, includes, regex (with negate), jsonShape",
            "offline token-overlap scorer",
            "bring-your-own grader in one function",
          ],
        },
        {
          name: "Regression diff",
          items: [
            "Save a baseline run",
            "Diff new run vs baseline → fail CI on any pass→fail",
          ],
        },
      ],
      description:
        "Cases run through graders to a pass/fail per case; a saved baseline turns the next run into a diff. The point isn't a score — it's catching the specific cases that regressed, which is what fails the build.",
    },
    features: [
      "Regression diffing — save a baseline, fail the build on any pass→fail",
      "Graders included: exact, includes, regex (negate), JSON-shape, token-overlap",
      "Bring-your-own grader and model — each in one function",
      "Zero runtime dependencies — one small library + a CLI",
      "Runs offline in CI — no API key needed to test the harness itself",
      "TypeScript, ESM, fully typed",
    ],
    techStack: [
      "Language: TypeScript (ESM, fully typed)",
      "Dependencies: none at runtime (library + CLI)",
      "Graders: exact / includes / regex / jsonShape / token-overlap / custom",
      "Tests: Vitest (27, offline)",
    ],
    problem:
      "You change a prompt to fix one thing and three others quietly break — and you find out from a customer. LLM output is non-deterministic enough that ad-hoc manual checks miss regressions, and most teams have no baseline to diff against, so 'is this better or worse?' stays a vibe.",
    solution:
      "A tiny eval harness built around regression diffing: define cases, grade outputs with included or custom graders, save a baseline, and on every change get the list of cases that went pass→fail. Zero dependencies and offline-runnable so it drops into CI, with your model behind one function.",
    challengesSolved:
      "The deliberate design choice was making the harness testable without a model: graders and the diff engine are pure, and the model is a single injectable function, so promptproof's own test suite runs fully offline with no API key. The token-overlap grader exists for the same reason — a dependency-free, deterministic way to score free-text similarity in CI when you don't want to call a model just to test the tooling.",
  },
];

/**
 * Projects that never had a real screenshot all pointed at this one generic
 * code-editor image, so 9 of 13 cards on /portfolio rendered identically — and
 * the flagship's "screenshot" was an unrelated CSS snippet (`.myform { width:
 * 400px … }`), which reads as "this backend engine is a stylesheet".
 *
 * Same treatment the blog got in #12: fall back to a branded per-project cover
 * from the OG image generator (title + description on the site gradient)
 * instead of repeating one placeholder. Drop a real screenshot into
 * `image` and it takes precedence automatically.
 *
 * To revert: export `rawProjects` directly.
 */
const PLACEHOLDER_COVER = "/Images/portfolio1.png";

function generatedCover(title: string, description: string): string {
  const params = new URLSearchParams({ title, type: "project" });
  if (description) params.set("description", description.slice(0, 120));
  return `/api/og?${params.toString()}`;
}

export const projects: Project[] = rawProjects.map((project) =>
  !project.image || project.image === PLACEHOLDER_COVER
    ? {
        ...project,
        image: generatedCover(project.title, project.description),
      }
    : project
);
