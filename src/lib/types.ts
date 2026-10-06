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
  /* Both rating fields carry the plural "s": `ratingsAverage`, `ratingsQuantity`.
     Reading them as `ratingAverage` / `ratingCount` silently yields undefined,
     which is what made every product show "0.0 (0 reviews)". */
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category?: Pick<Category, "_id" | "name" | "slug">;
  /** The API returns this as an array on every product, sometimes with one entry. */
  subcategory?: Array<Pick<Category, "_id" | "name" | "slug">> | Pick<Category, "_id" | "name" | "slug">;
  brand?: Pick<Brand, "_id" | "name" | "slug">;
  reviews?: Review[];
}

export interface Review {
  _id: string;
  user?: Pick<User, "name">;
  rating?: number;
  /** The API field is `review`, not `comment`. */
  review?: string;
  createdAt?: string;
}

export interface CartItem {
  _id: string;
  count: number;
  /**
   * The v2 cart endpoint embeds the product *without* any price field - the only
   * price on the line is this top-level one, already the per-unit figure the
   * server charged. It is the reliable source: reading `product.price` produced
   * a 0.00 subtotal and, without a fallback, "NaN EGP" in the checkout summary.
   */
  price: number;
  product: Product;
}

export interface Cart {
  /** The cart document's own `_id`, not always present on the wire. */
  _id?: string;
  /** Normalised in `useCart`; the v2 endpoint sends this beside `data`. */
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

/**
 * An order as the API actually returns it.
 *
 * The line items are `cartItems` (not `items`), the total is `totalOrderPrice`
 * (not `totalPrice`) and there is no `status` string — fulfilment is expressed as
 * `isPaid` / `isDelivered` booleans. `useOrders` normalises these into the fields
 * the pages read, so this interface mirrors the wire rather than what the UI would
 * prefer it to be.
 */
export interface Order {
  _id: string;
  createdAt: string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  taxPrice?: number;
  shippingPrice?: number;
  totalDiscount?: number;
  paymentMethodType?: "cash" | "card" | string;
  isPaid?: boolean;
  isDelivered?: boolean;
  shippingAddress?: ShippingAddress;
  user?: Pick<User, "id" | "name" | "email"> | string;
  couponName?: string;
  sessionUrl?: string;
}

/** The UI-facing shape: `useOrders` maps `Order` into this. */
export interface DisplayOrder {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
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

/**
 * Line total for one cart or order row.
 *
 * Lives here rather than in each page because the two of them got it wrong in
 * the same way: the API embeds the product with no price field on both the cart
 * and the order, so `effectivePrice(item.product)` was `undefined` and every
 * subtotal rendered as 0.00 - and, in the checkout and orders item lists, as
 * "NaN EGP". `item.price` is the only price the API actually returns.
 *
 * Takes the minimal shape it reads so it works for `CartItem` and `OrderItem`
 * alike, whose `_id` differs in optionality.
 */
export function cartLineTotal(item: {
  count: number;
  price?: number;
  product?: Pick<Product, "price" | "priceAfterDiscount">;
}) {
  const unit = item.price ?? item.product?.priceAfterDiscount ?? item.product?.price ?? 0;
  return unit * item.count;
}