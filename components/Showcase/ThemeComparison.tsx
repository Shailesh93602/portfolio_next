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

export default function ThemeComparison({
  lightImage,
  darkImage,
  title,
}: Props) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-wrap items-center px-2 ${title ? "justify-between" : "justify-end"}`}
      >
        {title && (
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </h4>
        )}
        <div className="flex rounded-full border border-border/50 bg-muted p-1">
          <button
            onClick={() => setTheme("dark")}
            className={`rounded-full p-2 transition-all ${
              theme === "dark"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoonIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("light")}
            className={`rounded-full p-2 transition-all ${
              theme === "light"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SunIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/50 bg-black/5 shadow-2xl">
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
