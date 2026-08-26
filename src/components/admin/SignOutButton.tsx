"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full border border-black/10 px-4 py-1.5 text-sm font-medium hover:bg-brand-gray-light"
    >
      Cerrar sesión
    </button>
  );
}
