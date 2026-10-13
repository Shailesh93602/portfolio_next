import { Fragment } from "react";
import type { Project } from "@/constants/projects";

const EDUSCALE_STATS = [
  // EduScale/Frontend/package.json: "next": "^16.x". The prose above said 16
  // while this stat said 15.
  { value: "Next.js 16", label: "Framework", valueClass: "text-foreground" },
  { value: "PostgreSQL", label: "Engine", valueClass: "text-foreground" },
  { value: "High", label: "Complexity", valueClass: "text-primary" },
];

function EduScaleStats() {
  return (
    <div className="flex gap-6">
      {EDUSCALE_STATS.map((stat, idx) => (
        <Fragment key={stat.label}>
          {idx > 0 && <div className="h-10 w-px bg-border" />}
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${stat.valueClass}`}>
              {stat.value}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function UserJourney({ steps }: { steps: Project["userFlow"] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
        User Journey
      </h4>
      <div className="space-y-8 pt-4">
        {steps?.map((step, idx) => (
          <div key={step.step} className="group/step flex items-start gap-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 font-black text-primary transition-all group-hover/step:bg-primary group-hover/step:text-white">
              {idx + 1}
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground underline decoration-primary/30 underline-offset-4">
                {step.step}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The engineering challenge, its pull-quote, and the user journey. */
export default function ShowcaseNarrative({ project }: { project: Project }) {
  return (
    <section className="group relative overflow-hidden rounded-[3rem] border border-border bg-card p-12 md:p-20">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px] transition-colors group-hover:bg-primary/10" />
      <div className="relative z-10 grid grid-cols-1 gap-20 lg:grid-cols-2">
        <div className="space-y-12">
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-primary">
              The Engineering Challenge
            </h4>
            <h3 className="line-clamp-3 text-3xl font-bold leading-tight">
              {project.challengesSolved?.split("?")[0]}
            </h3>
          </div>
          <div className="space-y-8">
            {/* A distinct one-line quote when the project has one; otherwise
                fall back to the challenge text. Repeating the paragraph above
                verbatim as a "quote" read as filler. */}
            <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-6 text-lg italic leading-relaxed text-muted-foreground">
              &quot;{project.pullQuote ?? project.challengesSolved}&quot;
            </div>
            {project.id === "eduscale" && <EduScaleStats />}
          </div>
        </div>

        <div className="space-y-12">
          <UserJourney steps={project.userFlow} />
        </div>
      </div>
    </section>
  );
}
