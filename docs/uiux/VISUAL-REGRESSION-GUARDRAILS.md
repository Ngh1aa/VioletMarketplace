# Visual Regression Guardrails

These rules are release blockers for Violet and should be carried into future UI projects.

## The six failure classes we do not ship

1. **Semantic text overlap**
   - Headings, paragraphs, buttons and buying information must never collide at any tested scroll position.
   - Sticky/fixed elements need a containing block that ends before later content, or they stay in normal flow.

2. **Sticky dead space**
   - Sticky offsets must be derived from the real sticky chrome, not an assumed header height.
   - A sticky child must not be trapped by a short wrapper that scrolls away while downstream components still reserve its offset.

3. **Unstyled migration fallback**
   - When legacy CSS is removed or consolidated, every surviving production class must have an intentional style in the active design system.
   - Browser-default headings/body text inside a designed section are a failed migration.

4. **Oversized empty states**
   - Empty UI is content-driven. It must explain the next action without reserving a large blank viewport.
   - Empty-state height should be checked separately from populated-state height.

5. **Text-heavy visual imbalance**
   - Primary discovery/consultation screens need a clear visual counterweight, bounded line length and bounded display type.
   - Large type is not a substitute for hierarchy or imagery.

6. **Ambiguous header controls**
   - Public navigation must not expose cryptic single-letter actions.
   - Search/primary controls must meet minimum hit-area requirements and badges must participate in layout rather than float unpredictably.

## Mandatory rendered checks before merge

Run at 1280, 1440 and 1600 desktop widths, with screenshots for top-of-page and affected scrolled states. Check horizontal overflow, broken media, text collisions, sticky behavior, empty states, migrated sections, focus visibility and header control geometry.

For this repository, `scripts/visual_layout_guard.mjs` and `.github/workflows/visual-layout-guard.yml` encode these checks. A failing guard blocks merge until the rendered issue is corrected.

## Workflow rule

A visual change is not complete when the DOM exists or CI is merely green. It is complete when the representative rendered screenshots have been inspected and the interaction states that can cause layout movement have also been exercised.
