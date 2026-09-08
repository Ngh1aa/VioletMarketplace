# Violet Marketplace

Static multi-category ecommerce marketplace prototype built with **HTML, CSS and vanilla JavaScript**. The project has no build step and is designed to deploy directly to GitHub Pages.

## Pages

- `index.html` — Buyer marketplace homepage
- `search.html` — Search / product listing
- `product.html?id=...` — Product detail
- `cart.html` — Multi-seller cart
- `checkout.html` — Checkout
- `order-success.html` — Order confirmation
- `seller.html` — Seller Center dashboard
- `admin.html` — Marketplace Admin dashboard

## Run locally

You can open `index.html` directly, but a small static server is recommended:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. Every push to `main` publishes the repository root as a GitHub Pages site.

Expected URL:

`https://ngh1aa.github.io/VioletMarketplace/`

If Pages has never been enabled for the repository, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** once.

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
├── styles.css
├── data.js
├── app.js
├── .nojekyll
└── .github/workflows/pages.yml
```

Commerce data is mocked in `data.js`. Cart state is saved to `localStorage`, so the buyer flow works entirely in the browser with no backend.
