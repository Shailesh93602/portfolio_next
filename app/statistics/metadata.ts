import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics | Shailesh Chaudhari - Full Stack Developer",
  description:
    "View Shailesh Chaudhari's coding statistics, GitHub contributions, and problem-solving achievements across various platforms.",
  metadataBase: new URL("https://shaileshchaudhari.vercel.app"),
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
        url: "https://shaileshchaudhari.vercel.app/Images/home.webp",
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
    images: ["https://shaileshchaudhari.vercel.app/Images/home.webp"],
    site: "@shaileshchaudhari",
    creator: "@shaileshchaudhari",
  },
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/statistics",
    languages: {
      "en-US": "https://shaileshchaudhari.vercel.app/statistics",
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};
