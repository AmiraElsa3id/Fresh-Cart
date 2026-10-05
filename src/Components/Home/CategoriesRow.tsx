import { useCategories } from "@/lib/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: string;
  };
  isLoading?: boolean;
}

function CategoryCard({ category, isLoading = false }: CategoryCardProps) {
  if (isLoading) {
    return (
      <Card className="w-40 flex-shrink-0">
        <Skeleton className="aspect-square rounded-t-lg" />
        <CardContent className="p-3">
          <Skeleton className="h-4 w-3/4 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/category/subcategories/${category.name}`} className="block">
      <Card className="w-40 flex-shrink-0 hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-surface-2">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <CardContent className="p-3 text-center">
          <span className="text-sm font-medium text-ink line-clamp-1">{category.name}</span>
        </CardContent>
      </Card>
    </Link>
  );
}

interface CategoriesRowProps {
  className?: string;
  limit?: number;
}

export function CategoriesRow({ className, limit = 10 }: CategoriesRowProps) {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <CategoryCard key={i} category={{ id: "", name: "", image: "" }} isLoading />
              ))
            : categories?.slice(0, limit).map((category: any) => (
                <CategoryCard key={category._id} category={category} />
              ))}
        </div>
      </div>
    </section>
  );
}