# Implementation Plan — Violet V4

Phase: 2 — IMPLEMENTATION
Phase-1 prerequisite: `PASSED` at branch commit `b9adf5e5c2e080104996fde45d34b4d554e25f90`.

## Pre-flight

- Skill lock unchanged: `Ngh1aa/skills_UIUX@1a3c9ef2d72e6bd0d4a4fc79c885c59f98e41c33`.
- Mode: interactive_prototype.
- Scope: buyer storefront, desktop only.
- Preserve unrelated seller/admin behavior.
- Representative pages must PASS before whole-site rollout.

## Task plan

| Task | Goal | Owner/files | Dependencies | Edge / recovery | Verification |
|---|---|---|---|---|---|
| P2-01 V4 shared chrome/system | task-led nav + paper/ink signature without breaking routes | `app.js`, new `desktop-experience-v4.css`, buyer HTML includes | Design Contract | small desktop labels, active routes | 1280/1440/1600 render |
| P2-02 V4 data model | add house/sample metadata centrally | `data.js` | current product IDs | missing secondary media/sample false | source/static QA |
| P2-03 Home representative | structural editorial index, fewer explanatory blocks | `index.html`, V4 CSS/JS | shared chrome/data | no duplicate 3-card rhythm | OLD/NEW screenshot |
| P2-04 PLP representative | compact masthead, concise cards, house/sample filter + editorial interruption | `search.html`, `storefront-v4.js`, CSS | data model | no results, URL/back/clear | browser interaction + screenshot |
| P2-05 PDP representative | product gallery + sticky buying desk; sample/full bottle peer actions | `product.html`, `storefront-v4.js`, CSS | data/sample state | missing sample, add bottle, sample tray full | browser flow + screenshot |
| P2-06 Discovery representative | dedicated ritual workspace + build-a-trio local state | new `discovery.html`, `storefront-v4.js`, CSS | product sample metadata | 0/3, duplicate, 3/3, remove | browser state + screenshot |
| GATE-01 representative review | prove structural delta before rollout | QA script/workflow + docs | P2-01..06 | P0/P1 block | Home/PLP/PDP/Discovery render |
| P2-07 Houses rollout | house index + detail compositions | new `houses.html`, `house.html`, V4 JS/CSS | house data | unknown id fallback | browser screenshot |
| P2-08 Finder integration | keep 4-step flow, connect results to Discovery | `finder.html`, `scent-portrait.js`, CSS | Discovery | Back state preserved | existing + new QA |
| P2-09 utility rollout | shared chrome/sample compatibility; no editorial over-design | cart/checkout/order success as needed | cart + sample state | empty cart, reality copy | browser smoke |
| P2-10 whole-site verification | route/media/state/accessibility baseline | QA scripts/workflows/docs | all prior | pressure widths | CI + screenshot review |

## Implementation sequence

`composition → hierarchy → media → decision objects → interaction/states → desktop pressure behavior → component/system cleanup → visual polish`

Palette/font polish must not substitute for P2-03..06 structural work.

## Recovery concern

If new V4 CSS conflicts with V2/V3, fix the V4 owner or remove obsolete V3 owner rules where safe; do not add ad-hoc page-local overrides to hide root conflicts.

## Design Intelligence

No system-direction regeneration. Retrieval remains N/A unless a targeted implementation gap cannot be resolved by the Design Contract, current source and active local skill.