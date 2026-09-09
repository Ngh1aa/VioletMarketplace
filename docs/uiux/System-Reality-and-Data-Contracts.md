# System Reality and Data Contracts — Violet V4

Project mode: `interactive_prototype`.

## Capability matrix

| Capability | UI/data | Reality | Evidence | Rule |
|---|---|---|---|---|
| Product catalogue | `data.js` | MOCK/STATIC | source | fictional prototype products only |
| PLP filters/sort | client-side JS over static data | REAL within browser prototype | source + V3 browser QA | do not imply server search |
| Product availability/rating | mocked fields | MOCK | `data.js` | label as prototype/representative where risk exists |
| Cart | localStorage | REAL within browser prototype | source + browser QA | no server persistence/account sync |
| Scent Portrait | deterministic scoring | SIMULATED | `scent-portrait.js` | explicitly not AI/personality inference |
| Checkout | browser form/local state | SIMULATED | source | no payment/transmission claim |
| Order success | local navigation/state | SIMULATED | source | not proof of order/payment |
| Maison stories | proposed fictional content | STATIC/MOCK | V4 content | no real awards/history/perfumer claims |
| Discovery/sample tray | proposed V4 local state | SIMULATED until Phase 2 implementation | future source + QA | no shipment/sample inventory/redeem claim |
| Sample evaluation | proposed local reaction state | SIMULATED | future source + QA | no self-learning/AI claim |
| Authentication/account | none | N/A | source | do not add account success UI |
| CMS/backend | none | N/A | source | no persistence claim |
| Analytics | none | N/A | source | no conversion measurement claim |
| GitHub Pages deploy | Pages workflow | REAL for static hosting | Actions deployment | production smoke still required after release |

## Proposed V4 data additions

If Phase 2 adds houses/discovery, extend static data with explicit prototype fields rather than embedding duplicated content in HTML:

```text
houses[]:
  id, name, origin, ethos, scentTerritory[], heroImage?, discoveryProductId?

products[] optional:
  sampleEligible: boolean
  samplePrice?: number
  secondaryImage?: string
```

These are local prototype data contracts, not APIs.

## Discovery local-state contract

If implemented:
- key: versioned Violet discovery state in localStorage;
- selection capacity: exactly 3 maximum for build-a-trio;
- add duplicate: no duplicate row; explain already selected;
- remove: immediate, reversible by reselecting;
- full state: disable/add replacement guidance;
- empty state: suggest Portrait or browse;
- no automatic full-bottle purchase;
- evaluation state may be `love / maybe / not for me` and only influences local display if deterministic rules are explicitly implemented.

## Checkout reality

Form fields are not transmitted. `Place order` may navigate to simulated confirmation only. Keep visible reality note in checkout/confirmation. Do not store personal checkout fields persistently unless deliberately required and disclosed.

## Production gaps

| Gap | Current | Required for real production | Severity if falsely claimed |
|---|---|---|---|
| payment/order processing | simulated | backend/payment/order service + verification | P0 |
| sample fulfillment/inventory | absent/simulated | real SKU/inventory/fulfillment rules | P0/P1 |
| product/house catalogue | mock | real source/CMS/merchant data | P1 |
| auth/account | absent | identity/session/security | P1 if UI claimed |
| analytics/consent | absent | policy + implementation | P2 depending business |
| media rights/final packshots | prototype | verified licensed/owned assets | P1 for real commercial launch |

V4 is not a production-candidate project; these gaps do not block prototype Phase 1/2 when labels remain truthful.