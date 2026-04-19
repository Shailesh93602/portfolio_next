/**
 * Tests for components/blog/blog-card.tsx (the blog listing card)
 */
import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, ...props }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} {...props} />
  ),
}));

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

import { BlogCard } from "@/components/blog/blog-card";

const mockPost = {
  slug: "redis-distributed-locks",
  title: "Redis Distributed Locks",
  description: "How to use Redlock for distributed locking in Node.js",
  image: "/images/redis.webp",
  date: "2024-03-15",
  readTime: "5 min read",
  tags: ["redis", "distributed-systems", "node"],
  author: { name: "Shailesh Chaudhari", avatar: "/images/shailesh.webp" },
};

describe("BlogCard (blog/blog-card.tsx)", () => {
  it("renders the post title", () => {
    render(<BlogCard post={mockPost} index={0} />);
    expect(screen.getByText("Redis Distributed Locks")).toBeInTheDocument();
  });

  it("renders the post description", () => {
    render(<BlogCard post={mockPost} index={0} />);
    expect(
      screen.getByText(/Redlock for distributed locking/)
    ).toBeInTheDocument();
  });

  it("renders the read time", () => {
    render(<BlogCard post={mockPost} index={0} />);
    expect(screen.getByText("5 min read")).toBeInTheDocument();
  });

  it("renders tags when provided", () => {
    render(<BlogCard post={mockPost} index={0} />);
    expect(screen.getByText("redis")).toBeInTheDocument();
    expect(screen.getByText("distributed-systems")).toBeInTheDocument();
  });

  it("links to the correct blog post page", () => {
    render(<BlogCard post={mockPost} index={0} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/redis-distributed-locks");
  });

  it("renders with accessible aria-label", () => {
    render(<BlogCard post={mockPost} index={0} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Redis Distributed Locks")
    );
  });

  it("renders post image with correct alt text", () => {
    render(<BlogCard post={mockPost} index={0} />);
    const img = screen.getByAltText("Redis Distributed Locks");
    expect(img).toBeInTheDocument();
  });

  it("uses fallback image when no image provided", () => {
    const postNoImage = { ...mockPost, image: undefined };
    render(<BlogCard post={postNoImage} index={0} />);
    const img = screen.getByAltText("Redis Distributed Locks");
    expect(img).toHaveAttribute(
      "src",
      expect.stringContaining("portfolio1.png")
    );
  });

  it("renders author name", () => {
    render(<BlogCard post={mockPost} index={0} />);
    expect(screen.getByText("Shailesh Chaudhari")).toBeInTheDocument();
  });

  it("renders without tags when tags array is empty", () => {
    const postNoTags = { ...mockPost, tags: [] };
    const { container } = render(<BlogCard post={postNoTags} index={0} />);
    // Should render without errors
    expect(container.querySelector("article")).toBeInTheDocument();
  });
});
