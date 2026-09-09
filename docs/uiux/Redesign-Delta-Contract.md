# Redesign Delta Contract — Violet V4

## Purpose
V4 must be a structural redesign of the buyer storefront, not a V3 reskin. The delta is:

`styled luxury storefront → curated multi-house fragrance discovery ecosystem`

## Preserve list
- Violet identity, warm ivory / aubergine / lilac family.
- Scent Portrait concept and deterministic truth boundary.
- Fictional maisons/catalog data unless a data-model change is required by V4.
- URL-persistent PLP refinement.
- Cart/localStorage behavior and simulated checkout disclosure.
- GitHub Pages / vanilla HTML-CSS-JS architecture.
- Calm commerce language and no artificial urgency.

## Required OLD → NEW structural change

### 1. Hierarchy
OLD: homepage repeatedly explains Violet through manifesto/method/trust sections; PLP/PDP contain more copy before the product/service model becomes obvious.
NEW: product object, house, discovery/sample path and commerce decision become the dominant evidence. Brand philosophy is mostly implied by curation/media and limited to concise copy.

Pass condition: first-screen and first two content transitions on Home/PLP/PDP communicate task + decision without relying on long explanatory copy.

### 2. Composition / silhouette
OLD: strong asymmetric hero followed by repeated full-width headings and 3-card grids; PLP is sticky filter + continuous 3-column grid; PDP is tall image + long single info dossier.
NEW: at least four composition families across primary roles: campaign diptych, curated shelf with editorial interruption, product/format dossier, house portrait/discovery table/consultation desk.

Pass condition: logo-hidden cross-page montage visibly differentiates Home, PLP, PDP, House and Discovery while preserving Violet DNA.

### 3. Journey / decision sequence
OLD: Finder → three products; PDP `Try first` → general Discovery SKU; no post-sample state.
NEW: discovery is modeled as a coherent path: choose direction → sample/discovery format → wear/evaluate → refine/revisit → full bottle. Local evaluation may be simulated and must be labeled.

Pass condition: representative browser QA can traverse a truthful discovery route and return to a full-bottle decision without dead-end or false integration claim.

### 4. Page-role differentiation
OLD: House is not a first-class page role; Discovery is mostly a category/product; Home/PLP/PDP carry most of the experience.
NEW: Houses and Discovery receive dedicated roles/routes. Finder remains consultation. Cart/checkout remain transaction roles.

Pass condition: Page-Role Matrix is implemented with distinct top-of-page composition and decision object for each material role.

### 5. Media dominance
OLD: media is improved stock/prototype imagery, but shared treatment and lavender fields carry much of the brand.
NEW: object-study/campaign still-life media becomes primary proof; product cards reduce prose; house/discovery pages use controlled crop/light/material families.

Pass condition: no visible branded-placeholder conflict, broken/blank media, accidental crop or same-image duplication in representative screenshots; media occupies materially more visual authority than V3 where the page role requires it.

### 6. CTA / proof placement
OLD: trust/proof often appears in generic strips or later dossier sections.
NEW: proof is colocated with decisions: house/provenance near product identity, sample/reality note near format action, discovery policy near discovery path.

Pass condition: a reviewer can identify `decision → proof → action` relationship without scrolling through a generic trust block.

### 7. Interaction / state behavior
OLD: filters and cart are strong; sample journey has no evaluation/refinement state.
NEW: preserve filter/cart states; add only useful local sample/evaluation states with explicit recovery and prototype labeling.

Pass condition: every new state has selected/feedback/recovery behavior and no state implies unsupported server persistence/AI.

## Non-delta / out of scope
- No mobile/tablet redesign in V4.
- No real payment/auth/account/CMS/inventory integration.
- No production personalization engine.
- Seller/admin redesign not required unless shared changes regress them.

## Failure rule
V4 FAILS structural gate if the visible result is mainly new colors, font, spacing, radius, gradients, image swaps or another universal hero/card shell without the journey/page-role changes above.
