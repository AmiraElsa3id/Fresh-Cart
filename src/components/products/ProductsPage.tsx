import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Filter } from "lucide-react";
import { ProductGrid } from "./ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductFilterBar } from "./ProductFilterBar";
import { EMPTY_FACETS, countActiveFacets, matchesFacet, type ProductFacets } from "@/lib/product-facets";
import { useBrands, useCategories, useProductCatalogue } from "@/lib/hooks";
import { effectivePrice, type Product } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * All products / search results — Figma `38:12457` ("Products Search page -
 * Desktop") for the layout, with the green gradient header of `54:13500`
 * ("Products Page | Desktop") kept for the page identity.
 *
 * `38:12457` is the frame with the 256px facet sidebar; its own hero is a plain
 * white block, whereas `54:13500` is the same listing under the green gradient
 * banner used across the account pages. The two are combined here: the gradient
 * header, and the sidebar-and-toolbar body from `38:12457`.
 */

/**
 * Sort keys, in one place: the value the comparator switches on and the label the
 * trigger shows. Base UI's `Select.Value` renders the raw value unless it is given
 * this map, which is why the closed control used to read "price-asc".
 */
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "rating-desc", label: "Highest Rated" },
] as const;

const SORT_LABELS: Record<string, string> = Object.fromEntries(
  SORT_OPTIONS.map((option) => [option.value, option.label]),
);

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const isSearching = search.length > 0;

  const { data: catalogue, isLoading } = useProductCatalogue();
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const [sortBy, setSortBy] = useState("default");
  const [facets, setFacets] = useState<ProductFacets>(EMPTY_FACETS);

  const term = search.toLowerCase();
  const products = useMemo(() => {
    if (!catalogue) return [];
    if (!term) return catalogue;
    return catalogue.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.brand?.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term),
    );
  }, [catalogue, term]);

  /**
   * Facets apply to the search term first, then to each other. Per-facet counts
   * come from the same predicate with one group skipped, so a group never
   * excludes itself.
   */
  const filtered = useMemo(
    () => (products ?? []).filter((p) => matchesFacet(p, facets, null)),
    [products, facets],
  );

  const facetCounts = useMemo(() => {
    const countFor = (pick: (p: Product) => string | undefined, skip: "categories" | "brands") => {
      const counts = new Map<string, number>();
      for (const p of products ?? []) {
        if (!matchesFacet(p, facets, skip)) continue;
        const id = pick(p);
        if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
      }
      return counts;
    };
    return {
      withCategory: countFor((p) => p.category?._id, "categories"),
      withBrand: countFor((p) => p.brand?._id, "brands"),
    };
  }, [products, facets]);

  /*
   * Every category and brand is listed, not just the ones with a non-zero count.
   * Filtering the list itself would make the sidebar shrink to three entries today
   * (the catalogue happens to cover three categories) and grow back as the data
   * changes, and it would hide the fact that a facet is empty rather than say so.
   */
  const categoryOptions = useMemo(
    () =>
      (categories ?? []).map((category) => ({
        id: category._id,
        label: category.name,
        count: facetCounts.withCategory.get(category._id) ?? 0,
      })),
    [categories, facetCounts],
  );

  const brandOptions = useMemo(
    () =>
      (brands ?? []).map((brand) => ({
        id: brand._id,
        label: brand.name,
        count: facetCounts.withBrand.get(brand._id) ?? 0,
      })),
    [brands, facetCounts],
  );

  const sortedProducts = useMemo(
    () =>
      [...filtered].sort((a, b) => {
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
            return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
          default:
            return 0;
        }
      }),
    [filtered, sortBy],
  );

  const activeFacets = countActiveFacets(facets);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#F9FAFB] pb-8">
      {/* 54:13533 - the green gradient banner this listing sits under. */}
      <div className="w-full bg-gradient-to-br from-[#16A34A] via-[#22C55E] to-[#4ADE80]">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
            <Link to="/" className="font-medium text-white/70 transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true" className="font-medium text-white/40">
              /
            </span>
            <span aria-current="page" className="font-medium text-white">
              All Products
            </span>
          </nav>

          <div className="flex items-center gap-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_0px_0px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm">
              <Package aria-hidden="true" className="size-7 text-white" />
            </span>
            <div>
              <h1 className="text-2xl font-bold leading-8 text-white">
                {isSearching ? `Results for “${search}”` : "All Products"}
              </h1>
              <p className="mt-1 text-sm font-medium text-white/80">
                {isLoading
                  ? "Loading products…"
                  : `${filtered.length} ${filtered.length === 1 ? "product" : "products"} found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 38:12514 - 256px sidebar beside the results column. Below `lg` the design
          puts the same facets behind a "Filters" button (`38:14724`), so they are
          served from a sheet rather than dropped. */}
      <div className="flex w-full max-w-[1504px] flex-col gap-8 px-4 py-8 lg:flex-row">
        <ProductFilterBar
          categories={categoryOptions}
          brands={brandOptions}
          facets={facets}
          onChange={setFacets}
          className="hidden lg:block lg:w-64 lg:shrink-0"
        />

        <div className="min-w-0 flex-1">
          {/* 38:12668 - results count on the left, sort on the right. */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-medium text-[#6A7282]">
              {isLoading ? "Loading…" : `Showing ${filtered.length} products`}
            </p>

            <div className="flex items-center gap-2">
              {isSearching && (
                <Button variant="outline" onClick={() => setSearchParams({})} className="h-10 shrink-0 rounded-lg">
                  Clear search
                </Button>
              )}

              {/* 38:14724 - the design's small-screen "Filters" button. */}
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      className="h-10 shrink-0 gap-2 rounded-lg px-4 lg:hidden"
                    />
                  }
                >
                  <Filter aria-hidden="true" className="size-4" />
                  Filters
                  {activeFacets > 0 && (
                    <span className="ml-0.5 rounded-full bg-[#DCFCE7] px-1.5 text-xs font-semibold text-[#15803D]">
                      {activeFacets}
                    </span>
                  )}
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(22rem,90vw)] overflow-y-auto bg-white p-0">
                  <SheetHeader className="border-b border-[#F3F4F6] px-6 py-4">
                    <SheetTitle className="text-base font-bold text-[#101828]">Filters</SheetTitle>
                    <SheetDescription className="sr-only">
                      Narrow the product list by category, brand and price.
                    </SheetDescription>
                  </SheetHeader>
                  <ProductFilterBar
                    categories={categoryOptions}
                    brands={brandOptions}
                    facets={facets}
                    onChange={setFacets}
                    className="rounded-none border-0 shadow-none lg:hidden"
                  />
                </SheetContent>
              </Sheet>

              <label htmlFor="sort-products" className="text-sm font-medium text-[#6A7282]">
                Sort by:
              </label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value ?? "default")}
                // Base UI resolves the closed control's text from this map; without it
                // `Select.Value` prints the raw value, so it read "price-asc".
                items={SORT_LABELS}
              >
                {/* The accessible name goes on the trigger: `Select` is Base UI's
                    Root, which renders no DOM element, so `aria-label` passed there
                    was silently dropped and the control had no name at all. */}
                <SelectTrigger id="sort-products" className="h-10 w-[200px] rounded-lg border-[#E5E7EB]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* The design's grid is 4 columns of 292px once the 256px sidebar is in
              place, so the column count steps down from 5 to 4 at `lg`. */}
          <ProductGrid
            products={sortedProducts}
            isLoading={isLoading}
            columns={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
          />
        </div>
      </div>
    </div>
  );
}