# Web3 IPFS Publish Runbook

## 目的
- 將 `dist/` 發布到 IPFS（Pinata）。
- 保存 `release -> CID` 對照，供回滾與稽核。

## 必要環境變數
```bash
export IPFS_PINATA_JWT="<pinata-jwt>"
```

## 快速流程
1. Build 靜態站
```bash
npm run build
```
2. Dry run（不送出上傳）
```bash
npm run web3:ipfs:publish:dry
```
3. 正式發布到 IPFS
```bash
npm run web3:ipfs:publish
```

## Pinata file limit 方案（推薦）
- 若 Pinata 方案有 files 上限，可使用 compact 發布版：
  - 移除 `pagefind/`
  - 只保留 canonical 文章路由（`/blog/YYYY/MMDD-xxxxxx/`）

```bash
npm run web3:build:ipfs
npm run web3:ipfs:publish -- --dist dist-ipfs
```

或一鍵執行：
```bash
npm run web3:ipfs:publish:compact
```

## 輸出與紀錄
- 正式發布後，會寫入 `/Users/mashbean/Codex/docs/web3-ipfs-releases.json`。
- 每筆紀錄包含：
  - `releaseId`
  - `gitSha`
  - `cid`
  - `pinSize`
  - `gatewayUrl`
  - `distDigest`

## 常用參數
```bash
node scripts/web3-publish-ipfs.mjs --dry-run
node scripts/web3-publish-ipfs.mjs --dist dist --record docs/web3-ipfs-releases.json
node scripts/web3-publish-ipfs.mjs --max-retries 5 --retry-ms 2000
```

## 失敗排查
- `Missing IPFS_PINATA_JWT env var`
  - 未設定 Pinata token。
- `Dist directory not found`
  - 尚未 `npm run build`。
- `Pinata upload failed (...)`
  - API 權限不足、流量限制、網路問題；可提高 `--max-retries`。
