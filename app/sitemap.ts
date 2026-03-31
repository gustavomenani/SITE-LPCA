import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";
import { resolveSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = resolveSiteUrl();

  return getSiteConfig().pages.map((page) => ({
    url: new URL(page.path === "/" ? "" : page.path.replace(/^\//, ""), baseUrl).toString(),
    changeFrequency: "monthly",
    priority: page.path === "/" ? 1 : 0.8
  }));
}
