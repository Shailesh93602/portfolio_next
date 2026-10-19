import { blogPosts } from "@/lib/blog-data";
import { metaDescription, projects } from "@/constants/projects";
import { byId, readRepoFile } from "./helpers/claims";

// KhataGO's FEATURES.md lists "Bank Statement Import & Reconciliation" as roadmap only;
// the card said it "handles ... reconciliation". Nothing may present it as shipped.
const FORMER_CLAIM =
  "WhatsApp-first accounting platform. Webhook → Gemini function-calling → idempotent ledger write. Handles transactions, receivables, and reconciliation entirely through WhatsApp chat + receipt photos.";

const FEATURE_CLAIMS = [
  /\bhandles?\b[^.]{0,80}\breconcil/i,
  /\b(bank|payment|statement|account|ledger)s?\s+reconcil/i,
  /\breconcil(es|ing|ed)\s+(bank|payments?|statements?|accounts?|ledgers?)\b/i,
  /\breconciliation\s+(feature|module|support|engine)\b/i,
];

const mentionsKhataGO = (text: string) => /khatago/i.test(text);

/** A markdown file's KhataGO section whole, plus any other line naming it. */
function khataGOScope(markdown: string): string {
  return markdown
    .split(/\n(?=#{1,3} )|\n---\n/)
    .map((section) =>
      mentionsKhataGO(section.split("\n")[0])
        ? section
        : section
            .split("\n")
            .filter((line) => mentionsKhataGO(line))
            .join("\n")
    )
    .join("\n");
}

const khatago = byId("khatago");

/** What this site writes about KhataGO: the word itself must not appear. */
const ownSurfaces = [
  { name: "constants/projects.ts#khatago", text: JSON.stringify(khatago) },
  { name: "meta description", text: metaDescription(khatago) },
  ...["llms.txt", "llms-full.txt"].map((file) => ({
    name: `public/${file}`,
    text: khataGOScope(readRepoFile("public", file)),
  })),
];

/** Wider surfaces: the word has honest uses here, a feature claim does not. */
const resume = JSON.parse(readRepoFile("resume", "resume.json")) as {
  projects: { name: string }[];
};
const widerSurfaces = [
  ...ownSurfaces,
  ...projects.map((p) => ({
    name: `project ${p.id}`,
    text: JSON.stringify(p),
  })),
  ...blogPosts.map((post) => ({
    name: `blog/${post.slug}`,
    text: `${post.title}\n${post.description}\n${post.content}`,
  })),
  { name: "app/HomeContent.tsx", text: readRepoFile("app", "HomeContent.tsx") },
  {
    name: "app/engineering/page.tsx",
    text: readRepoFile("app", "engineering", "page.tsx"),
  },
  {
    name: "resume/resume.json#KhataGO",
    text: JSON.stringify(
      resume.projects.filter((p) => /khatago/i.test(p.name))
    ),
  },
].filter((s) => mentionsKhataGO(s.text));

describe("KhataGO: reconciliation is not a shipped feature", () => {
  it("every own surface actually describes KhataGO", () => {
    for (const surface of ownSurfaces) {
      expect(`${surface.name}: ${surface.text.length > 40}`).toBe(
        `${surface.name}: true`
      );
    }
  });

  it("each feature-claim pattern catches what it names", () => {
    expect(FEATURE_CLAIMS[0].test(FORMER_CLAIM)).toBe(true);
    expect(FEATURE_CLAIMS[1].test("bank reconciliation in KhataGO")).toBe(true);
    expect(FEATURE_CLAIMS[2].test("KhataGO reconciles payments")).toBe(true);
    expect(FEATURE_CLAIMS[3].test("a reconciliation module")).toBe(true);
  });

  it("the KhataGO copy, its meta description and the llms files never use the word", () => {
    const hits = ownSurfaces
      .filter((s) => /reconcil/i.test(s.text))
      .map((s) => s.name);
    expect(hits).toEqual([]);
  });

  it("no surface that mentions KhataGO claims reconciliation as a feature", () => {
    expect(widerSurfaces.length).toBeGreaterThan(5);
    const hits = widerSurfaces.flatMap((s) =>
      FEATURE_CLAIMS.filter((p) => p.test(s.text)).map(
        (p) => `${s.name} matches ${p}`
      )
    );
    expect(hits).toEqual([]);
  });
});

// A metric value reads as a production figure; "0 double-writes" was a tested property.
describe("key metrics are not production counts", () => {
  const metrics = projects.flatMap((p) =>
    (p.keyMetrics ?? []).map((m) => ({ id: p.id, ...m }))
  );

  it("has metrics to check", () => {
    expect(metrics.length).toBeGreaterThan(5);
  });

  it('no metric states a bare zero ("0 double-writes", "zero outages")', () => {
    const zeros = metrics
      .filter((m) => /^(0|zero)\b/i.test(m.value.trim()))
      .map((m) => `${m.id}: ${m.label} = ${m.value}`);
    expect(zeros).toEqual([]);
  });

  it("the KhataGO duplicate-webhook metric names the test it comes from", () => {
    const dup = khatago.keyMetrics?.find((m) => /duplicate/i.test(m.label));
    expect(dup).toBeDefined();
    expect(dup?.description).toMatch(/\btest\b/i);
    expect(dup?.description).toMatch(/Postgres/);
  });
});
