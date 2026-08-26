import Image from "next/image";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata: Metadata = {
  title: "Ofertas | Peluditos Club",
  description: "Descuentos en productos seleccionados para tu peludito.",
};

export default async function OfertasPage() {
  const allProducts = await getProducts();
  const products = allProducts.filter((p) => p.comparePrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src="/images/banners/promo-envio-gratis.jpg"
          alt="Envío gratis en compras superiores a $699"
          width={1280}
          height={480}
          className="h-40 w-full object-cover sm:h-56"
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
