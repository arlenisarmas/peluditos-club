import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}
