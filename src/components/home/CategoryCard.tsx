import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  className?: string;
  isLoading?: boolean;
}

/**
 * Links to the category's subcategory/product page. Sizes itself via className so
 * the same card works in the home-page scroller and the /category grid.
 */
/** Slugs are kebab-case; the raw name is the fallback for records without one. */
function slugOf(category: Category) {
  if (category.slug) return category.slug;
  return category.name.toLowerCase().trim().replace(/\s+/g, "-");
}

export function CategoryCard({ category, className, isLoading = false }: CategoryCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <Skeleton className="aspect-square rounded-t-lg" />
        <CardContent className="p-3">
          <Skeleton className="h-4 w-3/4 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/category/subcategories/${slugOf(category)}`} className="block h-full">
      <Card className={`h-full overflow-hidden hover:shadow-md transition-shadow ${className ?? ""}`}>
        <div className="aspect-square overflow-hidden bg-surface-2">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            decoding="async"
            width={200}
            height={200}
          />
        </div>
        <CardContent className="p-3 text-center">
          <span className="text-sm font-medium text-ink line-clamp-1">{category.name}</span>
        </CardContent>
      </Card>
    </Link>
  );
}