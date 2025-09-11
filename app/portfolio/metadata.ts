import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Shailesh Chaudhari - Full Stack Developer",
  description:
    "Explore Shailesh Chaudhari's portfolio of web development projects. View my work in React, Node.js, and full-stack applications.",
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
    "Shailesh Chaudhari Portfolio",
    "Full Stack Developer Projects",
    "Web Development Portfolio",
    "React Developer Work",
    "Node.js Projects",
    "MERN Stack Applications",
    "Software Engineer Portfolio",
    "JavaScript Projects",
    "TypeScript Projects",
    "Frontend Development",
    "Backend Development",
    "Web Applications",
  ],
  openGraph: {
    title: "Portfolio | Shailesh Chaudhari - Full Stack Developer",
    description:
      "Discover my collection of web development projects showcasing expertise in React, Node.js, and full-stack development.",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/portfolio1.png",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Shailesh Chaudhari - Full Stack Developer",
    description:
      "Browse through my latest web development projects and see my technical expertise in action.",
    images: ["https://shaileshchaudhari.vercel.app/Images/portfolio1.png"],
    site: "@shaileshchaudhari",
    creator: "@shaileshchaudhari",
  },
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/portfolio",
    languages: {
      "en-US": "https://shaileshchaudhari.vercel.app/portfolio",
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
   icons: {
      icon: "/Images/image.png", 
      apple: "/Images/image.png",
  },
};
