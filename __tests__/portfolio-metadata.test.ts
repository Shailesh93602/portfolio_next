import { metadata } from "@/app/portfolio/metadata";
import { projects } from "@/constants/projects";

/**
 * The /portfolio meta description must describe the page that exists.
 *
 * WHY, AND WHY THIS IS THE SECOND ATTEMPT.
 *
 * A meta description is what Google and every link preview show for this page —
 * a promise made to people who have not arrived yet, and the one piece of copy
 * that is never seen by anyone who could notice it is wrong.
 *
 * It once claimed "5 production projects" and listed five that did not match
 * the page. That was fixed by deriving the COUNT from the array and leaving the
 * NAMES hard-coded. The names then drifted in exactly the way that fix's own
 * comment warned about: the description kept headlining **Holdfast** long after
 * it was cut from `projects`, and never mentioned BALLAST at all.
 *
 * Deriving a value is not the same as guaranteeing it. This asserts the
 * property.
 */

describe("/portfolio metadata", () => {
  const description = metadata.description ?? "";

  it("has a description at all", () => {
    // Guards everything below: an empty string trivially satisfies "names no
    // project that does not exist".
    expect(description.length).toBeGreaterThan(50);
  });

  it("names only projects that are actually on the page", () => {
    const titles = projects.map((p) => p.title);
    // Anything that looks like a project name: capitalised, or ALL-CAPS.
    const candidates = description.match(/\b[A-Z][A-Za-z]{3,}\b/g) ?? [];
    const PROSE = new Set([
      "Shailesh",
      "Chaudhari",
      "Projects",
      "Production",
      "Engineering",
    ]);

    const unknown = candidates.filter(
      (word) =>
        !PROSE.has(word) &&
        // Also covers a word inside a multi-word title, e.g. "Vibe" in
        // "Vibe Testing".
        !titles.some((t) => t === word || t.includes(word))
    );

    expect(unknown).toEqual([]);
  });

  it("does not mention Holdfast, which was cut from the portfolio", () => {
    // Named explicitly so the reason survives even if the general rule above is
    // ever loosened. Its live site is also down, so a reader following this
    // name from a search result would find nothing twice over.
    expect(description.toLowerCase()).not.toContain("holdfast");
  });

  it("states the real project count", () => {
    expect(description).toContain(String(projects.length));
  });

  it("stays inside the length search results will show", () => {
    // Beyond ~160 characters Google truncates, and the truncated half is the
    // half nobody chose.
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("names no project whose internals a reader cannot actually go and read", () => {
    // The sentence promises "the internals written up". The ContextQA work is
    // proprietary and has no public repository, so naming it would send someone
    // looking for something that is not there.
    const noRepo = projects.filter((p) => !p.github).map((p) => p.title);
    for (const title of noRepo) {
      expect(description).not.toContain(title);
    }
  });
});
