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
  title: `${BLOG_AUTHOR.name} | ${META_DEFAULTS.siteName}`,
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
        url: `${SITE_URL}${BLOG_AUTHOR.avatar}`,
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
    images: [`${SITE_URL}${BLOG_AUTHOR.avatar}`],
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: BLOG_AUTHOR.name,
            alternateName: ["Shaileshbhai Chaudhari", "Shailesh"],
            jobTitle: BLOG_AUTHOR.role || "Software Engineer",
            url: SITE_URL,
            image: `${SITE_URL}${BLOG_AUTHOR.avatar}`,
            sameAs: [
              BLOG_AUTHOR.social.github,
              BLOG_AUTHOR.social.linkedin,
              BLOG_AUTHOR.social.twitter,
            ],
            description: META_DEFAULTS.description,
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
              description: "Building web applications using modern web technologies",
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
            <SpeedInsightsClient />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
