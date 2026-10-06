import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { API_V2 } from "../api";
import type { Cart } from "../types";
import { useAuthStore } from "../store";

export function useCart() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get(`${API_V2}/cart`);
      /*
       * The v2 cart response is `{ cartId, numOfCartItems, data: <the cart> }`:
       * `cartId` sits beside `data`, not inside it, and the cart document's own
       * identifier is `_id`. Reading `data.data.cartId` gave undefined, which
       * made `POST /orders/${cartId}` fail with "invalid ID undefined" and left
       * "Place Order" doing nothing at all. Prefer the top-level id and fall back
       * to the document's own.
       */
      return {
        ...data.data,
        cartId: data.cartId ?? data.data?._id ?? "",
      };
    },
    // The endpoint is token-scoped, so a logged-out visitor would only ever get
    // a 401. Layout mounts this for the header badge, which every visitor sees.
    enabled: isLoggedIn,
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
  // Explicit generics: untyped `useMutation` defaults the variables to `void`,
  // which makes `clearCart({ onError })` a type error and silently unreportable.
  return useMutation<unknown, Error, void>({
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