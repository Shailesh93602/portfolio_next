import { permanentRedirect } from "next/navigation";

// See app/dwell/page.tsx: the policy lives at /statuspulse/privacy.
export default function DwellPrivacyRedirect(): never {
  permanentRedirect("/statuspulse/privacy");
}
