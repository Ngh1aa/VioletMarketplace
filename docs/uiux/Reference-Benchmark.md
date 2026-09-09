# Reference Benchmark — Violet V4

Date: 2026-09-09

## Decision problem

Violet needs to become a credible **multi-house luxury fragrance marketplace**, not a single-brand campaign site and not a dense generic ecommerce catalogue. References therefore have different jobs: sampling architecture, house curation, browse grammar, product-first commerce and assisted discovery.

## Final references by role

| Reference | Type | Pages/state inspected | Job | Score /100 | Decision |
|---|---|---|---|---:|---|
| Byredo | production single-brand | perfume catalogue, discovery sets | product-first catalogue + Try-It-first adjacency | 82 | ADAPT |
| Le Labo | production single-brand | Discovery, Discovery Sets | discovery as a first-class format/system | 83 | ADAPT |
| Frédéric Malle | production single-brand | Discovery | mood taxonomy + low-commitment entry | 88 | ADOPT principle |
| Nose Paris | production multi-brand/service | olfactory diagnostic + FAQ | diagnosis → samples → evaluation loop | 94 | ADAPT strongly |
| Luckyscent | production multi-brand retailer | samples + sample packs | sampling as marketplace infrastructure | 91 | ADAPT strongly |
| ZGO Perfumery | production multi-brand retailer | home, discovery vials/sets | house curation + official-retailer trust + discovery | 95 | ADAPT strongly |
| Diptyque | production single-brand | discovery set PDP | curated/buildable set commerce | 75 | selective ADAPT |

Scores support critique only; they are not usability/conversion scores.

## Reference A — ZGO / multi-house authority

What works:
- discovery sets are homepage merchandising, not footer content;
- trust is concrete: official retailer, authenticity, expert curation;
- house discovery and product discovery coexist;
- discovery vials are a defined shopping format.

Do not copy:
- Shopify-like density, badges or exact trust copy;
- real retailer claims Violet cannot substantiate.

Violet adaptation:
- Houses becomes a top-level route;
- Discovery becomes a top-level route;
- fictional-house provenance is shown as prototype content, while authenticity/official-retailer claims stay representative rather than falsely real.

## Reference B — Nose / discovery feedback loop

What works:
- diagnosis does not end with recommendations;
- five recommended samples can be tried;
- user evaluates them and recommendations can be refined;
- the low-commitment sample kit bridges digital guidance and real wearing.

Do not copy:
- Nose’s AI/perfumer dataset claims;
- exact questionnaire or scoring logic;
- paid sample/refund policy.

Violet adaptation:
- Scent Portrait remains deterministic and explicitly non-AI;
- results can feed a local prototype sample trio;
- user may record a simple reaction locally; any “learning” is only rule-based/local unless future implementation proves otherwise.

## Reference C — Luckyscent / sampling infrastructure

What works:
- individual samples are pervasive;
- thematic sample packs lower search cost;
- samples are a normal catalogue format, not a special campaign.

Do not copy:
- dense long catalogue or staff-specific claims.

Violet adaptation:
- cards/PDP expose sample/discovery eligibility;
- Discovery hub offers curated trio + pre-composed wardrobe + Portrait shortlist.

## Reference D — Frédéric Malle / mood-first navigation

What works:
- `By Mood` is first-class and accessible to shoppers without note expertise;
- `Where to begin` groups map, perfumers, discovery sets, travel and samples;
- customizable trio connects exploration to eventual purchase.

Do not copy:
- their taxonomy names, typography or editorial branding.

Violet adaptation:
- keep family + mood as parallel browse models;
- discovery route becomes “where to begin” for uncertain users;
- no voucher/redeem promise unless system reality is explicitly simulated.

## Reference E — Byredo / product-first commerce

What works:
- product imagery and name/price dominate catalogue;
- `Try-It-first` appears near eligible items;
- Fragrance Finder is inserted into catalogue discovery rather than replacing shopping.

Do not copy:
- monochrome/minimal Byredo surface, bottle designs, campaigns or copy.

Violet adaptation:
- reduce V3 card description density;
- make sample decision visible on card/PDP;
- Finder becomes one route in the marketplace, not the entire brand story.

## Reference F — Le Labo / discovery as format

What works:
- discovery samples/sets live inside fragrance taxonomy;
- product pages keep format, size and purchase behavior practical.

Do not copy:
- kraft/lab aesthetic, personalization labels, City Exclusive mechanics.

Violet adaptation:
- Discovery is both a route and a product format;
- full bottle vs discovery/sample is a buying decision, not marketing copy.

## Reference G — Diptyque / curated set

What works: pre-composed and buildable set mental model is clear.

Adaptation: Violet may offer a build-a-trio prototype locally, but not claim real fulfillment, free gifts or brand inventory.

## Page-role reference matrix

| Violet page role | References | Principle | Do not copy | V4 adaptation |
|---|---|---|---|---|
| Home | ZGO + Byredo | show product/house/discovery evidence early | retail badges / brand campaign surface | featured object + route chooser + house index + discovery ritual |
| PLP | Byredo + Luckyscent | product-first cards, sample visibility | dense sample catalogue / exact grid | concise cards + filter rail + editorial/house interruptions |
| PDP | Byredo + Le Labo + ZGO | purchase decision first, format/sample adjacent | single-brand storytelling | sticky buying desk + gallery + sample/full-bottle choices + house proof |
| Houses | ZGO | multi-house identity is navigable | real official-stockist claims | typographic house index + collection detail |
| Discovery | Nose + Luckyscent + Frédéric Malle | sample is a journey, not a SKU | AI/self-learning or redeem claims | trio/wardrobe/portrait paths + local evaluation |
| Finder | Nose + Byredo | assisted guidance must feed commerce | copied diagnostic | keep Violet 4-step logic, connect to sample trio |

## Extracted design DNA

- **Layout grammar:** editorial index, asymmetry, decisive product/house objects, fewer repeated card sections.
- **Commerce grammar:** sample/discovery and full bottle are adjacent commitment levels.
- **Information grammar:** mood/family/house are parallel entry paths.
- **Trust grammar:** prove curation through structure/provenance instead of repeated slogans.
- **Media grammar:** one dominant image family per page role with clear product focal point.
- **Interaction grammar:** guided discovery must have a next state (sample/evaluate/return), not terminate at recommendations.

## Rejected patterns

- universal `large serif + pastel gradient + 3 cards` luxury shell;
- heavy gold/black “luxury” styling;
- copying branded bottle/campaign assets;
- fake AI/personalization;
- fake scarcity, awards, heritage or official-retailer claims;
- dense retailer catalogue visual noise.

## Benchmark result

PASS — production references are mixed by role, principles are transferable and page-specific, and no single reference owns the final visual language.