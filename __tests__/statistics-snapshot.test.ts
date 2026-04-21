// Must be declared inline so jest.mock hoisting picks it up — referencing
// a top-level const would throw "out-of-scope variable" during hoisting.
jest.mock("node:fs", () => ({
  readFileSync: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { readFileSync } = require("node:fs");

const loadFreshModule = () => {
  jest.resetModules();
  // Re-register the mock after resetModules so the re-imported statistics
  // snapshot module picks up our controllable readFileSync.
  jest.doMock("node:fs", () => ({ readFileSync }));
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/statistics-snapshot") as typeof import("@/lib/statistics-snapshot");
};

describe("getStatisticsSnapshot", () => {
  beforeEach(() => {
    readFileSync.mockReset();
  });

  it("returns the parsed snapshot payload when the file is readable", () => {
    const payload = {
      github: {
        repositories: 12,
        contributions: 7184,
        stars: 3,
        forks: 1,
        followers: 5,
        languages: [{ name: "TypeScript", percentage: 60, color: "#3178c6" }],
        currentStreak: { count: 9, startDate: "2026-04-10", endDate: "2026-04-18" },
        longestStreak: { count: 42, startDate: "2025-01-01", endDate: "2025-02-11" },
        totalCommits: 4758,
        totalPRs: 120,
        totalIssues: 40,
        totalRepos: 12,
        contributionDays: [],
      },
      leetcode: {
        totalSolved: 140,
        easySolved: 60,
        mediumSolved: 70,
        hardSolved: 10,
        ranking: 99999,
        contributionPoint: 200,
        reputation: 0,
        currentStreak: { count: 3, startDate: "", endDate: "" },
        longestStreak: { count: 10, startDate: "", endDate: "" },
        activeYears: [2024, 2025, 2026],
        totalActiveDays: 180,
        submissionCalendar: {},
      },
    };
    readFileSync.mockReturnValue(JSON.stringify(payload));

    const { getStatisticsSnapshot } = loadFreshModule();
    const result = getStatisticsSnapshot();

    expect(result.github.contributions).toBe(7184);
    expect(result.github.totalCommits).toBe(4758);
    expect(result.leetcode.totalSolved).toBe(140);
    expect(result.github.languages[0].name).toBe("TypeScript");
  });

  it("caches after first read — subsequent calls do not re-read the file", () => {
    readFileSync.mockReturnValue(
      JSON.stringify({ github: {}, leetcode: {} })
    );

    const { getStatisticsSnapshot } = loadFreshModule();
    getStatisticsSnapshot();
    getStatisticsSnapshot();
    getStatisticsSnapshot();

    expect(readFileSync).toHaveBeenCalledTimes(1);
  });

  it("returns a zeroed fallback when the file is missing", () => {
    readFileSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { getStatisticsSnapshot } = loadFreshModule();
    const result = getStatisticsSnapshot();

    expect(result.github.contributions).toBe(0);
    expect(result.github.repositories).toBe(0);
    expect(result.leetcode.totalSolved).toBe(0);
    expect(Array.isArray(result.github.languages)).toBe(true);
    expect(result.github.languages).toHaveLength(0);
    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to load statistics snapshot:",
      expect.any(Error)
    );

    errorSpy.mockRestore();
  });

  it("returns a zeroed fallback when the file contains invalid JSON", () => {
    readFileSync.mockReturnValue("not-json {");
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const { getStatisticsSnapshot } = loadFreshModule();
    const result = getStatisticsSnapshot();

    expect(result.github.totalCommits).toBe(0);
    expect(result.leetcode.ranking).toBe(0);
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });
});
