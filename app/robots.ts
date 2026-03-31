import type { MetadataRoute } from "next";
import { resolveSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV?.toLowerCase() === "preview";

  return {
    rules: isPreview
      ? {
          userAgent: "*",
          disallow: "/"
        }
      : {
          userAgent: "*",
          allow: "/"
        },
    sitemap: `${resolveSiteUrl().toString()}sitemap.xml`
  };
}
