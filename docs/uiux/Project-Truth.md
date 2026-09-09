# Project Truth — Violet V4

## Product

Violet Parfumerie is a static interactive prototype of a curated multi-house niche-fragrance marketplace. It is not a single-brand perfume house and should not visually behave as one. Its strongest strategic opportunity is to combine luxury editorial restraint with marketplace usefulness: cross-house discovery, sampling, expert curation and explainable scent choice.

## Current architecture

- Static HTML pages deployed to GitHub Pages.
- Shared foundation: `styles.css`, `perfume-luxury.css`, `desktop-luxury-v2.css`, `desktop-experience-v3.css`.
- Shared behavior: `app.js`; V3 buyer enhancement: `storefront-v3.js`.
- Catalogue: mocked products in `data.js`.
- Cart: browser `localStorage` (`violet-marketplace-cart-v1`).
- No server, CMS, auth or payment processor.
- GitHub Pages deploys every push to `main`; deploy workflow includes asset cache-busting.

## Current buyer routes

- `index.html` — homepage / brand-discovery
- `search.html` — fragrance library / PLP
- `product.html?id=...` — product detail
- `finder.html` — Scent Portrait assisted discovery
- `cart.html` — fragrance bag
- `checkout.html` — simulated checkout
- `order-success.html` — simulated confirmation

Secondary operational prototype routes `seller.html` and `admin.html` remain outside the V4 buyer visual-completion claim unless a shared-chrome change requires compatibility work.

## Current strengths to preserve

- Violet is already perfume-specific rather than a generic multi-category marketplace.
- Warm ivory, lilac, aubergine and editorial serif/sans rhythm create a recognisable base.
- PLP filter state is URL-persistent and recoverable.
- PDP exposes scent family, mood, presence, notes and curation rationale.
- Scent Portrait is deterministic and truthful about not being fake AI.
- Checkout explicitly says payment is simulated.
- Automated desktop QA already checks overflow, images, interaction state and key commerce actions.

## Current constraints

- Prototype product/house facts are fictional representative content.
- Current media are remote stock/prototype assets, not final licensed campaign photography.
- Only desktop visual quality is in declared scope.
- No production claim may be made for checkout, sample fulfillment, authentication or personalised AI.

## V4 success definition

V4 succeeds when a logo-cropped cross-page screenshot set still reads as one coherent, premium multi-house perfumery; product and house evidence outrank explanatory brand copy; discovery/sample decisions are first-class; and Home, PLP, PDP, House, Discovery and Finder each have composition suited to their distinct user question rather than a universal luxury shell.