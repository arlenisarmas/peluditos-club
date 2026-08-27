import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePagePermission } from "@/lib/authz";
import { mapProduct } from "@/lib/data/products";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

interface EditProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductoPage({ params }: EditProductoPageProps) {
  await requirePagePermission("products:write");
  const { id } = await params;
  const [row, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!row) notFound();

  const product = mapProduct(row);
  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Editar producto</h1>
        <DeleteProductButton id={id} name={product.name} />
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <h2 className="text-sm font-bold text-brand-gray">Imágenes</h2>
        <div className="mt-3">
          <ProductImageManager productId={id} images={product.images} thumbnail={product.thumbnail} />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5">
        <ProductForm product={product} categories={categories} action={updateWithId} />
      </div>
    </div>
  );
}
