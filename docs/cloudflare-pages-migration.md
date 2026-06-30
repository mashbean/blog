# 從 GitHub Pages 遷移到 Cloudflare Pages

目標：把 mashbean.net 的 hosting 從 GitHub Pages 換成 Cloudflare Pages。
建置仍留在 GitHub Actions（保留 build 加速），改用 `wrangler pages deploy` 上傳。

## 為什麼

- **增量上傳**：wrangler 只上傳「內容雜湊有變」的檔案，其餘伺服器端去重。整站重建後，實際上傳的只有改動的頁，部署很快。
- **atomic 部署 + 即時 rollback**：每次部署是一個不可變版本，壞了一鍵回滾。
- **每個 branch/PR 有 preview URL**：發文前可先在預覽網址看成品。
- mashbean.net 的 DNS **已經在 Cloudflare**（nameserver 是 `*.ns.cloudflare.com`），所以**不用改 nameserver**，custom domain 一步搞定。

目前狀態：Cloudflare proxy → GitHub Pages（origin 仍是 GitHub，回應帶 `x-github-request-id`）。
遷移後：Cloudflare Pages 直接當 origin。

## 前置：建立 API token 與 repo secrets

1. Cloudflare Dashboard → My Profile → **API Tokens** → Create Token →
   用 **Custom token**，權限給：
   - **Account › Cloudflare Pages › Edit**
   （只要這一項就夠 direct upload；不需要 Zone 權限。）
2. 記下你的 **Account ID**（Dashboard 右側欄，或 `npx wrangler whoami`）。
3. 到 GitHub repo `mashbean/blog` → Settings → Secrets and variables → Actions →
   新增兩個 secret：
   - `CLOUDFLARE_API_TOKEN` = 上面建立的 token
   - `CLOUDFLARE_ACCOUNT_ID` = 你的 Account ID

## 步驟一：建立 Pages 專案

擇一：

- **Dashboard**：Workers & Pages → Create → Pages → **Direct Upload** → 專案名稱填
  `mashbean-blog`（要與 workflow 裡的 `--project-name` 一致）→ production branch 設 `main`。
- 或 CLI（本機，已登入 `npx wrangler login`）：
  ```bash
  npx wrangler pages project create mashbean-blog --production-branch=main
  ```

> 專案名稱若想換，記得同步改 [deploy.cloudflare-pages.yml](../.github/workflows/deploy.cloudflare-pages.yml) 的 `--project-name`。

## 步驟二：第一次部署並驗證

GitHub → Actions → **Deploy to Cloudflare Pages** → Run workflow（手動觸發）。
跑完後到 Pages 專案頁拿到 `mashbean-blog.pages.dev`，確認：

- 首頁、幾篇文章、`/facebook/...`、搜尋（Pagefind）、舊網址自動轉址（LegacyRedirect）都正常。
- web3 抖內、簽章徽章正常（env 變數有帶進來）。

## 步驟三：掛上 mashbean.net（正式切換）

在 Pages 專案 → **Custom domains** → Set up a custom domain → 輸入 `mashbean.net`
（若有用 `www` 再加一個）。因為 zone 已在 Cloudflare，它會自動建立/調整 DNS 記錄並簽憑證。

> 這一步會把線上流量的 origin 從 GitHub Pages 換成 Cloudflare Pages。切換前舊站照常服務，
> custom domain 生效後即接管。

## 步驟四：退役 GitHub Pages 部署

確認 mashbean.net 由 Pages 正常服務後：

1. 把 [deploy.cloudflare-pages.yml](../.github/workflows/deploy.cloudflare-pages.yml) 的觸發改成 push：
   ```yaml
   on:
     push:
       branches: ["main"]
     workflow_dispatch:
   ```
2. 停用舊的 [deploy.yml](../.github/workflows/deploy.yml)（刪除，或把 `on:` 改成只剩
   `workflow_dispatch`），避免兩套部署互打。
3. GitHub repo → Settings → Pages 可關閉 GitHub Pages。
4. `public/CNAME`（內容 `mashbean.net`）是 GitHub Pages 用的，Cloudflare Pages 會忽略它，
   留著無害；要清乾淨也可刪。

## 不受影響

- **IPFS/IPNS/ENS** 的 [auto-ipfs-ipns.yml](../.github/workflows/auto-ipfs-ipns.yml) 與 hosting 無關，照舊。
- 內容、簽章、web3 設定都不變。

## Rollback

- Pages 專案 → Deployments → 對任一過去版本按 **Rollback**（即時）。
- 或最壞情況：把 custom domain 從 Pages 移除、DNS 指回 GitHub Pages，舊流程仍在。

## 之後可選的加分項（非必要）

- `public/_headers`：對 `/_astro/*`（檔名帶 hash 的不可變資產）加
  `Cache-Control: public, max-age=31536000, immutable`，加快回訪。
- `public/_redirects`：可把 LegacyRedirect 的 HTML 轉址頁，改成 Cloudflare 邊緣的 301
  （連那 ~1,400 個 stub 都不用建置），但需要把舊→新網址對應導出成清單，列為後續優化。
