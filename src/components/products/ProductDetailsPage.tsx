"use client";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

import { useProduct, useProducts, useAddToCart, useAddToWishlist } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductGallery } from "./ProductGallery";
import { ProductTabs } from "./ProductTabs";
import { StarRating } from "./StarRating";
import { ProductCard } from "./ProductCard";
import { effectivePrice, type Product } from "@/lib/types";
import { slugOf } from "@/lib/slug";

/**
 * Product details — Figma node `24:2340` ("Product Details Page - Desktop").
 *
 * Layout: breadcrumb, then a 32px-gapped two-column row (376px gallery / info
 * card), the tabbed panel, "You May Also Like", and the 4-item trust strip.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

/** The API returns `subcategory` as an array on every product, sometimes with one entry. */
function firstSubcategory(product: Product) {
  if (!product.subcategory) return undefined;
  return Array.isArray(product.subcategory) ? product.subcategory[0] : product.subcategory;
}

function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={className}>
      {value.toFixed(2)} <span className="text-base font-medium">EGP</span>
    </span>
  );
}

function DetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading product">
      <Skeleton className="mb-6 h-4 w-72" />
      <div className="grid gap-8 lg:grid-cols-[376px_1fr]">
        <div className={`rounded-xl bg-white p-4 ${CARD_SHADOW}`}>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

/** "You May Also Like" — product-details container `16:5092`/`24:2653`. */
function RelatedProducts({ product }: { product: Product }) {
  const { data: products } = useProducts();

  /*
   * Same-category first, then filled out with the rest of the catalogue so the
   * row is never empty on a category with one product.
   */
  const related = (products ?? [])
    .filter((item) => item._id !== product._id)
    .sort((a, b) => {
      const aMatch = a.category?._id === product.category?._id ? 0 : 1;
      const bMatch = b.category?._id === product.category?._id ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 10);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    // Percentage-based breakpoints keep this in step with the fixed card widths.
    breakpoints: {
      sm: { slidesToScroll: 2 },
      md: { slidesToScroll: 3 },
      lg: { slidesToScroll: 4 },
    },
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (related.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6" aria-labelledby="related-products">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#00BC7D] to-[#007A55]"
          />
          <h2 id="related-products" className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
            You May Also <span className="text-primary">Like</span>
          </h2>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={scrollPrev}
            aria-label="Previous related products"
            className="h-11 w-11 rounded-md border-[#E5E7EB] p-0"
          >
            <ChevronRight aria-hidden="true" className="size-5 rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={scrollNext}
            aria-label="Next related products"
            className="h-11 w-11 rounded-md border-[#E5E7EB] p-0"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </Button>
        </div>
      </div>

      {/* Viewport wrapper is required: embla measures the container's overflow
          against the ref element, and without a separate viewport there is no
          scroll range. */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {related.map((item) => (
            <div
              key={item._id}
              className="min-w-0 flex-[0_0_72%] sm:flex-[0_0_46%] md:flex-[0_0_31%] lg:flex-[0_0_23%]"
            >
              <ProductCard product={item} className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The 4-item strip — `div.bg-primary-50` `24:2910`. */
function TrustStrip() {
  const items = [
    { icon: Truck, title: "Free Shipping", body: "On orders over 500 EGP" },
    { icon: RotateCcw, title: "Easy Returns", body: "14-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", body: "100% secure checkout" },
    { icon: Truck, title: "24/7 Support", body: "Contact us anytime" },
  ];

  return (
    <section className="border-t border-[#DCFCE7] bg-[#F0FDF4]" aria-label="Why shop with us">
      <div className="container mx-auto grid gap-6 px-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white">
              <Icon aria-hidden="true" className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              <p className="text-xs font-medium text-slate-500">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || "");
  const { mutate: addToCart, isPending: cartPending } = useAddToCart();
  const { mutate: addToWishlist, isPending: wishlistPending } = useAddToWishlist();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) return <DetailsSkeleton />;

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-ink">Product Not Found</h1>
        <p className="mb-8 text-slate-500">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
        >
          <ArrowRight aria-hidden="true" className="size-4 rotate-180" />
          Back to Products
        </Link>
      </div>
    );
  }

  const price = effectivePrice(product);
  const hasDiscount = price < product.price;
  const stock = product.quantity ?? 0;
  const sub = firstSubcategory(product);
  const category = product.category;
  const ratingCount = product.ratingsQuantity ?? 0;
  const average = product.ratingsAverage ?? 0;
  const total = price * quantity;

  // `imageCover` is the canonical first frame; `images` can be absent or empty.
  const images = [product.imageCover, ...(product.images ?? []).filter((src) => src !== product.imageCover)];

  const clampQuantity = (next: number) => setQuantity(Math.max(1, Math.min(next, Math.max(1, stock))));

  const handleAddToCart = () => {
    addToCart(product._id, {
      onSuccess: () => toast.success(`${product.title} added to cart`),
      onError: () => toast.error("Could not add to cart. Please try again."),
    });
  };

  const handleWishlist = () => {
    addToWishlist(product._id, {
      onSuccess: () => toast.success(`${product.title} saved to wishlist`),
      onError: () => toast.error("Could not save to wishlist."),
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm" aria-label="Breadcrumb">
          <Link to="/" className="font-medium text-slate-500 transition-colors hover:text-primary">
            Home
          </Link>
          <ChevronRight aria-hidden="true" className="size-4 text-slate-500" />

          {category && (
            <>
              <Link
                to={`/category/subcategories/${slugOf(category)}`}
                className="font-medium text-slate-500 transition-colors hover:text-primary"
              >
                {category.name}
              </Link>
              <ChevronRight aria-hidden="true" className="size-4 text-slate-500" />
            </>
          )}

          {category && sub && (
            <>
              <Link
                to={`/category/subcategories/${slugOf(category)}/${slugOf(sub)}`}
                className="font-medium text-slate-500 transition-colors hover:text-primary"
              >
                {sub.name}
              </Link>
              <ChevronRight aria-hidden="true" className="size-4 text-slate-500" />
            </>
          )}

          <span className="truncate font-medium text-ink" aria-current="page">
            {product.title}
          </span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[376px_1fr]">
          {/*
          * The design's 376px gallery column is a desktop measurement. Below `lg`
          * the two columns stack, and an unconstrained square image would grow to
          * the full content width - 689px at 768px, 344px at 1024px - which is
          * far larger than the design's card. Capping the column keeps the card at
          * a readable size on tablet and phone.
          */}
        <div className="w-full max-w-[440px] justify-self-center lg:max-w-none lg:justify-self-stretch">
          <ProductGallery images={images} title={product.title} />
        </div>

          <div className={`flex flex-col gap-6 rounded-xl bg-white p-6 ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Link
                  to={`/category/subcategories/${slugOf(category)}`}
                  className="rounded-full bg-[#F0FDF4] px-3 py-1.5 text-xs font-medium text-[#15803D] transition-colors hover:bg-[#DCFCE7]"
                >
                  {category.name}
                </Link>
              )}
              {product.brand && (
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs font-medium text-[#364153]">
                  {product.brand.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">{product.title}</h1>

            <div className="flex items-center gap-3">
              <StarRating value={average} className="size-4" />
              <span className="text-sm font-medium text-slate-500">
                {average.toFixed(1)} ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <Price value={price} className="text-3xl font-bold text-ink" />
              {hasDiscount && (
                <>
                  <span className="text-xl font-medium text-slate-500 line-through">
                    {product.price} EGP
                  </span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                    -{Math.round(((product.price - price) / product.price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 ${
                stock > 0 ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${stock > 0 ? "bg-[#00C950]" : "bg-red-500"}`}
              />
              <span className={`text-sm font-medium ${stock > 0 ? "text-[#008236]" : "text-red-500"}`}>
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </span>

            <div className="border-t border-border pt-5">
              <p className="text-base font-medium leading-6 text-slate-500">
                {product.description || "No description available for this product."}
              </p>
            </div>

            <div>
              <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-[#364153]">
                Quantity
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center rounded-lg border-2 border-[#E5E7EB]">
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    id="decrease-qty"
                    onClick={() => clampQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="h-11 w-11 rounded-l-lg disabled:opacity-40"
                  >
                    <Minus aria-hidden="true" />
                  </Button>
                  <input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={Math.max(1, stock)}
                    value={quantity}
                    onChange={(event) => {
                      const parsed = Number.parseInt(event.target.value, 10);
                      if (Number.isNaN(parsed)) return;
                      clampQuantity(parsed);
                    }}
                    className="w-16 border-0 bg-transparent text-center text-lg font-medium text-[#364153] focus-visible:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    id="increase-qty"
                    onClick={() => clampQuantity(quantity + 1)}
                    disabled={quantity >= stock}
                    aria-label="Increase quantity"
                    className="h-11 w-11 rounded-r-lg disabled:opacity-40"
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </div>
                <span className="text-sm font-medium text-slate-500">{stock} available</span>
              </div>
            </div>

            <div className="rounded-lg bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-base font-medium text-slate-500">Total Price:</span>
                <Price value={total} className="text-2xl font-bold text-primary" />
              </div>
            </div>

            {/*
              * `flex-1` on both: the design's two buttons share the row equally
              * (`div.flex` with `justifyContent: space-between` and two
              * `layout: horizontal fill` buttons). Without it they size to their
              * content and leave the row half empty.
              */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                id="add-to-cart"
                onClick={handleAddToCart}
                disabled={cartPending || stock === 0}
                className="h-13 flex-1 gap-2 rounded-xl px-6 py-3.5 text-base font-medium shadow-[0px_4px_6px_-4px_rgba(22,163,74,0.25),0px_10px_15px_-3px_rgba(22,163,74,0.25)]"
              >
                <ShoppingCart aria-hidden="true" />
                {cartPending ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                id="buy-now"
                onClick={handleAddToCart}
                disabled={cartPending || stock === 0}
                className="h-13 flex-1 gap-2 rounded-xl bg-ink px-6 py-3.5 text-base font-medium hover:bg-ink/90"
              >
                <ShoppingCart aria-hidden="true" />
                Buy Now
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                id="wishlist-button"
                variant="outline"
                onClick={handleWishlist}
                disabled={wishlistPending}
                className="h-13 flex-1 gap-2 rounded-xl border-2 border-[#E5E7EB] px-4 py-3.5 text-base font-medium text-[#364153]"
              >
                <Heart aria-hidden="true" />
                {wishlistPending ? "Saving..." : "Add to Wishlist"}
              </Button>
            </div>

            <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Free Delivery", body: "Orders over 500 EGP" },
                { icon: RotateCcw, title: "30 Days Return", body: "Money back" },
                { icon: ShieldCheck, title: "Secure Payment", body: "100% Protected" },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <Icon aria-hidden="true" className="size-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-ink">{title}</h2>
                    <p className="text-xs font-medium text-slate-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ProductTabs product={product} reviews={product.reviews ?? []} />
        </div>
      </div>

      <RelatedProducts product={product} />
      <TrustStrip />
    </>
  );
}
