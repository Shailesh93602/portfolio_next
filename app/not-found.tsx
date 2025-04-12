"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-24 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.2)}
        className="space-y-6"
      >
        <h1 className="text-6xl font-bold tracking-tight sm:text-7xl">404</h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
