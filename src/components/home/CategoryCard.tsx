import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { slugOf } from "@/lib/slug";
import { CategoryImage } from "./CategoryImage";
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
          <CategoryImage
            src={category.image}
            slug={slugOf(category)}
            name={category.name}
            alt={category.name}
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