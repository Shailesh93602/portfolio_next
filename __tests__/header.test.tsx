/**
 * Tests for components/Showcase/KeyMetrics.tsx
 *
 * This file also tested `components/header.tsx` until 2026-09-20. That
 * component was never rendered: the site's header is inlined in
 * app/layout.tsx and renders components/navbar. The suite was green against
 * markup no visitor ever loaded — the same shape as a middleware test that
 * imports the module the framework never registers. Component and tests
 * deleted together.
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

import KeyMetrics from "@/components/Showcase/KeyMetrics";

describe("KeyMetrics", () => {
  const mockMetrics = [
    {
      label: "Test Suite",
      value: "247",
      description: "Passing Jest tests across the portfolio repo",
    },
    {
      label: "Projects",
      value: "9",
      description: "Side projects shipped and live",
    },
    {
      label: "Coverage",
      value: "70%+",
      description: "Line coverage across the portfolio repo",
    },
  ];

  it("returns null when no metrics provided", () => {
    const { container } = render(<KeyMetrics />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all metric values", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(screen.getByText("247")).toBeInTheDocument();
    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("70%+")).toBeInTheDocument();
  });

  it("renders all metric labels", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(screen.getByText("Test Suite")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Coverage")).toBeInTheDocument();
  });

  it("renders metric descriptions", () => {
    render(<KeyMetrics metrics={mockMetrics} />);
    expect(
      screen.getByText(/Passing Jest tests across the portfolio repo/)
    ).toBeInTheDocument();
  });

  it("renders the correct number of metric cards", () => {
    const { container } = render(<KeyMetrics metrics={mockMetrics} />);
    // Each metric is a div with class space-y-2
    const cards = container.querySelectorAll(".space-y-2");
    expect(cards.length).toBe(3);
  });
});
