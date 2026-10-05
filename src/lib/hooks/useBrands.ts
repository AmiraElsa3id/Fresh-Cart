import { useQuery } from "@tanstack/react-query";
import api from "../api";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await api.get("/brands");
      return data.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: async () => {
      const { data } = await api.get(`/brands/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}