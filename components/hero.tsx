"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, slideIn, textVariant } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container flex min-h-screen flex-col items-center justify-center gap-8 pb-8 pt-24 md:flex-row md:gap-16">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.2)}
        className="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
      >
        <motion.h1
          variants={textVariant(0.2)}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
        >
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Shailesh Chaudhari
          </span>
        </motion.h1>
        <p className="mt-4 text-lg text-muted-foreground">
          I&apos;m a passionate full-stack developer with expertise in modern
          web technologies.
        </p>
        <motion.div
          variants={textVariant(0.6)}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg">
            <Link href="/portfolio">View Projects</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Me</Link>
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={slideIn("right", 0.2)}
        className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]"
      >
        <Image
          src="/profile.jpg"
          alt="Shailesh Chaudhari"
          fill
          className="rounded-full object-cover"
          priority
        />
      </motion.div>
    </section>
  );
}
