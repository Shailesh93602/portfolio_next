/**
 * Every page that states a number about another repository states the SAME
 * number, because it comes from lib/claims.ts.
 *
 * Before this: /engineering said "Six bugs", /portfolio/ballast said "eight",
 * the resume said nine, and BALLAST's docs/LEDGER.md listed nine. The daily
 * claim check (scripts/check-project-claims.mjs) verifies lib/claims.ts
 * against the upstream repo; this test verifies the pages against
 * lib/claims.ts. Together they close the loop.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  BALLAST_CHECKER_FINDINGS,
  BALLAST_LEDGER_FINDINGS,
  BALLAST_MUTANTS_KILLED,
  BALLAST_MUTANTS_TOTAL,
  BALLAST_TEST_COUNT,
  KHATAGO_EVAL_COUNT,
  KHATAGO_TOOL_COUNT,
  numberWord,
  numberWordCapitalised,
} from "@/lib/claims";
import { projects } from "@/constants/projects";

const byId = (id: string) => projects.find((p) => p.id === id)!;

/**
 * `matchAll` with `for…of` does not compile under this project's ES5 target
 * (TS2802). An exec loop is the portable form; the `g` flag is required and
 * asserted so a caller cannot silently produce an infinite loop.
 */
function allMatches(re: RegExp, text: string): RegExpExecArray[] {
  if (!re.global) throw new Error(`allMatches needs a /g regex: ${re}`);
  const out: RegExpExecArray[] = [];
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push(m);
    if (m[0] === "") re.lastIndex += 1;
  }
  return out;
}

describe("numberWord", () => {
  it("spells small numbers and falls back to digits", () => {
    expect(numberWord(9)).toBe("nine");
    expect(numberWordCapitalised(9)).toBe("Nine");
    expect(numberWord(42)).toBe("42");
  });
});

describe("BALLAST finding counts", () => {
  it("checker findings are a subset of ledger findings", () => {
    expect(BALLAST_CHECKER_FINDINGS).toBeGreaterThan(0);
    expect(BALLAST_CHECKER_FINDINGS).toBeLessThan(BALLAST_LEDGER_FINDINGS);
  });

  it("the BALLAST project page states the constant, as a word", () => {
    const text = byId("ballast").challengesSolved ?? "";
    expect(text).toContain(
      `found ${numberWord(BALLAST_LEDGER_FINDINGS)} real bugs`
    );
    expect(text).toContain(
      `${numberWord(BALLAST_CHECKER_FINDINGS)} of them in the checker`
    );
    // No stale literal survives alongside it.
    expect(text).not.toMatch(/\b(six|eight) real bugs\b/i);
  });

  it("the /engineering page derives its BALLAST title from the constant", () => {
    // The page is a server component that reads the constants at module
    // scope; asserting on the source is the cheapest way to prove it does
    // not carry its own literal.
    const src = readFileSync(
      join(process.cwd(), "app", "engineering", "page.tsx"),
      "utf8"
    );
    expect(src).toContain("BALLAST_LEDGER_FINDINGS");
    expect(src).not.toMatch(/"Six bugs|"Eight bugs|"Nine bugs/);
  });

  it("the claim-check script reads the constant, not the prose", () => {
    const src = readFileSync(
      join(process.cwd(), "scripts", "check-project-claims.mjs"),
      "utf8"
    );
    expect(src).toContain("BALLAST_LEDGER_FINDINGS = (\\d+)");
    expect(src).toContain("BALLAST_TEST_COUNT = (\\d+)");
    expect(src).toContain("KHATAGO_TOOL_COUNT = (\\d+)");
    expect(src).toContain("KHATAGO_EVAL_COUNT = (\\d+)");
    // And the one personal fact it checks against the GfG profile itself.
    // The institute-rank row went with the rank claim (2026-09-06): a check
    // that verifies a number no surface states goes stale unnoticed.
    expect(src).toContain("problemsSolved: (\\d+)");
    expect(src).toContain("total_problems_solved");
    expect(src).not.toContain("geeksforgeeksRank: (\\d+)");
    expect(src).not.toMatch(/sourcePattern: \/institute_rank/);
  });
});

describe("BALLAST test count", () => {
  /**
   * 🔴 These patterns are BUILT FROM THE CONSTANT, never written as a literal.
   *
   * They used to hardcode `202` inside the negative lookahead — the very number
   * they exist to protect. So when BALLAST went 202 → 209 the guard did not
   * fail; it happily asserted "no three-digit count other than 202", which was
   * true of a file that still said 202. The daily claim check caught the drift
   * and this suite stayed green for four days beside it.
   *
   * A guard that repeats the value it guards is not a guard. Deriving the
   * pattern means updating `BALLAST_TEST_COUNT` is the whole edit, and any
   * surface left behind fails here.
   */
  const COUNT = String(BALLAST_TEST_COUNT);
  const staleVitest = new RegExp(`Vitest \\((?!${COUNT}\\))\\d+\\)`);
  const staleTestCount = new RegExp(`\\b(?!${COUNT}\\b)\\d{3} tests\\b`);

  it("the project card renders the constant and no stale literal survives", () => {
    const b = byId("ballast");
    const text = JSON.stringify(b);
    expect(text).toContain(`Tests: Vitest (${BALLAST_TEST_COUNT})`);
    expect(text).not.toMatch(staleVitest);
  });

  it("the resume and llms.txt state the same number", () => {
    const resume = readFileSync(
      join(process.cwd(), "resume", "resume.json"),
      "utf8"
    );
    expect(resume).toContain(`${BALLAST_TEST_COUNT} tests`);
    expect(resume).not.toMatch(staleTestCount);
    const llms = readFileSync(
      join(process.cwd(), "public", "llms.txt"),
      "utf8"
    );
    expect(llms).toContain(`${BALLAST_TEST_COUNT} tests`);
    expect(llms).not.toMatch(staleTestCount);
  });

  /**
   * `resume.json` is the source; `resume.txt` is COMPILED from it by
   * `node resume/build.mjs`, alongside the PDF the site actually serves and
   * the DOCX portals parse. Editing the source without rebuilding leaves the
   * artifact a recruiter opens stating the old number while every test that
   * reads the source passes — the same shape of gap as a middleware test that
   * imports the module the framework never loads.
   *
   * resume.txt is the cheap proxy for "the build was re-run": it is committed,
   * it is plain text, and it cannot be correct unless build.mjs regenerated it.
   */
  it("the compiled resume.txt was rebuilt from the source, not left behind", () => {
    const txt = readFileSync(
      join(process.cwd(), "resume", "resume.txt"),
      "utf8"
    );
    expect(txt).toContain(`${BALLAST_TEST_COUNT} tests`);
    expect(txt).not.toMatch(staleTestCount);
  });
});

describe("KhataGO eval count", () => {
  it("the Evals metric, the architecture and the prose all state the constant", () => {
    const kg = byId("khatago");
    const metric = kg.keyMetrics?.find((m) => m.label === "Evals");
    expect(metric?.value).toBe(`${KHATAGO_EVAL_COUNT}/${KHATAGO_EVAL_COUNT}`);
    // A metric a reader can reproduce names the command.
    expect(metric?.description).toContain("npm run evals");

    const archItems = kg.architecture?.layers.flatMap((l) => l.items) ?? [];
    expect(
      archItems.some((i) =>
        i.startsWith(`${KHATAGO_EVAL_COUNT} deterministic evals`)
      )
    ).toBe(true);
    expect(kg.detailedDescription).toContain(
      `${KHATAGO_EVAL_COUNT} deterministic evals`
    );
  });

  it("the files AI agents read state the same number", () => {
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const text = readFileSync(join(process.cwd(), "public", file), "utf8");
      expect(text).toContain(`${KHATAGO_EVAL_COUNT} deterministic evals`);
      // No stale literal survives alongside it.
      expect(text).not.toMatch(
        new RegExp(`\\b(?!${KHATAGO_EVAL_COUNT}\\b)\\d+ deterministic evals`)
      );
    }
  });

  it("nothing claims the 2026-09-05 agent work is live: it is in the repository", () => {
    // KhataGO's production deploys have failed since 2026-08-30; the state
    // machine, evals and retention crons are merged, not served. Every
    // surface that describes them says so.
    const kg = byId("khatago");
    expect(kg.detailedDescription).toMatch(/In the repository/);
    const layer = kg.architecture?.layers.find((l) =>
      /Agent runtime/.test(l.name)
    );
    expect(layer?.name).toMatch(/in the repository/);
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const text = readFileSync(join(process.cwd(), "public", file), "utf8");
      expect(text).toMatch(/[Ii]n the repository[^.]*not yet deployed/);
    }
  });
});

describe("KhataGO race claims match the tests they cite", () => {
  it("the home page attributes each 8 to the property its test proves", () => {
    const home = readFileSync(
      join(process.cwd(), "app", "HomeContent.tsx"),
      "utf8"
    );
    // whatsapp-webhook.integration.test.ts counts WhatsappMessage rows.
    expect(home).toMatch(
      /8 simultaneous deliveries of one message collapse to one stored row/
    );
    // agent-run.integration.test.ts counts Transaction rows.
    expect(home).toMatch(
      /8 concurrent executors of one agent write step commit exactly one ledger row/
    );
    // The sentence no test asserted.
    expect(home).not.toMatch(/deliveries[^.]*produce exactly one ledger write/);
  });
});

describe("KhataGO tool count", () => {
  it("keyMetrics, architecture and prose all state the same number", () => {
    const kg = byId("khatago");
    const metric = kg.keyMetrics?.find((m) => m.label === "Tool calls");
    expect(metric?.value).toBe(String(KHATAGO_TOOL_COUNT));

    const archItems = kg.architecture?.layers.flatMap((l) => l.items) ?? [];
    const toolsItem = archItems.find((i) =>
      /function-calling \(\d+ tools\)/.test(i)
    );
    expect(toolsItem).toContain(`(${KHATAGO_TOOL_COUNT} tools)`);

    expect(kg.detailedDescription).toContain(
      `${KHATAGO_TOOL_COUNT} tool calls`
    );
    // The number that used to disagree.
    expect(JSON.stringify(kg)).not.toMatch(/\(8 tools\)/);
  });

  it("KhataGO's stack names Next.js API routes, not Express", () => {
    const stack = (byId("khatago").techStack ?? []).join(" ");
    expect(stack).toMatch(/Next\.js API routes/);
    expect(stack).not.toMatch(/Express/);
  });

  it("KhataGO describes the shipped worker, not after()-only processing", () => {
    const kg = byId("khatago");
    const text = JSON.stringify(kg);
    expect(text).toMatch(/polling worker/);
    expect(text).toMatch(/dead-letter/i);
    expect(text).toMatch(/backoff with jitter/);
    expect(text).not.toMatch(/AI work runs after the response/);
  });
});

describe("showcase pull-quotes are distinct from the challenge paragraph", () => {
  it.each(["khatago", "eduscale"])("%s has its own one-line quote", (id) => {
    const p = byId(id);
    expect(p.pullQuote).toBeTruthy();
    expect(p.pullQuote).not.toBe(p.challengesSolved);
    expect(p.challengesSolved ?? "").not.toContain(p.pullQuote!);
  });
});

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
 * "BALLAST test count" above: a guard that repeats the value it guards is not
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

describe("CodeSenseiSearch", () => {
  it("has no live link and does not claim a deployed queue", () => {
    const p = byId("codesensei-search");
    expect(p.live).toBeUndefined();
    expect(p.description).not.toMatch(/BullMQ|Upstash|deployed on Vercel/);
    expect(p.description).toMatch(/not yet wired/);
  });
});
