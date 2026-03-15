# Pending Commit Triage（2026-02-28）

## 已完成
- `chore: remove duplicate matters esim import`
  - 已提交：刪除重複匯入的 `Matters eSIM` 文章

## Bundle A: 發布與檢查工具鏈
- `package.json`
- `package-lock.json`
- `README.md`
- `scripts/benchmark-search-index.mjs`
- `scripts/check-content-ids.mjs`
- `scripts/export-mermaid-diagrams.mjs`
- `scripts/meet_summary_to_gdocs.py`
- `scripts/publish-post.mjs`
- `scripts/render-home-covers-a1111.mjs`
- `scripts/render-home-covers-openai.mjs`

說明：
- 這一組是同一套工具鏈，`package.json` 已經引用這些腳本。
- 如果要提交 `package.json/package-lock.json`，建議連同這些腳本一起進同一個 commit。

建議 commit message：
```bash
chore: add publishing and diagnostics tooling
```

## Bundle B: 操作文件與流程文件
- `docs/adr/ADR-0001-newsletter-provider-selection.md`
- `docs/google-meet-summary-to-gdocs.md`
- `docs/incident-playbook.md`
- `docs/preview-workflow.md`
- `docs/release-checklist.md`
- `docs/visual-guidelines.md`

說明：
- 這些是文件，不影響站點 runtime。
- 可以獨立成 docs commit，不要和工具/內容混在一起。

建議 commit message：
```bash
docs: add workflow and operations references
```

## Bundle C: 首頁封面與生圖調校
- `public/images/covers/home/2026-02-22-bonds-litepaper-og-image.jpg`
- `public/images/site-thumb.png`
- `scripts/generate-home-covers-diffusion.mjs`
- `scripts/generate-latest-cover-openai.mjs`
- `scripts/home-cover-prompts.json`
- `public/images/diagrams/blog/2026-02-26-一週重啟部落格編年記.png`
- `public/images/diagrams/manifest.json`

說明：
- 這一組是首頁視覺/生圖流程與示例輸出。
- 建議在確認封面視覺真的要保留後再提交。

建議 commit message：
```bash
feat: refine cover generation prompts and preview assets
```

## Bundle D: 鏈上發布紀錄
- `docs/web3-ipfs-releases.json`

說明：
- 這是運營紀錄，不應混入上面三組。
- 若你想保留部署歷史，可單獨提交；若不想讓 repo 累積噪音，可考慮不提交。

## 暫不建議提交
- `docs/pending-commit-triage-2026-02-28.md`

說明：
- 這份只是整理筆記，完成後可刪或留本地。

## 建議順序
1. Bundle A
2. Bundle B
3. Bundle C
4. Bundle D（可選）
