export { metadata } from "./metadata";
import { PortfolioContent } from "./PortfolioContent";
import { SITE_URL } from "@/lib/blog-constants";
import { projects } from "@/constants/projects";

const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/portfolio`,
  url: `${SITE_URL}/portfolio`,
  name: "Portfolio — Shailesh Chaudhari",
  description:
    "Full-stack web development projects by Shailesh Chaudhari including real-time platforms, AI-powered tools, and Chrome extensions.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${SITE_URL}/portfolio`,
      },
    ],
  },
  hasPart: projects.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.description,
    url: p.live ?? `${SITE_URL}/portfolio/${p.id}`,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    ...(p.github ? { codeRepository: p.github } : {}),
    author: { "@id": `${SITE_URL}/#person` },
  })),
};

// FAQPage — surfaces as featured snippets in Google and gets cited verbatim
// by ChatGPT / Perplexity / Claude. Answers map to the top-of-funnel queries
// recruiters and engineering managers actually type ("what has X built").
const portfolioFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What projects has Shailesh Chaudhari built?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Shailesh has shipped ${projects.length} side projects covering real-time distributed systems (EduScale, redis-battle-demo), AI pipelines (KhataGO with Gemini AI for WhatsApp accounting, CodeSenseiSearch with pgvector semantic search), payment infrastructure patterns (stripe-payments-demo, razorpay-patterns-demo), developer productivity (DevTrack with Supabase Realtime), and developer identity (CareerGlyph). At ContextQA he also shipped two production Chrome extensions — Vibe Testing and AxeTos — in his first months on the team.`,
      },
    },
    {
      "@type": "Question",
      name: "Which technologies does Shailesh Chaudhari work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Backend: Node.js, NestJS, Express, TypeScript, Prisma, PostgreSQL, Redis, Redlock, Bull, Socket.io with @socket.io/redis-adapter, opossum circuit breakers, prom-client. Frontend: Next.js (App Router), React 19, Tailwind CSS, Redux Toolkit, TanStack Query. Specialties: webhook idempotency (Stripe + Razorpay HMAC verification + SETNX dedup), distributed locking, vector search (pgvector + Gemini embeddings), Chrome extension development.",
      },
    },
    {
      "@type": "Question",
      name: "Is Shailesh Chaudhari open to new opportunities?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. He is currently a Software Engineer at ContextQA (backend of the core QA-automation product — test execution engine, VNC streaming, Playwright/WebdriverIO/LambdaTest orchestration) and is open to part-time and freelance work. Reach him via the contact form at https://shaileshchaudhari.vercel.app/contact or by email at shailesh93602@gmail.com.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I see Shailesh Chaudhari's code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most projects are open-source on GitHub at https://github.com/Shailesh93602. Notable public repos: stripe-payments-demo, razorpay-patterns-demo, redis-battle-demo, CodeSenseiSearch, careerglyph, devscale (EduScale). KhataGO and ContextQA's Vibe Testing / AxeTos are proprietary or private.",
      },
    },
    {
      "@type": "Question",
      name: "What is Shailesh Chaudhari's experience level?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "About 2.5 years of professional experience. Software Developer Intern at EsparkBiz Technologies (Jan 2024 – Aug 2024), Software Engineer at EsparkBiz (Aug 2024 – Jul 2025) shipping 3 client projects end-to-end, then Software Engineer at ContextQA from July 2025 onwards working on the backend of their core QA-automation product. Institute Rank 1 on GeeksforGeeks with 600+ problems solved.",
      },
    },
  ],
};

export default function Projects() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioFaq) }}
      />
      <PortfolioContent />
    </>
  );
}
