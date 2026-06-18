/**
 * Tests for app/services/page.tsx — the canonical services page.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import ServicesPage from "@/app/services/page";
import { metadata } from "@/app/services/metadata";

describe("ServicesPage", () => {
  it("renders the Services heading", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /^services$/i })
    ).toBeInTheDocument();
  });

  it("lists the core offerings", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { name: /full-stack web apps/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /real-time systems/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /ai integrations/i })
    ).toBeInTheDocument();
  });

  it("has a primary CTA linking to /contact", () => {
    render(<ServicesPage />);
    const cta = screen.getByRole("link", { name: /start a conversation/i });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("emits Service JSON-LD pointing at /services", () => {
    const { container } = render(<ServicesPage />);
    const ld = container.querySelector(
      'script[type="application/ld+json"]'
    )?.innerHTML;
    expect(ld).toBeTruthy();
    const data = JSON.parse(ld as string);
    expect(data["@type"]).toBe("Service");
    expect(data.url).toMatch(/\/services$/);
  });

  it("exposes complete metadata (title, description, canonical, OG)", () => {
    expect(metadata.title).toMatch(/services/i);
    expect(metadata.description).toBeTruthy();
    expect(metadata.alternates?.canonical).toMatch(/\/services$/);
    expect(metadata.openGraph?.url).toMatch(/\/services$/);
    const ogImages = metadata.openGraph?.images;
    expect(Array.isArray(ogImages) ? ogImages.length : 0).toBeGreaterThan(0);
  });
});
