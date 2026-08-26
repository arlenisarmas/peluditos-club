"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category } from "@/lib/types";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "relevancia", label: "Relevancia" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "vendidos", label: "Más vendidos" },
  { value: "novedades", label: "Novedades" },
];

export function ProductFilters({
  categories = [],
  hideCategory = false,
}: {
  categories?: Category[];
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {!hideCategory && (
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
          className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      <select
        value={searchParams.get("sort") ?? "relevancia"}
        onChange={(e) => setParam("sort", e.target.value)}
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="min-price" className="text-brand-gray">Precio</label>
        <input
          id="min-price"
          type="number"
          min={0}
          placeholder="Min"
          defaultValue={searchParams.get("min") ?? ""}
          onBlur={(e) => setParam("min", e.target.value)}
          className="w-20 rounded-full border border-black/10 bg-white px-3 py-2"
        />
        <span className="text-brand-gray">–</span>
        <input
          type="number"
          min={0}
          placeholder="Max"
          defaultValue={searchParams.get("max") ?? ""}
          onBlur={(e) => setParam("max", e.target.value)}
          className="w-20 rounded-full border border-black/10 bg-white px-3 py-2"
        />
      </div>
    </div>
  );
}
