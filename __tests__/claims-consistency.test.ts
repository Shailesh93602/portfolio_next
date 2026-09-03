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
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  BALLAST_CHECKER_FINDINGS,
  BALLAST_LEDGER_FINDINGS,
  KHATAGO_TOOL_COUNT,
  numberWord,
  numberWordCapitalised,
} from "@/lib/claims";
import { projects } from "@/constants/projects";

const byId = (id: string) => projects.find((p) => p.id === id)!;

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
    expect(src).toContain("KHATAGO_TOOL_COUNT = (\\d+)");
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

describe("CodeSenseiSearch", () => {
  it("has no live link and does not claim a deployed queue", () => {
    const p = byId("codesensei-search");
    expect(p.live).toBeUndefined();
    expect(p.description).not.toMatch(/BullMQ|Upstash|deployed on Vercel/);
    expect(p.description).toMatch(/not yet wired/);
  });
});
