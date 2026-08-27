"use client";

import { Suspense, useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordWithToken, type ResetPasswordState } from "@/lib/actions/password-reset";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";

const initialState: ResetPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Guardando..." : "Cambiar contraseña"}
    </Button>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction] = useActionState(resetPasswordWithToken, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gray-light px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-center text-xl font-bold">Elegí una contraseña nueva</h1>

        {state.success ? (
          <div className="mt-6 text-center text-sm">
            <p className="text-green-700">Listo, tu contraseña se actualizó.</p>
            <Link href="/admin/login" className="mt-3 inline-block font-semibold text-brand-black hover:text-brand-yellow">
              Ir al login
            </Link>
          </div>
        ) : !token ? (
          <p className="mt-6 text-center text-sm text-brand-coral">
            Falta el token de recuperación. Pedí un enlace nuevo desde{" "}
            <Link href="/admin/forgot-password" className="underline">
              ¿Olvidaste tu contraseña?
            </Link>
            .
          </p>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="token" value={token} />
            <PasswordInput name="password" label="Contraseña nueva" required minLength={8} autoComplete="new-password" />
            <PasswordInput name="confirmPassword" label="Confirmar contraseña" required autoComplete="new-password" />
            {state.error && (
              <p role="alert" className="text-sm text-brand-coral">
                {state.error}
              </p>
            )}
            <SubmitButton />
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
