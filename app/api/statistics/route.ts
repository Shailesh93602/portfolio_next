import { NextResponse } from "next/server";
import axios from "axios";
import { SOCIAL_LINKS } from "@/config/constants";
import { JSDOM } from "jsdom";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GithubEvent {
  created_at: string;
  type: string;
}

async function fetchGithubStats(username: string) {
  const headers = GITHUB_TOKEN
    ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
    : {};

  try {
    // Fetch user data
    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers,
      }),
    ]);

    // Calculate languages from repos
    const languages: { [key: string]: number } = {};
    let totalSize = 0;

    // Fetch languages for each repo in parallel
    const languagePromises = reposResponse.data.map(async (repo: any) => {
      try {
        const langResponse = await axios.get(repo.languages_url, { headers });
        return langResponse.data;
      } catch (error) {
        console.error(`Error fetching languages for repo ${repo.name}:`, error);
        return {};
      }
    });

    const languageResults = await Promise.all(languagePromises);

    languageResults.forEach((langData) => {
      Object.entries(langData).forEach(([lang, size]) => {
        languages[lang] = (languages[lang] || 0) + (size as number);
        totalSize += size as number;
      });
    });

    const languagePercentages = Object.entries(languages).map(
      ([name, size]) => ({
        name,
        percentage: Math.round((size / totalSize) * 100),
        color: getLanguageColor(name),
      })
    );

    // Fetch contribution data using GraphQL
    const contributionData = await getGitHubContributions(username);
    console.log(
      `Fetched GitHub contribution data with ${
        contributionData.contributionDays?.length || 0
      } days`
    );

    return {
      repositories: userResponse.data.public_repos,
      contributions: contributionData.totalContributions,
      stars: reposResponse.data.reduce(
        (acc: number, repo: any) => acc + repo.stargazers_count,
        0
      ),
      forks: reposResponse.data.reduce(
        (acc: number, repo: any) => acc + repo.forks_count,
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
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw error;
  }
}

const leetcodeQuery = `
  query getUserProfile($username: String!, $year: Int!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      userCalendar(year: $year) {
        streak
        totalActiveDays
        activeYears
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
  }
`;

// Helper function to get the date in user's local timezone (IST)
function getLocalDate(date = new Date()): string {
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  const istTime = new Date(utcTime + istOffset);
  return istTime.toISOString().split("T")[0];
}

// This function calculates the actual days between two dates
function daysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Add 1 because we want to include both start and end dates
  return diffDays + 1;
}

function calculateLeetCodeStreak(submissionCalendar: {
  [key: string]: number;
}): Streak {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return {
      count: 0,
      startDate: getLocalDate(),
      endDate: getLocalDate(),
    };
  }

  // Convert UNIX timestamps to dates in user's timezone and sort chronologically
  const submissionDates = Object.keys(submissionCalendar)
    .map((timestamp) => {
      const date = new Date(parseInt(timestamp) * 1000);
      return {
        timestamp: parseInt(timestamp),
        dateStr: getLocalDate(date),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp); // Sort in reverse chronological order

  // Group submissions by date to handle multiple submissions on the same day
  const submissionsByDate = submissionDates.reduce<Record<string, boolean>>(
    (acc, { dateStr }) => {
      acc[dateStr] = true;
      return acc;
    },
    {}
  );

  // Get array of dates with submissions (in reverse chronological order)
  const uniqueDates = Object.keys(submissionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (uniqueDates.length === 0) {
    return {
      count: 0,
      startDate: getLocalDate(),
      endDate: getLocalDate(),
    };
  }

  // Get today and yesterday in user's timezone
  const today = getLocalDate();
  const yesterday = getLocalDate(new Date(Date.now() - 86400000));

  // Calculate current streak
  let currentStreak = 0;
  let currentStreakStart = "";
  let currentStreakEnd = "";

  // Check if there's a submission today or yesterday to start the streak
  let lastActiveDate = "";
  let i = 0;

  // Find the most recent activity date (today or yesterday)
  if (submissionsByDate[today]) {
    lastActiveDate = today;
    currentStreak = 1;
    currentStreakStart = today;
    currentStreakEnd = today;
    i++;
  } else if (submissionsByDate[yesterday]) {
    lastActiveDate = yesterday;
    currentStreak = 1;
    currentStreakStart = yesterday;
    currentStreakEnd = yesterday;
    i++;
  } else {
    // No activity in the last two days, no current streak
    return {
      count: 0,
      startDate: getLocalDate(),
      endDate: getLocalDate(),
    };
  }

  // Continue checking for consecutive days
  while (i < uniqueDates.length) {
    const currentDate = uniqueDates[i];
    const expectedDate = getLocalDate(
      new Date(new Date(lastActiveDate).getTime() - 86400000)
    );

    if (currentDate === expectedDate) {
      // This is a consecutive previous day
      currentStreak++;
      currentStreakStart = currentDate;
      lastActiveDate = currentDate;
    } else {
      // Streak is broken
      break;
    }
    i++;
  }

  // Calculate actual streak duration
  const actualDays = daysBetween(currentStreakStart, currentStreakEnd);

  return {
    count: actualDays > 0 ? actualDays : currentStreak,
    startDate: currentStreakStart,
    endDate: currentStreakEnd,
  };
}

function formatLeetCodeData(data: any) {
  if (!data?.matchedUser) {
    return null;
  }

  // Parse submission calendar from the response
  const submissionCalendar = data.matchedUser.submissionCalendar
    ? JSON.parse(data.matchedUser.submissionCalendar)
    : {};

  // Calculate streaks using the parsed calendar
  const currentStreak = calculateLeetCodeStreak(submissionCalendar);
  const longestStreak = calculateLongestLeetCodeStreak(submissionCalendar);

  return {
    totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
    totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
    totalQuestions: data.allQuestionsCount[0].count,
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    totalEasy: data.allQuestionsCount[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    totalMedium: data.allQuestionsCount[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalHard: data.allQuestionsCount[3].count,
    ranking: data.matchedUser.profile.ranking,
    contributionPoint: data.matchedUser.contributions.points,
    reputation: data.matchedUser.profile.reputation,
    submissionCalendar,
    recentSubmissions: data.recentSubmissionList,
    currentStreak,
    longestStreak,
    activeYears: data.matchedUser.userCalendar?.activeYears || [],
    totalActiveDays: data.matchedUser.userCalendar?.totalActiveDays || 0,
    dccBadges: data.matchedUser.userCalendar?.dccBadges || [],
  };
}

async function fetchLeetCodeStats(username: string) {
  try {
    // Get data for all months from January 2022 until now
    const currentYear = new Date().getFullYear();

    // Start with 2022 to get more historical data
    const startYear = 2022;

    // Create an array of years to fetch data for
    const yearsToFetch = [];
    for (let year = startYear; year <= currentYear; year++) {
      yearsToFetch.push(year);
    }

    console.log(`Fetching LeetCode data for years: ${yearsToFetch.join(", ")}`);

    // Fetch data for each year in parallel
    const yearDataPromises = yearsToFetch.map(async (year) => {
      try {
        console.log(`Fetching LeetCode data for year ${year}...`);
        const response = await axios.post(
          "https://leetcode.com/graphql",
          {
            query: leetcodeQuery,
            variables: { username, year },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Referer: "https://leetcode.com",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data.errors) {
          console.error(
            `LeetCode API errors for year ${year}:`,
            response.data.errors
          );
          return null;
        }

        console.log(`Successfully fetched LeetCode data for year ${year}`);
        return response.data.data;
      } catch (error) {
        console.error(`Error fetching LeetCode data for year ${year}:`, error);
        return null;
      }
    });

    // Wait for all year data to be fetched
    const yearsData = await Promise.all(yearDataPromises);
    const validYearsData = yearsData.filter(Boolean);

    console.log(
      `Successfully fetched LeetCode data for ${validYearsData.length}/${yearsToFetch.length} years`
    );

    // Check if we have any valid data
    if (validYearsData.length === 0) {
      console.error("No valid LeetCode data found for any year");
      return null;
    }

    // Use the most recent year for basic stats
    const currentYearData = validYearsData[validYearsData.length - 1];

    // Merge submission calendars from all years
    let mergedSubmissionCalendar: Record<string, number> = {};
    let hasCalendarData = false;

    validYearsData.forEach((yearData) => {
      if (yearData?.matchedUser?.submissionCalendar) {
        hasCalendarData = true;
        try {
          const calendar = JSON.parse(yearData.matchedUser.submissionCalendar);
          console.log(
            `Year calendar has ${Object.keys(calendar).length} entries`
          );

          // Properly merge calendars by combining entries
          Object.entries(calendar).forEach(([timestamp, count]) => {
            mergedSubmissionCalendar[timestamp] =
              (mergedSubmissionCalendar[timestamp] || 0) + (count as number);
          });
        } catch (error) {
          console.error("Error parsing submission calendar:", error);
        }
      }
    });

    console.log(
      `Merged calendar has ${
        Object.keys(mergedSubmissionCalendar).length
      } entries`
    );

    // Try all possible approaches to fetch historical data
    // 1. If we don't have calendar data, try alternative approach
    if (
      !hasCalendarData ||
      Object.keys(mergedSubmissionCalendar).length < 366
    ) {
      console.log(
        "No calendar data found or incomplete data, attempting to fetch directly"
      );
      try {
        // Try to fetch calendar data directly using an alternative endpoint
        const calendarResponse = await axios.get(
          `https://leetcode.com/api/user_submission_calendar/${username}/`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
          }
        );

        if (calendarResponse.data) {
          try {
            const directCalendar = JSON.parse(calendarResponse.data);
            console.log(
              `Directly fetched calendar has ${
                Object.keys(directCalendar).length
              } entries`
            );

            // Merge with any existing data
            Object.entries(directCalendar).forEach(([timestamp, count]) => {
              mergedSubmissionCalendar[timestamp] =
                (mergedSubmissionCalendar[timestamp] || 0) + (count as number);
            });
          } catch (error) {
            console.error("Error parsing direct calendar data:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching direct calendar data:", error);
      }
    }

    // 2. Try to fetch profile page and extract submission data
    try {
      console.log("Attempting to fetch LeetCode profile page to extract data");
      const profileResponse = await axios.get(
        `https://leetcode.com/${username}/`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }
      );

      // Try to find the calendar data in the HTML response
      const calendarDataMatch = profileResponse.data.match(
        /submissionCalendar:(.*?),\n/
      );
      if (calendarDataMatch && calendarDataMatch[1]) {
        try {
          // Clean up the matched data to make it valid JSON
          const cleanedJsonStr = calendarDataMatch[1]
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":');

          const profileCalendar = JSON.parse(cleanedJsonStr);
          console.log(
            `Profile page calendar has ${
              Object.keys(profileCalendar).length
            } entries`
          );

          // Merge with existing data
          Object.entries(profileCalendar).forEach(([timestamp, count]) => {
            mergedSubmissionCalendar[timestamp] =
              (mergedSubmissionCalendar[timestamp] || 0) + (count as number);
          });
        } catch (error) {
          console.error("Error parsing profile page calendar data:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching LeetCode profile page:", error);
    }

    // 3. Try the universal API endpoint as a last resort
    try {
      const universalResponse = await axios.get(
        `https://leetcode.com/api/user_submission_calendar/${username}/`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }
      );

      if (universalResponse.data) {
        try {
          const universalCalendar = JSON.parse(universalResponse.data);
          console.log(
            `Universal API calendar has ${
              Object.keys(universalCalendar).length
            } entries`
          );

          // Merge with existing data
          Object.entries(universalCalendar).forEach(([timestamp, count]) => {
            mergedSubmissionCalendar[timestamp] =
              (mergedSubmissionCalendar[timestamp] || 0) + (count as number);
          });
        } catch (error) {
          console.error("Error parsing universal calendar data:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching universal calendar data:", error);
    }

    console.log(
      `Final merged calendar has ${
        Object.keys(mergedSubmissionCalendar).length
      } entries`
    );

    // Format the data using the most recent year's data
    const formattedData = formatLeetCodeData(currentYearData);
    if (!formattedData) {
      return null;
    }

    // Calculate streaks using the merged calendar
    const currentStreak = calculateLeetCodeStreak(
      mergedSubmissionCalendar || {}
    );

    // Calculate longest streak (now separate from current streak)
    const longestStreak = calculateLongestLeetCodeStreak(
      mergedSubmissionCalendar || {}
    );

    console.log(
      `LeetCode streaks: current=${currentStreak.count}, longest=${longestStreak.count}`
    );

    return {
      ...formattedData,
      submissionCalendar: mergedSubmissionCalendar,
      currentStreak,
      longestStreak,
    };
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return null;
  }
}

// New function to calculate longest streak separately
function calculateLongestLeetCodeStreak(submissionCalendar: {
  [key: string]: number;
}): Streak {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return {
      count: 0,
      startDate: getLocalDate(),
      endDate: getLocalDate(),
    };
  }

  // Convert UNIX timestamps to dates in user's timezone
  const submissionDates = Object.keys(submissionCalendar)
    .map((timestamp) => {
      const date = new Date(parseInt(timestamp) * 1000);
      return {
        timestamp: parseInt(timestamp),
        dateStr: getLocalDate(date),
      };
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  if (submissionDates.length === 0) {
    return {
      count: 0,
      startDate: getLocalDate(),
      endDate: getLocalDate(),
    };
  }

  // Group submissions by date to handle multiple submissions on the same day
  const submissionsByDate = submissionDates.reduce<Record<string, boolean>>(
    (acc, { dateStr }) => {
      acc[dateStr] = true;
      return acc;
    },
    {}
  );

  // Get array of dates with submissions
  const uniqueDates = Object.keys(submissionsByDate).sort();

  // Calculate longest streak
  let longestStreak = 1;
  let longestStreakStart = uniqueDates[0];
  let longestStreakEnd = uniqueDates[0];
  let currentStreak = 1;
  let currentStreakStart = uniqueDates[0];

  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const prevDate = new Date(uniqueDates[i - 1]);

    // Check if dates are consecutive
    const diffTime = currentDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStreakStart = currentStreakStart;
        longestStreakEnd = uniqueDates[i];
      }
    } else if (diffDays > 1) {
      // Streak broken
      currentStreak = 1;
      currentStreakStart = uniqueDates[i];
    }
  }

  // Calculate actual streak duration
  const actualDays = daysBetween(longestStreakStart, longestStreakEnd);

  return {
    count: actualDays > 0 ? actualDays : longestStreak,
    startDate: longestStreakStart,
    endDate: longestStreakEnd,
  };
}

async function fetchGeeksforGeeksStats(username: string) {
  try {
    const response = await axios.get(
      `https://auth.geeksforgeeks.org/user/${username}/practice/`
    );
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Extract data from the HTML
    const problemsSolved = parseInt(
      document.querySelector(".score_card_value")?.textContent || "0"
    );
    const codingScore = parseInt(
      document.querySelector(".score_card_value")?.nextElementSibling
        ?.textContent || "0"
    );

    const difficultyStats = {
      basic: parseInt(
        document.querySelector(".basic")?.textContent?.match(/\d+/)?.[0] || "0"
      ),
      easy: parseInt(
        document.querySelector(".easy")?.textContent?.match(/\d+/)?.[0] || "0"
      ),
      medium: parseInt(
        document.querySelector(".medium")?.textContent?.match(/\d+/)?.[0] || "0"
      ),
      hard: parseInt(
        document.querySelector(".hard")?.textContent?.match(/\d+/)?.[0] || "0"
      ),
    };

    // Calculate streaks (this might need adjustment based on actual HTML structure)
    const currentStreak = {
      count: parseInt(
        document
          .querySelector(".current_streak")
          ?.textContent?.match(/\d+/)?.[0] || "0"
      ),
      startDate: new Date(
        Date.now() -
          (parseInt(
            document
              .querySelector(".current_streak")
              ?.textContent?.match(/\d+/)?.[0] || "0"
          ) -
            1) *
            86400000
      )
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    };

    const longestStreak = {
      count: parseInt(
        document
          .querySelector(".longest_streak")
          ?.textContent?.match(/\d+/)?.[0] || "0"
      ),
      startDate: new Date(
        Date.now() -
          (parseInt(
            document
              .querySelector(".longest_streak")
              ?.textContent?.match(/\d+/)?.[0] || "0"
          ) -
            1) *
            86400000
      )
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    };

    return {
      problemsSolved,
      codingScore,
      problemsByDifficulty: difficultyStats,
      currentStreak,
      longestStreak,
    };
  } catch (error) {
    console.error("Error fetching GeeksforGeeks stats:", error);
    throw error;
  }
}

function getLanguageColor(language: string): string {
  const colors: { [key: string]: string } = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Python: "#3572A5",
    Java: "#b07219",
    PHP: "#4F5D95",
  };
  return colors[language] || "#6e7681";
}

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GitHubGraphQLResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: ContributionCalendar;
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        totalIssueContributions: number;
        totalRepositoryContributions: number;
      };
    };
  };
}

interface Streak {
  count: number;
  startDate: string;
  endDate: string;
}

interface GitHubStats {
  totalContributions: number;
  currentStreak: Streak;
  longestStreak: Streak;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalRepos: number;
  contributionDays: Array<{ date: string; contributionCount: number }>;
}

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  contributionPoint: number;
  reputation: number;
  currentStreak: Streak;
  longestStreak: Streak;
}

async function getGitHubContributions(username: string): Promise<GitHubStats> {
  // GitHub API has a 1-year limitation, so we need to make multiple requests if needed
  const now = new Date();
  const endDate = now.toISOString();

  // Start date set to January 1, 2024
  const startDate = new Date(2024, 0, 1).toISOString();

  // Check if time range exceeds 1 year
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

  let contributionData: {
    totalContributions: number;
    weeks: ContributionWeek[];
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalIssueContributions: number;
    totalRepositoryContributions: number;
  } = {
    totalContributions: 0,
    weeks: [],
    totalCommitContributions: 0,
    totalPullRequestContributions: 0,
    totalIssueContributions: 0,
    totalRepositoryContributions: 0,
  };

  try {
    // If range is more than 1 year, split into multiple requests
    if (endTime - startTime > oneYearInMs) {
      // Calculate how many periods we need to cover
      let currentStartDate = new Date(startDate);
      let currentEndDate: Date;

      while (currentStartDate.getTime() < now.getTime()) {
        // End date is either now or 1 year after start date, whichever is earlier
        currentEndDate = new Date(
          Math.min(
            currentStartDate.getTime() + oneYearInMs - 1000, // Subtract 1 second to avoid overlap
            now.getTime()
          )
        );

        console.log(
          `Fetching GitHub data from ${currentStartDate.toISOString()} to ${currentEndDate.toISOString()}`
        );

        const periodData = await fetchGitHubContributionPeriod(
          username,
          currentStartDate.toISOString(),
          currentEndDate.toISOString()
        );

        if (periodData) {
          // Merge the data
          contributionData.totalContributions += periodData.totalContributions;
          contributionData.weeks = [
            ...contributionData.weeks,
            ...periodData.weeks,
          ];
          contributionData.totalCommitContributions +=
            periodData.totalCommitContributions;
          contributionData.totalPullRequestContributions +=
            periodData.totalPullRequestContributions;
          contributionData.totalIssueContributions +=
            periodData.totalIssueContributions;
          contributionData.totalRepositoryContributions +=
            periodData.totalRepositoryContributions;
        }

        // Move start date forward
        currentStartDate = new Date(currentEndDate.getTime() + 1000); // Add 1 second to avoid overlap
      }
    } else {
      // If less than 1 year, just make a single request
      const singlePeriodData = await fetchGitHubContributionPeriod(
        username,
        startDate,
        endDate
      );
      if (singlePeriodData) {
        contributionData = singlePeriodData;
      }
    }

    // Process the contribution days for streaks
    // Flatten all contribution days
    const allDays = contributionData.weeks.flatMap(
      (week) => week.contributionDays
    );

    console.log(`Total days fetched from GitHub: ${allDays.length}`);

    // Sort days in chronological order
    const sortedDays = allDays.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Extract all contribution days for calendar visualization
    // Include all days, even those with zero contributions for a complete calendar
    const contributionDays = sortedDays.map((day) => ({
      date: day.date,
      contributionCount: day.contributionCount,
    }));

    console.log(`Processed contribution days: ${contributionDays.length}`);

    // Process days in reverse chronological order for current streak
    const reversedDays = [...sortedDays].reverse();
    const today = getLocalDate();
    const yesterday = getLocalDate(new Date(Date.now() - 86400000));

    // Group contributions by date (to handle timezone differences)
    const contributionsByDate: Record<string, number> = {};
    for (const day of sortedDays) {
      // Convert the date to local timezone (IST)
      const localDate = getLocalDate(new Date(day.date));
      contributionsByDate[localDate] =
        (contributionsByDate[localDate] || 0) + day.contributionCount;
    }

    // Get unique dates with non-zero contributions
    const datesWithContributions = Object.entries(contributionsByDate)
      .filter(([_, count]) => count > 0)
      .map(([date]) => date)
      .sort(); // Sort chronologically

    // Calculate current streak
    let currentStreak: Streak = { count: 0, startDate: "", endDate: "" };

    // Check if today or yesterday has contributions
    if (contributionsByDate[today] && contributionsByDate[today] > 0) {
      // Start streak from today
      currentStreak.count = 1;
      currentStreak.startDate = today;
      currentStreak.endDate = today;

      // Continue checking backward
      let checkDate = yesterday;
      while (
        contributionsByDate[checkDate] &&
        contributionsByDate[checkDate] > 0
      ) {
        currentStreak.count++;
        currentStreak.startDate = checkDate;
        // Move to previous day
        const prevDate = new Date(new Date(checkDate).getTime() - 86400000);
        checkDate = getLocalDate(prevDate);
      }
    } else if (
      contributionsByDate[yesterday] &&
      contributionsByDate[yesterday] > 0
    ) {
      // Start streak from yesterday
      currentStreak.count = 1;
      currentStreak.startDate = yesterday;
      currentStreak.endDate = yesterday;

      // Continue checking backward
      let checkDate = getLocalDate(
        new Date(new Date(yesterday).getTime() - 86400000)
      );
      while (
        contributionsByDate[checkDate] &&
        contributionsByDate[checkDate] > 0
      ) {
        currentStreak.count++;
        currentStreak.startDate = checkDate;
        // Move to previous day
        const prevDate = new Date(new Date(checkDate).getTime() - 86400000);
        checkDate = getLocalDate(prevDate);
      }
    }

    // Calculate longest streak
    let longestStreak: Streak = { count: 0, startDate: "", endDate: "" };
    if (datesWithContributions.length > 0) {
      let tempStreak: Streak = {
        count: 1,
        startDate: datesWithContributions[0],
        endDate: datesWithContributions[0],
      };

      for (let i = 1; i < datesWithContributions.length; i++) {
        const currentDate = new Date(datesWithContributions[i]);
        const prevDate = new Date(datesWithContributions[i - 1]);

        // Check if dates are consecutive
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          tempStreak.count++;
          tempStreak.endDate = datesWithContributions[i];

          // Update longest streak if this one is longer
          if (tempStreak.count > longestStreak.count) {
            longestStreak = { ...tempStreak };
          }
        } else {
          // Start a new streak
          tempStreak = {
            count: 1,
            startDate: datesWithContributions[i],
            endDate: datesWithContributions[i],
          };
        }
      }

      // Final check for longest streak
      if (tempStreak.count > longestStreak.count) {
        longestStreak = { ...tempStreak };
      }
    }

    // Calculate actual streak durations
    const currentStreakDays = daysBetween(
      currentStreak.startDate,
      currentStreak.endDate
    );
    const longestStreakDays = daysBetween(
      longestStreak.startDate,
      longestStreak.endDate
    );

    // Update streak counts with actual days
    if (currentStreak.count > 0) {
      currentStreak.count = currentStreakDays;
    }

    if (longestStreak.count > 0) {
      longestStreak.count = longestStreakDays;
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

// Helper function to check if two dates are consecutive
function isConsecutiveDay(date1: string, date2: string): boolean {
  const day1 = new Date(date1);
  const day2 = new Date(date2);
  const diffTime = Math.abs(day1.getTime() - day2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

// New helper function to fetch GitHub contributions for a specific period
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
    body: JSON.stringify({
      query,
      variables: {
        username,
        from,
        to,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch GitHub contributions: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // Check if user data exists
  if (!data.data || !data.data.user) {
    console.error("GitHub API returned null user data for period:", {
      from,
      to,
      data,
    });
    return null;
  }

  return {
    totalContributions:
      data.data.user.contributionsCollection.contributionCalendar
        .totalContributions,
    weeks: data.data.user.contributionsCollection.contributionCalendar.weeks,
    totalCommitContributions:
      data.data.user.contributionsCollection.totalCommitContributions,
    totalPullRequestContributions:
      data.data.user.contributionsCollection.totalPullRequestContributions,
    totalIssueContributions:
      data.data.user.contributionsCollection.totalIssueContributions,
    totalRepositoryContributions:
      data.data.user.contributionsCollection.totalRepositoryContributions,
  };
}

export async function GET() {
  try {
    const githubUsername = SOCIAL_LINKS.GITHUB.split("/").pop() || "";
    const leetcodeUsername = SOCIAL_LINKS.LEETCODE.split("/").pop() || "";
    const gfgUsername = SOCIAL_LINKS.GFG.split("/").pop() || "";

    console.log(
      `Fetching stats for GitHub: ${githubUsername}, LeetCode: ${leetcodeUsername}, GFG: ${gfgUsername}`
    );

    const [githubStats, leetcodeStats, gfgStats] = await Promise.all([
      fetchGithubStats(githubUsername),
      fetchLeetCodeStats(leetcodeUsername),
      fetchGeeksforGeeksStats(gfgUsername),
    ]);

    console.log(
      `Stats fetched - GitHub contributions: ${
        githubStats?.contributionDays?.length || 0
      }, LeetCode submissions: ${
        Object.keys(leetcodeStats?.submissionCalendar || {}).length || 0
      }`
    );

    return NextResponse.json({
      github: githubStats,
      leetcode: leetcodeStats || {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        ranking: 0,
        contributionPoint: 0,
        reputation: 0,
        currentStreak: { count: 0, startDate: "", endDate: "" },
        longestStreak: { count: 0, startDate: "", endDate: "" },
      },
      gfg: gfgStats,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
