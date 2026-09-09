# IA and Sitemap — Violet V4

## Primary buyer IA

### Global navigation
- Fragrances
- Houses
- Discovery
- Scent Finder
- Search
- Bag

### Fragrances
- All Fragrance
- New to Violet
- Floral
- Woods
- Amber
- Fresh
- Skin Musk
- Discovery formats

### Houses
- All Houses
- Maison Aster
- Atelier Nocturne
- Élan Studio
- Orphée
- Lumière 17
- Nacre
- Violet Parfumerie edits

### Discovery
- Discovery overview
- Violet Discovery Wardrobe
- Guided Scent Portrait
- How to sample on skin
- Evaluate / refine prototype state when implemented

## Primary routes proposed for Phase 2
- `index.html` — Home / brand + discovery gateway
- `search.html` — Fragrance Library / browse + refine
- `product.html?id=...` — Fragrance PDP
- `finder.html` — Scent Portrait
- `houses.html` — all houses index (new)
- `house.html?house=...` — house storefront (new, data-driven static route)
- `discovery.html` — discovery/sample journey hub (new)
- `cart.html`
- `checkout.html`

Seller/admin routes remain outside the buyer-facing V4 visual completion scope unless shared CSS causes regression.

## Entry contexts
- Search/referral may land directly on PDP or House; do not assume homepage-first.
- Fragrance-curious users may enter via Home/Scent Finder.
- Enthusiasts may enter via PLP/House/PDP.
- Gift users may enter via Discovery/Gift Edit.

## Priority journey
`Home/PLP/Finder → PDP → Discovery/sample decision → evaluation/refinement → full bottle → Bag → Checkout`.

## Navigation principles
- Do not expose every category in the top bar at once; use fewer high-level destinations.
- House and Discovery become primary nouns because they differentiate a curated fragrance marketplace.
- Mood remains a browse/filter axis but not a global nav overload.
- No Journal route until real editorial content exists; avoid empty luxury-site conventions.
