import { lazy, type ComponentType } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/home/HomePage";
import { ProtectRoute } from "@/components/auth/ProtectRoute";

/** Minimal shape of the route modules below: named page components, no props. */
type PageModule = Record<string, ComponentType>

/**
 * Route-level code splitting.
 *
 * Layout and HomePage stay in the entry chunk: the shell and landing page are
 * what a visitor needs for first paint. Everything below loads on demand, so
 * landing on / does not fetch the cart, checkout, profile or auth screens.
 *
 * react-router's route-level `lazy` option is deliberately not used here — it
 * left the router rendering nothing on a cold load. React.lazy + the Suspense
 * boundary in Layout is the well-trodden path and splits identically.
 */
function lazyPage(loader: () => Promise<PageModule>, name: string) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[name] };
  });
}

const ProductsPage = lazyPage(() => import("@/components/products/ProductsPage"), "ProductsPage");
const ProductDetailsPage = lazyPage(
  () => import("@/components/products/ProductDetailsPage"),
  "ProductDetailsPage",
);
const BrandsPage = lazyPage(() => import("@/components/brands/BrandsPage"), "BrandsPage");
const CategoriesPage = lazyPage(() => import("@/components/home/CategoriesPage"), "CategoriesPage");
const SubCategoriesPage = lazyPage(
  () => import("@/components/home/SubCategoriesPage"),
  "SubCategoriesPage",
);

const CartPage = lazyPage(() => import("@/components/auth/CartPage"), "CartPage");
const WishlistPage = lazyPage(() => import("@/components/auth/WishlistPage"), "WishlistPage");
const CheckoutPage = lazyPage(() => import("@/components/auth/CheckoutPage"), "CheckoutPage");
const ProfilePage = lazyPage(() => import("@/components/auth/ProfilePage"), "ProfilePage");
const OrdersPage = lazyPage(() => import("@/components/auth/OrdersPage"), "OrdersPage");

const LoginPage = lazyPage(() => import("@/components/auth/LoginPage"), "LoginPage");
const RegisterPage = lazyPage(() => import("@/components/auth/RegisterPage"), "RegisterPage");
const ForgotPasswordPage = lazyPage(
  () => import("@/components/auth/ForgotPasswordPage"),
  "ForgotPasswordPage",
);
const VerifyResetCodePage = lazyPage(
  () => import("@/components/auth/VerifyResetCodePage"),
  "VerifyResetCodePage",
);
const ResetPasswordPage = lazyPage(
  () => import("@/components/auth/ResetPasswordPage"),
  "ResetPasswordPage",
);

/** Gate for signed-in-only routes; the lazy page loads only after auth passes. */
const protectedRoute = (Page: ComponentType) => (
  <ProtectRoute>
    <Page />
  </ProtectRoute>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product-details/:id/:category", element: <ProductDetailsPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "category", element: <CategoriesPage /> },
      { path: "category/subcategories/:name", element: <SubCategoriesPage /> },

      { path: "cart", element: protectedRoute(CartPage) },
      { path: "wishlist", element: protectedRoute(WishlistPage) },
      { path: "checkout", element: protectedRoute(CheckoutPage) },
      { path: "profile", element: protectedRoute(ProfilePage) },
      { path: "orders", element: protectedRoute(OrdersPage) },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgetpassword", element: <ForgotPasswordPage /> },
      { path: "verifyresetcode", element: <VerifyResetCodePage /> },
      { path: "resetpassword", element: <ResetPasswordPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div>
    ),
  },
]);