# Current Site Audit — Violet V3

## 1. Business and conversion

Current conversion path is valid: discover → browse/filter → PDP → bag → checkout. Scent Portrait adds assisted discovery. The weakness is not missing commerce mechanics; it is that curation and sampling are not yet the organizing logic of the marketplace.

### Primary gap
Violet says “curated, not crowded” but the site does not yet demonstrate curation strongly enough through house structure, sampling, staff/editorial selection or merchandising hierarchy.

## 2. Audience / entry context

Likely entry modes (professional hypothesis, no analytics available):
- shopper already knows a fragrance family/name;
- shopper knows desired mood but not perfume vocabulary;
- niche enthusiast wants a new house/scent;
- gift buyer needs a low-risk route;
- returning shopper wants to compare/commit after sampling.

V3 serves mood-led discovery reasonably well but under-serves house-led and sample-led entry.

## 3. Journey / IA

Current global navigation is category-heavy (`All Fragrance`, families, Discovery Sets, Gifts). It lacks a first-class `Houses` destination and treats sampling largely as a category/SKU rather than a journey.

V4 should organize global navigation around user decisions:
`Fragrances | Houses | Discovery | Scent Portrait | Bag`.

## 4. Content and trust

Strengths:
- authenticity/curation language;
- scent notes and presence terminology;
- explicit prototype payment disclosure.

Weaknesses:
- homepage contains too much self-explanatory brand manifesto copy;
- fictional-house context is too thin to make a multi-house marketplace feel authoritative;
- repeated claims such as curation/authenticity should be replaced by visible house provenance, sample policy and selection logic.

## 5. Brand and visual grammar

Strengths: ivory/lilac/aubergine base, serif product language, fine rules, 4:5 product imagery.

Weaknesses:
- recognition still leans heavily on violet fields + serif type;
- gradient use is broader than necessary;
- multiple sections share `heading + 3-card grid` grammar;
- V3’s numbered editorial annotations are distinctive but overused as explanatory copy rather than information structure.

## 6. Page-role composition / monotony

- Home: editorial hero followed by several conventional section/grid patterns.
- PLP: hero + filter rail + uniform 3-column grid.
- PDP: object left + dossier right.
- Finder: distinct two-pane consultation — strongest page-role differentiation.
- Cart/checkout: utility composition.

V4 needs at least four composition families across buyer pages and must add new House/Discovery roles without copying the Home or PDP shell.

## 7. Component / code ownership

Current styling is layered across foundation + perfume layer + V2 + V3 CSS. This enabled safe iteration but creates override depth and makes ownership harder. V4 implementation should introduce one coherent V4 layer and, where safe, remove/neutralize obsolete V3-specific rules instead of stacking endless patches.

Behavior is split between `app.js` and `storefront-v3.js`. V4 should preserve working core behavior and add a clearly owned V4 behavior layer only for new journeys, with eventual consolidation if risk remains low.

## 8. Media

Current product images are remote prototype stock. Latest V3 pass removed obvious duplicates/broken media, but the system still lacks deliberate secondary/gallery imagery and house-level art direction. Product object, house story and discovery ritual need different media families with explicit ratios/focal contracts.

## 9. Interaction / states

Strengths: URL filters; clear-all; empty recovery; Scent Portrait back-state; cart persistence; add-to-bag feedback.

Gaps:
- sampling has no persistent trial/evaluation state;
- house browsing absent;
- no direct “sample eligible / build sample set” decision on cards;
- Finder result does not continue into a trial ritual.

## 10. Accessibility baseline

Positive source patterns: one H1 per checked route, explicit form labels in checkout, focus-visible work exists in Finder, semantic buttons/links are generally used.

Unverified in Phase 1: full keyboard/focus order, contrast across V4 palette, accessible names for every new control. Owner = Phase 2/3 rendered/manual verification.

## 11. Desktop/browser

Declared V4 scope: Chromium at 1280, 1440 and 1600. Mobile/tablet are `N/A_JUSTIFIED` and V4 must not claim full responsiveness.

## 12. Performance / security / privacy

Prototype risk is low but remote images can be heavy. V4 should request appropriately sized media and reserve ratios. No auth/payment API exists. Checkout fields are browser-only and must not imply transmission/storage.

## 13. System reality

Static/mock/simulated behavior is already partly disclosed; V4 must extend this honesty to any discovery-vial builder, sample evaluation or fictional maison story added during implementation.

## Audit decision

V4 is justified as a substantial redesign. Root problems are hierarchy, merchandising model, sampling journey, house authority, media families and repeated composition — not missing gradients, shadows or font polish.