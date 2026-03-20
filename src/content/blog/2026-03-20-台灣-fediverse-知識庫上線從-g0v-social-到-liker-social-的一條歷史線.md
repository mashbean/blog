---
title: 台灣 fediverse 知識庫上線：補上一條從 g0v.social 到 liker.social 的歷史線
description: >-
  我把台灣 fediverse 的站台、relay、ActivityPub 網站、在地文章與 liker.social 的興亡整理成一份公開知識庫，也補上
  MIT License。
lead: 我把台灣 fediverse 的清單整理成一個知識庫入口，也把 liker.social 這段快被忘掉的華文聯邦宇宙歷史補了回來。
pubDate: '2026-03-20T02:00:00.000Z'
tags:
  - 公共網路
  - fediverse
  - 台灣
  - Mastodon
  - Misskey
  - LikeCoin
  - liker.social
category: blog
author: mashbean
source: mashbean.net
contentType: article
era: recent
draft: false
coverAlt: 台灣 fediverse 知識庫與 liker.social 歷史線封面圖
cover: >-
  images/covers/home/2026-03-20-台灣-fediverse-知識庫上線從-g0v-social-到-liker-social-的一條歷史線.jpg
coverPrompt: >-
  editorial gouache illustration, overhead view, centered on a clearly
  recognizable map of Taiwan pinned to a research board, five bright node
  markers on the island connected by curved relay arcs and dotted federation
  lines, small paper cards around the map showing different fediverse formats
  such as short posts, forum threads, video windows, and blog pages, one corner
  includes cables and a compact home server, another corner shows faded archived
  social cards and a dim coin-like emblem disappearing into dust to represent
  the lost history of liker.social and LikeCoin, visual mood of reconstructing
  internet history from scattered evidence, calm but investigative, precise
  composition, no characters, no animals, no mascots, no text
coverNegativePrompt: >-
  text, typography, letters, watermark, logo, signature, caption, people, faces,
  hands, animals, birds, foxes, pigs, cats, mascots, character illustration,
  generic abstract geometry, empty pastel background, space scene, globe,
  photorealistic, 3d render, UI screenshot, low contrast, cluttered composition,
  random social media icons
contentHash: '0xbda820d398ef85b845e270f0026aa3b0acf5e36291c868e481f20e1147930342'
signature: >-
  0x6ba3b3d8064201613ee333133427dc2cdfed9e78960ba9b71f3a8ce88557ce054b146c5068776049eff4c723c62365b409969e14d349854e7639fbfaa46c394b1c
signer: '0x024c8Cdea6b98Af3E999F1b0110643d4040aDc44'
signatureVersion: mashbean.article.v1
---

> 我把台灣 fediverse 的地圖重畫了一次。這次整理的，不只是哪裡還有站，更是哪些歷史正在從公開網頁上消失。

> 這篇文章、對應封面圖、repo 更新、語料回寫與 blog 上稿，這次都是沿著既有 pipeline 由 AI 代理自動完成。我提供的是主題、要求與最後校對方向。

最近我更新了 GitHub 上的 [awesome-fediverse-in-taiwan](https://github.com/mashbean/awesome-fediverse-in-taiwan)。原本這個 repo 比較像一份短清單，這次我把它往知識庫入口推進一步。除了台灣常見的 Mastodon 與 Misskey 站台，我也補進其他聯邦服務、relay、台灣相關的 ActivityPub 網站、在地延伸閱讀，以及一份專門整理背景脈絡的文件。

我想處理的其實只有一件事，把台灣 fediverse 重新編目，讓它至少有一個還能用的公開入口。

## 為什麼要把清單升級成知識庫

台灣社群對 fediverse 並不陌生，但相關資料長期散在幾種地方，像是站長自介頁、某次難民潮期間的貼文、很早以前留下來的 wiki 或整理文。這些資料都很珍貴，也都很容易過期。站台的註冊狀態會變，relay 的服務對象常常沒再標註，重要文章明明還在，新讀者卻不知道去哪裡找。

所以這次我做的事情很簡單，就是重新整理入口，讓剛接觸的人知道從哪裡開始，也讓已經在使用的人看見台灣這邊累積了哪些站台、基礎設施與討論脈絡。

這次整理後，repo 分成兩層。

- [README](https://github.com/mashbean/awesome-fediverse-in-taiwan) 作為入口頁
- [`docs/taiwan-context.md`](https://github.com/mashbean/awesome-fediverse-in-taiwan/blob/main/docs/taiwan-context.md) 放比較長的背景整理

我也把授權補成 MIT，之後不管是 fork、改寫還是擴充，都會單純很多。

## 台灣 fediverse 現在長什麼樣子

如果只問台灣有沒有 Mastodon 站，答案當然是有，而且不只一個。但把視野拉開之後，台灣 fediverse 比較像幾層結構疊在一起。

第一層是綜合社群站台，例如 [g0v.social](https://g0v.social)、[klog.tw](https://klog.tw)、[taiwan.wtf](https://taiwan.wtf)、[mistyreverie.org](https://mistyreverie.org)、[social.slat.org](https://social.slat.org)。它們的氣質差很多，從公民科技、自由軟體到次文化與日常聊天都有。把它們放在一起看，很容易發現台灣 fediverse 一直都不是單一社群。

第二層是短文社群之外的服務，例如 [peertube.slat.org](https://peertube.slat.org) 與 [lemmy.mistyreverie.org](https://lemmy.mistyreverie.org)。這兩個節點提醒我們，fediverse 不只是 Twitter 替代品，也包括影音分發、論壇討論與其他內容形態。

第三層是 relay。這次我保留並補註了 [relay-tw.seediqbale.xyz](https://relay-tw.seediqbale.xyz/)、[relay.mistyreverie.org](https://relay.mistyreverie.org/) 與 [pass.zeroplex.tw](https://pass.zeroplex.tw/)。這些東西平常不顯眼，但它們實際影響內容怎麼流動、哪些語言社群彼此看得到。尤其 `relay-tw.seediqbale.xyz` 明確以繁體中文與 Tâi-gí 為主，這種在地性本身就值得被記錄。

第四層是小型服務與 ActivityPub 網站。像 [social.zeroplex.tw](https://social.zeroplex.tw) 這類封閉註冊或小型節點，我沒有硬塞進主列表，但也不想讓它們從記錄裡消失。這次我也補了像 [taiwanquest.com](https://taiwanquest.com) 與 [taiwanltri.wordpress.com](https://taiwanltri.wordpress.com) 這類台灣相關的聯邦網站。這一層的意義很清楚，fediverse 不只是一串社群站網址，也是一種網路出版與分發基礎設施。

## 為什麼 liker.social 也該寫進去

這次我另外補了一段 [liker.social 的興亡](https://github.com/mashbean/awesome-fediverse-in-taiwan/blob/main/docs/taiwan-context.md#likersocial-%E7%9A%84%E8%88%88%E4%BA%A1)。

乍看之下，它和台灣沒有那麼直接的關係，核心脈絡比較接近香港與 LikeCoin 生態。但如果把範圍放回華文 fediverse 的歷史，`liker.social` 很難跳過。它代表的是另一條曾經很有企圖心的路線，把聯邦社群、內容經濟、出版憑證、Writing NFT 與獎勵機制接成一套產品。

這件事之所以重要，有三個理由。

第一，`liker.social` 證明華文世界曾經有人很認真地想把出版帶進 fediverse。那個問題意識不是單純做社群站，而是想處理內容、分發、身份與獎勵怎麼接在一起。

第二，它也說明 fediverse 與 Web3 並不是從來沒有交會。至少在某個時間點，兩邊確實曾經在產品層碰過面。對台灣來說，這條線並不陌生，因為台灣這幾年剛好也處在公民科技、Web3、公共財與平台替代方案交疊的位置。

第三，它的消失本身就是歷史。我在 2026 年 3 月 20 日重新檢查時，`https://liker.social` 主網域已經無法解析，以 FediDB API 搜尋也查不到現役站點資料。這類實驗若沒有被記下來，之後就只會剩下模糊印象。

## liker.social 的式微，也反映了 LikeCoin 生態的轉向

整理資料時，我另一個很深的感受，是官方敘事已經很明顯地移動了。現在 LikeCoin 相關文件仍保留 Liker.Social 頁面，但也清楚標示那對應的是 LikeCoin v2 與 Liker Land 的舊架構，同時把讀者導向新的 v3 脈絡。

這代表一件事，當年那套把出版型社交、鏈上身份、創作者激勵與聯邦短文服務綁在一起的產品組合，後來沒有延續下去。從外面看，像是一個站點消失。放回脈絡裡看，則比較像一次產品路線的切換。

這段歷史對台灣社群很值得參考，因為我們也一直在處理同一個問題，在不把自己交給單一平台的前提下，內容、社群、發行、保存與資助要怎麼接起來。

## 這次也是一條 AI 全自動流程

這篇文章本身，也是一次 AI 代理工作流的產物。

我先給了一個目標，要把台灣 fediverse 的清單整理成知識庫，補上 liker.social 的歷史，寫進 repo，補授權，最後再轉成部落格文章。後面的工作流程，則是沿著既有專案工具一路往下接。

- 上網核對站台、relay、文章與 liker.social 舊文件
- 更新 `awesome-fediverse-in-taiwan` repo 與 `docs/taiwan-context.md`
- 補上 MIT License
- 轉寫成長文，放進 blog 的 `src/content/blog`
- 依照 blog 既有 pipeline 生成封面圖、回寫 frontmatter、做文章簽章
- 重建 RAG corpus，讓這篇文進入後續語料

對我來說，這件事有意思的地方不只是效率，而是它證明了現在的個人出版流程已經開始出現新的可組裝性。整理資料、驗證來源、產文、做圖、簽章、知識庫與語料更新，原本是很多段彼此分離的工序，現在可以被串成一條比較完整的工作流。

這也剛好呼應 fediverse 本身的精神。不是把所有東西交給單一平台，而是把不同能力拆成可替換的節點，再靠協定與流程把它們接起來。

## 我這次最在意的是什麼

不是多補了幾個網址。

我最在意的是，至少有一份公開文件開始把這些東西放在同一張桌子上，台灣的 Mastodon 與 Misskey 站台、中文 relay、台灣組織經營的 PeerTube、聯邦論壇服務、台灣相關 ActivityPub 網站、在地文章，以及 `liker.social` 這種華文世界的重要前例。

當這些東西被放在一起，台灣 fediverse 才比較看得出一條歷史線。它不是突然冒出來的，也不是只有在某次平台危機時才被想起。它一直都長在公民科技、自由軟體、獨立出版、中文社群治理與平台替代方案的交界。

## 結語

台灣網路世界很可惜的一點，是很多重要實驗確實發生過，卻沒有被好好整理。fediverse 也是一樣。

有人架站，有人維護 relay，有人翻譯文件，有人寫入門文，也有人試著把出版、社群與代幣獎勵接在一起。這些努力未必完全同路，但合在一起看，就是華文世界尋找平台替代方案的一段歷史。

這次把 `awesome-fediverse-in-taiwan` 擴成知識庫，只是很小的一步。至少從現在開始，若有人想問台灣 fediverse 到底有什麼、`liker.social` 當年是什麼、Mastodon 之外還有哪些基礎設施，已經有一個公開入口可以開始看。

如果你也知道還沒被寫進去的台灣站台、relay、文章、組織，或任何值得留下來的華文聯邦宇宙歷史，歡迎直接到 repo 補上。

- [awesome-fediverse-in-taiwan](https://github.com/mashbean/awesome-fediverse-in-taiwan)
- [台灣與聯邦宇宙背景整理](https://github.com/mashbean/awesome-fediverse-in-taiwan/blob/main/docs/taiwan-context.md)
- [liker.social 的興亡](https://github.com/mashbean/awesome-fediverse-in-taiwan/blob/main/docs/taiwan-context.md#likersocial-%E7%9A%84%E8%88%88%E4%BA%A1)
