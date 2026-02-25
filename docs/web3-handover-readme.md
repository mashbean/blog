# Web3 功能部署交接 README

## 文件目的
- 給未來維護者（人或機器）快速理解本專案的 Web3 功能與部署路徑。
- 降低重複踩坑機率，特別是 IPFS/IPNS/ENS/.eth.limo 的連動問題。

## 範圍（目前已做）
- 已完成：
  - 文章簽名驗證（前端驗簽 + 離線簽章腳本）
  - 打賞元件（文章頁）
  - IPFS 發布（含 compact dist）
  - IPNS 更新（`self` key）
  - ENS contenthash 更新
  - `.eth.limo` 可用性驗證
  - 文章 push 後自動 IPFS + IPNS 的 GitHub Actions
- 不在本期範圍：
  - SIWE
  - Lens
  - Arweave

## 核心架構
1. 內容來源：`src/content/blog/*.md`
2. 靜態建置：`npm run build` -> `dist/`
3. IPFS 發布版壓縮：`npm run web3:build:ipfs` -> `dist-ipfs/`
4. 發布 CID：
   - 主要：`web3:ipfs:publish`（Pinata）
   - 備援：`ipfs add -Qr dist-ipfs`
5. IPNS 更新：`npm run web3:ipns:update -- --cid <cid> --key self`
6. ENS contenthash：
   - 若指向 IPNS：`.eth.limo` 不換 CID 也可切新版本
   - 若指向 IPFS CID：每次發版都要改 ENS
7. 外部入口：`https://mashbean.eth.limo`

## 強制前提（不要跳過）
- 目錄必須在 repo 根：`/Users/mashbean/Codex/Blog`
- 需要環境變數：
  - `IPFS_PINATA_JWT`（若要 Pinata）
  - `PUBLIC_WEB3_RPC_URL`
  - `WEB3_SIGNER_PRIVATE_KEY`（更新 ENS 時）
- 建議先載入：
```bash
cd /Users/mashbean/Codex/Blog
set -a
source .env.local
set +a
```

## 日常最小操作（手動）
1. Build
```bash
npm run build
npm run web3:build:ipfs
```
2. 產生 CID（建議走本機 ipfs）
```bash
CID=$(ipfs add -Qr dist-ipfs)
echo "$CID"
```
3. 更新 IPNS
```bash
npm run web3:ipns:update -- --cid "$CID" --key self
```
4. 若 ENS 指 CID（非 IPNS），再更新 ENS
```bash
npm run web3:ens:contenthash -- --name mashbean.eth --cid "$CID"
```
5. 健康檢查
```bash
npm run web3:healthcheck
```

## 自動化流程（已上線）
- workflow：`.github/workflows/auto-ipfs-ipns.yml`
- 觸發：`main` 分支有文章或封面相關變更
- 流程：
  - build -> web3:build:ipfs -> `ipfs add -Qr dist-ipfs` -> `ipfs routing provide -r` -> `web3:ipns:update`
  - 若有 `IPFS_PINATA_JWT` secret，額外 `pinByHash`
- 重要：runner 必須是 `self-hosted`，且該機器要有可用的 IPFS repo 與 `self` key

## 已踩坑與警示（重點）

### 1) `npm error Missing script: "web3:ens:contenthash"`
- 原因：在錯誤目錄執行（例如 `/Users/mashbean/Codex`，不是 `/Users/mashbean/Codex/Blog`）。
- 排除：切到正確 repo 目錄，或使用 `npm --prefix /Users/mashbean/Codex/Blog run ...`。

### 2) `[web3-update-ens-contenthash] Missing PUBLIC_WEB3_RPC_URL env var`
- 原因：shell 沒有載入 `.env.local`。
- 排除：`set -a; source .env.local; set +a`。

### 3) Pinata 配額超限
- 典型錯誤：
  - `The number of files being added would exceed your account’s pin limit`
  - `current + next > limit`
- 排除：
  - 先 `unpin` 舊 CID
  - 或使用 compact 發布（`dist-ipfs`）
  - 優先使用本機 `ipfs add -Qr` + `pinByHash`，避免大目錄直傳失敗

### 4) Pinata `pinFileToIPFS` 多檔目錄錯誤
- 典型錯誤：`More than one file and/or directory was provided for pinning.`
- 排除：改走備援流程 `ipfs add -Qr dist-ipfs` 後 `pinByHash`。

### 5) `.eth.limo` 出現 `504 Content Unreachable`
- 常見原因：
  - CID 雖上鏈，但 provider 可達性不足
  - gateway 快取與傳播延遲
- 排除：
  - `ipfs routing provide -r <cid>`
  - 確認 IPNS resolve 與 ENS contenthash 一致
  - 等待 propagation（觀察過約數分鐘）

### 6) 文章列表頁消失
- 曾發生原因：compact prune 把 `blog/index.html` 刪掉。
- 已修正：`scripts/web3-build-ipfs-dist.mjs` 保留 `blog/index.html`。
- 若再發生：先檢查 `dist-ipfs/blog/index.html` 是否存在。

### 7) `web3:healthcheck` fail 但站點其實可用
- 曾見情況：`gateway.pinata.cloud` 回 `403`，但 IPNS/ENS/.eth.limo 正常。
- 建議判讀順序：
  1. `ipns.ok`
  2. `ensContenthash.ok`
  3. `ethLimo.ok`
  4. 最後才看單一 gateway 狀態

## Fork 專案前檢查清單
- [ ] 換成自己的 ENS 名稱（`PUBLIC_TIP_ENS_NAME`）
- [ ] 確認 ENS resolver 可寫入 contenthash
- [ ] 確認自己的 IPNS key（`ipfs key list`）
- [ ] `.env.local` / CI secrets 不可把私鑰寫入 git
- [ ] 先 dry-run 再 live run
- [ ] 至少保留一版可回滾 CID

## 建議的故障分流 SOP
1. 先查鏈上對不對：
   - ENS contenthash 是否指向預期 target
2. 再查 IPNS：
   - `ipfs name resolve /ipns/<name>`
3. 再查內容可達：
   - `ipfs ls /ipfs/<cid>`
4. 最後查 gateway：
   - `.eth.limo` / 其他 gateway

## 安全注意
- `WEB3_SIGNER_PRIVATE_KEY` 僅允許放本機 `.env.local` 或 CI secrets。
- 禁止 commit 私鑰、JWT、RPC keys。
- 發版腳本允許失敗時中止，不要強行繼續寫 ENS。

## 現況總結
- 本專案已具備「文章上線 -> IPFS/IPNS 更新 -> .eth.limo 可讀」的可重複流程。
- 風險最高區段是外部 gateway 與 Pinata 限制，不是鏈上更新本身。
