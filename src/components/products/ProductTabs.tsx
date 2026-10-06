"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ClipboardList, MessageSquare, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { effectivePrice, type Product, type Review } from "@/lib/types";
import { StarRating } from "./StarRating";

/**
 * The tabbed panel — product-details node `24:2571`.
 *
 * A white card (radius 8, `effect_c5bd7c6c`) with a bottom-bordered tab strip and
 * a 24px-gapped body. Active tab: `rgba(240,253,244,.5)` fill with a 2px
 * `#16A34A` underline and `#16A34A` text; inactive is `#6A7282` on transparent.
 *
 * The design only renders the Product Details panel — Reviews and Shipping are
 * labelled there but their contents were not exported. Reviews are built from
 * the `reviews` array the single-product endpoint returns (the list endpoint
 * omits it), and Shipping uses the same three promises as the trust strip.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

/**
 * Tab strip — `24:2572`.
 *
 * The design draws a 1px `#E5E7EB` rule under a horizontally scrollable row of
 * buttons. The active one (`24:2574`) is `rgba(240,253,244,0.5)` with a 2px
 * `#16A34A` bottom stroke, its label and its 17.5x14 glyph both `#16A34A`. The
 * inactive ones (`24:2580`, `24:2584`) have no fill and no stroke, with the
 * label and glyph in `#4A5565`. Padding is `16px 24px` and the gap is 8px.
 *
 * Three things have to be overridden explicitly, because base-nova's `line`
 * variant fights all of them:
 *
 * - `h-auto!` — the list defaults to a 32px pill row
 *   (`group-data-horizontal/tabs:h-8`) and the triggers to `h-[calc(100%-1px)]`.
 *   `!` is needed to beat a group-data utility.
 * - `flex-none` — the triggers default to `flex-1`, which stretches every label
 *   to a third of the row instead of letting it keep its own width.
 * - `after:hidden` — the `line` variant paints its own `::after` underline in
 *   `bg-foreground` at `bottom:-5px`. With a real 2px border underneath, the
 *   active tab drew two indicators five pixels apart and the dark one was the
 *   visible one.
 *
 * The inactive half-pixel of extra vertical padding is the design's own
 * (`16.5px ... 17.5px`): it keeps an inactive button exactly as tall as an active
 * one once that one grows its 2px border, so the row does not jump on click.
 */
const TAB_TRIGGER =
  "h-auto! flex-none gap-2 rounded-none border-b-2 px-6 py-4 text-base font-medium leading-6 " +
  // Inactive first, so the `data-active:` rules win on the properties they share.
  "border-transparent text-[#4A5565] hover:bg-[#F9FAFB] hover:text-[#364153] " +
  // `!` is required, not defensive. base-nova's `line` variant carries
  // `group-data-[variant=line]/tabs-list:data-active:bg-transparent`, which
  // compiles to two attribute selectors (0,2,0) and beats any single-class rule
  // (0,1,0) — so the design's fill was emitted and then silently overridden.
  // `rgb(240_253_244/0.5)` uses underscores rather than commas because an
  // arbitrary value containing commas after a custom variant is never emitted by
  // Tailwind at all. `bg-primary/50` is not a substitute: the slash modifier
  // resolves against `--color-primary` (#16A34A), giving green at 50% alpha
  // rather than the design's pale wash.
  "data-active:border-[#16A34A] data-active:!bg-[rgb(240_253_244/0.5)] data-active:text-[#16A34A] " +
  "data-active:shadow-none after:hidden";

/**
 * The design's glyphs are 17.5x14. base-nova sizes any SVG inside a trigger with
 * `[&_svg:not([class*='size-'])]:size-4`, and that selector wins over a plain
 * `h-3.5 w-[18px]`, so the size is expressed as `size-[18px]` to land inside the
 * `:not()` and take precedence.
 */
const TAB_ICON = "size-[18px] shrink-0";

/** The API returns `subcategory` as an array on every product, sometimes with one entry. */
function firstSubcategory(product: Product) {
  if (!product.subcategory) return undefined;
  return Array.isArray(product.subcategory) ? product.subcategory[0] : product.subcategory;
}

function subcategoryName(product: Product) {
  return firstSubcategory(product)?.name;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatSold(value?: number) {
  if (value == null) return null;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}

const KEY_FEATURES = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
] as const;

/**
 * Label on the left, value on the right. Both spans need `min-w-0` and the value
 * needs to be allowed to shrink: a long category name plus a long value
 * overflowed the card by 44px at 1024px wide, which added a horizontal scrollbar
 * to the whole page.
 */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-4">
      <span className="min-w-0 shrink text-sm font-medium text-slate-500">{label}</span>
      <span className="min-w-0 truncate text-right text-sm font-medium text-ink" title={value}>
        {value}
      </span>
    </li>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const rating = review.rating ?? 0;
  const date = formatDate(review.createdAt);

  return (
    <li className="rounded-lg bg-surface p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-ink">
            {review.user?.name || "Anonymous"}
          </span>
          <StarRating value={rating} className="size-3.5" />
        </div>
        {date && <span className="text-xs text-slate-500">{date}</span>}
      </div>
      {review.review && <p className="text-sm leading-6 text-[#6A7282]">{review.review}</p>}
    </li>
  );
}

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
}

export function ProductTabs({ product, reviews }: ProductTabsProps) {
  const categoryName = product.category?.name;
  const subName = subcategoryName(product);
  const brandName = product.brand?.name;
  const sold = formatSold(product.sold);
  const price = effectivePrice(product);

  const ratingCount = product.ratingsQuantity ?? reviews.length;
  const average = product.ratingsAverage ?? 0;

  return (
    <section className={`rounded-lg bg-white ${CARD_SHADOW}`} aria-label="Product information">
      <Tabs defaultValue="details" className="w-full gap-0">
        <TabsList
          variant="line"
          /*
           * `h-auto!` beats the base-nova `group-data-horizontal/tabs:h-8` pill
           * row. The bottom rule is the design's `#E5E7EB`, not the token
           * `--color-border` (`#D5DAE1`), which reads heavier than the design's
           * hairline. `scrollbar-hide` keeps the horizontal scroll the design
           * specifies from also showing a scrollbar on Windows.
           */
          className="h-auto! w-full justify-start gap-0 overflow-x-auto scrollbar-hide border-b border-[#E5E7EB] px-0 sm:px-0"
        >
          <TabsTrigger value="details" className={TAB_TRIGGER}>
            <ClipboardList aria-hidden="true" className={TAB_ICON} />
            Product Details
          </TabsTrigger>
          <TabsTrigger value="reviews" className={TAB_TRIGGER}>
            <MessageSquare aria-hidden="true" className={TAB_ICON} />
            Reviews ({ratingCount})
          </TabsTrigger>
          <TabsTrigger value="shipping" className={TAB_TRIGGER}>
            <Truck aria-hidden="true" className={TAB_ICON} />
            Shipping &amp; Returns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-4 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-ink">About this Product</h3>
              <p className="text-base font-medium leading-6 text-slate-500">
                {product.description || "No description available for this product."}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-surface p-4">
                <h4 className="mb-3 text-base font-medium text-ink">Product Information</h4>
                <ul className="space-y-2">
                  {categoryName && <InfoRow label="Category" value={categoryName} />}
                  {subName && <InfoRow label="Subcategory" value={subName} />}
                  {brandName && <InfoRow label="Brand" value={brandName} />}
                  <InfoRow label="Price" value={`${price.toFixed(2)} EGP`} />
                  {sold && <InfoRow label="Items Sold" value={`${sold} sold`} />}
                </ul>
              </div>

              <div className="rounded-lg bg-surface p-4">
                <h4 className="mb-3 text-base font-medium text-ink">Key Features</h4>
                <ul className="space-y-2">
                  {KEY_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-base font-medium text-[#364153]">
                      <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-ink">{average.toFixed(1)}</span>
                <span className="text-sm font-medium text-slate-500">out of 5</span>
              </div>
              <StarRating value={average} className="size-5" />
              <span className="text-sm font-medium text-slate-500">
                Based on {ratingCount} {ratingCount === 1 ? "review" : "reviews"}
              </span>
            </div>

            {reviews.length > 0 ? (
              <ul className="space-y-3">
                {reviews.map((review) => (
                  <ReviewRow key={review._id} review={review} />
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-surface p-6 text-center text-sm text-slate-500">
                No reviews yet. Be the first to share your experience.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="p-4 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-ink">Shipping &amp; Returns</h3>
              <p className="text-base font-medium leading-6 text-slate-500">
                Orders are packed and dispatched within 24 hours. Delivery takes 2–5 working days
                depending on your governorate, and is free on orders over 500 EGP.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Truck, title: "Free Delivery", body: "On orders over 500 EGP" },
                { icon: RotateCcw, title: "30 Days Return", body: "Money back guarantee" },
                { icon: ShieldCheck, title: "Secure Payment", body: "100% protected checkout" },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-lg bg-surface p-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <Icon aria-hidden="true" className="size-5 text-[#16A34A]" />
                  </div>
                  <h4 className="text-sm font-medium text-ink">{title}</h4>
                  <p className="text-xs font-medium text-slate-500">{body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-surface p-4">
              <h4 className="mb-2 text-base font-medium text-ink">Returns policy</h4>
              <p className="text-sm leading-6 text-slate-500">
                Items may be returned within 30 days of delivery in their original packaging.
                Refunds are issued to the original payment method within 5–7 working days of
                the item being received back at our warehouse.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
