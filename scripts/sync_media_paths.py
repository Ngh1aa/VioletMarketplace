#!/usr/bin/env python3
"""Replace declared remote prototype media URLs with same-origin asset paths.

The source URLs stay in assets/media-manifest.json as provenance. Buyer-facing
HTML/CSS/JS receives only repository-relative paths so browser-to-Figma capture
does not depend on third-party image transport.

Pexels URLs are matched by photo ID, not by query string, because the same asset
may be requested at different widths in different page roles.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "media-manifest.json"
TARGET_SUFFIXES = {".html", ".js", ".css"}
PEXELS_URL = re.compile(
    r"https://images\.pexels\.com/photos/(?P<id>\d+)/[^\"')\s]+"
)
PEXELS_ID = re.compile(r"/photos/(?P<id>\d+)/")


def media_map() -> dict[str, str]:
    entries = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id: dict[str, str] = {}
    for entry in entries:
        match = PEXELS_ID.search(entry["url"])
        if not match:
            continue
        photo_id = match.group("id")
        previous = by_id.get(photo_id)
        if previous and previous != entry["path"]:
            raise SystemExit(
                f"Manifest maps Pexels photo {photo_id} to multiple local paths: "
                f"{previous!r} and {entry['path']!r}"
            )
        by_id[photo_id] = entry["path"]
    return by_id


def main() -> int:
    by_id = media_map()
    changed: list[str] = []
    unknown_ids: set[str] = set()

    def replace(match: re.Match[str]) -> str:
        photo_id = match.group("id")
        local = by_id.get(photo_id)
        if local:
            return local
        unknown_ids.add(photo_id)
        return match.group(0)

    for path in ROOT.iterdir():
        if not path.is_file() or path.suffix.lower() not in TARGET_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8")
        updated = PEXELS_URL.sub(replace, text)
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

    if unknown_ids:
        raise SystemExit(
            "Pexels photo IDs are used by buyer-facing source but missing from the media manifest: "
            + ", ".join(sorted(unknown_ids))
        )
    if unresolved:
        raise SystemExit(
            "Remote Pexels media remains in buyer-facing source: " + ", ".join(sorted(unresolved))
        )

    print("Localized media references in:", ", ".join(changed) if changed else "no files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
