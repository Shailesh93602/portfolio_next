/**
 * Component tests for BlogCard and EducationSection.
 * framer-motion is mocked to avoid animation issues in jsdom.
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// Mock framer-motion — animations don't work in jsdom
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

// Mock next/image — strip Next.js-specific props (fill, priority) before passing to <img>
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

import { BlogCard } from "@/components/blog-card";
import { EducationSection } from "@/components/EducationSection";

// ─── BlogCard ─────────────────────────────────────────────────────────────────

describe("BlogCard", () => {
  const defaultProps = {
    slug: "test-post",
    title: "Test Blog Post",
    description: "A test description for the blog post.",
    image: "/Images/test.png",
    author: { name: "Shailesh Chaudhari", avatar: "/Images/shailesh.webp" },
    date: "2025-01-15",
    readTime: "5 min read",
    tags: ["Next.js", "TypeScript"],
  };

  it("renders the title", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Test Blog Post")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<BlogCard {...defaultProps} />);
    expect(
      screen.getByText("A test description for the blog post.")
    ).toBeInTheDocument();
  });

  it("renders all tags", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders author name", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("Shailesh Chaudhari")).toBeInTheDocument();
  });

  it("links to the correct blog post URL", () => {
    render(<BlogCard {...defaultProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/test-post");
  });

  it("renders read time", () => {
    render(<BlogCard {...defaultProps} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });
});

// ─── EducationSection ─────────────────────────────────────────────────────────

describe("EducationSection", () => {
  it("renders the Education heading", () => {
    render(<EducationSection />);
    expect(
      screen.getByRole("heading", { name: /education/i })
    ).toBeInTheDocument();
  });

  it("renders the degree name", () => {
    render(<EducationSection />);
    expect(screen.getByText(/Bachelor of Engineering/i)).toBeInTheDocument();
  });

  it("renders the institution name", () => {
    render(<EducationSection />);
    expect(
      screen.getByText(/Government Engineering College Bhavnagar/i)
    ).toBeInTheDocument();
  });

  it("renders the CGPA badge", () => {
    render(<EducationSection />);
    expect(screen.getByText(/7\.99/)).toBeInTheDocument();
  });

  it("renders the study period", () => {
    render(<EducationSection />);
    expect(screen.getByText(/2020/)).toBeInTheDocument();
    expect(screen.getByText(/2020[\s\S]*2024|2020 – 2024/)).toBeInTheDocument();
  });
});
