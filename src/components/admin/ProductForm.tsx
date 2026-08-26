"use client";

import { useState } from "react";
import { Category, Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const COMBINING_MARKS = /[̀-ͯ]/g;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  product,
  categories,
  action,
}: {
  product?: Product;
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  return (
    <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="text-sm font-medium">Nombre</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Slug (URL)</label>
        <input
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm font-medium">Descripción corta</label>
        <input
          name="shortDescription"
          required
          defaultValue={product?.shortDescription}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="text-sm font-medium">Descripción</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={product?.description}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Categoría</label>
        <select
          name="category"
          required
          defaultValue={product?.category ?? categories[0]?.slug}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">SKU</label>
        <input
          name="sku"
          required
          defaultValue={product?.sku}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Precio</label>
        <input
          name="price"
          type="number"
          min={0}
          required
          defaultValue={product?.price}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Precio anterior (opcional, para descuento)</label>
        <input
          name="comparePrice"
          type="number"
          min={0}
          defaultValue={product?.comparePrice}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Stock</label>
        <input
          name="stock"
          type="number"
          min={0}
          required
          defaultValue={product?.stock}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Rating</label>
          <input
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            defaultValue={product?.rating ?? 5}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Reviews</label>
          <input
            name="reviewCount"
            type="number"
            min={0}
            defaultValue={product?.reviewCount ?? 0}
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Talles (separados por coma)</label>
        <input
          name="sizes"
          placeholder="S, M, L"
          defaultValue={product?.sizes?.join(", ")}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Colores (nombre:hex, separados por coma)</label>
        <input
          name="colors"
          placeholder="Gris:#9CA3AF, Beige:#D9C7A8"
          defaultValue={product?.colors?.map((c) => `${c.name}:${c.hex}`).join(", ")}
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex items-center gap-6 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" value="true" defaultChecked={product?.active ?? true} />
          Activo (visible en la tienda)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" value="true" defaultChecked={product?.featured ?? false} />
          Destacado (aparece en &quot;Productos destacados&quot;)
        </label>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit">{product ? "Guardar cambios" : "Crear producto"}</Button>
      </div>
    </form>
  );
}
