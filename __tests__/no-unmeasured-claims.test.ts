import { readFileSync } from "node:fs";
import { join } from "node:path";

import { projects } from "@/constants/projects";

/**
 * No performance number this portfolio cannot defend.
 *
 * HIS RULE, VERBATIM: *"we never measured such items like latency and such
 * things ever so don't post that for any projects — that is bad impression and
 * will come back to me."*
 *
 * Two have already been found and removed:
 *
 *   - `app/layout.tsx` told search engines and AI crawlers that EduScale had
 *     "<200ms sync latency". EduScale's own `loadtest/README.md` exists, in its
 *     words, "to replace unverified claims in the portfolio", warns that "fake
 *     '<200ms' claims get caught", and its results table still reads `_tbd_`.
 *   - `constants/projects.ts` said Vibe Testing ensured "sub-200ms latency for
 *     live log streaming". That one is worse in a specific way: Vibe Testing is
 *     his EMPLOYER's product, so the figure is ContextQA's to publish, not his,
 *     and it is the number he can least verify in an interview room.
 *
 * A latency figure you did not measure is a liability, not a credential: it
 * invites exactly one follow-up, and it is the one you cannot answer.
 *
 * WHAT THIS DOES NOT BAN. Numbers that are reproducible — a test count, a
 * mutation score, throughput from a load test that was actually run and is
 * qualified as local — are fine and are guarded separately by
 * `check-project-claims.mjs`. The distinction is whether someone can ask "how do
 * you know?" and get an answer.
 */

/** Timing claims: "<200ms", "sub-200ms", "200ms latency", "p95", "p99". */
const TIMING_CLAIM =
  /\b(sub-\s?\d+\s?ms|<\s?\d+\s?ms|\d+\s?ms\s+(latency|response|round-?trip)|p9[59]\b)/i;

function stripComments(src: string): string {
  // A comment explaining why a claim was removed contains the claim. Third
  // harness in this workspace to need this.
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

describe("no unmeasured performance claims", () => {
  it("has projects to check", () => {
    // Guards the assertions below from passing vacuously.
    expect(projects.length).toBeGreaterThan(5);
  });

  it("states no timing figure in any project's copy", () => {
    const offenders: string[] = [];
    for (const project of projects) {
      const text = JSON.stringify(project);
      const match = text.match(TIMING_CLAIM);
      if (match) offenders.push(`${project.id}: "${match[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("states no timing figure in the files crawlers and AI agents read", () => {
    const offenders: string[] = [];
    for (const file of ["public/llms.txt", "public/llms-full.txt"]) {
      const text = readFileSync(join(process.cwd(), file), "utf8");
      const match = text.match(TIMING_CLAIM);
      if (match) offenders.push(`${file}: "${match[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("states no timing figure in the site's structured data", () => {
    // Structured data is a claim made directly TO machines, which is the worst
    // place to put a number nobody measured.
    const layout = stripComments(
      readFileSync(join(process.cwd(), "app", "layout.tsx"), "utf8")
    );
    expect(layout).not.toMatch(TIMING_CLAIM);
  });
});
