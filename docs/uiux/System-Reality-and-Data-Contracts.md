# System Reality and Data Contracts — Violet V4

## Global rule
Rendered UI is not evidence of an external service. Every capability below must remain labeled by its actual implementation state.

| Capability | Reality | Current / V4 contract |
|---|---|---|
| Catalog / product data | STATIC | `data.js` is local prototype data; fictional products/houses/prices are project content |
| PLP filters / sort | REAL local behavior over STATIC data | URL params persist refinement; no server search/index |
| Scent Portrait | SIMULATED deterministic recommendation | local scoring from selected answers + metadata; no AI/personality inference |
| Sample/discovery routing | PARTIAL / prototype | can route to representative Discovery Wardrobe/sample decision; exact sample availability per bottle must not be invented |
| Sample evaluation/refinement | SIMULATED local if implemented in V4 | may store bounded reactions in localStorage and recompute display locally; must say prototype/local and must not claim learning model/account sync |
| Houses | STATIC project-authored fictional content | house pages may use project-authored descriptions; no fabricated real founder/history/accreditation |
| Curated/official/authenticity status | PARTIAL project metadata | `official` flag exists but is prototype curation metadata; avoid legal/retailer guarantees unsupported by backend verification |
| Cart | REAL local behavior | localStorage cart with quantity/state; no server inventory reservation |
| Inventory/stock | STATIC prototype field | displayed only as prototype inventory when needed; no real-time scarcity claim |
| Checkout | SIMULATED | form/order UI only; no real payment/order service |
| Payment | SIMULATED / NONE external | no transaction processing; disclosure must stay near action/result |
| Authentication/account | NONE | do not create signed-in state, profile sync or saved-history claim |
| Analytics/personalization | NONE | no tracking/personalized model claim |
| Search | REAL local/string match where current code supports it | no semantic/AI search claim |
| GitHub Pages deploy | REAL deployment mechanism | static artifact deployment; Prompt 4 must verify production version/assets after merge |

## Data additions allowed in V4
- `houseMeta`: fictional house thesis, accent/material direction, collection IDs.
- `sampleEligible` or format metadata only when explicitly modeled as prototype catalog data.
- local `sample-reactions-v1` storage only if Phase 2 implements evaluation; schema must be simple, reversible and non-sensitive.

## Local evaluation schema proposal
```json
{
  "product-id": {
    "reaction": "like|neutral|dislike",
    "updatedAt": "ISO timestamp"
  }
}
```
No health, identity, demographic or sensitive inference. Clearing/resetting must be available.

## Failure / recovery
- Invalid product/house route: show recovery link to relevant library, not blank screen.
- Missing image: visible neutral fallback and QA issue; do not silently hide a product’s primary media.
- Empty filter/refinement: clear filters / Scent Portrait recovery.
- Empty local evaluation state: explain how to start; no fake history.
- localStorage parse failure: recover to empty state without crashing.

## Production boundary
V4 remains `interactive_prototype`. Prompt 4 can verify the static deployed prototype, but must not call payments, authentication, inventory, personalization or accessibility conformance production-ready.
