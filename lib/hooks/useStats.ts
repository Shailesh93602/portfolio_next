import { useState, useEffect } from "react";
import axios from "axios";

interface GithubStats {
  repositories: number;
  contributions: number;
  stars: number;
  forks: number;
  followers: number;
  languages: Record<string, number>;
}

interface GeeksforGeeksStats {
  instituteRank: number;
  problemsSolved: number;
  codingScore: number;
  problemsByDifficulty: {
    basic: number;
    easy: number;
    medium: number;
    hard: number;
  };
}

interface LeetCodeStats {
  totalSolved: number;
  acceptanceRate: number;
  ranking: number;
}

interface Stats {
  github: GithubStats;
  leetcode: LeetCodeStats;
  gfg: GeeksforGeeksStats;
}

interface UseStatsReturn {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStats(): UseStatsReturn {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Stats>("/api/statistics");
      setStats(response.data);
    } catch (err) {
      setError("Failed to load statistics");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
