export { metadata } from "./metadata";
import HomeContent from "./HomeContent";
import { SITE_URL } from "@/lib/blog-constants";
import { getFeaturedPosts } from "@/lib/blog-data";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is Shailesh Chaudhari?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shailesh Chaudhari is a Software Engineer from Gujarat, India, specializing in full-stack web development. He currently works at ContextQA building developer tools and Chrome extensions using Next.js, React, Node.js, and TypeScript.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies does Shailesh Chaudhari work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shailesh Chaudhari works with TypeScript, React, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, Redis, Prisma, Tailwind CSS, Socket.io, and Chrome Extension APIs. He has experience with real-time systems, AI integrations (Gemini AI), and WCAG accessibility standards.",
      },
    },
    {
      "@type": "Question",
      name: "Is Shailesh Chaudhari available for hire?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Shailesh Chaudhari is open to part-time, freelance (hourly or project-based) engagements. He can be contacted through the contact page at shaileshchaudhari.vercel.app/contact.",
      },
    },
    {
      "@type": "Question",
      name: "What are Shailesh Chaudhari's notable projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shailesh Chaudhari's notable projects include EduScale (a real-time engineering learning platform with Redis pub/sub and Socket.io), DevTrack (a developer analytics dashboard), KhataGO (a WhatsApp-first AI accounting platform using Gemini AI), Vibe Testing (an AI-powered Chrome extension for web testing), and AxeTos (a WCAG accessibility testing Chrome extension).",
      },
    },
    {
      "@type": "Question",
      name: "Where can I see Shailesh Chaudhari's code?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shailesh Chaudhari's open-source projects are available on GitHub at github.com/shailesh93602. His portfolio with live project demos is at shaileshchaudhari.vercel.app.",
      },
    },
    {
      "@type": "Question",
      name: "What are Shailesh Chaudhari's coding achievements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shailesh Chaudhari achieved Institute Rank 1 on GeeksforGeeks with 604+ problems solved, earned a 5-Star rating on HackerRank, and was a finalist in the New India Vibrant Hackathon 2023.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomeContent featuredPosts={getFeaturedPosts()} />
    </>
  );
}
