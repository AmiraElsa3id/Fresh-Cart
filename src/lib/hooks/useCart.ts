import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { API_V2 } from "../api";
import type { Cart } from "../types";

export function useCart() {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get(`${API_V2}/cart`);
      return data.data;
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post(`${API_V2}/cart`, { productId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, count }: { productId: string; count: number }) => {
      const { data } = await api.put(`${API_V2}/cart/${productId}`, { count });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(`${API_V2}/cart/${productId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`${API_V2}/cart`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: async (couponName: string) => {
      const { data } = await api.put(`${API_V2}/cart/applyCoupon`, { couponName });
      return data;
    },
  });
}