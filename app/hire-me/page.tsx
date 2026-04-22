import { permanentRedirect } from "next/navigation";

// /hire-me 404d. Nav links to /hire. Manual-URL guesses land here;
// permanent-redirect to the canonical route.
export default function HireMeRedirect(): never {
  permanentRedirect("/hire");
}
