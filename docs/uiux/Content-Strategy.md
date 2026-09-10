# Content Strategy — Violet V4

## Principle

Show the evidence before explaining the philosophy. Luxury should be inferred from product authority, house curation, sampling confidence and editorial restraint.

## Content hierarchy

1. **Object / house / decision** — fragrance name, maison, mood/family, sample/full-bottle route, price.
2. **Confidence evidence** — notes, presence, wearing context, provenance, sample/discovery availability.
3. **Curation voice** — short Violet note explaining why an object belongs in the edit.
4. **Brand philosophy** — sparse, secondary, never repeated across consecutive sections.

## Homepage content rule

Remove or condense repeated self-description. V4 homepage should not separately explain “Violet method”, manifesto, curation philosophy and trust in multiple long blocks.

Target homepage narrative:
- one decisive featured object/campaign;
- three discovery routes;
- house index/feature;
- one curated shelf/editorial interruption;
- discovery/sample ritual;
- concise trust/footer.

## PLP content rule

Product card must answer whether to open PDP without becoming a miniature dossier:
- maison;
- fragrance name;
- concentration/size;
- family or 2–3 note words;
- price;
- sample/discovery cue when applicable.

Long descriptive paragraphs move to PDP.

## PDP content rule

Above/near first fold:
- maison + name;
- scent character in one sentence;
- concentration + size;
- price;
- sample/discovery choice;
- full-bottle CTA;
- availability/system reality.

Below decision layer:
- notes;
- mood/presence/wearing;
- maison/provenance;
- Violet curation note;
- related directions with reason.

## House content

Fictional house content must be concise and clearly part of the prototype world. Each house needs:
- origin/location label;
- one-sentence ethos;
- 2–4 signature materials/moods;
- collection objects;
- discovery path.

Avoid fake awards, heritage years, perfumer biographies or sourcing claims unless explicitly represented as fictional/prototype data.

## Discovery content

Explain the ritual, not fake fulfillment:
1. choose a shortlist;
2. wear on skin over time;
3. record reaction;
4. return to full bottle when confidence is earned.

Any price/credit/sample fulfillment introduced in Phase 2 is `SIMULATED/MOCK` and must be labeled accordingly.

## Language contract — release blocker

**Primary locale: Vietnamese (`vi`).** This is a product contract, not a tone preference.

### What must be Vietnamese

All decision-making and navigation copy must use Vietnamese consistently:
- global navigation, search, filters and footer;
- headings, section labels and helper text;
- buttons, links, form labels, validation and status messages;
- empty, loading, success and error states;
- accessibility labels and image alt text when they describe UI meaning;
- Scent Portrait questions, progress labels, answers and recommendation rationale;
- cart, checkout, seller and admin operational UI.

### Documented exceptions

The following may remain untranslated when translation would reduce recognition or fragrance precision:
- brand and maison names, e.g. `Violet Parfumerie`, `Maison Aster`;
- product names, e.g. `Violette 03`, `Violet Discovery Wardrobe`;
- established concentration names, e.g. `Eau de Parfum`, `Extrait de Parfum`;
- ingredient / note vocabulary such as `iris`, `neroli`, `saffron`, `sandalwood`, `ambrette`;
- technical prototype terms when explicitly labeled as such, e.g. `prototype`, `AI`, `SKU`, `KYC`, `SLA`.

Exceptions must not turn an otherwise Vietnamese sentence into casual code-switching. Prefer a Vietnamese sentence with the necessary domain term embedded naturally.

### Forbidden release state

A screen with `html[lang="vi"]` must not ship when generic UI copy is visibly mixed between Vietnamese and English without a documented terminology reason. Examples of blockers include `Step 1 of 4` next to a Vietnamese question, `Continue` beside Vietnamese helper text, or an English global navigation surrounding Vietnamese page content.

### Verification

Before merge:
1. render representative buyer, checkout and operational routes;
2. exercise interaction-generated copy, especially every Scent Portrait step and result state;
3. audit visible UI strings and accessibility labels against this contract;
4. preserve screenshots and the machine-readable language QA report;
5. fail CI on accidental English UI chrome in the Vietnamese locale.

For this repository, `scripts/language_consistency_qa.mjs` and `.github/workflows/language-consistency-qa.yml` encode the rendered language gate.

## SEO/content intent for prototype

- Home: curated niche fragrance marketplace / discovery.
- Library: fragrance by family/mood/house.
- PDP: specific fictional fragrance dossier + purchase decision.
- Houses: curated fragrance houses.
- Discovery: perfume samples/discovery sets/try before full bottle.
- Finder: guided scent portrait.

No SEO-performance claim is made; metadata correctness is verified in Phase 2/3.
