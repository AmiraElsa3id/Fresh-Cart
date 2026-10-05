import { useQuery } from "@tanstack/react-query";
import api from "../api";

export function useCategories() {
  return useQuery({
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
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSubCategories(categoryId: string) {
  return useQuery({
    queryKey: ["categories", categoryId, "subcategories"],
    queryFn: async () => {
      const { data } = await api.get(`/categories/${categoryId}/subcategories`);
      return data.data;
    },
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
}