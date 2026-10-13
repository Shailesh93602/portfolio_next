/**
 * @jest-environment node
 *
 * scripts/deploy-freshness-decision.mjs — the pure formatting helpers around
 * the decision: FRESHNESS_GRACE_MINUTES parsing, how long live has been behind
 * (in the unit a reader thinks in), and the one-line summary the job prints.
 */
import {
  MAX_LAG_MS,
  formatAge,
  parseGraceMinutes,
  summarize,
} from "../scripts/deploy-freshness-decision.mjs";
import { HOUR } from "./helpers/deploy-freshness-fixtures";

describe("parseGraceMinutes (FRESHNESS_GRACE_MINUTES)", () => {
  it("unset or empty → the 30-minute default", () => {
    expect(parseGraceMinutes(undefined)).toBe(30);
    expect(parseGraceMinutes("")).toBe(30);
    expect(parseGraceMinutes("  ")).toBe(30);
  });

  it("a number of minutes, including 0 (grace off) and fractions", () => {
    expect(parseGraceMinutes("45")).toBe(45);
    expect(parseGraceMinutes("0")).toBe(0);
    expect(parseGraceMinutes("2.5")).toBe(2.5);
  });

  it("refuses anything that is not a non-negative number instead of silently defaulting", () => {
    for (const bad of ["30m", "abc", "-5", "NaN", "Infinity"]) {
      expect(() => parseGraceMinutes(bad)).toThrow(/FRESHNESS_GRACE_MINUTES/);
    }
  });
});

describe("formatAge — how long live has been behind, in a readable unit", () => {
  const MINUTE = 60_000;
  const DAY = 24 * HOUR;

  it("minutes below 90 minutes", () => {
    expect(formatAge(0)).toBe("0m");
    expect(formatAge(30 * MINUTE)).toBe("30m");
    expect(formatAge(89 * MINUTE)).toBe("89m");
  });

  it("hours from 90 minutes to a day", () => {
    expect(formatAge(90 * MINUTE)).toBe("1.5h");
    expect(formatAge(8 * HOUR)).toBe("8.0h");
    expect(formatAge(23 * HOUR + 59 * MINUTE)).toBe("24.0h");
  });

  it("days from a day up — a week-long outage reads as a week", () => {
    // The whole point: KhataGO was seven days stale and the check said
    // "sha mismatch". 168 hours is a true and useless way to print that.
    expect(formatAge(7 * DAY)).toBe("7d");
    expect(formatAge(DAY)).toBe("1d");
    expect(formatAge(31 * HOUR)).toBe("1d");
    expect(formatAge(30 * DAY)).toBe("30d");
  });

  it("the day boundary is the 24h lag window, so every FAIL reads in days", () => {
    expect(formatAge(MAX_LAG_MS - 1)).toMatch(/h$/);
    expect(formatAge(MAX_LAG_MS)).toBe("1d");
  });

  it("null when there is nothing to measure — never NaN, and never a false 0m", () => {
    // The private-repo shape: no commit times, so no age. Printing "0m" there
    // would say the opposite of the truth.
    expect(formatAge(NaN)).toBeNull();
    expect(formatAge(undefined)).toBeNull();
    expect(formatAge(null)).toBeNull();
    expect(formatAge(Infinity)).toBeNull();
    expect(formatAge("8h")).toBeNull();
  });

  it("clamps a negative age (clock skew) to zero rather than printing '-3m'", () => {
    expect(formatAge(-3 * MINUTE)).toBe("0m");
  });
});

describe("summarize — the line the job prints even when nothing fails", () => {
  const ok = { ok: true };
  const deploying = { ok: true, deploying: true };
  const unverifiable = { ok: true, unverifiable: true };
  const failed = { ok: false };

  it("all green: N of N, with no parenthetical", () => {
    expect(summarize([ok, ok, ok])).toBe("3 of 3 apps serve main");
  });

  it("names what the rest are, so a regression is visible from the Actions list", () => {
    expect(summarize([ok, failed, deploying, unverifiable])).toBe(
      "1 of 4 apps serve main (1 stale, 1 deploying, 1 unverifiable)"
    );
  });

  it("today's real shape: three serving, KhataGO stale", () => {
    expect(summarize([ok, failed, ok, ok])).toBe(
      "3 of 4 apps serve main (1 stale)"
    );
  });

  it("a deploying or unverifiable row is not counted as serving main", () => {
    // "cannot verify" was never a pass; neither is "not there yet".
    expect(summarize([deploying, unverifiable])).toBe(
      "0 of 2 apps serve main (1 deploying, 1 unverifiable)"
    );
  });

  it("no targets → 0 of 0, not a crash", () => {
    expect(summarize([])).toBe("0 of 0 apps serve main");
  });
});
