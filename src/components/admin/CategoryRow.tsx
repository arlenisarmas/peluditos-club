"use client";

import { useTransition } from "react";
import { Category } from "@/lib/types";
import { deleteCategory, reorderCategory, updateCategory } from "@/lib/actions/categories";

export function CategoryRow({
  category,
  isFirst,
  isLast,
}: {
  category: Category;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const updateWithId = updateCategory.bind(null, category.id);

  return (
    <form
      action={updateWithId}
      className="grid grid-cols-1 items-end gap-3 rounded-xl border border-black/10 p-4 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
    >
      <div>
        <label className="text-xs font-medium text-brand-gray">Nombre</label>
        <input name="name" required defaultValue={category.name} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Slug</label>
        <input name="slug" required defaultValue={category.slug} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Imagen (ruta)</label>
        <input name="image" required defaultValue={category.image} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Clase de fondo</label>
        <input name="bgClass" required defaultValue={category.bgClass} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>

      <div className="flex items-center gap-1.5">
        <button type="submit" className="rounded-full bg-brand-black px-3 py-1.5 text-xs font-semibold text-white">
          Guardar
        </button>
        <button
          type="button"
          disabled={isPending || isFirst}
          onClick={() => startTransition(() => reorderCategory(category.id, "up"))}
          className="rounded border border-black/10 px-2 py-1.5 text-xs disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={isPending || isLast}
          onClick={() => startTransition(() => reorderCategory(category.id, "down"))}
          className="rounded border border-black/10 px-2 py-1.5 text-xs disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm(`¿Borrar la categoría "${category.name}"?`)) {
              startTransition(async () => {
                try {
                  await deleteCategory(category.id);
                } catch (err) {
                  alert(err instanceof Error ? err.message : "No se pudo borrar.");
                }
              });
            }
          }}
          className="rounded border border-brand-coral px-2 py-1.5 text-xs text-brand-coral"
        >
          Borrar
        </button>
      </div>
    </form>
  );
}
