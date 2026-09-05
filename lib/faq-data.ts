import { PROFILE, PROFILE_META } from "./profile";
import { KHATAGO_TOOL_COUNT } from "./claims";

export interface FaqItem {
  question: string;
  answer: string;
}

const whoIsAnswer = `${PROFILE.name.full} is a ${PROFILE.role.title} based in ${PROFILE.location.displayShort}, originally from ${PROFILE.location.hometown}. At ${PROFILE.role.company} he works on the ${PROFILE.role.focus}. During his first 2-3 months at ${PROFILE.role.company} he shipped two Chrome extensions (Vibe Testing, AxeTos). Previously ${PROFILE.previousRole.tenure} shipping full-stack client projects. Side projects explore distributed systems (Redlock, Socket.io Redis adapter, Prometheus), AI pipelines (Gemini function-calling, OCR), and webhook idempotency patterns.`;

export const homeFaq: FaqItem[] = [
  {
    question: `Who is ${PROFILE.name.full}?`,
    answer: whoIsAnswer,
  },
  {
    question: "What technologies does Shailesh Chaudhari work with?",
    answer:
      "Shailesh Chaudhari works with TypeScript, Node.js, React, Next.js, Express, NestJS, PostgreSQL, Redis, MongoDB, Prisma, Socket.io, Docker and GitHub Actions. He has experience with multi-tenant backend systems, real-time platforms, LLM tool-calling (Gemini) inside products, and WCAG 2.1 AA accessibility.",
  },
  {
    question: "How can I contact Shailesh Chaudhari?",
    answer:
      "Through the contact page at shaileshchaudhari.vercel.app/contact, or by email at shailesh93602@gmail.com. He is based in Ahmedabad, India (UTC+5:30) and works async-first, so a written message with context gets the most useful reply.",
  },
  {
    question: "What are Shailesh Chaudhari's notable projects?",
    answer:
      "Shailesh Chaudhari's notable projects include KhataGO (a WhatsApp-first bookkeeping platform with a DB-enforced idempotent webhook pipeline, Gemini function-calling and a containerized Postgres-queue worker), BALLAST (a deterministic simulation of a multi-tenant session control plane, verified by invariants, a reference oracle, mutation testing and a self-verifying shrinker), EduScale (a real-time engineering learning platform with Redis pub/sub and Socket.io), and DevTrack (a developer analytics dashboard). At ContextQA he shipped Vibe Testing and AxeTos, two Chrome extensions.",
  },
  {
    question: "Where can I see Shailesh Chaudhari's code?",
    answer:
      "Shailesh Chaudhari's open-source projects are available on GitHub at github.com/shailesh93602. His portfolio with architecture write-ups and live demos is at shaileshchaudhari.vercel.app.",
  },
  {
    question: "What are Shailesh Chaudhari's coding achievements?",
    answer: `Shailesh Chaudhari holds ${PROFILE_META.gfgLine}, a ${PROFILE.achievements.hackerrank}, and was a finalist in the New India Vibrant Hackathon 2023.`,
  },
];

export const portfolioFaq = (count: number): FaqItem[] => [
  {
    question: "What projects has Shailesh Chaudhari built?",
    answer: `Shailesh has shipped ${count} side projects covering real-time distributed systems (EduScale), deterministic verification of a multi-tenant control plane (BALLAST), AI pipelines (KhataGO with Gemini function-calling for WhatsApp bookkeeping, CodeSenseiSearch with pgvector semantic search), developer productivity (DevTrack with Supabase Realtime), and open-source reliability tooling (Grounded, idempotency-kit, promptproof). At ContextQA he also shipped two production Chrome extensions — Vibe Testing and AxeTos — in his first months on the team.`,
  },
  {
    question: "Which technologies does Shailesh Chaudhari work with?",
    answer: `Backend: Node.js, NestJS, Express, TypeScript, Prisma, PostgreSQL, Redis, Redlock, Bull, Socket.io with @socket.io/redis-adapter, opossum circuit breakers, prom-client. Frontend: Next.js (App Router), React 19, Tailwind CSS, Redux Toolkit, TanStack Query. Specialties: webhook idempotency enforced in the database (unique constraint plus an atomic claim), distributed locking, LLM function-calling (${KHATAGO_TOOL_COUNT} tools in KhataGO), vector search (pgvector + Gemini embeddings), deterministic simulation and mutation testing.`,
  },
  {
    question: "What is Shailesh Chaudhari working on now?",
    answer:
      "He is a Software Engineer at ContextQA, working on the Node.js backend of the core QA-automation platform: the test-execution engine, the integrations engine (GitHub, GitLab, Linear, Slack) and the session control plane on GKE. On the side he maintains KhataGO, BALLAST and EduScale. Reach him via the contact form at https://shaileshchaudhari.vercel.app/contact or by email at shailesh93602@gmail.com.",
  },
  {
    question: "Where can I see Shailesh Chaudhari's code?",
    answer:
      "Most projects are open-source on GitHub at https://github.com/Shailesh93602. Notable public repos: ballast, devscale (EduScale), CodeSenseiSearch, grounded, idempotency-kit, promptproof, devtrack. KhataGO and ContextQA's Vibe Testing / AxeTos are proprietary or private.",
  },
  {
    question: "What is Shailesh Chaudhari's experience level?",
    answer: `About 2.5 years of professional experience: ${PROFILE.previousRole.tenure} — Software Developer Intern (Jan 2024 – Aug 2024), then Software Developer (Aug 2024 – Jul 2025) shipping 3 client projects end-to-end — then Software Engineer at ContextQA from July 2025 onwards working on the backend of the core QA-automation product. ${PROFILE_META.gfgLine}.`,
  },
];

export const faqToSchema = (faq: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});
