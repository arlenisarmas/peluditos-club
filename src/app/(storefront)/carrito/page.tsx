"use client";

import { ButtonLink } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/lib/cart-context";

export default function CarritoPage() {
  const { lines } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <span className="text-5xl">🛒</span>
        <h1 className="mt-4 text-xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-brand-gray">
          Todavía no agregaste ningún producto. ¡Explorá la tienda y encontrá algo para tu peludito!
        </p>
        <ButtonLink href="/tienda" className="mt-6">
          Ir a la tienda
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Tu carrito</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5 lg:col-span-2">
          {lines.map((line) => (
            <CartItemRow key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`} line={line} />
          ))}
        </div>

        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
