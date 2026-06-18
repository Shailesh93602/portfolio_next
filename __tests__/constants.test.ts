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

  it("Holdfast reports its real test count (15) consistently", () => {
    const holdfast = projects.find((p) => p.id === "holdfast");
    expect(holdfast).toBeDefined();
    const tests = holdfast?.keyMetrics?.find((m) => m.label === "Tests");
    expect(tests?.value).toBe("15 passing");
    // techStack line must agree with the keyMetric (no stale 12/14 claim)
    expect(holdfast?.techStack?.some((t) => /Vitest \(15,/.test(t))).toBe(true);
    expect(holdfast?.techStack?.some((t) => /Vitest \(1[24],/.test(t))).toBe(
      false
    );
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
