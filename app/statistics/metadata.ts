import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Statistics | Shailesh Chaudhari - Full Stack Developer",
  description:
    "View Shailesh Chaudhari's coding statistics, GitHub contributions, and problem-solving achievements across various platforms.",
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
    title: "Statistics | Shailesh Chaudhari - Full Stack Developer",
    description:
      "Explore my coding journey through statistics, contributions, and achievements in software development.",
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
    title: "Statistics | Shailesh Chaudhari - Full Stack Developer",
    description:
      "Check out my development metrics and coding progress across various platforms.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
