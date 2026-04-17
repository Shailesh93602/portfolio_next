/**
 * Tests for the pure calculation logic in leetcode-service.
 * fetchLeetCodeStats() is not tested here because it makes live HTTP calls.
 * The streak/calendar logic is isolated via the shared helpers.
 */
import { getLocalDate, daysBetween } from "@/lib/github-service";

// Re-test shared helpers in the context of LeetCode usage patterns
describe("LeetCode streak helpers (via github-service exports)", () => {
  describe("getLocalDate with LeetCode UNIX timestamps", () => {
    it("returns a YYYY-MM-DD string for any UNIX timestamp (seconds)", () => {
      const timestamps = [1704067200, 1704063600, 1609459200, 1672531200];
      timestamps.forEach((ts) => {
        expect(getLocalDate(new Date(ts * 1000))).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        );
      });
    });

    it("produces the same date for timestamps on the same calendar day in IST", () => {
      // Two timestamps both within 2024-01-01 IST: 05:30 and 18:00
      const morning = new Date("2024-01-01T00:00:00.000Z"); // 05:30 IST
      const afternoon = new Date("2024-01-01T12:30:00.000Z"); // 18:00 IST
      // Both should resolve to the same date string
      expect(getLocalDate(morning)).toBe(getLocalDate(afternoon));
    });
  });

  describe("daysBetween for streak calculation", () => {
    it("single-day streak counts as 1", () => {
      expect(daysBetween("2024-03-15", "2024-03-15")).toBe(1);
    });

    it("two consecutive days count as 2", () => {
      expect(daysBetween("2024-03-14", "2024-03-15")).toBe(2);
    });

    it("30-day streak is calculated correctly", () => {
      expect(daysBetween("2024-01-01", "2024-01-30")).toBe(30);
    });

    it("crossing month boundary works", () => {
      expect(daysBetween("2024-01-30", "2024-02-01")).toBe(3);
    });

    it("crossing year boundary works", () => {
      expect(daysBetween("2023-12-30", "2024-01-02")).toBe(4);
    });
  });
});
