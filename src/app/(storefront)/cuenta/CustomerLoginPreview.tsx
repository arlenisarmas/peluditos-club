"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";

const COMING_SOON_MESSAGE =
  "Las cuentas de clientes todavía no están activas — se habilitan más adelante. Mientras tanto podés comprar como invitado, sin necesidad de registrarte.";

export function CustomerLoginPreview() {
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(COMING_SOON_MESSAGE);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold">Mi cuenta</h1>
        <p className="mt-1 text-center text-xs text-brand-gray">El registro de clientes está en camino ✨</p>

        {message ? (
          <p className="mt-6 text-center text-sm text-brand-gray">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="cuenta-email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="cuenta-email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow"
              />
            </div>
            <PasswordInput id="cuenta-password" label="Contraseña" required />
            <Button type="submit" className="mt-2 w-full">
              Ingresar
            </Button>
            <button
              type="button"
              onClick={() => setMessage(COMING_SOON_MESSAGE)}
              className="text-center text-xs text-brand-gray hover:text-brand-black"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
