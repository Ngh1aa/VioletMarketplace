# Factory V6 — Remediation 01

## Trigger

The first real UIUX Factory target-project QA run successfully served Violet and all declared same-origin media, but axe blocked release on measured WCAG AA color-contrast defects across all representative routes.

## Evidence

Representative measured failures included:

- topbar links: `#dbd0db` on `#e8dcf2` → **1.13:1** (required 4.5:1);
- header `Parfumerie` micro-label: `#8e7f8d` on white → **3.76:1** (required 4.5:1);
- footer brand: `#382c42` on `#17131b` → **1.4:1** (required 3:1 at the measured display size);
- Discovery after-wear muted text on pastel violet → **4.07–4.27:1** (required 4.5:1);
- Discovery wardrobe copy included a resolved pale-on-white state around **1.65:1**.

The same run's server log returned HTTP 200 for the new `assets/media/*` files and `figma-capture.js`, so the media-transport remediation itself is functioning.

## Root cause

Multiple historical visual layers intentionally used opacity and very pale muted colors. The new strict target-project axe gate exposed that these values no longer meet AA after the pastel-violet redesign layers resolve together.

## Repair

A final owned runtime layer was added:

- `accessibility-v6.css` — high-contrast Violet-compatible color corrections;
- `accessibility-v6.js` — appends that stylesheet after dynamic brand/exploration layers so the measured correction owns the final cascade;
- the route installer adds the runtime helper to every HTML page.

The repair preserves layout, typography scale, media hierarchy and Violet's pastel identity. No axe rule or quality threshold was weakened.

## Re-run requirement

The next target-project QA must pass axe before browser evidence and Lighthouse can be treated as release evidence. Representative full-page screenshots must then be opened and visually reviewed before merge.
