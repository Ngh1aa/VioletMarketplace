# IA and Sitemap — Violet V4

## Current primary sitemap

`Home → Library → PDP → Bag → Checkout → Confirmation`

Assisted route: `Home/PLP → Scent Portrait → recommendations → PDP`.

## V4 proposed buyer IA

### Global navigation

1. **Fragrances** — all fragrance/refinement.
2. **Houses** — curated maisons and their collections.
3. **Discovery** — samples, discovery sets and trial ritual.
4. **Scent Portrait** — guided assisted discovery.
5. **Bag** — cart.

Search remains a utility rather than a primary nav category.

### Primary routes

- `index.html` — Editorial marketplace index / route chooser.
- `search.html` — Fragrance Library.
- `product.html?id=...` — Fragrance PDP / buying desk.
- `houses.html` — NEW curated house index.
- `house.html?id=...` — NEW maison detail / collection.
- `discovery.html` — NEW sample/discovery hub and prototype trial route.
- `finder.html` — Scent Portrait consultation.
- `cart.html` — Bag.
- `checkout.html` — Simulated checkout.
- `order-success.html` — Simulated confirmation.

Secondary routes remain outside V4 buyer visual-completion claim:
- `seller.html`
- `admin.html`

## Navigation taxonomy

### Fragrances
Secondary browse/filter concepts: family, mood, presence, concentration, house, discovery eligibility.

### Houses
Curated maison list; each house exposes origin/ethos (fictional representative content), products and a discovery route when supported by prototype data.

### Discovery
Three low-risk paths:
- build a representative sample trio;
- buy a pre-composed Discovery Wardrobe;
- use Scent Portrait to create a shortlist first.

All sample fulfillment/credit is prototype-simulated unless explicitly stated otherwise.

## Why this differs structurally from V3

V3 navigation is fragrance-category led. V4 adds **House** and **Discovery** as top-level mental models, matching the core value of a multi-house perfumery and reducing dependence on perfume terminology.

## Entry-context rule

Do not assume homepage entry. PLP, PDP, House and Discovery pages must orient independently and expose their next best action without requiring users to read brand manifesto content first.