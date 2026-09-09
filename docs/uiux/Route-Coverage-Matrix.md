# Route Coverage Matrix — Violet V4 Phase 2

| Route | Page role | Phase-2 status | Representative? | Required verification |
|---|---|---|---|---|
| `/index.html` | Home/index | IN_PROGRESS | yes | render + OLD/NEW + pressure |
| `/search.html` | PLP | IN_PROGRESS | yes | filter/state + render |
| `/product.html?id=violette-03` | PDP | IN_PROGRESS | yes | sample/bottle + render |
| `/discovery.html` | Discovery | IN_PROGRESS | yes | build-a-trio states + render |
| `/houses.html` | Houses index | PENDING_AFTER_GATE | no | render/navigation |
| `/house.html?id=maison-aster` | House detail | PENDING_AFTER_GATE | no | render/fallback |
| `/finder.html` | Scent Portrait | PENDING_AFTER_GATE | critical regression | existing state + Discovery handoff |
| `/cart.html` | Bag | PENDING_AFTER_GATE | utility regression | cart/sample compatibility |
| `/checkout.html` | Checkout | PENDING_AFTER_GATE | utility regression | form/reality note |
| `/order-success.html` | Confirmation | PENDING_AFTER_GATE | utility regression | truthful simulated state |
| `/seller.html` | seller operations | OUT_OF_BUYER_V4 | no | shared chrome must not break |
| `/admin.html` | admin operations | OUT_OF_BUYER_V4 | no | shared chrome must not break |

No route is marked PASS before rendered/functional evidence.