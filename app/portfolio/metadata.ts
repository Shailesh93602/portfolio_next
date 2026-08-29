import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { projects } from "@/constants/projects";

// Derived, never hard-coded — NAMES included, which is the part that was missed.
//
// This description once claimed "5 production projects" and listed five that no
// longer matched the page. That was fixed by deriving the COUNT from the array
// while leaving the NAMES hard-coded, and they drifted again in exactly the way
// the original note warned about: the text kept headlining Holdfast long after
// it was cut from `projects`, and never mentioned BALLAST at all.
//
// A meta description is what Google and every link preview show for this page,
// so a name in here is a promise made to people who have not arrived yet.
// Deriving both halves is the only version of this fix that holds.
const projectCount = projects.length;

// Showcase projects lead; the rest fill in behind them, so the sentence stays
// stable when something is added at the end of the array.
//
// Projects with no public repository are excluded, and that is a rule rather
// than a preference: the sentence promises "the internals written up", and the
// ContextQA work is proprietary — there are no internals a reader can go and
// look at. Naming them here would send someone looking for something that is
// not there. They stay on the page as professional work, which is what they
// are.
const named = [
  ...projects.filter((p) => p.isShowcase),
  ...projects.filter((p) => !p.isShowcase),
].filter((p) => Boolean(p.github));

const featured = named.slice(0, 5).map((p) => p.title);

const featuredList =
  featured.length > 1
    ? `${featured.slice(0, -1).join(", ")} and ${featured[featured.length - 1]}`
    : (featured[0] ?? "");

// True 1200×630 social card (the shailesh.webp portrait pillar-boxes).
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Projects — Shailesh Chaudhari"
)}&type=page&description=${encodeURIComponent(
  "Production projects across EdTech, developer tooling, AI, and SaaS"
)}`;

export const metadata: Metadata = {
  title: "Projects — Shailesh Chaudhari",
  description: `${projectCount} engineering projects with the internals written up, including ${featuredList}.`,
  alternates: {
    canonical: `${SITE_URL}/portfolio`,
  },
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Shailesh Chaudhari Portfolio",
    "Full Stack Developer Projects",
    "Web Development Portfolio",
    "React Developer Work",
    "Node.js Projects",
    "MERN Stack Applications",
    "Software Engineer Portfolio",
    "JavaScript Projects",
    "TypeScript Projects",
    "Frontend Development",
    "Backend Development",
    "Web Applications",
  ],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/portfolio`,
    title: "Projects — Shailesh Chaudhari",
    description: `${projectCount} engineering projects spanning concurrency, real-time systems, payments, AI pipelines and developer tooling — each written up with its architecture and trade-offs.`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Shailesh Chaudhari",
    description:
      "Real-time platforms, AI tools, Chrome extensions, and SaaS apps. All built and shipped.",
    images: [ogImageUrl],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
};
