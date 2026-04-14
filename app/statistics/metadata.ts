import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Coding Stats — Shailesh Chaudhari",
  description:
    "GitHub contribution heatmap, LeetCode progress, and competitive programming metrics. Institute Rank 1 on GeeksforGeeks with 604+ problems solved.",
  alternates: {
    canonical: `${SITE_URL}/statistics`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Shailesh Chaudhari Statistics",
    "GitHub Contributions",
    "Coding Metrics",
    "Problem Solving Stats",
    "Developer Activity",
    "Programming Progress",
    "Coding Achievements",
    "Technical Proficiency",
    "Development Statistics",
    "Code Contributions",
    "LeetCode Stats",
    "GitHub Metrics",
  ],
  openGraph: {
    title: "Coding Stats — Shailesh Chaudhari",
    description:
      "GitHub contributions, LeetCode stats, and competitive programming achievements. Institute Rank 1 on GeeksforGeeks.",
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Statistics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Stats — Shailesh Chaudhari",
    description:
      "GitHub heatmap, LeetCode progress, GFG Institute Rank 1.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
