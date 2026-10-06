import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import type { Product } from "../types";
import { useAuthStore } from "../store";

/**
 * `GET /wishlist` returns the saved products themselves (not wrapper entries),
 * so each item is a full product document.
 */
export function useWishlist() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery<Product[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get("/wishlist");
      return data.data;
    },
    // Token-scoped like the cart; Layout reads this for the header badge.
    enabled: isLoggedIn,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post("/wishlist", { productId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(`/wishlist/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}