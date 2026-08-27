// Color del círculo de flecha en las cards de categoría (distinto del fondo
// suave de la card, que sigue viniendo de category.bgClass). Centralizado
// acá para no repetir el mapeo ni hardcodear colores en el componente —
// una categoría nueva que no esté en la lista cae en el color por defecto.
const CATEGORY_ACCENT: Record<string, string> = {
  accesorios: "bg-brand-blue",
  ropa: "bg-brand-yellow",
  juguetes: "bg-brand-coral",
  comederos: "bg-brand-blue",
};

const DEFAULT_ACCENT = "bg-brand-black";

export function getCategoryAccent(slug: string): string {
  return CATEGORY_ACCENT[slug] ?? DEFAULT_ACCENT;
}
