# Decision Log — Violet V4

## D01 — V4 is a redesign, not a V3 polish
Reason: user rejects current outcome; OLD screenshot audit shows repeated composition/explanatory luxury styling. Structural delta is required.

## D02 — Keep interactive_prototype mode
Reason: product remains static/local; V4 needs richer behavior but not real payment/auth/CMS. Production gates must not be falsely applied to non-existent integrations.

## D03 — Desktop scope remains 1280/1440/1600 Chromium
Reason: explicit user preference to focus desktop and current operating profile. Mobile/tablet = N/A_JUSTIFIED.

## D04 — Sampling becomes first-class
Evidence: Nose/Luckyscent/ZGO/Frédéric Malle/Le Labo all expose low-commitment discovery as meaningful behavior/category. Violet’s business strategy already promises try-before-full-bottle.

## D05 — Add Houses and Discovery buyer routes
Reason: multi-house marketplace identity cannot be demonstrated only through seller labels and a Discovery SKU. These routes create materially different page roles and trust/decision objects.

## D06 — Reduce violet/gradient surface share
Reason: V3 uses color as a primary luxury signal. V4 keeps violet as signature ink/wayfinding while product/media/structure carry perceived value.

## D07 — Do not activate Design Intelligence retrieval in Phase 1
Reason: AUTO assessment found production reference evidence + locked skills sufficient to resolve current design system. Avoid retrieval noise. Re-open only for a targeted unresolved implementation/QA concern.

## D08 — Representative gate = Home + PLP + PDP + Discovery
Reason: together they exercise all core V4 deltas before whole-site rollout. Finder is a critical regression/integration route immediately after the gate.

## D09 — Release authorization = merge_and_deploy
Reason: existing project authorization allows safe PR/CI/merge and GitHub Pages auto-deploy; Prompt 4 still requires exact-commit checks and live smoke. Authority does not waive gates.

## D10 — CSS ownership must improve
V4 can introduce a new owned layer for isolation, but material V3 owner rules should be superseded deliberately and obsolete overrides removed when safe. “One more patch forever” is not an acceptable final architecture.