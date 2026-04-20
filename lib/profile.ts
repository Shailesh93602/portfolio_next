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
      "backend of the core QA-automation product — test execution engine, VNC streaming, and browser-automation orchestration across Playwright / WebdriverIO / LambdaTest",
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
    displayLong:
      "Based in Ahmedabad, Gujarat, India — originally from Patan",
  },

  education: {
    degree: "BE in Information Technology",
    institution: "Government Engineering College, Bhavnagar",
    institutionShort: "GEC Bhavnagar",
    institutionLocation: "Bhavnagar, Gujarat, India",
    year: 2024,
    cgpa: 7.99,
  },

  achievements: {
    // Keep these specific and verifiable.
    geeksforgeeksRank: 1,
    problemsSolved: 604,
  },

  contact: {
    email: "shailesh93602@gmail.com",
    phone: "+91 9313026530",
  },

  availability: {
    openTo: ["part-time", "freelance", "full-time"],
    // Short line for hero / footer.
    line: "Available for hire · Open to part-time, freelance, and full-time roles",
  },

  // Positioning bios at three lengths — pick the one that fits the surface.
  bio: {
    oneLine:
      "Software Engineer at ContextQA. ~2.5 years building backends and full-stack products across QA tooling, EdTech, SaaS, and payments.",

    short:
      "Software Engineer at ContextQA working on the backend of the core QA-automation product — test execution engine, VNC streaming, and browser-automation orchestration across Playwright, WebdriverIO, and LambdaTest. BE in Information Technology from GEC Bhavnagar (2024).",

    medium:
      "Software Engineer at ContextQA working on the backend of the core QA-automation product — test execution engine, VNC streaming, and browser-automation orchestration across Playwright, WebdriverIO, and LambdaTest. Previously ~2 years at EsparkBiz shipping full-stack client projects end-to-end. Side projects explore distributed systems (Redlock, Socket.io Redis adapter, Prometheus), AI pipelines (Gemini function-calling, OCR), and webhook idempotency patterns. BE in Information Technology from Government Engineering College, Bhavnagar (2024, CGPA 7.99).",
  },
} as const;

/** Convenience string getters for common metadata surfaces. */
export const PROFILE_META = {
  /** e.g. "Software Engineer from Ahmedabad, Gujarat" */
  locationBlurb: `${PROFILE.role.title} based in ${PROFILE.location.displayShort}`,

  /** e.g. "Shailesh Chaudhari — Software Engineer" */
  titleTag: `${PROFILE.name.full} — ${PROFILE.role.title}`,
} as const;
