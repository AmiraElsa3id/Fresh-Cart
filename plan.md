# Fresh-Cart — Implementation Plan

> Generated from the "Freshcart [E-Commerce]" Figma file (key `7GOjynvDWj2Lnbb4IKjbXK`) and the new Route E-commerce API docs.

---

## 1. Goals

1. Implement the high-fidelity Figma design (Home page desktop/tablet, navbar, categories, slider, promo banners, product grid, brands, newsletter, footer) in the current React + Vite + Tailwind project.
2. Migrate data layer to the **new API** (`https://documenter.getpostman.com/view/5709532/2s93JqTRWN`), notably the **v2** Cart and Orders endpoints.
3. Fix all dependency vulnerabilities and clean up obsolete/duplicate packages.

---

## 2. Current State Audit

### Stack
- React 18.3.1, Vite 5.4, Tailwind CSS 3.4, MUI 6, Formik/Yup, axios, react-router-dom 6.26, react-slick, @tanstack/react-query 5 + legacy `react-query` 3 (**both installed** — pick one).

### Figma → Code mapping (existing)
| Figma frame | Current component | Status |
|---|---|---|
| Hero slider (`div.swiper`) | `MainSlider` (react-slick) | Exists, needs style match |
| Category slider | `CategorySlider` | Exists |
| Promo gradient banners | (not implemented as section) | New section needed |
| Product grid | `ProductItems` / `ProductCard` | Exists |
| Brands section | `Brands` | Exists |
| Newsletter banner (`div.bg-primary-50`) | (missing) | New section needed |
| Footer | `Footer` | Exists, needs token match |
| Navbar | `Navbar` | Exists |

### API layer (current)
- `src/Apis/cartApi.js` — v1 cart endpoints, reads token from `localStorage.getItem('userToken')`.
- `src/Apis/payment.js` — v1 `orders/checkout-session` & v1 `orders` cash order, reads `token` directly from localStorage at module load (stale token bug), hardcoded deployed URL.
- `src/Apis/getCategories.js`, `src/Apis/getProducts.js` — v1, hardcoded URLs.
- `src/Context/*.jsx` + `src/Hooks/*` — cart/wishlist contexts.

### New API changes (from Postman docs)
- `Cart (v2)`: `POST/GET/PUT/DELETE /api/v2/cart`, `PUT /api/v2/cart/applyCoupon` — cart routes move from `/api/v1/cart` to `/api/v2/cart`.
- `Orders (v2)`: `POST /api/v2/orders/{cartId}` — cash order with `shippingAddress` body (`details`, `phone`, `city`, `postalCode` now included).
- New **Reviews** endpoints: `POST /api/v1/products/{productId}/reviews`, `GET /api/v1/reviews`, `PUT/DELETE /api/v1/reviews/{reviewId}` — optional future feature.
- Auth header: docs use a `token` header — keep consistent everywhere.

---

## 3. Dependency / Security Plan

### Vulnerable packages found (`npm audit`)
| Package | Issue | Fix |
|---|---|---|
| axios ≤ 1.19.0 | High — SSRF, DoS, prototype pollution | `npm install axios@latest` |
| react-router-dom 6.x (≤ 6.30.2) | High — open redirect / XSS | `npm install react-router-dom@latest` (v7) and verify `Route/Routes/Link` API |
| @babel/core, @babel/helpers, @babel/runtime | Moderate/High | `npm audit fix` |
| ajv < 6.14.0 | Moderate ReDoS | `npm audit fix` |
| @remix-run/router (transitive) | via react-router update | — |

### Cleanup tasks
- Remove duplicate `react-query` (v3) — keep `@tanstack/react-query` v5 only; migrate any v3 imports (`useQuery`/`useMutation` keys API: `useQuery({queryKey, queryFn})`).
- Consider removing `generate-react-cli` from dependencies (dev-only tool) → move to devDependencies or uninstall.
- Re-run `npm audit` and aim for 0 high/critical.

---

## 4. Implementation Steps

### Phase 0 — Dependencies
1. `npm install axios@latest react-router-dom@latest`
2. `npm uninstall react-query`
3. `npm audit fix`
4. `npm audit` → confirm clean; smoke-test routing and axios calls.

### Phase 1 — Design tokens
- Add Figma tokens to `tailwind.config.js` / `src/index.css`:
  - Colors: `primary: #16A34A`, `primary-dark: #009966`, text `ink: #1E2939`, grays `slate-500/600: #6A7282 / #4A5565`, bg `#F9FAFB`/`#F3F4F6`, accents `#FEF2F2`, promo gradients.
  - Font: add `Exo` via Google Fonts (`<link>` in `index.html`), `font-family: Exo` default.
  - Radius `xl: 16px`, `4xl: 40px`; standard soft shadow token.

### Phase 2 — Page sections (match Figma node tree)
1. Hero `MainSlider`: 48px round white prev/next buttons (borderless, soft shadow), match autoplay/speed.
2. Category strip: `section.py-8` with `div.grid` — horizontal scroll row like Figma's 312px-high grid.
3. Promo banners row (new): two `div.relative` cards, 16px radius, `linear-gradient(170deg, #00BC7D → #007A55)` and `(170deg, #FF8904 → #FF2056)`, 24px gap, centered row.
4. Product grid: match 1920 container, `grid` gaps 24px, product card style from Figma (`ProductCard`).
5. Brands section (new/update `Brands`): `section.py-16`, big white rounded-40px card with soft gradient `#F3F4F6 → #FFFFFF → #FEF2F2`, 1px light border.
6. Newsletter banner (new): `bg-primary-50` (`#DCFCE7` tint), full-width, horizontal top/bottom borders, centered subscription CTA.
7. Footer: 48px top padding, 48px gaps, dark fill, payment icons row, `border-t` bottom strip.
8. Responsive: replicate Figma **Tablet 1024** frame (32px paddings); ensure mobile fallbacks.

### Phase 3 — Data layer migration (new API)
1. Centralize base URL: create `src/Apis/axiosInstance.js` with `baseURL = "https://ecommerce.routemisr.com/api/v1"` plus an interceptor that reads the token **at request time** from localStorage (fix stale-token bug) and sets `headers.token`.
2. `cartApi.js` → `/api/v2/cart` endpoints:
   - `POST /api/v2/cart` `{productId}`
   - `GET /api/v2/cart`
   - `PUT /api/v2/cart/{productId}` `{count}`
   - `DELETE /api/v2/cart/{productId}`
   - `DELETE /api/v2/cart`
   - `PUT /api/v2/cart/applyCoupon` `{couponName}`
3. `payment.js` → use `/api/v2/orders/{cartId}` for cash orders with full `shippingAddress` (`details`, `phone`, `city`, `postalCode`); keep checkout-session under v1 unless v2 docs confirm, using axios instance and env-based return URL (`import.meta.env.VITE_APP_URL`) instead of hardcoded Vercel URL.
4. `getProducts.js` / `getCategories.js`: replace hardcoded URLs with the axios instance; add `limit`/`page` params from docs if pagination is needed.
5. Auth/profile components: verify token header name `token` matches docs (docs use `token` header), and fix any component reading `localStorage.getItem('token')` before login completes.
6. Delete duplicated literal URLs across components; single source of truth in the instance.

### Phase 4 — QA
- `npm run lint` and `npm run build` must pass.
- Manual run-through: signup/signin → add to cart (v2) → wishlist → checkout cash (v2) → online checkout → orders page.
- Compare rendered Home page against Figma Desktop (1920) and Tablet (1024) frames.
- `npm audit` clean.

---

## 5. Open Questions
- Confirm whether `checkout-session` also moved to `/api/v2/orders` in the new docs (docs list only cash order v2 explicitly).
- Confirm coupon flow is wanted (v2 `applyCoupon`) — add if yes.
- Hero slider images: Figma uses different assets than `src/assets/imgs/slider-image-*.jpeg`? Export from Figma via `download_figma_images` if needed.

---

## 6. Suggested File Changes

| File | Change |
|---|---|
| `package.json` | bump axios, react-router-dom; remove `react-query`; move `generate-react-cli` to dev |
| `tailwind.config.js` | add design tokens |
| `index.html` | add Exo font link |
| `src/Apis/axiosInstance.js` | **new** |
| `src/Apis/cartApi.js` | v2 endpoints, use instance |
| `src/Apis/payment.js` | v2 orders, env return URL, instance |
| `src/Apis/getProducts.js` / `getCategories.js` | use instance |
| `src/Context/*.jsx`, `src/Hooks/*.jsx` | adapt to @tanstack/react-query v5 API |
| `src/Components/Home/Home.jsx` | compose sections per Figma |
| `src/Components/{MainSlider,CategorySlider,Brands,Footer,Navbar,ProductCard}` | style per Figma tokens |
| New: `src/Components/PromoBanner`, `src/Components/Newsletter` | implement missing sections |
