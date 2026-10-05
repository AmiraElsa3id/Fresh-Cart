"use client";

import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "sonner";
import { useCart } from "@/lib/hooks";
import { useWishlist } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";

export function Layout() {
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();
  const { isLoggedIn, user } = useAuthStore();

  const cartCount = cart?.products?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        isLoggedIn={isLoggedIn}
        onLogout={() => useAuthStore.getState().logout()}
        userName={user?.name}
      />
      <main className="flex-1 pt-20 pb-10">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          classNames: {
            toast: "bg-white border border-gray-200 shadow-lg",
            description: "text-slate-600",
          },
        }}
      />
    </div>
  );
}