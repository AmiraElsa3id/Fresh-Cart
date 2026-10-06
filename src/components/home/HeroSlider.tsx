"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import useEmblaCarouselAutoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Both Figma slides (`16:7216` / `16:7237`) resolve to the same
 * `template=EL-80789172` frame, i.e. a single 1920x400 banner image.
 * Exported at 1024x213 - the source image in the file is that size, so
 * the banner is only ~0.53x at full desktop width. Keep the design's
 * gradient overlay heavy enough to mask it, or swap in a hi-res source.
 */
const HERO_IMAGE = "/images/hero-banner.jpg";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
    primaryCta: { label: "Shop Now", href: "/products" },
    secondaryCta: { label: "View Deals", href: "/category" },
  },
  {
    id: 2,
    title: "Fresh Groceries Delivered",
    subtitle: "Get your daily essentials delivered to your doorstep in under 30 minutes",
    primaryCta: { label: "Shop Now", href: "/products" },
    secondaryCta: { label: "Explore", href: "/category" },
  },
];

export function HeroSlider() {
  /*
   * `align` must stay "start". With full-width slides (`flex-[0_0_100%]`) the slide
   * size equals the container size, and embla's centring offset is
   * `(containerSize - slideSize) / 2` - which is 0 for every slide. "center"
   * therefore produces a snap list of [0, 0]: scrollNext, the dot buttons, dragging
   * and autoplay all resolve to the same offset and the banner never moves.
   */
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [useEmblaCarouselAutoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  /*
   * `emblaApi.selectedScrollSnap()` read during render does not update on its
   * own: embla-carousel-react 8.6 only re-renders when the API instance itself
   * changes, not when the selected snap changes. Reading it directly left the
   * active bullet frozen on slide 1 even though the carousel moved. So the
   * index is held in state and driven by embla's `select` event.
   */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(slides.length);

  const onSelect = useCallback(() => {
    setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setSnapCount(emblaApi.scrollSnapList().length);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="relative w-full overflow-hidden" role="region" aria-label="Hero carousel">
      <div className="relative" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="flex-[0_0_100%] min-w-0"
              /*
               * Both slides carry an <h1>, which would give the page two
               * top-level headings and read both out in sequence. The slide
               * that is not on screen is hidden from assistive tech instead -
               * embla keeps every slide mounted and translated off-screen, so
               * without this the off-screen copy is still reachable.
               */
              aria-hidden={index !== selectedIndex}
            >
              <div className="relative h-[400px] w-full overflow-hidden">
                <img
                  src={HERO_IMAGE}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  // First slide is above the fold, so it must not be lazy.
                  loading={slide.id === 1 ? "eager" : "lazy"}
                  fetchPriority={slide.id === 1 ? "high" : "auto"}
                />
                {/* Design overlay: linear-gradient(90deg, rgba(0,201,80,.9), rgba(5,223,114,.5)) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,201,80,0.9)] to-[rgba(5,223,114,0.5)]" />
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-3xl text-white">
                      <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                        {slide.title}
                      </h1>
                      <p className="mb-6 text-base text-white/90 md:text-lg">{slide.subtitle}</p>
                      <div className="flex flex-wrap gap-3">
                        {/* `size="lg"` is h-9 (36px); these are the page's
                            primary actions and need a 44px touch target. */}
                        <Button
                          size="lg"
                          className="h-11 border-2 border-white/50 bg-white font-semibold text-[#00C950] hover:bg-white/90"
                          nativeButton={false}
                          render={<Link to={slide.primaryCta.href} />}
                        >
                          {slide.primaryCta.label}
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="h-11 border-2 border-white/50 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
                          nativeButton={false}
                          render={<Link to={slide.secondaryCta.href} />}
                        >
                          {slide.secondaryCta.label}
                        </Button>
                      </div>
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
          "absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg md:flex",
          "transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-ink" />
      </button>
      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg md:flex",
          "transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-ink" />
      </button>

      {/* Design `div.swiper-pagination`: 8px gaps, active bullet 32x12 and
          inactive 12x12, all fully rounded, ~16px above the bottom edge. */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2" role="tablist">
        {Array.from({ length: snapCount }, (_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            /* The bullet is only 12px tall, well under the 44px touch target.
               Making the button 44px tall would leave 16px between the bullets
               instead of the design's 8px, so the button keeps the bullet's own
               12px height and an invisible ::before widens the hit area
               vertically without disturbing the horizontal layout. */
            className={cn(
              "relative flex h-3 items-center justify-center rounded-full",
              "before:absolute before:inset-x-0 before:top-1/2 before:h-11 before:-translate-y-1/2 before:content-['']",
              "focus-visible:ring-2 focus-visible:ring-primary focus:outline-none"
            )}
            role="tab"
            aria-selected={index === selectedIndex}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-3 rounded-full transition-all duration-300",
                index === selectedIndex ? "w-8 bg-white" : "w-3 bg-white/50"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}