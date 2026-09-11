# Violet → Figma Capture Contract

## Capture URL

After this branch is merged and GitHub Pages updates, use:

`https://ngh1aa.github.io/VioletMarketplace/?figma=1`

The normal site URL remains unchanged for browsing.

## What capture mode changes

`?figma=1` changes rendering mechanics only:

- all fragrance/editorial media resolves from same-origin `assets/media/` paths;
- images are forced to eager loading and synchronous decoding hints;
- non-essential animation/transitions and reveal transforms are disabled;
- the document publishes `data-figma-ready="true"` only after the current image set has loaded successfully;
- `window.__VIOLET_FIGMA_CAPTURE__` records image count and broken-image paths for debugging.

It does **not** change navigation, copy, page hierarchy, product data or buyer decisions.

## Why this exists

The previous prototype loaded product/editorial media from third-party Pexels URLs, much of it injected by JavaScript and lazily loaded. The user's HTML-to-Figma conversion could reconstruct editable nodes while image transfer remained unreliable. The exact converter implementation is external and is not claimed here; this contract removes avoidable third-party transport dependencies from Violet itself.

## Source provenance

Original prototype image URLs remain in `assets/media-manifest.json`. They are research/prototype media references, not claims of final production licensing or fictional-maison campaign ownership.

## Verification

Before merge:

1. no `images.pexels.com` reference may remain in buyer-facing root HTML/CSS/JS;
2. all manifest assets must exist and be non-empty;
3. UIUX Factory target QA must render the real Violet branch;
4. representative screenshots must be inspected;
5. existing Violet visual/interaction gates must stay green.
