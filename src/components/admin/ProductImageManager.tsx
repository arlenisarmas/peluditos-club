"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import {
  removeProductImage,
  reorderProductImage,
  setProductThumbnail,
  uploadProductImage,
} from "@/lib/actions/products";

export function ProductImageManager({
  productId,
  images,
  thumbnail,
}: {
  productId: string;
  images: string[];
  thumbnail: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleUpload(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await uploadProductImage(productId, formData);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
      }
    });
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((image) => (
          <div key={image} className="relative rounded-xl border border-black/10 p-2">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-gray-light">
              <Image src={image} alt="" fill className="object-contain p-1" />
            </div>
            {image === thumbnail && (
              <span className="absolute left-3 top-3 rounded-full bg-brand-yellow px-2 py-0.5 text-[10px] font-bold">
                Principal
              </span>
            )}
            <div className="mt-2 flex items-center justify-between gap-1 text-xs">
              <button
                type="button"
                disabled={isPending || image === thumbnail}
                onClick={() => startTransition(() => setProductThumbnail(productId, image))}
                className="text-brand-black hover:text-brand-yellow disabled:opacity-30"
              >
                Usar como principal
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => reorderProductImage(productId, image, "up"))}
                  aria-label="Mover antes"
                  className="rounded border border-black/10 px-1.5"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => startTransition(() => reorderProductImage(productId, image, "down"))}
                  aria-label="Mover después"
                  className="rounded border border-black/10 px-1.5"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => removeProductImage(productId, image))}
                className="text-brand-coral hover:underline"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <form
        ref={formRef}
        action={handleUpload}
        className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-black/20 p-4"
      >
        <input type="file" name="file" accept="image/*" required className="text-sm" />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-brand-black px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isPending ? "Subiendo..." : "Subir imagen"}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-2 text-xs text-brand-coral">
          {error}
        </p>
      )}
      <p className="mt-2 text-xs text-brand-gray">Las imágenes se suben a Cloudinary.</p>
    </div>
  );
}
