import axios from "axios";
import {
  getLocalDate,
  daysBetween,
  fetchGithubStats,
  getGitHubContributions,
  mergeContributionDays,
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

/**
 * One window's worth of calendar data.
 *
 * `totalContributions` is DERIVED from the days rather than written beside
 * them. GitHub's own payload has that property, and the service now sums the
 * merged days instead of adding up each window's headline figure — a fixture
 * that hardcoded a total unrelated to its own days would let an assertion pass
 * against arithmetic the real API never produces.
 */
const FIXTURE_DAYS = [
  { contributionCount: 5, date: "2024-01-02" },
  { contributionCount: 3, date: "2024-01-03" },
];
const FIXTURE_TOTAL = FIXTURE_DAYS.reduce(
  (sum, day) => sum + day.contributionCount,
  0
);

const makeGraphQLResponse = (overrides = {}) => ({
  ok: true,
  json: async () => ({
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: FIXTURE_TOTAL,
            weeks: [{ contributionDays: FIXTURE_DAYS }],
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

    // The service fetches several year-windows since 2024 and every one of
    // them answers with this same fixture, so the DAYS are the same two dates
    // over and over: the total is what those distinct days sum to, counted
    // once. The commit/PR/issue totals are counted by instant, not by day, so
    // they legitimately accumulate per window.
    expect(result.totalContributions).toBe(FIXTURE_TOTAL);
    expect(result.contributionDays).toEqual(
      FIXTURE_DAYS.map((d) => ({
        date: d.date,
        contributionCount: d.contributionCount,
      }))
    );
    expect(result.totalCommits).toBeGreaterThanOrEqual(80);
    expect(result.totalPRs).toBeGreaterThanOrEqual(10);
    expect(result.totalIssues).toBeGreaterThanOrEqual(5);
    expect(result.totalRepos).toBeGreaterThanOrEqual(5);
  });

  /**
   * 🔴 THESE THREE USED TO ASSERT THE BUG.
   *
   * They read "returns empty defaults when fetch throws" — and that is exactly
   * what made the failure invisible. A resolved payload of zeros is
   * indistinguishable from a real zero, so `fetchGithubStats` succeeded,
   * `/api/statistics` took the happy path, and the committed snapshot was
   * overwritten with zeros. An expired GITHUB_TOKEN rendered
   * "Contributions: 0" with no error state anywhere on the page.
   *
   * A failed fetch must be a rejection so the caller can fall back. The
   * "genuinely zero" case is covered separately below, because the whole point
   * is that the two are no longer the same value.
   */
  it("rejects when GraphQL returns a null user — that is a failure, not a zero", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { user: null } }),
    });

    await expect(getGitHubContributions("nobody")).rejects.toThrow(
      /returned no user/i
    );
  });

  it("rejects when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(getGitHubContributions("shailesh93602")).rejects.toThrow(
      "Network error"
    );
  });

  it("rejects when the response is not ok (expired token)", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({}),
    });

    await expect(getGitHubContributions("shailesh93602")).rejects.toThrow(
      /401/
    );
  });

  it("resolves with zeros when the account genuinely has no contributions", async () => {
    // The other half of the distinction: GitHub answered, and the answer is
    // nothing. That must NOT look like a failure, or a real quiet year would
    // be served from a stale snapshot forever.
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 0,
                weeks: [
                  {
                    contributionDays: [
                      { contributionCount: 0, date: "2024-01-02" },
                    ],
                  },
                ],
              },
              totalCommitContributions: 0,
              totalPullRequestContributions: 0,
              totalIssueContributions: 0,
              totalRepositoryContributions: 0,
            },
          },
        },
      }),
    });

    const result = await getGitHubContributions("quiet-user");

    expect(result.totalContributions).toBe(0);
    expect(result.contributionDays).toEqual([
      { date: "2024-01-02", contributionCount: 0 },
    ]);
  });

  /**
   * 🔴 THE DOUBLE-COUNT.
   *
   * Every window returns whole weeks and the windows are cut by instant, so the
   * boundary day arrives twice. The shipped snapshot held 980 entries for 978
   * distinct dates and advertised a total that included one of them twice.
   *
   * Every window here answers with the SAME day, which is what an overlap
   * looks like: three calls, one date, one entry, counted once.
   */
  it("stores a date once even when consecutive windows both return it", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: 6,
                weeks: [
                  {
                    contributionDays: [
                      { contributionCount: 6, date: "2024-12-30" },
                    ],
                  },
                ],
              },
              totalCommitContributions: 1,
              totalPullRequestContributions: 0,
              totalIssueContributions: 0,
              totalRepositoryContributions: 0,
            },
          },
        },
      }),
    });

    const result = await getGitHubContributions("shailesh93602");

    // More than one window was fetched — otherwise this proves nothing.
    expect(mockFetch.mock.calls.length).toBeGreaterThan(1);
    const dates = result.contributionDays.map((d) => d.date);
    expect(dates).toEqual(Array.from(new Set(dates)));
    expect(result.contributionDays).toEqual([
      { date: "2024-12-30", contributionCount: 6 },
    ]);
    expect(result.totalContributions).toBe(6);
  });
});

describe("mergeContributionDays", () => {
  it("collapses a repeated date to a single entry", () => {
    expect(
      mergeContributionDays([
        { date: "2024-12-30", contributionCount: 6 },
        { date: "2024-12-30", contributionCount: 6 },
      ])
    ).toEqual([{ date: "2024-12-30", contributionCount: 6 }]);
  });

  it("keeps the largest count when one window clipped the day", () => {
    expect(
      mergeContributionDays([
        { date: "2025-01-01", contributionCount: 2 },
        { date: "2025-01-01", contributionCount: 7 },
      ])
    ).toEqual([{ date: "2025-01-01", contributionCount: 7 }]);
  });

  it("sorts ascending by date", () => {
    expect(
      mergeContributionDays([
        { date: "2025-03-02", contributionCount: 1 },
        { date: "2024-01-05", contributionCount: 3 },
        { date: "2024-12-30", contributionCount: 2 },
      ]).map((d) => d.date)
    ).toEqual(["2024-01-05", "2024-12-30", "2025-03-02"]);
  });

  it("preserves a genuine zero day rather than dropping it", () => {
    expect(
      mergeContributionDays([{ date: "2026-01-01", contributionCount: 0 }])
    ).toEqual([{ date: "2026-01-01", contributionCount: 0 }]);
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
    expect(result.contributions).toBe(FIXTURE_TOTAL);
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

  /**
   * The propagation path. `/api/statistics` can only fall back to the
   * committed snapshot if this REJECTS; while `getGitHubContributions`
   * swallowed its own errors, this resolved with zeroed contribution data and
   * the route overwrote a good snapshot with it.
   */
  it("rejects when the contributions fetch fails, so the caller can fall back", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockRepoData })
      .mockResolvedValueOnce({ data: mockLanguagesData })
      .mockResolvedValueOnce({ data: {} });

    // REST answers (an unauthenticated read still works); GraphQL does not.
    // That is the shape of a missing or expired GITHUB_TOKEN, and it used to
    // produce a page reading "Contributions: 0".
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({}),
    });

    await expect(fetchGithubStats("shailesh93602")).rejects.toThrow(/401/);
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
