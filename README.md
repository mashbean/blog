# GitHub Pages 極簡部落格（Jekyll）

這個專案採用 GitHub Pages 原生支援的 Jekyll，幾乎零設定即可上線。

## Astro 站點補充（現行）

### 啟用 Pagefind

1. 安裝依賴（本專案已含）：

```bash
npm install
```

2. 本機建置時會自動產生索引：

```bash
npm run build
```

3. 檢查是否成功：
   - 有 `dist/pagefind/` 目錄即代表索引已生成。
   - 若缺少 Pagefind binary，會自動回退到 JSON fallback 搜尋。

4. GitHub Actions 啟用重點：
   - workflow 必須跑 `npm ci` + `npm run build`
   - 不要跳過 `postbuild`（Pagefind 在 postbuild 執行）

### 文章網址規則（SEO）

- Canonical URL：`/blog/{year}/{monthday}-{code}/`
- 例如：`/blog/2025/0821-a1b2c3/`
- `code` 由文章 ID 產生短碼，固定且可重建（適合中文標題，不會出現過長 slug）
- 舊網址 `/blog/{legacy-id}/` 與前一版長網址仍可讀（頁面標記 noindex，canonical 指向新網址）

### 縮圖策略

- 有 `cover`：直接顯示文章縮圖（卡片與 Open Graph 優先使用）
- 無 `cover`：卡片改為「精簡橫幅 fallback」，避免首篇卡片出現突兀大空塊
- 全站社群預覽圖 fallback：`/images/og-image.png`

## 1) 建立 GitHub Repo

1. 到 GitHub 右上角 `+` -> `New repository`
2. Repository name 輸入（例如：`my-blog`）
3. `Public` 或 `Private` 都可以（GitHub Pages 兩者都支援）
4. 先不要勾 `Add a README file`（避免和本地衝突）
5. 按 `Create repository`
6. 建立後會看到 repo URL，像是：
   - HTTPS: `https://github.com/<username>/<repo>.git`
   - SSH: `git@github.com:<username>/<repo>.git`

## 1.1) 把本地專案 push 上去

在專案根目錄執行：

```bash
git init
git add .
git commit -m "init blog with jekyll blog skeleton"
git branch -M main
git remote add origin <你的-repo-url>
git push -u origin main
```

如果 `git commit` 提示沒有 user 設定，先執行：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的 GitHub 信箱"
```

如果 HTTPS push 要密碼，請改用 GitHub Personal Access Token 當密碼，或改用 SSH。

## 2) 開啟 GitHub Pages

1. 進入 GitHub repo 的 `Settings` -> `Pages`
2. `Build and deployment` 選 `Deploy from a branch`
3. Branch 選 `main`，資料夾選 `/ (root)`，按 Save
4. 等 1~3 分鐘後會得到網址：
   - 專案頁面：`https://<username>.github.io/<repo>/`
   - 如果 repo 名稱是 `<username>.github.io`，網址就是：`https://<username>.github.io/`

## 3) 發文規則（最重要）

- 文章放在 `_posts/`
- 檔名格式：`YYYY-MM-DD-文章-slug.md`
- 每篇檔案前面要有 Front Matter：

```md
---
title: "文章標題"
date: 2026-02-21 10:00:00 +0800
categories: [分類]
tags: [tag1, tag2]
---

這裡是內文
```

## 4) 你現有很多 Markdown，要怎麼搬？

本專案已提供批次轉換腳本：`scripts/convert_markdown_to_jekyll.py`

### 4.1 準備來源文章資料夾

假設你把舊文章放在 `raw_posts/`：

```bash
mkdir -p raw_posts
# 把你原本的 md 檔都放進 raw_posts/
```

### 4.2 先預覽（不寫入）

```bash
python3 scripts/convert_markdown_to_jekyll.py raw_posts --recursive --dry-run
```

### 4.3 正式轉換

```bash
python3 scripts/convert_markdown_to_jekyll.py raw_posts --recursive
```

### 4.4 轉換規則

- 來源副檔名：`.md`
- 目的地：`_posts/`
- 檔名：`YYYY-MM-DD-slug.md`
- `title` 優先順序：
  1. 原文 front matter 的 `title`
  2. 第一個 Markdown `# 標題`
  3. 原始檔名
- `date` 優先順序：
  1. 原文 front matter 的 `date`
  2. 檔名中的日期（例如 `2024-01-10-note.md`）
  3. 檔案最後修改日

### 4.5 常用選項

```bash
# 指定輸出資料夾
python3 scripts/convert_markdown_to_jekyll.py raw_posts --dest _posts

# 預設分類與標籤
python3 scripts/convert_markdown_to_jekyll.py raw_posts --category notes --tag tech

# 允許覆蓋同名檔案
python3 scripts/convert_markdown_to_jekyll.py raw_posts --overwrite
```

## 5) 一鍵部署（add + commit + pull --rebase + push）

已提供腳本：`scripts/deploy.sh`

```bash
# 使用預設 commit 訊息
./scripts/deploy.sh

# 自訂 commit 訊息
./scripts/deploy.sh "update posts and pages"
```

這個腳本會依序做：
1. `git add -A`
2. 如果有變更就 `git commit`
3. `git pull --rebase origin <目前分支>`
4. `git push origin <目前分支>`

## 6) 重建五大標籤系統

已提供腳本：`scripts/rebuild_tags.py`

```bash
# 只分析，不寫入
python3 scripts/rebuild_tags.py

# 套用到所有文章 front matter 的 tags
python3 scripts/rebuild_tags.py --apply
```

目前固定五大標籤：
- `NFT`
- `數位藝術`
- `治理與民主`
- `公共網路`
- `AI與科技`

標籤頁設定檔：
- `/tags.md`
- `/_data/tag_catalog.yml`

## 7) 批次產生一句話摘要（首頁 excerpt）

已提供腳本：`scripts/rebuild_summaries.py`

```bash
# 只分析，不寫入
python3 scripts/rebuild_summaries.py

# 套用到所有文章（寫入 summary 欄位）
python3 scripts/rebuild_summaries.py --apply
```

## 8) 從 Snapshot IPNS 匯出文章（Markdown + 純文字）

已提供腳本：`scripts/export_snapshot_articles.py`

```bash
# 使用你的 IPNS 網址，輸出到 snapshot_export/
python3 scripts/export_snapshot_articles.py \
  --ipns "ipns://storage.snapshot.page/registry/0xab51AD23d222fD0afB4e29F3244402af9aa3C420/mashbean.eth" \
  --out "snapshot_export"
```

若遇到憑證錯誤（`CERTIFICATE_VERIFY_FAILED`），可加上：

```bash
python3 scripts/export_snapshot_articles.py \
  --ipns "ipns://storage.snapshot.page/registry/0xab51AD23d222fD0afB4e29F3244402af9aa3C420/mashbean.eth" \
  --out "snapshot_export" \
  --insecure
```

若你的網路無法解析 `storage.snapshot.page`，可先取得入口 `index.json` 後用本機檔案跑：

```bash
python3 scripts/export_snapshot_articles.py \
  --ipns "ipns://storage.snapshot.page/registry/0xab51AD23d222fD0afB4e29F3244402af9aa3C420/mashbean.eth" \
  --index-file "/path/to/index.json" \
  --out "snapshot_export" \
  --insecure
```

輸出內容：
- `snapshot_export/markdown/`：可讀 Markdown 文章
- `snapshot_export/text/`：純文字版本
- `snapshot_export/raw/`：原始 IPFS 載荷（保留）
- `snapshot_export/index.json`：IPNS 入口資料
- `snapshot_export/cids.txt`：發現到的 CID 清單
- `snapshot_export/manifest.json`：抓取與解析摘要

## 9) 從 Matters 個人頁爬文章（Markdown + 純文字）

已提供腳本：`scripts/crawl_matters_articles.py`

先安裝依賴：

```bash
pip3 install playwright
playwright install chromium
```

執行（以你的帳號為例）：

```bash
python3 scripts/crawl_matters_articles.py \
  --profile-url "https://matters.town/@mashbean" \
  --out "matters_export"
```

若遇到部分文章只抓到 `matters.town` 驗證頁，可只補抓失敗項目：

```bash
python3 scripts/crawl_matters_articles.py \
  --profile-url "https://matters.town/@mashbean" \
  --out "matters_export" \
  --retry-from-manifest "matters_export/manifest.json" \
  --retry-attempts 8 \
  --challenge-wait 8 \
  --delay 0.8 \
  --headful
```

輸出內容：
- `matters_export/markdown/`：可讀 Markdown
- `matters_export/text/`：純文字版本
- `matters_export/manifest.json`：文章 URL 與檔案對照（含錯誤紀錄）

## 10) RSS 訂閱

已啟用 `jekyll-feed` 外掛，站上會產生：
- `/feed.xml`

你可以直接用以下網址訂閱：
- `https://mashbean.net/feed.xml`
