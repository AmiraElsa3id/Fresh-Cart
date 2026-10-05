"use client";

import { useProduct } from "@/lib/hooks";
import { useCart } from "@/lib/hooks";
import { useWishlist } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Star, Truck, Shield, RotateCcw, Heart, ShoppingCart } from "lucide-react";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id || "");
  const { mutate: addToCart, isPending: cartPending } = useCart();
  const { mutate: addToWishlist, isPending: wishlistPending } = useWishlist();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-surface-2 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Product Not Found</h1>
        <p className="text-slate-500 mb-8">The product you're looking for doesn't exist.</p>
        <a href="/products" className="text-primary hover:underline font-medium">
          ← Back to Products
        </a>
      </div>
    );
  }

  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
        <a href="/" className="hover:text-primary transition-colors">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-primary transition-colors">Products</a>
        <span>/</span>
        <a href={`/category/${product.category?.name}`} className="hover:text-primary transition-colors">
          {product.category?.name}
        </a>
        <span>/</span>
        <span className="text-ink font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-surface-2">
            <img
              src={product.imageCover}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid gap-2 grid-cols-4">
              {product.images.slice(0, 4).map((img: string, i: number) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden bg-surface-2 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-sm font-medium text-primary mb-1 block">{product.category?.name}</span>
            <h1 className="text-3xl font-bold text-ink mb-3">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.ratingsAverage?.toFixed(1) || "0.0"}</span>
                <span className="text-slate-500">({product.ratingsQuantity || 0} reviews)</span>
              </div>
            </div>
            {hasDiscount && (
              <Badge variant="destructive" className="text-sm mb-4">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {(hasDiscount ? product.priceAfterDiscount : product.price)} EGP
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through">{product.price} EGP</span>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink">Description</h3>
            <p className="text-slate-600 whitespace-pre-line">{product.description || "No description available."}</p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Free Shipping</p>
                <p className="text-xs text-green-600">On orders over 200 EGP</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Secure Payment</p>
                <p className="text-xs text-blue-600">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-50">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Easy Returns</p>
                <p className="text-xs text-orange-600">30-day return policy</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1 gap-2 bg-primary hover:bg-primary-dark"
              onClick={() => addToCart(product._id)}
              disabled={cartPending}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartPending ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => addToWishlist(product._id)}
              disabled={wishlistPending}
            >
              <Heart className="w-5 h-5" />
              {wishlistPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}