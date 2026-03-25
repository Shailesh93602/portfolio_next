"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  metrics?: { label: string; value: string; description: string }[];
}

export default function KeyMetrics({ metrics }: Props) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-3">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="group space-y-2 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 text-center transition-colors hover:border-primary/20"
        >
          <p className="text-4xl font-bold tracking-tight text-primary transition-transform group-hover:scale-105">
            {metric.value}
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">
            {metric.label}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {metric.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
