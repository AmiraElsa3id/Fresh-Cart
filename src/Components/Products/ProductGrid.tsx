import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Array<{
    id: string;
    title: string;
    price: number;
    priceAfterDiscount?: number;
    imageCover: string;
    category: { name: string };
    ratingsAverage?: number;
    ratingsQuantity?: number;
  }>;
  isLoading?: boolean;
  columns?: { base: number; sm: number; md: number; lg: number; xl: number };
}

export function ProductGrid({
  products,
  isLoading = false,
  columns = { base: 1, sm: 2, md: 3, lg: 4, xl: 5 },
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columns.base}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-ink mb-2">No products found</h3>
        <p className="text-slate-500">Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns.base}, minmax(0, 1fr))`,
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <Skeleton className="w-full h-48 rounded-t-lg" />
      <div className="flex-1 flex flex-col p-4 space-y-3">
        <Skeleton className="h-3 w-1/4 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <div className="mt-auto flex justify-between">
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-5 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="mx-4 mb-4 h-10 w-full rounded" />
    </div>
  );
}