import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/data/categories";

export async function CategorySection() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Explora por categoría</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl p-4 ${category.bgClass}`}
          >
            <div>
              <p className="font-bold text-brand-black">{category.name}</p>
              <span className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-black transition-transform group-hover:translate-x-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <Image
              src={category.image}
              alt={category.name}
              width={110}
              height={110}
              className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
