"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset, type ForgotPasswordState } from "@/lib/actions/password-reset";
import { Button } from "@/components/ui/Button";

const initialState: ForgotPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Enviando..." : "Enviar instrucciones"}
    </Button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold">¿Olvidaste tu contraseña?</h1>
        <p className="mt-1 text-center text-sm text-brand-gray">
          Ingresá tu email y te mandamos instrucciones para recuperar el acceso.
        </p>

        {state.message ? (
          <div className="mt-6 text-center text-sm text-brand-gray">
            <p>{state.message}</p>
            {state.devResetUrl && (
              <p className="mt-3 rounded-lg bg-brand-gray-light p-3 text-xs">
                Modo desarrollo (no hay email configurado todavía):{" "}
                <a href={state.devResetUrl} className="break-all font-semibold text-brand-black underline">
                  {state.devResetUrl}
                </a>
              </p>
            )}
          </div>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-yellow"
              />
            </div>
            <SubmitButton />
          </form>
        )}

        <Link href="/admin/login" className="mt-4 block text-center text-xs text-brand-gray hover:text-brand-black">
          Volver al login
        </Link>
      </div>
    </div>
  );
}
