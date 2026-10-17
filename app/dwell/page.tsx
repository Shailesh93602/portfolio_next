import { permanentRedirect } from "next/navigation";

// Dwell was renamed StatusPulse. Old Marketplace links still point here, so the
// URL keeps working, but it forwards to the one page buyers should read rather
// than serving a second copy under the old name.
export default function DwellRedirect(): never {
  permanentRedirect("/statuspulse");
}
