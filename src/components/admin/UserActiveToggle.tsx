"use client";

import { useState, useTransition } from "react";
import { setUserActive } from "@/lib/actions/users";

export function UserActiveToggle({ userId, active }: { userId: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        await setUserActive(userId, !active);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo actualizar.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleToggle}
        className={`rounded-full px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
          active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        {isPending ? "..." : active ? "Desactivar" : "Activar"}
      </button>
      {error && <span className="text-xs text-brand-coral">{error}</span>}
    </div>
  );
}
