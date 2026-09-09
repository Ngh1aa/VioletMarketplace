# OLD Baseline — Violet V3

## Baseline identity
- Visual baseline: Violet Desktop Experience V3 at head `5ecb3f7e10723660791747121775a29ecdb91ca2`.
- Current production/main includes later cache-busting workflow merge `65667ec9422588e4cafaa31f6d096b13909dc51a`; PR #8 changed deployment plumbing only, not layout/content, so V3 render remains the valid OLD visual baseline.
- Rendered artifact: `violet-storefront-v3-qa`, digest `sha256:52c53be3b3552c095d1ed8aeb83b701db405dd7ac5c0fe3b5917e0674e5646cd`.

## Evidence inspected
### 1440×1000 full-page
- `home-v3-1440.png`
- `library-v3-1440.png`
- `library-intimate-v3-1440.png`
- `pdp-violette-v3-1440.png`
- `scent-portrait-v3-1440.png`
- `bag-v3-1440.png`
- `checkout-v3-1440.png`

### Desktop pressure captures
- `home-1280-top.png`
- `pdp-1280-top.png`
- `home-1600-top.png`
- `pdp-1600-top.png`

## Visual silhouette observations
### Home
Strong asymmetric hero: one large atmospheric image-led field plus two stacked side stories. Below the hero, page rhythm becomes a long succession of editorial statement, manifesto, category table, three-product grids, dark house grid, another three-product grid, concierge and trust strip. Result: strong first screen, weaker compositional surprise later.

### Library
Large pale editorial title field, sticky left refinement rail and three-column product grid. Mechanically clear; silhouette is still conventional catalogue for most scroll depth.

### PDP
Large sticky image on left and detailed information column on right. Strong decision framing at top; the long numbered dossier below makes one side text-heavy and gives documentation more weight than product object/format choice.

### Scent Portrait
Distinct two-pane consultation composition; strongest differentiated page role in V3 and should be preserved conceptually.

### Bag / Checkout
Calm, restrained transactional pages; no need for aggressive redesign unless V4 shared system introduces regression.

## Baseline pass/limitations
- V3 automated report: PASS, score 100, no P0/P1 at tested routes.
- Baseline proves technical sanity and visual state; it does not prove customer preference, conversion or production integrations.
- Declared V4 desktop scope reuses 1280, 1440 and 1600 because these are the existing verified pressure points in the project profile. Mobile/tablet are N/A_JUSTIFIED.
