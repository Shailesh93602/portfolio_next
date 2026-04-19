/**
 * Tests for components/skills-showcase.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    section: ({ children, ...props }: React.ComponentProps<"section">) => (
      <section {...props}>{children}</section>
    ),
  },
}));

import { SkillsShowcase } from "@/components/skills-showcase";

describe("SkillsShowcase", () => {
  it("renders the Skills & Expertise heading", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText(/Skills & Expertise/)).toBeInTheDocument();
  });

  it("renders the subheading", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText(/technologies and tools/i)).toBeInTheDocument();
  });

  it("renders Frontend category", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("renders Backend category", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("Backend")).toBeInTheDocument();
  });

  it("renders DevOps category", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("DevOps")).toBeInTheDocument();
  });

  it("renders Tools category", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("Tools")).toBeInTheDocument();
  });

  it("renders individual skill names from Frontend", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders individual skill names from Backend", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  it("renders Docker in DevOps", () => {
    render(<SkillsShowcase />);
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });
});
