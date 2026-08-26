"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { useCart } from "@/lib/cart-context";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [favorite, setFavorite] = useState(false);
  const discount = product.comparePrice
    ? Math.round(100 - (product.price / product.comparePrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-black/5 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-brand-gray-light">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 23vw, 45vw"
          className="object-contain p-2 transition-transform group-hover:scale-105"
        />
        {discount && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-coral px-2 py-0.5 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => setFavorite((v) => !v)}
        aria-pressed={favorite}
        aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        className="absolute right-4 top-4 rounded-full bg-white/90 p-1.5 shadow-sm"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={favorite ? "#FF4B3E" : "none"}
          stroke={favorite ? "#FF4B3E" : "#666666"}
          strokeWidth="2"
        >
          <path
            d="M12 20.5S3.5 15 3.5 8.9C3.5 5.6 6 3.5 8.7 3.5c1.9 0 3.3 1 3.3 1s1.4-1 3.3-1c2.7 0 5.2 2.1 5.2 5.4 0 6.1-8.5 11.6-8.5 11.6Z"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <Link href={`/producto/${product.slug}`} className="text-sm font-semibold text-brand-black hover:text-brand-yellow">
          {product.name}
        </Link>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-brand-black">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-brand-gray line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => addItem(product)}
            aria-label={`Agregar ${product.name} al carrito`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-coral text-white transition-transform hover:scale-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1.2" />
              <circle cx="18" cy="21" r="1.2" />
              <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
