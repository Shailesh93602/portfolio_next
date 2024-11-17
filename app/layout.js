import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata = {
  title: "Shailesh Chaudhari | Full Stack Developer",
  description:
    "Professional Full Stack Developer portfolio showcasing projects and skills.",
  keywords:
    "Full Stack Developer, Web Development, Frontend, Backend, Next.js, React, Node.js, TypeScript",
  openGraph: {
    title: "Shailesh Chaudhari Portfolio",
    description:
      "Showcasing projects and skills of a Full Stack Developer using Next.js, React, Node.js, and TypeScript.",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/home.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Full Stack Developer Portfolio",
      },
    ],
    site_name: "Shailesh Chaudhari Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Shaileshbhai03",
    title: "Shailesh Chaudhari | Full Stack Developer",
    description:
      "Showcasing projects and skills of a Full Stack Developer using Next.js, React, Node.js, and TypeScript.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <head>
        <link
          rel="icon"
          href="https://shaileshchaudhari.vercel.app/Images/home.webp"
        />
      </head>
      <body className="bg-background text-text-primary font-sans min-h-screen flex flex-col">
        <Analytics />
        <SpeedInsights />
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
