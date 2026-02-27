# Facebook 匯入上線範圍與 Git 流程

## Repo 邊界
- 正式部落格 repo：`/Users/mashbean/Codex/Blog`
- 本地工作資料（不會進這個 repo）：`/Users/mashbean/Codex/FB Post Archive`、`/Users/mashbean/Codex/output`

## 目前分支策略
- 功能分支：`codex/fb-archive-rollout`
- `main` 只收 PR merge，不直接開發。

## 要上 GitHub（可部署）
- 內容：`src/content/facebook/**`
- 臉書圖片：`public/images/facebook/**`
- 臉書頁面與資料流程：
  - `src/pages/facebook/**`
  - `src/pages/blog/facebook/**`
  - `src/utils/facebook.ts`
  - `src/pages/search*.ts|astro`
  - `src/pages/tags*.astro`
  - `src/pages/content-index.json.ts`
  - `src/content.config.ts`
- 必要共用 UI/樣式：`src/components/**`、`src/layouts/**`、`src/styles/**`、`src/scripts/site-behaviors.ts`

## 不要上 GitHub（本地輔助/產物）
- 匯出原始資料、人工審稿 CSV、批次暫存、地端審稿工具
- 建置產物與暫存：`dist/`、`dist-ipfs/`、`tmp/`、`reports/`
- 本地殘留：`*.swp`、`node_modules_root_residual/`

## 提交前檢查
1. 僅看本次要提交的檔案：
```bash
git diff --name-only
```
2. 只暫存要上線檔案（範例）：
```bash
git add .gitignore package.json package-lock.json
git add src/content.config.ts src/content/facebook public/images/facebook
git add src/pages/facebook src/pages/blog/facebook src/utils/facebook.ts
git add src/pages/tags.astro src/pages/tags-graph.astro src/pages/search.astro src/pages/search-index.json.ts src/pages/content-index.json.ts
git add src/components/Header.astro src/layouts/BaseLayout.astro src/styles/global.css src/scripts/site-behaviors.ts
git add scripts/check-content-ids.mjs scripts/benchmark-search-index.mjs
```
3. 再確認 staged 清單：
```bash
git diff --cached --name-only
```

## Commit / Push / PR / Merge
1. Commit（建議拆 3 包）
```bash
git commit -m "chore: add facebook content id safety checks"
git commit -m "feat: import facebook archive content and assets"
git commit -m "feat: integrate facebook content into tags/search/graph ui"
```
2. Push 分支
```bash
git push -u origin codex/fb-archive-rollout
```
3. 開 PR：`codex/fb-archive-rollout -> main`
4. PR 檢查建議：
   - `npm run check:content-ids`
   - `npm run build`
   - 搜尋頁、標籤頁、單篇頁抽樣檢查
5. Merge 建議：`Squash and merge`（保留清楚訊息）

