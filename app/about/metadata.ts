import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { PROFILE } from "@/lib/profile";

const titleTag = `About — ${PROFILE.name.full}`;

const descriptionLong = `${PROFILE.role.title} based in ${PROFILE.location.displayShort}, originally from ${PROFILE.location.hometown}. Currently at ${PROFILE.role.company} working on the backend of the core QA-automation product. Previously ~2 years at EsparkBiz. ${PROFILE.education.degree}, ${PROFILE.education.institutionShort}, ${PROFILE.education.year}.`;

const descriptionOg = `${PROFILE.role.title} based in ${PROFILE.location.displayShort}. ${PROFILE.bio.oneLine}`;

const descriptionTwitter = `${PROFILE.role.title} at ${PROFILE.role.company}. ${PROFILE.education.degree} from ${PROFILE.education.institutionShort}, ${PROFILE.education.year}. Backend-focused full-stack — distributed systems, real-time, webhook idempotency.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: titleTag,
  description: descriptionLong,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: titleTag,
    description: descriptionOg,
    url: `${SITE_URL}/about`,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: PROFILE.name.full,
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: titleTag,
    description: descriptionTwitter,
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
