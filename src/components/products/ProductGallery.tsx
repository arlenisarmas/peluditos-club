"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-gray-light">
        <Image
          src={images[active]}
          alt={name}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          className="object-contain p-6"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                active === i ? "border-brand-yellow" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
