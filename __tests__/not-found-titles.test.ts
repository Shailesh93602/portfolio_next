jest.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter" }),
}));

import { metadata } from "@/app/layout";
import { generateMetadata } from "@/app/blog/[slug]/page";

const brandHits = (t: unknown) => (String(t).match(/Shailesh/g) ?? []).length;

describe("404 titles carry the brand once", () => {
  it("the root default title (used by app/not-found.tsx) names it once", () => {
    expect(brandHits(metadata.title)).toBe(1);
  });

  it("an unknown blog slug gets its own title, not the root default", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    } as Parameters<typeof generateMetadata>[0]);
    expect(String(meta.title)).toMatch(/Not Found/);
    expect(brandHits(meta.title)).toBe(1);
  });
});
