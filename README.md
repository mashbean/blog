# Mashbean Blog (Astro)

內容型部落格範本（Astro + TypeScript + Tailwind + Markdown + GitHub Pages）。

這份 README 的目標是讓兩種讀者都能快速上手：
- 想 fork 後直接使用的人
- 會用 AI/Codex 協作維護的人

---

## 1. Tech Stack

- Astro 5
- TypeScript
- Tailwind CSS（v4 via `@tailwindcss/vite`）
- Content Collections（`src/content/blog/`）
- Pagefind（建置後搜尋索引）+ JSON fallback
- GitHub Actions 部署到 GitHub Pages
- Plausible（可選）

---

## 2. 專案結構（Source of Truth）

```text
src/
  content/blog/          # 唯一文章來源（Markdown/MDX）
  pages/                 # 路由頁面
  layouts/               # 版型
  components/            # 元件
  utils/                 # URL、標籤、日期等邏輯
public/                  # 靜態資源（圖片、favicon、og）
.github/workflows/       # GitHub Pages 部署流程
scripts/                 # 遷移、建置輔助、批次任務
```

重要原則：
- 文章只放 `src/content/blog/`
- 不要把 `dist/` 當內容來源
- `docs/blog-handover.md` 為交接補充文件

---

## 3. 快速開始（Fork 後 5 分鐘）

### 3.1 Fork + Clone

```bash
git clone https://github.com/<your-account>/<your-repo>.git
cd <your-repo>
npm install
```

### 3.2 本機開發

```bash
npm run dev
```

- 預設開 `http://localhost:4321`

### 3.3 驗證

```bash
npm run check
npm run build
```

---

## 4. 發文方式

新文章：新增到 `src/content/blog/`，例如：

```text
src/content/blog/2026-02-23-my-new-post.md
```

Frontmatter 範例：

```md
---
title: "你的文章標題"
description: "一句話摘要"
pubDate: "2026-02-23T09:00:00+08:00"
updatedDate: "2026-02-23T10:30:00+08:00"
draft: false
tags: ["公共網路"]
category: "blog"
cover: "/images/covers/example.png"
coverAlt: "封面說明"
lang: "zh-TW"
author: "Mashbean"
---

文章內文...
```

Schema 定義在：`src/content.config.ts`

---

## 5. 文章網址規則（SEO）

本站 canonical 文章路徑為短網址：

- `/blog/{year}/{monthday}-{code}/`
- 例：`/blog/2026/0222-14jmg4/`

相關邏輯：`src/utils/blog.ts`

備註：
- 舊網址可讀（legacy path）
- 但會標記 `noindex` 並導向 canonical

---

## 6. 搜尋系統

- 正常情況：Pagefind（建置後索引）
- 備援：JSON fallback（`/search-index.json`）

建置流程：
- `npm run build` 會觸發 `postbuild`，產生 Pagefind 索引

若 Pagefind 無法啟用，搜尋頁仍可用 fallback。

---

## 7. GitHub Pages 部署

部署檔案：`.github/workflows/deploy.yml`

目前策略：
- push 到 `main` 會自動部署
- GitHub Pages 來源應設為 **GitHub Actions**（不是 branch build）

### 7.1 User/Org 網站

- 網址型態：`https://<username>.github.io/`
- workflow env：
  - `SITE_URL=https://<username>.github.io`
  - `BASE_PATH=/`

### 7.2 Project 網站

- 網址型態：`https://<username>.github.io/<repo>/`
- workflow env：
  - `SITE_URL=https://<username>.github.io`
  - `BASE_PATH=/<repo>`

> `astro.config.ts` 會讀 `SITE_URL` 與 `BASE_PATH` 來設定 `site/base`。

### 7.3 Custom Domain

有自訂網域時：
- 保留 repo 根目錄 `CNAME`（例如 `mashbean.net`）
- `SITE_URL` 設成正式網域

---

## 8. Plausible（可選）

GitHub Variables（Repository -> Settings -> Secrets and variables -> Actions -> Variables）：

- `PUBLIC_PLAUSIBLE_DOMAIN`：例如 `mashbean.net`
- `PUBLIC_PLAUSIBLE_SCRIPT_SRC`：`https://plausible.io/js/script.js`

如果 script src 空值，瀏覽器會出現 `<script ... src></script>`，Plausible 會偵測失敗。

---

## 9. 常用指令

```bash
npm run dev            # 本機開發
npm run check          # Astro 型別/內容檢查
npm run build          # 正式建置（含 postbuild）
npm run preview        # 預覽 build 結果
npm run format         # 代碼格式化
npm run format:check   # 檢查格式
npm run lint           # check + format check
```

---

## 10. Jekyll 遷移

若你有舊 Jekyll `_posts`，可用：

```bash
npm run migrate:posts -- --source <jekyll_posts_dir> --dest src/content/blog
```

腳本：`scripts/migrate-jekyll-posts.mjs`

功能包含：
- frontmatter 欄位映射（date -> pubDate 等）
- `published: false` 轉 `draft: true`
- Liquid 語法偵測警告
- 轉換報告（成功/警告/失敗）

---

## 11. 給 AI/Codex 的協作規則

建議 AI 先讀這些檔案再動手：

1. `README.md`
2. `docs/blog-handover.md`
3. `src/content.config.ts`
4. `astro.config.ts`
5. `.github/workflows/deploy.yml`

協作約束（重要）：
- 只改有關需求的檔案，不要順手大改全站
- 不要把 `dist/`、暫存報告、個人憑證檔提交上版控
- 優先用 `npm run check` 驗證，再 push
- 若工作樹有 unrelated 變更，commit 時要精準 `git add <file>`

---

## 12. Troubleshooting

### Q1. 為什麼很多 Actions 是 cancelled？

通常是新版 commit 取代舊 run（正常）。
看「最新 commit 那一筆」是否 success 即可。

### Q2. 為什麼線上沒更新？

GitHub Pages + Actions 架構下，需等 workflow `deploy` 成功才會更新。

### Q3. 為什麼分享縮圖不對？

檢查：
- `src/site.config.ts` 的 `DEFAULT_OG_IMAGE`
- `public/images/` 圖檔是否存在
- 分享平台快取（可用 debugger 重新抓取）

### Q4. `npm run check` 找不到 `@astrojs/check`？

刪掉 `node_modules` 與 lock 後重裝：

```bash
rm -rf node_modules
npm install
```

---

## 13. 授權

- 程式碼：依本 repo 授權設定
- 文章內容：本站文章採 CC BY-NC 4.0（姓名標示-非商業性）

