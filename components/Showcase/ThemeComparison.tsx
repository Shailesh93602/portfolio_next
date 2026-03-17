"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MoonIcon, SunIcon } from "lucide-react";

interface Props {
  lightImage: string;
  darkImage: string;
  title: string;
}

export default function ThemeComparison({ lightImage, darkImage, title }: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="space-y-4">
      <div className={`flex flex-wrap items-center px-2 ${title ? 'justify-between' : 'justify-end'}`}>
        {title && <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h4>}
        <div className="flex bg-muted rounded-full p-1 border border-border/50">
          <button
            onClick={() => setTheme("dark")}
            className={`p-2 rounded-full transition-all ${
              theme === "dark" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoonIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`p-2 rounded-full transition-all ${
              theme === "light" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SunIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/50 bg-black/5 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={theme === "dark" ? darkImage : lightImage}
              alt={`${title} in ${theme} mode`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
