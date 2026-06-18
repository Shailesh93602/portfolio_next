import { permanentRedirect } from "next/navigation";

// /services is now the canonical services page. /hire kept its SEO value
// for years, so 301 it forward rather than dropping the route.
export default function HireRedirect(): never {
  permanentRedirect("/services");
}
