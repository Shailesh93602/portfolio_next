/**
 * Tests for components/blog/blog-filters.tsx
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogFilters } from "@/components/blog/blog-filters";

const defaultProps = {
  searchQuery: "",
  selectedTag: "",
  tags: ["Next.js", "TypeScript", "Redis"],
  onSearchChange: jest.fn(),
  onTagChange: jest.fn(),
  onClearFilters: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("BlogFilters", () => {
  it("renders a search input", () => {
    render(<BlogFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText(/search posts/i)).toBeInTheDocument();
  });

  it("renders tag badges for each tag in the tags prop", () => {
    render(<BlogFilters {...defaultProps} />);
    // Each tag appears in both the badge list and the popular section
    expect(screen.getAllByText("Next.js").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Redis").length).toBeGreaterThanOrEqual(1);
  });

  it("fires onSearchChange when user types in the search input", async () => {
    render(<BlogFilters {...defaultProps} />);
    const input = screen.getByPlaceholderText(/search posts/i);
    await userEvent.type(input, "redis");
    expect(defaultProps.onSearchChange).toHaveBeenCalled();
    // The last call should contain the typed value (or part of it)
    const calls = defaultProps.onSearchChange.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
  });

  it("fires onTagChange with the tag string when a tag badge is clicked", async () => {
    render(<BlogFilters {...defaultProps} />);
    // Click the first occurrence of "Next.js"
    const tagBadge = screen.getAllByText("Next.js")[0];
    await userEvent.click(tagBadge);
    expect(defaultProps.onTagChange).toHaveBeenCalledWith("Next.js");
  });

  it("does not show the clear button when no filters are active", () => {
    render(<BlogFilters {...defaultProps} />);
    expect(screen.queryByText(/clear/i)).toBeNull();
  });

  it("shows the clear button when searchQuery is set", () => {
    render(<BlogFilters {...defaultProps} searchQuery="redis" />);
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  it("shows the clear button when selectedTag is set", () => {
    render(<BlogFilters {...defaultProps} selectedTag="Next.js" />);
    expect(screen.getByText(/clear/i)).toBeInTheDocument();
  });

  it("fires onClearFilters when the clear button is clicked", async () => {
    render(<BlogFilters {...defaultProps} searchQuery="redis" />);
    await userEvent.click(screen.getByText(/clear/i));
    expect(defaultProps.onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("renders the All Tags badge", () => {
    render(<BlogFilters {...defaultProps} />);
    expect(screen.getByText("All Tags")).toBeInTheDocument();
  });

  it("fires onTagChange with empty string when All Tags is clicked", async () => {
    render(<BlogFilters {...defaultProps} selectedTag="Redis" />);
    await userEvent.click(screen.getByText("All Tags"));
    expect(defaultProps.onTagChange).toHaveBeenCalledWith("");
  });
});
