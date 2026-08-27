import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePagePermission } from "@/lib/authz";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export default async function AdminProductosPage() {
  await requirePagePermission("products:write");
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-black/5 text-left text-xs uppercase text-brand-gray">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-black/5 last:border-b-0">
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-gray-light">
                    {product.thumbnail && (
                      <Image src={product.thumbnail} alt="" fill className="object-contain p-1" />
                    )}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </td>
                <td className="px-4 py-3 text-brand-gray">{product.category}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock === 0 ? "font-semibold text-brand-coral" : ""}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.active ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Activo</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Oculto</span>
                    )}
                    {product.featured && (
                      <span className="rounded-full bg-brand-yellow/30 px-2 py-0.5 text-xs">Destacado</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/productos/${product.id}`} className="font-medium text-brand-black hover:text-brand-yellow">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-6 text-center text-sm text-brand-gray">Todavía no hay productos.</p>
        )}
      </div>
    </div>
  );
}
