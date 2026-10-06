"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Heart,
  Package,
} from "lucide-react";

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
}

export function Header({
  cartCount,
  wishlistCount,
  isLoggedIn,
  onLogout,
  userName,
}: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary shrink-0" aria-label="FreshCart Home">
            <span className="text-3xl">🛒</span>
            <span className="hidden sm:block">FreshCart</span>
          </Link>

          <div className="flex-1 flex items-center gap-4 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  // TODO: Navigate to search results
                }
              }}
              className="relative w-full"
              role="search"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-2 border-none focus:bg-white focus:ring-2 focus:ring-primary/20"
                aria-label="Search products"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link
              to="/wishlist"
              className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors text-slate-600 hover:text-primary"
              aria-label={`Wishlist ${wishlistCount > 0 ? `(${wishlistCount} items)` : "empty"}`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors text-slate-600 hover:text-primary"
              aria-label={`Shopping cart ${cartCount > 0 ? `(${cartCount} items)` : "empty"}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-slate-600 hover:text-primary"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Link
                  to="/orders"
                  className="p-2 rounded-lg hover:bg-surface-2 transition-colors text-slate-600 hover:text-primary"
                  aria-label="Orders"
                >
                  <Package className="w-5 h-5" />
                </Link>
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-primary">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-primary">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary-dark">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu" />
                }
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <nav className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                      <span className="text-3xl">🛒</span>
                      <span>FreshCart</span>
                    </Link>
                  </div>
                  <ul className="flex flex-col gap-2" role="navigation" aria-label="Mobile navigation">
                    {siteConfig.navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          to={link.href}
                          className={cn(
                            "px-4 py-3 rounded-lg text-slate-600 hover:bg-surface-2 hover:text-primary transition-colors",
                            location.pathname === link.href && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-4" />
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-surface-2 hover:text-primary transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>Profile ({userName})</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-surface-2 hover:text-primary transition-colors"
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                      <Button
                        variant="ghost"
                        className="justify-start px-4 py-3 text-slate-600 hover:bg-surface-2 hover:text-red-500 transition-colors"
                        onClick={onLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/login">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <LogIn className="w-5 h-5" />
                          <span>Login</span>
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full justify-start gap-2">
                          <UserPlus className="w-5 h-5" />
                          <span>Register</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}