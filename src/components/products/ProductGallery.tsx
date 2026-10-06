"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product gallery — product-details node `24:2423`.
 *
 * `div#product-images` is a 376px column holding one white card (`bg-white`,
 * p-16, radius 12, `effect_c5bd7c6c`) with a fixed-height main image and a
 * thumbnail strip beneath it. The thumbnails are `button`s — the active one
 * carries a 4px `#6A7282` ring (`strokeWeight: 4px`) so the selection is
 * visible without relying on colour alone.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  // A new product arrives on the same route (related-product link, list click)
  // so the index has to be clamped rather than trusted.
  const selected = Math.min(active, Math.max(0, images.length - 1));

  useEffect(() => {
    setActive(0);
  }, [images]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setActive((current) => {
      const next =
        event.key === "ArrowRight"
          ? current + 1
          : current - 1;
      // Wrap around, which is what a slider should do at either end.
      return (next + images.length) % images.length;
    });
  };

  if (images.length === 0) {
    return (
      <div className={`flex aspect-square items-center justify-center rounded-xl bg-surface-2 ${CARD_SHADOW}`}>
        <span className="text-sm text-slate-500">No image</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-0 rounded-xl bg-white p-4 ${CARD_SHADOW}`}>
      <div
        id="product-gallery-image"
        className="aspect-square w-full overflow-hidden rounded-lg bg-surface-2"
      >
        <img
          key={images[selected]}
          src={images[selected]}
          alt={`${title} — image ${selected + 1} of ${images.length}`}
          className="size-full animate-fade-in-up object-cover"
          // The first frame is above the fold on desktop and mobile.
          loading={selected === 0 ? "eager" : "lazy"}
          fetchPriority={selected === 0 ? "high" : "auto"}
        />
      </div>

      {images.length > 1 && (
        <div
          className="mt-4 grid grid-cols-4 gap-2"
          role="tablist"
          aria-label={`${title} images`}
          onKeyDown={onKeyDown}
        >
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={index === selected}
              aria-controls="product-gallery-image"
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActive(index)}
              className={cn(
                "aspect-square overflow-hidden rounded-lg bg-surface-2 transition-shadow",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                index === selected
                  ? "ring-2 ring-[#6A7282] ring-offset-2"
                  : "ring-1 ring-border hover:ring-[#6A7282]"
              )}
            >
              <img src={src} alt="" className="size-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
