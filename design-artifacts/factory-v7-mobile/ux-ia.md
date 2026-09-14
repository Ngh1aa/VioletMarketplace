# UX / IA — Violet Mobile Discovery

## Primary mobile journey
1. Discover: entry points surface Scent Portrait, Try Three, Browse by Mood.
2. Scent Portrait: answer preference, disliked notes, sweetness, freshness, projection, occasion/context, familiar scents.
3. Recommendations: show 3 ranked scents with deterministic reasons.
4. Why it matches: reasons are visible before PDP navigation.
5. PDP: separate Full Bottle vs Trial Trio actions and show stored profile rationale.
6. Discovery Trio: choose exactly 3, show overlap warnings and olfactive balance.
7. Checkout: prototype bag/checkout remains explicitly browser-local.
8. After Try: rate each sampled scent + optional issue tags.
9. Refine: feedback updates stored prototype preferences.
10. Return: Scent Portrait uses stored feedback as additional deterministic scoring evidence.

## IA
- Home
  - Start Scent Portrait
  - Build a Discovery Trio
  - Browse by mood / family
- Fragrance Library
  - note/family/mood/concentration filters
- Product Detail
  - why this matches you
  - full bottle
  - add to trial trio
- Discovery
  - trio builder
  - balance meter
  - similarity warning
  - after-wear feedback
  - return to refined recommendations
- Cart / Checkout
- Houses
- Seller workspace
- Admin workspace

## Scent Portrait question model
- scent family / instinct;
- disliked notes (multi-select);
- sweetness tolerance;
- freshness preference;
- projection preference;
- occasion;
- weather/context;
- familiar scents / references.

## Recommendation logic
Rule-based weighted scoring only. No probability or confidence percentage. Reasons are generated from matched rules and prior local feedback.

## Trio logic
- maximum 3 samples;
- selecting a very similar scent does not silently block; it warns and explains overlap;
- balance summarises represented families/moods;
- each selected scent can be replaced;
- set may be added to browser-local bag as a fictional prototype discovery set.

## Mobile interaction rules
- 390px is primary proof viewport;
- touch target minimum 44px;
- no hover-only affordances;
- sticky bottom journey/action bar may be used when it does not cover content;
- sheets/drawers may replace persistent desktop rails;
- one dominant task per screen section;
- progressive disclosure for technical perfume vocabulary.

## Validation tasks
1. Find perfume by mood.
2. Explain why a recommendation appeared.
3. Distinguish bottle vs sample.
4. Create a trio.
5. Rate a fragrance after trying.
6. Return to updated recommendations.
