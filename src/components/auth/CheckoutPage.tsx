"use client";

import { apiErrorMessage } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Truck, CreditCard, Home } from "lucide-react";
import { useCart } from "@/lib/hooks";
import { useCreateCashOrder, useCreateCheckoutSession } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().regex(/^01[0-9]{9}$/, "Please enter a valid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area/Street is required"),
  building: z.string().optional(),
  floor: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"]),
  notes: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { mutate: createCashOrder, isPending: cashPending } = useCreateCashOrder();
  const { mutate: createCheckoutSession, isPending: cardPending } = useCreateCheckoutSession();
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [error, setError] = useState("");

  const cartItems = cart?.products || [];
  const subtotal = cartItems.reduce((sum: number, item) => {
    const price = item.product?.priceAfterDiscount || item.product?.price || 0;
    return sum + price * item.count;
  }, 0);
  const shipping = subtotal > 200 ? 0 : 20;
  const total = subtotal + shipping;

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-4" role="status" aria-label="Loading checkout">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 bg-surface-2 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Truck className="w-16 h-16 mx-auto mb-4 text-slate-400" />
        <h1 className="text-2xl font-bold text-ink mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-6">Add some products before checking out.</p>
        <a href="/products">
          <Button>Continue Shopping</Button>
        </a>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      paymentMethod: "cash",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: ShippingFormData) => {
    setError("");
    if (!cart?.cartId) return;

    const shippingAddress = {
      details: `${data.area}, ${data.building ? `Building ${data.building}` : ""}${data.floor ? `, Floor ${data.floor}` : ""}${data.apartment ? `, Apt ${data.apartment}` : ""}${data.landmark ? `, Near ${data.landmark}` : ""}`,
      phone: data.phone,
      city: data.city,
      postalCode: "00000",
    };

    try {
      if (data.paymentMethod === "cash") {
        await createCashOrder(
          { cartId: cart.cartId, shippingAddress },
          {
            onSuccess: () => {
              toast.success("Order placed successfully!");
              navigate("/orders");
            },
            onError: (err) => {
              setError(apiErrorMessage(err, "Failed to place order. Please try again."));
            },
          }
        );
      } else {
        await createCheckoutSession(
          { cartId: cart.cartId, shippingAddress },
          {
            onSuccess: (res) => {
              if (res.session?.url) {
                window.location.href = res.session.url;
              }
            },
            onError: (err) => {
              setError(apiErrorMessage(err, "Failed to create checkout session."));
            },
          }
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const steps = [
    { id: "shipping", label: "Shipping", icon: Home },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: CheckCircle },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          {steps.map((s, i) => (
            <>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    ["shipping", "payment", "review"].indexOf(step) >= i
                      ? "bg-primary text-white"
                      : "bg-surface-2 text-slate-400"
                  )}
                >
                  {["shipping", "payment", "review"].indexOf(step) > i ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "hidden sm:block text-sm font-medium",
                    step === s.id ? "text-primary" : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block w-16 h-0.5",
                    ["shipping", "payment"].indexOf(step) > i ? "bg-primary" : "bg-surface-2"
                  )}
                />
              )}
            </>
          ))}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" {...register("fullName")} placeholder="John Doe" />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" {...register("phone")} placeholder="01XXXXXXXXX" />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register("city")} placeholder="Cairo" />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area / Street *</Label>
                <Input id="area" {...register("area")} placeholder="Maadi, Street 9" />
                {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Input id="building" {...register("building")} placeholder="12A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" {...register("floor")} placeholder="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">Apartment</Label>
                <Input id="apartment" {...register("apartment")} placeholder="4B" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Nearby Landmark (optional)</Label>
              <Input id="landmark" {...register("landmark")} placeholder="Near Metro Station" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Delivery Notes (optional)</Label>
              <Input id="notes" {...register("notes")} placeholder="Call before delivery, leave at door, etc." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className={cn(
                "relative cursor-pointer p-4 rounded-xl border-2 transition-all",
                paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
              )}>
                <input
                  type="radio"
                  {...register("paymentMethod")}
                  value="cash"
                  className="sr-only"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">Cash on Delivery</p>
                    <p className="text-sm text-slate-500">Pay when you receive your order</p>
                  </div>
                </div>
                <div className={cn(
                  "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === "cash" ? "border-primary bg-primary text-white" : "border-gray-300"
                )}>
                  {paymentMethod === "cash" && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </label>

              <label className={cn(
                "relative cursor-pointer p-4 rounded-xl border-2 transition-all",
                paymentMethod === "card" ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
              )}>
                <input
                  type="radio"
                  {...register("paymentMethod")}
                  value="card"
                  className="sr-only"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-ink">Card Payment</p>
                    <p className="text-sm text-slate-500">Secure online payment via Stripe</p>
                  </div>
                </div>
                <div className={cn(
                  "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentMethod === "card" ? "border-primary bg-primary text-white" : "border-gray-300"
                )}>
                  {paymentMethod === "card" && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-3 border rounded-lg p-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img
                    src={item.product?.imageCover}
                    alt={item.product?.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.product?.title}</p>
                    <p className="text-xs text-slate-500">Qty: {item.count}</p>
                    <p className="text-sm font-semibold text-primary">
                      {(item.product?.priceAfterDiscount || item.product?.price) * item.count} EGP
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Free" : `${shipping} EGP`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-primary">{total.toFixed(2)} EGP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("shipping")}
            disabled={step === "shipping"}
          >
            Back to Shipping
          </Button>
          <Button type="submit" className="flex-1" size="lg" disabled={cashPending || cardPending}>
            {paymentMethod === "cash" ? (cashPending ? "Placing Order..." : `Place Order - ${total.toFixed(2)} EGP`) : (cardPending ? "Redirecting to Payment..." : `Pay ${total.toFixed(2)} EGP`)}
          </Button>
        </div>
      </form>
    </div>
  );
}