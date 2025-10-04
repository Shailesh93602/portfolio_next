import type { Metadata } from "next";
import { SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Home | Shailesh Chaudhari",
  description:
    "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Available for part-time and freelance (hourly or project-based) work. Explore projects, skills, and achievements.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/",
  },
  openGraph: {
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Available for part-time and freelance (hourly or project-based) work. Explore projects, skills, and achievements.",
    url: SITE_URL,
    siteName: "Shailesh Chaudhari Portfolio",
    images: [
      {
  url: `${SITE_URL}/Images/shailesh.webp`,
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
