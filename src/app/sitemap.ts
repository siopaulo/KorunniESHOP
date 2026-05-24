import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

const staticRoutes = [
  "",
  "/produkty",
  "/kategorie",
  "/novinky",
  "/reference",
  "/o-nas",
  "/kontakt",
  "/obchodni-podminky",
  "/ochrana-osobnich-udaju",
  "/cookies",
  "/reklamacni-rad",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
