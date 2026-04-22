import { permanentRedirect } from "next/navigation";

// /blog (no slug) used to 404. Nav links to /blogs (plural) but
// /blog is a common manual-URL guess. Permanent-redirect so the
// URL canonicalizes without losing the user.
export default function BlogIndexRedirect(): never {
  permanentRedirect("/blogs");
}
