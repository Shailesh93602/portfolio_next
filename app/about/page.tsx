import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Shailesh Chaudhari | Full Stack Developer Profile",
  description:
    "Learn about Shailesh Chaudhari's background, skills, and experience as a Full Stack Developer specializing in MERN stack technologies. Discover my journey, technical expertise, and professional achievements.",
  keywords: [
    "About Shailesh Chaudhari",
    "Full Stack Developer Profile",
    "MERN Stack Developer",
    "Software Engineer Background",
    "Web Developer Skills",
    "Developer Portfolio",
    "Technical Expertise",
    "Professional Experience",
    "Software Development Skills",
    "React Developer",
    "Node.js Developer",
    "JavaScript Expert",
    "TypeScript Developer",
  ],
  openGraph: {
    title: "About Shailesh Chaudhari | Full Stack Developer",
    description:
      "Explore Shailesh Chaudhari's journey as a Full Stack Developer, technical skills, and professional achievements in software development.",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/home.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shailesh Chaudhari | Full Stack Developer",
    description:
      "Discover my journey as a Full Stack Developer, technical expertise, and professional achievements in software development.",
    images: ["https://shaileshchaudhari.vercel.app/Images/home.webp"],
  },
};

export default function About() {
  return <AboutContent />;
}
