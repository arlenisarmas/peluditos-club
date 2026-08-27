import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/data/categories";
import { getProductsByCategory } from "@/lib/data/products";
import { applyFilters, SortOption } from "@/lib/filters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";

interface CategoriaPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return {
    title: category ? `${category.name} | Che Peludos` : "Categoría | Che Peludos",
    alternates: { canonical: `/categoria/${slug}` },
  };
}

export default async function CategoriaPage({ params, searchParams }: CategoriaPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const sort = typeof sp.sort === "string" ? (sp.sort as SortOption) : undefined;
  const min = typeof sp.min === "string" && sp.min ? Number(sp.min) : undefined;
  const max = typeof sp.max === "string" && sp.max ? Number(sp.max) : undefined;

  const productsByCategory = await getProductsByCategory(slug);
  const products = applyFilters(productsByCategory, { sort, minPrice: min, maxPrice: max });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">{category.name}</h1>
        <p className="text-sm text-brand-gray">
          {products.length} producto{products.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4">
        <Suspense fallback={null}>
          <ProductFilters hideCategory />
        </Suspense>
      </div>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
