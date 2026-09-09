# Assumptions, Risks and Limitations — Violet V4

## Assumptions
- Primary buyer experience is the user’s current priority; seller/admin surfaces are not being aesthetically redesigned in V4.
- Fictional catalog/houses remain acceptable prototype content.
- Desktop-first scope remains intentional for this phase.
- The existing vanilla architecture can support the planned V4 representative flows without framework migration.

## Evidence limitations
- No first-party analytics, Search Console, customer interviews, usability tests or conversion data are available.
- Audience segments and business-impact expectations are PROFESSIONAL_HYPOTHESES grounded in product structure/reference patterns, not validated research.
- Reference-site behavior is production evidence of what those sites provide, not proof that the pattern improves conversion or UX for Violet.
- Design-intelligence CLI was not executable in the remote connector environment; immutable corpus tables were inspected directly and this limitation is preserved in the decision log.

## Media risks
- Current remote product imagery remains prototype/stock media; it can undermine final luxury credibility even after strong art direction.
- Remote provider latency/caching can create blank screenshot evidence if QA does not decode images before capture.
- Some source photography may contain subtle labels/visual cues inconsistent with fictional houses; manual inspection remains required.

## Interaction / reality risks
- Adding sample evaluation can accidentally imply account persistence or adaptive AI; all such state must remain local and labeled.
- `official`/authenticity language can overstate a prototype flag; V4 copy must distinguish curation metadata from real-world legal verification.
- Checkout must not drift from simulated status during visual polish.

## Implementation risks
- Existing styles are layered (`styles.css` + perfume + V2 + V3). Adding V4 only as another patch layer can create fragile ownership. Phase2 should consolidate/override at root where feasible and avoid selector wars.
- New Houses/Discovery routes increase route coverage; invalid query states need recovery.
- Refactoring shared header/card code may regress Finder/cart/checkout; regression routes are mandatory.

## Visual risks
- Reducing purple may make Violet too generic/monochrome unless media/annotation/sampling signatures carry identity.
- Editorial asymmetry can reduce commerce clarity if overused; page-role matrix intentionally limits it.
- Luxury references can tempt imitation; no proprietary surface/asset/copy should be cloned.

## Scope limitations
- mobile/tablet = N/A_JUSTIFIED for V4 completion.
- Chromium is the only due-now browser.
- Formal WCAG conformance, field performance, real payment/auth/security and analytics outcome verification are not claimed.

## Mitigation
- Representative page gate before rollout.
- OLD→NEW same-viewport proof.
- Manual Creative Director visual veto after latest material fix.
- System Reality contract colocated with implementation/QA.
- Prompt4 production smoke must open live Pages and verify version/assets, not only CI status.
