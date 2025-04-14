import { NextResponse } from "next/server";
import axios from "axios";

const username = "shaileshbhai";

interface SubmissionCount {
  difficulty: string;
  count: number;
}

interface LeetCodeStats {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  contributionPoints: number;
  reputation: number;
  submissionCalendar: Record<string, number>;
  currentStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  longestStreak: {
    count: number;
    startDate: string;
    endDate: string;
  };
  rating: number;
}

function calculateStreak(calendar: Record<string, number>): {
  count: number;
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentStreak = 0;
  let startDate = new Date();
  let endDate = new Date();

  // Convert calendar timestamps to dates and sort them
  const submissionDates = Object.keys(calendar)
    .map((timestamp) => new Date(parseInt(timestamp) * 1000))
    .sort((a, b) => b.getTime() - a.getTime());

  if (submissionDates.length === 0) {
    return {
      count: 0,
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };
  }

  const lastSubmission = submissionDates[0];
  const lastSubmissionDay = new Date(lastSubmission);
  lastSubmissionDay.setHours(0, 0, 0, 0);

  // If no submission today or yesterday, streak is 0
  if (
    (today.getTime() - lastSubmissionDay.getTime()) / (1000 * 60 * 60 * 24) >
    1
  ) {
    return {
      count: 0,
      startDate: today.toISOString(),
      endDate: today.toISOString(),
    };
  }

  endDate = lastSubmission;
  let currentDate = lastSubmission;
  currentStreak = 1;

  for (let i = 1; i < submissionDates.length; i++) {
    const prevDate = submissionDates[i];
    const dayDiff = Math.round(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      currentStreak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - currentStreak + 1);

  return {
    count: currentStreak,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

function calculateLongestStreak(calendar: Record<string, number>): {
  count: number;
  startDate: string;
  endDate: string;
} {
  const submissionDates = Object.keys(calendar)
    .map((timestamp) => new Date(parseInt(timestamp) * 1000))
    .sort((a, b) => a.getTime() - b.getTime());

  if (submissionDates.length === 0) {
    return {
      count: 0,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };
  }

  let longestStreak = 0;
  let currentStreak = 1;
  let startDate = submissionDates[0];
  let endDate = submissionDates[0];
  let longestStartDate = startDate;
  let longestEndDate = endDate;

  for (let i = 1; i < submissionDates.length; i++) {
    const dayDiff = Math.round(
      (submissionDates[i].getTime() - submissionDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      currentStreak++;
      endDate = submissionDates[i];

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStartDate = startDate;
        longestEndDate = endDate;
      }
    } else {
      currentStreak = 1;
      startDate = submissionDates[i];
      endDate = submissionDates[i];
    }
  }

  return {
    count: longestStreak,
    startDate: longestStartDate.toISOString(),
    endDate: longestEndDate.toISOString(),
  };
}

export async function GET() {
  try {
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
            totalSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
            reputation
            starRating
            userAvatar
          }
          userCalendar {
            submissionCalendar
          }
        }
      }
    `;

    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        variables: { username },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://leetcode.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    const data = response.data.data;
    if (!data || !data.matchedUser) {
      throw new Error("User not found or invalid response");
    }

    const submitStats = data.matchedUser.submitStats || {
      acSubmissionNum: [{ difficulty: "All", count: 0 }],
      totalSubmissionNum: [{ difficulty: "All", count: 0 }],
    };
    const profile = data.matchedUser.profile || {
      ranking: 0,
      reputation: 0,
      starRating: 0,
    };
    const calendar = JSON.parse(
      data.matchedUser.userCalendar?.submissionCalendar || "{}"
    );
    const contestData: {
      rating?: number;
    } = {};

    const currentStreak = calculateStreak(calendar);
    const longestStreak = calculateLongestStreak(calendar);

    const stats: LeetCodeStats = {
      totalSolved: submitStats.acSubmissionNum.find(
        (x: SubmissionCount) => x.difficulty === "All"
      ).count,
      totalQuestions: data.allQuestionsCount.find(
        (x: SubmissionCount) => x.difficulty === "All"
      ).count,
      easySolved: submitStats.acSubmissionNum.find(
        (x: SubmissionCount) => x.difficulty === "Easy"
      ).count,
      mediumSolved: submitStats.acSubmissionNum.find(
        (x: SubmissionCount) => x.difficulty === "Medium"
      ).count,
      hardSolved: submitStats.acSubmissionNum.find(
        (x: SubmissionCount) => x.difficulty === "Hard"
      ).count,
      acceptanceRate: Math.round(
        (submitStats.acSubmissionNum[0].count /
          submitStats.totalSubmissionNum[0].count) *
          100
      ),
      ranking: profile.ranking,
      contributionPoints: profile.reputation,
      reputation: profile.starRating,
      submissionCalendar: calendar,
      currentStreak,
      longestStreak,
      rating: contestData.rating || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching LeetCode statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode statistics" },
      { status: 500 }
    );
  }
}
