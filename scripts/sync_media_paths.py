#!/usr/bin/env python3
"""Replace declared remote prototype media URLs with same-origin asset paths.

The source URLs stay in assets/media-manifest.json as provenance. Buyer-facing
HTML/CSS/JS receives only repository-relative paths so browser-to-Figma capture
does not depend on third-party image transport.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "media-manifest.json"
TARGET_SUFFIXES = {".html", ".js", ".css"}
SKIP_NAMES = {"media-manifest.json"}


def main() -> int:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    replacements = {entry["url"]: entry["path"] for entry in entries}
    changed: list[str] = []

    for path in ROOT.iterdir():
        if not path.is_file() or path.suffix.lower() not in TARGET_SUFFIXES:
            continue
        if path.name in SKIP_NAMES:
            continue
        text = path.read_text(encoding="utf-8")
        updated = text
        for remote, local in replacements.items():
            updated = updated.replace(remote, local)
        if updated != text:
            path.write_text(updated, encoding="utf-8", newline="\n")
            changed.append(path.name)

    unresolved: list[str] = []
    for path in ROOT.iterdir():
        if not path.is_file() or path.suffix.lower() not in TARGET_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8")
        if "images.pexels.com/" in text:
            unresolved.append(path.name)

    if unresolved:
        raise SystemExit(
            "Remote Pexels media remains in buyer-facing source: " + ", ".join(sorted(unresolved))
        )

    print("Localized media references in:", ", ".join(changed) if changed else "no files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
