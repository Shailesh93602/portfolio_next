"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/shailesh93602",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/shaileshbhaichaudhari",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/shaileshwork",
    icon: Twitter,
  },
  {
    name: "Email",
    href: "mailto:shailesh93602@gmail.com",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={fadeIn(0.4)}
      className="border-t bg-background"
    >
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/shailesh93602"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Shaileshbhai Chaudhari
            </Link>
            . Hosted on{" "}
            <Link
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Vercel
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {socialLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
