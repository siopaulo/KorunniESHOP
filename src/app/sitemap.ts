import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getPublishedBlogPosts } from "@/lib/data/content";
import { getCategories, getProducts } from "@/lib/data/products";

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
  "/odstoupeni-od-smlouvy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const [products, categories, posts] = await Promise.all([
    getProducts(),
    getCategories(),
    getPublishedBlogPosts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/produkty/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategorie/${category.slug}`,
    lastModified: category.updated_at ? new Date(category.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/novinky/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries, ...categoryEntries, ...blogEntries];
}
