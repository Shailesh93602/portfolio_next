import { education, experiences, achievements } from "@/constants";
import { projects } from "@/constants/projects";
import { SOCIAL_LINKS, PROFILE_LINKS, CONTACT_INFO } from "@/lib/constants";

describe("Education constants", () => {
  it("has at least one education entry", () => {
    expect(education.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    education.forEach((e) => {
      expect(e.degree).toBeTruthy();
      expect(e.institution).toBeTruthy();
      expect(e.location).toBeTruthy();
      expect(e.period).toBeTruthy();
    });
  });

  it("period format contains a year", () => {
    education.forEach((e) => {
      expect(e.period).toMatch(/\d{4}/);
    });
  });
});

describe("Experience constants", () => {
  it("has at least one experience entry", () => {
    expect(experiences.length).toBeGreaterThan(0);
  });

  it("each entry has required fields", () => {
    experiences.forEach((e) => {
      expect(e.title).toBeTruthy();
      expect(e.company).toBeTruthy();
      expect(e.period).toBeTruthy();
      expect(e.description).toBeTruthy();
    });
  });

  it("most recent role is at ContextQA", () => {
    expect(experiences[0].company).toBe("ContextQA");
  });
});

describe("Achievement constants", () => {
  it("has at least one achievement", () => {
    expect(achievements.length).toBeGreaterThan(0);
  });

  it("each achievement has a title and description", () => {
    achievements.forEach((a) => {
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
    });
  });

  it("GFG rank 1 achievement exists", () => {
    const gfg = achievements.find((a) =>
      a.description.toLowerCase().includes("geeksforgeeks")
    );
    expect(gfg).toBeDefined();
  });
});

describe("Project constants", () => {
  it("has at least 5 projects", () => {
    expect(projects.length).toBeGreaterThanOrEqual(5);
  });

  it("each project has id, title, description, and tags", () => {
    projects.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(Array.isArray(p.tags)).toBe(true);
      expect(p.tags.length).toBeGreaterThan(0);
    });
  });

  it("project IDs are unique", () => {
    const ids = projects.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("EduScale project exists with live link", () => {
    const eduscale = projects.find((p) => p.id === "eduscale");
    expect(eduscale).toBeDefined();
    expect(eduscale?.live).toBeTruthy();
  });

  it("every github/live link is a valid https URL", () => {
    projects.forEach((p) => {
      if (p.github) expect(p.github).toMatch(/^https:\/\//);
      if (p.live) expect(p.live).toMatch(/^https:\/\//);
    });
  });

  // Verified 2026-08-15 by running `npm test` in ~/Desktop/Coding/Development/
  // holdfast against a migrated local Postgres: "Test Files 7 passed, Tests 18
  // passed". Previous claims were 15 here, 14 in the repo README and 14 in the
  // blog post — three different numbers for one suite.
  it("Holdfast reports its real test count (18) consistently", () => {
    const holdfast = projects.find((p) => p.id === "holdfast");
    expect(holdfast).toBeDefined();
    const tests = holdfast?.keyMetrics?.find((m) => m.label === "Tests");
    expect(tests?.value).toBe("18 passing");
    // techStack line must agree with the keyMetric (no stale 12/14/15 claim)
    expect(holdfast?.techStack?.some((t) => /Vitest — 18 core/.test(t))).toBe(
      true
    );
    expect(holdfast?.techStack?.some((t) => /\(1[245],/.test(t))).toBe(false);
  });

  // A portfolio's whole value is that its numbers are true. Three separate
  // entries here have shipped a test count that disagreed with the repo, and
  // two shipped a breakdown whose parts did not add up to the total it was
  // printed next to (stripe: "29 tests — 9+8+5+6+5", which is 33). This guard
  // catches the second class mechanically.
  it("no keyMetric prints a breakdown that contradicts its own total", () => {
    const mismatches: string[] = [];
    projects.forEach((project) => {
      project.keyMetrics?.forEach((metric) => {
        const total = metric.value.match(/^(\d+)\s*tests?$/i)?.[1];
        if (!total) return;
        const parts = [...metric.description.matchAll(/\((\d+)\)/g)].map((m) =>
          Number(m[1])
        );
        if (parts.length < 2) return;
        const sum = parts.reduce((a, b) => a + b, 0);
        if (sum !== Number(total)) {
          mismatches.push(
            `${project.id}: "${metric.value}" but the breakdown sums to ${sum}`
          );
        }
      });
    });
    expect(mismatches).toEqual([]);
  });

  // Every test count that appears in a keyMetric must appear identically in the
  // techStack line for the same project — they are read by different people in
  // different places and drifted apart repeatedly.
  it("keyMetric test counts agree with the techStack line", () => {
    const mismatches: string[] = [];
    projects.forEach((project) => {
      const metric = project.keyMetrics?.find((m) =>
        /^\d+\s*tests?$/i.test(m.value)
      );
      if (!metric) return;
      const count = metric.value.match(/\d+/)![0];
      const techLine = project.techStack?.find((t) => /^Tests?:/i.test(t));
      if (!techLine) return;
      if (!techLine.includes(count)) {
        mismatches.push(
          `${project.id}: keyMetric says ${count}, techStack says "${techLine}"`
        );
      }
    });
    expect(mismatches).toEqual([]);
  });

  it("open-source library lead-magnets are present with github links", () => {
    ["grounded", "idempotency-kit", "promptproof"].forEach((id) => {
      const lib = projects.find((p) => p.id === id);
      expect(lib).toBeDefined();
      expect(lib?.github).toBe(`https://github.com/Shailesh93602/${id}`);
    });
  });
});

describe("Link constants", () => {
  it("resume points to the correct PDF filename", () => {
    expect(PROFILE_LINKS.RESUME).toBe("/Shailesh_Chaudhari_Resume.pdf");
  });

  it("all social links are valid URLs", () => {
    Object.values(SOCIAL_LINKS).forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
    });
  });

  it("contact info has email and location", () => {
    expect(CONTACT_INFO.EMAIL).toContain("@");
    expect(CONTACT_INFO.LOCATION).toBeTruthy();
  });
});
