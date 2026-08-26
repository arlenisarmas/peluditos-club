"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

const FIELDS: { name: string; label: string; type?: string; span?: "full" }[] = [
  { name: "firstName", label: "Nombre" },
  { name: "lastName", label: "Apellido" },
  { name: "email", label: "Email", type: "email", span: "full" },
  { name: "phone", label: "Teléfono" },
  { name: "postalCode", label: "Código postal" },
  { name: "address", label: "Dirección", span: "full" },
  { name: "city", label: "Localidad" },
  { name: "province", label: "Provincia" },
];

export default function CheckoutPage() {
  const { lines, subtotal, itemCount } = useCart();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Checkout</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form className="rounded-2xl border border-black/5 bg-white p-5 lg:col-span-2" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-lg font-bold">Datos de entrega</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.name} className={field.span === "full" ? "sm:col-span-2" : undefined}>
                <label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type ?? "text"}
                  required
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow"
                />
              </div>
            ))}
          </div>
        </form>

        <div className="rounded-2xl border border-black/5 bg-brand-gray-light p-5">
          <h2 className="text-lg font-bold">Resumen del pedido</h2>
          <ul className="mt-3 space-y-1 text-sm text-brand-gray">
            {lines.map((line) => (
              <li key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}`} className="flex justify-between gap-2">
                <span className="truncate">
                  {line.quantity}× {line.name}
                </span>
                <span className="shrink-0 font-medium text-brand-black">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base font-bold">
            <span>Total ({itemCount})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <button
            type="button"
            disabled
            title="El pago con Mercado Pago se activa en la Fase 4, cuando conectemos las credenciales."
            className="mt-5 w-full cursor-not-allowed rounded-full bg-brand-coral/50 px-6 py-3 text-center font-semibold text-white"
          >
            Continuar al pago
          </button>
          <p className="mt-3 text-center text-xs text-brand-gray">
            El pago con Mercado Pago todavía no está conectado (llega en la Fase 4 del proyecto).
          </p>

          <ButtonLink href="/carrito" variant="outline" className="mt-3 w-full">
            Volver al carrito
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
