# Verification Matrix — Violet V4

| Change / requirement | Expected outcome | Owner phase | Method | Pass condition | Phase 1 result |
|---|---|---|---|---|---|
| Structural redesign | V4 materially differs from V3 beyond styling | Phase 1 design / Phase 2 proof | Delta Contract + OLD/NEW screenshots | hierarchy, silhouette, journey/page roles visibly change | DONE_VERIFIED design contract; rendered proof PENDING_FUTURE_PHASE Phase 2 |
| Home hierarchy | less manifesto, more product/media/discovery authority | Phase 2 | 1280/1440/1600 render | first screen + next transitions communicate orientation/decision with no long explainer dependency | PENDING_FUTURE_PHASE |
| PLP curated shelf | browse feels curated, filters stay useful | Phase 2 | browser interaction + screenshot | URL filters persist; clear/recovery works; card prose reduced; editorial interruption does not break results | PENDING_FUTURE_PHASE |
| PDP commerce priority | sample/full-bottle choice comes before long story | Phase 2 | screenshot + cart interaction | identity/format/price/actions visible and truthful; add updates local cart | PENDING_FUTURE_PHASE |
| Houses IA | multi-house curation is navigable | Phase 2 rollout | route + screenshot + invalid-state test | Houses index + at least all catalog houses resolve; no fabricated factual claims | PENDING_FUTURE_PHASE |
| Discovery journey | finder/sample/evaluation/full-bottle path is coherent | Phase 2 | critical-journey browser test | user can move from Discovery/Finder to sample route and back to full-bottle decision; no dead end | PENDING_FUTURE_PHASE |
| Scent Portrait preservation | existing reversible interaction remains | Phase 2/3 | regression Playwright | answers persist on Back; 3 explainable results; discovery route added without fake AI | PENDING_FUTURE_PHASE |
| Media integrity | object media is dominant and reliable | Phase 2/3 | decoded-image checks + manual screenshots | no broken/blank/duplicate/misbranded/focal-crop defect in representative evidence | PENDING_FUTURE_PHASE |
| Page-role differentiation | no universal hero/template monotony | Phase 2/3 | cross-page montage/human review | Home/PLP/PDP/House/Discovery/Finder have distinct silhouettes with shared DNA | PENDING_FUTURE_PHASE |
| Brand recognition | Violet recognizable beyond logo/purple | Phase 3 | logo-hidden Creative Director review | >=4 consistent cues visible across primary roles | PENDING_FUTURE_PHASE |
| System reality | no unsupported AI/payment/auth/inventory claims | Phase 2/3 | copy/source inspection + journey test | all material capability labels match contract | PENDING_FUTURE_PHASE |
| Accessibility baseline | critical desktop interactions are operable/readable | Phase 2/3 | semantic/focus/keyboard/contrast sanity + manual | headings/labels/focus/keyboard baseline pass; no conformance claim | PENDING_FUTURE_PHASE |
| Desktop pressure | no overflow/crop/overlap at declared widths | Phase 2/3 | Chromium 1280/1440/1600 | no P0/P1 overflow/sticky/media/type defect | PENDING_FUTURE_PHASE |
| Cart/checkout regression | current transaction prototype remains usable | Phase 3 | seeded cart/checkout test | product, summary and simulated-payment disclosure visible; no JS error | PENDING_FUTURE_PHASE |
| Static quality | source loads without syntax/required-file failure | Phase 2/3 | existing + V4 CI | required checks pass | PENDING_FUTURE_PHASE |
| Release exactness | deployed site matches Final-QA commit | Phase 4 | GitHub checks + production smoke | exact commit/assets verified live after deploy | PENDING_FUTURE_PHASE |
| Production smoke | live Pages render V4, not stale assets | Phase 4 | open live URL; route/media/console/network checks | representative routes + critical journeys render correctly at declared scope | PENDING_FUTURE_PHASE |

## Phase 1 verification
- Project truth inspected: DONE_VERIFIED.
- OLD rendered baseline inspected: DONE_VERIFIED.
- Reference benchmark + adaptation: DONE_VERIFIED.
- Design-intelligence candidate synthesis: DONE_VERIFIED with source-table retrieval limitation recorded.
- Audience/journey/IA/content/brand/system/media/responsive contracts: DONE_VERIFIED.
- Rendered NEW evidence: correctly PENDING_FUTURE_PHASE → Phase 2/3.
- Production/release evidence: correctly PENDING_FUTURE_PHASE → Phase 4.
