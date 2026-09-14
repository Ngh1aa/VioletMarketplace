# Design System — Violet Mobile Discovery

## Tokens
- paper: `#f6f4ef`
- paper-raised: `#fbfaf7`
- ink: `#111111`
- muted: `#6e6a63`
- line: `#d6d1c9`
- violet: `#5f4b64`
- violet-deep: `#352b39`
- success: `#2f684a`
- warning: `#8a6332`

## Type
- Display/editorial: Georgia / Times fallback.
- Utility/body: Arial / Helvetica fallback.
- Mobile display scale: 42/46, 32/36, 24/28.
- Body: 16/24; supporting: 13/18; micro labels: 10/14 uppercase tracked.

## Spacing
4, 8, 12, 16, 20, 24, 32, 40, 56, 72.

## Touch
- minimum interactive height: 44px;
- primary mobile controls: 48–54px;
- gap between adjacent touch targets: minimum 8px.

## Components
### Choice row
Full-width bordered row; title + descriptor; selected state uses ink border + subtle paper contrast + check marker.

### Recommendation object
Image field → maison/name → reason list → sample/full-bottle actions. Avoid generic shadow card.

### Why-match block
Numbered reason rows. Shows deterministic evidence, never a confidence percentage.

### Trio slot
Three numbered slots. Empty and filled states. Filled state exposes remove/replace.

### Balance strip
Labels represented scent families/moods. Descriptive, not pseudo-scientific.

### Feedback chip
Love / Like / Neutral / Dislike are primary choices; issue tags are secondary multi-select.

### Mobile journey nav
Bottom fixed navigation for Discover / Portrait / Trio / Bag where appropriate; safe-area aware.

## States
Default / hover / focus-visible / pressed / selected / disabled / error / success / saved. Mobile state must never depend on hover.

## Motion
150–260ms ease. Reduced-motion removes transform/reveal while preserving state changes.
