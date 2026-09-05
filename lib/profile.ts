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
    yearsExperience: 2.5,
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
    institution: "Government Engineering College, Bhavnagar",
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
    // nothing here claims a college or a year. The GfG profile lists the
    // institute as eSparkBiz Technologies, so "while in final year" was
    // contradicted on click.
    geeksforgeeksRank: 1,
    /**
     * `total_problems_solved` on the GeeksforGeeks profile. Stated on the
     * site as "<n>+". Verified daily by scripts/check-project-claims.mjs.
     */
    problemsSolved: 650,
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
    oneLine:
      "Software Engineer at ContextQA. ~2.5 years building backends and full-stack products across QA tooling, EdTech, SaaS, and payments.",

    short:
      "Software Engineer at ContextQA working on the Node.js backend of the core QA-automation platform — the test-execution engine (Playwright / WebdriverIO / LambdaTest), live browser-session streaming, the integrations engine and the session control plane on GKE. BE in Information Technology from GEC Bhavnagar (2024).",

    medium:
      "Software Engineer at ContextQA working on the Node.js backend of the core QA-automation platform — the test-execution engine (Playwright / WebdriverIO / LambdaTest), live browser-session streaming over WebSockets, the integrations engine (GitHub, GitLab, Linear, Slack) and the session control plane on GKE. Previously about 1.5 years at eSparkBiz (Jan 2024 – Jul 2025, including a 7-month internship) shipping full-stack client projects end-to-end. Side projects explore distributed systems (Redlock, Socket.io Redis adapter, Prometheus), deterministic simulation and mutation testing (BALLAST), AI pipelines (Gemini function-calling, OCR), and webhook idempotency patterns. BE in Information Technology from Government Engineering College, Bhavnagar (2024, CGPA 7.99).",
  },
} as const;

/** Convenience string getters for common metadata surfaces. */
export const PROFILE_META = {
  /** e.g. "Software Engineer from Ahmedabad, Gujarat" */
  locationBlurb: `${PROFILE.role.title} based in ${PROFILE.location.displayShort}`,

  /** e.g. "Shailesh Chaudhari — Software Engineer" */
  titleTag: `${PROFILE.name.full} — ${PROFILE.role.title}`,

  /**
   * The one DSA line: "Institute Rank 1 on GeeksforGeeks (650+ problems
   * solved)". Every surface that states the GfG figure renders this, so the
   * number cannot fork again (it was 604+, 600+ and 700+ at the same time).
   */
  gfgLine: `Institute Rank ${PROFILE.achievements.geeksforgeeksRank} on GeeksforGeeks (${PROFILE.achievements.problemsSolved}+ problems solved)`,
} as const;
