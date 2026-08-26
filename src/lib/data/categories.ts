import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    name: "Accesorios",
    slug: "accesorios",
    image: "/images/dogs/bulldog-sunglasses.png",
    bgClass: "bg-brand-sky",
  },
  {
    name: "Ropa",
    slug: "ropa",
    image: "/images/dogs/doodle-hoodie-yellow.png",
    bgClass: "bg-brand-cream",
  },
  {
    name: "Juguetes",
    slug: "juguetes",
    image: "/images/dogs/golden-retriever-puppy-ball.png",
    bgClass: "bg-pink-100",
  },
  {
    name: "Comederos",
    slug: "comederos",
    image: "/images/dogs/corgi-bowl-blue.png",
    bgClass: "bg-brand-sky",
  },
];

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
