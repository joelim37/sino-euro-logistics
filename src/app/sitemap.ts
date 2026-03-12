import type { MetadataRoute } from "next";
import { getPublishedNews } from "@/lib/news";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/services", "/contact", "/news"];
  const news = await getPublishedNews();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.updated_at || item.published_at || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
