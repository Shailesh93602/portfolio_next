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
  title: "Shailesh Chaudhari - Full Stack Developer",
  description:
    "Portfolio website of Shailesh Chaudhari, a Full Stack Developer specializing in MERN stack development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
