import { SITE_URL, BLOG_AUTHOR, META_DEFAULTS } from "./blog-constants";
import { COMPANY_LINKS } from "./constants";
import { PROFILE, PROFILE_META } from "./profile";

// Site-wide Person and WebSite entities, held by __tests__/seo-identity.test.ts.
// No `seeks`/`estimatedSalary` (job-search signal) and no SearchAction (retired).
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: BLOG_AUTHOR.name,
  // Every variant is also visible in the home FAQ and llms.txt.
  alternateName: [...PROFILE.name.variants, PROFILE.name.handle],
  jobTitle: PROFILE.role.title,
  url: SITE_URL,
  image: {
    "@type": "ImageObject",
    url: `${SITE_URL}${BLOG_AUTHOR.avatar}`,
    width: 615,
    height: 614,
  },
  email: PROFILE.contact.email,
  nationality: "Indian",
  homeLocation: {
    "@type": "Place",
    // Where he's based day-to-day (Ahmedabad). His hometown
    // (Patan) is separately expressed on the About page copy.
    address: {
      "@type": "PostalAddress",
      addressLocality: PROFILE.location.currentCity,
      addressRegion: PROFILE.location.state,
      addressCountry: PROFILE.location.country,
    },
    name: PROFILE.location.displayShort,
  },
  sameAs: [
    BLOG_AUTHOR.social.github,
    BLOG_AUTHOR.social.linkedin,
    BLOG_AUTHOR.social.twitter,
    "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
    "https://www.hackerrank.com/profile/shailesh93602",
    "https://leetcode.com/u/Shaileshbhai/",
  ],
  description: PROFILE.bio.medium,
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "NestJS",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Redlock distributed locking",
    "Socket.io",
    "@socket.io/redis-adapter",
    "Bull queues",
    "Circuit breakers (opossum)",
    "Prometheus monitoring",
    "Prisma ORM",
    "Tailwind CSS",
    "Chrome Extensions",
    "WebSockets",
    "Webhook idempotency",
    "Stripe payment integration",
    "Razorpay payment integration",
    "HMAC signature verification",
    "Vector embeddings",
    "pgvector",
    "Gemini AI function-calling",
    "Supabase Realtime",
    "Playwright",
    "WebdriverIO",
    "LambdaTest",
    "Web Development",
    "Software Engineering",
    "Distributed Systems",
    "REST APIs",
    "Full Stack Development",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: PROFILE.education.institution,
    url: "https://gecbhavnagar.ac.in",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      educationalLevel: "Bachelor of Engineering",
      about: "Information Technology",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: PROFILE.education.institution,
      },
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "ContextQA",
    // Was a literal here AND in constants/index.ts, and the two
    // disagreed: "https://contextqa.com" vs
    // "https://www.contextqa.com/". A URL in structured data that
    // does not match the one the page links to is exactly the kind
    // of mismatch a validator flags and a human never notices.
    url: COMPANY_LINKS.CONTEXTQA,
  },
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
    occupationLocation: {
      "@type": "Country",
      name: "India",
    },
    skills:
      "Next.js, React, TypeScript, Node.js, PostgreSQL, Chrome Extensions",
  },
  award: [
    PROFILE_META.gfgLine,
    PROFILE.achievements.hackerrank,
    "Finalist — New India Vibrant Hackathon 2023",
  ],
  workExample: [
    {
      "@type": "SoftwareSourceCode",
      name: "EduScale",
      description:
        // The "<200ms sync latency" that used to be here was never
        // measured. EduScale's own loadtest/README.md exists, in its
        // words, "to replace unverified claims in the portfolio" and
        // warns that "fake '<200ms' claims get caught" — and its
        // results table still reads _tbd_.
        //
        // A number in schema.org data is a claim made to search
        // engines and AI crawlers. Describing the architecture is
        // true and needs no benchmark; the latency figure can come
        // back the day the load test produces one.
        "Real-time engineering learning platform with coding battles over WebSockets, designed for horizontal scaling with a Redis pub/sub adapter",
      url: "https://eduscale.vercel.app/",
      codeRepository: "https://github.com/Shailesh93602/devscale",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: "Next.js",
    },
    {
      "@type": "SoftwareSourceCode",
      name: "KhataGO",
      description:
        "WhatsApp-first AI accounting platform using Gemini AI for OCR and natural language processing",
      url: "https://khatago.vercel.app/",
      // No `codeRepository`: the repo is private, and advertising a
      // URL that 404s to search engines and AI crawlers is worse
      // than omitting the field. Restore it when the repo is public.
      programmingLanguage: ["TypeScript"],
      runtimePlatform: "Next.js",
    },
  ],
} as const;

// Google reads WebSite `name` on the home page as the site name.
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: META_DEFAULTS.siteName,
  alternateName: [...PROFILE.name.variants, "shaileshchaudhari.vercel.app"],
  description: META_DEFAULTS.description,
  author: { "@id": `${SITE_URL}/#person` },
} as const;

// /about. Google requires mainEntity to carry a `name`, not just an @id.
export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about`,
  url: `${SITE_URL}/about`,
  name: `About ${BLOG_AUTHOR.name}`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${SITE_URL}/about`,
      },
    ],
  },
  // Same entity as the site-wide block (same @id), so the two merge.
  mainEntity: { ...personSchema, "@context": undefined },
};
