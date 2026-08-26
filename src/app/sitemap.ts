import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/tienda", priority: 0.9, changeFrequency: "daily" },
  { path: "/ofertas", priority: 0.7, changeFrequency: "daily" },
  { path: "/nosotros", priority: 0.3, changeFrequency: "monthly" },
  { path: "/contacto", priority: 0.3, changeFrequency: "monthly" },
  { path: "/ayuda", priority: 0.3, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const categoryEntries = categories.map((category) => ({
    url: `${siteUrl}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const productEntries = products.map((product) => ({
    url: `${siteUrl}/producto/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
