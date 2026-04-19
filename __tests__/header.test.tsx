/**
 * Tests for components/header.tsx and components/Showcase/KeyMetrics.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("framer-motion", () => ({
  motion: {
    header: ({ children, ...props }: React.ComponentProps<"header">) => (
      <header {...props}>{children}</header>
    ),
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
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

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Header } from "@/components/header";
import KeyMetrics from "@/components/Showcase/KeyMetrics";

describe("Header", () => {
  it("renders a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the SC logo link", () => {
    render(<Header />);
    expect(screen.getByText("SC")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("Home link points to /", () => {
    render(<Header />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("Blog link points to /blogs", () => {
    render(<Header />);
    const blogLink = screen.getByText("Blog").closest("a");
    expect(blogLink).toHaveAttribute("href", "/blogs");
  });
});

describe("KeyMetrics", () => {
  const mockMetrics = [
    {
      label: "PRs Merged",
      value: "1,900+",
      description: "Pull requests merged at ContextQA",
    },
    {
      label: "Projects",
      value: "10+",
      description: "Side projects and open source",
    },
    { label: "Stars", value: "50+", description: "GitHub stars across repos" },
  ];

  it("returns null when no metrics provided", () => {
    const { container } = render(<KeyMetrics />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all metric values", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(screen.getByText("1,900+")).toBeInTheDocument();
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("50+")).toBeInTheDocument();
  });

  it("renders all metric labels", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(screen.getByText("PRs Merged")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Stars")).toBeInTheDocument();
  });

  it("renders metric descriptions", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(
      screen.getByText(/Pull requests merged at ContextQA/)
    ).toBeInTheDocument();
  });

  it("renders the correct number of metric cards", () => {
    const { container } = render(<KeyMetrics metrics={mockMetrics} />);
    // Each metric is a div with class space-y-2
    const cards = container.querySelectorAll(".space-y-2");
    expect(cards.length).toBe(3);
  });
});
