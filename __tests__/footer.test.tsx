/**
 * Tests for components/footer.tsx and components/github-languages.tsx
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

import { Footer } from "@/components/footer";
import { GitHubLanguages } from "@/components/github-languages";

describe("Footer", () => {
  it("renders a footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders GitHub link", () => {
    render(<Footer />);
    const githubLink = screen.getByText("GitHub").closest("a");
    expect(githubLink).toHaveAttribute(
      "href",
      expect.stringContaining("github")
    );
  });

  it("renders LinkedIn link", () => {
    render(<Footer />);
    const linkedinLink = screen.getByText("LinkedIn").closest("a");
    expect(linkedinLink).toHaveAttribute(
      "href",
      expect.stringContaining("linkedin")
    );
  });

  it("renders Twitter link", () => {
    render(<Footer />);
    const twitterLink = screen.getByText("Twitter").closest("a");
    expect(twitterLink).toHaveAttribute(
      "href",
      expect.stringContaining("twitter")
    );
  });

  it("renders Email link", () => {
    render(<Footer />);
    const emailLink = screen.getByText("Email").closest("a");
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:")
    );
  });

  it("renders 'Built by' attribution text", () => {
    render(<Footer />);
    expect(screen.getByText(/Built by/)).toBeInTheDocument();
  });

  it("renders 'Hosted on Vercel' attribution", () => {
    render(<Footer />);
    expect(screen.getByText("Vercel")).toBeInTheDocument();
  });
});

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
