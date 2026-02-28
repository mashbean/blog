#!/usr/bin/env python3
"""Transcribe meeting media, generate a fixed Markdown summary, and write to Google Docs."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


DEFAULT_DRIVE_FOLDER_NAME = "Altbase Fondation"
DEFAULT_SUMMARY_MODEL = "gpt-4.1-mini"


def _die(message: str, code: int = 1) -> None:
    print(f"Error: {message}", file=sys.stderr)
    raise SystemExit(code)


def _slugify(text: str) -> str:
    normalized = text.strip().lower()
    normalized = re.sub(r"[^a-z0-9\u4e00-\u9fff\s-]", "", normalized)
    normalized = re.sub(r"[\s_]+", "-", normalized)
    normalized = re.sub(r"-{2,}", "-", normalized).strip("-")
    return normalized or "meeting"


def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Transcribe meeting media and publish a fixed Markdown summary to Google Docs."
    )
    p.add_argument("media_file", help="Path to local audio/video file")
    p.add_argument("--title", help="Meeting title (default: media file stem)")
    p.add_argument(
        "--out-root",
        default="output/transcribe/meetings",
        help="Output root directory (default: output/transcribe/meetings)",
    )
    p.add_argument(
        "--folder-name",
        default=DEFAULT_DRIVE_FOLDER_NAME,
        help=f"Google Drive folder name in My Drive (default: {DEFAULT_DRIVE_FOLDER_NAME})",
    )
    p.add_argument("--folder-id", help="Google Drive folder ID (overrides --folder-name)")
    p.add_argument("--language", help="Optional language hint for transcription")
    p.add_argument(
        "--known-speaker",
        action="append",
        default=[],
        help="Known speaker reference as NAME=PATH (repeatable, max 4)",
    )
    p.add_argument(
        "--summary-model",
        default=DEFAULT_SUMMARY_MODEL,
        help=f"OpenAI model for summary generation (default: {DEFAULT_SUMMARY_MODEL})",
    )
    p.add_argument(
        "--skip-docs-upload",
        action="store_true",
        help="Generate transcript + markdown only, do not upload to Google Docs",
    )
    return p.parse_args()


def _find_transcribe_cli() -> Path:
    if os.getenv("TRANSCRIBE_CLI"):
        path = Path(os.environ["TRANSCRIBE_CLI"]).expanduser()
    else:
        codex_home = Path(os.getenv("CODEX_HOME", "~/.codex")).expanduser()
        path = codex_home / "skills" / "transcribe" / "scripts" / "transcribe_diarize.py"
    if not path.exists():
        _die(f"Transcribe CLI not found: {path}")
    return path


def _run_transcription(
    media_file: Path,
    out_dir: Path,
    language: str | None,
    known_speakers: list[str],
) -> Path:
    cli = _find_transcribe_cli()
    cmd = [
        "python3",
        str(cli),
        str(media_file),
        "--model",
        "gpt-4o-transcribe-diarize",
        "--response-format",
        "diarized_json",
        "--chunking-strategy",
        "auto",
        "--out-dir",
        str(out_dir),
    ]
    if language:
        cmd.extend(["--language", language])
    for item in known_speakers:
        cmd.extend(["--known-speaker", item])

    completed = subprocess.run(cmd, check=False, capture_output=True, text=True)
    if completed.returncode != 0:
        sys.stderr.write(completed.stdout)
        sys.stderr.write(completed.stderr)
        _die("Transcription failed.")

    expected = out_dir / f"{media_file.stem}.transcript.json"
    if expected.exists():
        return expected
    candidates = sorted(out_dir.glob("*.transcript.json"))
    if not candidates:
        _die(f"No transcript JSON found in {out_dir}")
    return candidates[0]


def _load_transcript(path: Path) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        _die(f"Failed to parse transcript JSON: {path} ({exc})")
    if "segments" not in data or not isinstance(data["segments"], list):
        _die("Transcript JSON does not include diarized segments.")
    return data


def _format_timestamp(seconds: float | int | None) -> str:
    if seconds is None:
        return "00:00"
    sec = max(int(float(seconds)), 0)
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)
    if h:
        return f"{h:02d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


def _build_clean_transcript(data: dict[str, Any]) -> tuple[str, list[str]]:
    merged: list[dict[str, Any]] = []
    speakers: set[str] = set()
    for segment in data.get("segments", []):
        if not isinstance(segment, dict):
            continue
        text = str(segment.get("text", "")).strip()
        speaker = str(segment.get("speaker", "Unknown")).strip() or "Unknown"
        start = segment.get("start")
        speakers.add(speaker)
        if not text:
            continue
        if merged and merged[-1]["speaker"] == speaker:
            merged[-1]["text"] = f'{merged[-1]["text"]} {text}'.strip()
            merged[-1]["end"] = segment.get("end", merged[-1]["end"])
            continue
        merged.append(
            {
                "speaker": speaker,
                "start": start,
                "end": segment.get("end"),
                "text": text,
            }
        )

    lines: list[str] = []
    for item in merged:
        ts = _format_timestamp(item["start"])
        lines.append(f'- [{ts}] Speaker {item["speaker"]}: {item["text"]}')
    return "\n".join(lines), sorted(speakers)


def _summarize_markdown(
    transcript_text: str,
    title: str,
    media_file: Path,
    transcript_path: Path,
    speakers: list[str],
    model: str,
) -> str:
    try:
        from openai import OpenAI
    except ImportError:
        _die("openai SDK not installed. Install with `python3 -m pip install openai`.")

    if not os.getenv("OPENAI_API_KEY"):
        _die("OPENAI_API_KEY is not set.")

    client = OpenAI()
    prompt = f"""
你是會議紀錄助理。請根據逐字稿輸出「固定格式」的繁體中文 Markdown。
請嚴格使用以下標題：

## 三行摘要
## 主要討論重點
## 決策事項
## 行動項目
## 風險與待確認

規則：
1. 內容需忠於逐字稿，不可臆測。
2. 每個區塊都要有內容；若逐字稿沒有明確資訊，請寫「未明確提及」。
3. 行動項目請用 `- [ ] 負責人｜任務｜截止日` 格式，未知欄位寫「未指派」或「未提供」。
4. 用精簡條列，不要冗長段落。
5. 不要輸出程式碼區塊。

會議標題：{title}
逐字稿如下：
{transcript_text}
""".strip()

    response = client.responses.create(
        model=model,
        input=prompt,
    )
    summary_body = (response.output_text or "").strip()
    if not summary_body:
        _die("Summary model returned empty output.")

    now = dt.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
    meta = [
        f"# Meeting Summary - {title}",
        "",
        "## Metadata",
        f"- Generated at: {now}",
        f"- Source media: {media_file}",
        f"- Transcript JSON: {transcript_path}",
        f"- Speakers detected: {', '.join(f'Speaker {s}' for s in speakers) if speakers else 'Unknown'}",
        "",
    ]
    transcript_block = [
        "## Clean Transcript",
        transcript_text if transcript_text else "- (empty transcript)",
        "",
    ]
    return "\n".join(meta) + "\n" + summary_body + "\n\n" + "\n".join(transcript_block)


def _load_google_credentials():
    try:
        from google.oauth2 import service_account
    except ImportError:
        _die(
            "google-auth not installed. Install with `python3 -m pip install google-auth google-api-python-client`."
        )
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path:
        _die("GOOGLE_APPLICATION_CREDENTIALS is not set.")
    path = Path(cred_path).expanduser()
    if not path.exists():
        _die(f"Google credentials file not found: {path}")
    scopes = [
        "https://www.googleapis.com/auth/documents",
        "https://www.googleapis.com/auth/drive",
    ]
    return service_account.Credentials.from_service_account_file(str(path), scopes=scopes)


def _build_google_clients(credentials):
    try:
        from googleapiclient.discovery import build
    except ImportError:
        _die(
            "google-api-python-client not installed. Install with `python3 -m pip install google-api-python-client`."
        )
    drive = build("drive", "v3", credentials=credentials)
    docs = build("docs", "v1", credentials=credentials)
    return drive, docs


def _find_drive_folder_id(drive: Any, folder_name: str) -> str:
    safe_name = folder_name.replace("'", "\\'")
    query = (
        "mimeType='application/vnd.google-apps.folder' "
        f"and name='{safe_name}' and trashed=false and 'root' in parents"
    )
    result = (
        drive.files()
        .list(q=query, spaces="drive", fields="files(id,name)", pageSize=10)
        .execute()
    )
    files = result.get("files", [])
    if not files:
        _die(
            f"Folder '{folder_name}' not found under My Drive root. "
            "Use --folder-id to specify it directly."
        )
    if len(files) > 1:
        print(f"Warning: multiple folders named '{folder_name}', using first match.", file=sys.stderr)
    return files[0]["id"]


def _upload_markdown_to_docs(
    markdown: str,
    title: str,
    folder_id: str,
    drive: Any,
    docs: Any,
) -> str:
    doc = docs.documents().create(body={"title": title}).execute()
    doc_id = doc["documentId"]

    docs.documents().batchUpdate(
        documentId=doc_id,
        body={"requests": [{"insertText": {"location": {"index": 1}, "text": markdown}}]},
    ).execute()

    try:
        drive.files().update(
            fileId=doc_id,
            addParents=folder_id,
            removeParents="root",
            fields="id,webViewLink,parents",
        ).execute()
    except Exception:
        drive.files().update(
            fileId=doc_id,
            addParents=folder_id,
            fields="id,webViewLink,parents",
        ).execute()

    file_meta = drive.files().get(fileId=doc_id, fields="webViewLink").execute()
    return file_meta["webViewLink"]


def main() -> int:
    args = _parse_args()
    media_file = Path(args.media_file).expanduser().resolve()
    if not media_file.exists():
        _die(f"Media file not found: {media_file}")
    if not os.getenv("OPENAI_API_KEY"):
        _die("OPENAI_API_KEY is not set.")

    title = args.title.strip() if args.title else media_file.stem
    timestamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    job_id = f"{timestamp}-{_slugify(title)}"
    out_dir = Path(args.out_root).expanduser().resolve() / job_id
    out_dir.mkdir(parents=True, exist_ok=True)

    transcript_path = _run_transcription(media_file, out_dir, args.language, args.known_speaker)
    transcript_data = _load_transcript(transcript_path)
    clean_transcript, speakers = _build_clean_transcript(transcript_data)

    markdown = _summarize_markdown(
        transcript_text=clean_transcript,
        title=title,
        media_file=media_file,
        transcript_path=transcript_path,
        speakers=speakers,
        model=args.summary_model,
    )

    md_path = out_dir / "meeting-summary.md"
    md_path.write_text(markdown, encoding="utf-8")
    print(f"[ok] markdown: {md_path}")

    if args.skip_docs_upload:
        print("[ok] docs upload skipped (--skip-docs-upload)")
        return 0

    credentials = _load_google_credentials()
    drive, docs = _build_google_clients(credentials)
    folder_id = args.folder_id or _find_drive_folder_id(drive, args.folder_name)
    doc_link = _upload_markdown_to_docs(markdown, f"{title} - Meeting Summary", folder_id, drive, docs)
    print(f"[ok] google_doc: {doc_link}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
