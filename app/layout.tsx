import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import SpeedInsightsClient from "@/components/speed-insights-client";
import Navbar from "@/components/navbar/index";
import { Providers } from "./providers";
import Script from "next/script";
import { SITE_URL, BLOG_AUTHOR, META_DEFAULTS } from "@/lib/blog-constants";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BLOG_AUTHOR.name} | ${META_DEFAULTS.siteName}`,
    template: `%s | ${META_DEFAULTS.siteName}`,
  },
  description: META_DEFAULTS.description,
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
    BLOG_AUTHOR.name,
    "Shaileshbhai Chaudhari",
  ],
  authors: [{ name: BLOG_AUTHOR.name, url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${BLOG_AUTHOR.name} | ${META_DEFAULTS.siteName}`,
    description: META_DEFAULTS.description,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: BLOG_AUTHOR.avatar,
        width: 1200,
        height: 630,
        alt: `${BLOG_AUTHOR.name} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
    title: `${BLOG_AUTHOR.name} | ${META_DEFAULTS.siteName}`,
    description: META_DEFAULTS.description,
    images: [BLOG_AUTHOR.avatar],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
        {/* Preconnect to external origins to reduce connection latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Shailesh Chaudhari — Blog"
          href="/feed.xml"
        />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        {/* Person schema — rich entity for Google Knowledge Graph, Bing, and LLM crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": `${SITE_URL}/#person`,
              name: BLOG_AUTHOR.name,
              alternateName: ["Shaileshbhai Chaudhari", "Shailesh"],
              jobTitle: "Software Engineer",
              url: SITE_URL,
              image: {
                "@type": "ImageObject",
                url: `${SITE_URL}${BLOG_AUTHOR.avatar}`,
                width: 400,
                height: 400,
              },
              email: "shailesh93602@gmail.com",
              nationality: "Indian",
              homeLocation: {
                "@type": "Place",
                name: "Gujarat, India",
              },
              sameAs: [
                BLOG_AUTHOR.social.github,
                BLOG_AUTHOR.social.linkedin,
                BLOG_AUTHOR.social.twitter,
                "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
                "https://www.hackerrank.com/profile/shailesh93602",
                "https://leetcode.com/u/Shaileshbhai/",
              ],
              description:
                "Software Engineer with expertise in full-stack web development using Next.js, React, Node.js, TypeScript, and PostgreSQL. Currently at ContextQA building developer tools and Chrome extensions.",
              knowsAbout: [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Express.js",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "Socket.io",
                "Prisma",
                "Tailwind CSS",
                "Chrome Extensions",
                "Web Development",
                "Software Engineering",
                "REST APIs",
                "Full Stack Development",
              ],
              worksFor: {
                "@type": "Organization",
                name: "ContextQA",
                url: "https://contextqa.com",
              },
              hasOccupation: {
                "@type": "Occupation",
                name: "Software Engineer",
                occupationLocation: {
                  "@type": "Country",
                  name: "India",
                },
                estimatedSalary: [],
                skills:
                  "Next.js, React, TypeScript, Node.js, PostgreSQL, Chrome Extensions",
              },
              award: [
                "GeeksforGeeks Institute Rank 1 with 604+ problems solved",
                "HackerRank 5-Star rating in Problem Solving",
                "Finalist — New India Vibrant Hackathon 2023",
              ],
              workExample: [
                {
                  "@type": "SoftwareSourceCode",
                  name: "EduScale",
                  description:
                    "Real-time engineering learning platform with coding battles, Redis pub/sub, and <200ms sync latency",
                  url: "https://eduscale.vercel.app/",
                  codeRepository: "https://github.com/Shailesh93602/devscale",
                  programmingLanguage: ["TypeScript", "JavaScript"],
                  runtimePlatform: "Next.js",
                },
                {
                  "@type": "SoftwareSourceCode",
                  name: "KhataGO",
                  description:
                    "WhatsApp-first AI accounting platform using Gemini AI for OCR and natural language processing",
                  url: "https://khatago.vercel.app/",
                  codeRepository: "https://github.com/Shailesh93602/khatago",
                  programmingLanguage: ["TypeScript"],
                  runtimePlatform: "Next.js",
                },
              ],
            }),
          }}
        />
        {/* WebSite schema — enables Sitelinks Searchbox in Google results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: `${BLOG_AUTHOR.name} — Portfolio`,
              description: META_DEFAULTS.description,
              author: { "@id": `${SITE_URL}/#person` },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/blogs?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
            >
              Skip to main content
            </a>
            <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-background to-secondary/20">
              <header className="bg-nav-bg/80 supports-[backdrop-filter]:bg-nav-bg/60 sticky top-0 z-50 w-full border-b backdrop-blur">
                <Navbar />
              </header>
              <main id="main-content" className="mt-10 flex-1">{children}</main>
              <footer className="bg-nav-bg/80 supports-[backdrop-filter]:bg-nav-bg/60 border-t backdrop-blur">
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
                      {"."}
                    </p>
                  </div>
                </div>
              </footer>
            </div>
            <Analytics />
            <SpeedInsightsClient />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
