/**
 * Domain types for the FreshCart API.
 *
 * The API wraps payloads as `{ data: ... }`, so hooks unwrap that and return the
 * types below. Keeping them here means a shape change is a one-file edit rather
 * than a sweep across components.
 */

/** Every successful response body is `{ data, message? }` with HTTP status in code. */
export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  code?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  phone?: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
  parent?: string;
  subCategories?: Category[];
}

export interface Brand {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

export interface Product {
  _id: string;
  title: string;
  imageCover: string;
  images?: string[];
  description?: string;
  price: number;
  priceAfterDiscount?: number;
  discountPercentage?: number;
  quantity?: number;
  sold?: number;
  ratingAverage?: number;
  ratingCount?: number;
  category?: Pick<Category, "_id" | "name" | "slug">;
  brand?: Pick<Brand, "_id" | "name" | "slug">;
  reviews?: Review[];
}

export interface Review {
  _id: string;
  user?: Pick<User, "name">;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface CartItem {
  _id: string;
  count: number;
  product: Product;
}

export interface Cart {
  cartId: string;
  products: CartItem[];
  totalCartPrice?: number;
  totalDiscount?: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface OrderItem {
  _id?: string;
  count: number;
  price?: number;
  product: Product;
}

export interface Order {
  _id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod?: "cash" | "card" | string;
  shippingAddress?: ShippingAddress;
  user?: Pick<User, "id" | "name" | "email"> | string;
  couponName?: string;
  sessionUrl?: string;
}

/** Cash order payload — `POST /api/v2/orders/{cartId}`. */
export interface CreateOrderInput {
  cartId: string;
  shippingAddress: ShippingAddress;
}

/** Checkout-session payload — `POST /api/v1/orders/checkout-session/{cartId}`. */
export interface CreateCheckoutSessionInput {
  cartId: string;
  shippingAddress: Omit<ShippingAddress, "postalCode">;
}

export interface CheckoutSessionResponse {
  session?: { url?: string };
}

/** Narrow a possibly-absent product price to a usable number. */
export function effectivePrice(product: Pick<Product, "price" | "priceAfterDiscount">) {
  return product.priceAfterDiscount ?? product.price;
}