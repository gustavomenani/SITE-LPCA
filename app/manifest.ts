import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  const config = getSiteConfig();

  return {
    name: config.siteName,
    short_name: config.siteName,
    description: config.manifestDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: config.language,
    background_color: config.backgroundColor,
    theme_color: config.themeColor,
    icons: [
      {
        src: "/assets/favicon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/assets/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/assets/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
