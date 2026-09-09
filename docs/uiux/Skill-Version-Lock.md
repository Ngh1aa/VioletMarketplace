# Skill Version Lock — Violet Parfumerie

- Skill repository: `Ngh1aa/skills_UIUX`
- Locked ref: `1a3c9ef2d72e6bd0d4a4fc79c885c59f98e41c33`
- Verified on: `2026-09-09`
- Source: `https://github.com/Ngh1aa/skills_UIUX`

## Policy

All routed UI/UX skills for the current Violet visual/interaction phase must be read from this immutable commit unless a deliberate migration is reviewed and this file is updated in the same change.

Do not silently float to the latest skill content mid-phase. New skill versions may be adopted between phases after reviewing material changes to routing, contracts, QA or visual rules.

## Current core routing baseline

Always start with the smallest useful graph:

1. `project-context`
2. `adaptive-skill-routing-and-context-budget`
3. `website-delivery-pipeline` only when the task is multi-stage/site-level

Load visual/interaction specialists only when their decision is active. For current Violet luxury work, the commonly triggered set is:

- `visual-design-direction`
- `brand-distinctiveness-and-visual-signature`
- `visual-taste-calibration`
- `interaction-patterns-and-form-ux`
- `asset-media-and-art-direction`
- `ui-craft-and-visual-qa`

Installed does not mean active; do not load the whole library by default.
