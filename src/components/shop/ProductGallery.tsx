"use client";

import { useState } from "react";

import { CloudinaryImage } from "@/components/shared/CloudinaryImage";
import type { ProductImage } from "@/lib/data/product-types";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-sage-light/30 to-earth-light/20" />
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <CloudinaryImage
          src={active?.url ?? sorted[0]!.url}
          alt={active?.alt_text ?? productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          crop="limit"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 sm:h-20 sm:w-20",
                index === activeIndex ? "border-sage" : "border-transparent",
              )}
              aria-label={`Zobrazit fotku ${index + 1}`}
            >
              <CloudinaryImage
                src={image.url}
                alt={image.alt_text}
                fill
                crop="fill"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
