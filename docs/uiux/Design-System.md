# Design System — Violet V4

Status: Phase-1 contract. Values may be tuned during representative implementation only when the visual result shows a documented need; semantic roles remain stable.

## Tokens

### Color

```text
--v4-paper: #F7F3EE
--v4-paper-2: #EFE8E1
--v4-ink: #241B26
--v4-muted: #746A72
--v4-rule: #D8D0D2
--v4-aubergine: #55364F
--v4-lilac: #D9CCD9
--v4-blush: #E8D6CF
--v4-violet: #75458A
--v4-focus: #75458A
```

Semantic use matters more than exact hex; contrast must be verified in Phase 2/3.

### Typography

- Display XL: 72–92px desktop, page-role dependent.
- H1 product/listing: 54–72px.
- H2: 36–52px.
- H3/product title: 20–28px.
- Body: 14–16px, 1.55–1.75 line-height.
- Meta/index: 9–11px uppercase with restrained tracking.
- Price/action text must not fall below readable commerce hierarchy.

### Spacing

Base rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
Use large gaps to separate narrative phases, not arbitrary blank space.

### Grid

- 12-column content grid.
- Container max ~1360px.
- 24px gutters at 1280; 28–32px at 1440/1600 as space permits.
- PLP filter rail: ~220–250px plus 3-column product field.

## Component grammar

### Header
Compact two-level maximum. Primary nav is task-led. Search is utility. Avoid tall announcement + logo + search + category stacks that consume excessive first-screen area.

### Product card / Object Study
- 4:5 media.
- maison index/name.
- product name.
- concise format/family.
- price.
- sample/discovery cue if applicable.
- no long body paragraph on PLP.
- no generic elevated rounded card.

### Editorial interruption
Spans 2+ columns or full width; one media/object + one short sentence + route. Must interrupt catalogue rhythm for a clear task (house/discovery/edit), not decoration.

### House index row
Text-forward table/list with house name, origin, scent territory and object count/route. Featured house may have one supporting image.

### Buying desk
Sticky PDP decision column with product identity, price, size, sample/full-bottle actions and trust/system-reality note. Secondary story stays below/adjacent.

### Filters
Visible current state, removable chips, clear all, share/back persistence. New house/sample filters only if data exists.

### Discovery tray
Prototype multi-select state with explicit capacity (e.g. 3 samples), remove/replace, empty/full states and truthful simulated fulfillment note.

### Scent Portrait
Preserve four-step reversible state; reduce decorative story dominance; results expose `Build sample trio` + `Open fragrance` paths.

### Utility commerce
Bag/checkout use conventional rows, labels and totals; keep calm paper/ink styling and explicit prototype reality.

## States

Every interactive owner defines idle, hover/focus, selected/active, disabled when applicable, empty/no-result and recovery. Sample tray additionally defines 0/3, 1–2/3, 3/3 and duplicate-selection behavior.

## Accessibility contract

- visible labels; placeholder never sole label;
- focus-visible on every interactive control;
- logical heading hierarchy;
- image alt by purpose;
- no color-only selected state;
- controls target >=44px where primary click target warrants it;
- reduced motion respected.

Formal conformance is not claimed; Phase 2/3 verifies baseline behavior.