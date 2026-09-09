# Design System — Violet V4

## System intent
Shared tokens/components provide consistency; page-role composition must remain diverse. The system should feel editorial at the macro level and familiar at the commerce-control level.

## Core tokens
### Color roles
- `--v4-canvas: #FFFDFB`
- `--v4-ink: #251829`
- `--v4-aubergine: #4F3158`
- `--v4-violet: #81548F`
- `--v4-lilac: #CFB2DF`
- `--v4-mist: #F4EAFA`
- `--v4-blush: #F1DFD5`
- neutral rule/text tints derived from ink, measured for readable contrast.

### Typography roles
- display serif: fragrance names, selected campaign statements, house portrait titles;
- UI sans: navigation, filters, prices, controls, format/provenance;
- micro annotation: uppercase, small size, increased tracking; never used for body copy.

### Shape/elevation
- radius: mostly 0–4px; circles only for intentional utility/avatar-like controls.
- elevation: none by default; depth comes from media/light, not card shadows.
- rules: 1px hairlines for groups and annotation grammar.

### Spacing
Use a spacious desktop scale with 8px base logic; large section spacing must be justified by composition, not a blanket 84px rule. Product grids use tighter intra-card spacing than section-to-section spacing.

## Components
### Global
- utility bar (optional, only if content is useful)
- header/navigation
- search trigger/input
- bag control/count
- footer

### Commerce
- fragrance card compact
- fragrance card feature/editorial variant
- price/format block
- sample/full-bottle format selector
- add-to-bag action
- status/reality note
- related-direction item

### Discovery
- family/mood quick-entry chips or text links
- Scent Portrait option control
- sample-set item
- evaluation control (`dislike / neutral / like` or bounded scale) only if implemented locally and labeled
- discovery progress/ritual step

### Curation / marketplace
- house index item
- house portrait hero
- provenance block
- curator note
- editorial interruption module

### States
Every applicable interactive component must define default, hover, focus-visible, selected/active, disabled, empty/recovery and success/feedback states. Error states are required for invalid local prototype paths when meaningful.

## Card rules
- Do not give every card a border/background shell.
- Product image is dominant; metadata is concise.
- No badge clutter. A single status marker is allowed only when it changes a decision.
- Long scent character belongs on PDP, not every PLP card.

## Responsive scope
Desktop-only V4 completion. Components must not deliberately break existing smaller screens, but mobile/tablet design evidence is N/A_JUSTIFIED this phase.

## Ownership
Prefer modifying shared `styles.css` / one V4 desktop layer and shared JS owners. Avoid adding a chain of override stylesheets that depend on V2/V3 accidents; Phase 2 should consolidate root ownership when feasible.
