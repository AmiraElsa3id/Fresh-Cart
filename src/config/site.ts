/**
 * Header and mobile-menu links, in the order Figma `16:7292` shows them:
 * Home, Shop, Categories, Brands. "Shop" is the design's label for the product
 * listing, which the app calls `/products`.
 *
 * Wishlist is deliberately absent — the design reaches it through the heart icon
 * in the actions group, and a text link next to that icon duplicates it.
 */
export const siteConfig = {
  name: "FreshCart",
  description: "Fresh groceries delivered fast",
  navLinks: [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/category", label: "Categories" },
    { href: "/brands", label: "Brands" },
  ],
  footerLinks: {
    company: [
      { href: "/about", label: "About Us" },
      { href: "/careers", label: "Careers" },
      { href: "/press", label: "Press" },
    ],
    support: [
      { href: "/help", label: "Help Center" },
      { href: "/contact", label: "Contact Us" },
      { href: "/faq", label: "FAQ" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
    ],
  },
  socialLinks: [
    { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
    { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
    { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  ],
};