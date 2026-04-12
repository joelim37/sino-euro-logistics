import type { MetadataRoute } from "next";
import { getPublishedNews } from "@/lib/news";
import { getServices } from "@/lib/data";
import { mergeServices } from "@/lib/service-content";
import { countryContent } from "@/lib/country-content";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/about", "/services", "/contact", "/news"];
  const news = await getPublishedNews();
  const services = mergeServices(await getServices());
  const countryRoutes = Object.keys(countryContent);

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" as const : route === "/news" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : route === "/services" ? 0.9 : route === "/contact" ? 0.85 : 0.8,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...countryRoutes.map((slug) => ({
      url: `${siteUrl}/countries/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.updated_at || item.published_at || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
