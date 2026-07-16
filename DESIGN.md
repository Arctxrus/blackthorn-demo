# DESIGN.md — Blackthorn & Co.

Design system of record for the Blackthorn & Co. demo site (fictional premium barber-led salon, Heywood, Greater Manchester). Single-page, vanilla HTML/CSS/JS. Structure inspired by reference "site 1", mood by "site 2" — original, not cloned. Reference screenshots live in `references/`.

---

## 1. Visual Theme

**"Warm heritage barbershop."** Cream and espresso with a caramel-gold accent. Editorial serif headings with sparing script flourishes, soft curved/arched image shapes (never brush-stroke edge masks). Premium but neighbourly — a well-kept independent shop, not a chain, not concept art. Barber-led but all welcome; warm & welcoming premium tone.

**Wow moment:** the arched hero image with an offset serif headline + one handwritten annotation, paired with an always-present Book/Call action (nav on desktop, sticky bottom bar on mobile).

---

## 2. Colour Palette

Warm-tinted neutrals; never pure black/white. All pairings pre-checked for WCAG AA (verify again after build).

| Token | Hex | Role | Contrast notes |
|---|---|---|---|
| `--ink` | `#26201A` | Primary text; dark UI | 13:1 on `--cream` ✓ |
| `--espresso` | `#241E18` | Dark section band (reviews) + footer bg | — |
| `--cream` | `#FAF6EF` | Page background | — |
| `--sand` | `#EFE6D8` | Alternating section tint | — |
| `--ivory` | `#FFFDF9` | Card surfaces | — |
| `--caramel` | `#8A5A2B` | Interactive / CTA / links / focus ring | white text ≈ 6:1 ✓ |
| `--caramel-dark` | `#734A22` | CTA hover | white text ≈ 7.5:1 ✓ |
| `--tan` | `#C79A6A` | Decorative accents, dividers, script words | never carries small text; ≈ 5.5:1 on espresso for large ✓ |
| `--border` | `#E4D8C6` | Hairlines, card borders | — |
| `--muted-text` | `#6B5D4F` | Secondary text | ≈ 5.9:1 on cream ✓ |
| `--cream-on-dark` | `#FAF6EF` | Text on espresso band | ≈ 14:1 ✓ |
| `--star` | `#C79A6A` | Review star fill (tan, not generic yellow) | — |
| `--error` | `#B4462F` | Form validation errors (warm red, on-palette) | ≈ 4.8:1 on cream ✓ |

Rules: caramel for anything interactive; tan is decorative only. Dark espresso band gives one strong contrast break (echoing both references' dark sections) without a navy.

---

## 3. Typography

Three families, subset to used weights only, `font-display: swap`, preconnect to `fonts.gstatic.com`. Distinctive per frontend-design rules — no Inter/Roboto/Arial/system.

- **Display — Fraunces** (warm high-contrast serif). Weights: `400`, `600`, `900`, plus **italic 400** used as the site-2-style elegant accent (a single flourished word). Headings fluid via `clamp()`.
- **Body/UI — Hanken Grotesk**. Weights: `400`, `500`, `700`. Body 16px min, line-height 1.6.
- **Handwritten accent — Caveat** `500`. **Used a maximum of twice site-wide** (one hero annotation, one near booking).

Type scale (fluid):
- Hero H1: `clamp(2.5rem, 6vw, 4.5rem)` Fraunces 900, `text-wrap: balance`
- Section H2: `clamp(1.9rem, 4vw, 3rem)` Fraunces 600
- H3 / card titles: `clamp(1.15rem, 2vw, 1.4rem)` Fraunces 600
- Body: `1rem`–`1.0625rem`, Hanken 400
- Eyebrow/labels: `0.8125rem`, Hanken 700, `letter-spacing: 0.14em`, uppercase
- Prices: Hanken 700, `font-variant-numeric: tabular-nums`

Google Fonts request (weights only):
`Fraunces:ital,wght@0,400;0,600;0,900;1,400` · `Hanken+Grotesk:wght@400;500;700` · `Caveat:wght@500` · `&display=swap`

---

## 4. Component Stylings

- **Buttons — primary:** `--caramel` bg, `--ivory` text, radius `999px` (pill), min-height 48px, hover → `--caramel-dark` + subtle lift (`translateY(-1px)`), 180ms. Focus-visible: 2px `--caramel` ring + offset.
- **Buttons — secondary/ghost:** transparent bg, 1px `--ink` border, ink text; hover fills `--ink`/cream.
- **Cards:** `--ivory` bg, 1px `--border`, radius `18px`, shadow `0 1px 2px rgba(38,32,26,.06), 0 12px 30px -18px rgba(38,32,26,.25)`.
- **Service card:** icon (inline SVG, currentColor caramel) + title + short copy + price + per-card **Book** button. (Prices live here only — no duplicate pricing table.)
- **Form validation:** inline `.field-error` (warm `--error` red + warning glyph) under the field, `.has-error` tints the input; success replaces the form with a styled `.form-success` confirmation.
- **Review card:** ivory, star row (tan), quote (Fraunces italic-free, Hanken), name + "Google review" label with inline Google glyph.
- **FAQ:** native `<details>/<summary>` — works with zero JS; caret rotates; JS only closes siblings (progressive enhancement).
- **Form fields:** 48px min height, 1px `--border`, radius 12px, label always visible above field, focus ring caramel, inline helper text.
- **Icons:** inline SVG only (no emoji). Scissors, razor, beard/brush, hot towel, clock, phone, pin, star, Google, chevron.

---

## 5. Layout

Section order (site-1 structure, reimagined). No two adjacent sections share the same column structure.

1. **Header/nav** — sticky, translucent cream; logo left, links centre/right, **Book now** pill (desktop ≥768px). Mobile: logo + hamburger.
2. **Hero** — arched/rounded image (overlap onto next section via negative margin), offset headline, caramel Book CTA + ghost "Our services", one Caveat annotation.
3. **About** — asymmetric `grid-cols-[5fr_7fr]` (≥1024px), rounded-top image left, text right, small stat row.
4. **Services** — responsive card grid 1 → 2 → 3 cols; per-card Book buttons.
5. **Reviews band** — full-bleed `--espresso`; Google rating summary + 2–3 review cards; cream text.
6. **Team** — "Meet the barbers"; offset/staggered cards (3–4), portrait + name + specialism.
7. **Gallery** — varied/bento grid on desktop, 2-col on mobile; lazy-loaded.
8. **FAQ** — single-column accordion, comfortable max-width.
9. **Booking + contact** — two-column on desktop (form + shop summary), single column mobile. Styled form with client-side validation (required fields + UK-mobile check, inline errors) and a styled success state; swappable for Cal.com.
10. **Hours + map** — hours table + keyless OpenStreetMap embed centred on **Heywood town centre (Market Street, OL10)** with a styled fallback location card; fictional address printed beside the map in text (honest, avoids a random pin).
11. **Footer** — `--espresso`; NAP, hours, nav, socials, fine print.

_Note: there is no standalone Pricing section — prices live on the Services cards only (single source of truth, so a client updates a price in one place)._
- **Sticky mobile action bar** (<768px): fixed bottom, **Book** (caramel) + **Call** (ghost), each ≥44px, safe-area padding.

---

## 6. Depth / Elevation & Atmosphere

- Warm-tinted shadows (brown-black, never grey): `0 12px 30px -18px rgba(38,32,26,.25)`.
- Soft radial cream glow behind hero; subtle 1.5% grain SVG overlay on the espresso band only (depth without noise).
- Curved section divider (CSS `border-radius` on the arch + one gentle SVG wave between hero/about) — **no brush-stroke masks**.
- Concentric radii: child radius ≤ parent radius.

---

## 7. Do's and Don'ts

**Do:** warm-tinted neutrals; caramel = interactive only; Caveat max twice; 44px+ touch targets; overlay behind any text on photos; tabular-nums on prices; `prefers-reduced-motion` honoured; images lazy where below fold; subset font weights + preconnect + swap.

**Don't:** brush-stroke edge masks (site-2) or literal copies of site-1 patterns; pure `#000`/`#fff`; Inter/Roboto/system fonts; generic yellow stars; `source.unsplash.com` random URLs; horizontal scroll at any width; heavy scroll animations; emoji as icons; geocode the fictional address into the map.

---

## 8. Responsive

Mobile-first. Breakpoints **375 → 768 → 1024 → 1440**. No horizontal scroll at any width. Body readable without zoom (16px+). Touch targets ≥44px with ≥8px spacing. Services grid and gallery reflow gracefully (1→2→3 cols; gallery → 2-col on mobile). Sticky mobile action bar below 768px; nav Book button ≥768px.

---

## 9. Agent Prompt Guide

When extending this site: keep the caramel-on-cream heritage feel; headings Fraunces, body Hanken Grotesk, Caveat only for rare annotations; every interactive element uses `--caramel` and has a visible focus ring; every photo with text over it gets a dark or light overlay for AA contrast; add sections as their own clearly-separated blocks that differ in column structure from neighbours; never introduce a new hue without adding it as a token here first; keep JS minimal and progressive (site must be usable with JS disabled).
