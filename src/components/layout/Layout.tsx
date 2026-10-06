"use client";

import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useCart } from "@/lib/hooks";
import { useWishlist } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { RouteFallback } from "./RouteFallback";

// The Toaster lives in App, above the router, so toasts survive navigation.
export function Layout() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
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
        {/* Route chunks are lazy, so the outlet needs a boundary to suspend into. */}
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}