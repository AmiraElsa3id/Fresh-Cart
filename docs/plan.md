# Fresh-Cart — Improvement Plan (UI Redesign + New API + Figma MCP)

> Project root: `C:\Users\Amera\Desktop\Protfolio\Fresh-Cart`
> Live site: https://freshcart-route.vercel.app/
> Figma design: https://www.figma.com/design/7GOjynvDWj2Lnbb4IKjbXK/Freshcart---E-Commerce-?node-id=12-2477&p=f&t=Pu61fle6lNIeUVw9-0
> New API docs: https://documenter.getpostman.com/view/5709532/2s93JqTRWN

---

## 1. Current State (Audit)

- **Stack:** Vite + React 18, Tailwind CSS, MUI, @tanstack/react-query, axios, Formik + Yup, react-router-dom v6, react-hot-toast, framer-motion.
- **Routing** (`src/App.jsx`): Layout → Products (index), Brands, Home, Orders, CategoryPage, SubCategories, WishList, Carts, ProductDetails, auth pages.
- **API layer** (`src/Apis/`):
  - `getProducts.js` → `GET /api/v1/products`, `GET /api/v1/products/:id`, `GET /api/v1/products?category[in]=:id`
  - `getCategories.js` → v1 categories
  - `cartApi.js` → **old v1 cart endpoints** (`/api/v1/cart`)
  - `payment.js` → v1 checkout session
- **State:** CartContext, WishListContext, UserContext, CategoriesContext.
- **UI gaps vs Figma:** homepage layout, hero slider, category cards, product cards, cart page, and footer need a visual overhaul to match the Figma. Figma access requires the Figma MCP (section 4).

---

## 2. API Migration Plan — move to the new API version

The new Postman collection introduces **v2** Cart & Orders endpoints plus a **Reviews** resource. Migration steps:

| Area | Old (current) | New (target) |
|---|---|---|
| Add to cart | `POST /api/v1/cart` | `POST /api/v2/cart` |
| Get cart | `GET /api/v1/cart` | `GET /api/v2/cart` |
| Update qty | `PUT /api/v1/cart/:productId` | `PUT /api/v2/cart/:productId` |
| Remove item | `DELETE /api/v1/cart/:productId` | `DELETE /api/v2/cart/:productId` |
| Clear cart | `DELETE /api/v1/cart` | `DELETE /api/v2/cart` |
| Apply coupon | — | `PUT /api/v2/cart/applyCoupon` (new) |
| Cash order | `POST /api/v1/orders/:cartId` | `POST /api/v2/orders/:cartId` |
| Reviews | — | `POST/GET /api/v1/products/:productId/reviews`, `PUT/DELETE /api/v1/reviews/:id` (new feature) |

Implementation steps:
1. Create a single axios instance (`src/Apis/axiosInstance.js`) with `baseURL`, and an interceptor that reads `localStorage.getItem('userToken')` fresh on every request (current code captures the token once at module load — bug).
2. Rewrite `src/Apis/cartApi.js` to call the v2 endpoints.
3. Update `src/Apis/payment.js` orders call to v2 where available, keep checkout-session URL handling.
4. Add `src/Apis/reviewsApi.js` (create/get/update/delete reviews).
5. Normalize cart response shape: v2 returns the same `data.products[]` / `data.totalCartPrice` shape expected by `CartContext`, but verify `numOfCartItems` in components.
6. Update `Hooks/useQueryCart.jsx` + `useMutationCart.jsx` to the new API functions.
7. Surface errors with `react-hot-toast` instead of silently returning `error?.message`.

---

## 3. UI Improvement Plan (match the Figma)

Phase A — Foundation
- Set up a design-tokens layer in `tailwind.config.js`: primary green (#10b981 family in the current live version — confirm exact hex from Figma via MCP), font family, spacing radius scale.
- Audit `src/index.css` and Tailwind directives; remove unused MUI styles where possible (keep MUI only for the BasicModal until replaced).

Phase B — Shared components
- `Navbar` — sticky top bar, search input, wishlist/cart badges, mobile drawer (compare against Figma nav).
- `Footer` — newsletter band, link columns, payment icons (assets already in `src/assets/imgs/footer`).
- `ProductCard` / `ProductItems` — image, category label, title, rating stars, price + discount badge, wishlist heart, add-to-cart button.
- `Loader` — replace spinner lib with a brand-matched skeleton.

Phase C — Pages
- `Home` — hero slider (`MainSlider` + `CategorySlider`), deal banners, featured products grid, category tiles.
- `Products` — filter sidebar (category/brand), sort dropdown, pagination.
- `Carts` — order summary card, quantity steppers, coupon input (new v2 applyCoupon), checkout button.
- `ProductDetails` — gallery, price block, reviews list (new API), related products.
- Auth pages (`Login`, `Register`, `ForgetPassword`, `VerifyResetCode`, `ResetPassword`) — split-screen layout per Figma.

Phase D — Polish
- Empty states, 404 (`Notfound` has `404.webp` already), toast messages, responsive checkpoints at 640/768/1024/1280.
- Run `npm run lint` and fix React hooks deps warnings.

---

## 4. Figma MCP — Connection & Design Audit Plan

We cannot open the Figma file headlessly (it needs auth). Connect the official Figma MCP server, then pull the design into the repo.

Step 1 — Add the MCP server to OpenCode config (`opencode.json` at the project root or `~/.config/opencode/opencode.json`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "figma": {
      "type": "remote",
      "url": "https://mcp.figma.com/mcp",
      "enabled": true,
      "oauth": true
    }
  }
}
```

(Alternative desktop server: `npx figma-developer-mcp --figma-api-key=YOUR_KEY` with `"type": "local", "command": [...]` — needs a personal access token from Figma settings.)

Step 2 — Open the Figma link and copy the node URL (`node-id=12-2477`), then use the MCP tools (`get_figma_data`, `get_image`) to export frames as PNG/SVG into `src/assets/figma/` for reference.

Step 3 — Produce a **design audit checklist** (`docs/figma-audit.md`) mapping each Figma frame → local component, listing:
- exact colors, fonts, border radius, shadows,
- spacing/padding values,
- which component (`Navbar`, `ProductCard`, …) each frame maps to,
- missing components that must be created.

Step 4 — Extract color/text styles from Figma variables and mirror them into `tailwind.config.js`.

---

## 5. Suggested Execution Order

1. [ ] Add Figma MCP config → export frames → write `docs/figma-audit.md`
2. [ ] Design tokens in `tailwind.config.js`
3. [ ] API layer: axios instance + cart v2 + orders v2 + reviewsApi
4. [ ] Update cart hooks/context + wishlist + payment
5. [ ] Navbar/Footer/ProductCard redesign
6. [ ] Home, Products, Carts, ProductDetails redesign
7. [ ] Auth pages + empty states + toasts
8. [ ] Lint, build (`npm run build`), deploy to Vercel

## 6. Useful Commands

```bash
npm run dev       # local dev
npm run build     # production build
npm run lint      # eslint
```
