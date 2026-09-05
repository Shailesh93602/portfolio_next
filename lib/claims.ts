/**
 * Numbers this site states about OTHER repositories, each defined exactly once.
 *
 * Why this file exists: `/engineering` said "Six bugs", `/portfolio/ballast`
 * said "eight", and BALLAST's own ledger listed nine. Three surfaces, three
 * numbers, one fact. Every page that mentions one of these now imports it from
 * here, and `scripts/check-project-claims.mjs` verifies THIS file against the
 * upstream repository daily — so the number can only drift in one place, and
 * that place is watched.
 *
 * Keep each constant next to the command that reproduces it.
 */

/**
 * Rows in the summary table of `docs/LEDGER.md` in Shailesh93602/ballast.
 * Reproduce: `grep -cE '^\| L[0-9]+ ' docs/LEDGER.md`
 */
export const BALLAST_LEDGER_FINDINGS = 9;

/**
 * Of those, the findings whose defect was in the CHECKER — the invariant
 * corpus, the reference oracle or the mutation harness — rather than in the
 * system under test: L1 (invariant trusted the plane's self-report), L3
 * (reference billed unspent credit), L7 (harness reported 100% on a red suite),
 * L9 (mutation operator did not negate). L2 is a spec gap; L4, L5, L6, L8 are
 * implementation defects.
 */
export const BALLAST_CHECKER_FINDINGS = 4;

/**
 * Gemini function-calling tools declared in `lib/ai/tools.ts` in
 * Shailesh93602/KhataGO. Reproduce: `grep -cE '^\s*name: "' lib/ai/tools.ts`
 */
export const KHATAGO_TOOL_COUNT = 10;

/**
 * Fixture conversations in `evals/cases.ts` in Shailesh93602/KhataGO. Each runs
 * through the production agent loop under a scripted model in CI, scored by
 * promptproof, under both engines (the hand-rolled loop and the LangGraph.js
 * rendering behind `--engine=langgraph`).
 * Reproduce: `grep -cE '^\s*id: "' evals/cases.ts`, or run them:
 * `npm run evals && npm run evals -- --engine=langgraph`.
 */
export const KHATAGO_EVAL_COUNT = 21;

const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
] as const;

/** 9 → "nine". Prose reads better with the word; the constant stays a number. */
export function numberWord(n: number): string {
  return WORDS[n] ?? String(n);
}

/** 9 → "Nine", for sentence starts. */
export function numberWordCapitalised(n: number): string {
  const w = numberWord(n);
  return w.charAt(0).toUpperCase() + w.slice(1);
}
