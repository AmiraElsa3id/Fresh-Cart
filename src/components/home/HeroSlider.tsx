"use client";

import useEmblaCarousel from "embla-carousel-react";
import useEmblaCarouselAutoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    image: "/slider-image-1.jpeg",
    title: "Fresh Groceries Delivered",
    subtitle: "Get your daily essentials delivered to your doorstep in under 30 minutes",
    ctaText: "Shop Now",
    ctaHref: "/products",
  },
  {
    id: 2,
    image: "/slider-image-2.jpeg",
    title: "Organic & Healthy",
    subtitle: "Discover our wide range of organic fruits, vegetables, and healthy snacks",
    ctaText: "Explore",
    ctaHref: "/category",
  },
  {
    id: 3,
    image: "/slider-image-3.jpeg",
    title: "Best Prices Guaranteed",
    subtitle: "Compare and save with our everyday low prices on all your favorites",
    ctaText: "View Deals",
    ctaHref: "/brands",
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", slidesToScroll: 1 },
    [useEmblaCarouselAutoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const selectedIndex = emblaApi?.selectedScrollSnap() ?? 0;
  const scrollSnaps = emblaApi?.scrollSnapList() ?? [];

  return (
    <section className="relative w-full overflow-hidden" role="region" aria-label="Hero carousel">
      <div className="relative" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              <div className="relative aspect-[1920/450] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl text-white">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-up">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in-up delay-100">
                        {slide.subtitle}
                      </p>
                      <Button
                        size="lg"
                        className="animate-fade-in-up delay-200 bg-primary hover:bg-primary-dark"
                        nativeButton={false}
                        render={<a href={slide.ctaHref} />}
                      >
                        {slide.ctaText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 shadow-lg",
          "hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
          "hidden md:flex"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-ink" />
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 shadow-lg",
          "hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary",
          "hidden md:flex"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-ink" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary",
              index === selectedIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            )}
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}