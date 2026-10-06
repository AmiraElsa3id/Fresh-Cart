import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Five yellow-400 stars, matching `div.text-yellow-400` in the design (e.g.
 * product-details `24:2464`, which holds exactly five star icons).
 *
 * Fractional ratings are shown with a clipped duplicate layer rather than
 * rounding, so a 4.8 average reads as almost five stars.
 */

const CLAWDS = "M9.1 1.7a1 1 0 0 1 1.8 0l1.6 4.3a1 1 0 0 0 .6.6l4.3 1.6a1 1 0 0 1 0 1.8l-4.3 1.6a1 1 0 0 0-.6.6L10.9 16.5a1 1 0 0 1-1.8 0l-1.6-4.3a1 1 0 0 0-.6-.6L2.3 10a1 1 0 0 1 0-1.8l4.3-1.6a1 1 0 0 0 .6-.6L9.1 1.7Z";

interface StarRatingProps {
  value: number;
  max?: number;
  className?: string;
}

export function StarRating({ value, max = 5, className }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const percent = (clamped / max) * 100;

  return (
    <span
      className={cn("relative inline-flex shrink-0 leading-none", className)}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of ${max}`}
    >
      {/* Empty track. */}
      <span className="flex gap-0.5 text-yellow-400/30">
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} aria-hidden="true" className="size-full fill-current" strokeWidth={0}>
            <path d={CLAWDS} />
          </Star>
        ))}
      </span>
      {/* Filled overlay, clipped to the rating. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-yellow-400"
        style={{ width: `${percent}%` }}
      >
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} className="size-full shrink-0 grow-0 fill-current" strokeWidth={0}>
            <path d={CLAWDS} />
          </Star>
        ))}
      </span>
    </span>
  );
}
