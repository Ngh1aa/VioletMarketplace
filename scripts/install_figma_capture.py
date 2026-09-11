#!/usr/bin/env python3
"""Install the optional Figma capture helper on every HTML route."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TAG = '  <script src="figma-capture.js"></script>'


def main() -> int:
    changed: list[str] = []
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if 'src="figma-capture.js"' in text:
            continue
        if "</body>" not in text:
            raise SystemExit(f"Cannot install Figma capture helper; missing </body>: {path.name}")
        updated = text.replace("</body>", f"{TAG}\n</body>")
        path.write_text(updated, encoding="utf-8", newline="\n")
        changed.append(path.name)
    print("Installed Figma capture helper in:", ", ".join(changed) if changed else "no files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
