"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/tienda",
    label: "Tienda",
    icon: (
      <path
        d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8ZM8 8V6a4 4 0 0 1 8 0v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/favoritos",
    label: "Favoritos",
    icon: (
      <path
        d="M12 20S3 14 3 8.5 6.5 3 9.5 3c1.6 0 3 .8 2.5 3C12.5 3.8 14 3 15.5 3 18.5 3 21 5.4 21 8.5 21 14 12 20 12 20Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/pedidos",
    label: "Pedidos",
    icon: (
      <path
        d="M4 7h16M6 7v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 11h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-black/5 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      {ITEMS.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              active ? "text-brand-yellow" : "text-brand-gray"
            }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {item.icon}
            </svg>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
