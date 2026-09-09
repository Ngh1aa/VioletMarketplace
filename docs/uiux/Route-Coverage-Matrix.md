# Route Coverage Matrix — Violet V4 Phase 2/3

| Route | Page role | Status | Representative? | Verification |
|---|---|---|---|---|
| `/index.html` | Home/index | PASS | yes | render + OLD/NEW + 1280/1440/1600 |
| `/search.html` | PLP | PASS | yes | filter/state + render + editorial interruption |
| `/product.html?id=violette-03` | PDP | PASS | yes | sample/bottle actions + render |
| `/discovery.html` | Discovery | PASS | yes | build-a-trio states + persistence/recovery |
| `/houses.html` | Houses index | PASS | no | render/navigation + house count |
| `/house.html?id=maison-aster` | House detail | PASS | no | render + product linking + fictional-house truth boundary |
| `/finder.html` | Scent Portrait | PASS | critical regression | four-step/results regression + Discovery handoff |
| `/cart.html` | Bag | PASS | utility regression | seeded cart render |
| `/checkout.html` | Checkout | PASS | utility regression | labels/required fields + simulated-payment reality note |
| `/order-success.html` | Confirmation | PASS | utility regression | browser-local/simulated confirmation language |
| `/seller.html` | seller operations | PASS_SMOKE | no | no overflow, console/page errors or broken images |
| `/admin.html` | admin operations | PASS_SMOKE | no | no overflow, console/page errors or broken images |

Evidence:
- V4 Full QA run `34380767592`, artifact `10115777267`, score `100/100`, issues `[]`.
- Representative V4 run `34380767621`, artifact `10115770893`.
- Scent Portrait regression run `34380767636`: success.
- Creative Director cross-page review: `KEEP`.

All in-scope buyer routes and out-of-buyer shared-route smoke checks are accounted for before release.