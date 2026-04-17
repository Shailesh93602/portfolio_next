import axios from "axios";
import { Streak, getLocalDate, daysBetween } from "./github-service";

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const BROWSER_HEADERS = {
  "Content-Type": "application/json",
  Referer: "https://leetcode.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

const leetcodeQuery = `
  query getUserProfile($username: String!, $year: Int!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      contributions { points }
      profile { reputation ranking }
      submissionCalendar
      submitStats {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      userCalendar(year: $year) { streak totalActiveDays activeYears }
    }
    recentSubmissionList(username: $username) {
      title titleSlug timestamp statusDisplay lang __typename
    }
  }
`;

function calculateCurrentStreak(submissionCalendar: Record<string, number>): Streak {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return { count: 0, startDate: getLocalDate(), endDate: getLocalDate() };
  }

  const submissionDates = Object.keys(submissionCalendar)
    .map((ts) => ({ timestamp: parseInt(ts), dateStr: getLocalDate(new Date(parseInt(ts) * 1000)) }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const submissionsByDate = submissionDates.reduce<Record<string, boolean>>(
    (acc, { dateStr }) => { acc[dateStr] = true; return acc; },
    {}
  );

  const uniqueDates = Object.keys(submissionsByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (uniqueDates.length === 0) {
    return { count: 0, startDate: getLocalDate(), endDate: getLocalDate() };
  }

  const today = getLocalDate();
  const yesterday = getLocalDate(new Date(Date.now() - 86400000));

  let lastActiveDate = "";
  let currentStreak = 0;
  let streakStart = "";
  let streakEnd = "";
  let i = 0;

  if (submissionsByDate[today]) {
    lastActiveDate = today; currentStreak = 1; streakStart = today; streakEnd = today; i++;
  } else if (submissionsByDate[yesterday]) {
    lastActiveDate = yesterday; currentStreak = 1; streakStart = yesterday; streakEnd = yesterday; i++;
  } else {
    return { count: 0, startDate: getLocalDate(), endDate: getLocalDate() };
  }

  while (i < uniqueDates.length) {
    const expected = getLocalDate(new Date(new Date(lastActiveDate).getTime() - 86400000));
    if (uniqueDates[i] === expected) {
      currentStreak++;
      streakStart = uniqueDates[i];
      lastActiveDate = uniqueDates[i];
    } else {
      break;
    }
    i++;
  }

  const actual = daysBetween(streakStart, streakEnd);
  return { count: actual > 0 ? actual : currentStreak, startDate: streakStart, endDate: streakEnd };
}

function calculateLongestStreak(submissionCalendar: Record<string, number>): Streak {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return { count: 0, startDate: getLocalDate(), endDate: getLocalDate() };
  }

  const submissionDates = Object.keys(submissionCalendar)
    .map((ts) => ({ timestamp: parseInt(ts), dateStr: getLocalDate(new Date(parseInt(ts) * 1000)) }))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (submissionDates.length === 0) {
    return { count: 0, startDate: getLocalDate(), endDate: getLocalDate() };
  }

  const submissionsByDate = submissionDates.reduce<Record<string, boolean>>(
    (acc, { dateStr }) => { acc[dateStr] = true; return acc; },
    {}
  );
  const uniqueDates = Object.keys(submissionsByDate).sort();

  let longest = 1;
  let longestStart = uniqueDates[0];
  let longestEnd = uniqueDates[0];
  let current = 1;
  let currentStart = uniqueDates[0];

  for (let i = 1; i < uniqueDates.length; i++) {
    const diffDays = Math.round(
      (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i - 1]).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      current++;
      if (current > longest) {
        longest = current;
        longestStart = currentStart;
        longestEnd = uniqueDates[i];
      }
    } else {
      current = 1;
      currentStart = uniqueDates[i];
    }
  }

  const actual = daysBetween(longestStart, longestEnd);
  return { count: actual > 0 ? actual : longest, startDate: longestStart, endDate: longestEnd };
}

interface LeetCodeYearData {
  matchedUser: {
    submissionCalendar: string;
    userCalendar: {
      streak: number;
      totalActiveDays: number;
      activeYears: number[];
      dccBadges?: { name: string; level: number; timestamp: number }[];
    } | null;
    submitStats: {
      acSubmissionNum: { difficulty: string; count: number; submissions: number }[];
      totalSubmissionNum: { difficulty: string; count: number; submissions: number }[];
    };
    contributions: { points: number };
    profile: { reputation: number; ranking: number };
  } | null;
  allQuestionsCount: { difficulty: string; count: number }[];
  recentSubmissionList: {
    title: string; titleSlug: string; timestamp: number;
    statusDisplay: string; lang: string; __typename: string;
  }[];
}

function formatLeetCodeData(data: LeetCodeYearData) {
  if (!data?.matchedUser) return null;

  const submissionCalendar = data.matchedUser.submissionCalendar
    ? JSON.parse(data.matchedUser.submissionCalendar)
    : {};

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
    currentStreak: calculateCurrentStreak(submissionCalendar),
    longestStreak: calculateLongestStreak(submissionCalendar),
    activeYears: data.matchedUser.userCalendar?.activeYears ?? [],
    totalActiveDays: data.matchedUser.userCalendar?.totalActiveDays ?? 0,
    dccBadges: data.matchedUser.userCalendar?.dccBadges ?? [],
  };
}

export async function fetchLeetCodeStats(username: string) {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = 2022;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const yearsData = await Promise.all(
      years.map(async (year) => {
        try {
          const res = await axios.post(
            LEETCODE_GRAPHQL,
            { query: leetcodeQuery, variables: { username, year } },
            { headers: BROWSER_HEADERS, timeout: 10000 }
          );
          if (res.data.errors) {
            console.error(`LeetCode API errors for year ${year}:`, res.data.errors);
            return null;
          }
          return res.data.data as LeetCodeYearData;
        } catch (error) {
          console.error(`Error fetching LeetCode data for year ${year}:`, error);
          return null;
        }
      })
    );

    const validYearsData = yearsData.filter(Boolean) as LeetCodeYearData[];
    if (validYearsData.length === 0) {
      console.error("No valid LeetCode data found for any year");
      return null;
    }

    // Merge submission calendars from all years
    const mergedCalendar: Record<string, number> = {};
    let hasCalendarData = false;

    for (const yearData of validYearsData) {
      if (yearData?.matchedUser?.submissionCalendar) {
        hasCalendarData = true;
        try {
          const cal = JSON.parse(yearData.matchedUser.submissionCalendar);
          Object.entries(cal).forEach(([ts, count]) => {
            mergedCalendar[ts] = (mergedCalendar[ts] ?? 0) + (count as number);
          });
        } catch (error) {
          console.error("Error parsing submission calendar:", error);
        }
      }
    }

    // Fallback: try direct calendar endpoint if calendar is sparse
    if (!hasCalendarData || Object.keys(mergedCalendar).length < 366) {
      try {
        const res = await axios.get(
          `https://leetcode.com/api/user_submission_calendar/${username}/`,
          { headers: BROWSER_HEADERS }
        );
        if (res.data) {
          const directCal = JSON.parse(res.data);
          Object.entries(directCal).forEach(([ts, count]) => {
            mergedCalendar[ts] = (mergedCalendar[ts] ?? 0) + (count as number);
          });
        }
      } catch (error) {
        console.error("Error fetching direct calendar data:", error);
      }
    }

    const currentYearData = validYearsData[validYearsData.length - 1];
    const formattedData = formatLeetCodeData(currentYearData);
    if (!formattedData) return null;

    return {
      ...formattedData,
      submissionCalendar: mergedCalendar,
      currentStreak: calculateCurrentStreak(mergedCalendar),
      longestStreak: calculateLongestStreak(mergedCalendar),
    };
  } catch (error) {
    console.error("Error fetching LeetCode stats:", error);
    return null;
  }
}
