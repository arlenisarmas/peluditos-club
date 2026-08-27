import Image from "next/image";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata: Metadata = {
  title: "Ofertas | Che Peludos",
  description: "Descuentos en productos seleccionados para tu peludito.",
  alternates: { canonical: "/ofertas" },
};

export default async function OfertasPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.comparePrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-brand-gray-light sm:h-56">
        <Image
          src="/images/banners/promo-envio-gratis.png"
          alt="Envío gratis en compras superiores a $699"
          fill
          sizes="(min-width: 1024px) 1152px, 100vw"
          className="object-contain object-center"
          priority
        />
      </div>

      <h1 className="mt-8 text-2xl font-extrabold sm:text-3xl">Ofertas</h1>
      <p className="mt-1 text-sm text-brand-gray">
        {products.length} producto{products.length === 1 ? "" : "s"} con descuento
      </p>

      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
