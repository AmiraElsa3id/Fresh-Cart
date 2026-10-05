import { useQuery } from "@tanstack/react-query";
import api from "../api";

export function useProducts() {
  return useQuery({
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
  return useQuery({
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
  return useQuery({
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
  return useQuery({
    queryKey: ["products", "brand", brandId],
    queryFn: async () => {
      const { data } = await api.get(`/products?brand=${brandId}`);
      return data.data;
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}