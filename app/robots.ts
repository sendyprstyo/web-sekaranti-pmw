import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const sitemap = configuredUrl
    ? new URL("/sitemap.xml", new URL(configuredUrl).origin).toString()
    : undefined;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    ...(sitemap ? { sitemap } : {}),
  };
}
