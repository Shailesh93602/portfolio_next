/**
 * @jest-environment node
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SKILL = ".claude/skills/seo-check/SKILL.md";
const text = readFileSync(join(process.cwd(), SKILL), "utf8");
const code = [
  ...Array.from(text.matchAll(/```[a-z]*\n([\s\S]*?)```/g), (m) => m[1]),
  ...Array.from(text.matchAll(/`([^`\n]+)`/g), (m) => m[1]),
];
const commands = code
  .flatMap((block) => block.split("\n"))
  .filter((line) => /\bnpx\s/.test(line));

describe("the seo-check skill", () => {
  it("is tracked, not swallowed by the .claude/ ignore rule", () => {
    const r = spawnSync("git", ["check-ignore", "-q", SKILL]);
    expect(r.status).toBe(1);
  });

  it("names itself and has commands to check", () => {
    expect(text).toMatch(/^---\nname: seo-check\n/);
    expect(commands.filter((c) => /lhci/.test(c)).length).toBeGreaterThan(1);
  });

  it("always invokes Lighthouse CI as `npx @lhci/cli`, never bare `npx lhci`", () => {
    expect(commands.filter((c) => /npx\s+lhci\b/.test(c))).toEqual([]);
  });

  it("never runs autorun, and uploads only to the filesystem", () => {
    // The repo config's upload target is temporary-public-storage.
    expect(commands.filter((c) => /\bautorun\b/.test(c))).toEqual([]);
    expect(
      commands.filter(
        (c) => /@lhci\/cli\s+upload\b/.test(c) && !/--target=filesystem/.test(c)
      )
    ).toEqual([]);
  });
});
