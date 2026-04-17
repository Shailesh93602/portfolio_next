import axios from "axios";

// ── Shared types (used by both services) ──────────────────────────────────────

export interface Streak {
  count: number;
  startDate: string;
  endDate: string;
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubStats {
  totalContributions: number;
  currentStreak: Streak;
  longestStreak: Streak;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  contributionDays: Array<{ date: string; contributionCount: number }>;
}

// ── Shared helpers (also used by leetcode-service) ────────────────────────────

/** Return today's date string in IST (UTC+5:30). */
export function getLocalDate(date = new Date()): string {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const istTime = new Date(utcTime + istOffset);
  return istTime.toISOString().split("T")[0];
}

/** Inclusive day count between two ISO date strings. */
export function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

// ── GitHub-specific ───────────────────────────────────────────────────────────

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",
    PHP: "#4F5D95",
  };
  return colors[language] ?? "#6e7681";
}

async function fetchGitHubContributionPeriod(
  username: string,
  from: string,
  to: string
) {
  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalRepositoryContributions
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username, from, to } }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub contributions: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!data.data?.user) {
    console.error("GitHub API returned null user data for period:", { from, to, data });
    return null;
  }

  const collection = data.data.user.contributionsCollection;
  return {
    totalContributions: collection.contributionCalendar.totalContributions,
    weeks: collection.contributionCalendar.weeks as ContributionWeek[],
    totalCommitContributions: collection.totalCommitContributions,
    totalPullRequestContributions: collection.totalPullRequestContributions,
    totalIssueContributions: collection.totalIssueContributions,
    totalRepositoryContributions: collection.totalRepositoryContributions,
  };
}

export async function getGitHubContributions(
  username: string
): Promise<GitHubStats> {
  const now = new Date();
  const endDate = now.toISOString();
  const startDate = new Date(2024, 0, 1).toISOString();
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

  let contributionData = {
    totalContributions: 0,
    weeks: [] as ContributionWeek[],
    totalCommitContributions: 0,
    totalPullRequestContributions: 0,
    totalIssueContributions: 0,
    totalRepositoryContributions: 0,
  };

  try {
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    if (endTime - startTime > oneYearInMs) {
      let currentStartDate = new Date(startDate);
      while (currentStartDate.getTime() < now.getTime()) {
        const currentEndDate = new Date(
          Math.min(currentStartDate.getTime() + oneYearInMs - 1000, now.getTime())
        );
        const periodData = await fetchGitHubContributionPeriod(
          username,
          currentStartDate.toISOString(),
          currentEndDate.toISOString()
        );
        if (periodData) {
          contributionData.totalContributions += periodData.totalContributions;
          contributionData.weeks.push(...periodData.weeks);
          contributionData.totalCommitContributions += periodData.totalCommitContributions;
          contributionData.totalPullRequestContributions += periodData.totalPullRequestContributions;
          contributionData.totalIssueContributions += periodData.totalIssueContributions;
          contributionData.totalRepositoryContributions += periodData.totalRepositoryContributions;
        }
        currentStartDate = new Date(currentEndDate.getTime() + 1000);
      }
    } else {
      const singlePeriodData = await fetchGitHubContributionPeriod(
        username, startDate, endDate
      );
      if (singlePeriodData) {
        contributionData = singlePeriodData;
      }
    }

    const sortedDays = contributionData.weeks
      .flatMap((week) => week.contributionDays)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const contributionDays = sortedDays.map((day) => ({
      date: day.date,
      contributionCount: day.contributionCount,
    }));

    const today = getLocalDate();
    const yesterday = getLocalDate(new Date(Date.now() - 86400000));

    const contributionsByDate: Record<string, number> = {};
    for (const day of sortedDays) {
      const localDate = getLocalDate(new Date(day.date));
      contributionsByDate[localDate] =
        (contributionsByDate[localDate] ?? 0) + day.contributionCount;
    }

    const datesWithContributions = Object.entries(contributionsByDate)
      .filter(([, count]) => count > 0)
      .map(([date]) => date)
      .sort();

    // Current streak
    const currentStreak: Streak = { count: 0, startDate: "", endDate: "" };
    if (contributionsByDate[today] > 0) {
      currentStreak.count = 1;
      currentStreak.startDate = today;
      currentStreak.endDate = today;
      let checkDate = yesterday;
      while (contributionsByDate[checkDate] > 0) {
        currentStreak.count++;
        currentStreak.startDate = checkDate;
        checkDate = getLocalDate(new Date(new Date(checkDate).getTime() - 86400000));
      }
    } else if (contributionsByDate[yesterday] > 0) {
      currentStreak.count = 1;
      currentStreak.startDate = yesterday;
      currentStreak.endDate = yesterday;
      let checkDate = getLocalDate(new Date(new Date(yesterday).getTime() - 86400000));
      while (contributionsByDate[checkDate] > 0) {
        currentStreak.count++;
        currentStreak.startDate = checkDate;
        checkDate = getLocalDate(new Date(new Date(checkDate).getTime() - 86400000));
      }
    }

    // Longest streak
    let longestStreak: Streak = { count: 0, startDate: "", endDate: "" };
    if (datesWithContributions.length > 0) {
      let tempStreak: Streak = {
        count: 1,
        startDate: datesWithContributions[0],
        endDate: datesWithContributions[0],
      };
      for (let i = 1; i < datesWithContributions.length; i++) {
        const diffDays = Math.round(
          (new Date(datesWithContributions[i]).getTime() -
            new Date(datesWithContributions[i - 1]).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          tempStreak.count++;
          tempStreak.endDate = datesWithContributions[i];
          if (tempStreak.count > longestStreak.count) {
            longestStreak = { ...tempStreak };
          }
        } else {
          tempStreak = {
            count: 1,
            startDate: datesWithContributions[i],
            endDate: datesWithContributions[i],
          };
        }
      }
      if (tempStreak.count > longestStreak.count) {
        longestStreak = { ...tempStreak };
      }
    }

    if (currentStreak.count > 0) {
      currentStreak.count = daysBetween(currentStreak.startDate, currentStreak.endDate);
    }
    if (longestStreak.count > 0) {
      longestStreak.count = daysBetween(longestStreak.startDate, longestStreak.endDate);
    }

    return {
      totalContributions: contributionData.totalContributions,
      currentStreak,
      longestStreak,
      totalCommits: contributionData.totalCommitContributions,
      totalPRs: contributionData.totalPullRequestContributions,
      totalIssues: contributionData.totalIssueContributions,
      totalRepos: contributionData.totalRepositoryContributions,
      contributionDays,
    };
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return {
      totalContributions: 0,
      currentStreak: { count: 0, startDate: "", endDate: "" },
      longestStreak: { count: 0, startDate: "", endDate: "" },
      totalCommits: 0,
      totalPRs: 0,
      totalIssues: 0,
      totalRepos: 0,
      contributionDays: [],
    };
  }
}

export async function fetchGithubStats(username: string) {
  const headers = process.env.GITHUB_TOKEN
    ? {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      }
    : { Accept: "application/vnd.github.v3+json" };

  interface GithubRepo {
    name: string;
    languages_url: string;
    stargazers_count: number;
    forks_count: number;
  }

  const [userResponse, reposResponse] = await Promise.all([
    axios.get(`https://api.github.com/users/${username}`, { headers }),
    axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, { headers }),
  ]);

  const languages: Record<string, number> = {};
  let totalSize = 0;

  const languageResults = await Promise.all(
    reposResponse.data.map(async (repo: GithubRepo) => {
      try {
        const res = await axios.get(repo.languages_url, { headers });
        return res.data;
      } catch (error) {
        console.error(`Error fetching languages for repo ${repo.name}:`, error);
        return {};
      }
    })
  );

  languageResults.forEach((langData) => {
    Object.entries(langData).forEach(([lang, size]) => {
      languages[lang] = (languages[lang] ?? 0) + (size as number);
      totalSize += size as number;
    });
  });

  const languagePercentages = Object.entries(languages).map(([name, size]) => ({
    name,
    percentage: Math.round((size / totalSize) * 100),
    color: getLanguageColor(name),
  }));

  const contributionData = await getGitHubContributions(username);

  return {
    repositories: userResponse.data.public_repos,
    contributions: contributionData.totalContributions,
    stars: reposResponse.data.reduce(
      (acc: number, repo: GithubRepo) => acc + repo.stargazers_count,
      0
    ),
    forks: reposResponse.data.reduce(
      (acc: number, repo: GithubRepo) => acc + repo.forks_count,
      0
    ),
    followers: userResponse.data.followers,
    languages: languagePercentages,
    currentStreak: contributionData.currentStreak,
    longestStreak: contributionData.longestStreak,
    totalCommits: contributionData.totalCommits,
    totalPRs: contributionData.totalPRs,
    totalIssues: contributionData.totalIssues,
    totalRepos: contributionData.totalRepos,
    contributionDays: contributionData.contributionDays,
  };
}
