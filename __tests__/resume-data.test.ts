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
      // Dropped on the owner's call (2026-09-03): the cross-platform "700+"
      // problem count and the CodeChef line are not reproducible by any one
      // command, unlike the GfG figure.
      "700+",
      "CodeChef",
    ]) {
      expect(raw).not.toContain(banned);
    }
  });

  it("leads with the ratified positioning", () => {
    expect(resume.title).toBe(
      "Software Engineer - TypeScript/Node, backend-strongest, applied AI"
    );
    expect(resume.summary).toMatch(/TypeScript\/Node/);
    expect(resume.summary).toMatch(/WCAG 2\.1 AA/);
  });

  it("keeps ContextQA claims at the pattern level — no company metrics", () => {
    const contextqa = resume.experience.find((e) => e.company === "ContextQA")!;
    const text = contextqa.bullets.join(" ");
    // Percentages, currency and "N customers/users" are the company's numbers
    // to publish, not his — and the ones he can least defend in a room.
    expect(text).not.toMatch(/\d+\s?%/);
    expect(text).not.toMatch(/[$₹]\s?\d/);
    expect(text).not.toMatch(/\d+\s?(customers|users|clients|teams)\b/i);
    // Java/Python is one clause inside a Node bullet, never a bullet of its own.
    const javaBullets = contextqa.bullets.filter((b) => /Java/.test(b));
    expect(javaBullets).toHaveLength(1);
    expect(javaBullets[0]).toMatch(/^(?!Java)/);
  });

  it("is ASCII-only, which the ATS scan also enforces on the PDF", () => {
    // resume/scan.py rejects non-ASCII glyphs in the text layer (em dashes,
    // curly quotes). Catch it at the source so the PDF never has to.
    const raw = JSON.stringify(resume);
    expect(raw).toMatch(/^[\x20-\x7E]*$/);
  });

  it("achievements are the two ratified lines plus the hackathon", () => {
    expect(resume.achievements).toEqual([
      "Institute Rank 1 on GeeksforGeeks (604+ problems solved)",
      "5-star C++ on HackerRank",
      "Finalist, New India Vibrant Hackathon 2023",
    ]);
  });

  it("features exactly the three resume projects", () => {
    expect(resume.projects.map((p) => p.name)).toEqual([
      "KhataGO",
      "BALLAST",
      "EduScale",
    ]);
  });

  it("EduScale claims a design for horizontal scaling, not a multi-instance deployment", () => {
    // Fact-check 2026-09-05 (INTERVIEW_PREP/resume-lines.md): the backend is
    // multi-instance-SAFE by design — Redis adapter, Redlock, per-key breakers —
    // but there is no deployment record of it ever running as more than one
    // instance (it is on Vercel serverless). "2+ instances" asserted a
    // deployment; the true claim is the design. A recruiter will not catch the
    // difference; an interviewer will, on the first follow-up.
    const edu = resume.projects.find((p) => p.name === "EduScale")!;
    const text = [edu.tagline, ...edu.bullets].join(" ");
    expect(text).not.toMatch(/\d\s*\+\s*(Node\.js\s+)?(server\s+)?instances/i);
    expect(text).not.toMatch(/multiple\s+(Node\.js\s+)?(server\s+)?instances/i);
    expect(text).not.toMatch(/across\s+\d+/i);
    expect(text).toMatch(/horizontal scaling across Node\.js instances/);
  });

  it("KhataGO's race numbers say exactly what the named tests assert", () => {
    // whatsapp-webhook.integration.test.ts (CONCURRENCY = 8) asserts one
    // WhatsappMessage row and eight 202s — NOT a ledger entry. The ledger-level
    // guarantee is agent-run.integration.test.ts (CONCURRENCY = 8): eight
    // executors of one planned write step, one Transaction row. The bullet
    // must attribute each number to the property its test proves; "8
    // deliveries → one ledger write" had no assertion behind it.
    const kg = resume.projects.find((p) => p.name === "KhataGO")!;
    const text = kg.bullets.join(" ");
    expect(text).not.toMatch(
      /deliveries[^.]*produce exactly one ledger write/i
    );
    expect(text).toMatch(
      /8 simultaneous deliveries of one message collapse to one stored row/
    );
    expect(text).toMatch(
      /8 concurrent executors of one agent write step commit exactly one ledger row/
    );
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
