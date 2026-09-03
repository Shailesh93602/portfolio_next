import { PROFILE_META } from "@/lib/profile";
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
  // PROFILE_META.titleTag composes exactly this from PROFILE, and existed
  // unused while the same string sat here as a literal. A name and a job title
  // that appear in two places drift the day one of them changes.
  title: PROFILE_META.titleTag,
  description:
    "Software Engineer at ContextQA working on the backend of our core QA-automation product (test execution, VNC, Playwright/WebdriverIO/LambdaTest). Side projects: distributed systems (Redlock, Socket.io Redis adapter), AI pipelines (Gemini function-calling, OCR), webhook idempotency patterns.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Shailesh Chaudhari — Software Engineer",
    description:
      "Software Engineer at ContextQA (backend of core QA-automation product). Side projects explore distributed systems, AI pipelines, webhook idempotency.",
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
      "Software Engineer at ContextQA. Backend, real-time systems, Next.js.",
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
  ],
};
