"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/pedidos", label: "Pedidos" },
];

export function AdminSidebar({ horizontal = false }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={`flex gap-1 ${horizontal ? "flex-row" : "flex-col"}`}>
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
              active ? "bg-brand-yellow text-brand-black" : "text-brand-gray hover:bg-brand-gray-light"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
