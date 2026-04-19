/**
 * Tests for components/SkillsSection/index.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.ComponentProps<"span">) => (
      <span {...props}>{children}</span>
    ),
  },
}));

import SkillsSection from "@/components/SkillsSection";

describe("SkillsSection", () => {
  it("renders the Skills heading", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("heading", { name: /skills/i })
    ).toBeInTheDocument();
  });

  it("renders all skill category headings", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Databases")).toBeInTheDocument();
    expect(screen.getByText("Tools & Others")).toBeInTheDocument();
  });

  it("renders frontend skill names", () => {
    render(<SkillsSection />);
    expect(screen.getByText("React.js")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
  });

  it("renders backend skill names", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
    expect(screen.getByText("Express.js")).toBeInTheDocument();
  });

  it("renders database skill names", () => {
    render(<SkillsSection />);
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("MongoDB")).toBeInTheDocument();
    expect(screen.getByText("Prisma")).toBeInTheDocument();
  });

  it("renders tools skill names", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Git")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
  });

  it("renders all 4 skill category cards", () => {
    const { container } = render(<SkillsSection />);
    // 4 categories × one heading each
    const categoryHeadings = container.querySelectorAll("h4");
    expect(categoryHeadings.length).toBe(4);
  });
});
