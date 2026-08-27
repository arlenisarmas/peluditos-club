"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Role, User } from "@prisma/client";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROLE_LABELS } from "@/lib/permissions";
import type { UserFormState } from "@/lib/actions/users";

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "INVENTORY"];

const initialState: UserFormState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-brand-black disabled:opacity-50"
    >
      {pending ? "Guardando..." : label}
    </button>
  );
}

export function UserForm({
  user,
  action,
}: {
  user?: Pick<User, "name" | "email" | "role" | "active">;
  action: (prevState: UserFormState, formData: FormData) => Promise<UserFormState>;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          name="name"
          required
          defaultValue={user?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          defaultValue={user?.email ?? ""}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Rol</label>
        <select
          name="role"
          required
          defaultValue={user?.role ?? "EDITOR"}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" value="true" defaultChecked={user?.active ?? true} />
          Activo (puede iniciar sesión)
        </label>
      </div>

      {!user && (
        <>
          <PasswordInput name="password" label="Contraseña temporal" required minLength={8} autoComplete="new-password" />
          <PasswordInput
            name="confirmPassword"
            label="Confirmar contraseña"
            required
            autoComplete="new-password"
          />
        </>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-brand-coral sm:col-span-2">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-green-700 sm:col-span-2">Guardado.</p>}

      <div className="sm:col-span-2">
        <SubmitButton label={user ? "Guardar cambios" : "Crear usuario"} />
      </div>
    </form>
  );
}
