#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import re
import ssl
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_OUTPUT = Path("/Users/mashbean/Codex/src/data/facebook-latest.json")
USER_AGENT = "Mozilla/5.0 (compatible; MashbeanFBManualSync/1.0; +https://mashbean.net)"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Semi-auto sync for latest Facebook personal-profile post by post URL."
    )
    parser.add_argument(
        "--url",
        help="Facebook post URL. If omitted, the script will prompt for input.",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_OUTPUT),
        help=f"JSON output path (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=18,
        help="HTTP timeout seconds (default: 18)",
    )
    parser.add_argument("--likes", type=int, help="Override like count manually.")
    parser.add_argument("--comments", type=int, help="Override comment/reply count manually.")
    parser.add_argument("--shares", type=int, help="Override share count manually.")
    parser.add_argument(
        "--insecure",
        action="store_true",
        help="Disable TLS certificate verification for this request only.",
    )
    return parser.parse_args()


def _extract_meta(html_text: str, name: str) -> str | None:
    pattern = re.compile(
        rf'<meta[^>]+property="{re.escape(name)}"[^>]+content="([^"]*)"',
        flags=re.IGNORECASE,
    )
    match = pattern.search(html_text)
    if not match:
        return None
    return html.unescape(match.group(1)).strip()


def _load_url(url: str, timeout: int, insecure: bool = False) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    context = None
    if insecure:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, timeout=timeout, context=context) as res:
        return res.read().decode("utf-8", errors="ignore")


def _is_share_like(text: str, url: str) -> bool:
    folded = f"{text} {url}".lower()
    if "sharer.php" in folded:
        return True
    return bool(re.search(r"(分享|shared\s+.+(?:post|link|video|memory))", folded))


def _is_pinned_like(text: str) -> bool:
    return bool(re.search(r"(置頂|pinned)", text.lower()))


def _parse_count(raw: str) -> int | None:
    normalized = raw.replace(",", "").strip()
    try:
        return int(normalized)
    except ValueError:
        return None


def _extract_engagement_counts(page_html: str) -> tuple[int | None, int | None, int | None]:
    body_text = html.unescape(page_html)
    body_text = re.sub(r"<[^>]+>", " ", body_text)
    body_text = re.sub(r"\s+", " ", body_text)

    patterns = {
        "likes": [
            r"([\d,]+)\s*(?:個)?讚",
            r"([\d,]+)\s+likes?",
            r"([\d,]+)\s+reactions?",
        ],
        "comments": [
            r"([\d,]+)\s*(?:則)?(?:留言|回覆)",
            r"([\d,]+)\s+comments?",
            r"([\d,]+)\s+repl(?:y|ies)",
        ],
        "shares": [
            r"([\d,]+)\s*次分享",
            r"([\d,]+)\s+shares?",
        ],
    }

    def find_first(keys: list[str]) -> int | None:
        for pattern in keys:
            match = re.search(pattern, body_text, flags=re.IGNORECASE)
            if match:
                parsed = _parse_count(match.group(1))
                if parsed is not None:
                    return parsed
        return None

    return (
        find_first(patterns["likes"]),
        find_first(patterns["comments"]),
        find_first(patterns["shares"]),
    )


def main() -> int:
    args = parse_args()
    post_url = (args.url or "").strip()
    if not post_url:
        post_url = input("貼上 Facebook 單篇貼文網址: ").strip()
    if not post_url:
        print("ERROR: Missing --url")
        return 2

    try:
        page_html = _load_url(post_url, timeout=args.timeout, insecure=args.insecure)
    except Exception as exc:  # noqa: BLE001
        print(f"ERROR: fetch failed -> {exc}")
        return 2

    title = _extract_meta(page_html, "og:title")
    desc = _extract_meta(page_html, "og:description")
    image = _extract_meta(page_html, "og:image")
    canonical = _extract_meta(page_html, "og:url") or post_url
    published = _extract_meta(page_html, "article:published_time")
    auto_likes, auto_comments, auto_shares = _extract_engagement_counts(page_html)

    text = (desc or "").strip()
    if _is_share_like(text, canonical):
        print("REJECTED: share-like post")
        return 3
    if _is_pinned_like(text):
        print("REJECTED: pinned-like post")
        return 3
    if not text and not image:
        print("REJECTED: neither text nor image")
        return 3

    payload = {
        "source": "manual-facebook-post-url",
        "fetchedAt": datetime.now(timezone.utc).isoformat(),
        "postTime": published,
        "text": text or None,
        "title": title or None,
        "hasImage": bool(image),
        "imageUrl": image or None,
        "postUrl": canonical or None,
        "likeCount": args.likes if args.likes is not None else auto_likes,
        "commentCount": args.comments if args.comments is not None else auto_comments,
        "shareCount": args.shares if args.shares is not None else auto_shares,
        "filters": {
            "excludedShare": True,
            "excludedPinned": True,
            "allowed": "text_or_image",
        },
    }

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)

    old = None
    if output.exists():
        try:
            old = json.loads(output.read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            old = None

    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    changed = old != payload
    print(f"WROTE {output}")
    print(f"CHANGED {str(changed).lower()}")
    print(f"POST {payload['postUrl']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
