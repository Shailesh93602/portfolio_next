import { readFileSync } from "node:fs";
import { join } from "node:path";

import robots from "@/app/robots";
import { metadata as homeMetadata, HOME_DESCRIPTION } from "@/app/metadata";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { homeFaq } from "@/lib/faq-data";
import { PROFILE } from "@/lib/profile";
import {
  personRef,
  personSchema,
  profilePageSchema,
  websiteSchema,
} from "@/lib/structured-data";
import { generateMetadata as postMetadata } from "@/app/blog/[slug]/page";
import { metadata as blogsMetadata } from "@/app/blogs/metadata";
import { publishedPosts } from "@/lib/blog-data";
import routeModified from "@/lib/route-modified.json";

// What a search for the owner's name is decided on. None of it breaks a page
// when it goes missing; e2e/meta-and-schema.spec.ts checks the built site.
const NAME = "Shailesh Chaudhari";
// Literal on purpose: derived from PROFILE, a deleted variant deletes its test.
const VARIANTS = ["Shailesh Chaudhary", "Shaileshbhai Chaudhari"];

describe("the Person entity", () => {
  it("is named, identified, and carries every spelling", () => {
    expect(personSchema.name).toBe(NAME);
    expect(personSchema["@id"]).toBe(`${SITE_URL}/#person`);
    expect(personSchema.url).toBe(SITE_URL);
    for (const v of VARIANTS) expect(personSchema.alternateName).toContain(v);
    expect(personSchema.alternateName).toContain(PROFILE.name.handle);
  });

  it("links the profiles that prove the entity is one person", () => {
    const same = personSchema.sameAs.map((u) => u.toLowerCase());
    expect(same).toContain("https://github.com/shailesh93602");
    expect(same.some((u) => u.includes("linkedin.com/in/"))).toBe(true);
  });

  it("does not announce a job search or a salary", () => {
    const json = JSON.stringify(personSchema);
    expect(json).not.toMatch(/"seeks"|"estimatedSalary"/);
  });

  it("declares the portrait at its real pixel size", () => {
    const buf = readFileSync(
      join(process.cwd(), "public/Images/shailesh.webp")
    );
    const chunk = buf.toString("ascii", 12, 16);
    let w: number, h: number;
    if (chunk === "VP8X") {
      w = 1 + buf.readUIntLE(24, 3);
      h = 1 + buf.readUIntLE(27, 3);
    } else if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      w = 1 + (b & 0x3fff);
      h = 1 + ((b >> 14) & 0x3fff);
    } else {
      w = buf.readUInt16LE(26) & 0x3fff;
      h = buf.readUInt16LE(28) & 0x3fff;
    }
    expect([personSchema.image.width, personSchema.image.height]).toEqual([
      w,
      h,
    ]);
  });
});

describe("the WebSite entity and site name", () => {
  it("names the site after the person, consistently", () => {
    expect(websiteSchema.name).toBe(NAME);
    expect(META_DEFAULTS.siteName).toBe(NAME);
    expect(homeMetadata.openGraph?.siteName).toBe(NAME);
  });

  it("carries no SearchAction (retired by Google; its ?search= never worked)", () => {
    expect(websiteSchema).not.toHaveProperty("potentialAction");
  });
});

describe("/about ProfilePage", () => {
  it("has a mainEntity with a name, merged with the site-wide Person", () => {
    const main = profilePageSchema.mainEntity;
    expect(main.name).toBe(NAME);
    expect(main["@id"]).toBe(personSchema["@id"]);
  });

  it("carries dateModified (Google-recommended), the same date the sitemap uses", () => {
    expect(profilePageSchema.dateModified).toBe(routeModified["/about"]);
    expect(profilePageSchema.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("schema.org types Google and validators check", () => {
  it("nationality is a Country, not Text", () => {
    expect(personSchema.nationality).toEqual({
      "@type": "Country",
      name: "India",
    });
  });

  it("the article author reference carries name and url (Google's author.name/author.url)", () => {
    expect(personRef["@id"]).toBe(personSchema["@id"]);
    expect(personRef["@type"]).toBe("Person");
    expect(personRef.name).toBe(NAME);
    // The page with the ProfilePage markup, as Google's author guidance asks.
    expect(personRef.url).toBe(profilePageSchema.url);
  });
});

describe("blog descriptions", () => {
  it("a post's meta description is its own summary, with no boilerplate suffix", async () => {
    for (const post of publishedPosts) {
      const m = await postMetadata({
        params: Promise.resolve({ slug: post.slug }),
      });
      expect(m.description).toBe(post.description);
    }
  });

  it("/blogs does not advertise topics only the archived (noindexed) posts cover", () => {
    const d = String(blogsMetadata.description);
    for (const stale of ["Stripe", "DSA", "NestJS", "authentication"])
      expect(d).not.toContain(stale);
    expect(d.length).toBeLessThanOrEqual(160);
  });
});

describe("home page head", () => {
  it("title and description lead with the name", () => {
    expect(String(homeMetadata.title)).toContain(NAME);
    expect(HOME_DESCRIPTION.startsWith(NAME)).toBe(true);
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(homeMetadata.description).toBe(HOME_DESCRIPTION);
  });

  it("canonical is the site root", () => {
    expect(homeMetadata.alternates?.canonical).toBe(`${SITE_URL}/`);
  });
});

describe("every spelling the markup claims is also on the page and in llms.txt", () => {
  it("the 'Who is' FAQ answer (rendered on the home page) names each variant", () => {
    const who = homeFaq.find((q) => q.question === `Who is ${NAME}?`);
    for (const v of VARIANTS) expect(who?.answer).toContain(v);
  });

  it.each(["llms.txt", "llms-full.txt"])("%s names each variant", (file) => {
    const text = readFileSync(join(process.cwd(), "public", file), "utf8");
    for (const v of VARIANTS) expect(text).toContain(v);
  });

  it("llms.txt follows the spec's shape: one H1, then a blockquote summary", () => {
    const text = readFileSync(join(process.cwd(), "public/llms.txt"), "utf8");
    const lines = text.split("\n").filter((l) => l.trim() !== "");
    expect(lines[0]).toMatch(/^# \S/);
    expect(lines[1]).toMatch(/^> \S/);
    expect(text.match(/^# /gm)).toHaveLength(1);
  });
});

describe("robots.txt lets the crawlers that send name searches in", () => {
  type Rule = { userAgent?: string | string[]; disallow?: string | string[] };
  const rules = robots().rules as Rule[];
  const list = (v: string | string[] | undefined) =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  // Winner-take-all: a bot obeys the group that names it, else `*`.
  const groupFor = (bot: string) =>
    rules.find((r) =>
      list(r.userAgent).some((ua) => ua.toLowerCase() === bot.toLowerCase())
    ) ?? rules.find((r) => list(r.userAgent).includes("*"));

  it.each([
    "Googlebot",
    "Bingbot",
    "OAI-SearchBot",
    "PerplexityBot",
    "Claude-SearchBot",
    "GPTBot",
    "ClaudeBot",
  ])("%s may fetch / and /about", (bot) => {
    const group = groupFor(bot);
    expect(group).toBeDefined();
    const disallow = list(group!.disallow).filter(Boolean);
    for (const path of ["/", "/about"])
      expect(disallow.some((d) => path.startsWith(d))).toBe(false);
  });
});
