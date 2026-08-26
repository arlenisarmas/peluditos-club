import Link from "next/link";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 10;

export default async function AdminInventarioPage() {
  const products = await prisma.product.findMany({ orderBy: { stock: "asc" } });
  const outOfStock = products.filter((p) => p.stock === 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const ok = products.filter((p) => p.stock > LOW_STOCK_THRESHOLD);

  const sections = [
    { title: "Agotados", items: outOfStock, tone: "text-brand-coral" },
    { title: `Stock bajo (≤ ${LOW_STOCK_THRESHOLD})`, items: lowStock, tone: "text-amber-600" },
    { title: "Stock normal", items: ok, tone: "text-green-700" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold">Inventario</h1>

      <div className="mt-4 flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className={`text-sm font-bold ${section.tone}`}>
              {section.title} ({section.items.length})
            </h2>
            <div className="mt-2 overflow-hidden rounded-xl border border-black/5 bg-white">
              {section.items.length === 0 ? (
                <p className="p-4 text-sm text-brand-gray">Nada acá.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {section.items.map((product) => (
                      <tr key={product.id} className="border-b border-black/5 last:border-b-0">
                        <td className="px-4 py-2">
                          <Link href={`/admin/productos/${product.id}`} className="hover:text-brand-yellow">
                            {product.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2 text-brand-gray">{product.sku}</td>
                        <td className="px-4 py-2 text-right font-semibold">{product.stock} u.</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
