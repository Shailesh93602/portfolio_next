"use client";

import React from "react";
import { motion } from "framer-motion";

interface Props {
  architecture?: {
    layers: { name: string; items: string[] }[];
    description: string;
  };
}

export default function ArchitectureDiagram({ architecture }: Props) {
  if (!architecture) return null;

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col items-center">
        {architecture.layers.map((layer, idx) => (
          <React.Fragment key={layer.name}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-full max-w-2xl p-6 rounded-2xl bg-card border border-border/50 shadow-2xl relative group hover:border-primary/30 transition-colors"
            >
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">{layer.name}</h4>
              <div className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-primary/5 text-muted-foreground border border-primary/10 rounded-md text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
            {idx < architecture.layers.length - 1 && (
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: 40 }}
                viewport={{ once: true }}
                className="w-px bg-gradient-to-b from-primary/50 to-primary/20 my-2"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-center text-muted-foreground italic text-sm max-w-lg mx-auto leading-relaxed">
        "{architecture.description}"
      </p>
    </div>
  );
}
