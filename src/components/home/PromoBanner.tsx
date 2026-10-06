import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Promo cards — Figma `16:5039` (the two-card row on the home page).
 *
 * The design's cards are not "title + description + outlined CTA" as they were
 * before. Each is a 32px-padded gradient panel with two `rgba(255,255,255,0.1)`
 * circles bleeding off its corners, and a fixed vertical rhythm inside:
 *
 *   0    pill badge      `4px 12px`, `rgba(255,255,255,0.2)`, fully rounded
 *   44   title           30px bold (24px below `md`), white
 *   88   description     16px medium `rgba(255,255,255,0.8)`
 *   128  discount row    30px bold figure + 14px code, 16px apart
 *   188  CTA             `12px 24px` white pill, fully rounded, coloured label
 *
 * The circles are marked `aria-hidden` and carry no text, and the emoji in the
 * badge is the design's own glyph rather than an icon — it is decorative, so it is
 * hidden from assistive tech and the badge is named by its text alone.
 */

interface PromoCardProps {
  /** Decorative emoji in the pill badge. */
  emoji: string;
  badge: string;
  title: string;
  description: string;
  /** Large figure, e.g. "40% OFF". */
  offer: string;
  code: string;
  ctaText: string;
  ctaHref: string;
  /** Label colour for the white CTA pill — `#009966` green, `#FF6900` orange. */
  accent: string;
  gradient: string;
}

function PromoCard({
  emoji,
  badge,
  title,
  description,
  offer,
  code,
  ctaText,
  ctaHref,
  accent,
  gradient,
}: PromoCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8"
      style={{ background: gradient }}
    >
      {/* 16:5041 / 16:5043 — the two decorative circles. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[404px] top-[-80px] size-40 rounded-full bg-white/10 max-lg:left-auto max-lg:right-[-24px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-64px] top-[236px] size-32 rounded-full bg-white/10"
      />

      <div className="relative flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
          <span aria-hidden="true">{emoji}</span>
          {badge}
        </span>

        <h3 className="text-2xl font-bold leading-8 text-white md:text-[30px] md:leading-9">
          {title}
        </h3>

        <p className="max-w-2xl text-base font-medium leading-6 text-white/80">{description}</p>

        <div className="flex flex-wrap items-center gap-4">
          <span className="text-2xl font-bold leading-9 text-white md:text-[30px]">{offer}</span>
          <span className="text-sm font-medium leading-5 text-white/70">
            Use code: <strong className="font-bold text-white">{code}</strong>
          </span>
        </div>

        {/*
          * A single link rather than a card-wide link wrapping a button: nesting
          * an anchor inside an anchor is invalid HTML, and the card's copy is not
          * otherwise actionable.
          */}
        <Link
          to={ctaHref}
          className={cn(
            "mt-2 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-base font-semibold leading-6 text-white transition-transform hover:scale-[1.02] active:scale-[0.99]",
          )}
          style={{ background: "#FFFFFF", color: accent }}
        >
          {ctaText}
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
        </Link>
      </div>
    </div>
  );
}

export function PromoBanner() {
  return (
    <section className="container mx-auto px-4 py-6 md:py-10" aria-label="Promotions">
      {/* 16:5039 — two 724px cards with a 24px gap inside a 1472px row. */}
      <div className="grid gap-6 md:grid-cols-2">
        <PromoCard
          emoji="🔥"
          badge="Deal of the Day"
          title="Fresh Organic Fruits"
          description="Get up to 40% off on selected organic fruits"
          offer="40% OFF"
          code="ORGANIC40"
          ctaText="Shop Now"
          ctaHref="/products"
          accent="#009966"
          gradient="linear-gradient(170deg, #00BC7D 0%, #007A55 100%)"
        />

        <PromoCard
          emoji="✨"
          badge="New Arrivals"
          title="Exotic Vegetables"
          description="Discover our latest collection of premium vegetables"
          offer="25% OFF"
          code="FRESH25"
          ctaText="Explore Now"
          ctaHref="/products"
          accent="#FF6900"
          gradient="linear-gradient(170deg, #FF8904 0%, #FF2056 100%)"
        />
      </div>
    </section>
  );
}
