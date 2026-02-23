#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import ssl
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


ARTOUCH_URL_RE = re.compile(r"\[前往閱讀\]\((https://artouch\.com/[^\)]+)\)")
ENTRY_START = '<div class="post-content entry-content" itemprop="articleBody">'
OG_IMAGE_RE = re.compile(r'<meta property="og:image" content="([^"]+)"')
TITLE_RE = re.compile(r"<title>(.*?)</title>", re.S)


@dataclass
class ProcessResult:
    file: str
    url: str
    status: str
    message: str = ""
    og_image: str = ""


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Enrich local ARTouch index posts with full article content.")
    p.add_argument("--source-dir", default="src/content/blog", help="Blog content directory")
    p.add_argument("--apply", action="store_true", help="Write file changes (default: dry run)")
    p.add_argument("--limit", type=int, default=0, help="Limit number of files (0 = all)")
    p.add_argument("--report", default="reports/artouch-enrich-report.json", help="Report output path")
    return p.parse_args()


def fetch(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; MashbeanArtouchImporter/1.0)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
            return resp.read().decode("utf-8", errors="replace")


def split_frontmatter(raw: str) -> tuple[str, str]:
    if not raw.startswith("---"):
        raise ValueError("Missing frontmatter start")
    parts = raw.split("---", 2)
    if len(parts) < 3:
        raise ValueError("Invalid frontmatter structure")
    frontmatter = parts[1].strip("\n")
    body = parts[2].lstrip("\n")
    return frontmatter, body


def find_post_url(body: str) -> Optional[str]:
    m = ARTOUCH_URL_RE.search(body)
    return m.group(1).strip() if m else None


def extract_entry_html(html: str) -> str:
    start = html.find(ENTRY_START)
    if start < 0:
        raise ValueError("Article body start marker not found")
    cursor = start + len(ENTRY_START)
    div_depth = 1
    token_re = re.compile(r"</?div\b[^>]*>", re.I)
    for token in token_re.finditer(html, cursor):
        tag = token.group(0)
        if tag.startswith("</"):
            div_depth -= 1
        else:
            div_depth += 1
        if div_depth == 0:
            return html[cursor: token.start()].strip()
    raise ValueError("Failed to locate article body end")


def normalize_html_chunk(chunk: str) -> str:
    out = chunk
    out = re.sub(r"\s+(srcset|sizes|loading|decoding|fetchpriority)=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"\s+class=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"\s+style=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"\s+id=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"\s+target=\"_blank\"", "", out, flags=re.I)
    out = re.sub(r"\s+rel=\"[^\"]*\"", "", out, flags=re.I)
    out = re.sub(r"\n{3,}", "\n\n", out)
    return out.strip()


def extract_title(html: str) -> str:
    m = TITLE_RE.search(html)
    if not m:
        return ""
    title = m.group(1)
    title = re.sub(r"\s*\|\s*典藏ARTouch\.com\s*$", "", title).strip()
    return title


def render_new_body(url: str, article_html: str) -> str:
    return (
        "## 內文\n\n"
        "> 本文同步自 ARTouch 薄荷薄荷專欄，已保留原始段落與圖片。\n"
        f"> 原文連結：[{url}]({url})\n\n"
        f"{article_html}\n\n"
        "---\n\n"
        f"原文連結：[{url}]({url})\n"
    )


def process_file(path: Path, apply: bool) -> ProcessResult:
    raw = path.read_text(encoding="utf-8")
    frontmatter, body = split_frontmatter(raw)
    url = find_post_url(body)
    if not url:
        return ProcessResult(str(path), "", "skipped", "No ARTouch source url found")

    html = fetch(url)
    article_html = normalize_html_chunk(extract_entry_html(html))
    if not article_html:
        return ProcessResult(str(path), url, "failed", "Extracted article body is empty")

    _title = extract_title(html)
    og_image = ""
    og = OG_IMAGE_RE.search(html)
    if og:
        og_image = og.group(1).strip()

    new_body = render_new_body(url, article_html)
    next_raw = f"---\n{frontmatter}\n---\n\n{new_body}"

    if apply and next_raw != raw:
        path.write_text(next_raw, encoding="utf-8")
        return ProcessResult(str(path), url, "updated", f"size={len(article_html)}", og_image=og_image)
    if next_raw == raw:
        return ProcessResult(str(path), url, "unchanged", "No diff after normalization", og_image=og_image)
    return ProcessResult(str(path), url, "dry-run", f"would_update size={len(article_html)}", og_image=og_image)


def is_mintmint_index(raw: str, filename: str) -> bool:
    if not filename.endswith("-artouch.md"):
        return False
    if "薄荷薄荷專欄" not in raw:
        return False
    return "原文連結：[前往閱讀](https://artouch.com/" in raw


def main() -> int:
    args = parse_args()
    source_dir = Path(args.source_dir).resolve()
    files = sorted(source_dir.glob("*-artouch.md"))
    selected: list[Path] = []
    for f in files:
        try:
            text = f.read_text(encoding="utf-8")
        except Exception:
            continue
        if is_mintmint_index(text, f.name):
            selected.append(f)

    if args.limit > 0:
        selected = selected[: args.limit]

    results: list[ProcessResult] = []
    for path in selected:
        try:
            results.append(process_file(path, apply=args.apply))
        except Exception as exc:
            results.append(ProcessResult(str(path), "", "failed", str(exc)))

    summary = {
        "source_dir": str(source_dir),
        "apply": bool(args.apply),
        "total_candidates": len(selected),
        "updated": sum(1 for r in results if r.status == "updated"),
        "dry_run": sum(1 for r in results if r.status == "dry-run"),
        "unchanged": sum(1 for r in results if r.status == "unchanged"),
        "skipped": sum(1 for r in results if r.status == "skipped"),
        "failed": sum(1 for r in results if r.status == "failed"),
        "results": [r.__dict__ for r in results],
    }

    report_path = Path(args.report).resolve()
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    print(
        f"done candidates={summary['total_candidates']} updated={summary['updated']} "
        f"dry_run={summary['dry_run']} unchanged={summary['unchanged']} failed={summary['failed']}"
    )
    print(f"report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
