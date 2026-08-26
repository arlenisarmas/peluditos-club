import { HeartIcon } from "@/components/ui/Decorations";
import { ButtonLink } from "@/components/ui/Button";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/ProductGrid";

export function FeaturedProducts() {
  const products = getFeaturedProducts();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="flex items-center justify-center gap-2 text-center text-2xl font-extrabold sm:text-3xl">
        Productos destacados
        <HeartIcon className="h-6 w-6 text-brand-coral" />
      </h2>
      <div className="mt-6">
        <ProductGrid products={products} />
      </div>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/tienda" variant="coral">
          Ver todos los productos
        </ButtonLink>
      </div>
    </section>
  );
}
