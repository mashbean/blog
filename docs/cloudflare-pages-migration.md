# 把 mashbean.net 從 GitHub Pages 換到 Cloudflare（Git 整合）

目標：hosting 從 GitHub Pages 換成 Cloudflare，由 Cloudflare 直接連 `mashbean/blog`、
每次 push 自動 build + deploy。採 **Workers 靜態資產（static assets）** 模式。

## 架構

- Cloudflare「Workers Build」連 GitHub repo `mashbean/blog`，production branch = `main`。
- 組建命令 `npm run build`；部署命令 `npx wrangler deploy`。
- [wrangler.jsonc](../wrangler.jsonc) 把 `./dist` 宣告成靜態資產（不需要 Worker 程式碼）。
- 不需要 GitHub Actions、不需要 API token（CF 用自己的 build token）。

> 為什麼不是 Pages：純靜態其實用 Pages 也行，但你已經在 dashboard 開了 Workers 專案，
> Workers 靜態資產是 Cloudflare 現在主推的方向，沿用即可。

## 一次性設定

### 1. 建置變數（Settings → Variables / 建置變數）

在 Cloudflare 專案 `mashbean-blog` 設定這些 **build 環境變數**（都不是機密）：

| 變數 | 值 |
|---|---|
| `SITE_URL` | `https://mashbean.net` |
| `BASE_PATH` | `/` |
| `PUBLIC_TIP_ENS_NAME` | `mashbean.eth` |
| `PUBLIC_TIP_ADDRESS` | `0xab51AD23d222fD0afB4e29F3244402af9aa3C420` |
| `PUBLIC_WEB3_CHAIN_ID` | `1` |
| `PUBLIC_WEB3_RPC_URL` | `https://ethereum.publicnode.com` |
| `BUILD_CONCURRENCY` | `4` |
| `PUBLIC_PLAUSIBLE_DOMAIN` | `mashbean.net` |
| `PUBLIC_PLAUSIBLE_SCRIPT_SRC` | `https://plausible.io/js/script.js` |

沒設前兩個 + web3 那組，`npm run build` 會在 Web3TipJar 直接 crash。

### 2. 把程式碼合進 main

CF 是 build `main` 分支。B+D 加速、`wrangler.jsonc`、WIP 都在 `cf-pages-migration` 分支，
透過 PR 合進 main 後，CF 才會 build 到正確的程式碼。

### 3. 驗證

合併後 CF 自動 build + deploy，到 `mashbean-blog.<你的子網域>.workers.dev` 確認：
首頁、文章、`/facebook/...`、搜尋、舊網址轉址、web3 抖內/簽章都正常。

### 4. 掛上 mashbean.net（正式切換）

專案 → Settings → **Domains & Routes** → 加 custom domain `mashbean.net`。
zone 已在 Cloudflare，會自動處理 DNS 與憑證，把流量從 GitHub Pages 換到這個 Worker。

### 5. 退役 GitHub Pages

確認 mashbean.net 由 Cloudflare 正常服務後，停用 [deploy.yml](../.github/workflows/deploy.yml)
（改成只剩 `workflow_dispatch` 或刪除），並在 GitHub repo Settings → Pages 關閉。
`public/CNAME` 是 GitHub Pages 用的，Cloudflare 忽略它，留著無害。

## 不受影響

- IPFS/IPNS/ENS 的 [auto-ipfs-ipns.yml](../.github/workflows/auto-ipfs-ipns.yml) 與 hosting 無關，照舊。
- 先前為了測試設的 GitHub secret `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID` 在 Git 整合下用不到，
  可留可刪。

## Rollback

- 專案 → Deployments → 任一過去版本 **Rollback**（即時）。
- 最壞情況：把 custom domain 從 Worker 移除、DNS 指回 GitHub Pages。
