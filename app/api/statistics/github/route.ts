import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const username = "Shailesh93602";

export async function GET() {
  try {
    const [user, repos, contributions] = await Promise.all([
      octokit.rest.users.getByUsername({ username }),
      octokit.rest.repos.listForUser({ username, per_page: 100 }),
      fetchContributions(),
    ]);

    const totalStars = repos.data.reduce(
      (acc, repo) => acc + (repo.stargazers_count ?? 0),
      0
    );
    const totalForks = repos.data.reduce(
      (acc, repo) => acc + (repo.forks_count ?? 0),
      0
    );

    // Get pull requests
    const pullRequests = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:pr`,
    });

    // Get languages used
    const languages = new Set();
    await Promise.all(
      repos.data.map(async (repo) => {
        const repoLanguages = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        Object.keys(repoLanguages.data).forEach((lang) => languages.add(lang));
      })
    );

    return NextResponse.json({
      totalRepos: repos.data.length,
      totalStars,
      totalForks,
      pullRequests: pullRequests.data.total_count,
      contributions: {
        totalContributions: contributions.totalContributions,
        contributionsByDay: contributions.contributionsByDay,
        streakData: contributions.streakData,
      },
      languages: Array.from(languages),
      profileViews: user.data.followers,
    });
  } catch (error) {
    console.error("Error fetching GitHub statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub statistics" },
      { status: 500 }
    );
  }
}

async function fetchContributions() {
  try {
    const query = `
      query ($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
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
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();
    const calendar: {
      weeks: {
        contributionDays: {
          contributionCount: number;
          date: string;
        }[];
      }[];
      totalContributions: number; // Add this line to get total contributions for the streak
    } = data.data.user.contributionsCollection.contributionCalendar;
    const contributionDays = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        count: day.contributionCount,
        date: new Date(day.date),
      }))
    );

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentCount = 0;
    let totalContributionDays = 0;

    for (let i = contributionDays.length - 1; i >= 0; i--) {
      if (contributionDays[i].count > 0) {
        currentCount++;
        totalContributionDays++;
        if (i === contributionDays.length - 1) {
          currentStreak = currentCount;
        }
      } else {
        if (currentCount > longestStreak) {
          longestStreak = currentCount;
        }
        currentCount = 0;
      }
    }

    if (currentCount > longestStreak) {
      longestStreak = currentCount;
    }

    return {
      totalContributions: calendar.totalContributions,
      contributionsByDay: contributionDays.map((day) => day.count),
      streakData: {
        currentStreak,
        longestStreak,
        totalContributionDays,
      },
    };
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return {
      totalContributions: 0,
      contributionsByDay: Array(365).fill(0),
      streakData: {
        currentStreak: 0,
        longestStreak: 0,
        totalContributionDays: 0,
      },
    };
  }
}
