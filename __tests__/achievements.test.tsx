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

  // Title and description both name the platform now, so getAllByText.
  it("renders 'GeeksforGeeks' text", () => {
    render(<AchievementsSection />);
    expect(screen.getAllByText(/geeksforgeeks/i).length).toBeGreaterThan(0);
  });

  it("renders 'HackerRank' text", () => {
    render(<AchievementsSection />);
    expect(screen.getAllByText(/hackerrank/i).length).toBeGreaterThan(0);
  });

  it("renders no CodeChef card", () => {
    render(<AchievementsSection />);
    expect(screen.queryByText(/codechef/i)).toBeNull();
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
