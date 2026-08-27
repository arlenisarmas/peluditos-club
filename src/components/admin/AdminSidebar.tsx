"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { hasPermission, type Permission } from "@/lib/permissions";

const LINKS: { href: string; label: string; exact?: boolean; permission?: Permission }[] = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/productos", label: "Productos", permission: "products:write" },
  { href: "/admin/categorias", label: "Categorías", permission: "categories:write" },
  { href: "/admin/inventario", label: "Inventario", permission: "inventory:write" },
  { href: "/admin/pedidos", label: "Pedidos", permission: "orders:read" },
  { href: "/admin/usuarios", label: "Usuarios", permission: "users:write" },
  { href: "/admin/perfil", label: "Mi perfil" },
];

export function AdminSidebar({ horizontal = false, role }: { horizontal?: boolean; role: Role }) {
  const pathname = usePathname();
  const links = LINKS.filter((link) => !link.permission || hasPermission(role, link.permission));

  return (
    <nav className={`flex gap-1 ${horizontal ? "flex-row" : "flex-col"}`}>
      {links.map((link) => {
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
