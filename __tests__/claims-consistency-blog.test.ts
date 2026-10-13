/**
 * The blog states the same numbers about other repositories as every other
 * surface — split out of claims-consistency.test.ts, whose header explains the
 * loop: lib/claims.ts is checked against upstream daily, and every surface is
 * checked against lib/claims.ts here.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  BALLAST_CHECKER_FINDINGS,
  BALLAST_LEDGER_FINDINGS,
  BALLAST_MUTANTS_KILLED,
  BALLAST_MUTANTS_TOTAL,
  BALLAST_TEST_COUNT,
  numberWord,
} from "@/lib/claims";
import { allMatches } from "./helpers/regex";

/**
 * 🔴 THE BLOG IS A SURFACE, AND IT WAS NOT IN THIS FILE.
 *
 * Everything above reads projects.ts, HomeContent.tsx, /engineering, the
 * resume and the llms files. `content/blog/` states the same facts about the
 * same repositories in prose, and nothing read it — so on 2026-09-20:
 *
 *   - two published posts reported a mutation score of **84.2%**, a number
 *     that appears nowhere in BALLAST's working tree or its git history,
 *     while `/portfolio/ballast` on the same site stated 87.3% → 95.8%;
 *   - one of them closed with "Three of eight were", against
 *     BALLAST_LEDGER_FINDINGS = 9 and BALLAST_CHECKER_FINDINGS = 4 — and
 *     against its own preceding sentence, which described three findings
 *     "and six more".
 *
 * Both posts link `docs/LEDGER.md` directly, so the reader most likely to
 * check is the reader the post invited.
 *
 * The patterns are built from the constants for the reason documented under
 * "BALLAST test count" in claims-consistency.test.ts: a guard that repeats the value it guards is not
 * a guard.
 */
describe("the blog states the same numbers as every other surface", () => {
  const BLOG = join(process.cwd(), "content", "blog");
  const posts = readdirSync(BLOG).filter((f) => f.endsWith(".mdx"));

  it("finds blog posts at all", () => {
    // Without this, every assertion below passes vacuously the day the
    // content directory moves.
    expect(posts.length).toBeGreaterThan(5);
  });

  /**
   * Scoped to the SENTENCE, not to a character window.
   *
   * My first attempt scanned 160 characters either side of every percentage
   * for the word "score" and flagged "At 83% I would have investigated" — a
   * hypothetical two sentences away from a real one. A guard that cries wolf
   * about prose gets loosened, and a loosened guard catches nothing. The unit
   * that decides whether a number is being ASSERTED is the sentence it is in.
   */
  const sentences = (text: string) =>
    text
      .replace(/<[^>]+>/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.replace(/\s+/g, " ").trim());

  it("states no mutation score other than the ones BALLAST recorded", () => {
    // 87.3% (the honest first reading, under a broken negation operator) and
    // 95.8% (after the operator was fixed and every survivor triaged) are the
    // only two this project has measured; 100% is the broken-harness reading
    // both posts are ABOUT. docs/MUTATION.md holds the second, docs/LEDGER.md
    // L9 the sequence.
    const REAL = new Set(["87.3", "95.8", "100.0", "100"]);
    const offenders: string[] = [];
    for (const file of posts) {
      for (const s of sentences(readFileSync(join(BLOG, file), "utf8"))) {
        // Only a sentence that calls the number a score is making the claim.
        if (!/\bscore\b/i.test(s)) continue;
        for (const m of allMatches(/\b(\d{2,3}(?:\.\d)?)\s?%/g, s)) {
          if (REAL.has(m[1])) continue;
          offenders.push(
            `content/blog/${file}: "${m[1]}%" is not a mutation score BALLAST ` +
              `ever recorded. docs/MUTATION.md says ${BALLAST_MUTANTS_KILLED} of ` +
              `${BALLAST_MUTANTS_TOTAL}; docs/LEDGER.md L9 has the 87.3% → 95.8% story.`
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("states the killed/total ratio from lib/claims.ts, or not at all", () => {
    const offenders: string[] = [];
    for (const file of posts) {
      for (const s of sentences(readFileSync(join(BLOG, file), "utf8"))) {
        for (const m of allMatches(/\b(\d{2,3}) of (\d{2,3})\b/g, s)) {
          if (!/mutant|killed|mutation/i.test(s)) continue;
          if (
            Number(m[1]) !== BALLAST_MUTANTS_KILLED ||
            Number(m[2]) !== BALLAST_MUTANTS_TOTAL
          ) {
            offenders.push(
              `content/blog/${file}: "${m[0]}" — lib/claims.ts says ` +
                `${BALLAST_MUTANTS_KILLED} of ${BALLAST_MUTANTS_TOTAL}.`
            );
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("states the ledger and checker counts from lib/claims.ts", () => {
    const ledger = numberWord(BALLAST_LEDGER_FINDINGS);
    const checker = numberWord(BALLAST_CHECKER_FINDINGS);
    // "<word> of <word>" is how both posts phrase the split. Anchored on the
    // word "checker" within 200 characters EITHER SIDE, not on the sentence:
    // one post puts the split in a sentence of its own — "…turned out to be
    // in the checker rather than the system. Three of eight were." — so a
    // same-sentence rule sails straight past the defect this test exists for.
    const NUM =
      "(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\\d+)";
    const split = new RegExp(`\\b${NUM} of ${NUM}\\b`, "gi");
    const offenders: string[] = [];
    for (const file of posts) {
      const text = readFileSync(join(BLOG, file), "utf8");
      for (const m of allMatches(split, text)) {
        const near = text.slice(
          Math.max(0, m.index - 200),
          m.index + m[0].length + 200
        );
        if (!/checker/i.test(near)) continue;
        if (m[1].toLowerCase() !== checker || m[2].toLowerCase() !== ledger) {
          offenders.push(
            `content/blog/${file}: "${m[0]}" — lib/claims.ts says ${checker} of ${ledger}.`
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("states no stale BALLAST test count", () => {
    // Sentence-scoped for the same reason: "143 tests" in these posts is
    // EduScale's backend suite, quoted from its FINDINGS.md, and has nothing
    // to do with BALLAST_TEST_COUNT.
    const offenders: string[] = [];
    for (const file of posts) {
      for (const s of sentences(readFileSync(join(BLOG, file), "utf8"))) {
        if (!/ballast/i.test(s)) continue;
        for (const m of allMatches(/\b(\d{2,4}) tests\b/g, s)) {
          if (Number(m[1]) !== BALLAST_TEST_COUNT) {
            offenders.push(
              `content/blog/${file}: "${m[0]}" — lib/claims.ts says ${BALLAST_TEST_COUNT}.`
            );
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
