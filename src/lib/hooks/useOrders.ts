import { useMutation, useQuery } from "@tanstack/react-query";
import api, { API_V1, API_V2 } from "../api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ["orders", "user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/user/${userId}`);
      return data.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCashOrder() {
  return useMutation({
    mutationFn: async ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: {
        details: string;
        phone: string;
        city: string;
        postalCode?: string;
      };
    }) => {
      const { data } = await api.post(`${API_V2}/orders/${cartId}`, { shippingAddress });
      return data;
    },
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async ({
      cartId,
      shippingAddress,
    }: {
      cartId: string;
      shippingAddress: {
        details: string;
        phone: string;
        city: string;
      };
    }) => {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const { data } = await api.post(
        `${API_V1}/orders/checkout-session/${cartId}?url=${appUrl}`,
        { shippingAddress }
      );
      return data;
    },
  });
}