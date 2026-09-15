# Implementation Plan — Violet Mobile Discovery

## Owner map
- `scent-portrait.js`: profile questions, deterministic scoring, explanations, profile persistence.
- `discovery-loop.js`: trio similarity, balance, replacement/removal, feedback loop, prototype trio bag action.
- `personalization-loop.js`: PDP match explanation and cross-route profile handoff.
- `mobile-discovery.css`: buyer mobile composition and touch states; operational mobile density separation.
- `finder.html`, `discovery.html`, `product.html`: semantic containers and explicit truth labels.
- `scripts/mobile_discovery_qa.mjs`: 390px task validation and screenshots.
- `.github/workflows/mobile-discovery-qa.yml`: cloud mobile/touch gate.
- `.github/workflows/uiux-factory-target-qa.yml`: current Factory pin, expanded representative routes.

## Sequence
1. Replace four-question portrait with full preference model.
2. Persist profile and feedback evidence locally.
3. Add recommendation explanations and trio-forward CTA.
4. Upgrade trio with balance/similarity/replace/add-to-bag.
5. Add post-wear feedback and deterministic refinement.
6. Add PDP profile explanation and sample/full-bottle distinction.
7. Add mobile composition layer and touch navigation.
8. Tighten seller/admin density distinction without inventing live operational claims.
9. Run 390px journey QA and existing desktop/Factory gates.
10. Open screenshots, repair P0/P1, rerun affected gates, PR, merge only if green.

## Regression constraints
- do not reintroduce remote runtime media;
- preserve Figma capture helper;
- preserve desktop Home/PLP/PDP quality and Lighthouse thresholds;
- preserve browser-local cart prototype behavior;
- no new framework or package manifest.
