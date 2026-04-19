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
    incidents: [
      {
        title: "Duplicate battles on tournament Saturday",
        symptom:
          "First public tournament. Within the first couple of hours we had a handful of battles where two rooms got created for the same pairing — both players saw a 'Battle starting' modal, joined two parallel games, and wondered which one was real.",
        hypothesis:
          "My first guess was a WebSocket reconnect race on shaky mobile networks. I spent an hour on that theory before realizing reconnects were behaving correctly. The real culprit showed up in the handler-duration histogram: our start-battle path had a long tail around 2.3–2.6s when the Postgres replica was under load, and the Redlock TTL was 2 seconds. Lock was expiring mid-handler, second request would grab its own lock, two rooms.",
        fix: "Bumped the TTL to 8 seconds and added Redlock auto-renewal — a 500ms heartbeat that calls `lock.extend()` while the handler runs. Also added a `handler_duration_seconds` Prometheus histogram so we'd notice next time a handler started creeping toward the lock TTL. The code change was small, but the habit of 'always measure before you pick a TTL' was the real takeaway.",
        confirmed:
          "The duplicate-battle counter stayed at 0 through the next tournament. The new histogram also surfaced two slow paths (a missing join index and a chatty N+1 in the ranking query) — neither had been loud enough to matter on their own, but both were already halfway to the old TTL.",
      },
      {
        title: "Split rooms across Node instances",
        symptom:
          "Stress test on a 3-instance deploy. Roughly one in fifteen battles, both players could type but neither saw the other's cursor. Every packet was acked, nothing in the logs, just… silence across the wire.",
        hypothesis:
          "I was sure it was a room-name collision or a sticky-session issue at the load balancer. Neither held up. The giveaway was tailing the Redis MONITOR during a failed battle — the pub channel got the broadcast but the sub channel on the other instance wasn't receiving it.",
        fix: "@socket.io/redis-adapter needs two independent ioredis clients — one for `pub`, one for `sub`. I'd wired both to the same connection, assuming Redis pipelining would handle it. Under load, a long-running write would block the sub from draining. Split into two clients (one-line diff) and it was done. Embarrassing, but exactly what the Socket.io docs say on page one.",
        confirmed:
          "Zero split-room reports across the next ~40 tournaments. Added a pub/sub latency gauge (`redis_pubsub_roundtrip_ms`) so a regression would be visible on the dashboard instead of in a user DM.",
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
      "Architecting a real-time, bi-directional communication bridge between the browser extension and a remote testing engine while ensuring sub-200ms latency for live log streaming and visual state updates. Shipped in production during my first 2-3 months at ContextQA.",
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
      "Redis",
      "Webhook Idempotency",
    ],
    live: "https://khatago.vercel.app/",
    github: "https://github.com/Shailesh93602/khatago",
    detailedDescription:
      "KhataGO is a WhatsApp-first bookkeeping platform for Indian MSMEs. The backend is a reconciliation pipeline: Meta webhooks arrive with at-least-once delivery, a Redis-backed idempotency guard drops duplicates, Gemini 2.0 Flash with function-calling parses both text ('Sold 500 to Ram') and receipt images (OCR → structured JSON with merchant/amount/date/line items) into 8 tool calls — create_transaction, create_receivable, record_payment_received, get_party_ledger, send_payment_reminder, and others — each mapped to a Prisma write. Results flow back to the user over WhatsApp; a CA portal exports Tally-ready XML vouchers for month-end close.",
    architecture: {
      layers: [
        {
          name: "Ingress",
          items: [
            "WhatsApp Cloud API webhook (Meta)",
            "HMAC verify + x-hub-signature check",
            "Redis-backed dedup (message-id hash, TTL window)",
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
        label: "Ingress dedup",
        value: "< 1ms",
        description:
          "Redis-backed message-id hash lookup drops duplicate Meta webhooks before any LLM call",
      },
      {
        label: "Tool calls",
        value: "8",
        description:
          "Gemini function-calling surface: transactions, receivables, payments, ledgers, reminders",
      },
      {
        label: "Languages",
        value: "3",
        description:
          "Full i18n across English, Hindi, and Gujarati for both UI and bot responses",
      },
    ],
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
  {
    id: "redis-battle-demo",
    title: "Redis Battle Demo",
    description:
      "A live distributed systems demo: two Node.js instances compete for a Redlock distributed lock every 2 seconds, with the winner broadcasted to all clients via @socket.io/redis-adapter.",
    image: "/Images/portfolio1.png",
    isShowcase: true,
    tags: [
      "Node.js",
      "Socket.io",
      "@socket.io/redis-adapter",
      "Redlock",
      "Redis Pub/Sub",
      "Prometheus",
      "prom-client",
      "Docker",
      "TypeScript",
    ],
    github: "https://github.com/Shailesh93602/redis-battle-demo",
    live: "https://redis-battle-demo.onrender.com/",
    detailedDescription:
      "A standalone, 5-minute-review demo extracting three distributed-systems patterns from EduScale into a single runnable app: (1) @socket.io/redis-adapter publishes Socket.io events through Redis Pub/Sub so multiple Node.js instances share the same room state, (2) Redlock (the Redlock algorithm) ensures only one instance wins each tick interval — preventing duplicate score updates that would corrupt battle state, (3) prom-client exposes a Prometheus /metrics endpoint with 5 counters/gauges for connected clients, active rooms, attacks, ticks acquired, and ticks skipped. Deployed on Render (free tier, single instance) with Upstash Redis.",
    architecture: {
      layers: [
        {
          name: "Transport",
          items: [
            "Socket.io (WebSocket + long-polling fallback)",
            "@socket.io/redis-adapter (Redis Pub/Sub bridge)",
            "Two independent Node.js instances",
          ],
        },
        {
          name: "Distributed Coordination",
          items: [
            "Redlock algorithm (retryCount: 0)",
            "Redis SET NX for distributed mutex",
            "1,500ms lock TTL — less than 2,000ms tick interval",
          ],
        },
        {
          name: "Observability",
          items: [
            "prom-client: 5 Prometheus metrics",
            "GET /health — instance ID, uptime, room + client counts",
            "GET /metrics — Prometheus text format",
          ],
        },
      ],
      description:
        "Each tick interval, both instances race to acquire the Redlock mutex. The winner emits server_tick (with its instance ID) to all clients via Redis Pub/Sub, then releases the lock. Clients visualize which instance won — purple for this instance, yellow for the other. This directly mirrors how distributed cron jobs and leader election work in production.",
    },
    keyMetrics: [
      {
        label: "Test Coverage",
        value: "48 tests",
        description:
          "Config, Redlock, Socket events, Redis adapter, HTTP endpoints",
      },
      {
        label: "Lock TTL",
        value: "≤1.5s",
        description:
          "Redlock TTL shorter than tick interval — guarantees release before next race",
      },
      {
        label: "Metrics",
        value: "5 Prometheus",
        description:
          "Connected clients, active rooms, attacks, ticks acquired/skipped",
      },
    ],
    features: [
      "Live distributed lock visualization: which instance won each tick, updated in real time",
      "Redis Pub/Sub bridge: Socket.io rooms work correctly across multiple Node.js processes",
      "Redlock (retryCount: 0) — fails fast if lock is held, no queue buildup",
      "Prometheus /metrics endpoint — production-observable from day one",
      "GET /health returns instance ID, uptime, room/client counts",
      "48 unit tests covering all distributed patterns and HTTP endpoints",
    ],
    techStack: [
      "Runtime: Node.js, Express",
      "Real-time: Socket.io + @socket.io/redis-adapter (Redis Pub/Sub)",
      "Distributed locking: Redlock (Redis SET NX)",
      "Observability: prom-client (Prometheus), /health endpoint",
      "Infrastructure: Redis, Docker Compose",
      "Tests: Jest, 48 tests",
    ],
    problem:
      "Demonstrating distributed systems patterns (leader election, exactly-once processing, cross-process pub/sub) is hard without infrastructure overhead. Most demos fake it — they run a single process and claim horizontal scaling.",
    solution:
      "Two genuinely separate Node.js processes sharing one Redis. The Redlock race is real: one instance wins, one loses. The browser shows which one won each tick. The Prometheus metrics show the counts accumulate correctly across both instances.",
    challengesSolved:
      "The key insight was using retryCount: 0 on Redlock. With retries enabled, both instances queue up for the lock, and when the tick interval fires again before the queue drains, you get multiple ticks per interval — exactly the race condition you're trying to prevent. Zero retries means: if you didn't win this tick, you skip it. Clean, exactly-once semantics at the cost of occasional missed ticks under high contention.",
  },
  {
    id: "careerglyph",
    title: "CareerGlyph",
    description:
      "A developer profile platform where skills, projects, and peer endorsements replace static resumes. REST API with JWT auth, compound-key endorsements, and full Swagger documentation.",
    image: "/Images/portfolio1.png",
    isShowcase: true,
    tags: [
      "NestJS",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "JWT",
      "Passport",
      "Swagger/OpenAPI",
      "Jest",
      "bcrypt",
      "Rate Limiting",
    ],
    github: "https://github.com/Shailesh93602/careerglyph",
    detailedDescription:
      "CareerGlyph replaces static resume PDFs with live, verifiable developer profiles. The NestJS backend provides JWT authentication (register + login with bcrypt, rate-limited via @nestjs/throttler), a full skills CRUD API with SkillCategory/SkillLevel enums, project management, and a peer endorsement system. Endorsements use a compound unique index (skillId + giverId) with Prisma upsert — so endorsing twice updates the message rather than creating duplicates. All 9 endpoints are protected by JwtAuthGuard and documented in Swagger.",
    architecture: {
      layers: [
        {
          name: "API Layer",
          items: [
            "NestJS controllers with Swagger decorators",
            "JwtAuthGuard on all mutation endpoints",
            "ThrottlerModule: 5 req/min register, 10 req/min login",
            "ValidationPipe with class-validator DTOs",
          ],
        },
        {
          name: "Business Logic",
          items: [
            "ProfileService: getByUsername, updateProfile, addSkill/removeSkill",
            "Endorsement upsert with compound key (skillId + giverId)",
            "Self-endorsement guard (BadRequestException)",
            "formatProfile: strips internal fields, adds endorsementCount per skill",
          ],
        },
        {
          name: "Data Layer",
          items: [
            "Prisma ORM + PostgreSQL",
            "Developer → Skill → Endorsement nested relations",
            "@@unique([skillId, giverId]) on Endorsement",
            "PrismaService with onModuleInit/$connect lifecycle",
          ],
        },
      ],
      description:
        "Standard NestJS layered architecture: controllers delegate to services, services talk to Prisma, all DB queries are type-safe. The interesting design decision is the endorsement compound key — it makes the upsert pattern trivial and prevents duplicate endorsements at the DB level.",
    },
    keyMetrics: [
      {
        label: "Test Suite",
        value: "71 tests",
        description: "58 unit + 13 E2E tests across 5 spec files",
      },
      {
        label: "API Surface",
        value: "9 endpoints",
        description:
          "Auth (2) + Profile CRUD (4) + Skills/Projects/Endorsements (3)",
      },
      {
        label: "Auth Security",
        value: "JWT + bcrypt",
        description:
          "Rate-limited registration, bcrypt password hashing, Passport JWT strategy",
      },
    ],
    features: [
      "JWT authentication with @nestjs/passport — register, login, protected routes",
      "Rate limiting: 5 reg/min, 10 login/min via @nestjs/throttler",
      "Skills CRUD with SkillCategory (LANGUAGE/FRONTEND/BACKEND/DATABASE/DEVOPS) and SkillLevel enums",
      "Peer endorsements with compound unique key — upsert on re-endorse, self-endorse blocked",
      "Public profile API: formatProfile strips internal fields, adds endorsementCount per skill",
      "Full Swagger/OpenAPI documentation at /api-docs",
    ],
    techStack: [
      "Framework: NestJS, TypeScript, Express",
      "Auth: @nestjs/jwt, @nestjs/passport, PassportStrategy (JWT), bcrypt",
      "Database: Prisma ORM, PostgreSQL",
      "Validation: class-validator, class-transformer, ValidationPipe",
      "Security: @nestjs/throttler, JwtAuthGuard",
      "Tests: Jest, 71 tests (unit + E2E with supertest)",
    ],
    problem:
      "A PDF resume cannot show code quality, real contributions, or whether skills are endorsed by people who've actually worked with you. Skills on LinkedIn are self-reported with no verification.",
    solution:
      "A live API-backed profile: skills are added by the developer, projects link to live URLs and GitHub, and endorsements come from other developers who authenticate first. The compound key on endorsements means each developer can endorse each skill exactly once.",
    challengesSolved:
      "The endorsement upsert pattern was the key design decision. A naive implementation would check-then-insert (two queries, race condition). Using Prisma's upsert with the compound key makes it atomic — create if not exists, update if exists. The other non-obvious decision was ordering NestJS routes: static routes (me, me/skills) must be declared before the :username param route, otherwise NestJS matches 'me' as a username.",
  },
  {
    id: "stripe-payments-demo",
    title: "Stripe Payments Demo",
    description:
      "Production-grade Stripe integration: webhook signature verification, Redis SETNX idempotency guard against duplicate event delivery, and payment intent creation with exponential-backoff retry. 29 tests covering exactly-once semantics, non-retryable 4xx errors, and concurrent duplicate suppression.",
    image: "/Images/portfolio1.png",
    github: "https://github.com/Shailesh93602/stripe-payments-demo",
    live: "https://stripe-payments-demo-eight.vercel.app",
    tags: ["Node.js", "TypeScript", "Stripe", "Redis", "Express", "Jest"],
    isShowcase: true,
    architecture: {
      layers: [
        {
          name: "API Layer",
          items: [
            "Express routes: POST /webhook, POST /create-payment-intent, POST /simulate-payment",
            "express.raw() on /webhook — raw body required for Stripe signature verification",
            "express.json() on all other routes",
          ],
        },
        {
          name: "Stripe Integration",
          items: [
            "stripe.webhooks.constructEvent() — HMAC-SHA256 signature verification",
            "stripe.paymentIntents.create() with idempotencyKey option",
            "Stripe API version pinned: 2023-10-16",
          ],
        },
        {
          name: "Idempotency (Redis)",
          items: [
            "Redis SETNX (SET NX EX) — atomic check-then-write in one command",
            "24-hour TTL covers Stripe's 7-day retry window",
            "Key namespace: stripe:event:{eventId}",
          ],
        },
        {
          name: "Retry Logic",
          items: [
            "Exponential backoff: baseDelay * 2^attempt, capped at maxDelayMs",
            "25% jitter to avoid thundering herd on Stripe 5xx bursts",
            "4xx errors (card decline, bad request) bypass retry immediately",
          ],
        },
      ],
      description:
        "Express app with route-level middleware separation: raw body parsing only on /webhook (required for Stripe signature verification), JSON parsing everywhere else. Idempotency and retry are separate, independently testable modules — each with its own test file.",
    },
    keyMetrics: [
      {
        label: "Test Suite",
        value: "29 tests",
        description:
          "idempotency (9) + webhook (8) + payments (5) + retry (6) + app (5)",
      },
      {
        label: "Idempotency",
        value: "SETNX",
        description:
          "Exactly-once delivery — same Stripe event processed at most once in 24h",
      },
      {
        label: "Retry Policy",
        value: "4 attempts",
        description:
          "Exponential backoff + jitter, non-retryable 4xx bypassed immediately",
      },
    ],
    features: [
      "Stripe webhook handler with HMAC-SHA256 signature verification — rejects tampered payloads",
      "Redis SETNX idempotency guard — concurrent duplicate webhooks suppressed atomically",
      "Payment intent creation with caller-supplied idempotency key — safe to retry from client",
      "Exponential backoff retry with jitter — handles Stripe 500s without thundering herd",
      "4xx errors (card decline, invalid request) fail fast — no wasted retry attempts",
      "29 tests including concurrent duplicate simulation and partial failure scenarios",
    ],
    techStack: [
      "Runtime: Node.js 18, TypeScript",
      "Web: Express 4",
      "Payments: Stripe SDK v14 (2023-10-16 API version)",
      "Idempotency: ioredis (SETNX)",
      "Tests: Jest + Supertest — 29 tests, 80%+ coverage",
    ],
    problem:
      "Stripe delivers webhooks at-least-once — the same payment_intent.succeeded event can arrive 3–5 times during retries. Without an idempotency guard, each delivery triggers a fulfillment action (email, inventory update, DB write), causing duplicate orders and corrupted state.",
    solution:
      "Redis SETNX on the event ID: the first delivery writes the key and processes. All subsequent deliveries hit the existing key and return 200 immediately without reprocessing. 24-hour TTL covers Stripe's full retry window. Payment intent creation uses a caller-supplied idempotency key, so double-clicks or network retries never create duplicate charges.",
    challengesSolved:
      "The non-obvious design decision was the retry policy for payment creation: retrying on 4xx (card decline, bad idempotency key) is harmful — Stripe will return the same error every time. The retry logic checks `statusCode >= 500` and treats all other errors as non-retryable. Network errors (no statusCode) are retried because they're transient. Jitter (0–25% of the exponential delay) prevents multiple failing payments from hitting Stripe simultaneously after a 5xx burst.",
  },
];
