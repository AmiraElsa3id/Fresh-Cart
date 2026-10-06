import { useSubCategories, useCategoryBySlug, useProductsByCategory } from "@/lib/hooks";
import { ProductGrid } from "../products/ProductGrid";
import { Link, useParams } from "react-router-dom";
import type { Product } from "@/lib/types";

/**
 * Category landing page, reachable as:
 *   /category/subcategories/<slug>              - top-level category
 *   /category/subcategories/<parent>/<slug>     - one of its subcategories
 *
 * The parent is carried in the path so a subcategory page can show a working
 * breadcrumb and its siblings, and so a subcategory can never resolve to a
 * same-named category elsewhere in the tree.
 */
export function SubCategoriesPage() {
  // Route is `category/subcategories/*`, so the segments are read here rather than
  // through named params - named segments bind positionally and would swap the
  // parent and the child.
  const params = useParams<{ "*": string }>();
  const segments = (params["*"] ?? "").split("/").filter(Boolean);
  const parentSlug = segments.length > 1 ? segments[0] : undefined;
  const slug = segments[segments.length - 1] ?? "";

  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(slug, parentSlug);

  // Subcategories belong to the parent, so both levels list the children of the
  // top-level category: on a subcategory page that is also what the breadcrumb
  // and the sibling links need.
  const { data: parentCategory } = useCategoryBySlug(parentSlug ?? "", undefined);
  const branchId = (parentSlug ? parentCategory?._id : category?._id) ?? "";
  const { data: subCategories } = useSubCategories(branchId);

  // Products always come from the parent category: a `subcategory` query param is
  // answered with a 500, so the narrowing happens client-side below.
  const { data: products, isLoading: productsLoading } = useProductsByCategory(branchId);

  /** Siblings to offer, excluding the subcategory this page is already showing. */
  const childCategories =
    subCategories?.filter((c) => !parentSlug || c._id !== category?._id) ?? [];

  const visibleProducts =
    parentSlug && products && category
      ? products.filter((p) =>
          toSubcategoryList(p.subcategory).some(
            (s) => s._id === category._id || s.slug === slug
          )
        )
      : products;

  if (!categoryLoading && !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-ink mb-4">Category Not Found</h1>
        <p className="text-slate-500 mb-8">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/category" className="text-primary hover:underline font-medium">
          ← Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          {parentSlug ? (
            <>
              <Link to="/category" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                to={`/category/subcategories/${parentSlug}`}
                className="hover:text-primary transition-colors"
              >
                {parentCategory?.name ?? slugOf(parentSlug)}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink font-medium" aria-current="page">
                {category?.name}
              </span>
            </>
          ) : (
            <>
              <Link to="/category" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink font-medium" aria-current="page">
                {category?.name}
              </span>
            </>
          )}
        </nav>
        <h1 className="text-3xl font-bold text-ink">{category?.name}</h1>
        {parentSlug && parentCategory && (
          <p className="text-slate-500 mt-1">
            Subcategory of {parentCategory.name}
          </p>
        )}
      </div>

      {childCategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink mb-4">
            {parentSlug ? "More in this category" : "Subcategories"}
          </h2>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {childCategories.map((sub) => (
              <Link
                key={sub._id}
                // On a top-level page the current category becomes the parent;
                // on a subcategory page the existing parent is kept.
                to={`/category/subcategories/${parentSlug ?? slug}/${slugOf(sub.slug, sub.name)}`}
                className="block p-4 rounded-xl bg-surface-2 hover:bg-surface hover:shadow-md transition-all text-center"
              >
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={sub.image}
                    alt={sub.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-ink line-clamp-1">{sub.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-ink mb-4">
          All Products in {category?.name}
        </h2>
        <ProductGrid
          products={visibleProducts || []}
          isLoading={productsLoading || categoryLoading}
          columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        />
      </div>
    </div>
  );
}

/** Slugs are kebab-case; the raw name is the fallback for records without one. */
function slugOf(slug: string | undefined, name?: string): string {
  if (slug) return slug;
  return (name ?? slug ?? "").toLowerCase().trim().replace(/\s+/g, "-");
}

/** The API returns `subcategory` as an array, but a lone object shows up too. */
function toSubcategoryList(value: Product["subcategory"]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}