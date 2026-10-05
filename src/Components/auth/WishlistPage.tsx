"use client";

import { useWishlist, useCart } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

export function WishlistPage() {
  const { data: wishlist, isLoading, mutate: refetch } = useWishlist();
  const { mutate: removeFromWishlist } = useWishlist();
  const { mutate: addToCart } = useCart();

  const wishlistItems = wishlist || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="space-y-4" role="status" aria-label="Loading wishlist">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface-2 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-2 flex items-center justify-center">
          <Heart className="w-12 h-12 text-slate-400" />
        </div>
        <h1 className="text-3xl font-bold text-ink mb-4">Your Wishlist is Empty</h1>
        <p className="text-slate-500 mb-8">Save items you love for later.</p>
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ink">My Wishlist</h1>
        <span className="text-slate-500">{wishlistItems.length} items</span>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {wishlistItems.map((item: any) => (
          <Card key={item._id} className="h-full flex flex-col">
            <div className="relative aspect-square overflow-hidden">
              <Link to={`/product-details/${item._id}/${item.category?.name}`}>
                <img
                  src={item.imageCover}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); removeFromWishlist(item._id); }}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg text-red-500 hover:text-red-600 transition-colors"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <CardContent className="flex-1 flex flex-col p-4">
              <Link to={`/product-details/${item._id}/${item.category?.name}`}>
                <span className="text-xs font-medium text-primary mb-1 block">{item.category?.name}</span>
                <h3 className="font-semibold text-ink line-clamp-2 mb-2">{item.title}</h3>
              </Link>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-bold text-primary">
                  {(item.priceAfterDiscount || item.price)} EGP
                </span>
                {item.priceAfterDiscount && (
                  <span className="text-sm text-gray-400 line-through">{item.price} EGP</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full"
                onClick={() => addToCart(item._id)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}