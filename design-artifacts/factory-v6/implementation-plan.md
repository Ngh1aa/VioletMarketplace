# UIUX Factory V6 — Implementation Plan

## Target contract

- Repository: `Ngh1aa/VioletMarketplace`
- Branch: `factory/violet-figma-safe-redesign`
- Stack: vanilla HTML/CSS/JavaScript
- External brain: ChatGPT
- Factory owner: contracts, skill policy, browser evidence, accessibility/performance gates and release evidence

## Implementation order

1. **Media transport foundation**
   - Vendor all current buyer-facing fragrance/editorial Pexels sources into `assets/media/`.
   - Keep original URLs in `assets/media-manifest.json` as provenance only.
   - Rewrite runtime HTML/CSS/JS references to same-origin paths.
   - Fail CI if undeclared remote Pexels media remains.

2. **Figma capture contract**
   - Add `figma-capture.js`.
   - Activate only with `?figma=1`.
   - Force image loading to eager, remove non-essential reveal/motion effects, and expose a deterministic readiness state.
   - Preserve normal browsing behavior when the query parameter is absent.

3. **Representative rendered QA**
   - Run UIUX Factory Cloud QA against Home, Library, PDP and Discovery on the actual Violet branch.
   - Collect Playwright browser evidence and screenshots, axe findings and Lighthouse reports.
   - Inspect screenshots before propagation/merge.

4. **Repair from evidence**
   - Fix broken media, overflow, hierarchy regressions, accessibility blockers or performance failures at the earliest owning layer.
   - Do not weaken gates merely to manufacture PASS.

5. **Release**
   - Open PR only after branch evidence is available.
   - Merge only when relevant Violet CI + UIUX Factory target QA pass and screenshots have been visually reviewed.

## Non-goals

- Do not convert Violet into furniture/interior; that phrase is treated as a copied prompt mismatch against the target repository source of truth.
- Do not add a framework rewrite.
- Do not redesign operational flows into decorative showroom pages.
- Do not claim Figma-plugin internals that have not been verified.
