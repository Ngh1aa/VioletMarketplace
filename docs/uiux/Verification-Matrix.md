# Verification Matrix — Violet V4

| Change / requirement | Expected outcome | Method | Pass condition | Owner phase | Result |
|---|---|---|---|---|---|
| Structural redesign | V4 visibly differs from V3 in hierarchy/silhouette/journey | OLD vs NEW same viewport screenshots | Home/PLP/PDP materially changed beyond reskin | Phase 2/3 | PASS |
| Page-role diversity | unrelated roles do not share universal hero/layout | cross-page montage | Home, PLP, PDP, House, Discovery, Finder show role-specific first anchors | Phase 2/3 | PASS |
| Product-first hierarchy | object/price/commitment outrank philosophy copy | rendered first-fold inspection | PDP buying actions clearly visible; Home product/route evidence leads | Phase 2 | PASS |
| Sampling core journey | uncertain shopper can continue into trial | functional browser flow | PDP/Finder/Discovery connect; local states truthful | Phase 2 | PASS |
| House authority | maison is navigable first-class object | route + content inspection | Houses index/detail exist and products link correctly | Phase 2 | PASS |
| PLP refinement preservation | V3 useful filter behavior is not regressed | browser interaction | active/removable/clear/share state works; no-results recovery preserved | Phase 2/3 | PASS |
| Scent Portrait preservation | Back state + deterministic recommendations still work | dedicated regression + full browser test | four steps reversible, 3 explainable results, no AI claim, Discovery handoff works | Phase 2/3 | PASS |
| System reality | no false backend/sample/payment claim | source + rendered copy | capability labels/copy match reality matrix | Phase 2/3 | PASS |
| Media integrity | focal objects never accidentally crop/break | screenshot + naturalWidth/complete checks | no broken/incomplete focal images; pressure checks clean | Phase 2/3 | PASS |
| Brand recognition | logo-cropped screens still cohere | human visual review | >=3 independent Violet cues consistent across primary roles | Phase 3 | PASS |
| Accessibility baseline | key paths keyboard/labels/focus sane | source + browser inspection | no P0/P1 semantic/focus/form issue in declared scope | Phase 3 | PASS |
| Static correctness | required files/scripts parse/load | validation CI | green | Phase 2/3 | PASS |
| Shared Seller/Admin stability | buyer redesign does not break operations pages | rendered smoke | no overflow, console/page errors or broken media | Phase 3 | PASS |
| Production deploy | exact QA commit is served | GitHub Pages + live smoke | live assets/version + representative routes pass | Phase 4 | PENDING_RELEASE |
| Phase-1 research/design | contract complete, structural, reference-grounded | artifact review | no current blocker/unaccounted item | Phase 1 | PASS |

## Final pre-release evidence

- V4 Full QA run `34380767592`: `100/100`, zero issues.
- V4 Full QA artifact `10115777267` on head `e238b8799288a1115cd383553f40e839a6b10abf`.
- Representative QA run `34380767621`: success.
- Scent Portrait QA run `34380767636`: success.
- Seller/Admin ops smoke: success.
- Creative Director screenshot inspection: `KEEP`.

Only Phase 4 remains intentionally open until GitHub Pages serves the merged release and production smoke passes.