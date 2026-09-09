# Violet Desktop Experience V3 — Factory-routed flow

## Phase classification

- Scope: `whole-site` for storefront surfaces, implementation limited to the desktop commerce experience.
- Type: `redesign + implementation + QA`.
- Risk: `medium` (visual/commerce hierarchy; no real payment/API behavior is added).
- Mode: `interactive_prototype`.
- Responsive scope: `desktop_only` for this phase. Tablet/mobile are preserved but not claimed as visually complete.
- Release authorization: `merge_only`.
- skills_UIUX lock: `1a3c9ef2d72e6bd0d4a4fc79c885c59f98e41c33`.

## Goal

Raise perceived quality of the complete Violet storefront so it reads as a curated niche-fragrance destination rather than a polished purple marketplace template. Preserve clarity, seller provenance and shopping mechanics while making imagery, composition, product storytelling and discovery feel more selective and editorial.

## Skill Activation Plan

| Task | Trigger / risk | Skill | Material impact | Verification |
|---|---|---|---|---|
| Existing project truth | Whole-site visual change | `project-context` | Preserve Violet palette, desktop scope, vanilla architecture and existing behavior | Source diff + contract |
| Ecommerce hierarchy | PLP/PDP are purchase decision surfaces | `ecommerce-website` | Product cards, filters and PDP must expose decision information before decoration | Rendered PLP/PDP |
| Photography system | Mixed placeholder imagery weakens perceived value | `asset-media-and-art-direction` | One crop/lighting/tone system, purpose and safe-zone rules | Rendered media audit |
| Cross-page visual grammar | Storefront still risks template repetition | `visual-design-direction` | Distinct page-role composition families and stronger hierarchy | Cross-page screenshots |
| Brand memory | Purple alone is not enough recognition | `brand-distinctiveness-and-visual-signature` | Repeatable Violet cues: twilight field, editorial numbering, image treatment, serif rhythm | Logo-cropped recognition review |
| Anti-template calibration | Luxury can collapse into gradient/card tropes | `visual-taste-calibration` | Concentrate boldness in media + typography; remove generic card decoration | KEEP/REVISE/REMOVE review |
| Search/filter behavior | PLP needs useful refinement states | `interaction-patterns-and-form-ux` | Visible filter state, meaningful filter groups, clear-all/recovery | Browser interaction QA |
| Final visual quality | Substantial visual work | `ui-craft-and-visual-qa` | Actual rendered evidence required; P0/P1 block merge | Playwright + Creative Director inspection |

## Reference intelligence synthesis

Production references are used by principle only.

### Le Labo — discovery / commitment model

Observed principle: discovery sets and sample sizes let customers explore before committing to a full bottle. Violet adapts this into a visible `Try first` decision path on PDP rather than hiding sampling in supporting copy.

### Existing Violet V2

Preserve:
- warm violet twilight palette;
- serif + restrained sans pairing;
- low-noise luxury commerce language;
- Scent Portrait as signature discovery interaction;
- authenticity and curated-house framing;
- buyer/cart/checkout behavior.

Revise:
- product imagery feels source-mixed;
- homepage still contains several conventional ecommerce product-grid rhythms;
- PDP presents good information but not yet a fragrance story / decision narrative;
- PLP filters are static navigation links rather than a richer decision surface;
- product cards carry more metadata than necessary for a premium gallery.

## Page-role composition matrix

| Page role | User question | Owner message | First visual anchor | Decision object | Primary action |
|---|---|---|---|---|---|
| Homepage / brand-discovery | What kind of fragrance world is Violet? | Curated, intimate, sensorial marketplace | atmospheric hero + editorial scent object | Scent Portrait / curated edit | Create Scent Portrait / explore edit |
| Fragrance Library / browse | How do I narrow to scents that fit me? | Browse by scent language, not marketplace noise | title + active refinement rail + gallery | filter state + fragrance card | Open fragrance |
| PDP / evaluate | What does this smell like and should I commit? | Understand scent character, provenance and sampling before purchase | large product object + scent character panel | scent profile + note architecture + try-first path | Try first / add full bottle |
| Scent Portrait / assisted discovery | What suits my instinct? | Four calm decisions produce an explainable shortlist | consultation workspace | selected answers + why-it-fits shortlist | View fragrance |
| Cart / checkout | Can I complete this confidently? | Transparent, calm transaction | order object / summary | quantity, delivery, total | Checkout / place order |

## Visual signature V3

If logo and brand name are cropped, Violet should still be recognizable through:

1. **Warm violet twilight fields** — aubergine depth + lavender mist + blush warmth, reserved for orientation/signature moments.
2. **Editorial scent indexing** — small numbered/kicker labels such as `01 / OLFACTIVE PORTRAIT` rather than generic badges.
3. **4:5 fragrance-object photography treatment** — quiet backgrounds, low saturation, warm highlight, soft violet cast, generous negative space.
4. **Serif fragrance language** — oversized but restrained display serif for names/olfactive statements; UI remains familiar sans.
5. **Fine rule / annotation grammar** — thin dividers, uppercase microcopy, scent-note labels; minimal radius/elevation.

## Art direction contract

### Product imagery

- Purpose: make the fragrance object and olfactive mood the primary commerce evidence.
- Ratio: `4:5` for catalogue/result imagery; primary PDP media may use a taller editorial field while retaining the product safe zone.
- Lighting: soft side light / golden-lilac twilight; controlled highlight, no harsh flash.
- Background: stone, silk, translucent glass, quiet botanical or tonal field; low complexity.
- Color treatment: warm ivory/lilac/blush with aubergine shadow; never neon purple.
- Crop: product object must retain full silhouette or clearly intentional crop; no label/primary bottle identity cut by `cover`.
- Avoid: visible unrelated real-brand logos, inconsistent casual stock photography, excessive flowers around every bottle, heavy fake-gold luxury cues.

### Existing remote imagery boundary

Current static prototype uses remote placeholder photography. V3 may unify treatment/crop and replace obvious duplicates, but must not claim those placeholders as final licensed campaign assets. `REAL` commerce imagery remains future work.

## PDP V3 information architecture

Top decision sequence:

1. Maison / fragrance name / concentration / size.
2. One-line scent character.
3. Price + availability truth.
4. `Try first` / Discovery option and full-bottle CTA.
5. Olfactive profile: family, mood, presence, longevity.
6. Note architecture.
7. Why Violet selected it / seller provenance / authenticity.
8. Wearing ritual / occasion context.
9. Related scents only with a clear reason.

## PLP V3 refinement contract

Use only attributes represented in prototype data:

- olfactive family;
- mood;
- presence;
- concentration;
- curated-house status.

Requirements:

- active filters visibly persist;
- each active filter can be removed;
- clear-all exists when filters are active;
- result count updates;
- empty state offers recovery and Scent Portrait;
- filters use URL parameters so browser back/share retains state;
- no fabricated review volume, scarcity or personalization claims.

## Visual taste calibration before code

- Memorable commitment: **the fragrance object sits inside a warm violet editorial field with precise scent annotations, not inside a generic card marketplace.**
- KEEP: twilight palette, restrained serif, Scent Portrait, authenticity language, quiet density.
- REVISE: mixed imagery, repeated grid rhythm, PDP information stacking, PLP refinement quality.
- REMOVE: decorative badges/rounded boxes where plain editorial grouping communicates the same thing; sale pressure as a primary cue.

## Verification plan

DUE NOW for V3:

- Homepage, Library, PDP, Scent Portrait at `1440x1000`.
- Pressure checks at `1280x900` and `1600x1000` for changed shared owners.
- no horizontal overflow, broken visible images, console/page errors;
- filter state/recovery works;
- PDP try-first and full-bottle actions are truthful prototype paths;
- cross-page screenshot review; no universal hero monotony;
- Creative Director opens and inspects actual screenshots;
- zero unresolved P0/P1 before merge.

Tablet/mobile visual polish: `N/A_JUSTIFIED` for current phase, existing behavior preserved.