import { Suspense } from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { applyFilters, SortOption } from "@/lib/filters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";

export const metadata: Metadata = {
  title: "Tienda | Peluditos Club",
  description: "Explorá todos los productos para tu mascota: accesorios, ropa, juguetes y comederos.",
};

interface TiendaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const sort = typeof sp.sort === "string" ? (sp.sort as SortOption) : undefined;
  const min = typeof sp.min === "string" && sp.min ? Number(sp.min) : undefined;
  const max = typeof sp.max === "string" && sp.max ? Number(sp.max) : undefined;

  const products = applyFilters(getProducts(), { category, q, sort, minPrice: min, maxPrice: max });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Tienda</h1>
        <p className="text-sm text-brand-gray">
          {products.length} producto{products.length === 1 ? "" : "s"}
          {q ? ` para "${q}"` : ""}
        </p>
      </div>

      <div className="mt-4">
        <Suspense fallback={null}>
          <ProductFilters />
        </Suspense>
      </div>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
