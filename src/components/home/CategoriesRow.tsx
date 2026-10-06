import { useCategories } from "@/lib/hooks";
import { CategoryCard } from "./CategoryCard";
import { cn } from "@/lib/utils";

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
                <CategoryCard key={i} category={{ _id: "", name: "", image: "" }} className="w-40 flex-shrink-0" isLoading />
              ))
            : categories?.slice(0, limit).map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  className="w-40 flex-shrink-0"
                />
              ))}
        </div>
      </div>
    </section>
  );
}