import { Prisma, Product as PrismaProduct } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Product, ProductColor } from "@/lib/types";

function mapProduct(row: PrismaProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.shortDescription,
    category: row.category,
    price: row.price,
    comparePrice: row.comparePrice ?? undefined,
    stock: row.stock,
    sku: row.sku,
    images: row.images,
    thumbnail: row.thumbnail,
    rating: row.rating,
    reviewCount: row.reviewCount,
    colors: (row.colors as ProductColor[] | null) ?? undefined,
    sizes: row.sizes.length ? row.sizes : undefined,
    featured: row.featured,
    active: row.active,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({ where: { slug, active: true } });
  return row ? mapProduct(row) : null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, category: categorySlug },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { shortDescription: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { category: { contains: q, mode: Prisma.QueryMode.insensitive } },
        { sku: { contains: q, mode: Prisma.QueryMode.insensitive } },
      ],
    },
  });
  return rows.map(mapProduct);
}
