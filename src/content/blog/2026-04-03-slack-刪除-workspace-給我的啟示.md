---
title: Slack 刪除 Workspace 給我的啟示
description: Slack 近日無預警刪除多個 Workspace，讓我再次意識到全球 SaaS 服務仍深受地緣政治、合規風險與平台治理邏輯支配。
lead: 當組織的資料、互動紀錄與聯絡方式都託管在他人的基礎設施上，數位自主權就不只是理想，而是非常實際的韌性問題。
pubDate: '2026-04-03T11:20:00+08:00'
tags:
  - 數位自主
  - 公共網路
  - SaaS
  - Slack
category: blog
coverPreset: editorialResearch
coverPrompt: >-
  editorial gouache illustration, layered paper collage, serious research essay
  cover about a deleted team communication workspace, broken chat windows,
  missing folders, disconnected member nodes, refund receipt, compliance notice
  cards, cloud infrastructure map with one region abruptly crossed out, tense
  but controlled mood, warm paper texture, muted teal, rust, cream, and smoke
  gray palette, highly legible composition, no readable text, no typography, no
  logos
coverNegativePrompt: >-
  readable text, typography, letters, logo, watermark, signature, poster layout,
  photorealistic people, visible faces, mascots, cute animals, cheerful
  advertising mood, corporate stock photo style, UI screenshot, cluttered
  infographic, neon colors, 3d render
draft: false
cover: images/covers/home/2026-04-03-slack-刪除-workspace-給我的啟示.jpg
contentHash: '0x543526f3337b1c82de7948dbd9a7ef874fb3700796d3c3713a4b64e0d4b47234'
signature: >-
  0x9bbe96482d17a73dd6773b3967072210bfca39bdd97f5d0a665fbdaaf179514a55288a6e7ff6463973f2126d99b3c1a362cca2ebaa7b2c351d4fdd014d3e0e681c
signer: '0x024c8Cdea6b98Af3E999F1b0110643d4040aDc44'
signatureVersion: mashbean.article.v1
---

這兩天 Slack 忽然刪除了許多 Workspace，X 上災情一片，連有數千參與者的開源社群 OpenHands 也被波及，我服務的單位的 Slack Workspace 也無預警被刪除了。X 上有人說這是愚人節玩笑，也有人說這是 SaaS 服務的末日。

不過臉書上還沒看到太多人討論，可能是台灣因為前面有許多大大超前部署，所以沒有被波及到。經過交叉比對，這次被刪除的 Workspace 普遍有管理員或使用者 IP 從香港登入，這又連結到去年 11 月 Slack 的公告。

Slack 現在的老闆是老牌服務 Salesforce。Salesforce 在 2019 年與阿里巴巴合作時，官方曾明寫中國企業阿里巴巴會成為中港澳，以及台灣的 Salesforce 獨家供應方，並於 2023 年公開推出 Salesforce on Alibaba Cloud。

去年 2025 年 11 月，Slack 通知中港澳、台灣客戶要在 2026 年 2 月前把工作空間遷移到阿里巴巴，否則不再續約。這件事對台灣 Slack 使用者當然是敏感的，我記得 Ronny 當時還有跟官方確認台灣到底是否必須放到中國伺服器託管。

Salesforce 台灣在隔月，也就是 2025 年 12 月，向媒體 iThome 明確澄清，台灣 Slack 用戶使用的是全球服務，未被納入中國區，金流、資料與數據中心都與阿里雲無關。

我的服務單位註冊地當然不在中港澳，甚至也不在台灣，billing 當然也不是。當時我們還有向官方確認自己不再影響範圍內，後續官方也沒有再有回應。結果還是被刪，甚至前面幾天也沒有通知。

我看 X 上受波及的社群、公司，除了明顯是中文使用者，但顯然他們的單位也不在中港澳，還有法語、俄語、英語區域的組織工作空間被刪。交叉比對下來，可能是管理者與使用者有經過中港澳。

想了一個晚上，我覺得這題除了讓我更加厭惡 Slack，也讓我感受到全球軟體服務其實仍然被地緣政治宰制，或許以合規之名，行國安之實，只不過每個司法管轄區的國安都不一樣。幸好台灣朋友沒什麼人被影響。

我從來都沒有喜歡過 Slack 或 Notion 這類服務，每次要遷移或是找資料都神麻煩。但經歷過這次粗魯暴力的關停手法，我對於這類 SaaS 服務更加沒有好感了。他們可能有各種有苦難言的理由，但這種偵測 IP 刪除伺服器的行為，實在足夠引發公關災難。

目前的進度是事後只有退款，資料還沒救回來，這可是好幾年的資料。而目前看到有少數工作空間被恢復了。

## 全球軟體服務從來不是中性的

這二十年來有很多軟體服務被政治權力宰制的討論案例，包含微軟留在中國，Google 退出中國。軟體業要做全球的生意，不免犧牲少數人的權益，而且是付費的少數人。尤其是用演算法去清理門戶時，就更不會在乎少數人了。

這讓人不禁重新探討數位自主權的重要性。只要你的資料、後設資料、互動資訊託管在他人的基礎設施上，都有哪天因為更大的壓力而被關停的風險，即使有大企業的信譽也一樣。這次就有很多社群在吵，說他們的聯絡方式都放在 Slack，結果後面都無法聯繫其他貢獻者。

## 數位韌性不只是在講海纜

所以趁此為你的組織做個數位自主權的總體檢吧。台灣朋友可能更加需要，這也是數位韌性的一環，不只是海纜斷線、網速變慢，也該想想你的資料有沒有放在你身邊。

以上純粹是本人自由交叉比對河道資訊整理出來的資訊，只代表我自己，如有誤我會再主動更新。
