import { effectivePrice, type Product } from "@/lib/types";

/**
 * Facet state for the products page sidebar.
 *
 * Its own module rather than a second export from `ProductFilterBar.tsx`, because
 * `react-refresh/only-export-components` warns on any file that exports both a
 * component and a plain value.
 */

export interface ProductFacets {
  categories: string[];
  brands: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

export interface FacetOption {
  id: string;
  label: string;
  /** How many products match this facet with the *other* facets applied. */
  count?: number;
}

export const EMPTY_FACETS: ProductFacets = {
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
};

export function countActiveFacets(facets: ProductFacets) {
  return (
    facets.categories.length +
    facets.brands.length +
    (facets.minPrice !== null ? 1 : 0) +
    (facets.maxPrice !== null ? 1 : 0)
  );
}

/**
 * Does a product satisfy the facets?
 *
 * `skip` names the one group being counted, so a facet's own checkbox never
 * excludes its own options — otherwise ticking a category would drop every brand
 * that has a match and the counts would all read zero.
 */
export function matchesFacet(
  product: Product,
  facets: ProductFacets,
  skip: "categories" | "brands" | null,
) {
  if (skip !== "categories" && facets.categories.length > 0) {
    const id = product.category?._id;
    if (!id || !facets.categories.includes(id)) return false;
  }
  if (skip !== "brands" && facets.brands.length > 0) {
    const id = product.brand?._id;
    if (!id || !facets.brands.includes(id)) return false;
  }
  if (facets.minPrice !== null && effectivePrice(product) < facets.minPrice) return false;
  if (facets.maxPrice !== null && effectivePrice(product) > facets.maxPrice) return false;
  return true;
}
