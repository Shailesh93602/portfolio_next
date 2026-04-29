/**
 * Tests for lib/faq-data.ts — sanity-check that the home/portfolio FAQ data
 * stays in sync with the FAQPage JSON-LD shape Google requires (Question →
 * acceptedAnswer → Answer with `text`). If any test fails, it likely means
 * Q&A copy was edited without updating the schema mapping.
 */
import { homeFaq, portfolioFaq, faqToSchema } from "@/lib/faq-data";

describe("homeFaq", () => {
  it("exposes at least 5 Q&As", () => {
    expect(homeFaq.length).toBeGreaterThanOrEqual(5);
  });

  it("each item has a non-empty question and answer", () => {
    for (const item of homeFaq) {
      expect(item.question.length).toBeGreaterThan(0);
      expect(item.answer.length).toBeGreaterThan(0);
    }
  });

  it("answers are detailed enough to surface as snippets", () => {
    // Google rejects FAQ snippets with < ~50 chars on a single answer.
    for (const item of homeFaq) {
      expect(item.answer.length).toBeGreaterThan(80);
    }
  });
});

describe("portfolioFaq", () => {
  it("returns N items matching the input project count", () => {
    const items = portfolioFaq(7);
    expect(items.length).toBeGreaterThanOrEqual(5);
    // At least one answer should mention the project count we passed in.
    const allAnswers = items.map((i) => i.answer).join(" ");
    expect(allAnswers).toContain("7");
  });
});

describe("faqToSchema", () => {
  it("emits a valid FAQPage @type", () => {
    const schema = faqToSchema(homeFaq);
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("FAQPage");
  });

  it("each Question has acceptedAnswer with text", () => {
    const schema = faqToSchema(homeFaq);
    expect(schema.mainEntity.length).toBe(homeFaq.length);
    for (const q of schema.mainEntity) {
      expect(q["@type"]).toBe("Question");
      expect(q.name.length).toBeGreaterThan(0);
      expect(q.acceptedAnswer["@type"]).toBe("Answer");
      expect(q.acceptedAnswer.text.length).toBeGreaterThan(0);
    }
  });

  it("schema text matches the visible Q&A 1:1 (Google policy)", () => {
    // FAQPage rich-result eligibility requires visible Q&A == schema Q&A.
    const schema = faqToSchema(homeFaq);
    for (let i = 0; i < homeFaq.length; i++) {
      expect(schema.mainEntity[i].name).toBe(homeFaq[i].question);
      expect(schema.mainEntity[i].acceptedAnswer.text).toBe(homeFaq[i].answer);
    }
  });
});
