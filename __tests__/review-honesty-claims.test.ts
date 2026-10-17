/** @jest-environment node */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CLAIMS } from "../scripts/claims/claim-list.mjs";
import { projects } from "@/constants/projects";

const root = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");
const LOCAL: Record<string, string> = {
  projects: read("constants/projects.ts"),
  home: read("app/HomeContent.tsx"),
  claims: read("lib/claims.ts"),
  profile: read("lib/profile.ts"),
};
const project = (id: string) =>
  JSON.stringify(projects.find((p) => p.id === id));

type Claim = {
  what: string;
  localFile?: string;
  localPattern: RegExp;
  sourceCount?: RegExp;
};
const claims = CLAIMS as Claim[];

describe("the daily claim check still reads every claim it lists", () => {
  it.each(claims.map((c) => [c.what, c]))("%s", (_what, claim) => {
    expect(LOCAL[claim.localFile ?? "projects"]).toMatch(claim.localPattern);
  });

  it("checks the BALLAST checker-findings count and the matchmaking band", () => {
    const names = claims.map((c) => c.what);
    expect(names).toContain("BALLAST findings in the checking apparatus");
    for (const part of ["start", "widening", "cap"]) {
      expect(names).toContain(`EduScale matchmaking band ${part}`);
    }
  });

  it("counts only checking-apparatus rows of the ledger", () => {
    const claim = claims.find(
      (c) => c.what === "BALLAST findings in the checking apparatus"
    )!;
    const ledger = [
      "| L1  | Invariant corpus | 🔴 checker     | x |",
      "| L2  | Differential     | 🔴 spec gap    | x |",
      "| L3  | Differential     | 🟠 reference   | x |",
      "| L6  | Mutation         | 🟠 correctness | x |",
      "| L9  | Hand-applying    | 🟠 harness bug | x |",
      "| L13 | Reading          | 🟠 corpus      | x |",
    ].join("\n");
    expect(ledger.match(claim.sourceCount!)).toHaveLength(4);
  });
});

describe("claims the code review found unbacked", () => {
  it("/engineering says only the budgets Lighthouse CI enforces fail the build", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const lhci = require("../.lighthouserc.js");
    const levels = lhci.ci.assert.assertions as Record<string, [string]>;
    const page = read("app/engineering/page.tsx").replace(/\s+/g, " ");
    const li = page.match(/Performance budgets<\/strong>(.*?)<\/li>/)![1];
    const gate = li.split(/fails? the build/)[0];
    const labels: Record<string, string> = {
      "largest-contentful-paint": "LCP",
      "cumulative-layout-shift": "CLS",
      "total-blocking-time": "total blocking time",
    };
    for (const [audit, label] of Object.entries(labels)) {
      if (levels[audit][0] === "error") expect(gate).toContain(label);
      else expect(gate).not.toContain(label);
    }
  });

  it("no surface says EduScale is horizontally scaled (it is designed for it)", () => {
    for (const f of ["app/layout.tsx", "constants/projects.ts"]) {
      expect(read(f)).not.toMatch(/horizontally[- ]scaled/i);
    }
  });

  it("the EduScale matchmaking card matches matchmakingService.ts", () => {
    const edu = project("eduscale");
    expect(edu).toContain(
      "starts at ±100 rating points and widens 20 points per second, capped at ±600"
    );
    expect(edu).not.toMatch(/±50|every 3 seconds|zero race conditions/);
  });

  it("DevTrack is described as rule-based, not AI-driven", () => {
    expect(project("devtrack")).not.toMatch(/AI-driven|proprietary/i);
  });

  it("BALLAST separates what the harness found from what auditing it found", () => {
    const ballast = project("ballast");
    expect(ballast).not.toMatch(/The suite found/);
    expect(ballast).toMatch(/first nine caught by the harness itself/);
  });
});
