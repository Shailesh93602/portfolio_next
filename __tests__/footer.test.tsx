/**
 * Tests for components/github-languages.tsx
 *
 * This file also tested `components/footer.tsx` until 2026-09-20 — seven
 * assertions against a component nothing rendered. The site's footer is
 * inlined in app/layout.tsx and carries only the "Built by / Hosted on"
 * line; the dead component carried GitHub, LinkedIn, Twitter and mailto
 * links, so the suite asserted "renders LinkedIn link" about a footer with
 * no social links at all. It also held a second spelling of the LinkedIn
 * slug that PR #56 went hunting for. Component and tests deleted together.
 */
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("framer-motion", () => ({
  motion: {
    footer: ({ children, ...props }: React.ComponentProps<"footer">) => (
      <footer {...props}>{children}</footer>
    ),
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import { GitHubLanguages } from "@/components/github-languages";

describe("GitHubLanguages", () => {
  const mockLanguages = [
    { name: "TypeScript", percentage: 60, color: "#3178c6" },
    { name: "JavaScript", percentage: 30, color: "#f1e05a" },
    { name: "CSS", percentage: 10, color: "#563d7c" },
  ];

  it("renders language names", () => {
    render(<GitHubLanguages languages={mockLanguages} />);
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/CSS/)).toBeInTheDocument();
  });

  it("renders percentage for each language", () => {
    render(<GitHubLanguages languages={mockLanguages} />);
    expect(screen.getByText(/60%/)).toBeInTheDocument();
    expect(screen.getByText(/30%/)).toBeInTheDocument();
    expect(screen.getByText(/10%/)).toBeInTheDocument();
  });

  it("filters out 0% languages", () => {
    const withZero = [
      ...mockLanguages,
      { name: "Rust", percentage: 0, color: "#dea584" },
    ];
    render(<GitHubLanguages languages={withZero} />);
    expect(screen.queryByText(/Rust/)).not.toBeInTheDocument();
  });

  it("renders an empty state with no languages", () => {
    const { container } = render(<GitHubLanguages languages={[]} />);
    // No language spans rendered
    expect(container.querySelectorAll(".h-3.w-3.rounded-full").length).toBe(0);
  });
});
