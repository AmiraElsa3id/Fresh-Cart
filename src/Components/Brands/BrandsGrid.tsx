import { useBrands } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    image: string;
  };
  isLoading?: boolean;
}

function BrandCard({ brand, isLoading = false }: BrandCardProps) {
  if (isLoading) {
    return (
      <Card className="aspect-square">
        <Skeleton className="w-full h-full rounded-lg" />
      </Card>
    );
  }

  return (
    <Link to={`/brands/${brand._id || brand.id}`} className="block">
      <Card className="aspect-square overflow-hidden relative group hover:shadow-lg transition-all duration-300">
        <div className="w-full h-full bg-surface-2">
          <img
            src={brand.image}
            alt={brand.name}
            className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            {brand.name}
          </span>
        </div>
      </Card>
    </Link>
  );
}

interface BrandsGridProps {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
}

export function BrandsGrid({ className, limit = 8, showViewAll = true }: BrandsGridProps) {
  const { data: brands, isLoading } = useBrands();

  return (
    <section className={cn("py-10 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">Our Brands</h2>
          {showViewAll && (
            <Link
              to="/brands"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
        <div
          className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <BrandCard key={i} brand={{ id: "", name: "", image: "" }} isLoading />
              ))
            : brands?.slice(0, limit).map((brand: any) => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
        </div>
      </div>
    </section>
  );
}