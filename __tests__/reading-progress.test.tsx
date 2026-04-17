import { render, screen, act } from "@testing-library/react";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";

// jsdom doesn't implement scrollHeight, so we mock document dimensions
function setDocumentHeight(scrollHeight: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
}

describe("ReadingProgressBar", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });
    setDocumentHeight(1600);
  });

  it("renders a progressbar with aria attributes", () => {
    render(<ReadingProgressBar />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toBeInTheDocument();
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-label", "Reading progress");
  });

  it("starts at 0% progress", () => {
    render(<ReadingProgressBar />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    );
  });

  it("updates progress on scroll", () => {
    render(<ReadingProgressBar />);
    // scrollY=400, docHeight=1600, innerHeight=800 → scrollable=800 → 50%
    act(() => {
      Object.defineProperty(window, "scrollY", {
        configurable: true,
        value: 400,
      });
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
  });
});
