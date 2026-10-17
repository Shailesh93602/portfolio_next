/**
 * Tests for components/SkillsSection/index.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";

const MOTION_PROPS = new Set([
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "viewport",
  "transition",
  "initial",
  "animate",
  "exit",
  "variants",
  "layout",
  "layoutId",
]);

// Mock framer-motion
jest.mock("framer-motion", () => {
  const stripMotion = (props: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(props).filter(([k]) => !MOTION_PROPS.has(k))
    );

  return {
    motion: {
      div: ({ children, ...props }: React.ComponentProps<"div">) => (
        <div {...stripMotion(props as Record<string, unknown>)}>{children}</div>
      ),
      span: ({ children, ...props }: React.ComponentProps<"span">) => (
        <span {...stripMotion(props as Record<string, unknown>)}>
          {children}
        </span>
      ),
    },
  };
});

import SkillsSection, { SKILLS } from "@/components/SkillsSection";
import resume from "@/resume/resume.json";

describe("SkillsSection", () => {
  it("renders the Skills heading", () => {
    render(<SkillsSection />);
    expect(
      screen.getByRole("heading", { name: /skills/i })
    ).toBeInTheDocument();
  });

  it("states exactly the resume's skills, category by category", () => {
    expect(
      SKILLS.map((c) => ({ label: c.category, items: c.items.join(", ") }))
    ).toEqual(resume.skills);
  });

  it("renders every category and every skill", () => {
    const { container } = render(<SkillsSection />);
    expect(
      Array.from(container.querySelectorAll("h4")).map((h) => h.textContent)
    ).toEqual(SKILLS.map((c) => c.category));
    for (const skill of SKILLS.flatMap((c) => c.items)) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it("claims none of the skills the resume does not", () => {
    render(<SkillsSection />);
    for (const extra of [
      "GraphQL",
      "MySQL",
      "Sequelize",
      "TypeORM",
      "Firebase",
      "Stripe",
      "OAuth",
      "AWS",
    ]) {
      expect(screen.queryByText(extra)).not.toBeInTheDocument();
    }
  });
});
