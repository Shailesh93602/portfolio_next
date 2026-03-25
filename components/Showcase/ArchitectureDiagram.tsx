"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Database,
  Layout,
  Server,
  BrainCircuit,
  Zap,
  Shield,
  Blocks,
  Cpu,
  Network,
  Cloud,
  Code2,
} from "lucide-react";

interface Props {
  architecture?: {
    layers: { name: string; items: string[] }[];
    description: string;
  };
}

const getLayerIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("frontend") || n.includes("interface") || n.includes("ui"))
    return <Layout className="h-6 w-6" />;
  if (n.includes("backend") || n.includes("service") || n.includes("logic"))
    return <Server className="h-6 w-6" />;
  if (
    n.includes("data") ||
    n.includes("infrastructure") ||
    n.includes("storage")
  )
    return <Database className="h-6 w-6" />;
  if (n.includes("intelligen") || n.includes("ai") || n.includes("ml"))
    return <BrainCircuit className="h-6 w-6" />;
  if (n.includes("comm") || n.includes("network"))
    return <Network className="h-6 w-6" />;
  return <Blocks className="h-6 w-6" />;
};

const getItemIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("react") || n.includes("next"))
    return <Code2 className="h-4 w-4 text-primary" />;
  if (n.includes("db") || n.includes("sql") || n.includes("prisma"))
    return <Database className="h-4 w-4 text-primary" />;
  if (n.includes("ai") || n.includes("python") || n.includes("gemini"))
    return <BrainCircuit className="h-4 w-4 text-primary" />;
  if (n.includes("node") || n.includes("express"))
    return <Server className="h-4 w-4 text-primary" />;
  if (n.includes("redis") || n.includes("socket") || n.includes("real-time"))
    return <Zap className="h-4 w-4 text-primary" />;
  if (n.includes("auth") || n.includes("security"))
    return <Shield className="h-4 w-4 text-primary" />;
  if (n.includes("aws") || n.includes("cloud") || n.includes("vercel"))
    return <Cloud className="h-4 w-4 text-primary" />;
  return <Cpu className="h-4 w-4 text-primary" />;
};

export default function ArchitectureDiagram({ architecture }: Props) {
  if (!architecture) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-[3rem] border border-white/5 bg-card/30 py-12 pb-20">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6">
        <h3 className="mb-16 text-center text-sm font-black uppercase tracking-[0.4em] text-primary/80">
          System Architecture
        </h3>

        <div className="relative w-full">
          {/* Animated data lines connecting layers */}
          <div className="absolute bottom-0 left-1/2 top-0 z-0 w-px -translate-x-1/2 bg-border">
            <motion.div
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="h-32 w-full bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px]"
            />
          </div>

          <div className="relative z-10 flex w-full flex-col items-center space-y-16">
            {architecture.layers.map((layer, idx) => {
              const Icon = getLayerIcon(layer.name);
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    delay: idx * 0.15,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className={`flex w-full max-w-3xl items-center justify-between gap-8 ${isEven ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Outer spacing to force center alignment on connecting line */}
                  <div className="hidden flex-1 md:block" />

                  {/* Center Node */}
                  <div className="group relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                    <div className="absolute inset-0 translate-y-full bg-primary/10 transition-transform duration-500 ease-in-out group-hover:translate-y-0" />
                    <div className="relative z-10 text-primary opacity-80 transition-opacity group-hover:opacity-100">
                      {Icon}
                    </div>
                  </div>

                  {/* Layer Content */}
                  <div
                    className={`flex w-full flex-1 ${isEven ? "justify-start" : "justify-end"}`}
                  >
                    <div className="group w-full max-w-lg rounded-3xl border border-white/10 bg-card/80 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-primary/40">
                      <div
                        className={`mb-6 flex items-center gap-3 ${isEven ? "justify-start" : "justify-start md:justify-end"}`}
                      >
                        <h4 className="text-xl font-bold tracking-tight text-foreground">
                          {layer.name}
                        </h4>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {layer.items.map((item, itemIdx) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + itemIdx * 0.05 }}
                            className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                          >
                            {getItemIcon(item)}
                            <span className="text-muted-foreground">
                              {item}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mx-auto mt-20 max-w-2xl border-t border-border pt-8 text-center text-lg italic leading-relaxed text-muted-foreground"
        >
          &quot;{architecture.description}&quot;
        </motion.p>
      </div>
    </div>
  );
}
