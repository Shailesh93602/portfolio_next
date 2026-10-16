import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * next 16.3.3 sat in the range of GHSA-vcvr-r3jv-pc5j (RCE in next/og
 * ImageResponse, fixed in 16.3.6) and GHSA-cjq9-62q9-8jv4 (SSRF in image
 * optimisation, fixed in 16.3.8). This site serves /api/og with a
 * caller-controlled `title`, so the floor is a hard requirement, not hygiene.
 * Reads the lockfile: that is what `npm ci` installs on CI and Vercel.
 */
const FLOOR = [16, 3, 8];

const parse = (v: string) => v.split(/[.-]/).slice(0, 3).map(Number);
const atLeast = (v: number[], floor: number[]) => {
  for (let i = 0; i < 3; i++) {
    if (v[i] !== floor[i]) return v[i] > floor[i];
  }
  return true;
};

describe("dependency floors", () => {
  it("locks next at or above the patched release", () => {
    const lock = JSON.parse(
      readFileSync(join(process.cwd(), "package-lock.json"), "utf8")
    );
    const version: string = lock.packages["node_modules/next"].version;
    expect(atLeast(parse(version), FLOOR)).toBe(true);
  });

  it("the manifest range cannot resolve below it either", () => {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8")
    );
    const range: string = pkg.dependencies.next;
    expect(atLeast(parse(range.replace(/^[\^~]/, "")), FLOOR)).toBe(true);
  });
});
