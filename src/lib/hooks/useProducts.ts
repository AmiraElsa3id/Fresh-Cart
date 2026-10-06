import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Product } from "../types";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(categoryId: string) {
  return useQuery<Product[]>({
    queryKey: ["products", "category", categoryId],
    queryFn: async () => {
      const { data } = await api.get(`/products?category[in]=${categoryId}`);
      return data.data;
    },
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByBrand(brandId: string) {
  return useQuery<Product[]>({
    queryKey: ["products", "brand", brandId],
    queryFn: async () => {
      const { data } = await api.get(`/products?brand=${brandId}`);
      return data.data;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * The whole catalogue in one query result, for client-side filtering.
 *
 * The endpoint caps `limit` at 50 per page whatever you ask for and the catalogue
 * holds 56, so a single request silently loses the tail — that is the last 6
 * products, and any facet count over them would be wrong. Pages are therefore
 * walked until `metadata.numberOfPages` is exhausted, up to `MAX_PAGES`.
 *
 * Server-side facets exist (`category[in]=`, `brand=`, `price[gte|lte]=`) but each
 * accepts a single value — a comma-separated list comes back 400 — while the
 * design's sidebar is built from checkboxes. Fetching once and filtering here is
 * what makes multi-select work; it is the same reason the navbar search is
 * client-side.
 */
const MAX_PAGES = 10;

export function useProductCatalogue() {
  return useQuery<Product[]>({
    queryKey: ["products", "catalogue"],
    queryFn: async () => {
      const first = await api.get("/products", { params: { limit: 50 } });
      const collected: Product[] = [...(first.data.data as Product[])];
      const pages = first.data.metadata?.numberOfPages ?? 1;

      const rest = await Promise.all(
        Array.from({ length: Math.min(pages, MAX_PAGES) - 1 }, (_, index) =>
          api.get("/products", { params: { limit: 50, page: index + 2 } }).then((res) => res.data.data as Product[]),
        ),
      );
      for (const page of rest) collected.push(...page);

      return collected;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Product search for the navbar field.
 *
 * The API ignores a `search` param and returns 0 rows for every term tried
 * (`search=Shawl`, `search[title]=…`, `keyword=…` all came back empty against
 * live data), so the catalogue is fetched once and matched here. That is why the
 * term is not part of the query key - only the shared catalogue is cached, and
 * the filter itself is cheap.
 */
export function useProductSearch(search: string) {
  const term = search.trim().toLowerCase();
  const { data, isLoading } = useProductCatalogue();

  const products = useMemo(() => {
    if (!term || !data) return [];
    return data.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.brand?.name.toLowerCase().includes(term) ||
        p.category?.name.toLowerCase().includes(term)
    );
  }, [data, term]);

  return { data: products, isLoading: isLoading && term.length > 0 };
}