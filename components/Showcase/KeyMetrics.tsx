"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  metrics?: { label: string; value: string; description: string }[];
}

export default function KeyMetrics({ metrics }: Props) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 text-center space-y-2 group hover:border-primary/20 transition-colors"
        >
          <p className="text-4xl font-bold text-primary tracking-tight group-hover:scale-105 transition-transform">
            {metric.value}
          </p>
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">
            {metric.label}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {metric.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
