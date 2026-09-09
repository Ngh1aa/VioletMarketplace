# Violet UI/UX Operating Profile

## Working model

Violet uses a hybrid workflow:

- **UIUX Factory** owns repeatable orchestration, stage ownership, deterministic checks, rendered evidence, regression gates and repair routing.
- **skills_UIUX** supplies task-specific decision rules and verification criteria.
- **Creative Director review** owns final taste judgment: brand fit, visual hierarchy, distinctiveness, imagery coherence and whether the rendered result actually feels luxury rather than merely passing heuristics.

The goal is to reduce repetitive cognitive load without delegating visual taste to automation blindly.

## Current phase scope

- Product: luxury niche-fragrance marketplace / interactive prototype.
- Visual priority: desktop first.
- Primary viewport: `1440x1000`.
- Pressure points: `1280x900`, `1600x1000` where risk justifies it.
- Tablet/mobile: preserve existing behavior; not part of current visual-completion claim.
- Release authority: merge to the repository after gates pass; no external release/deploy action is implied by this profile.

## Default routing strategy

Use **maximum decision quality / minimum unnecessary context**.

For every task:

1. Read `.uiux-profile.json` and relevant source-of-truth files.
2. Classify task scope, type, risk and mode.
3. Route the smallest applicable skill graph.
4. Read a skill only when its decision boundary is active.
5. Mark a skill `USED` only when it changes a decision, implementation, artifact or verification.
6. Preserve resolved artifacts instead of re-running earlier stages without a root-cause reason.

### Typical local polish

`project-context → ui-improvement → relevant specialist → rendered QA`

### Substantial visual change

`project-context → reference/design evidence if needed → visual-design-direction → brand-distinctiveness → visual-taste-calibration → implementation → ui-craft-and-visual-qa`

### Interactive discovery flow

`project-context → interaction-patterns-and-form-ux → system-reality boundary → implementation → browser QA → ui-craft-and-visual-qa`

## Creative Director gate

Automation is necessary but not sufficient for substantial visual work.

Before merging a substantial visual change:

1. Render actual affected pages in Chromium.
2. Verify no blocking runtime, overflow, broken-media or interaction defects.
3. Open and inspect screenshots manually.
4. Review with `KEEP / REVISE / REMOVE`.
5. Fix P0/P1 craft issues at their owning layer.
6. Re-render after material fixes.

A score of 100 does **not** mean a design is automatically beautiful. It means the measurable gates passed. Final visual approval still requires screenshot inspection.

## Violet visual commitments

The current memorable commitment is:

> A private fragrance room translated into a marketplace: warm violet twilight, editorial restraint, deliberate product imagery and decision-first scent discovery.

### Keep

- warm ivory, pastel lilac, aubergine and restrained violet gradients with explicit hierarchy roles;
- editorial serif/sans rhythm;
- large product imagery and breathable three-column desktop galleries;
- scent-family, mood and ritual as discovery objects;
- calm luxury copy over marketplace urgency;
- authenticity, discovery-set and try-before-full-bottle trust cues.

### Revise when detected

- repeated photography or inconsistent image worlds;
- interchangeable hero shells;
- card-grid monotony;
- gradient used as generic decoration;
- overly dense ecommerce badges, discount pressure or noisy metadata;
- visual patterns that could become an unrelated ecommerce site by swapping logo/copy.

### Remove

- fake AI language;
- branded placeholder imagery that contradicts fictional Violet maisons;
- decorative UI that does not improve recognition, hierarchy or task comprehension;
- visual patches that hide a root composition/media problem.

## System reality

Every meaningful capability must remain truthful:

- Scent Portrait recommendation engine: **SIMULATED / deterministic metadata scoring**, not AI personalization.
- Static catalog/cart behavior: describe only what the current implementation actually supports.
- Rendered success state is not evidence of an external API/payment/auth operation unless that integration exists and is verified.

## Quality bar

For current desktop work, a merge candidate must have:

- static syntax / required-file checks PASS;
- relevant rendered Chromium flow PASS;
- no P0/P1 issue in the declared scope;
- no horizontal overflow at the primary desktop viewport;
- no visible broken media in inspected evidence;
- no console/page errors attributable to the product implementation;
- interactive state/recovery verified when changed;
- screenshot evidence opened and inspected by Creative Director after the latest material visual fix.

When these are not satisfied, fix or mark the result unverified; do not lower the gate to manufacture a PASS.
