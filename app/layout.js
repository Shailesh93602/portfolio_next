import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";

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
    "Professional Full Stack Developer portfolio showcasing projects and skills",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-background text-text-primary font-sans min-h-screen flex flex-col">
        <Analytics />
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
