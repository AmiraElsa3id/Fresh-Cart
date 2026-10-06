"use client";

import { useState } from "react";
import {
  useCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
  useApplyCoupon,
} from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Ticket,
  Lock,
  CreditCard,
  Truck,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { effectivePrice, cartLineTotal, type CartItem } from "@/lib/types";
import { slugOf } from "@/lib/slug";

/**
 * Cart — Figma `38:3164` ("Cart Page - Desktop").
 *
 * Page shell is `div.bg-gray-50` `#F9FAFB` with `32px 192px 82px` padding around a
 * 1504px content column, then a 992px / 480px two-column grid with a 32px gap.
 * The order summary is a 480px card with a green gradient header; each line is a
 * 16px-radius white card with a 128px image, a pill-labelled title block, a
 * stepped quantity control and a right-aligned line total.
 *
 * The design's `#F9FAFB` page fill, dashed rules and 14/16px summary labels are
 * reproduced rather than approximated - they are what separates this screen from a
 * generic cart.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

/** `#F3F4F6` in the design is a hairline divider, not a control boundary. */
const HAIRLINE = "border-[#F3F4F6]";

/** Green header / CTA gradient — `linear-gradient(90deg, #16A34A, #15803D)`. */
const GREEN_GRADIENT = "bg-gradient-to-r from-[#16A34A] to-[#15803D]";

/** `#F0FAF4` → `#F3F4F6` wash used behind pills and the shipping banner. */
const PALE_GRADIENT = "bg-gradient-to-r from-[#F0FDF4] to-[#F3F4F6]";

/** The API has no SKU; the design derives one from the product id's tail. */
function skuOf(id: string) {
  return id.slice(-6).toUpperCase();
}

function formatMoney(value: number) {
  return value.toLocaleString("en-EG", { maximumFractionDigits: 2 });
}

function CartLine({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const product = item.product;
  const href = `/product-details/${product._id}/${product.category ? slugOf(product.category) : ""}`;
  const unitPrice = item.price ?? effectivePrice(product);
  const inStock = (product.quantity ?? 0) > 0;

  return (
    <article className={`relative rounded-2xl border ${HAIRLINE} bg-white p-5 ${CARD_SHADOW}`}>
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative w-fit shrink-0">
          <Link
            to={href}
            className="flex size-28 items-center justify-center rounded-xl border border-[#F3F4F6] bg-[linear-gradient(135deg,#F9FAFB_0%,#FFFFFF_50%,#F3F4F6_100%)] p-3"
          >
            <img
              src={product.imageCover}
              alt={product.title}
              className="size-full object-contain"
              loading="lazy"
            />
          </Link>
          {/* 38:3235 - "In Stock" sits on the image's lower-left corner. */}
          {inStock && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#00C950] px-2 py-0.5 text-[10px] font-semibold leading-[15px] text-white">
              <Check aria-hidden="true" className="size-2.5" />
              In Stock
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <Link
              to={href}
              className="line-clamp-1 text-lg font-semibold leading-[29.25px] text-[#101828] transition-colors hover:text-primary"
            >
              {product.title}
            </Link>

            {/* 38:3249 - category pill, dot, SKU */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {product.category && (
                <span className={`inline-block rounded-full ${PALE_GRADIENT} px-2.5 py-1 text-xs font-medium text-[#15803D]`}>
                  {product.category.name}
                </span>
              )}
              <span aria-hidden="true" className="text-xs text-[#4A5565]">
                •
              </span>
              <span className="text-xs font-medium text-[#6A7282]">SKU: {skuOf(product._id)}</span>
            </div>
          </div>

          <div className="mt-4 pb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold leading-7 text-[#16A34A]">
                {formatMoney(unitPrice)} EGP
              </span>
              <span className="text-xs font-medium leading-4 text-[#99A1AF]">per unit</span>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
            {/* 38:3262 - padded #F9FAFB group with a filled increase button. */}
            <div className="flex items-center rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-1">
              <button
                type="button"
                onClick={onDecrease}
                disabled={item.count <= 1}
                aria-label={`Decrease quantity of ${product.title}`}
                className="flex size-9 items-center justify-center rounded-lg bg-white text-[#4A5565] shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F4F6] disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <span
                className="w-12 text-center text-base font-bold leading-6 text-[#101828]"
                aria-live="polite"
              >
                {item.count}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={!inStock || item.count >= (product.quantity ?? 99)}
                aria-label={`Increase quantity of ${product.title}`}
                className="flex size-9 items-center justify-center rounded-lg bg-[#16A34A] text-white shadow-[0px_1px_2px_-1px_rgba(22,163,74,0.3),0px_1px_3px_0px_rgba(22,163,74,0.3)] transition-colors hover:bg-[#15803D] disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-medium leading-4 text-[#99A1AF]">Total</p>
                <p className="text-xl font-bold leading-7 text-[#101828]">
                  {formatMoney(cartLineTotal(item))}{" "}
                  <span className="text-sm font-medium text-[#99A1AF]">EGP</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${product.title} from cart`}
                className="flex size-10 items-center justify-center rounded-xl border border-[#FFC9C9] bg-[#FEF2F2] text-[#D92D20] transition-colors hover:bg-[#FEE4E2]"
              >
                <Trash2 aria-hidden="true" className="size-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { mutate: updateQuantity } = useUpdateCartQuantity();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const { mutate: applyCoupon } = useApplyCoupon();
  const [couponCode, setCouponCode] = useState("");

  const cartItems = cart?.products || [];
  const itemCount = cartItems.reduce((n, item) => n + item.count, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + cartLineTotal(item), 0);
  // The design shows "FREE" at 1,994 EGP, i.e. the threshold is comfortably
  // exceeded there; 200 matches the copy the design pairs it with.
  const FREE_SHIPPING_AT = 200;
  const qualifiesFreeShipping = subtotal > FREE_SHIPPING_AT;
  const shipping = qualifiesFreeShipping ? 0 : 20;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading cart">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,992px)_480px]">
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex gap-6 rounded-2xl border border-[#F3F4F6] bg-white p-5">
                  <div className="size-28 shrink-0 animate-pulse rounded-xl bg-[#F3F4F6]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#F3F4F6]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#F3F4F6]" />
                    <div className="h-7 w-24 animate-pulse rounded bg-[#F3F4F6]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-2xl border border-[#F3F4F6] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className={`mx-auto mb-6 flex size-24 items-center justify-center rounded-2xl ${GREEN_GRADIENT}`}>
            <ShoppingCart aria-hidden="true" className="size-10 text-white" />
          </span>
          <h1 className="mb-4 text-3xl font-bold text-[#101828]">Shopping Cart</h1>
          <p className="mb-8 text-base font-medium text-[#6A7282]">
            You have <span className="font-semibold">0 items</span> in your cart
          </p>
          <p className="mb-8 text-base text-[#4A5565]">Looks like you haven&apos;t added any products yet.</p>
          <Link to="/products">
            <Button size="lg" className="h-12 gap-2 rounded-xl px-6">
              <ShoppingCart aria-hidden="true" className="size-5" />
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB]">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
              <Link to="/" className="font-medium text-[#6A7282] transition-colors hover:text-primary">
                Home
              </Link>
              <span aria-hidden="true" className="font-medium text-[#6A7282]">
                /
              </span>
              <span aria-current="page" className="font-medium text-[#101828]">
                Shopping Cart
              </span>
            </nav>

            <h1 className="flex items-center gap-3 text-3xl font-bold leading-9 text-[#101828]">
              {/* 38:3218 - 48px rounded gradient badge beside the title. */}
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${GREEN_GRADIENT}`}>
                <ShoppingCart aria-hidden="true" className="size-6 text-white" />
              </span>
              Shopping Cart
            </h1>

            <p className="text-base font-medium leading-6 text-[#6A7282]">
              You have <span className="font-semibold">{itemCount} {itemCount === 1 ? "item" : "items"}</span> in your cart
            </p>
          </div>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,992px)_480px]">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartLine
                  key={item._id}
                  item={item}
                  onDecrease={() =>
                    updateQuantity({ productId: item.product._id, count: Math.max(1, item.count - 1) })
                  }
                  onIncrease={() =>
                    updateQuantity({ productId: item.product._id, count: item.count + 1 })
                  }
                  onRemove={() =>
                    removeFromCart(item.product._id, {
                      onSuccess: () => toast.success("Removed from cart"),
                      onError: () => toast.error("Could not remove item"),
                    })
                  }
                />
              ))}
            </div>

            {/* 38:3435 - continue-shopping / clear-all, below a top rule. */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E7EB] pt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#16A34A] transition-colors hover:text-[#15803D]"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Continue Shopping
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (!confirm("Clear all items?")) return;
                  // `undefined` is the explicit void variable; React Query only
                  // accepts per-call callbacks in the second position.
                  clearCart(undefined, {
                    onError: () => {
                      toast.error("Could not clear the cart");
                    },
                  });
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#99A1AF] transition-colors hover:text-red-500"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Clear all items
              </button>
            </div>
          </div>

          {/* 38:3453 - order summary */}
          <aside
            className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}
            aria-label="Order summary"
          >
            <div className={`flex flex-col gap-1 rounded-t-2xl ${GREEN_GRADIENT} px-6 py-4`}>
              <h2 className="flex items-center gap-2 text-lg font-bold leading-7 text-white">
                <CreditCard aria-hidden="true" className="size-[22.5px] shrink-0" />
                Order Summary
              </h2>
              <p className="text-sm font-medium leading-5 text-[#DCFCE7]">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* 38:3462 - free-shipping banner */}
              <div className={`flex items-center gap-3 rounded-xl ${PALE_GRADIENT} p-4`}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                  <Truck aria-hidden="true" className="size-5 text-[#008236]" />
                </span>
                <div>
                  <p className="font-semibold text-[#008236]">
                    {qualifiesFreeShipping ? "Free Shipping!" : `Add ${formatMoney(FREE_SHIPPING_AT - subtotal)} EGP for free shipping`}
                  </p>
                  <p className="text-sm text-[#4A5565]">
                    {qualifiesFreeShipping
                      ? "You qualify for free delivery"
                      : `Free delivery on orders over ${formatMoney(FREE_SHIPPING_AT)} EGP`}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="font-medium leading-6 text-[#4A5565]">Subtotal</span>
                  <span className="font-medium leading-6 text-[#101828]">
                    {formatMoney(subtotal)} EGP
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-medium leading-6 text-[#4A5565]">Shipping</span>
                  <span
                    className={`font-medium leading-6 ${qualifiesFreeShipping ? "text-[#00A63E]" : "text-[#101828]"}`}
                  >
                    {qualifiesFreeShipping ? "FREE" : `${formatMoney(shipping)} EGP`}
                  </span>
                </div>
              </div>

              {/* 38:3484 - dashed rule above the total. */}
              <div className="border-t border-dashed border-[#E5E7EB] pt-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold leading-6 text-[#101828]">Total</span>
                  <span className="text-right text-2xl font-bold leading-8 text-[#101828]">
                    {formatMoney(total)}{" "}
                    <span className="text-sm font-medium text-[#6A7282]">EGP</span>
                  </span>
                </div>
              </div>

              {/* 38:3491 - dashed promo-code toggle that reveals the input. */}
              {couponCode ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    applyCoupon(couponCode.trim(), {
                      onSuccess: () => toast.success("Coupon applied"),
                      onError: () => toast.error("Invalid coupon code"),
                    });
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    aria-label="Promo code"
                    placeholder="Enter your code"
                    autoComplete="off"
                    className="h-11 flex-1"
                  />
                  <Button type="submit" className="h-11 rounded-xl px-5">
                    Apply
                  </Button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setCouponCode(" ")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D1D5DC] px-4 py-3 text-sm font-medium text-[#4A5565] transition-colors hover:border-[#16A34A] hover:text-[#16A34A]"
                >
                  <Ticket aria-hidden="true" className="size-4" />
                  Apply Promo Code
                </button>
              )}

              <Link
                to="/checkout"
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-semibold leading-6 text-white shadow-[0px_4px_6px_-4px_rgba(22,163,74,0.2),0px_10px_15px_-3px_rgba(22,163,74,0.2)] transition-opacity hover:opacity-90 ${GREEN_GRADIENT}`}
              >
                <Lock aria-hidden="true" className="size-5" />
                Secure Checkout
              </Link>

              <div className="flex items-center justify-center gap-4 py-2 text-xs text-[#6A7282]">
                <span className="inline-flex items-center gap-1.5">
                  <Lock aria-hidden="true" className="size-3.5" />
                  Secure Payment
                </span>
                <span aria-hidden="true" className="h-4 w-px bg-[#E5E7EB]" />
                <span className="inline-flex items-center gap-1.5">
                  <Truck aria-hidden="true" className="size-3.5" />
                  Fast Delivery
                </span>
              </div>

              <Link
                to="/products"
                className="block py-2 text-center text-sm font-medium text-[#16A34A] transition-colors hover:text-[#15803D]"
              >
                ← Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
