/**
 * Tests for components/HobbiesSection/index.tsx
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

import { HobbiesSection } from "@/components/HobbiesSection";

describe("HobbiesSection", () => {
  it("renders the Hobbies heading", () => {
    render(<HobbiesSection />);
    expect(
      screen.getByRole("heading", { name: /hobbies/i })
    ).toBeInTheDocument();
  });

  it("renders Chess hobby", () => {
    render(<HobbiesSection />);
    expect(screen.getByText("Chess")).toBeInTheDocument();
  });

  it("renders Football hobby", () => {
    render(<HobbiesSection />);
    expect(screen.getByText("Football")).toBeInTheDocument();
  });

  it("renders Puzzle Solving hobby", () => {
    render(<HobbiesSection />);
    expect(screen.getByText("Puzzle Solving")).toBeInTheDocument();
  });

  it("renders Learning hobby", () => {
    render(<HobbiesSection />);
    expect(screen.getByText("Learning")).toBeInTheDocument();
  });

  it("renders descriptions for all hobbies", () => {
    render(<HobbiesSection />);
    expect(screen.getByText(/strategic thinking/i)).toBeInTheDocument();
    expect(screen.getByText(/teamwork and physical/i)).toBeInTheDocument();
  });

  it("renders 4 hobby cards", () => {
    const { container } = render(<HobbiesSection />);
    const headings = container.querySelectorAll("h4");
    expect(headings.length).toBe(4);
  });
});
