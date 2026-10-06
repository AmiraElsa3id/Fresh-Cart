import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Category } from "../types";

/**
 * Subcategory rows as the API actually returns them: the parent reference is
 * named `category` and holds an id, not an object.
 */
type ApiSubCategory = Category & { category: string };

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery<Category>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Children of one category.
 *
 * `/categories/:id/subcategories` ignores the id in the path and returns the whole
 * 40-entry subcategory table, each row carrying its own `category` parent id. So
 * the list is filtered here rather than trusted from the URL segment - otherwise
 * "Women's Fashion" would offer Computer Accessories.
 */
export function useSubCategories(categoryId: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", categoryId, "subcategories"],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${categoryId}/subcategories`);
      // The API names the parent field `category`; `Category.parent` is the
      // normalised alias, so normalise before comparing.
      return (data.data as ApiSubCategory[]).filter((c) => c.category === categoryId);
    },
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Resolves a category by its URL slug.
 *
 * Subcategory links are nested under the parent route (`/category/subcategories/
 * <slug>`), so the parent is carried in the path as well. That keeps a
 * subcategory page able to show its own breadcrumb and its siblings without a
 * second fetch, and avoids depending on category names being unique - the API
 * exposes `slug` precisely because names like "Fresh Vegetables" can repeat.
 */
export function useCategoryBySlug(slug: string, parentSlug?: string) {
  return useQuery<Category | null>({
    queryKey: ["categories", "slug", slug, parentSlug ?? null],
    queryFn: async () => {
      // `/categories/:slug` is not a valid lookup on this API (it 400s), so both
      // levels resolve through the list endpoints, which do accept `?slug=`.
      const { data: list } = await api.get("/categories", { params: { slug } });
      const top = list.data?.[0];
      if (top) return top;
      if (!parentSlug) return null;

      const { data: parentList } = await api.get("/categories", { params: { slug: parentSlug } });
      const parent = parentList.data?.[0];
      if (!parent) return null;

      // Scoped to the parent so a subcategory cannot match a same-named category
      // elsewhere in the tree.
      const { data: subs } = await api.get(`/categories/${parent._id}/subcategories`);
      return (
        (subs.data as ApiSubCategory[])?.find(
          (c) =>
            c.category === parent._id &&
            (c.slug === slug || c.name.toLowerCase().trim().replace(/\s+/g, "-") === slug)
        ) ?? null
      );
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}