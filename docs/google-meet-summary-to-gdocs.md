# Google Meet Summary -> Google Docs

This flow transcribes a local Google Meet recording, generates a fixed Markdown summary, and writes it into Google Docs.

Default target folder in My Drive:
- `Altbase Fondation`

## 1) Install Python deps

```bash
python3 -m pip install openai google-auth google-api-python-client
```

## 2) Set env vars

```bash
export OPENAI_API_KEY="YOUR_KEY"
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
```

## 3) Share Drive folder with service account

Share your Google Drive folder `Altbase Fondation` with the service account email from the JSON key file (Editor permission).

## 4) Run

```bash
cd /Users/mashbean/Codex/Blog
npm run meeting:summary:gdocs -- "/absolute/path/to/meeting.mp4" --title "Weekly Sync"
```

## Useful options

- `--folder-name "Altbase Fondation"`: target folder name in My Drive root (default).
- `--folder-id "<drive_folder_id>"`: use folder ID directly (recommended if duplicate folder names exist).
- `--skip-docs-upload`: only generate local transcript and Markdown.
- `--language en`: pass language hint for transcription.
- `--known-speaker "Alice=/path/alice.wav"`: known speaker reference.

## Output

Local output path:
- `output/transcribe/meetings/<timestamp>-<title-slug>/`
  - `*.transcript.json`
  - `meeting-summary.md`

When Docs upload is enabled, the script also prints the Google Doc URL.
