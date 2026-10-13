"use client";

import { motion } from "framer-motion";
import type { Incident } from "@/constants/projects";

const FIELDS: {
  key: keyof Omit<Incident, "title">;
  label: string;
  labelClass: string;
  textClass: string;
}[] = [
  {
    key: "symptom",
    label: "Symptom",
    labelClass: "text-destructive-accent",
    textClass: "text-foreground",
  },
  {
    key: "hypothesis",
    label: "First hypothesis (and where it went wrong)",
    labelClass: "text-muted-foreground",
    textClass: "text-muted-foreground",
  },
  {
    key: "fix",
    label: "Fix",
    labelClass: "text-primary",
    textClass: "text-foreground",
  },
  {
    key: "confirmed",
    label: "Confirmed by",
    labelClass: "text-primary",
    textClass: "text-muted-foreground",
  },
];

function IncidentCard({ incident, idx }: { incident: Incident; idx: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      className="overflow-hidden rounded-[2rem] border border-border bg-card"
    >
      <header className="flex items-center gap-4 border-b border-border bg-muted/30 px-8 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary">
          {String(idx + 1).padStart(2, "0")}
        </span>
        <h3 className="text-xl font-bold md:text-2xl">{incident.title}</h3>
      </header>
      <div className="grid gap-10 px-8 py-8 md:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <p
              className={`text-xs font-black uppercase tracking-widest ${field.labelClass}`}
            >
              {field.label}
            </p>
            <p className={`leading-relaxed ${field.textClass}`}>
              {incident[field.key]}
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

/** Real bugs + fixes, shown when the project has any. */
export default function ShowcaseIncidents({
  incidents,
}: {
  incidents?: Incident[];
}) {
  if (!incidents || incidents.length === 0) return null;
  return (
    <section className="space-y-12">
      <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Incidents &amp; fixes
        </p>
        <h2 className="text-4xl font-black uppercase italic tracking-tight md:text-5xl">
          Real bugs, real fixes
        </h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          The case-study sections above cover what the system does well. These
          are the times it didn&apos;t — what broke, what I got wrong on the
          first hypothesis, and how we confirmed the fix held.
        </p>
      </div>

      <div className="space-y-8">
        {incidents.map((incident, idx) => (
          <IncidentCard key={incident.title} incident={incident} idx={idx} />
        ))}
      </div>
    </section>
  );
}
