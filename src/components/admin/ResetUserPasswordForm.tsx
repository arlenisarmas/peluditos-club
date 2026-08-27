"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { resetUserPassword, type UserFormState } from "@/lib/actions/users";

const initialState: UserFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-black px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
    >
      {pending ? "Guardando..." : "Resetear contraseña"}
    </button>
  );
}

export function ResetUserPasswordForm({ userId }: { userId: string }) {
  const resetWithId = resetUserPassword.bind(null, userId);
  const [state, formAction] = useActionState(resetWithId, initialState);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <PasswordInput name="password" label="Contraseña nueva" required minLength={8} autoComplete="new-password" />
      <PasswordInput name="confirmPassword" label="Confirmar contraseña" required autoComplete="new-password" />
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
