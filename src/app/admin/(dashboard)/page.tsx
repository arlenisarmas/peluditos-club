import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, lowStockCount, outOfStockCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 10 } } }),
    prisma.product.count({ where: { stock: 0 } }),
  ]);

  const cards = [
    { label: "Productos", value: productCount, href: "/admin/productos" },
    { label: "Categorías", value: categoryCount, href: "/admin/categorias" },
    { label: "Stock bajo (≤10)", value: lowStockCount, href: "/admin/inventario" },
    { label: "Agotados", value: outOfStockCount, href: "/admin/inventario" },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold">Resumen</h1>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-black/5 bg-white p-5 hover:border-brand-yellow"
          >
            <p className="text-3xl font-extrabold">{card.value}</p>
            <p className="mt-1 text-sm text-brand-gray">{card.label}</p>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-brand-gray">
        Los pedidos se van a mostrar acá cuando conectemos Mercado Pago en la Fase 4.
      </p>
    </div>
  );
}
