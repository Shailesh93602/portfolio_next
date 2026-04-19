import axios from "axios";
import {
  getLocalDate,
  daysBetween,
  fetchGithubStats,
  getGitHubContributions,
} from "@/lib/github-service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ─── Shared helper tests ──────────────────────────────────────────────────────

describe("github-service helpers", () => {
  describe("getLocalDate", () => {
    it("returns a YYYY-MM-DD string", () => {
      expect(getLocalDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("returns a date string for an arbitrary Date object", () => {
      const d = new Date("2024-06-15T12:00:00.000Z");
      // Result will be 2024-06-15 or 2024-06-16 depending on IST offset —
      // we only assert format and year, not exact date (timezone-dependent)
      const result = getLocalDate(d);
      expect(result).toMatch(/^2024-06-1[56]$/);
    });

    it("always returns the same format regardless of input date", () => {
      const dates = [
        new Date("2024-01-01T00:00:00.000Z"),
        new Date("2023-12-31T23:59:59.000Z"),
        new Date("2024-07-04T12:00:00.000Z"),
      ];
      dates.forEach((d) => {
        expect(getLocalDate(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe("daysBetween", () => {
    it("returns 1 for the same date", () => {
      expect(daysBetween("2024-01-01", "2024-01-01")).toBe(1);
    });

    it("counts inclusively", () => {
      expect(daysBetween("2024-01-01", "2024-01-03")).toBe(3);
    });

    it("is order-independent (absolute value)", () => {
      expect(daysBetween("2024-01-03", "2024-01-01")).toBe(
        daysBetween("2024-01-01", "2024-01-03")
      );
    });

    it("returns 0 for empty strings", () => {
      expect(daysBetween("", "2024-01-01")).toBe(0);
      expect(daysBetween("2024-01-01", "")).toBe(0);
      expect(daysBetween("", "")).toBe(0);
    });

    it("handles a 7-day week correctly", () => {
      expect(daysBetween("2024-01-01", "2024-01-07")).toBe(7);
    });
  });
});

// ─── getGitHubContributions ───────────────────────────────────────────────────

const makeGraphQLResponse = (overrides = {}) => ({
  ok: true,
  json: async () => ({
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 100,
            weeks: [
              {
                contributionDays: [
                  { contributionCount: 5, date: "2024-01-02" },
                  { contributionCount: 3, date: "2024-01-03" },
                ],
              },
            ],
          },
          totalCommitContributions: 80,
          totalPullRequestContributions: 10,
          totalIssueContributions: 5,
          totalRepositoryContributions: 5,
        },
      },
    },
    ...overrides,
  }),
});

describe("getGitHubContributions", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    globalThis.fetch = mockFetch;
  });

  it("returns contribution stats for a valid user", async () => {
    mockFetch.mockResolvedValue(makeGraphQLResponse());

    const result = await getGitHubContributions("shailesh93602");

    // Service fetches multiple year-periods since 2024, so totals accumulate
    expect(result.totalContributions).toBeGreaterThanOrEqual(100);
    expect(result.totalCommits).toBeGreaterThanOrEqual(80);
    expect(result.totalPRs).toBeGreaterThanOrEqual(10);
    expect(result.totalIssues).toBeGreaterThanOrEqual(5);
    expect(result.totalRepos).toBeGreaterThanOrEqual(5);
    expect(Array.isArray(result.contributionDays)).toBe(true);
  });

  it("returns empty defaults when GraphQL returns null user", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { user: null } }),
    });

    const result = await getGitHubContributions("nobody");

    expect(result.totalContributions).toBe(0);
    expect(result.contributionDays).toEqual([]);
  });

  it("returns empty defaults when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await getGitHubContributions("shailesh93602");

    expect(result.totalContributions).toBe(0);
    expect(result.currentStreak).toEqual({
      count: 0,
      startDate: "",
      endDate: "",
    });
  });

  it("returns empty defaults when response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({}),
    });

    const result = await getGitHubContributions("shailesh93602");

    expect(result.totalContributions).toBe(0);
  });
});

// ─── fetchGithubStats ─────────────────────────────────────────────────────────

const mockUserData = {
  public_repos: 42,
  followers: 88,
};

const mockRepoData = [
  {
    name: "portfolio",
    stargazers_count: 10,
    forks_count: 2,
    languages_url: "https://api.github.com/repos/s/portfolio/languages",
  },
  {
    name: "redis-demo",
    stargazers_count: 5,
    forks_count: 1,
    languages_url: "https://api.github.com/repos/s/redis-demo/languages",
  },
];

const mockLanguagesData = { TypeScript: 50000, JavaScript: 20000 };

describe("fetchGithubStats", () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    globalThis.fetch = mockFetch;
  });

  it("returns aggregated stats from user, repos, and contributions", async () => {
    // Mock axios for user/repos/languages
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData }) // user
      .mockResolvedValueOnce({ data: mockRepoData }) // repos
      .mockResolvedValueOnce({ data: mockLanguagesData }) // repo 1 languages
      .mockResolvedValueOnce({ data: mockLanguagesData }); // repo 2 languages

    // Mock fetch for GitHub GraphQL
    mockFetch.mockResolvedValue(makeGraphQLResponse());

    const result = await fetchGithubStats("shailesh93602");

    expect(result.repositories).toBe(42);
    expect(result.followers).toBe(88);
    expect(result.stars).toBe(15); // 10 + 5
    expect(result.forks).toBe(3); // 2 + 1
    // Service fetches multiple year-periods so contributions accumulate
    expect(result.contributions).toBeGreaterThanOrEqual(100);
    expect(Array.isArray(result.languages)).toBe(true);
    expect(result.languages[0]).toHaveProperty("name");
    expect(result.languages[0]).toHaveProperty("percentage");
  });

  it("includes TypeScript in language percentages", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRepoData })
      .mockResolvedValueOnce({ data: mockLanguagesData })
      .mockResolvedValueOnce({ data: {} });

    mockFetch.mockResolvedValue(makeGraphQLResponse());

    const result = await fetchGithubStats("shailesh93602");

    const tsLang = result.languages.find(
      (l: { name: string }) => l.name === "TypeScript"
    );
    expect(tsLang).toBeDefined();
    expect(tsLang?.percentage).toBeGreaterThan(0);
  });

  it("handles language fetch errors gracefully (returns empty for that repo)", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRepoData })
      .mockRejectedValueOnce(new Error("403 Forbidden")) // repo 1 fails
      .mockResolvedValueOnce({ data: { JavaScript: 10000 } }); // repo 2 ok

    mockFetch.mockResolvedValue(makeGraphQLResponse());

    const result = await fetchGithubStats("shailesh93602");

    // Should still return stats, just missing the failed repo's languages
    expect(result.repositories).toBe(42);
    const jsLang = result.languages.find(
      (l: { name: string }) => l.name === "JavaScript"
    );
    expect(jsLang).toBeDefined();
  });

  it("returns streak data from contributions", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRepoData })
      .mockResolvedValueOnce({ data: mockLanguagesData })
      .mockResolvedValueOnce({ data: {} });

    mockFetch.mockResolvedValue(makeGraphQLResponse());

    const result = await fetchGithubStats("shailesh93602");

    expect(result.currentStreak).toBeDefined();
    expect(result.longestStreak).toBeDefined();
    expect(typeof result.currentStreak.count).toBe("number");
  });
});
