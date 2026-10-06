import { useAddToCart } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { effectivePrice, type Product } from "@/lib/types";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();

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

  return (
    <Link
      to={`/product-details/${product._id}/${product.category?.slug ?? product.category?.name ?? ""}`}
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

            {product.ratingAverage != null && (
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingAverage.toFixed(1)}</span>
                {product.ratingCount != null && (
                  <span className="text-gray-400">({product.ratingCount})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}