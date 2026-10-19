import React from "react";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";

import sitemap from "@/app/sitemap";
import { generateMetadata } from "@/app/portfolio/[id]/page";
import StandardSidebar from "@/components/ProjectDetail/StandardSidebar";
import {
  META_DESCRIPTION_MAX,
  metaDescription,
  projects,
} from "@/constants/projects";
import { publishedPosts } from "@/lib/blog-data";

const VERIFICATION_FILE = "google5c16a36058a0e9e7.html";

describe("project meta descriptions", () => {
  it.each(projects.map((p) => [p.id, p] as const))(
    "%s fits in a search snippet",
    (_id, project) => {
      expect(metaDescription(project).length).toBeLessThanOrEqual(
        META_DESCRIPTION_MAX
      );
      expect(metaDescription(project).length).toBeGreaterThan(80);
    }
  );

  it("an seoDescription is only set where the card text is too long", () => {
    const needless = projects
      .filter((p) => p.seoDescription !== undefined)
      .filter((p) => p.description.length <= META_DESCRIPTION_MAX)
      .map((p) => p.id);
    expect(needless).toEqual([]);
  });

  it.each(projects.map((p) => [p.id, p] as const))(
    "/portfolio/%s publishes it as description, og and twitter",
    async (id, project) => {
      const meta = await generateMetadata({ params: Promise.resolve({ id }) });
      const expected = metaDescription(project);
      expect(meta.description).toBe(expected);
      expect(meta.openGraph?.description).toBe(expected);
      expect(meta.twitter?.description).toBe(expected);
    }
  );
});

describe("posts and project pages link to each other", () => {
  const withWriteUps = projects.filter((p) => p.writeUps?.length);

  it("Grounded and idempotency-kit list their write-ups", () => {
    const pairs = withWriteUps.flatMap((p) =>
      (p.writeUps ?? []).map((w) => `${p.id} -> ${w.slug}`)
    );
    expect(pairs).toEqual(
      expect.arrayContaining([
        "grounded -> production-rag-that-says-i-dont-know",
        "idempotency-kit -> idempotency-keys-retry-safe-payment-apis",
      ])
    );
  });

  it.each(withWriteUps.map((p) => [p.id, p] as const))(
    "%s: each write-up is a published post with that title, linking back",
    (id, project) => {
      for (const w of project.writeUps ?? []) {
        const post = publishedPosts.find((p) => p.slug === w.slug);
        expect(post?.title).toBe(w.title);
        expect(post?.content).toContain(`href="/portfolio/${id}"`);
      }
    }
  );

  it("write-ups are only set on layouts that render them", () => {
    // StandardSidebar renders them; the showcase layout does not.
    expect(withWriteUps.filter((p) => p.isShowcase).map((p) => p.id)).toEqual(
      []
    );
  });

  it("the project page renders a link to each write-up", () => {
    const grounded = projects.find((p) => p.id === "grounded");
    if (!grounded) throw new Error("no grounded project");
    render(<StandardSidebar project={grounded} />);
    const link = screen.getByRole("link", {
      name: grounded.writeUps?.[0].title,
    });
    expect(link.getAttribute("href")).toBe(
      "/blog/production-rag-that-says-i-dont-know"
    );
  });
});

describe("sitemap images", () => {
  it("lists no generated /api/og card, which no page displays", async () => {
    const images = (await sitemap()).flatMap((e) => e.images ?? []);
    expect(images.length).toBeGreaterThan(0);
    expect(images.filter((u) => new URL(u).pathname === "/api/og")).toEqual([]);
  });

  it("keeps the portrait on / and /about", async () => {
    const entries = await sitemap();
    for (const path of ["/", "/about"]) {
      const entry = entries.find((e) => new URL(e.url).pathname === path);
      expect(entry?.images).toEqual([
        expect.stringMatching(/\/Images\/shailesh\.webp$/),
      ]);
    }
  });
});

describe("Search Console verification file", () => {
  it(`public/${VERIFICATION_FILE} exists with Google's token`, () => {
    const path = join(process.cwd(), "public", VERIFICATION_FILE);
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, "utf8").trim()).toBe(
      `google-site-verification: ${VERIFICATION_FILE}`
    );
  });
});
