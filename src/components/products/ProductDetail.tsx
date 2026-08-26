"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { ProductGallery } from "@/components/products/ProductGallery";

function formatPrice(value: number) {
  return `$${value.toLocaleString("es-AR")}`;
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.comparePrice
    ? Math.round(100 - (product.price / product.comparePrice) * 100)
    : null;

  function handleAddToCart() {
    addItem(product, quantity, color, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(product, quantity, color, size);
    router.push("/checkout");
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
        <div className="mt-2">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={16} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl font-extrabold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <>
              <span className="text-lg text-brand-gray line-through">{formatPrice(product.comparePrice)}</span>
              <span className="rounded-full bg-brand-coral px-2 py-0.5 text-xs font-bold text-white">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <p className="mt-4 text-brand-gray">{product.description}</p>

        {product.colors && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Color: {color}</p>
            <div className="mt-2 flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  aria-pressed={color === c.name}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === c.name ? "border-brand-yellow" : "border-black/10"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && (
          <div className="mt-6">
            <p className="text-sm font-semibold">Talla: {size}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    size === s
                      ? "border-brand-yellow bg-brand-yellow/20 font-semibold"
                      : "border-black/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-semibold">Cantidad</p>
          <div className="mt-2 inline-flex items-center rounded-full border border-black/10">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1.5 text-lg"
              aria-label="Restar cantidad"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3 py-1.5 text-lg"
              aria-label="Sumar cantidad"
            >
              +
            </button>
          </div>
          <span className="ml-3 text-xs text-brand-gray">{product.stock} disponibles</span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" className="flex-1" onClick={handleAddToCart}>
            {justAdded ? "¡Agregado! 🐾" : "Agregar al carrito"}
          </Button>
          <Button variant="coral" className="flex-1" onClick={handleBuyNow}>
            Comprar ahora
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 border-t border-black/5 pt-6 text-xs text-brand-gray sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🛡️</span> Pago 100% seguro
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🚚</span> Envío gratis desde $699
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true">↩️</span> Devoluciones fáciles
          </div>
        </div>
      </div>
    </div>
  );
}
