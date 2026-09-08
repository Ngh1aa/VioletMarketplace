# Violet Marketplace

Modern multi-category ecommerce marketplace prototype built with Next.js App Router and TypeScript.

The product is intentionally separated into three surfaces that share one design language:

- **Buyer Marketplace** — discovery, search, product detail, cart and checkout
- **Seller Center** — revenue, orders, inventory and operational tasks
- **Marketplace Admin** — marketplace health, seller KYC, moderation, campaign and risk operations

## Product direction

Violet is not a visual clone of Shopee. The design goal is **the same commerce power with lower cognitive load**: strong search, trustworthy seller context, controlled promotion hierarchy, clear multi-seller cart behavior and a distraction-free checkout.

Core visual direction: **Premium Consumer Tech × Editorial Commerce × Friendly Marketplace**.

## Stack

- Next.js App Router
- TypeScript
- React
- CSS design tokens
- Mock commerce data for prototype flows
- localStorage cart state

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main routes

- `/` — Buyer homepage
- `/search` — Search / PLP
- `/product/[slug]` — Product detail
- `/cart` — Multi-seller cart
- `/checkout` — Checkout
- `/seller` — Seller Center
- `/admin` — Marketplace Admin

## Current prototype scope

Implemented:

- Search-first marketplace homepage
- Category discovery
- Flash Deals
- Violet Mall
- Recommendation feed
- Search results and category filtering
- Product detail with seller trust, voucher and delivery context
- Multi-seller cart
- Checkout and order-success state
- Seller operations dashboard
- Marketplace admin dashboard
- Responsive layouts

Simulated / not connected to a backend yet:

- Authentication
- Product and inventory API
- Payment capture
- Voucher validation
- Fulfilment
- Chat
- Seller KYC workflow
- Fraud detection
- Returns / dispute processing
- Personalization engine

## Next milestones

1. Complete account, orders, wishlist, voucher wallet and storefront pages
2. Add richer seller modules: product management, inventory, campaigns and analytics
3. Add richer admin modules: moderation, CMS, reports and risk queues
4. Replace mock data with backend services
5. Add automated UX and accessibility checks
