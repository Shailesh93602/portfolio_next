import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Home | Shailesh Chaudhari",
  description:
    "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Available for part-time and freelance (hourly or project-based) work. Explore projects, skills, and achievements.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Available for part-time and freelance (hourly or project-based) work. Explore projects, skills, and achievements.",
    url: SITE_URL,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile Picture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari — Full Stack Developer. Open to part-time and freelance (hourly or project) work.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  keywords: [
    "Shailesh Chaudhari",
    "Full Stack Developer",
    "software engineer",
    "freelance software engineer",
    "part time software engineer",
    "hourly software engineer",
    "freelance developer",
    "part-time developer",
    "full stack developer",
    "Next.js developer",
    "React developer",
  ],
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
