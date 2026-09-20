/**
 * Single source of truth for personal / identity facts.
 *
 * Any copy that mentions name, city, degree, role, years-of-experience,
 * company, phone, email, availability, or the positioning line should
 * import from here. DO NOT hard-code these facts in components,
 * metadata files, structured-data JSON-LD, llms.txt files, blog
 * constants, or test fixtures. When a fact changes, edit it here once.
 *
 * If you need a new fact, add a field here and consume it from callers
 * — that way the review history is one file, and contradictions across
 * surfaces become impossible.
 */

/**
 * Years of professional experience, as a number, once.
 *
 * 🔴 IT WAS DEFINED HERE AND IMPORTED BY NOTHING. `PROFILE.role.yearsExperience`
 * had zero call sites; every surface typed the figure out by hand, and they had
 * already forked into three phrasings — "~2.5 years" on the home page and in
 * llms.txt, "About 2.5 years" in the FAQ, "2.5+ years" on the résumé. Three
 * hand-maintained copies of a number that changes twice a year is the same
 * shape as the "604+ / 600+ / 700+" GfG fork this file was written to end.
 *
 * The phrasings stay — an approximation and a floor say different, both-true
 * things, and the résumé wants the floor — but the NUMBER comes from here, so
 * editing this line is the whole edit for every surface that renders. The
 * static files that cannot import it (llms.txt, resume.json/txt) are held
 * against this constant by `__tests__/identity-claims.test.ts`.
 */
const YEARS_EXPERIENCE = 2.5;

/**
 * The degree-awarding institution, spelled one way.
 *
 * It was a literal in `lib/profile.ts`, `constants/index.ts` (which renders the
 * education card) and twice in `app/layout.tsx`'s Person JSON-LD — and
 * `constants/index.ts` had already lost the comma, so the page a visitor reads
 * and the structured data a crawler reads named the college differently.
 */
const INSTITUTION = "Government Engineering College, Bhavnagar";

export const PROFILE = {
  name: {
    full: "Shailesh Chaudhari",
    preferred: "Shailesh",
    handle: "shailesh93602",
  },

  role: {
    title: "Software Engineer",
    company: "ContextQA",
    // Short phrase that describes what he actually does day-to-day.
    focus:
      "Node.js backend of the core QA-automation platform — a test-execution engine orchestrating Playwright / WebdriverIO / LambdaTest runs, live browser-session streaming over WebSockets, the integrations engine (GitHub, GitLab, Linear, Slack), and the session control plane on GKE",
    positioning: "Full-stack engineer with a backend focus",
    yearsExperience: YEARS_EXPERIENCE,
  },

  // Origin vs current matter for honesty on bio copy:
  //   - "from Patan" is correct for origin / family / hometown
  //   - "based in Ahmedabad" is correct for where he lives and works
  //   - Bhavnagar is ONLY where he studied (GEC Bhavnagar)
  // Never say "from Bhavnagar."
  location: {
    hometown: "Patan",
    currentCity: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    // Canonical one-line string for metadata "addressLocality / addressRegion"
    displayShort: "Ahmedabad, Gujarat, India",
    displayLong: "Based in Ahmedabad, Gujarat, India — originally from Patan",
  },

  education: {
    degree: "BE in Information Technology",
    institution: INSTITUTION,
    institutionShort: "GEC Bhavnagar",
    institutionLocation: "Bhavnagar, Gujarat, India",
    year: 2024,
    cgpa: 7.99,
  },

  /**
   * The role before ContextQA. One place, because "~2 years at EsparkBiz" was
   * on four surfaces in two spellings, and the real span (Jan 2024 – Jul 2025)
   * is eighteen months, seven of them as an intern.
   */
  previousRole: {
    company: "eSparkBiz Technologies",
    companyShort: "eSparkBiz",
    start: "Jan 2024",
    end: "Jul 2025",
    /** Sentence fragment for bios: "Previously <tenure>." */
    tenure:
      "about 1.5 years at eSparkBiz (Jan 2024 – Jul 2025, including a 7-month internship)",
  },

  achievements: {
    // Keep these specific and verifiable — each one names its platform, and
    // nothing here claims a college, a year, or a rank.
    //
    // The "Institute Rank 1" framing was dropped on 2026-09-06. A rank is only
    // as meaningful as the population it ranks within: it reads as a college
    // cohort, but the GfG profile's institute is eSparkBiz Technologies (a
    // former employer) with an unknown and probably tiny number of users. A
    // claim that deflates the moment someone clicks is worse than a smaller
    // one that holds, so only the volume is stated now.
    /**
     * `total_problems_solved` on the GeeksforGeeks profile. Stated on the
     * site as "<n>+". Verified daily by scripts/check-project-claims.mjs.
     *
     * 🔴 THIS FIGURE IS NOT MONOTONIC, WHICH IS THE WHOLE REASON FOR THE SLACK.
     *
     * It read 650 when the claim was written on 2026-09-06 and 649 when the
     * daily check was run on 2026-09-20 — GeeksforGeeks recounted, or retired
     * a problem, and the floor the site advertised stopped being a floor. The
     * claim check went red, and until it was read, every surface (home,
     * /about, /statistics, the Person JSON-LD, both llms files, the resume PDF
     * and the DOCX) advertised "650+" one click away from a profile page
     * showing 649.
     *
     * Stating the exact number is the wrong fix: it makes the site wrong again
     * the next time he solves one. A floor with headroom is true in both
     * directions and stays true while the number moves. `compare: "atLeast"`
     * in the claim check still reports when upstream has grown far enough to
     * raise this, so the slack does not quietly become permanent.
     */
    problemsSolved: 640,
    /** The one HackerRank badge at five stars. Python is 3★; no Problem Solving badge. */
    hackerrank: "5-star C++ on HackerRank",
    hackathon: "Finalist, New India Vibrant Hackathon 2023",
  },

  contact: {
    email: "shailesh93602@gmail.com",
    phone: "+91 9313026530",
  },

  /**
   * Deliberately NEUTRAL.
   *
   * This used to advertise contract availability, which aimed the whole
   * site at short-term client work — it was even an SEO keyword. That is the
   * wrong signal for the roles now being targeted.
   *
   * It is NOT replaced with "open to full-time roles", which would be worse:
   * this is a public page, and announcing availability is announcing a job
   * search. The site describes the work and offers a contact page; what that
   * contact is FOR is decided in the conversation, not broadcast.
   */
  availability: {
    openTo: [],
    line: "Backend & full-stack engineering",
  },

  // Positioning bios at three lengths — pick the one that fits the surface.
  bio: {
    oneLine: `Software Engineer at ContextQA. ~${YEARS_EXPERIENCE} years building backends and full-stack products across QA tooling, EdTech, SaaS, and payments.`,

    short:
      "Software Engineer at ContextQA working on the Node.js backend of the core QA-automation platform — the test-execution engine (Playwright / WebdriverIO / LambdaTest), live browser-session streaming, the integrations engine and the session control plane on GKE. BE in Information Technology from GEC Bhavnagar (2024).",

    medium: `Software Engineer at ContextQA working on the Node.js backend of the core QA-automation platform — the test-execution engine (Playwright / WebdriverIO / LambdaTest), live browser-session streaming over WebSockets, the integrations engine (GitHub, GitLab, Linear, Slack) and the session control plane on GKE. Previously about 1.5 years at eSparkBiz (Jan 2024 – Jul 2025, including a 7-month internship) shipping full-stack client projects end-to-end. Side projects explore distributed systems (Redlock, Socket.io Redis adapter, Prometheus), deterministic simulation and mutation testing (BALLAST), AI pipelines (Gemini function-calling, OCR), and webhook idempotency patterns. BE in Information Technology from ${INSTITUTION} (2024, CGPA 7.99).`,
  },
} as const;

/** Convenience string getters for common metadata surfaces. */
export const PROFILE_META = {
  /** e.g. "Software Engineer from Ahmedabad, Gujarat" */
  locationBlurb: `${PROFILE.role.title} based in ${PROFILE.location.displayShort}`,

  /** e.g. "Shailesh Chaudhari — Software Engineer" */
  titleTag: `${PROFILE.name.full} — ${PROFILE.role.title}`,

  /**
   * "~2.5 years" — the approximate form, for prose (home page, llms.txt).
   * Both forms below render the SAME number; only the hedge differs.
   */
  yearsApprox: `~${PROFILE.role.yearsExperience} years`,

  /** "2.5+ years" — the floor form, for the résumé summary. */
  yearsFloor: `${PROFILE.role.yearsExperience}+ years`,

  /** "About 2.5 years of professional experience" — the FAQ's phrasing. */
  yearsSentence: `About ${PROFILE.role.yearsExperience} years of professional experience`,

  /**
   * The one DSA line: "650+ problems solved on GeeksforGeeks". Every surface
   * that states the GfG figure renders this, so the number cannot fork again
   * (it was 604+, 600+ and 700+ at the same time). Volume only — see the
   * note on PROFILE.achievements for why the rank framing is gone.
   */
  gfgLine: `${PROFILE.achievements.problemsSolved}+ problems solved on GeeksforGeeks`,
} as const;
