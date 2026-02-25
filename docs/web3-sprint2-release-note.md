# Web3 Sprint 2 Release Note

## 結論
- Sprint 2 已完成：IPFS/IPNS/ENS contenthash/.eth.limo 全流程已可執行，且已完成一輪上線演練。

## 本次演練（2026-02-25）
- Build + compact dist：`npm run web3:ipfs:publish:compact`
  - 結果：`dist-ipfs` 384 files（含 `blog/index.html`）。
- IPFS 發布（備援路徑）：
  - `ipfs add -Qr dist-ipfs`
  - CID：`QmQoH2xTRmqpW5zTN6rnwGfjY56zSN1U3Z7mLm6EfmepWT`
  - Pinata：`pinByHash` 成功（id: `2df63856-61ab-4135-a90e-4234cf2b3b45`）。
- IPNS 更新：
  - 命令：`npm run web3:ipns:update -- --cid QmQoH2xTRmqpW5zTN6rnwGfjY56zSN1U3Z7mLm6EfmepWT --key self`
  - IPNS：`k51qzi5uqu5dj88qpatq3fb4ns3rydcnho4j6jcqjpztyudroltdmlzes3ox2l`
  - 解析結果：`/ipfs/QmQoH2xTRmqpW5zTN6rnwGfjY56zSN1U3Z7mLm6EfmepWT`
- ENS contenthash 更新：
  - 命令：`npm run web3:ens:contenthash -- --name mashbean.eth --cid QmQoH2xTRmqpW5zTN6rnwGfjY56zSN1U3Z7mLm6EfmepWT`
  - txHash：`0x52d4e8fb4da593028a454506b10cca227428fd82088c4d25fbbfc63f34110f71`
  - block：`24532385`
  - contenthash：`0xe3010170122024898c3645323eb06dbb2ef5135cf9d2c349952c413e836d26e6874683ac6c50`
- .eth.limo 驗證：
  - `web3:healthcheck` 中 `ethLimo.status = 200`、`ethLimo.ok = true`
  - `https://mashbean.eth.limo/blog/` 可回傳文章列表 HTML（桌機與手機 UA 均可讀）。

## 快取生效窗口（本次測得）
- ENS 更新時間：`2026-02-25T07:18:21Z`
- `.eth.limo` 驗證成功時間（healthcheck）：`2026-02-25T07:24:05Z`
- 本次觀察窗口：約 6 分鐘內完成切版。

## 已知限制與風險
- Pinata `pinFileToIPFS` 目前對多檔目錄上傳回應：
  - `More than one file and/or directory was provided for pinning.`
- Pinata 配額限制已由腳本前置檢查擋下：
  - `current + next > limit` 會提前失敗並提示需先 unpin。
- `web3:healthcheck` 的 `gateway.pinata.cloud` 檢查可能出現 `403`（與 gateway 存取策略有關），不代表 IPNS/ENS/.eth.limo 失敗。

## 後續優化清單
- 把 `web3-publish-ipfs.mjs` 補上自動備援：
  - 當 `pinFileToIPFS` 失敗時，改走 `ipfs add -Qr` + `pinByHash`。
- 在 `web3-healthcheck.mjs` 增加可配置 gateway 列表（至少 2 個），避免單一 gateway 403 造成誤判。
- 增加固定輪詢腳本記錄 `.eth.limo` 切版延遲（輸出 JSON，便於長期追蹤）。
