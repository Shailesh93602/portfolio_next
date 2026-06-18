import { permanentRedirect } from "next/navigation";

// /hire-me 404d, then redirected to /hire. /services is now canonical, so
// point straight there to avoid a redirect chain.
export default function HireMeRedirect(): never {
  permanentRedirect("/services");
}
