import { prisma } from "@/lib/prisma";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NuevoProductoPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold">Nuevo producto</h1>
      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <ProductForm categories={categories} action={createProduct} />
      </div>
      <p className="mt-3 text-xs text-brand-gray">
        Guardá el producto primero; las imágenes se suben en la pantalla de edición.
      </p>
    </div>
  );
}
