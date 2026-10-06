"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  Info,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Wallet,
} from "lucide-react";
import { useCart, useCreateCashOrder, useCreateCheckoutSession } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/api";
import { phoneField } from "@/lib/auth-schemas";
import { cartLineTotal } from "@/lib/types";

/**
 * Checkout — Figma `38:5629` ("Checkout Page - Desktop").
 *
 * A single page, not a wizard: the design has no step indicator, just a
 * `992px / 480px` two-column grid under a breadcrumb and a title row whose
 * right-hand action is "Back to Cart".
 *
 * Left column: a "Shipping Address" card (green gradient header, saved-address
 * picker, a blue delivery-information note, then the fields) and a "Payment
 * Method" card (two large selectable rows plus an encryption note). Right
 * column: the "Order Summary" card that the cart page also uses.
 *
 * The saved-address list has no API behind it on this public backend, so the
 * "add a new address" affordance is rendered and the form below is the working
 * path rather than a row that does nothing.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";
const HAIRLINE = "border-[#F3F4F6]";
const GREEN_GRADIENT = "bg-gradient-to-r from-[#16A34A] to-[#15803D]";
/** 38:5688 and 38:5807 use the same two stops rotated 135° instead of 90°. */
const GREEN_GRADIENT_DIAGONAL = "bg-gradient-to-br from-[#16A34A] to-[#15803D]";
const PALE_GRADIENT = "bg-gradient-to-r from-[#F0FDF4] to-[#F3F4F6]";

const FREE_SHIPPING_AT = 200;

function formatMoney(value: number) {
  return value.toLocaleString("en-EG", { maximumFractionDigits: 2 });
}

/** The design's field label: `text-sm font-medium` with a red asterisk. */
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-[#1E2939]">
      {children}
      <span aria-hidden="true" className="text-[#D92D20]">
        *
      </span>
    </Label>
  );
}

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: phoneField(),
  city: z.string().trim().min(2, "City is required"),
  // One free-text street line, as the design's `textarea#details`, rather than
  // the building/floor/apartment breakdown the previous form used.
  details: z.string().trim().min(4, "Street address is required"),
  landmark: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"], {
    required_error: "Choose a payment method",
    invalid_type_error: "Choose a payment method",
  }),
  notes: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { mutate: createCashOrder, isPending: cashPending } = useCreateCashOrder();
  const { mutate: createCheckoutSession, isPending: cardPending } = useCreateCheckoutSession();
  const [error, setError] = useState("");

  /*
   * Before every early return below. It used to sit after them, so a cart that
   * started empty or loading rendered a different number of hooks than the same
   * component once the cart resolved - React error #310 and a blank page.
   */
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      details: "",
      landmark: "",
      notes: "",
      paymentMethod: "cash",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const cartItems = cart?.products || [];
  const itemCount = cartItems.reduce((n, item) => n + item.count, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + cartLineTotal(item), 0);
  const qualifiesFreeShipping = subtotal > FREE_SHIPPING_AT;
  const shipping = qualifiesFreeShipping ? 0 : 20;
  const total = subtotal + shipping;
  const pending = cashPending || cardPending;

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <p className="text-base font-medium text-[#6A7282]">Redirecting to login…</p>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="bg-[linear-gradient(180deg,#F9FAFB_0%,#FFFFFF_100%)]">
        <div className="container mx-auto px-4 py-8" role="status" aria-label="Loading checkout">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,992px)_480px]">
            <div className="space-y-6">
              <div className="h-40 animate-pulse rounded-2xl border border-[#F3F4F6] bg-white" />
              <div className="h-64 animate-pulse rounded-2xl border border-[#F3F4F6] bg-white" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl border border-[#F3F4F6] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-[linear-gradient(180deg,#F9FAFB_0%,#FFFFFF_100%)]">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className={`mx-auto mb-6 flex size-24 items-center justify-center rounded-2xl ${GREEN_GRADIENT}`}>
            <ShoppingCart aria-hidden="true" className="size-10 text-white" />
          </span>
          <h1 className="mb-2 text-3xl font-bold text-[#101828]">Checkout</h1>
          <p className="mb-8 text-base font-medium text-[#6A7282]">Your cart is empty</p>
          <Link
            to="/cart"
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-medium text-white shadow-[0px_4px_6px_-4px_rgba(22,163,74,0.2),0px_10px_15px_-3px_rgba(22,163,74,0.2)] ${GREEN_GRADIENT}`}
          >
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = (data: ShippingFormData) => {
    setError("");
    if (!cart?.cartId) {
      setError("Your cart could not be loaded. Please go back and try again.");
      return;
    }

    const shippingAddress = {
      details: data.details + (data.landmark ? `, Near ${data.landmark}` : ""),
      phone: data.phone,
      city: data.city,
      postalCode: "00000",
    };

    if (data.paymentMethod === "cash") {
      createCashOrder(
        { cartId: cart.cartId, shippingAddress },
        {
          onSuccess: () => {
            toast.success("Order placed successfully!");
            navigate("/orders");
          },
          onError: (err) => setError(apiErrorMessage(err, "Failed to place order. Please try again.")),
        },
      );
      return;
    }

    createCheckoutSession(
      { cartId: cart.cartId, shippingAddress },
      {
        onSuccess: (res) => {
          if (res.session?.url) window.location.href = res.session.url;
          else setError("The payment provider did not return a checkout link.");
        },
        onError: (err) => setError(apiErrorMessage(err, "Failed to create checkout session.")),
      },
    );
  };

  return (
    <div className="bg-[linear-gradient(180deg,#F9FAFB_0%,#FFFFFF_100%)]">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
        <header className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
            <Link to="/" className="font-medium text-[#6A7282] transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight aria-hidden="true" className="size-4 text-[#D1D5DC]" />
            <Link to="/cart" className="font-medium text-[#6A7282] transition-colors hover:text-primary">
              Cart
            </Link>
            <ChevronRight aria-hidden="true" className="size-4 text-[#D1D5DC]" />
            <span aria-current="page" className="font-medium text-[#101828]">
              Checkout
            </span>
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="flex items-center gap-3 text-3xl font-bold leading-9 text-[#101828]">
                {/* 38:5688 - 48px badge, diagonal rather than horizontal. */}
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${GREEN_GRADIENT_DIAGONAL}`}
                >
                  <Wallet aria-hidden="true" className="size-6 text-white" />
                </span>
                Checkout
              </h1>
              <p className="text-base font-medium leading-6 text-[#6A7282]">
                Review your items and complete your purchase
              </p>
            </div>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-[#16A34A] transition-colors hover:bg-[#F0FDF4]"
            >
              <ShoppingCart aria-hidden="true" className="size-4" />
              Back to Cart
            </Link>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" role="alert">
            <AlertCircle aria-hidden="true" className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,992px)_480px]"
        >
          <div className="flex flex-col gap-6">
            {/* ---------------------------------------------- shipping address */}
            <section className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}>
              <div className={`flex flex-col gap-1 rounded-t-2xl ${GREEN_GRADIENT} px-6 py-4`}>
                <h2 className="flex items-center gap-2 text-lg font-bold leading-7 text-white">
                  <MapPin aria-hidden="true" className="size-[22.5px] shrink-0" />
                  Shipping Address
                </h2>
                <p className="text-sm font-medium leading-5 text-[#DCFCE7]">
                  Where should we deliver your order?
                </p>
              </div>

              <div className="flex flex-col gap-5 p-6">
                {/* 38:5712 - saved addresses, above a hairline. */}
                <div className="flex flex-col gap-3 border-b border-[#F3F4F6] pb-5">
                  <h3 className="flex items-center gap-2 font-semibold text-[#1E2939]">
                    <MapPin aria-hidden="true" className="size-4" />
                    Saved Addresses
                  </h3>
                  <p className="text-sm leading-5 text-[#4A5565]">
                    Select a saved address or enter a new one below
                  </p>
                  <p className="rounded-xl border-2 border-dashed border-[#22C55E] bg-[#F6FEF9] p-4 text-sm text-[#4A5565]">
                    No saved addresses on this account yet — fill in the form below and it will be
                    used for this order.
                  </p>
                </div>

                {/* 38:5750 - blue delivery-information note. */}
                <div className="flex items-center gap-3 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <Info aria-hidden="true" className="size-4 text-[#155DFC]" />
                  </span>
                  <div>
                    <p className="text-sm text-[#193CB8]">Delivery Information</p>
                    <p className="text-xs text-[#155DFC]">
                      Please ensure your address is accurate for smooth delivery
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="fullName">Full Name </FieldLabel>
                    <Input id="fullName" autoComplete="name" placeholder="John Doe" {...register("fullName")} />
                    {errors.fullName && (
                      <p role="alert" className="mt-1.5 text-sm text-red-500">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor="city">City </FieldLabel>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      placeholder="e.g. Cairo, Alexandria, Giza"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p role="alert" className="mt-1.5 text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="details">Street Address </FieldLabel>
                  <Input
                    id="details"
                    autoComplete="street-address"
                    placeholder="Street name, building number, floor, apartment..."
                    {...register("details")}
                  />
                  {errors.details && (
                    <p role="alert" className="mt-1.5 text-sm text-red-500">
                      {errors.details.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="phone">Phone Number </FieldLabel>
                    <div className="relative">
                      <Phone
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6A7282]"
                      />
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="01xxxxxxxxx"
                        className="pl-10 pr-36"
                        {...register("phone")}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#99A1AF]">
                        Egyptian numbers only
                      </span>
                    </div>
                    {errors.phone && (
                      <p role="alert" className="mt-1.5 text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor="landmark">Nearby Landmark (optional)</FieldLabel>
                    <Input id="landmark" placeholder="e.g. Near Metro Station" {...register("landmark")} />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="notes">Delivery Notes (optional)</FieldLabel>
                  <Input
                    id="notes"
                    placeholder="Call before delivery, leave at the door, etc."
                    {...register("notes")}
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------ payment method */}
            <section className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}>
              <div className={`flex flex-col gap-1 rounded-t-2xl ${GREEN_GRADIENT} px-6 py-4`}>
                <h2 className="flex items-center gap-2 text-lg font-bold leading-7 text-white">
                  <CreditCard aria-hidden="true" className="size-[22.5px] shrink-0" />
                  Payment Method
                </h2>
                <p className="text-sm font-medium leading-5 text-[#DCFCE7]">
                  Choose how you&apos;d like to pay
                </p>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <PaymentOption
                  value="cash"
                  selected={paymentMethod === "cash"}
                  register={register}
                  icon={
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] shadow-[0px_4px_6px_-4px_rgba(34,197,94,0.3),0px_10px_15px_-3px_rgba(34,197,94,0.3)]">
                      <Banknote aria-hidden="true" className="size-6 text-white" />
                    </span>
                  }
                  title="Cash on Delivery"
                  titleClass="text-[#15803D]"
                  description="Pay when your order arrives at your doorstep"
                />

                <PaymentOption
                  value="card"
                  selected={paymentMethod === "card"}
                  register={register}
                  icon={
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F3F4F6]">
                      <CreditCard aria-hidden="true" className="size-6 text-[#4A5565]" />
                    </span>
                  }
                  title="Pay Online"
                  titleClass="text-[#101828]"
                  description="Secure payment with Credit/Debit Card via Stripe"
                  footer={
                    <div className="flex items-center gap-2 pt-1.5 text-xs font-medium uppercase text-[#6A7282]">
                      <span>Visa</span>
                      <span>Mastercard</span>
                      <span>Amex</span>
                    </div>
                  }
                />

                {/* 38:5833 - encryption note. */}
                <div className={`flex items-center gap-3 rounded-xl border border-[#DCFCE7] ${PALE_GRADIENT} p-4`}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <ShieldCheck aria-hidden="true" className="size-5 text-[#016630]" />
                  </span>
                  <div>
                    <p className="text-sm text-[#016630]">Secure &amp; Encrypted</p>
                    <p className="text-xs text-[#4A5565]">
                      Your payment info is protected with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* --------------------------------------------------- order summary */}
          <aside
            className={`rounded-2xl border ${HAIRLINE} bg-white ${CARD_SHADOW}`}
            aria-label="Order summary"
          >
            <div className={`flex flex-col gap-1 rounded-t-2xl ${GREEN_GRADIENT} px-6 py-4`}>
              <h2 className="flex items-center gap-2 text-lg font-bold leading-7 text-white">
                <ShoppingCart aria-hidden="true" className="size-[22.5px] shrink-0" />
                Order Summary
              </h2>
              <p className="text-sm font-medium leading-5 text-[#DCFCE7]">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>

            <div className="flex flex-col gap-4 p-5">
              <ul className="max-h-56 space-y-3 overflow-y-auto">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex items-center gap-3 rounded-xl bg-[#F9FAFB] p-3">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-[#F3F4F6] bg-white p-1">
                      <img
                        src={item.product.imageCover}
                        alt=""
                        className="size-full object-contain"
                        loading="lazy"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 block text-sm text-[#101828]">{item.product.title}</span>
                      <span className="block text-xs text-[#6A7282]">
                        {item.count} × {formatMoney(item.price ?? 0)} EGP
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold text-[#101828]">
                      {formatMoney(cartLineTotal(item))}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#F3F4F6]" />

              <div className="space-y-3">
                <div className="flex justify-between gap-4">
                  <span className="text-base font-medium leading-6 text-[#4A5565]">Subtotal</span>
                  <span className="text-base font-medium leading-6 text-[#4A5565]">
                    {formatMoney(subtotal)} EGP
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-base font-medium leading-6 text-[#4A5565]">
                    <Truck aria-hidden="true" className="size-4" />
                    Shipping
                  </span>
                  <span
                    className={cn(
                      "text-base font-semibold leading-6",
                      qualifiesFreeShipping ? "text-[#00A63E]" : "text-[#4A5565]",
                    )}
                  >
                    {qualifiesFreeShipping ? "FREE" : `${formatMoney(shipping)} EGP`}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#F3F4F6]" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-lg font-bold leading-7 text-[#101828]">Total</span>
                <span className="text-right text-2xl font-bold leading-8 text-[#16A34A]">
                  {formatMoney(total)} <span className="text-sm font-medium text-[#6A7282]">EGP</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={pending}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold leading-6 text-white shadow-[0px_4px_6px_-4px_rgba(22,163,74,0.2),0px_10px_15px_-3px_rgba(22,163,74,0.2)] transition-opacity hover:opacity-90 disabled:opacity-60 ${GREEN_GRADIENT}`}
              >
                <Lock aria-hidden="true" className="size-4" />
                {pending
                  ? paymentMethod === "cash"
                    ? "Placing Order…"
                    : "Redirecting to Payment…"
                  : "Place Order"}
              </button>

              <div className="flex items-center justify-center gap-4 border-t border-[#F3F4F6] py-3 text-xs text-[#6A7282]">
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
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

/**
 * 38:5804 / 38:5818 - one large selectable payment row.
 *
 * The radio itself is the accessible control; the styled box is a `<label>`
 * wrapping it, so keyboard and screen-reader behaviour comes from the input
 * rather than from a div with click handlers.
 */
function PaymentOption({
  value,
  selected,
  register,
  icon,
  title,
  titleClass,
  description,
  footer,
}: {
  value: "cash" | "card";
  selected: boolean;
  register: ReturnType<typeof useForm<ShippingFormData>>["register"];
  icon: React.ReactNode;
  title: string;
  titleClass: string;
  description: string;
  footer?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-xl border-2 p-5 transition-colors",
        selected
          ? `border-[#22C55E] ${PALE_GRADIENT}`
          : "border-[#E5E7EB] bg-white hover:border-[#9FE8BF]",
      )}
    >
      <input type="radio" value={value} {...register("paymentMethod")} className="sr-only" />
      {icon}

      <span className="min-w-0 flex-1">
        <span className={cn("block font-bold", titleClass)}>{title}</span>
        <span className="mt-0.5 block text-sm leading-5 text-[#6A7282]">{description}</span>
        {footer}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-[#16A34A] bg-[#16A34A] text-white" : "border-[#E5E7EB] bg-white",
        )}
      >
        {selected && <Check className="size-3.5" />}
      </span>
    </label>
  );
}
