import { PROFILE } from "./profile";

export interface FaqItem {
  question: string;
  answer: string;
}

const whoIsAnswer = `${PROFILE.name.full} is a ${PROFILE.role.title} based in ${PROFILE.location.displayShort}, originally from ${PROFILE.location.hometown}. At ${PROFILE.role.company} he works on the ${PROFILE.role.focus}. During his first 2-3 months at ${PROFILE.role.company} he shipped two Chrome extensions (Vibe Testing, AxeTos). Previously ~2 years at EsparkBiz shipping full-stack client projects. Side projects explore distributed systems (Redlock, Socket.io Redis adapter, Prometheus), AI pipelines (Gemini function-calling, OCR), and webhook idempotency patterns.`;

export const homeFaq: FaqItem[] = [
  {
    question: `Who is ${PROFILE.name.full}?`,
    answer: whoIsAnswer,
  },
  {
    question: "What technologies does Shailesh Chaudhari work with?",
    answer:
      "Shailesh Chaudhari works with TypeScript, React, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, Redis, Prisma, Tailwind CSS, Socket.io, and Chrome Extension APIs. He has experience with real-time systems, AI integrations (Gemini AI), and WCAG accessibility standards.",
  },
  {
    question: "Is Shailesh Chaudhari available for hire?",
    answer:
      "Yes, Shailesh Chaudhari is open to part-time, freelance (hourly or project-based) engagements. He can be contacted through the contact page at shaileshchaudhari.vercel.app/contact.",
  },
  {
    question: "What are Shailesh Chaudhari's notable projects?",
    answer:
      "Shailesh Chaudhari's notable projects include EduScale (a real-time engineering learning platform with Redis pub/sub and Socket.io), DevTrack (a developer analytics dashboard), KhataGO (a WhatsApp-first AI accounting platform using Gemini AI), Vibe Testing (an AI-powered Chrome extension for web testing), and AxeTos (a WCAG accessibility testing Chrome extension).",
  },
  {
    question: "Where can I see Shailesh Chaudhari's code?",
    answer:
      "Shailesh Chaudhari's open-source projects are available on GitHub at github.com/shailesh93602. His portfolio with live project demos is at shaileshchaudhari.vercel.app.",
  },
  {
    question: "What are Shailesh Chaudhari's coding achievements?",
    answer:
      "Shailesh Chaudhari achieved Institute Rank 1 on GeeksforGeeks with 604+ problems solved, earned a 5-Star rating on HackerRank, and was a finalist in the New India Vibrant Hackathon 2023.",
  },
];

export const portfolioFaq = (count: number): FaqItem[] => [
  {
    question: "What projects has Shailesh Chaudhari built?",
    answer: `Shailesh has shipped ${count} side projects covering real-time distributed systems (EduScale, redis-battle-demo), AI pipelines (KhataGO with Gemini AI for WhatsApp accounting, CodeSenseiSearch with pgvector semantic search), payment infrastructure patterns (stripe-payments-demo, razorpay-patterns-demo), developer productivity (DevTrack with Supabase Realtime), and developer identity (CareerGlyph). At ContextQA he also shipped two production Chrome extensions — Vibe Testing and AxeTos — in his first months on the team.`,
  },
  {
    question: "Which technologies does Shailesh Chaudhari work with?",
    answer:
      "Backend: Node.js, NestJS, Express, TypeScript, Prisma, PostgreSQL, Redis, Redlock, Bull, Socket.io with @socket.io/redis-adapter, opossum circuit breakers, prom-client. Frontend: Next.js (App Router), React 19, Tailwind CSS, Redux Toolkit, TanStack Query. Specialties: webhook idempotency (Stripe + Razorpay HMAC verification + SETNX dedup), distributed locking, vector search (pgvector + Gemini embeddings), Chrome extension development.",
  },
  {
    question: "Is Shailesh Chaudhari open to new opportunities?",
    answer:
      "Yes. He is currently a Software Engineer at ContextQA (backend of the core QA-automation product — test execution engine, VNC streaming, Playwright/WebdriverIO/LambdaTest orchestration) and is open to part-time and freelance work. Reach him via the contact form at https://shaileshchaudhari.vercel.app/contact or by email at shailesh93602@gmail.com.",
  },
  {
    question: "Where can I see Shailesh Chaudhari's code?",
    answer:
      "Most projects are open-source on GitHub at https://github.com/Shailesh93602. Notable public repos: stripe-payments-demo, razorpay-patterns-demo, redis-battle-demo, CodeSenseiSearch, careerglyph, devscale (EduScale). KhataGO and ContextQA's Vibe Testing / AxeTos are proprietary or private.",
  },
  {
    question: "What is Shailesh Chaudhari's experience level?",
    answer:
      "About 2.5 years of professional experience. Software Developer Intern at EsparkBiz Technologies (Jan 2024 – Aug 2024), Software Engineer at EsparkBiz (Aug 2024 – Jul 2025) shipping 3 client projects end-to-end, then Software Engineer at ContextQA from July 2025 onwards working on the backend of their core QA-automation product. Institute Rank 1 on GeeksforGeeks with 600+ problems solved.",
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
