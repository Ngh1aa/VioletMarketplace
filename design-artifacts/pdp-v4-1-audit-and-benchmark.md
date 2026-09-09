# Violet PDP V4.1 — Audit + Reference Benchmark

Status: PHASE 1 / NO CODE
Date: 2026-09-10
Scope: desktop product-detail experience only, with regression coverage for shared storefront behavior.

## Why this phase exists

The shipped V4 PDP passed static/browser QA but fails in a real user scroll state. The large sticky product media remains fixed while later full-width story and related sections move underneath it, creating visible occlusion. The page also under-serves the product category: one primary stock image carries too much of the product experience, while copy and editorial labels occupy too much of the decision surface.

This is a process failure as well as a page failure. The existing QA proved that content loaded, controls worked, images decoded and top/full-page evidence existed; it did not prove that sticky/fixed geometry remained valid at real scroll positions.

## User correction that becomes a hard constraint

- Desktop PDP should feel approximately **70% image / 30% text** in its primary decision and storytelling surfaces.
- Perfume photography is the protagonist. Copy supports the object; it does not replace the object.
- Scrolling must never cause product media, labels, story copy, notes or related cards to overlap.

## OLD baseline audit

### KEEP

- Warm-paper / aubergine / editorial Violet V4 visual grammar.
- House → product → character → format → price → decision hierarchy.
- Discovery-trio concept and full-bottle action.
- Notes, house context and reasoned nearby fragrances.
- Honest prototype/system-reality boundary.

### REVISE

1. **P0/P1 scroll geometry** — `.v4-pdp-media` is sticky inside a grid whose later sections span the same parent; at story/related scroll positions the sticky media can cover later content.
2. **Media dominance** — one large stock image is not a credible luxury fragrance product study.
3. **Media identity** — related products use unrelated stock photography with inconsistent bottle forms, lighting and crop language; fictional maison identity collapses.
4. **Decision clarity** — `18 in prototype inventory` and a long prototype disclaimer interrupt the luxury buying moment.
5. **False affordance** — a single 50 ml option is rendered as a pressed button although there is no size choice.
6. **Discovery copy** — `Add direction to trio` is conceptually elegant but unclear for a first-time shopper.
7. **Breadcrumb** — `Violet / Fragrances / Object` hides the actual house and fragrance.
8. **Locale consistency** — English shell/labels and Vietnamese long description read like incomplete localization rather than a deliberate editorial choice.

### REMOVE

- Sticky behavior on any oversized media panel that can cross into later semantic sections.
- Prototype stock-count wording in the primary price row.
- Single-option pseudo-selector.
- Oversized related-card media that competes with the main product.

### ADD

- A real media gallery with explicit roles and at least 4 evidence-bearing media surfaces.
- Stateful scroll visual evidence at top, mid-gallery, story start, related start and bottom.
- Geometric occlusion assertions for sticky/fixed elements.
- Media-role assertions so `image loaded` can no longer stand in for `media strategy fulfilled`.

## Reference benchmark — principles, not cloning

### Byredo — 1996 Eau de Parfum
Reference: https://www.byredo.com/eu_en/p/1996-eau-de-parfum
Observed principle: the same fragrance is supported by multiple product views: bottle hero, spray detail, bottle with box, cap/detail and additional bottle presentation.

ADOPT: multiple views of the same object; product imagery before long explanation.
ADAPT: Violet uses a quieter archival-paper art direction and fictional-house truth boundary.
REJECT: copying Byredo layout, brand marks, copy or proprietary photography.

### Le Labo — Santal 33 Eau de Parfum
Reference: https://www.lelabofragrances.com/santal-33-147.html?size=50ml
Observed principle: product page exposes multiple image slots while keeping format/purchase and story information adjacent to the product.

ADOPT: image plurality + concise commerce information.
ADAPT: Violet keeps Discovery trio as its own marketplace differentiator.
REJECT: Le Labo personalization mechanics and visual identity.

### Diptyque — Orphéon Eau de parfum
Reference: https://us.diptyqueparis.com/en-us/products/eau-de-parfum-orpheon-orphp75c
Observed principle: repeated product imagery and editorial imagery coexist with a clear add-to-bag decision, then story/commitment content follows.

ADOPT: product object first, story after decision; media can carry atmosphere as well as packshot evidence.
ADAPT: Violet uses a 70/30 gallery-to-buying-desk split and smaller related cards.
REJECT: Diptyque branding, award/bestseller framing and proprietary imagery.

## Skill-grounded diagnosis

`asset-media-and-art-direction` requires every image to have a job and explicitly rejects stock media used merely to fill space. It also requires actual rendered crop/overlay inspection for primary focal media.

`visual-design-direction` requires visual composition to map business/user decision objects to the first visual anchor. On a fragrance PDP, the product object is the dominant decision evidence.

`ui-craft-and-visual-qa` explicitly requires checking sticky/fixed elements that cover content, actual rendered imagery, and root-owner repair when a user points out an obvious defect that previous evidence should have caught.

## Root cause

The V4 implementation honored the macro PDP hierarchy but did not fully honor its Media Contract. QA verified decode/overflow/interaction and captured full-page evidence, but it did not capture discrete real-scroll states or test element intersections. A stitched full-page screenshot is not sufficient evidence for sticky behavior.

## Phase 1 verdict

Structural correction is required; cosmetic polish is insufficient.

`PHASE 1 AUDIT = PASSED`

Next artifact must lock the media-dominant composition and scroll-state verification contract before implementation.