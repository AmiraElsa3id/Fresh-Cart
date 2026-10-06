# Figma node map — Freshcart [E-Commerce]

Source of truth: file `7GOjynvDWj2Lnbb4IKjbXK`, pages `12:2477` (High-Fidelity) and `54:25108` (Foundation).

Selection links give node ids as a trailing `48-1234` → `48:1234`.

## Why this file exists

`get_figma_data` with no `nodeId` returns ~73.5k lines, which is too large to hold in
context. Every query costs a full re-read. This map is the index — look a node up here
instead of re-pulling the file.

It also records two things that are easy to get wrong:

1. **The `ELEMENTS:` section uses synthetic `EL-*` ids, not real Figma node ids.**
   `download_figma_images` needs real ids. Those live in the `NODES:` section as `#16:1234`.
   `EL-*` values are shared *templates* — many nodes can point at one, and a node that
   renders as `template=EL-xxx` carries no fills of its own. Always resolve through `NODES:`.

2. **Both hero slides share one banner.** Nodes `16:7216` and `16:7237` both resolve to
   `template=EL-80789172`, i.e. the same `imageRef`. There is only one hero image in the file.

## Frames — High-Fidelity (`12:2477`)

Every page exists at all three breakpoints.

| Screen | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Home | `16:4856` | `16:7342` | `16:9742` |
| Product Details | `24:2340` | `24:3176` | `24:3897` |
| Sign up | `24:4988` | `24:5437` | `24:5849` |
| Login | `24:6713` | `24:7144` | `24:7557` |
| Cart | `38:3164` | `38:3790` | `38:4391` |
| Checkout | `38:5629` | `38:6212` | `38:6777` |
| Orders | `38:8450` | `38:9230` | `38:9986` |
| Products Search | `38:12457` | `38:13544` | `38:14611` |
| Wishlist | `38:16020` | `38:16520` | `38:17007` |
| Profile — settings | `51:4193` | `51:4543` | `51:4883` |
| Profile — addresses | `52:5730` | `52:6015` | `52:6290` |
| Brands | `52:7253` | `52:7888` | `52:8513` |
| Categories | `52:9833` | `52:10168` | `52:10493` |
| Products | `54:13500` | `54:15244` | `54:16978` |
| Forgot Password | `54:20254` | `54:20557` | `54:20850` |
| Reset Verify Code | `54:22665` | `54:22969` | `54:23263` |
| Reset Password | `54:23995` | `54:24303` | `54:24601` |

Note: Desktop Cart (`38:3164`) and Wishlist (`38:16020`), Categories (`52:9833`) and
Profile — addresses (`52:5730`) come back as `template=EL-…` with no dimensions, so their
layout has to be inferred from their Tablet/Mobile siblings.

Foundation page (`54:25108`) holds a single frame `61:52` (1131×754) — the token scales.

## Assets

Node id → what it is. Download with `download_figma_images`; all `IMAGE-SVG` nodes export
as `.svg` with no `imageRef`, everything else is an IMAGE fill and needs its `imageRef`
plus `cropTransform` copied out of `NODES:`.

### Already imported → `public/images/`

| Node | File | Notes |
| --- | --- | --- |
| `16:7079` | `freshcart-logo.svg` | 166×32. Also at `16:7261` in the header. Favicon source. |
| `16:7216` | `hero-banner.jpg` | 1024×213 — see the resolution caveat below. |
| `16:7198` / `16:7203` / `16:7208` | `visa.svg` / `mastercard.svg` / `paypal.svg` | 18×14 each. |
| `16:7007` / `16:7019` | `app-store.svg` / `google-play.svg` | 25×20 each. Not yet used. |
| `16:4981` … `16:5035` | `categories/*.jpg` | 10 cards, see below. |

Category cards: `16:4981` music, `16:4987` mens-fashion, `16:4993` womens-fashion,
`16:4999` supermarket, `16:5005` baby-toys, `16:5011` home, `16:5017` books,
`16:5023` beauty-health, `16:5029` mobiles, `16:5035` electronics.

Not yet used — the app serves category art from the API and local copies would shadow it.
Kept as design reference / offline fallback.

### Deliberately not imported

The small UI glyphs are already `lucide-react` or inline SVG in the app, which is better:
tree-shakeable, `currentColor`-themable, no extra request.

| Node | Glyph |
| --- | --- |
| `16:4867` / `16:4876` | top bar truck / sparkle |
| `16:4885` / `16:4890` | top bar phone / mail |
| `16:4899` / `16:4905` | top bar user / sign out |
| `16:4916` / `16:4928` / `16:4938` / `16:4948` | trust badges: shipping, secure, returns, support |
| `16:4974` | arrow-right (20×16) |
| `16:5064` / `16:5089` | promo banner CTA arrows |
| `16:5104` / `16:5108` / `16:5111` | product card wishlist / compare / quick view |
| `16:6938` / `16:6957` / `16:6963` / `16:6969` / `16:6983` | newsletter icon, bullets, submit arrow |
| `16:7037` / `16:7046` / `16:7055` / `16:7064` | pre-footer trust row (48px) |
| `16:7120` / `16:7124` / `16:7128` / `16:7132` | footer social — `SocialIcons.tsx` already covers these |
| `16:7245` / `16:7248` | slider prev / next |
| `16:7290` / `16:7300` / `16:7308` | header search, chevron, support |
| `16:7317` / `16:7321` / `16:7325` | header actions: wishlist, cart, user |

Product card images (`16:5100` onward, ~60 frames) are **not** imported. They are snapshots
of live API product records; the app must render whatever the API returns.

## Hero resolution caveat

The design's hero frame is 1920×400, but the source image in the file is **1024×213**.
`pngScale: 2` does not help — the exporter returned 1024×213 for both scales, so the image
itself is that size. At full desktop width that is ~0.53×, i.e. visibly soft.

Mitigated by the design's own heavy gradient overlay
(`linear-gradient(90deg, rgba(0,201,80,.9), rgba(5,223,114,.5))`), which covers most of it.
If it reads badly on a large display, swap in a higher-resolution source.

## Design tokens worth noting

The design does **not** use one green. It uses at least four:

| Value | Role |
| --- | --- |
| `#009966` | primary text/accent on light (`fill_59c17bbf`, `ts2`) |
| `#16A34A` | the `primary-500` already in the theme (`fill_4cbfd735`) |
| `#00BC7D` | gradients, shadows (`rgba(0,188,125,…)`), glass fills |
| `#00D492` / `#00C950` | bright accents, CTA text on white |
| `#22C55E` | logo mark green (`fill_c378b97c`) |
| `#15803D` / `#008236` | primary-700 / success green |

Other tokens: ink `#1E2939`, body `#364153`, muted `#6A7282`, faint `#99A1AF`,
`#101828`, surface-2 `#F3F4F6`, `#F9FAFB`, success `#F0FDF4`/`#DCFCE7`/`#D0FAE5`,
border `#E5E7EB`, discount badge `#FB2C36` (**not** shadcn's `destructive` default).
Typeface is **Exo** throughout at 400/500/600/700 — already loaded in `index.html`.
