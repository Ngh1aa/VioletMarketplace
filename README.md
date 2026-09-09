# Violet Parfumerie

**Violet Parfumerie** is a static luxury fragrance marketplace prototype built with **HTML, CSS and vanilla JavaScript**. It focuses on curated niche perfume houses, olfactive discovery, discovery sets and a quieter premium commerce experience rather than a noisy multi-category marketplace.

## Product direction

- Curated fragrance marketplace, not a general-purpose marketplace
- Luxury visual language: warm pastel violet, dusty rose, aubergine, ivory and restrained champagne accents
- Editorial typography and product-first layouts
- Discovery by **olfactive family / notes / mood**, not electronics-fashion category patterns
- Marketplace trust reframed around authenticity, provenance and curated fragrance houses
- Existing cart, checkout, seller center and admin flows are preserved

See [`DESIGN-DIRECTION.md`](DESIGN-DIRECTION.md) for the current visual and UX rationale.

## Pages

- `index.html` — Violet Parfumerie buyer homepage
- `search.html` — fragrance library / product listing
- `product.html?id=...` — fragrance detail with note pyramid
- `cart.html` — fragrance bag grouped by maison
- `checkout.html` — quiet checkout
- `order-success.html` — order confirmation
- `seller.html` — Fragrance House Center
- `admin.html` — marketplace curation / authenticity operations

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

Every push to `main` is deployed through `.github/workflows/pages.yml`.

Expected URL:

`https://ngh1aa.github.io/VioletMarketplace/`

## Architecture

```text
VioletMarketplace/
├── index.html
├── search.html
├── product.html
├── cart.html
├── checkout.html
├── order-success.html
├── seller.html
├── admin.html
├── styles.css              # foundation / legacy shared layout
├── perfume-luxury.css      # Violet Parfumerie visual layer
├── data.js                  # mocked fragrance catalog
├── app.js                   # marketplace buyer behavior
├── DESIGN-DIRECTION.md
├── .nojekyll
└── .github/workflows/
```

Commerce data is mocked in `data.js`. Cart state is stored in `localStorage`, so the buyer flow works entirely in the browser with no backend.