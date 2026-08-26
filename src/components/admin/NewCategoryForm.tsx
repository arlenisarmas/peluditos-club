"use client";

import { useRef } from "react";
import { createCategory } from "@/lib/actions/categories";

export function NewCategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await createCategory(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="grid grid-cols-1 items-end gap-3 rounded-xl border border-dashed border-black/20 p-4 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
    >
      <div>
        <label className="text-xs font-medium text-brand-gray">Nombre</label>
        <input name="name" required placeholder="Snacks" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Slug</label>
        <input name="slug" required placeholder="snacks" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Imagen (ruta)</label>
        <input name="image" required placeholder="/images/dogs/..." className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Clase de fondo</label>
        <input name="bgClass" required placeholder="bg-brand-sky" className="mt-1 w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm" />
      </div>
      <button type="submit" className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black">
        + Agregar
      </button>
    </form>
  );
}
