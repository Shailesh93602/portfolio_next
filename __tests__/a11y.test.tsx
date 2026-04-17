/**
 * Accessibility tests using jest-axe.
 * Tests BlogCard, ProjectCard, and EducationSection for axe violations.
 */
import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

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

// Mock next/link to a plain anchor
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { BlogCard } from "@/components/blog-card";
import { ProjectCard } from "@/components/project-card";
import { EducationSection } from "@/components/EducationSection";

const blogCardProps = {
  slug: "test-a11y-post",
  title: "Accessibility Test Post",
  description: "A description for accessibility testing.",
  image: "/Images/test.png",
  author: { name: "Shailesh Chaudhari", avatar: "/Images/shailesh.webp" },
  date: "2025-01-15",
  readTime: "5 min read",
  tags: ["Next.js", "TypeScript"],
};

const projectCardProps = {
  title: "EduScale",
  description: "A real-time engineering learning platform.",
  image: "/Images/eduscale.png",
  tags: ["Next.js", "Redis"],
  github: "https://github.com/Shailesh93602/devscale",
  live: "https://eduscale.vercel.app",
};

describe("Accessibility (jest-axe)", () => {
  it("BlogCard has no axe violations", async () => {
    const { container } = render(<BlogCard {...blogCardProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("ProjectCard has no axe violations", async () => {
    const { container } = render(<ProjectCard {...projectCardProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("EducationSection has no axe violations", async () => {
    const { container } = render(<EducationSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
