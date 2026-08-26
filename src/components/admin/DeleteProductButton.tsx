"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/products";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`¿Borrar "${name}"? Esta acción no se puede deshacer.`)) {
          startTransition(() => deleteProduct(id));
        }
      }}
      className="rounded-full border border-brand-coral px-4 py-2 text-sm font-semibold text-brand-coral hover:bg-brand-coral/10 disabled:opacity-50"
    >
      {isPending ? "Borrando..." : "Borrar producto"}
    </button>
  );
}
