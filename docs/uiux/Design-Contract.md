# Design Contract — Violet V4

## Contract identity
- project: Violet Parfumerie / VioletMarketplace
- phase: V4 reference-led structural redesign
- mode: interactive_prototype
- responsive scope: desktop_only
- canonical viewport: 1440×1000
- pressure viewports: 1280×900, 1600×1000
- skill lock: `Ngh1aa/skills_UIUX@1a3c9ef2d72e6bd0d4a4fc79c885c59f98e41c33`

## North star
**A private fragrance library with a sampling ritual.**

Violet must feel like a selective multi-house fragrance retailer whose value comes from curation, house context, sensorial product authority and a low-risk discovery journey. Luxury is expressed by restraint, media and service structure rather than lavender surfaces or decorative effects.

## Owner goal
Help shoppers confidently discover, try and purchase curated fragrance while making Violet credible as a distinct multi-house retailer.

## User outcome
A shopper should be able to answer, with minimal jargon:
1. what direction fits me / what I want;
2. which house/fragrance to inspect;
3. what it smells/feels like;
4. how to try it before committing;
5. why Violet carries/recommends it;
6. what to do after sampling;
7. how to buy the full bottle.

## Priority journey
`orientation → narrow → evaluate → sample/discover → wear/evaluate → refine/revisit → full bottle → bag → simulated checkout`

The experience must also support direct entry on PLP/PDP/House without homepage context.

## Preserve / change
### Preserve
- brand name and warm violet family;
- restrained serif/sans identity;
- fictional catalog/houses;
- Scent Portrait’s concrete 4-question logic;
- URL filter state, cart continuity, checkout reality disclosure;
- vanilla/GitHub Pages architecture.

### Change materially
- homepage content sequence and lower-page silhouette;
- navigation to expose Houses + Discovery;
- PLP merchandising from continuous catalog grid to curated shelf;
- product card density/content priority;
- PDP hierarchy around sample/full-bottle decision;
- discovery from SKU/link into a first-class journey;
- house curation from copy into navigable page role;
- visual color behavior from violet-heavy atmosphere to ivory/ink-dominant object study.

## Brand grammar
### Color
Warm ivory is the canvas; ink/aubergine supplies authority; lilac/blush orient sensorial moments; Violet Ink is a rare signature/action accent. No gold or glassmorphism required.

### Type
Display serif owns fragrance/house names and rare editorial statements. UI sans owns navigation, filters, prices, actions and dense decision information. Micro annotation is limited to useful indices/provenance/format labels.

### Media
Controlled object study: glass/paper/stone/silk/skin/wood, soft directional warm light, aubergine shadow, low-clutter backgrounds. Media is product evidence, not filler.

### Surface
Mostly flat, hairline rules, 0–4px radius, no decorative shadow stack. Depth comes from image/light/scale.

### Motion
Only purposeful hover/focus/state feedback in current static stack; no motion spectacle required for V4 PASS.

## Digital signatures
1. object-study imagery with restrained violet shadow/reflection;
2. warm-ivory/ink majority with rare lilac/violet events;
3. fine rule + precise annotation grammar;
4. serif fragrance/house naming with familiar sans commerce controls;
5. sampling/house-centric composition unique to fragrance retail.

## Page experience contracts

### Home — Orientation / brand-discovery
- audience: curious, gift, returning; direct/brand entry
- user goal: decide where to begin
- owner goal: show Violet’s curation + discovery model
- primary question: `Browse, get guided, or discover a house?`
- decision: fragrance browse vs Scent Portrait vs Discovery
- proof: one curated edit, one house portrait, one concise discovery/service proof
- CTA: `Khám phá fragrance` / `Tạo Scent Portrait`
- next: PLP / Finder / Discovery / House
- content priority: campaign → scent doorway → curated shelf → house → discovery ritual → concise service trust
- visual strategy: campaign diptych; no manifesto stack
- interaction: clear text/action hover/focus; no autoplay
- responsive priority: preserve diptych hierarchy at declared desktop widths

### Fragrance Library — Browse / refine
- user goal: narrow the catalog efficiently
- primary question: `Which fragrances fit this scent direction?`
- decision: filter by family/mood/presence/house/concentration and inspect product
- proof: concise scent cues + house + format/price; editorial interruptions explain house/discovery only where useful
- CTA: open fragrance / clear filter / guided discovery recovery
- content priority: controls → result count → shelf → contextual interruption
- visual strategy: curated shelf, not endless equal cards
- interaction: URL-persistent filters, selected chips, clear all, sort, empty recovery

### PDP — Evaluate / sample / commit
- user goal: understand and decide how to try/buy
- primary question: `Is this scent worth trying or buying?`
- decision: sample/discovery route vs full bottle
- proof: scent character, notes, house/provenance, wearing profile, Violet curation
- CTA: `Thử trước` / `Thêm full bottle`
- next: Discovery / Bag / related direction
- content priority: identity → format/price/action → notes/wearing → house/curation → related
- visual strategy: dominant object-study media + compact commerce panel; story after decision
- interaction: format/action state truthful; cart feedback; invalid-product recovery

### Houses index — Retailer curation
- user goal: browse makers/houses
- decision: choose house by character/collection
- proof: concise house thesis and collection count/status using prototype truth only
- CTA: enter house
- visual strategy: typographic registry with selective media, not product grid clone

### House storefront — Explore maison
- user goal: understand house character and choose a first scent
- decision: collection / signature fragrance / discovery route
- proof: fictional project-authored house story + seller/provenance metadata
- CTA: fragrance / discovery
- visual strategy: house portrait + collection rail with house-specific material/accent within Violet DNA

### Discovery Hub — Trial ritual
- user goal: understand and start sampling
- primary question: `How do I try scents before a bottle?`
- decision: Discovery Wardrobe / Scent Portrait / local evaluation when available
- proof: exact sample format/prototype reality + simple wear instructions
- CTA: start portrait / open discovery set / evaluate tried scents
- visual strategy: discovery table / sample objects, distinct from PLP/PDP
- interaction: step/progress/reaction states only if actually implemented locally

### Scent Portrait — Consultation
- preserve two-pane consultation composition and reversible answers
- result must add a clear route to try/sample before full bottle
- deterministic disclosure remains visible

### Bag / Checkout
- preserve calm transaction composition; update shared V4 chrome only
- no fake production checkout/payment claim

## Interaction grammar
`see → choose → immediate state feedback → meaningful next action → recovery`.
- visible focus for all interactive controls;
- selected filters/options must be programmatically and visually clear;
- Back/state persistence remains for Scent Portrait;
- local sample reactions, if added, are reversible/resettable;
- no hover-only critical information.

## System reality
STATIC/SIMULATED/PARTIAL capabilities follow `System-Reality-and-Data-Contracts.md`. No UI copy may upgrade a capability claim beyond its evidence.

## Media ownership
All media behavior follows `Media-Contract.md`; blank/broken/misbranded/cropped focal media is a P0/P1 blocker depending on role.

## Anti-template rules
- no universal hero across material page roles;
- no repeated `centered heading + three equal cards` as default section grammar;
- no card prose that belongs on PDP;
- no lavender gradient as substitute for hierarchy;
- no decorative luxury effects without task/brand role;
- no empty Journal/brand-history conventions added only because references have them.

## Phase 2 implementation order
`composition → hierarchy → media → decision objects → interaction/states → desktop pressure behavior → shared system → visual polish`.

## Representative gate
Before full rollout, Home + PLP + PDP + Discovery must be implemented, rendered at 1440 and pressure-checked at 1280/1600; zero P0/P1/material visual defect. Only then roll out Houses and shared transaction regression.

## Success definition for V4
V4 is successful when rendered evidence shows a materially different page/journey system from V3, all buyer primary routes in scope are coherent, discovery/sample is a first-class journey, house curation is navigable, product/media authority increases, no false system claim exists, and cross-page Creative Director review has no unresolved P0/P1/material P2.
