"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Layout, Server, BrainCircuit, Zap, Shield, Blocks, Cpu, Network, Cloud, Code2 } from "lucide-react";

interface Props {
  architecture?: {
    layers: { name: string; items: string[] }[];
    description: string;
  };
}

const getLayerIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("frontend") || n.includes("interface") || n.includes("ui")) return <Layout className="w-6 h-6" />;
  if (n.includes("backend") || n.includes("service") || n.includes("logic")) return <Server className="w-6 h-6" />;
  if (n.includes("data") || n.includes("infrastructure") || n.includes("storage")) return <Database className="w-6 h-6" />;
  if (n.includes("intelligen") || n.includes("ai") || n.includes("ml")) return <BrainCircuit className="w-6 h-6" />;
  if (n.includes("comm") || n.includes("network")) return <Network className="w-6 h-6" />;
  return <Blocks className="w-6 h-6" />;
};

const getItemIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("react") || n.includes("next")) return <Code2 className="w-4 h-4 text-primary" />;
  if (n.includes("db") || n.includes("sql") || n.includes("prisma")) return <Database className="w-4 h-4 text-primary" />;
  if (n.includes("ai") || n.includes("python") || n.includes("gemini")) return <BrainCircuit className="w-4 h-4 text-primary" />;
  if (n.includes("node") || n.includes("express")) return <Server className="w-4 h-4 text-primary" />;
  if (n.includes("redis") || n.includes("socket") || n.includes("real-time")) return <Zap className="w-4 h-4 text-primary" />;
  if (n.includes("auth") || n.includes("security")) return <Shield className="w-4 h-4 text-primary" />;
  if (n.includes("aws") || n.includes("cloud") || n.includes("vercel")) return <Cloud className="w-4 h-4 text-primary" />;
  return <Cpu className="w-4 h-4 text-primary" />;
};

export default function ArchitectureDiagram({ architecture }: Props) {
  if (!architecture) return null;

  return (
    <div className="py-12 relative w-full overflow-hidden rounded-[3rem] bg-card/30 border border-white/5 pb-20">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6">
        <h3 className="text-sm font-black uppercase tracking-[0.4em] text-primary/80 mb-16 text-center">
          System Architecture
        </h3>

        <div className="w-full relative">
          {/* Animated data lines connecting layers */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-border z-0">
             <motion.div 
               animate={{ y: ["0%", "100%", "0%"] }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="h-32 w-full bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px]"
             />
          </div>

          <div className="space-y-16 relative z-10 w-full flex flex-col items-center">
            {architecture.layers.map((layer, idx) => {
              const Icon = getLayerIcon(layer.name);
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={layer.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                  className={`w-full max-w-3xl flex items-center justify-between gap-8 ${isEven ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Outer spacing to force center alignment on connecting line */}
                  <div className="flex-1 hidden md:block" />

                  {/* Center Node */}
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-2xl bg-card border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.1)] flex items-center justify-center z-10 group overflow-hidden">
                     <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                     <div className="relative z-10 text-primary opacity-80 group-hover:opacity-100 transition-opacity">
                        {Icon}
                     </div>
                  </div>

                  {/* Layer Content */}
                  <div className={`flex-1 w-full flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <div className="w-full max-w-lg p-8 rounded-3xl bg-card/80 backdrop-blur-xl border border-white/10 shadow-xl group hover:border-primary/40 transition-all duration-300">
                      <div className={`flex items-center gap-3 mb-6 ${isEven ? 'justify-start' : 'justify-start md:justify-end'}`}>
                        <h4 className="text-xl font-bold tracking-tight text-foreground">{layer.name}</h4>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {layer.items.map((item, itemIdx) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + itemIdx * 0.05 }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                          >
                            {getItemIcon(item)}
                            <span className="text-muted-foreground">{item}</span>
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
          className="mt-20 text-center text-muted-foreground italic text-lg max-w-2xl mx-auto leading-relaxed border-t border-border pt-8"
        >
          &quot;{architecture.description}&quot;
        </motion.p>
      </div>
    </div>
  );
}
