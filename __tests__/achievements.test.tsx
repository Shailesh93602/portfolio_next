/**
 * Tests for components/Achievements/index.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

import AchievementsSection from "@/components/Achievements";
import { achievements } from "@/constants";

describe("AchievementsSection", () => {
  it("renders the Achievements heading", () => {
    render(<AchievementsSection />);
    expect(
      screen.getByRole("heading", { name: /achievements/i })
    ).toBeInTheDocument();
  });

  it("renders 'GeeksforGeeks' text", () => {
    render(<AchievementsSection />);
    expect(screen.getByText(/geeksforgeeks/i)).toBeInTheDocument();
  });

  it("renders 'HackerRank' text", () => {
    render(<AchievementsSection />);
    expect(screen.getByText(/hackerrank/i)).toBeInTheDocument();
  });

  it("renders all achievement titles from the ACHIEVEMENTS constant", () => {
    render(<AchievementsSection />);
    achievements.forEach((achievement) => {
      expect(screen.getByText(achievement.title)).toBeInTheDocument();
    });
  });

  it("renders all achievement descriptions", () => {
    render(<AchievementsSection />);
    achievements.forEach((achievement) => {
      expect(screen.getByText(achievement.description)).toBeInTheDocument();
    });
  });

  it("renders 'View Profile' links for achievements with links", () => {
    render(<AchievementsSection />);
    const linkedAchievements = achievements.filter((a) => a.link);
    const viewProfileLinks = screen.getAllByText(/view profile/i);
    expect(viewProfileLinks.length).toBe(linkedAchievements.length);
  });

  it("renders the correct number of achievement cards", () => {
    const { container } = render(<AchievementsSection />);
    // Each achievement is in a Card — look for the card content wrappers
    const cards = container.querySelectorAll('[class*="CardContent"], .p-4');
    expect(cards.length).toBeGreaterThanOrEqual(achievements.length);
  });
});
