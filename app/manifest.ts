import type { MetadataRoute } from "next";
import { SITE_URL, BLOG_AUTHOR, META_DEFAULTS } from "@/lib/blog-constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BLOG_AUTHOR.name} — Portfolio`,
    short_name: "Shailesh",
    description: META_DEFAULTS.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#0f0f0f",
    orientation: "portrait",
    scope: "/",
    id: SITE_URL,
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
