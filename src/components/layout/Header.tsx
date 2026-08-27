"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/contacto", label: "Contacto" },
];

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <Image
        src="/images/brand/logo-mark.png"
        alt="Che Peludos"
        width={36}
        height={36}
        className="h-9 w-9"
        priority
      />
      <span className="text-lg font-extrabold leading-none text-brand-black sm:text-xl">
        Che <span className="font-script text-brand-yellow">Peludos</span>
      </span>
    </Link>
  );
}

function SearchForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/tienda?q=${encodeURIComponent(query.trim())}` : "/tienda");
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full rounded-full border border-black/10 bg-brand-gray-light py-2 pl-4 pr-10 text-sm outline-none focus:border-brand-yellow"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-brand-gray hover:text-brand-black"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}

function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link href="/carrito" aria-label="Carrito" className="relative rounded-full p-2 hover:bg-brand-gray-light">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
        <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-brand-coral px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-md p-1.5 text-brand-black lg:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>

        <Logo />

        <nav className="mx-auto hidden items-center gap-8 text-sm font-medium lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-brand-black hover:text-brand-yellow">
              {link.label}
            </Link>
          ))}
        </nav>

        <SearchForm className="ml-auto hidden max-w-xs flex-1 lg:block" />

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <CartLink />
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/5 bg-white px-4 py-4 lg:hidden">
          <SearchForm className="mb-4" />
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 hover:bg-brand-gray-light"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
