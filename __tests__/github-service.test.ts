import { getLocalDate, daysBetween } from "@/lib/github-service";

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
