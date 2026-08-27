import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/data/products";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getSiteUrl } from "@/lib/site";

interface ProductoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado | Che Peludos" };
  return {
    title: `${product.name} | Che Peludos`,
    description: product.shortDescription,
    alternates: { canonical: `/producto/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [product.thumbnail],
    },
  };
}

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const siteUrl = getSiteUrl();
  const absoluteImage = product.thumbnail.startsWith("http")
    ? product.thumbnail
    : `${siteUrl}${product.thumbnail}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [absoluteImage],
    description: product.shortDescription,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/producto/${product.slug}`,
      priceCurrency: "ARS",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
    </div>
  );
}
