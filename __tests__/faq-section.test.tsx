/**
 * Tests for components/FAQSection.tsx — confirms the visible Q&A renders
 * (which is what makes the FAQPage JSON-LD eligible for rich results in
 * Google), uses semantic <details>/<summary>, and exposes the heading
 * via aria-labelledby.
 */
import { render, screen } from "@testing-library/react";
import { FAQSection } from "@/components/FAQSection";

const sample = [
  { question: "What is X?", answer: "X is a thing built by Shailesh." },
  { question: "How does Y work?", answer: "Y works through Z and outputs W." },
];

describe("FAQSection", () => {
  it("renders the section heading", () => {
    render(<FAQSection items={sample} />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i }),
    ).toBeInTheDocument();
  });

  it("renders every question and every answer in the DOM", () => {
    render(<FAQSection items={sample} />);
    for (const item of sample) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
      expect(screen.getByText(item.answer)).toBeInTheDocument();
    }
  });

  it("uses native <details> for zero-JS expand", () => {
    const { container } = render(<FAQSection items={sample} />);
    const details = container.querySelectorAll("details");
    expect(details.length).toBe(sample.length);
    // First item open by default for AEO scrape-ability.
    expect(details[0].open).toBe(true);
  });

  it("respects aria-labelledby on the section", () => {
    const { container } = render(<FAQSection items={sample} />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("aria-labelledby")).toBe("faq-heading");
    expect(container.querySelector("#faq-heading")).toBeInTheDocument();
  });

  it("renders an optional description when supplied", () => {
    render(<FAQSection items={sample} description="Pithy lead-in." />);
    expect(screen.getByText("Pithy lead-in.")).toBeInTheDocument();
  });

  it("omits the description block when not supplied", () => {
    const { container } = render(<FAQSection items={sample} />);
    // No <p> direct child of the wrapper above the accordion.
    const ps = Array.from(container.querySelectorAll("p"));
    // Each answer is also a <p>, so there should be exactly N (no extra description).
    expect(ps.length).toBe(sample.length);
  });
});
