import { useState } from "react";
import { ProductGrid } from "./ProductGrid";
import { useProducts } from "@/lib/hooks";
import { effectivePrice } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = [...(products || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return effectivePrice(a) - effectivePrice(b);
      case "price-desc":
        return effectivePrice(b) - effectivePrice(a);
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "rating-desc":
        return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">All Products</h1>
          <p className="text-slate-500 mt-1">{products?.length || 0} products found</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value ?? "default")}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
              <SelectItem value="rating-desc">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ProductGrid products={sortedProducts} isLoading={isLoading} columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} />
    </div>
  );
}