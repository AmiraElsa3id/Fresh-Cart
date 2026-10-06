"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  ChevronDown,
  Headphones,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingCart,
  Sparkles,
  Truck,
  User,
  UserPlus,
  Heart,
  X,
} from "lucide-react";

/**
 * Topbar and navbar — Figma `16:4857` (topbar, `div.hidden`) and `16:7255`
 * ("Slider", which is the navbar despite the layer name).
 *
 * Topbar: a 40px white strip with a `#F3F4F6` bottom border. Left — a truck and a
 * spark icon with 24px between the pairs; right — phone and email links, a 1×16
 * `#E5E7EB` rule, then the account name and a sign-out button.
 *
 * Navbar: a 72px white row with `effect_c5bd7c6c`, logo (165×32) on the left, a
 * fully-rounded search field with a 36px `#16A34A` submit button on its right,
 * then the four links at 24px gaps, then the actions. The support link is the
 * design's two-line block — "Support" over "24/7 Help" beside a 40px `#F0FDF4`
 * disc — underlined with a hairline.
 *
 * The design's `a.flex` glyphs are lucide equivalents throughout, so nothing extra
 * is downloaded and every icon inherits `currentColor`.
 */

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  isLoggedIn: boolean;
  onLogout: () => void;
  userName?: string;
}

/** `#16A34A` disc the design puts behind the support glyph. */
const SUPPORT_DISC = "bg-[#F0FDF4]";

function Topbar({ isLoggedIn, onLogout, userName }: Pick<HeaderProps, "isLoggedIn" | "onLogout" | "userName">) {
  return (
    <div className="border-b border-[#F3F4F6] bg-white">
      <div className="container mx-auto flex h-10 items-center justify-between gap-6 px-4 text-sm">
        {/* 16:4863 — two announcements, 24px apart. */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 font-medium text-[#6A7282]">
            <Truck aria-hidden="true" className="size-[15px] shrink-0" />
            Free Shipping on Orders 500 EGP
          </span>
          <span className="flex items-center gap-2 font-medium text-[#6A7282]">
            <Sparkles aria-hidden="true" className="size-[15px] shrink-0" />
            New Arrivals Daily
          </span>
        </div>

        {/* 16:4880 — contact links, rule, then account. */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <a
              href="tel:+18001234567"
              className="flex items-center gap-1.5 font-medium text-[#6A7282] transition-colors hover:text-primary"
            >
              <Phone aria-hidden="true" className="size-[15px] shrink-0" />
              +1 (800) 123-4567
            </a>
            <a
              href="mailto:support@freshcart.com"
              className="flex items-center gap-1.5 font-medium text-[#6A7282] transition-colors hover:text-primary"
            >
              <Mail aria-hidden="true" className="size-[15px] shrink-0" />
              support@freshcart.com
            </a>
          </div>

          <span aria-hidden="true" className="h-4 w-px bg-[#E5E7EB]" />

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 font-medium text-[#4A5565] transition-colors hover:text-primary"
                >
                  <User aria-hidden="true" className="size-[15px] shrink-0" />
                  {userName || "My Account"}
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 font-medium text-[#4A5565] transition-colors hover:text-red-500"
                >
                  <LogOut aria-hidden="true" className="size-[15px] shrink-0" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 font-medium text-[#4A5565] transition-colors hover:text-primary"
                >
                  <LogIn aria-hidden="true" className="size-[15px] shrink-0" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 font-medium text-[#4A5565] transition-colors hover:text-primary"
                >
                  <UserPlus aria-hidden="true" className="size-[15px] shrink-0" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 16:7316 / 16:7320 — circular icon link with an optional count badge. */
function ActionLink({
  to,
  label,
  count,
  children,
}: {
  to: string;
  label: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={count && count > 0 ? `${label} (${count} items)` : label}
      className="relative flex size-11 items-center justify-center rounded-lg text-[#364153] transition-colors hover:bg-surface-2 hover:text-primary"
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

export function Header({
  cartCount,
  wishlistCount,
  isLoggedIn,
  onLogout,
  userName,
}: HeaderProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /** The term lives in the URL, so a shared or reloaded search link restores it. */
  const searchParam = new URLSearchParams(location.search).get("search") ?? "";

  // Derived-during-render sync rather than an effect: seeding the state from the
  // URL handles first load, and comparing against the last seen value handles
  // later navigations. An effect would flash an empty box on every mount.
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [lastSearchParam, setLastSearchParam] = useState(searchParam);
  if (searchParam !== lastSearchParam) {
    setLastSearchParam(searchParam);
    setSearchQuery(searchParam);
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  /** Active-route matching, so "/products?search=x" still highlights Products. */
  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const navLinks = siteConfig.navLinks.filter((link) => link.href !== "/");

  return (
    <header className="sticky top-0 z-50 shadow-[0px_1px_2px_-1px_rgba(0,0,0,0.1),0px_1px_3px_0px_rgba(0,0,0,0.1)]">
      {/* The contact strip is the first thing to go when there is no room: at
          375px it would wrap into two cramped rows over the logo. */}
      <div className="hidden md:block">
        <Topbar isLoggedIn={isLoggedIn} onLogout={onLogout} userName={userName} />
      </div>

      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-[72px] items-center justify-between gap-4">
            <Link to="/" className="flex shrink-0 items-center" aria-label="FreshCart Home">
              <img
                src="/images/freshcart-logo.svg"
                alt="FreshCart"
                width={165}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* `min-w-0` lets the field shrink below its content width; without it
                the flex item's automatic minimum size is the input's intrinsic
                width, which pushed the actions past the viewport at 375px.

                Below `sm` the row is logo + field + four 44px targets, which does
                not fit a 360px viewport at any usable field width. The design's
                mobile frame has no inline search either, so the field moves into
                the menu sheet rather than being squeezed to 78px. */}
            <div className="hidden min-w-0 flex-1 items-center gap-6 sm:flex">
              <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  className="h-11 rounded-full border border-[#E5E7EB] bg-[rgba(249,250,251,0.5)] pl-5 pr-14"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-[#4A5565] transition-colors hover:bg-[#F3F4F6]"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                ) : (
                  /* 16:7289 — the design's 36px green submit disc. */
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A] text-white transition-colors hover:bg-[#15803D]"
                  >
                    <Search aria-hidden="true" className="size-4" />
                  </button>
                )}
              </form>

              {/* 16:7292 — 24px gaps, 16px medium links. `Home` is the logo
                  already, so the design's first entry is the one link dropped. */}
              <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "text-base font-medium text-[#364153] transition-colors hover:text-primary",
                      isActive(link.href) && "text-primary",
                      // 16:7300 — only Categories carries the chevron.
                      link.href === "/category" && "flex items-center gap-1.5",
                    )}
                  >
                    {link.label}
                    {link.href === "/category" && (
                      <ChevronDown aria-hidden="true" className="size-3" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* 16:7305 — the design's two-line support block. */}
              <Link
                to="/products"
                className="hidden items-center gap-2 border-b border-[#E5E7EB] pr-2 transition-colors hover:border-primary xl:flex"
              >
                <span className={`flex size-10 items-center justify-center rounded-full ${SUPPORT_DISC}`}>
                  <Headphones aria-hidden="true" className="size-5 text-[#16A34A]" />
                </span>
                <span className="flex flex-col text-xs leading-4">
                  <span className="font-medium text-[#99A1AF]">Support</span>
                  <span className="font-semibold text-[#364153]">24/7 Help</span>
                </span>
              </Link>

              <ActionLink to="/wishlist" label="Wishlist" count={wishlistCount}>
                <Heart aria-hidden="true" className="size-5" />
              </ActionLink>

              <ActionLink to="/cart" label="Shopping cart" count={cartCount}>
                <ShoppingCart aria-hidden="true" className="size-5" />
              </ActionLink>

              <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger
                  render={
                    // 44px, not the 32px `size="icon"`: a full-height target.
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11 rounded-lg lg:hidden"
                      aria-label="Open menu"
                    />
                  }
                >
                  {isMobileMenuOpen ? (
                    <X aria-hidden="true" className="size-6" />
                  ) : (
                    <Menu aria-hidden="true" className="size-6" />
                  )}
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto p-6">
                  <SheetTitle className="sr-only">Site navigation</SheetTitle>
                  {/* The label belongs on the `nav`, not the `ul`: `aria-label`
                      on a list gives screen readers a name with no landmark to
                      attach it to. */}
                  <nav className="flex flex-col gap-4" aria-label="Site">
                    {/* The field that does not fit the navbar row above. */}
                    <form onSubmit={handleSearchSubmit} role="search" className="relative sm:hidden">
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search products"
                        className="h-11 rounded-full border border-[#E5E7EB] bg-[rgba(249,250,251,0.5)] pl-5 pr-14"
                      />
                      <button
                        type="submit"
                        aria-label="Search"
                        className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A] text-white"
                      >
                        <Search aria-hidden="true" className="size-4" />
                      </button>
                    </form>

                    <div className="flex items-center gap-4 pb-4 border-b">
                      <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-2xl font-bold text-primary"
                      >
                        <ShoppingCart aria-hidden="true" className="size-7" />
                        <span>FreshCart</span>
                      </Link>
                    </div>

                    <ul className="flex flex-col gap-2">
                      {siteConfig.navLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-current={isActive(link.href) ? "page" : undefined}
                            className={cn(
                              "block rounded-lg px-4 py-3 text-base font-medium text-[#364153] transition-colors hover:bg-surface-2 hover:text-primary",
                              isActive(link.href) && "bg-[#F0FDF4] text-primary",
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
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#364153] transition-colors hover:bg-surface-2 hover:text-primary"
                        >
                          <User aria-hidden="true" className="size-5" />
                          <span>Profile{userName ? ` (${userName})` : ""}</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#364153] transition-colors hover:bg-surface-2 hover:text-primary"
                        >
                          <Package aria-hidden="true" className="size-5" />
                          <span>My Orders</span>
                        </Link>
                        <Button
                          variant="ghost"
                          className="justify-start px-4 py-3 text-[#364153] transition-colors hover:bg-surface-2 hover:text-red-500"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onLogout();
                          }}
                        >
                          <LogOut aria-hidden="true" className="size-5" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          to="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#364153] transition-colors hover:bg-surface-2 hover:text-primary"
                        >
                          <LogIn aria-hidden="true" className="size-5" />
                          <span>Sign In</span>
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-medium text-white"
                        >
                          <UserPlus aria-hidden="true" className="size-5" />
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
