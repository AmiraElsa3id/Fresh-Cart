"use client";

import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Category artwork with a two-step fallback.
 *
 * `category.image` is an API URL, so it can 404 or be blocked and a bare `<img>`
 * then shows the browser's broken-image glyph. Two fallbacks:
 *
 * 1. The design's own artwork, already exported to `public/images/categories/`
 *    (Figma `16:4981`–`16:5035`). Ten files, one per category.
 * 2. A neutral tile with a glyph, so a category the design never covered still
 *    reads as a deliberate placeholder rather than a broken image.
 *
 * The step is tracked in state keyed on the source rather than in a ref: a plain
 * `onError` handler that mutates a ref does not re-render, which is why the
 * obvious version of this component silently does nothing.
 */

/**
 * Slug → design asset. The API's slugs carry an apostrophe and a couple of extra
 * "and"s that the exported filenames drop, so this is an explicit map rather than
 * a mechanical transform — `men's-fashion` → `mens-fashion`, but also
 * `baby-and-toys` → `baby-toys` and `beauty-and-health` → `beauty-health`.
 *
 * Keyed by the API slug. Anything not listed falls back to the neutral tile.
 */
const DESIGN_ART: Record<string, string> = {
  music: "music.jpg",
  "men's-fashion": "mens-fashion.jpg",
  "women's-fashion": "womens-fashion.jpg",
  supermarket: "supermarket.jpg",
  "baby-and-toys": "baby-toys.jpg",
  home: "home.jpg",
  books: "books.jpg",
  "beauty-and-health": "beauty-health.jpg",
  mobiles: "mobiles.jpg",
  electronics: "electronics.jpg",
};

/** Best-effort slug when a record has none of its own. */
function normaliseSlug(slug?: string, name?: string) {
  return (slug ?? name ?? "").trim().toLowerCase().replace(/\s+/g, "-");
}

interface CategoryImageProps {
  /** The API's image URL. Empty or missing starts the fallback chain. */
  src?: string;
  /** Used to pick the design asset, and to label the neutral tile. */
  slug?: string;
  name?: string;
  alt?: string;
  className?: string;
  /** Applied to the artwork itself; the wrapper spans the parent. */
  imgClassName?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
}

export function CategoryImage({
  src,
  slug,
  name,
  alt = "",
  className,
  imgClassName,
  loading = "lazy",
  width,
  height,
}: CategoryImageProps) {
  const key = normaliseSlug(slug, name);
  const fallback = DESIGN_ART[key] ? `/images/categories/${DESIGN_ART[key]}` : undefined;

  // "api" → try the URL; "design" → the exported artwork; "none" → the glyph.
  const [stage, setStage] = useState<"api" | "design" | "none">("api");

  // A different category in the same slot must restart at the API, so the stage
  // is reset whenever the source identity changes rather than persisting.
  const source = `${src ?? ""}|${key}`;
  const [lastSource, setLastSource] = useState(source);
  if (source !== lastSource) {
    setLastSource(source);
    setStage("api");
  }

  // Nothing to try: no URL and no design asset for this slug.
  useEffect(() => {
    if (!src && !fallback) setStage("none");
  }, [src, fallback]);

  if (stage === "none" || (!src && !fallback)) {
    return (
      <div
        className={cn("flex size-full items-center justify-center bg-[#F3F4F6]", className)}
        role="img"
        aria-label={alt || name ? `${alt || name} has no image` : undefined}
      >
        <ImageOff aria-hidden="true" className="size-1/2 max-size-10 text-[#9CA3AF]" />
      </div>
    );
  }

  return (
    <img
      src={stage === "api" ? src : fallback}
      alt={alt}
      className={cn("size-full object-cover", imgClassName ?? className)}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      // `onError` rather than a load-state effect: it fires exactly once per
      // failed attempt and covers 404s, DNS failures and CSP blocks alike.
      onError={() => setStage(stage === "api" && fallback ? "design" : "none")}
    />
  );
}
