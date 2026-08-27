import Image from "next/image";
import Link from "next/link";
import { Category } from "@/lib/types";
import { getCategoryAccent } from "@/lib/category-accent";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categoria/${category.slug}`}
      className={`group relative flex items-center justify-between overflow-hidden rounded-2xl p-4 ${category.bgClass}`}
    >
      <div>
        <p className="font-bold text-brand-black">{category.name}</p>
        <span
          className={`mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-hover:translate-x-1 ${getCategoryAccent(category.slug)}`}
        >
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
  );
}
