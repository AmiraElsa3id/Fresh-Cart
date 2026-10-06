import { useMutation, useQuery } from "@tanstack/react-query";
import api, { API_V1, API_V2 } from "../api";
import type {
  CheckoutSessionResponse,
  CreateCheckoutSessionInput,
  CreateOrderInput,
  DisplayOrder,
  Order,
  OrderStatus,
} from "../types";

/**
 * Map the API's order record onto the fields the pages read.
 *
 * The wire format has `cartItems` / `totalOrderPrice` and expresses fulfilment as
 * `isPaid` + `isDelivered` rather than a `status` string. Reading `items`,
 * `totalPrice` and `status` directly gave "0 items" and a bare "EGP" on the
 * orders page for orders that were real.
 */
function toDisplayOrder(order: Order): DisplayOrder {
  const status: OrderStatus = order.isDelivered
    ? "delivered"
    : order.isPaid
      ? "shipped"
      : "pending";
  return {
    _id: order._id,
    createdAt: order.createdAt,
    items: order.cartItems ?? [],
    totalPrice: order.totalOrderPrice ?? 0,
    status,
    paymentMethod: order.paymentMethodType,
    shippingAddress: order.shippingAddress,
  };
}

export function useOrders() {
  return useQuery<DisplayOrder[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders");
      return (data.data as Order[]).map(toDisplayOrder);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useUserOrders(userId: string) {
  return useQuery<DisplayOrder[]>({
    queryKey: ["orders", "user", userId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/user/${userId}`);
      /*
       * Unlike `/orders`, which answers `{ results, metadata, data }`, this
       * endpoint answers with the bare array. Reading `data.data` returned
       * undefined, so the orders page reported "No orders yet" immediately after
       * a successful checkout.
       */
      const list: Order[] = Array.isArray(data) ? data : (data.data ?? []);
      return list.map(toDisplayOrder);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateCashOrder() {
  return useMutation<Order, Error, CreateOrderInput>({
    mutationFn: async ({ cartId, shippingAddress }) => {
      const { data } = await api.post(`${API_V2}/orders/${cartId}`, { shippingAddress });
      return data.data;
    },
  });
}

export function useCreateCheckoutSession() {
  return useMutation<CheckoutSessionResponse, Error, CreateCheckoutSessionInput>({
    mutationFn: async ({ cartId, shippingAddress }) => {
      const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const { data } = await api.post(
        `${API_V1}/orders/checkout-session/${cartId}?url=${appUrl}`,
        { shippingAddress }
      );
      return data.data;
    },
  });
}