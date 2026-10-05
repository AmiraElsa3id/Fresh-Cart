# FreshCart — Figma Design Implementation Plan (Phase 2)

**Status:** Plan only — no code written yet.
**Working directory:** `C:\Users\Amera\Desktop\Protfolio\Fresh-Cart`
**Supersedes:** `figma-shadcn-implementation-plan.md` (Phase 1 — design system + page scaffolding, done)

---

## 0. Blockers that must be resolved before design work

### 0.1 RESOLVED (pending sign-in) — Figma MCP now configured

**Root cause found.** `opencode.json` had a Figma MCP entry that was silently ignored
because of three separate bugs:

| # | Bug | Effect |
| --- | --- | --- |
| 1 | Entry nested at `mcp.figma` instead of `mcp.servers.figma` | V2 ignores it entirely — server never registered. This is why `list_mcp_resources` came back empty |
| 2 | Used `"enabled": true` | Not a V2 field. V2 uses `disabled` to opt **out** |
| 3 | Used third-party package `figma-developer-mcp` with a PAT | Not Figma's official server, and it required a secret in a tracked file |

**Fix applied** — switched to Figma's official remote server with OAuth, which needs
**no API key at all**:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "figma": {
        "type": "remote",
        "url": "https://mcp.figma.com/mcp"
      }
    }
  }
}
```

**SECURITY — action required by you.** The old config contained a Figma Personal
Access Token in plaintext:

```
REDACTED
```

It has been removed from the file, but it was present in a repo-tracked file.
**Revoke it now** at Figma → Settings → Security → Personal access tokens →
Revoke. If this branch or file was ever pushed, treat it as compromised.

**Remaining step (needs you):** OpenCode config changes require a restart.

1. Restart OpenCode so it re-reads `opencode.json`.
2. Run `/mcps`, select **figma**, and complete the OAuth sign-in in the browser.
3. Verify with `opencode mcp list` → expect `figma  connected`.

Once connected I can read node `16-4856` (home) and pull exact tokens, layout, and
exportable assets directly.

**Fallback if the remote server refuses the client:** Figma restricts the remote
server to clients in its MCP Catalog (VS Code, Cursor, Claude Code, Codex, Xcode).
OpenCode may not be listed. In that case use Figma's **desktop** server instead —
Figma desktop app → Preferences → enable local MCP server → then:

```jsonc
"figma": {
  "type": "remote",
  "url": "http://127.0.0.1:3845/mcp"
}
```

I still need the **node IDs** for the login / reset / verify screens — the link you sent
only contains `16-4856` (home).

### 0.2 ISSUE — Git history for Fresh-Cart is gone

When the locked `node_modules` was force-deleted (`rd /s /q Fresh-Cart`) the `.git`
folder went with it. Verified state:

- `Fresh-Cart/` → **not a git repository**
- `Fresh-Cart-clean/` → **not a git repository**
- `Portfolio-v2/.git` → different project, unrelated

**Impact is low:** the branch `feature/figma-redesign-and-api-v2` had 6 commits and was
**never pushed** — no GitHub remote was ever configured for Fresh-Cart. So nothing
was lost from a remote; only local commit granularity.

**Plan:** re-init the repo in `Fresh-Cart` on branch
`feature/figma-redesign-and-api-v2`, and recreate the history as a small number of
clean, meaningful commits (one per phase below) rather than faking the old 6.

### 0.3 ISSUE — legacy dead code still in the tree (root cause of the old crash)

`src/Components/` holds **58 legacy `.jsx` files** alongside the new `.tsx` files.
On Windows `src/components` and `src/Components` are the **same directory**, so the
shadcn tree and the old tree are physically interleaved:

```
src/Components/
  auth/LoginPage.tsx        <- new
  Login/Login.jsx           <- legacy, dead
  CategorySlider/CategorySlider.jsx   <- legacy, dead
  ui/button.jsx             <- new
  ...
```

This is what produced the earlier crash:
`Element type is invalid ... Check the render method of 'CategorySlider'` — the name
resolved to the legacy `react-slick` component.

Verified dead (no `.tsx` file imports them):
`src/Apis/` (7 files), `src/Context/` (5 files), `src/Hooks/` (2 files),
`src/App.jsx`, `src/main.jsx`, `src/App.css`, plus the legacy `.jsx` folders
`BrandProducts, Carts, Category, CategorySlider, ForgetPassword, Loader, Login,
MainSlider, Navbar, Newsletter, Notfound, Orders, ProductCard, ProductDetails,
ProductItems, Products, PromoBanner, Register, ResetPassword, SubCategories,
VerifyResetCode, WishList, BasicModal.jsx`.

---

## 1. Phase order

| # | Phase | Depends on |
| --- | --- | --- |
| 1 | Re-init git, single working dir | — |
| 2 | Delete legacy dead code | 1 |
| 3 | Extract design tokens for new screens | 0.1 |
| 4 | Home page (node `16-4856`) | 3 |
| 5 | Auth: shared `AuthLayout` + login | 3 |
| 6 | Auth: reset + verify (+ register, forgot) | 5 |
| 7 | Asset import + code-split + QA | 4, 6 |

---

## 2. Phase 1 — Git + single working directory

1. Delete `Fresh-Cart-clean` (it is now a stale duplicate; keeping both guarantees drift).
2. `git init` in `Fresh-Cart`, create branch `feature/figma-redesign-and-api-v2`.
3. Commit `chore: baseline - shadcn/ui redesign with API v2 data layer` as the
   single squashed baseline replacing the lost 6 commits.
4. Do **not** add a GitHub remote until you tell me the repo URL.

## 3. Phase 2 — Delete legacy dead code

Delete everything listed in 0.3. Keep only:

```
src/
  App.tsx  main.tsx  router.tsx  index.css
  Components/{auth,brands,Home,Layout,Products,ui}
  config/  lib/
```

Checks to run after deletion:
- `npm run build` must still pass (it does today).
- `grep -r "Components/\(Login\|Carts\|MainSlider\|...\)"` → zero hits.
- No duplicate-name collisions remain in `src/Components/`.

**Risk:** the legacy files are the only record of some original API-v1 shapes.
Mitigation: `git init` + baseline commit happens *first* (Phase 1), so the deletion is
recoverable via `git checkout`.

## 4. Phase 3 — Design tokens (needs the design)

Extend `src/index.css` `@theme` and `src/config/site.ts` with whatever the new screens
introduce. Existing tokens to keep as-is:

| Token | Value |
| --- | --- |
| `--color-primary` | `#16A34A` |
| `--color-primary-dark` | `#009966` |
| `--color-ink` | `#1E2939` |
| `--color-surface-2` | `#F3F4F6` |
| font | Exo (400/500/600/700) |

Add: auth-page background/gradient, input border colour + focus ring, button radius,
card radius, illustration/asset slots.

## 5. Phase 4 — Home page (Figma node `16-4856`)

Current home already has the component set; Phase 4 is **pixel-accuracy against
`16-4856`**, not new architecture:

- `HeroSlider` — Embla, autoplay, arrows, dots
- `CategorySlider` — Embla autoplay category carousel
- `CategoriesRow` — static scroll row
- `PromoBanner` — two gradient cards
- `ProductGrid` / `ProductCard` — 1→5 columns + skeletons
- `BrandsGrid` — hover-reveal brand cards
- `Newsletter` — RHF + Zod

Work per section: section order + spacing rhythm, then component internals, then
responsive breakpoints (base / sm / md / lg / xl).

## 6. Phase 5 — Auth: shared `AuthLayout`

Login, register, forgot, verify-reset, and reset all share one shell. Extract it so the
shell is written **once**:

**New file `src/Components/auth/AuthLayout.tsx`**

```
props: { title, subtitle, footer?, children }
renders: split layout — visual/brand panel + form panel,
         collapses to single column on mobile
```

Then `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `VerifyResetCodePage`,
`ResetPasswordPage` each become thin: title + subtitle + `<AuthLayout>` + RHF/Zod form.

Existing validation is already in place and stays:

| Page | Rules |
| --- | --- |
| Login | email format, password ≥ 6 |
| Register | name ≥ 2, email format, password ≥ 6, confirm match, terms |
| Forgot | email format |
| Verify | 6-digit code |
| Reset | new ≥ 6, confirm match |

Keep: `role="alert"` on errors, `aria-invalid`, `aria-describedby`, `disabled` while
pending, server errors in `Alert variant="destructive"`, success via `sonner`.

## 7. Phase 6 — Reset + verify specifics

- **Verify reset code** — single OTP-style field (`inputMode="numeric"`,
  `maxLength={6}`, `autocomplete="one-time-code"`), resend-code action with
  cooldown, error states for invalid/expired code.
- **Reset password** — new + confirm with inline match validation, strength hint,
  success → redirect to `/login`.
- Both must confirm the design's navigation path (does verify → reset, or
  reset → verify?) before wiring.

## 8. Phase 7 — Assets, perf, QA

- Import real design assets (logo, hero slides, auth illustration, category/brand
  imagery) once the design is readable; SVG inlined via Vite, raster optimised.
- **Code-split** — the build warns the main chunk is ~750 kB. Lazy-load
  `ProductsPage`, `ProductDetailsPage`, `CheckoutPage`, `ProfilePage`, `OrdersPage`
  via `React.lazy` + route-level `Suspense`.
- **Perf** — `loading="lazy"` + `decoding="async"` on all non-hero images; hero eager
  with `fetchpriority="high"`; keep TanStack Query `staleTime`/`gcTime` and
  `refetchOnWindowFocus: false`.
- **Security** — no token in `localStorage` beyond the Zustand persist store already
  in place; per-request token in the axios interceptor; server messages rendered as
  text (never `dangerouslySetInnerHTML`); `VITE_APP_URL` for checkout redirect.
- **QA gates:** `npm run build` ✓, `npm run lint` ✓, `npm audit` 0 vulnerabilities,
  every route renders without console errors, keyboard-only pass on all forms.

---

## 9. Decisions — still needed from you

1. ~~How to give me the design~~ — **decided: Figma MCP (option A)**. Config fixed;
   awaiting OpenCode restart + `/mcps` OAuth sign-in. See 0.1.
2. **Revoke the leaked PAT** `figd_...` in Figma → Settings → Security. See 0.1.
3. **Node IDs** for login, reset-password, and verify-reset screens (your link only
   had `16-4856` for home).
4. **Scope for this pass** — home + auth only, or the whole design file
   (product details, cart, checkout, profile, orders, brands, categories)?
5. **Remote** — should I add a GitHub remote and push the branch?

## 9b. Not blocked by the design

Phases 1 and 2 (git re-init, delete legacy dead code) do not need the Figma design and
can start immediately. They are also a prerequisite for Phase 3, since they establish
the recoverable baseline before any sweeping changes.

## 10. Out of scope / explicitly not doing

- No backend changes; API v2 stays as implemented.
- No new state library — Zustand + TanStack Query v5 stay.
- No styling library beyond shadcn/ui + Tailwind v4.