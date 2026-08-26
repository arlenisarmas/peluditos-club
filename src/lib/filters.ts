import { Product } from "@/lib/types";

export type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "vendidos" | "novedades";

export interface ProductFilterParams {
  category?: string;
  q?: string;
  sort?: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

export function applyFilters(products: Product[], params: ProductFilterParams) {
  let result = products;

  if (params.category) {
    result = result.filter((p) => p.category === params.category);
  }

  if (params.q) {
    const q = params.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (params.minPrice !== undefined) {
    result = result.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= params.maxPrice!);
  }

  const sorted = [...result];
  switch (params.sort) {
    case "precio-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "vendidos":
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "novedades":
      sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      break;
    default:
      break;
  }

  return sorted;
}
