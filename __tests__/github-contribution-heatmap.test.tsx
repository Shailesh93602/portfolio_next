import React from "react";
import { render, screen } from "@testing-library/react";
import { addDays, format } from "date-fns";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}));

import { GitHubContributionHeatmap } from "@/components/github-contribution-heatmap";

function days(from: string, n: number) {
  const start = new Date(`${from}T00:00:00`);
  return Array.from({ length: n }, (_, i) => ({
    date: format(addDays(start, i), "yyyy-MM-dd"),
    count: 0,
    level: 0 as const,
  }));
}

describe("GitHubContributionHeatmap month labels", () => {
  it("puts one slot per week column and labels the week each month starts in", () => {
    // 2024-01-01 .. 2024-03-31: 13 weeks of 7 days.
    render(
      <GitHubContributionHeatmap contributionData={days("2024-01-01", 91)} />
    );
    const slots = Array.from(screen.getByTestId("heatmap-months").children);
    expect(slots).toHaveLength(13);
    const labelled = slots
      .map((s, i) => [i, s.textContent] as const)
      .filter(([, t]) => t);
    // Week index 5 starts 2024-02-05, index 9 starts 2024-03-04.
    expect(labelled).toEqual([
      [0, "Jan"],
      [5, "Feb"],
      [9, "Mar"],
    ]);
  });

  it("repeats a month name across years instead of a fixed Jan–Dec row", () => {
    render(
      <GitHubContributionHeatmap contributionData={days("2024-12-02", 63)} />
    );
    const labels = Array.from(screen.getByTestId("heatmap-months").children)
      .map((s) => s.textContent)
      .filter(Boolean);
    expect(labels).toEqual(["Dec", "Jan"]);
  });
});
