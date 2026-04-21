import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

// Point OG at the dynamic /api/og route which returns a true 1200×630 card.
// The old /Images/shailesh.webp is a 615×614 portrait photo — valid as an
// avatar but produced pillar-boxed previews on Twitter/LinkedIn because the
// declared meta dimensions (1200×630) didn't match the actual pixels.
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Shailesh Chaudhari"
)}&type=page&description=${encodeURIComponent(
  "Software Engineer at ContextQA · backend, distributed systems, webhook idempotency"
)}`;

export const metadata: Metadata = {
  title: "Shailesh Chaudhari — Software Engineer",
  description:
    "Software Engineer at ContextQA working on the backend of our core QA-automation product (test execution, VNC, Playwright/WebdriverIO/LambdaTest). Side projects: distributed systems (Redlock, Socket.io Redis adapter), AI pipelines (Gemini function-calling, OCR), webhook idempotency patterns. Open to part-time and freelance work.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Shailesh Chaudhari — Software Engineer",
    description:
      "Software Engineer at ContextQA (backend of core QA-automation product). Side projects explore distributed systems, AI pipelines, webhook idempotency. Open to part-time and freelance work.",
    url: SITE_URL,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari — Software Engineer at ContextQA",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shailesh Chaudhari — Software Engineer",
    description:
      "Software Engineer at ContextQA. Backend, real-time systems, Next.js. Open to part-time & freelance.",
    images: [ogImageUrl],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  keywords: [
    "Shailesh Chaudhari",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Chrome Extension Developer",
    "TypeScript Developer",
    "freelance developer India",
    "part-time software engineer",
  ],
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
