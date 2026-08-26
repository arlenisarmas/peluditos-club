import { prisma } from "@/lib/prisma";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { NewCategoryForm } from "@/components/admin/NewCategoryForm";

export default async function AdminCategoriasPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-bold">Categorías</h1>
      <p className="mt-1 text-sm text-brand-gray">
        La imagen se referencia por ruta dentro de <code>public/images/</code> (por ejemplo{" "}
        <code>/images/dogs/corgi-bowl-blue.png</code>), y la clase de fondo es una clase de Tailwind
        (por ejemplo <code>bg-brand-sky</code>).
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {categories.map((category, i) => (
          <CategoryRow
            key={category.id}
            category={category}
            isFirst={i === 0}
            isLast={i === categories.length - 1}
          />
        ))}
      </div>

      <div className="mt-6">
        <NewCategoryForm />
      </div>
    </div>
  );
}
