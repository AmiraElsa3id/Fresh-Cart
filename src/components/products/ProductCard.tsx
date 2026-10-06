import { useAddToCart, useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { effectivePrice, type Product } from "@/lib/types";
import { slugOf } from "@/lib/slug";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { mutate: addToCart, isPending: cartPending } = useAddToCart();
  const { mutate: addToWishlist, isPending: wishlistPending } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: removePending } = useRemoveFromWishlist();
  // Every card reads the same query key, so this is one request shared across the
  // grid rather than one per card.
  const { data: wishlist } = useWishlist();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const saved = wishlist?.some((item) => item._id === product._id) ?? false;
  const wishlistBusy = wishlistPending || removePending;

  const price = effectivePrice(product);
  const discounted = product.priceAfterDiscount ?? product.price;
  const hasDiscount = discounted < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - discounted) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product._id, {
      onSuccess: () => toast.success(`${product.title} added to cart`),
      onError: () => toast.error("Could not add to cart. Please try again."),
    });
  };

  const handleToggleWishlist = () => {
    if (!isLoggedIn) {
      toast.error("Sign in to save items to your wishlist.");
      return;
    }
    const onSuccess = () =>
      toast.success(saved ? "Removed from wishlist" : "Saved to wishlist");
    const onError = () => toast.error("Could not update your wishlist. Please try again.");

    if (saved) {
      removeFromWishlist(product._id, { onSuccess, onError });
    } else {
      addToWishlist(product._id, { onSuccess, onError });
    }
  };

  return (
    <Link
      to={`/product-details/${product._id}/${product.category ? slugOf(product.category) : ""}`}
      className="block h-full"
    >
      <Card className={cn("h-full flex flex-col transition-all hover:shadow-lg", className)}>
        <div className="relative overflow-hidden">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
            width={400}
            height={200}
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercent}%
            </Badge>
          )}

          {/*
           * 16:5103 — a 32px white disc over the image's top-right corner. The
           * design has two discs there plus a quick-view link; only the wishlist
           * one is implemented, so it sits alone rather than implying two.
           *
           * `stopPropagation` matters: the whole card is a <Link>, so without it
           * the button would also navigate to the product page.
           */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleToggleWishlist();
            }}
            disabled={wishlistBusy}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            className={cn(
              "absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)] transition-colors",
              "hover:bg-[#F0FDF4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              wishlistBusy && "opacity-60",
            )}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "size-[18px] transition-colors",
                saved ? "fill-red-500 text-red-500" : "text-[#4A5565]",
              )}
            />
          </button>
        </div>

        <CardContent className="flex-1 flex flex-col p-4">
          <span className="text-sm font-medium text-primary">{product.category?.name}</span>
          <h3 className="mt-1 font-semibold text-ink line-clamp-2">{product.title}</h3>

          <div className="mt-auto flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{price}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">{product.price}</span>
              )}
              <span className="text-sm text-gray-500">EGP</span>
            </div>

            {product.ratingsAverage != null && (
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingsAverage.toFixed(1)}</span>
                {product.ratingsQuantity != null && (
                  <span className="text-gray-400">({product.ratingsQuantity})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            // The default button is h-8 (32px). These cards stack one per row on
            // phones, so this is a primary tap target and needs 44px.
            className="h-11 w-full"
            disabled={cartPending}
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            {cartPending ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}