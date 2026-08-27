"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { changeOwnPassword, type ChangePasswordState } from "@/lib/actions/profile";

const initialState: ChangePasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-full bg-brand-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Guardando..." : "Cambiar contraseña"}
    </button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changeOwnPassword, initialState);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <PasswordInput name="currentPassword" label="Contraseña actual" required autoComplete="current-password" />
      <PasswordInput name="newPassword" label="Contraseña nueva" required minLength={8} autoComplete="new-password" />
      <PasswordInput name="confirmPassword" label="Confirmar contraseña nueva" required autoComplete="new-password" />
      {state.error && (
        <p role="alert" className="text-sm text-brand-coral">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-green-700">Contraseña actualizada.</p>}
      <SubmitButton />
    </form>
  );
}
