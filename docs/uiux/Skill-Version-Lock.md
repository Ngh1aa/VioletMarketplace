# Skill Version Lock — Violet Parfumerie

- Skill repository: `Ngh1aa/skills_UIUX`
- Locked ref: `e8ed8c9212d20edb2cf4c8c0881fff34add7076e`
- Verified on: `2026-09-10`
- Source: `https://github.com/Ngh1aa/skills_UIUX`

## Migration note

V4.1 deliberately migrates from `1a3c9ef2d72e6bd0d4a4fc79c885c59f98e41c33` to `e8ed8c9212d20edb2cf4c8c0881fff34add7076e` at a new visual phase boundary. This is not a silent mid-phase float. The new lock carries the durable `adaptive-prompt-os-v4` website delivery policy plus strengthened media/crop and visual-QA rules that materially affect the PDP recovery.

## Policy

All routed UI/UX skills for the current Violet visual/interaction phase must be read from this immutable commit unless a deliberate migration is reviewed and this file is updated in the same change.

Do not silently float to a later skill commit mid-phase. New skill versions may be adopted between phases after reviewing material changes to routing, contracts, QA or visual rules.

## Current core routing baseline

Always start with the smallest useful graph:

1. `project-context`
2. `adaptive-skill-routing-and-context-budget`
3. `website-delivery-pipeline` only when the task is multi-stage/site-level

For V4.1 PDP recovery the active specialists are recorded in `design-artifacts/pdp-v4-1-skill-trace.json`. Installed does not mean active; do not load the whole library by default.

## Default delivery policy

Substantial website work follows `adaptive-prompt-os-v4`:

`Prompt 0 project truth → Prompt 1 research/audit/contract → Prompt 2 representative implementation → Prompt 3 rendered QA/remediation → Prompt 4 merge/deploy/production smoke`

Local bounded fixes may still use the lightweight lane, but this PDP recovery is substantial because it changes composition, media strategy and the visual regression contract.