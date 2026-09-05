/**
 * /statistics must say what its contributions figure counts.
 *
 * The live page (2026-09-05) showed "Total: 9,634 contributions" under a
 * "Last 365 days" caption, while the public GitHub calendar showed 4,172.
 * Both were right about different things: lib/github-service.ts sums the
 * contribution calendar from 2024-01-01 to today (980 days in the committed
 * snapshot), and the profile page shows the trailing twelve months. The
 * snapshot's own last-365-day sum is 4,055 — the public figure to within the
 * snapshot's age — so the discrepancy is the window, not private repos, and
 * the fix is to caption every figure with the window it actually covers.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { contributionRange } from "@/lib/contribution-range";
import snapshot from "../data/statistics-snapshot.json";

describe("contributionRange", () => {
  it("formats the real first and last month", () => {
    expect(
      contributionRange([
        { date: "2024-01-01" },
        { date: "2026-09-03" },
        { date: "2025-06-15" },
      ])
    ).toBe("Jan 2024 – Sep 2026");
  });

  it("does not depend on input order", () => {
    expect(
      contributionRange([{ date: "2026-09-03" }, { date: "2024-01-01" }])
    ).toBe("Jan 2024 – Sep 2026");
  });

  it("collapses a single month and handles no data", () => {
    expect(contributionRange([{ date: "2026-09-01" }])).toBe("Sep 2026");
    expect(contributionRange([])).toBeNull();
  });

  it("the committed snapshot spans more than a year, which is the whole point", () => {
    const days = snapshot.github.contributionDays;
    expect(days.length).toBeGreaterThan(365);
    // GitHub pads the first week back to its Sunday, so the series opens on
    // 2023-12-31; the caption reports the data as plotted, not the query.
    const first = days[0].date;
    const last = days[days.length - 1].date;
    expect(first <= "2024-01-01").toBe(true);
    expect(last > "2025-01-01").toBe(true);
    expect(contributionRange(days)).toMatch(
      /^(Dec 2023|Jan 2024) – [A-Z][a-z]{2} 20\d\d$/
    );
    // The headline figure IS the multi-year sum, so the caption must not say
    // "last 365 days" anywhere near it.
    const sum = days.reduce((a, d) => a + d.contributionCount, 0);
    expect(sum).toBe(snapshot.github.contributions);
  });
});

describe("/statistics captions derive from the data they sum", () => {
  const read = (...p: string[]) =>
    readFileSync(join(process.cwd(), ...p), "utf8");

  it("no chart claims a 365-day window", () => {
    for (const file of [
      ["app", "statistics", "StatisticsContent.tsx"],
      ["components", "stats-charts.tsx"],
      ["components", "github-contribution-heatmap.tsx"],
    ]) {
      expect(read(...file)).not.toMatch(/Last 365 days/);
    }
  });

  it("the Contributions card, the trend chart and the heatmap all use contributionRange", () => {
    expect(read("app", "statistics", "StatisticsContent.tsx")).toMatch(
      /hint=\{[\s\S]*GitHub contribution calendar, \$\{range\}/
    );
    expect(read("components", "stats-charts.tsx")).toContain(
      "contributionRange(githubContributions)"
    );
    expect(read("components", "github-contribution-heatmap.tsx")).toContain(
      "contributionRange(contributionData)"
    );
  });

  it("the trend chart is fed real dates, not counts with invented dates", () => {
    // It used to take number[] and label point i as (now - (364 - i)) days,
    // which for a 980-point series put most labels in the future.
    const src = read("components", "stats-charts.tsx");
    expect(src).toMatch(
      /githubContributions: \{ date: string; count: number \}\[\]/
    );
    expect(src).not.toMatch(/364 - index/);
  });
});
