import { useCart } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    category: { name: string };
    ratingsAverage?: number;
    ratingsQuantity?: number;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { mutate: addToCart } = useCart();
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
    : 0;

  return (
    <Link to={`/product-details/${product.id}/${product.category.name}`}>
      <Card className={cn("h-full flex flex-col transition-all hover:shadow-lg", className)}>
        <div className="relative overflow-hidden">
          <img
            src={product.imageCover}
            alt={product.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercent}%
            </Badge>
          )}
        </div>
        <CardContent className="flex-1 flex flex-col p-4">
          <span className="text-sm font-medium text-primary">{product.category.name}</span>
          <h3 className="mt-1 font-semibold text-ink line-clamp-2">{product.title}</h3>
          <div className="mt-auto flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                {hasDiscount ? product.priceAfterDiscount : product.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">{product.price}</span>
              )}
              <span className="text-sm text-gray-500">EGP</span>
            </div>
            {product.ratingsAverage && (
              <div className="flex items-center gap-1 text-sm text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingsAverage.toFixed(1)}</span>
                {product.ratingsQuantity && (
                  <span className="text-gray-400">({product.ratingsQuantity})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}