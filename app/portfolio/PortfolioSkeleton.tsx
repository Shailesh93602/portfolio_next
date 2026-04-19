"use client";

import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { staggerContainer, fadeIn } from "@/lib/animations";

export function PortfolioSkeleton() {
  return (
    <div className="container py-24">
      {/* Hero Section Skeleton */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.1)}
        className="mb-16 space-y-4 text-center"
      >
        <motion.div variants={fadeIn(0.1)} className="flex justify-center">
          <Skeleton className="h-12 w-64 rounded-2xl bg-primary/5 md:w-96" />
        </motion.div>
        <motion.div variants={fadeIn(0.2)} className="flex justify-center">
          <Skeleton className="h-6 w-80 rounded-xl opacity-60 md:w-[32rem]" />
        </motion.div>
      </motion.div>

      {/* Filter Section Skeleton */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.05)}
        className="mb-12 space-y-8"
      >
        <motion.div variants={fadeIn(0.3)} className="flex justify-center">
          <Skeleton className="h-7 w-48 rounded-lg opacity-40" />
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div key={i} variants={fadeIn(0.3 + i * 0.05)}>
              <Skeleton className="h-10 w-24 rounded-full opacity-30 shadow-inner" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid Skeleton */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.1)}
        className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            variants={fadeIn(0.5 + i * 0.1)}
            className={i === 1 ? "md:col-span-2 lg:col-span-2" : ""}
          >
            <Card className="h-full overflow-hidden rounded-[2rem] border-border/50 bg-card/30 backdrop-blur-sm">
              <Skeleton className="h-64 w-full opacity-20" />
              <CardContent className="space-y-6 p-8">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-1/2 rounded-lg bg-primary/10" />
                  <Skeleton className="h-4 w-full rounded-md opacity-40" />
                  <Skeleton className="h-4 w-[90%] rounded-md opacity-40" />
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                  {[1, 2, 3].map((j) => (
                    <Skeleton
                      key={j}
                      className="h-6 w-16 rounded-xl opacity-30"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
