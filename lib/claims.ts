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
export const BALLAST_LEDGER_FINDINGS = 21;

/**
 * Vitest tests in Shailesh93602/ballast, as its README states them.
 * Reproduce: `npx vitest run` there, or `grep -oE '\*\*[0-9]+ tests\*\*' README.md`.
 * The daily claim check reads this constant; the portfolio card, the resume
 * and llms.txt render it (or are held to it by claims-consistency.test.ts).
 */
export const BALLAST_TEST_COUNT = 238;

/**
 * The mutation run over `src/policy` in Shailesh93602/ballast, as
 * `docs/MUTATION.md` reports it. Reproduce: `node scripts/mutate.mjs` there.
 *
 * These two exist because the BLOG forked from them and nothing noticed. Two
 * published posts stated a mutation score of "84.2%" — a number that appears
 * nowhere in BALLAST's history, while `/portfolio/ballast` stated the real
 * sequence (87.3% under a broken negation operator, 95.8% after triage) on the
 * same site. The blog was a fourth surface this file never reached; see the
 * blog block in claims-consistency.test.ts.
 */
export const BALLAST_MUTANTS_TOTAL = 167;
export const BALLAST_MUTANTS_KILLED = 161;

/**
 * Of those, the findings whose defect was in the CHECKER — the invariant
 * corpus, the reference oracle or the mutation harness — rather than in the
 * system under test: L1 (invariant trusted the plane's self-report), L3
 * (reference billed unspent credit), L7 (harness reported 100% on a red suite),
 * L9 (mutation operator did not negate). L2 is a spec gap; L4, L5, L6, L8 are
 * implementation defects.
 */
export const BALLAST_CHECKER_FINDINGS = 12;

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

/**
 * The Next.js major in `apps/web/package.json` of Shailesh93602/CodeSenseiSearch.
 * Reproduce: `grep '"next"' apps/web/package.json` there.
 *
 * 🔴 WHY A FRAMEWORK VERSION IS IN A FILE OF FACT CLAIMS.
 *
 * The card said "Next.js 14" while the repo had been on 16 for some time, and
 * the guard in `claims-consistency.test.ts` was pinning the *prose around it*
 * ("not yet wired") rather than checking anything upstream — so the one test
 * that mentioned this project by name was enforcing the stale description
 * instead of catching it. A version a reader can check in one click is a
 * claim like any other; it belongs here, where the daily check can read it.
 */
export const CODESENSEI_NEXT_MAJOR = 16;

/**
 * The NestJS major in `apps/api/package.json` of the same repository.
 * Reproduce: `grep '"@nestjs/common"' apps/api/package.json` there.
 * Same reasoning as above — the card names it, so something has to check it.
 */
export const CODESENSEI_NEST_MAJOR = 11;

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
