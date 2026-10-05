import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/home/HomePage";
import { ProductsPage } from "@/components/products/ProductsPage";
import { ProductDetailsPage } from "@/components/products/ProductDetailsPage";
import { BrandsPage } from "@/components/brands/BrandsPage";
import { CategoryPage } from "@/components/home/CategoryPage";
import { SubCategoriesPage } from "@/components/home/SubCategoriesPage";
import { CartPage } from "@/components/auth/CartPage";
import { WishlistPage } from "@/components/auth/WishlistPage";
import { CheckoutPage } from "@/components/auth/CheckoutPage";
import { ProfilePage } from "@/components/auth/ProfilePage";
import { OrdersPage } from "@/components/auth/OrdersPage";
import { LoginPage } from "@/components/auth/LoginPage";
import { RegisterPage } from "@/components/auth/RegisterPage";
import { ForgotPasswordPage } from "@/components/auth/ForgotPasswordPage";
import { VerifyResetCodePage } from "@/components/auth/VerifyResetCodePage";
import { ResetPasswordPage } from "@/components/auth/ResetPasswordPage";
import { ProtectRoute } from "@/components/auth/ProtectRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "product-details/:id/:category", element: <ProductDetailsPage /> },
      { path: "brands", element: <BrandsPage /> },
      { path: "category", element: <CategoryPage /> },
      { path: "category/subcategories/:name", element: <SubCategoriesPage /> },
      { path: "cart", element: <ProtectRoute><CartPage /></ProtectRoute> },
      { path: "checkout", element: <ProtectRoute><CheckoutPage /></ProtectRoute> },
      { path: "wishlist", element: <ProtectRoute><WishlistPage /></ProtectRoute> },
      { path: "profile", element: <ProtectRoute><ProfilePage /></ProtectRoute> },
      { path: "orders", element: <ProtectRoute><OrdersPage /></ProtectRoute> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgetpassword", element: <ForgotPasswordPage /> },
      { path: "verifyresetcode", element: <VerifyResetCodePage /> },
      { path: "resetpassword", element: <ResetPasswordPage /> },
    ],
  },
  { path: "*", element: <div className="min-h-screen flex items-center justify-center">404 - Page Not Found</div> },
]);