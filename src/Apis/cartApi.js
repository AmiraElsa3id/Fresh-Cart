// add to cart
import api, { API_V2 } from "./axiosInstance";

// add to cart (v2)
export function addToCartApi(productId) {
  return api.post(`${API_V2}/cart`, { productId });
}

// get cart (v2)
export function getCartApi() {
  return api.get(`${API_V2}/cart`);
}

// delete item (v2)
export function deleteCartApi(id) {
  return api.delete(`${API_V2}/cart/${id}`);
}

// clear cart (v2)
export function clearCartApi() {
  return api.delete(`${API_V2}/cart`);
}

// update item (v2)
export function updateCartApi({ id, count }) {
  return api.put(`${API_V2}/cart/${id}`, { count });
}

// apply coupon (v2)
export function applyCouponApi(couponName) {
  return api.put(`${API_V2}/cart/applyCoupon`, { couponName });
}
