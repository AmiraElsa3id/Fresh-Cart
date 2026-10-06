import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCategories } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { slugOf } from "@/lib/slug";
import { CategoryImage } from "./CategoryImage";
import type { Category } from "@/lib/types";

/**
 * "Shop By Category" — home node `16:4955`.
 *
 * This replaces both `CategorySlider` (a broken embla carousel whose ref was on
 * the viewport *and* the container, so it had zero scroll range) and
 * `CategoriesRow` (a scroll-snap strip). The design has neither: it is one
 * white card per category in a 6-column grid, each with an 80x80 circular image
 * on a `#DCFCE7` disc and a 16px medium label in `#364153`. Two carousels were
 * also rendering at once, so every category appeared twice.
 *
 * Card: `a.bg-white` p-16, radius 8, `effect_c5bd7c6c` shadow, gap 12.
 * Image disc: `div.h-20` = 80x80, centred, `#DCFCE7`, fully rounded.
 */

const CARD_SHADOW = "shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]";

function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      to={`/category/subcategories/${slugOf(category)}`}
      className={`flex flex-col items-center gap-3 rounded-lg bg-white p-4 transition-shadow hover:shadow-md ${CARD_SHADOW}`}
    >
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#DCFCE7]">
        <CategoryImage
          src={category.image}
          slug={slugOf(category)}
          name={category.name}
          alt=""
          loading="lazy"
          width={80}
          height={80}
        />
      </div>
      <h3 className="line-clamp-2 text-base font-medium leading-6 text-[#364153]">
        {category.name}
      </h3>
    </Link>
  );
}

function CategoryTileSkeleton() {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-lg bg-white p-4 ${CARD_SHADOW}`}>
      <Skeleton className="size-20 rounded-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export function CategorySection() {
  const { data: categories, isLoading } = useCategories();

  const items = categories?.slice(0, 10) ?? [];

  return (
    <section className="container mx-auto px-4 py-8" aria-labelledby="shop-by-category">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* `div.h-8` in the design: a 6x32 gradient bar, fully rounded. */}
          <div
            aria-hidden="true"
            className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#00BC7D] to-[#007A55]"
          />
          <h2 id="shop-by-category" className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
            Shop By <span className="text-primary">Category</span>
          </h2>
        </div>

        <Link
          to="/categories"
          className="flex items-center gap-2 text-base font-medium text-primary transition-colors hover:text-primary-dark"
        >
          View All Categories
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      {/*
       * The design's desktop cards are 237.33px in a 1536px container. `md:` is
       * where 3 columns stop fitting (at 768px each card would be ~229px, which
       * is close, but the tile is the widest element on the page at that size),
       * and `lg:` at 1024px gives the full 6-column grid.
       */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 10 }, (_, i) => <CategoryTileSkeleton key={i} />)
          : items.map((category) => <CategoryTile key={category._id} category={category} />)}
      </div>
    </section>
  );
}
