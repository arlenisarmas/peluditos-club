"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";

const FREE_SHIPPING_THRESHOLD = 699;

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div className="rounded-2xl border border-black/5 bg-brand-gray-light p-5">
      <h2 className="text-lg font-bold">Resumen del pedido</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-brand-gray">
            Subtotal ({itemCount} producto{itemCount === 1 ? "" : "s"})
          </span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-brand-gray">Envío</span>
          <span className="font-semibold">
            {missingForFreeShipping === 0 ? "Gratis" : "Se calcula en el checkout"}
          </span>
        </div>
      </div>

      {missingForFreeShipping > 0 && (
        <p className="mt-3 rounded-lg bg-brand-yellow/20 px-3 py-2 text-xs text-brand-black">
          Te faltan {formatPrice(missingForFreeShipping)} para el envío gratis 🚚
        </p>
      )}

      <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base font-bold">
        <span>Total</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      <ButtonLink
        href="/checkout"
        variant="coral"
        className={`mt-5 w-full ${itemCount === 0 ? "pointer-events-none opacity-50" : ""}`}
      >
        Continuar al pago
      </ButtonLink>
    </div>
  );
}
