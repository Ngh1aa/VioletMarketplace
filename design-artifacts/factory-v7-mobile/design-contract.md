# Design Contract — Violet Mobile Discovery V7

## Product promise
Help a user move from uncertain online scent browsing to a smaller, explainable trial decision without pretending software can smell for them.

## Hard product rules
- Never claim AI/ML.
- Every recommendation must expose at least two human-readable reasons when available.
- Profile and feedback state are local browser prototype data.
- Sample/trio and full-bottle actions must be visually distinct.
- Fictional sample credit/redemption must be labelled `Prototype concept — no real credit issued`.
- Trio is capped at 3 and must expose similarity/overlap rather than silently allowing redundant choices.
- Feedback must visibly change the next recommendation run.

## Responsive contract
### Mobile 360–430
- primary proof: 390×844;
- one-column buyer composition;
- 44px minimum interactive targets;
- sticky mobile journey nav may appear; it must not cover final content;
- desktop filter rail becomes drawer/toggle;
- image/copy composition is recomposed, not scaled;
- no horizontal overflow.

### Desktop 1280–1440
- preserve current editorial asymmetry and object-led density;
- mobile additions must not collapse existing strong desktop compositions.

## Page-role contracts
### Home
Surface three entry modes: guided portrait, try-first trio, browse library. Editorial object remains dominant.

### Scent Portrait
8 progressive steps. Single dominant question. Multi-select only where meaningfully required. Results show three explainable matches and explicit deterministic-rule label.

### PLP
Expert route. Mood/note/family/concentration remain discoverable without forcing guided flow.

### PDP
Opening decision stack: object image, character, why it matches, full bottle vs trial. Notes and house context follow.

### Discovery Trio
Three physical slots + balance summary + similarity warning + replace/remove + add prototype set to bag + post-wear feedback.

### Feedback
For each tried sample: love / like / neutral / dislike plus optional reasons `too sweet`, `too heavy`, `too light`, `not for me`. Saving feedback updates local preference evidence.

### Seller/Admin
Higher density, utilitarian and unmistakably operational. No large atmospheric editorial treatment.

## Accessibility
- WCAG A/AA automated gate via axe;
- semantic fieldsets/labels for profile questions;
- keyboard and touch equivalence;
- visible focus;
- status updates use `aria-live`;
- selected states are not color-only.

## Performance
- representative production routes keep Lighthouse performance ≥0.90;
- LCP ≤2500ms;
- CLS ≤0.1;
- personalization JS must not delay first paint of static hero/masthead.

## Release gate
No merge until:
- Factory target browser + axe + Lighthouse pass;
- mobile journey QA at 390px passes tasks 1–6;
- no P0/P1 overflow/media/touch defects;
- 390px screenshots are opened and visually reviewed;
- desktop representative QA remains green.
