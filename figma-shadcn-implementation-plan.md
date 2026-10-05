# Fresh-Cart — Design System Rebuild Plan (v2)

> Focus: break the Figma pages into **minimal, composable components** with a shared shadcn/ui
> base, proper validation, performance, and security.

## 0. Pre-requisites

- **Fresh commit** of the current update on `feature/figma-redesign-and-api-v2` *(done — working tree clean)*.
- shadcn/ui init in the project (Tailwind v4):
  ```bash
  npx shadcn@latest init -d
  ```
- Add primitives as needed: `button`, `input`, `label`, `card`, `badge`, `separator`, `select`, `dialog`, `alert`, `skeleton`, `sonner` (toasts), `form` (react-hook-form).

## 1. MCP / tooling status

Currently available to me in this session:
- **figma** (`get_figma_data`, `download_figma_images`) ✅ — use to pull tokens/frames/assets.
- **browser** ✅ — preview the built UI.

Not available (please enable if you want me to use them):
- **react-mcp** — you'd need an MCP server for React/RHF snippets.
- **tailwind-mcp** — custom design-token docs server.
- **shadcn MCP** — install shadcn components directly (`@shadcn/mcp` or shadcn's recommended server). This one I'd most want.
- Otherwise I can use `npx shadcn@latest add ...` directly.

## 2. Component architecture (minimal division)

Shared / general config
```
src/lib/utils.ts          // cn() helper (clsx + tailwind-merge)
src/components/ui/        // shadcn primitives (button, input, card, ...)
src/components/ui/Config  // site-wide config: header/footer slots, constants
src/config/site.ts        // routes, nav links, theme color refs
```

Page composition (one component = one responsibility):
```
src/components/layout/Header.tsx       // logo, NavLinks, SearchBox, CartBadge, AuthButtons, MobileSheet
src/components/layout/Footer.tsx       // PaymentIcons, StoreBadges, NewsletterField
src/components/home/HeroSlider.tsx     // auto-play slider w/ prev/next (48px round white buttons)
src/components/home/CategoriesRow.tsx  // horizontal category cards row
src/components/home/PromoBanner.tsx    // two gradient cards
src/components/home/ProductGrid.tsx    // grid of ProductCard
src/components/ProductCard.tsx; src/components/ui/ProductCardSkeleton.tsx (loading states)
src/components/Brands/BrandsGrid.tsx
src/components/Newsletter.tsx          // email input + submit + validation message
```

Every component gets props typed via TypeScript interfaces; no component fetches data except
feature"containers" that delegate to TanStack Query hooks (`useGetProducts`, `useGetCategories`, ...).

## 3. Validation

- Auth forms (Login/Register/ResetPassword/VerifyResetCode): migrate Formik+Yup →
  **react-hook-form + zod** (matches shadcn `Form`).
  Example schema:
  ```ts
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  ```
- Cart quantity inputs: zod/number coercion + min 1.
- Newsletter: `z.string().email()` + inline error using shadcn `Alert`.

## 4. Performance

- TanStack Query caching/defaults (`staleTime`, `retry`, `refetchOnWindowRefocus:false` — already present, add `gcTime`).
- `React.lazy` + `Suspense` for route pages; split slick-carousel heavy sliders.
- `Skeleton` components while loading instead of blank screens.
- Optimize images: keep `loading="lazy"`, compress Figma-exported assets, use WebP where possible.
- Vite: `Code splitting` via route-based chunks (already warns; adjust with manualChunks).
- Avoid re-renders: `useMemo`/`useCallback` in list items, `key` on mapped children.

## 5. Security

- Keep token in localStorage but centralize access in `axiosInstance` (done). Prefer httpOnly
  cookies when backend supports it.
- Never hardcode API URLs/tokens; `VITE_` env variables only, add `.env` to `.gitignore`.
- Sanitize `search`/`keyword` inputs before sending; validate product IDs (ObjectId format) on
  route params.
- Escape/avoid `dangerouslySetInnerHTML` (not used); keep `Content-Security-Policy` headers at
  hosting level.
- Sanitize external links; keep `rel="noopener noreferrer"` on `target="_blank"`.

## 6. Figma → shadcn mapping (per page)

| Figma frame | shadcn/ui element |
|---|---|
| Header bar | `NavigationMenu`, `Badge` (cart count), `Button` auth |
| Hero slider | `Carousel` primitive (embla) or `react-slick` styled with `Button` arrows |
| Categories | `Card` grid |
| Promo cards | `Card` + gradient background classes |
| Product card | `Card` + `Badge` (discount) + `Button` |
| Newsletter | `Input` + `Button` + `Alert` |
| Footer | `Separator`, icon list |
| Auth pages | `Card` + `Form` (RHF+zod) + `Alert` |
| Empty states | `Alert` with icon |
| Loading | `Skeleton` |

## 7. Rollout order

1. `npx shadcn@latest init`, move old components' visual CSS to tokens.
2. Shared hooks/types: `src/lib/api` + query hooks.
3. Convert auth forms to RHF+zod.
4. Rebuild Header/Footer with shadcn primitives.
5. Rebuild Home sections (slider, categories, promo, grid, brands, newsletter).
6. Apply Figma colors/radius/typography tokens via CSS vars (already `@theme`-defined; map to shadcn's `:root`).
7. Audit (`npm audit`), build, lint, browser preview.
