/**
 * Tests for components/navbar/index.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/",
}));

// Mock ThemeToggle to avoid theme-provider complexity
jest.mock("@/components/theme-toggle", () => ({
  ThemeToggle: () => <button aria-label="Toggle theme">Theme</button>,
}));

import Navbar from "@/components/navbar";

describe("Navbar", () => {
  it("renders a <nav> element with correct aria-label", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();
  });

  it("renders the About link", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link", { name: /about/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/about");
  });

  it("renders the Portfolio link", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link", { name: /portfolio/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/portfolio");
  });

  it("renders the Blogs link", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link", { name: /blogs/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/blogs");
  });

  it("renders the Contact link", () => {
    render(<Navbar />);
    const links = screen.getAllByRole("link", { name: /contact/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute("href", "/contact");
  });

  it("renders the mobile menu toggle button", () => {
    render(<Navbar />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toBeInTheDocument();
  });

  it("opens the mobile menu when the toggle button is clicked", async () => {
    render(<Navbar />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    await userEvent.click(btn);
    // After click, close-menu buttons should appear (the toggle + the one in mobile menu header)
    const closeButtons = screen.getAllByRole("button", { name: /close menu/i });
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the SC logo link pointing to /", () => {
    render(<Navbar />);
    const logoLink = screen.getByRole("link", {
      name: /shailesh chaudhari.*home/i,
    });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders Home, Statistics, and Hire Me links", () => {
    render(<Navbar />);
    // Both desktop and mobile — at least one occurrence each
    expect(
      screen.getAllByRole("link", { name: /^home$/i }).length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole("link", { name: /statistics/i }).length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByRole("link", { name: /hire me/i }).length
    ).toBeGreaterThanOrEqual(1);
  });
});
