"use client";

import { useCategories } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import useEmblaCarouselAutoplay from "embla-carousel-autoplay";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/category/subcategories/${category.name}`} className="block">
      <Card className="w-40 flex-shrink-0 hover:shadow-md transition-shadow group">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-surface-2 relative">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-3 text-center relative">
          <span className="text-sm font-medium text-ink line-clamp-1">{category.name}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

function CategoryCardSkeleton() {
  return (
    <Card className="w-40 flex-shrink-0">
      <Skeleton className="aspect-square rounded-t-lg" />
      <CardContent className="p-3">
        <Skeleton className="mx-auto h-4 w-3/4 rounded" />
      </CardContent>
    </Card>
  );
}

export function CategorySlider({ className, limit = 14 }: { className?: string; limit?: number }) {
  const { data: categories, isLoading } = useCategories();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 4 },
    [useEmblaCarouselAutoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (isLoading) {
    return (
      <div className={cn("hidden md:block mb-6 px-4", className)} role="status" aria-label="Loading categories">
        <div ref={emblaRef} className="flex gap-4 overflow-hidden">
          {Array.from({ length: limit }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const items = categories?.slice(0, limit) || [];

  return (
    <section className={cn("hidden md:block mb-6 px-4 relative", className)} aria-label="Categories carousel">
      <div className="relative">
        <div ref={emblaRef} className="flex gap-4 overflow-hidden">
          {items.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>

        <button
          onClick={scrollPrev}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg",
            "hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
            "flex items-center justify-center"
          )}
          aria-label="Previous categories"
        >
          <ChevronLeft className="w-5 h-5 text-ink" />
        </button>
        <button
          onClick={scrollNext}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-lg",
            "hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
            "flex items-center justify-center"
          )}
          aria-label="Next categories"
        >
          <ChevronRight className="w-5 h-5 text-ink" />
        </button>
      </div>
    </section>
  );
}