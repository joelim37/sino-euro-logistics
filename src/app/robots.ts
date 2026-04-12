import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/services", "/contact", "/news"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://sinoeurologistics-atpr.vercel.app/sitemap.xml",
    host: "https://sinoeurologistics-atpr.vercel.app",
  };
}
