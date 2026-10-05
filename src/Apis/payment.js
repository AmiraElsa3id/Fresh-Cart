import api, { API_V1, API_V2 } from "./axiosInstance";

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

export function onlinePayment({ cartId, shippingAddress }) {
  return api.post(
    `${API_V1}/orders/checkout-session/${cartId}?url=${APP_URL}`,
    { shippingAddress }
  );
}

export function cash({ cartId, shippingAddress }) {
  return api.post(`${API_V2}/orders/${cartId}`, { shippingAddress });
}
