import { projects } from "@/constants/projects";

/**
 * Personal projects versus his employer's.
 *
 * WHY THIS IS A TEST AND NOT A COMMENT.
 *
 * This distinction has had to be restated more than once, which makes it
 * exactly the kind of rule that should be enforced rather than remembered:
 *
 *   PERSONAL  — EduScale, KhataGO, the portfolio, BALLAST and the small
 *               libraries. His own repos. These are the resume projects.
 *   COMPANY   — ContextQA. Exactly TWO items: the Vibe Testing and AxeTos
 *               Chrome extensions, shown as "professional work".
 *
 * The failure modes this guards are both one-directional and both bad:
 *
 *   - A ContextQA project acquiring a `github` link. Those are proprietary;
 *     linking a repo that does not exist publicly is a 404 at best and a
 *     disclosure question at worst.
 *   - A third company item appearing. His day-to-day backend work there
 *     (test-execution engine, VNC streaming, Playwright/WebdriverIO/LambdaTest
 *     orchestration) is described in prose as what he works on — it is not a
 *     showcased project, and turning it into one is a decision, not a tweak.
 */

/** The only two projects that belong to his employer. */
const COMPANY_PROJECT_IDS = ["vibe-testing", "axetos"];

/** Named explicitly: these are HIS, and any "is this OK to show?" is already yes. */
const PERSONAL_FLAGSHIP_IDS = ["eduscale", "khatago", "ballast"];

function byId(id: string) {
  return projects.find((p) => p.id === id);
}

describe("project ownership", () => {
  it("has both company projects", () => {
    // Guards everything below: an empty or renamed set would make the
    // assertions pass by checking nothing.
    for (const id of COMPANY_PROJECT_IDS) {
      expect(byId(id)).toBeDefined();
    }
  });

  it("shows no repository link for a proprietary company project", () => {
    const linked = COMPANY_PROJECT_IDS.filter((id) => byId(id)?.github);
    expect(linked).toEqual([]);
  });

  it("has exactly two company projects — a third is a decision, not a tweak", () => {
    // Anything mentioning ContextQA in its prose is a company item. If a third
    // appears, this fails on purpose: adding one means deciding what can be
    // shown of an employer's product, which is not a drive-by edit.
    const mentionsEmployer = projects.filter((p) =>
      JSON.stringify(p).includes("ContextQA")
    );
    expect(mentionsEmployer.map((p) => p.id).sort()).toEqual(
      [...COMPANY_PROJECT_IDS].sort()
    );
  });

  it("keeps the flagship personal projects personal", () => {
    // EduScale and KhataGO are HIS. Work has previously been parked on the
    // question "is EduScale fair game to discuss?" — it is, always, and this
    // records that so the question is not reopened.
    for (const id of PERSONAL_FLAGSHIP_IDS) {
      const project = byId(id);
      expect(project).toBeDefined();
      expect(JSON.stringify(project)).not.toContain("ContextQA");
    }
  });
});
