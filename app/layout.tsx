import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/navbar/index";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Shailesh Chaudhari | Software Engineer Portfolio | Full Stack Developer | MERN Stack Expert",
  description:
    "Professional portfolio of Shailesh Chaudhari (Shaileshbhai Chaudhari), showcasing software engineering projects and expertise. Full Stack Developer specializing in MERN stack (MongoDB, Express, React, Node.js) with experience in web development, problem solving, and building scalable applications.",
  keywords: [
    "Full Stack Developer",
    "MERN Stack Developer",
    "Software Engineer",
    "Web Developer",
    "React Developer",
    "Node.js Developer",
    "MongoDB Developer",
    "Express Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Portfolio Website",
    "Shailesh Chaudhari",
    "Shaileshbhai Chaudhari",
  ],
  authors: [
    { name: "Shailesh Chaudhari", url: "https://github.com/shailesh93602" },
  ],
  openGraph: {
    type: "website",
    url: "https://shaileshchaudhari.vercel.app",
    title: "Shailesh Chaudhari | Full Stack Developer Portfolio",
    description:
      "Professional portfolio of Shailesh Chaudhari, a Full Stack Developer specializing in MERN stack development.",
    siteName: "Shailesh Chaudhari Portfolio",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/home.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Shaileshbhai03",
    creator: "@Shaileshbhai03",
    title: "Shailesh Chaudhari | Full Stack Developer Portfolio",
    description:
      "Professional portfolio of Shailesh Chaudhari, a Full Stack Developer specializing in MERN stack development.",
    images: ["https://shaileshchaudhari.vercel.app/Images/home.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Shailesh Chaudhari",
            alternateName: ["Shaileshbhai Chaudhari", "Shailesh"],
            jobTitle: "Software Engineer",
            url: "https://shaileshchaudhari.vercel.app",
            sameAs: [
              "https://github.com/shailesh93602",
              "https://www.linkedin.com/in/shailesh-chaudhari-93602",
              "https://twitter.com/Shaileshbhai03",
            ],
            description:
              "Professional portfolio of Shailesh Chaudhari, a Full Stack Developer specializing in MERN stack development.",
            knowsAbout: [
              "JavaScript",
              "TypeScript",
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Web Development",
              "Software Engineering",
            ],
            hasOccupation: {
              "@type": "Occupation",
              name: "Full Stack Developer",
              description:
                "Building web applications using MERN stack technologies",
            },
            alumniOf: {
              "@type": "EducationalOrganization",
              name: "Gujarat Technological University",
            },
          })}
        </script>
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
              <header className="sticky top-0 z-50 w-full border-b bg-nav-bg/80 backdrop-blur supports-[backdrop-filter]:bg-nav-bg/60">
                <Navbar />
              </header>
              <main className="flex-1 mt-10">{children}</main>
              <footer className="border-t bg-nav-bg/80 backdrop-blur supports-[backdrop-filter]:bg-nav-bg/60">
                <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                  <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                      Built by{" "}
                      <a
                        href="https://github.com/shailesh93602"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                      >
                        Shailesh Chaudhari
                      </a>
                      . Hosted on{" "}
                      <a
                        href="https://vercel.com"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                      >
                        Vercel
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </footer>
            </div>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
