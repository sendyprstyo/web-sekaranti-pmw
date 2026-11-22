import type { MetadataRoute } from "next";
import { getCollections } from "../lib/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return [];

  const siteUrl = new URL(configuredUrl).origin;
  const paths = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.7 },
    ...getCollections().flatMap((collection) => [
      { path: `/collections/${collection.slug}`, priority: 0.8 },
      { path: `/products/${collection.slug}`, priority: 0.7 },
    ]),
  ];

  return paths.map(({ path, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority,
  }));
}
