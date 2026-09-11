# UIUX Factory V6 — Research / Audit

Date: 2026-09-11
Mode: external brain + target-project QA
Target: `Ngh1aa/VioletMarketplace`
Primary route: `https://ngh1aa.github.io/VioletMarketplace/`

## Problem statement

The current Violet direction is already a fragrance-led editorial marketplace. The copied phrase `furniture/luxury interior` in the invocation conflicts with the target project's established source of truth, so this run preserves Violet as a **luxury fragrance / parfumerie** experience and applies the requested portfolio-quality, image-led, editorial, non-template standard to that domain.

The user also supplied browser-to-Figma evidence showing a successful conversion payload but missing/fragile image transfer. The current source uses many third-party `images.pexels.com` URLs injected by JavaScript. That is a transport risk for HTML-to-Figma tools even when the browser screenshot can visually render the page.

## Current-site audit

### Keep

- White / warm-paper field with pastel-violet identity cues.
- Editorial serif + restrained sans hierarchy.
- `Object → Material → Atmosphere` media grammar.
- Try-first / discovery-before-bottle UX.
- Distinct route roles: Home, Library, PDP, Discovery, Houses, Scent Portrait.
- Explicit prototype boundaries and no fake AI/payment/provenance claims.

### Revise

- Replace third-party runtime image dependencies with same-origin repository assets.
- Add a capture mode that disables motion and forces image readiness for browser-to-Figma workflows.
- Make media transport a first-class release gate, not an incidental implementation detail.
- Run the new cloud Factory QA harness against the **actual Violet branch**, not a fixture.

### Remove / avoid

- Any regression toward a generic purple marketplace.
- Universal hero/card patterns across every page role.
- Decorative gradients, glassmorphism or oversized soft cards.
- Reliance on third-party image URLs in buyer-facing HTML/JS when the goal includes Figma conversion.

## External reference research

The reference set is used for principles, not for copying layouts, branded assets or copy.

1. **Diptyque** — frames fragrance as travel, memory and olfactive territory; category content is editorial rather than only transactional. Useful principle: give scent a world before asking for conversion.
2. **Byredo** — keeps product grids visually direct while surfacing `Try-It-first` as a lower-risk path. Useful principle: trial belongs next to the purchase decision, not hidden in support content.
3. **Le Labo** — combines product categories, discovery, craft, manifesto and journal-like storytelling. Useful principle: commerce and maison culture can coexist without one universal page shell.

## Research conclusion

The strongest next step is **not another wholesale visual reset**. Violet already has a coherent art direction. The highest-leverage redesign is to harden the media layer, preserve the current visual signatures, and make the whole experience reliably portable to Figma while keeping actual website QA evidence.

## Evidence state

- VERIFIED: repository architecture, current remote image usage, existing design contracts, current route structure.
- VERIFIED: user-supplied converter screenshot shows processing success but image-transfer concern.
- EVIDENCE-BACKED INFERENCE: same-origin assets reduce cross-origin / temporary-asset failure modes in HTML-to-Figma conversion.
- UNKNOWN: the converter vendor's exact internal raster ingestion algorithm; no claim is made about its private implementation.
