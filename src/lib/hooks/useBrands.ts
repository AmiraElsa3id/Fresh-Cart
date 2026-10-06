import { useQuery } from "@tanstack/react-query";
import api from "../api";
import type { Brand } from "../types";

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await api.get("/brands");
      return data.data;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery<Brand>({
    queryKey: ["brands", id],
    queryFn: async () => {
      const { data } = await api.get(`/brands/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });
}