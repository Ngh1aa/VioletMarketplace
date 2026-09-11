# Violet Parfumerie — Exploration Layout Direction

## Creative thesis

Violet is a **white fragrance space shaped around curiosity**. It should feel like entering rooms in a gallery, not scanning a marketplace catalogue.

The governing idea is:

**Look → wonder → reveal → wear → wait → return → decide**

The design must create desire to continue exploring before it asks for commitment.

## Visual contract

- Page background: **#FFFFFF**.
- Primary interaction / button / selected-state colour: **pastel violet**.
- Dark aubergine is allowed for text depth and small contrast only; it must not become the dominant page surface.
- No black or aubergine full-page blocks as the main visual identity.
- Product and editorial imagery owns the page. Text is a guest.
- Serif display typography carries emotion; sans-serif carries navigation and functional UI.
- No decorative gradients, glassmorphism, generic rounded cards or heavy shadows.

### Core colour tokens

- White: `#FFFFFF`
- Pastel 050: `#FBF8FD`
- Pastel 100: `#F5EEF9`
- Pastel 200: `#EADCF4`
- Pastel 300 / primary CTA: `#DCC6EE`
- Pastel 400 / hover-focus: `#C9A8E2`
- Ink: `#17131B`
- Muted text: `#706A74`
- Aubergine text accent: `#3D2C45`
- Fine rule: `#E9E4EC`

## Three layout laws

### 1. Asymmetry over equal grids

Equal retail grids read as templates. Violet should create visual tension through unequal columns, staggered heights, offset sections and deliberate crops. A user should have to visually locate the next anchor instead of scanning mechanically from left to right.

### 2. Whitespace + image dominance

Whitespace communicates confidence. Most sections should leave enough empty area for the next object or image to feel discovered rather than inserted. Long copy lines must stay below roughly 75 characters on desktop.

### 3. Progressive reveal

Do not expose every filter, price, story, note and specification simultaneously. Reveal information when intent increases: hover/focus, open a filter drawer, select a PDP view, expand a long story, or move from sample to bottle.

## Image : text ratio contract

| Section | Image : text | Text limit |
| --- | ---: | --- |
| Home hero | 85 : 15 | ~480px / one short idea + CTA |
| Editorial story | 55 : 45 | 520–600px, short lines |
| Product card | 75–80 : 20–25 | name + one scent line |
| PDP opening stage | 60 : 40 | 440–500px buying column |
| House / maison | 70 : 30 | ~400px story copy |
| Texture rest | 95 : 5 or 100 : 0 | caption only |
| Final CTA | 40 : 60 | ~480px |

## Home rhythm

**large image → large statement → asymmetric objects → image-only pause → editorial story → open question → houses → pastel CTA**

- Hero image occupies about 85% of the width and is intentionally cropped.
- The philosophy statement follows before product commerce.
- Product edit uses a 55/45 asymmetric composition with staggered vertical starts.
- At least one image-only rest appears every 3–4 content sections.
- Headlines should open a question or continue an unfinished thought.

## Fragrance Library

- No permanent Amazon-style left sidebar.
- Filters live in a horizontal drawer and are closed by default.
- The underlying layout still uses three desktop tracks for predictable rendering, but the tracks are unequal and card heights are staggered.
- Product media occupies at least 75% of each card.
- Price remains visually hidden until hover/focus; name, house, family and format come first.
- A full-width editorial image interrupts every 6–8 objects.

## Product Detail

- Opening composition is 60/40.
- Media is sticky **inside the opening stage only**, so it never covers the story below.
- The first media state shows the object; secondary states reveal a closer crop and a clearly labelled editorial material reference.
- View changes use a slow fade (roughly 300–400ms), not a horizontal marketplace slider.
- Information order: house → object name → emotional sentence → opening/heart/trace → price + CTA → progressive story disclosure.
- Longer description stays behind a disclosure element.

## Houses

- The house index deliberately switches to horizontal scroll + snap.
- Each house acts like a room, not a row in a database.
- House detail begins with a nearly full-viewport editorial atelier image and only a small amount of text at the bottom edge.
- Story and product edit appear only after scroll.

## Discovery and Scent Portrait

Discovery is the behavioural thesis of Violet: **wear before commitment**.

Scent Portrait uses a 30/70 desktop split:

- the story rail is quiet and stable;
- each question occupies the decision workspace at near full-screen scale;
- progress is text only (`02 / 04`), never a large survey progress bar;
- selected states use pastel violet;
- mood changes may tint the page subtly without becoming decorative.

The recommendation remains deterministic prototype logic. Never imply AI personality prediction.

## About

About behaves like a magazine spread: alternating 55/45 and 45/55 sections, full-height images, offset copy and large typographic pauses. It should read like turning pages, not a corporate About template.

## Commerce utilities

Bag, checkout and success stay calm and usable:

- white page surfaces;
- pastel-violet primary actions and summary fields;
- minimal borders;
- no dark checkout shell;
- explicit prototype reality text remains visible.

## Interaction principles

- Intentional crop on arrival; reveal more on hover/click.
- Product hover may switch from object to material/atmosphere.
- CTA copy should invite: “Look closer”, “Begin with three”, “Enter the maison”, “Start with a feeling”.
- Avoid command-heavy labels unless necessary for commerce.
- Motion is restrained fade/translate and always respects `prefers-reduced-motion`.

## Prototype truth boundaries

- Fictional maisons remain visibly fictional.
- Browser-local cart, trio and checkout states must never be presented as live fulfilment.
- Supporting editorial imagery must never be represented as additional packshots of the fictional product.
- English is the primary UI language and EUR is the single buyer-facing currency.

## Desktop verification scope

Primary: 1440×1000.
Pressure points: 1280×1000 and 1600×1000.

Do not claim full mobile/tablet completion until a dedicated responsive phase is verified.
