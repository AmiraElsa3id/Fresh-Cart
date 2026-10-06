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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { effectivePrice } from "@/lib/types";

export function CartPage() {
  const { data: cart, isLoading } = useCart();
  const { mutate: updateQuantity } = useUpdateCartQuantity();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const { mutate: applyCoupon } = useApplyCoupon();
  const [couponCode, setCouponCode] = useState("");

  const cartItems = cart?.products || [];
  const subtotal = cartItems.reduce((sum, item) => {
    return sum + effectivePrice(item.product) * item.count;
  }, 0);
  const shipping = subtotal > 200 ? 0 : 20;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-4" role="status" aria-label="Loading cart">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-surface-2 rounded-xl animate-pulse">
              <div className="w-20 h-20 rounded-lg bg-gray-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-2 flex items-center justify-center">
          <ShoppingCart className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-4">Your Cart is Empty</h1>
        <p className="text-slate-500 mb-8">Looks like you haven't added any products yet.</p>
        <Link to="/products">
          <Button size="lg" className="gap-2">
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ink mb-8">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="flex flex-col sm:flex-row gap-4 p-4">
                <Link
                  to={`/product-details/${item.product._id}/${item.product.category?.slug ?? item.product.category?.name ?? ""}`}
                  className="relative w-24 h-24 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-surface-2"
                >
                  <img
                    src={item.product.imageCover}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <Link
                      to={`/product-details/${item.product._id}/${item.product.category?.slug ?? item.product.category?.name ?? ""}`}
                      className="font-semibold text-ink hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">{item.product.category?.name}</p>
                    <p className="text-lg font-bold text-primary mt-2">
                      {effectivePrice(item.product)} EGP
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity({ productId: item.product._id, count: item.count - 1 })}
                        disabled={item.count <= 1}
                        className="p-2 text-slate-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <Input
                        type="number"
                        value={item.count}
                        onChange={(e) => updateQuantity({ productId: item.product._id, count: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={99}
                        className="w-16 text-center border-none focus:ring-0 bg-transparent"
                        aria-label="Quantity"
                      />
                      <button
                        onClick={() => updateQuantity({ productId: item.product._id, count: item.count + 1 })}
                        className="p-2 text-slate-500 hover:text-primary"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                      removeFromCart(item.product._id, {
                        onSuccess: () => toast.success("Removed from cart"),
                        onError: () => toast.error("Could not remove item"),
                      })
                    }
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className="font-medium">{shipping === 0 ? "Free" : `${shipping} EGP`}</span>
              </div>
              {subtotal < 200 && (
                <p className="text-xs text-slate-500 text-center">
                  Add {200 - subtotal} EGP more for free shipping!
                </p>
              )}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{total.toFixed(2)} EGP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!couponCode.trim()) return;
                  applyCoupon(couponCode.trim(), {
                    onSuccess: () => toast.success("Coupon applied"),
                    onError: () => toast.error("Invalid coupon code"),
                  });
                }}
                className="space-y-3"
              >
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">Apply</Button>
                </div>
                <p className="text-xs text-slate-500">Enter your coupon code if you have one.</p>
              </form>
            </CardContent>
          </Card>

          <Link to="/checkout">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => { if (confirm("Clear all items?")) clearCart(); }}
            disabled={cartItems.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}