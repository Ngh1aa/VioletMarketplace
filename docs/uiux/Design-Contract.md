# Violet V4 — Design Contract

Status: Phase-1 canonical design source of truth.

## 1. Owner / business goal

Make Violet a credible premium **multi-house niche-fragrance destination** where curation and sampling reduce blind-buy risk and catalogue overload. The marketplace must demonstrate expertise through houses, product evidence, trial paths and reasoned edits rather than repeatedly claiming “luxury/curated”.

## 2. User goal

Help shoppers answer, in order:
1. Where should I start — scent, house, discovery or guided portrait?
2. Which small set of fragrances is relevant?
3. What does this specific fragrance feel like and how will it wear?
4. Should I sample/discover or commit to a full bottle?
5. Can I complete the prototype transaction clearly and without pressure?

## 3. Priority journey

`Entry → choose discovery model → narrow → evaluate product/house → sample/discovery or full bottle → bag → simulated checkout`.

A Scent Portrait recommendation is not an endpoint; it must offer a low-commitment trial next step.

## 4. Preserve / change

### Preserve
- Violet name and fragrance-specific identity;
- warm ivory / lilac / aubergine family;
- serif + clear sans rhythm;
- URL-persistent PLP filters;
- deterministic Scent Portrait and Back-state;
- localStorage cart;
- fictional maisons/products;
- no fake AI/scarcity/payment/auth claims;
- calm checkout.

### Change
- global navigation becomes task-led;
- homepage loses repeated method/manifesto/card shelves;
- violet gradients become rare rather than default luxury surface;
- PLP becomes product-first with concise cards and merchandising interruptions;
- PDP becomes object gallery + buying desk before dossier/story;
- sampling becomes a dedicated route and commitment level;
- maisons become first-class buyer objects;
- V4 CSS ownership should reduce override layering, not add unbounded patches.

## 5. Brand evidence / status

No formal brand guideline exists. Existing Violet source, established palette, wordmark and accepted V2/V3 directions are working brand evidence. V4 visual direction is a **project design decision**, not a claim about an external real-world brand.

## 6. Visual grammar

One-sentence signature:

> If the logo is removed, Violet remains recognizable through warm-paper fields, aubergine ink rules, archive indexing, object-study fragrance media, restrained sensory serif language and sample-vs-bottle decision grammar.

Rules:
- warm paper dominates;
- violet is concentrated in active/wayfinding/editorial signals;
- thin rules and typographic indexes organize content;
- product/house/sample object is usually stronger than decorative typography;
- use asymmetry deliberately on editorial pages, not utility pages;
- page-role compositions differ structurally;
- no generic rounded card/shadow language;
- no broad gradient without a focal reason.

## 7. Media contract summary

- PLP product = 4:5 object-study family.
- PDP primary = 4:5/3:4 controlled object, safe zone verified.
- Home = wider feature with separate copy safe zone.
- House = material/scene/collection identity, not copied product tile.
- Discovery = vials/set/ritual object.
- Remote/stock assets remain prototype media; visible third-party product branding on fictional items is prohibited.

## 8. Interaction grammar

- Every filter/selection exposes selected state and recovery.
- Scent Portrait keeps reversible steps and meaningful progress.
- Discovery tray (if implemented) has explicit capacity and remove/replace states.
- sample/full-bottle controls use familiar commerce patterns.
- no action can imply backend/payment fulfillment that does not exist.

## 9. Page experience contracts

| PAGE/ROLE | AUDIENCE | ENTRY CONTEXT | USER GOAL | OWNER GOAL | PRIMARY QUESTION | DECISION | PROOF | CTA | NEXT | CONTENT PRIORITY | VISUAL STRATEGY | INTERACTION | RESPONSIVE PRIORITY |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Home / index | all | direct/brand/social | choose starting route | establish curated multi-house model | Where should I start? | fragrance vs house vs discovery vs portrait | featured object, house index, discovery ritual | Explore / Discovery / Portrait | relevant route | object → route → house → curated shelf → discovery | editorial 5/7 feature + archive rows | standard links | desktop 1280/1440/1600 |
| PLP / Library | curious + enthusiast | search/nav/direct | narrow products | make curation useful | Which scents fit? | filters + object | family/mood/house/format + concise card | Open fragrance | PDP | count/state → product → sample cue | compact masthead + rail + 3-col + editorial span | URL state, clear/recovery | desktop |
| PDP | all buyer | PLP/search/direct | sample or buy confidently | convert with evidence | Do I try or commit? | size + sample/discovery + bottle | object media, price, notes, wearing, house | Try/Discovery / Add bottle | Discovery/Bag | identity → price/actions → evidence → story | object gallery + sticky buying desk | cart/sample state | desktop |
| Houses index | enthusiast/curious | nav/home | find a maison territory | prove multi-house expertise | Which house feels relevant? | house | origin/ethos/materials/products | Open house | House detail | house name/territory first | archive index + one feature image | links/filter optional | desktop |
| House detail | enthusiast | Houses/PDP | understand collection | make curation tangible | What defines this maison? | collection/discovery | concise fictional ethos + product set | Explore / Try house | PDP/Discovery | house → collection → discovery | maison dossier, staggered objects | links | desktop |
| Discovery | uncertain/gift/returner | nav/PDP/Finder | reduce blind-buy risk | make sampling central | How can I try first? | trio/wardrobe/portrait | explicit prototype sample logic | Build trio / Open set | PDP/Bag | ritual → selection → next step | ritual workspace | local selection states | desktop |
| Scent Portrait | curious | nav/home/recovery | get explainable shortlist | assist without fake AI | What direction fits? | 4 answers + shortlist | selected choices + why-fit | Build trio / PDP | Discovery/PDP | question first | consultation worksheet | reversible state | desktop |
| Bag/Checkout | committed | commerce | complete clearly | preserve confidence | Is everything correct? | qty/details/payment simulation | transparent rows/totals/reality note | Checkout/Place order | confirmation | transaction only | utility paper/ink | validation + local state | desktop |

## 10. Representative implementation gate

Phase 2 must implement and render **Home + PLP + PDP + Discovery** first because together they prove:
- editorial index vs catalogue vs buying desk vs ritual workspace;
- new navigation mental model;
- product/house/sample media families;
- primary conversion sequence.

Finder is a regression + integration route after these representative pages pass. House page enters the whole-site rollout after the four-page gate unless implementation ownership makes it cheap to include earlier.

## 11. Do / do not

DO:
- make first-screen decision obvious;
- prioritize product media and commerce evidence;
- expose low-commitment discovery;
- use house identity to make marketplace curation visible;
- keep copy short and specific;
- make Violet recognition depend on multiple cues.

DO NOT:
- rebuild V3 with a different palette;
- keep method + manifesto + repeated product shelves one-for-one;
- use one hero shell for Home/PLP/House/Discovery;
- copy reference typography, product imagery, campaigns or proprietary wording;
- claim AI learning, official-retailer status, redeem vouchers or real sample fulfillment;
- hide price/actions below storytelling;
- patch obvious layout problems with deeper CSS override chains.

## 12. Phase-2 deviation rule

Material hierarchy/journey/composition deviation requires a Decision Log entry with rendered/root-cause evidence. Local token tuning is allowed when it preserves semantic roles and improves verified craft.