import { getCategories } from "@/lib/data/categories";
import { CategoryCard } from "@/components/home/CategoryCard";

export async function CategorySection() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Explora por categoría</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
}
