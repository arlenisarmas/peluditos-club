"use client";

import Image from "next/image";
import Link from "next/link";
import { CartLine } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function CartItemRow({ line }: { line: CartLine }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 border-b border-black/5 py-4 last:border-b-0">
      <Link href={`/producto/${line.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-gray-light">
        <Image src={line.image} alt={line.name} fill className="object-contain p-1" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/producto/${line.slug}`} className="font-semibold hover:text-brand-yellow">
          {line.name}
        </Link>
        {(line.color || line.size) && (
          <p className="text-xs text-brand-gray">
            {[line.color, line.size].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-1 font-bold">{formatPrice(line.price)}</p>
      </div>

      <div className="flex items-center rounded-full border border-black/10">
        <button
          type="button"
          onClick={() => updateQuantity(line.slug, line.quantity - 1, line.color, line.size)}
          className="px-2.5 py-1 text-lg"
          aria-label="Restar cantidad"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(line.slug, line.quantity + 1, line.color, line.size)}
          className="px-2.5 py-1 text-lg"
          aria-label="Sumar cantidad"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(line.slug, line.color, line.size)}
        aria-label={`Quitar ${line.name} del carrito`}
        className="p-2 text-brand-gray hover:text-brand-coral"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
