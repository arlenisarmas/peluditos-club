"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { createCheckout, type CheckoutState } from "@/lib/actions/checkout";

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

const initialState: CheckoutState = {};

function PayButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="mt-5 w-full rounded-full bg-brand-coral px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Redirigiendo a Mercado Pago…" : "Continuar al pago"}
    </button>
  );
}

export default function CheckoutPage() {
  const { lines, subtotal, itemCount } = useCart();
  const [state, formAction] = useActionState(createCheckout, initialState);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-3xl">Checkout</h1>

      <form action={formAction}>
        <input type="hidden" name="cart" value={JSON.stringify(lines)} readOnly />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-5 lg:col-span-2">
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
          </div>

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

            {state.error && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {state.error}
              </p>
            )}

            <PayButton disabled={lines.length === 0} />
            <p className="mt-3 text-center text-xs text-brand-gray">
              Vas a completar el pago de forma segura en Mercado Pago.
            </p>

            <ButtonLink href="/carrito" variant="outline" className="mt-3 w-full">
              Volver al carrito
            </ButtonLink>
          </div>
        </div>
      </form>
    </div>
  );
}
