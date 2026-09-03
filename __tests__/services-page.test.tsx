/**
 * Tests for app/services/page.tsx — the "What I work on" page.
 *
 * This route used to be a freelance landing page (project-intake CTA, a
 * "reply within 48 hours" promise). It is now a neutral description of the
 * work. These tests pin the neutral shape so the intake copy cannot creep back.
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import ServicesPage from "@/app/services/page";
import { metadata } from "@/app/services/metadata";

describe("ServicesPage (What I work on)", () => {
  it("renders the neutral heading, not 'Services'", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /^what i work on$/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: /^services$/i })
    ).not.toBeInTheDocument();
  });

  it("lists the core areas", () => {
    render(<ServicesPage />);
    expect(
      screen.getByRole("heading", { name: /backend systems in typescript/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /real-time systems/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /applied ai inside products/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /webhooks and idempotency/i })
    ).toBeInTheDocument();
  });

  it("offers a plain contact link and no project-intake CTA", () => {
    const { container } = render(<ServicesPage />);
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute(
      "href",
      "/contact"
    );
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/start a conversation/i);
    expect(text).not.toMatch(/one-line description/i);
    expect(text).not.toMatch(/reply time/i);
    expect(text).not.toMatch(/48 hours/i);
    expect(text).not.toMatch(/project inquiry/i);
  });

  it("does not repeat the 'share working code early' sentence", () => {
    const { container } = render(<ServicesPage />);
    const text = container.textContent ?? "";
    const hits = text.match(/share working code early/gi) ?? [];
    expect(hits).toHaveLength(1);
  });

  it("emits no commercial Service JSON-LD", () => {
    const { container } = render(<ServicesPage />);
    expect(
      container.querySelector('script[type="application/ld+json"]')
    ).toBeNull();
  });

  it("exposes complete metadata (title, description, canonical, OG)", () => {
    expect(metadata.title).toMatch(/what i work on/i);
    expect(metadata.description).toBeTruthy();
    expect(String(metadata.description)).not.toMatch(/for clients/i);
    expect(metadata.alternates?.canonical).toMatch(/\/services$/);
    expect(metadata.openGraph?.url).toMatch(/\/services$/);
    const ogImages = metadata.openGraph?.images;
    expect(Array.isArray(ogImages) ? ogImages.length : 0).toBeGreaterThan(0);
  });
});
