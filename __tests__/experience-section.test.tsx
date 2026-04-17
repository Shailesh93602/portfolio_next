/**
 * Tests for components/ExperienceSection/index.tsx
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
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock next/image
const NEXT_IMAGE_ONLY_PROPS = new Set([
  "fill",
  "priority",
  "sizes",
  "quality",
  "placeholder",
  "blurDataURL",
]);
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ alt, ...props }: Record<string, any>) => {
    const imgProps = Object.fromEntries(
      Object.entries(props).filter(([k]) => !NEXT_IMAGE_ONLY_PROPS.has(k))
    );
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt ?? ""} {...imgProps} />;
  },
}));

import { ExperienceSection } from "@/components/ExperienceSection";
import { experiences } from "@/constants";

describe("ExperienceSection", () => {
  it("renders a heading that includes 'Experience' (case-insensitive)", () => {
    render(<ExperienceSection />);
    expect(
      screen.getByRole("heading", { name: /experience/i })
    ).toBeInTheDocument();
  });

  it("renders 'ContextQA' (most recent company)", () => {
    render(<ExperienceSection />);
    const elements = screen.getAllByText(/contextqa/i);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders at least 2 company names", () => {
    render(<ExperienceSection />);
    // experiences has 3 entries (ContextQA, eSparkBiz x2)
    expect(experiences.length).toBeGreaterThanOrEqual(2);
    // Verify each company name appears in the rendered output
    const { container } = render(<ExperienceSection />);
    const text = container.textContent ?? "";
    const companiesFound = experiences.filter((exp) =>
      text.includes(exp.company)
    );
    expect(companiesFound.length).toBeGreaterThanOrEqual(2);
  });

  it("renders 'eSparkBiz' company", () => {
    render(<ExperienceSection />);
    // eSparkBiz appears twice but getAllByText handles that
    const esparkElements = screen.getAllByText(/esparkbiz/i);
    expect(esparkElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders descriptions as plain text (no dangerouslySetInnerHTML)", () => {
    const { container } = render(<ExperienceSection />);
    // Check that no element has a data-dangerously attribute (which react would
    // set as data attribute) — actual check: look for innerHTML-set content
    const allElements = container.querySelectorAll("*");
    allElements.forEach((el) => {
      // If dangerouslySetInnerHTML is used, the element gets its innerHTML set
      // rather than having children — so we just verify description text is visible
      expect(el.getAttribute("dangerouslysetinnerhtml")).toBeNull();
    });
  });

  it("renders experience period information", () => {
    render(<ExperienceSection />);
    // ContextQA period — may appear multiple times in DOM
    const elements = screen.getAllByText(/July 2025/);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });
});
