"use client";

import { useState, useTransition } from "react";
import { updateProductStock } from "@/lib/actions/inventory";

export function StockEditor({ productId, stock }: { productId: string; stock: number }) {
  const [value, setValue] = useState(stock);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dirty = value !== stock;

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateProductStock(productId, value);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo actualizar el stock.");
      }
    });
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Stock"
        className="w-20 rounded-lg border border-black/10 px-2 py-1 text-right text-sm"
      />
      <button
        type="button"
        disabled={!dirty || isPending}
        onClick={handleSave}
        className="rounded-full bg-brand-black px-3 py-1 text-xs font-semibold text-white disabled:opacity-30"
      >
        {isPending ? "Guardando..." : "Guardar"}
      </button>
      {error && <span className="text-xs text-brand-coral">{error}</span>}
    </div>
  );
}
