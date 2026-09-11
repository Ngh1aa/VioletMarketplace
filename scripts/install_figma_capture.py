#!/usr/bin/env python3
"""Install final accessibility + optional Figma capture helpers on every HTML route."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ACCESS_TAG = '  <script src="accessibility-v6.js"></script>'
FIGMA_TAG = '  <script src="figma-capture.js"></script>'


def main() -> int:
    changed: list[str] = []
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if "</body>" not in text:
            raise SystemExit(f"Cannot install runtime helpers; missing </body>: {path.name}")

        tags: list[str] = []
        if 'src="accessibility-v6.js"' not in text:
            tags.append(ACCESS_TAG)
        if 'src="figma-capture.js"' not in text:
            tags.append(FIGMA_TAG)
        if not tags:
            continue

        # Runtime correction is loaded at the end of body, after the existing
        # rollout scripts have appended their design layers. Figma capture stays
        # last so it can normalize the final rendered page without changing IA.
        updated = text.replace("</body>", "\n".join(tags) + "\n</body>")
        path.write_text(updated, encoding="utf-8", newline="\n")
        changed.append(path.name)

    print("Installed runtime helpers in:", ", ".join(changed) if changed else "no files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
