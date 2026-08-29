/**
 * Resume regression guard (the site served a 2-year-stale resume and nothing
 * noticed). Asserts the resume SOURCE stays current and honest, and that the
 * built PDF artifact is the new pipeline's output, not the 2024 file.
 */
import fs from "fs";
import path from "path";
import resume from "../resume/resume.json";

describe("resume.json — currency and honesty", () => {
  it("lists ContextQA as the single current employer", () => {
    const current = resume.experience.filter((e) => e.end === "Present");
    expect(current).toHaveLength(1);
    expect(current[0].company).toBe("ContextQA");
    expect(current[0].title).toBe("Software Engineer");
  });

  it("contains none of the known-stale or banned claims", () => {
    const raw = JSON.stringify(resume);
    for (const banned of [
      "Holdfast",
      "MrEngineer",
      "mrengineers",
      "Redis-backed idempotency",
      "microservices architecture",
    ]) {
      expect(raw).not.toContain(banned);
    }
  });

  it("features exactly the three resume projects", () => {
    expect(resume.projects.map((p) => p.name)).toEqual([
      "KhataGO",
      "BALLAST",
      "EduScale",
    ]);
  });

  it("keeps contact identity intact", () => {
    expect(resume.contact.email).toBe("shailesh93602@gmail.com");
    expect(resume.contact.github).toBe("github.com/Shailesh93602");
    expect(resume.contact.portfolio).toBe("shaileshchaudhari.vercel.app");
  });

  it("uses consistent 'Mon YYYY' dates", () => {
    for (const e of resume.experience) {
      expect(e.start).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
      expect(e.end).toMatch(/^([A-Z][a-z]{2} \d{4}|Present)$/);
    }
  });

  it("has no empty bullets", () => {
    const bullets = [
      ...resume.experience.flatMap((e) => e.bullets),
      ...resume.projects.flatMap((p) => p.bullets),
    ];
    expect(bullets.length).toBeGreaterThan(5);
    for (const b of bullets) expect(b.trim().length).toBeGreaterThan(20);
  });
});

describe("built resume artifacts", () => {
  const pdf = path.join(
    __dirname,
    "..",
    "public",
    "Shailesh_Chaudhari_Resume.pdf"
  );

  it("PDF exists and is the pipeline's output, not the 37KB 2024 file", () => {
    const stat = fs.statSync(pdf);
    // The stale 2024 resume was 37,693 bytes; the compiled one is ~90KB+.
    expect(stat.size).toBeGreaterThan(50_000);
    const head = fs.readFileSync(pdf).subarray(0, 5).toString("latin1");
    expect(head).toBe("%PDF-");
  });

  it("DOCX sibling exists", () => {
    expect(
      fs.existsSync(
        path.join(__dirname, "..", "resume", "Shailesh_Chaudhari_Resume.docx")
      )
    ).toBe(true);
  });
});
