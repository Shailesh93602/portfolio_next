/**
 * The COMMITTED snapshot, not a mock of it.
 *
 * `data/statistics-snapshot.json` is what /statistics server-renders and what
 * /api/statistics serves when the live APIs are slow — so it is the file a
 * visitor is most likely to be reading, and nothing verified its internal
 * consistency.
 *
 * 🔴 WHAT THIS CATCHES, AND WHY A MOCK CANNOT.
 *
 * GitHub caps the contribution calendar at one year, so lib/github-service.ts
 * fetches the range since 2024-01-01 as consecutive windows. Those windows are
 * cut by instant; GitHub buckets by calendar day. The boundary day came back in
 * both and was stored twice: the shipped snapshot held **980 entries for 978
 * distinct dates**, with 2024-12-30 (6) and 2025-12-30 (0) repeated, and the
 * "9,634 contributions" on the page counted that 6 a second time.
 *
 * Every assertion below is derived from the file itself. Nothing here restates
 * a count — a guard that repeats the value it guards is not a guard, and this
 * repo has already shipped one of those.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const snapshot = JSON.parse(
  readFileSync(join(process.cwd(), "data", "statistics-snapshot.json"), "utf8")
) as {
  github: {
    contributions: number;
    contributionDays: { date: string; contributionCount: number }[];
  };
};

const days = snapshot.github.contributionDays;

describe("data/statistics-snapshot.json", () => {
  it("has contribution days at all", () => {
    // Without this every assertion below passes vacuously on an empty array.
    expect(Array.isArray(days)).toBe(true);
    expect(days.length).toBeGreaterThan(300);
  });

  it("stores each calendar date exactly once", () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const day of days) {
      if (seen.has(day.date)) duplicates.push(day.date);
      seen.add(day.date);
    }
    // Reported as the counts too, because "980 entries for 978 distinct dates"
    // is the sentence that explains the failure; a bare `[]` does not.
    expect({ duplicates, entries: days.length, distinct: seen.size }).toEqual({
      duplicates: [],
      entries: seen.size,
      distinct: seen.size,
    });
  });

  it("states a total that the days it ships actually sum to", () => {
    // The headline figure and the heatmap beneath it are the same data. When
    // they disagree, one of them is wrong and the page gives no way to tell
    // which — this is the assertion the 9,634 failed.
    const summed = days.reduce(
      (total, day) => total + day.contributionCount,
      0
    );
    expect(snapshot.github.contributions).toBe(summed);
  });

  it("is sorted ascending, so the range caption reads the real span", () => {
    const sorted = [...days].map((d) => d.date).sort();
    expect(days.map((d) => d.date)).toEqual(sorted);
  });

  it("carries only well-formed dates and non-negative counts", () => {
    const bad = days.filter(
      (day) =>
        !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
        typeof day.contributionCount !== "number" ||
        day.contributionCount < 0
    );
    expect(bad).toEqual([]);
  });
});
