---
title: 哈佛 ASML 的 Keyring 錢包——一場押在「身份主權歸誰」的結構賭注
description: 哈佛 ASML 把選擇性揭露、Profile Badges 與 First-Person Credentials 三塊零件綁在社群平台的 profile 欄位旁邊，端出一個叫 Keyring 的錢包。這篇文章拆解它的技術血統、示範平台選擇，以及三個最脆弱的地方。
lead: 2026 年 4 月 16 日，哈佛 Applied Social Media Lab 發表了準備兩年的 Keyring。它組合了 W3C VC 2.0、SD-JWT、OpenWallet Bifold 與 First-Person Credentials，先從 Bluesky 下手，賭的是「身份主權歸誰」的結構戰。最硬的三個脆弱點，剛好對應社群層、商業層、工程層。
pubDate: '2026-04-20T12:00:00+08:00'
tags:
  - 數位身分
  - 隱私
  - 可驗證憑證
  - Bluesky
  - SSI
category: blog
author: mashbean
source: mashbean.net
---

# 哈佛 ASML 的 Keyring 錢包——一場押在「身份主權歸誰」的結構賭注

## 一、一勾難求的年代

2025 年 7 月 25 日，英國《Online Safety Act》上路。成人內容平台被要求驗證使用者的年齡。兩個月後，Proton 公布旗下 VPN 在英國的新註冊量暴增 1,400% 到 1,800%<sup>5</sup><sup>6</sup>。人們沒有乖乖上傳身份證，而是集體走進影子通道。

隔著大西洋，另一條身份線也在同一時期失控。X 的藍勾早已翻轉社會意義，從「經過驗證的身份」變成「月費訂閱」。2026 年 4 月，西班牙事實查核機構 Maldita 發表調查，光是 170 個付費藍勾帳號，就在 Meta 體系內刊出了至少 67,000 則詐騙廣告<sup>3</sup>。更耐人尋味的是 CNN 2024 年的觀察，在 X 被迫把免費藍勾還給一小群知名用戶之後，有些人公開抗議，要求平台把勾勾從自己頭上拿掉<sup>4</sup>。驗證徽章到了這一步，在某些圈子裡已經變成負資產。

把這兩件事放在一起看，社群平台的「身份」問題變得很怪。使用者害怕被蒐集個資，卻每天泡在需要實名才能抑制詐騙與機器人的平台上。平台越怕被機器人擊穿，就越想把你「升級驗證」，但越驗證，越多人逃。

2026 年 4 月 16 日，哈佛 Applied Social Media Lab（以下簡稱 ASML）在 Berkman Klein Center 辦了一場叫做「Digital Identity Symposium: Towards User-Owned Identity」的發表會，正式端出他們準備了接近兩年的新方案，名字很直白，就叫 **Keyring**<sup>7</sup>。第一個示範平台選了 Bluesky。

這篇文章想處理的，是接下來這三個問題。Keyring 到底把哪些零件組在一起？它在已經很擁擠的 SSI 與 mDL 生態裡，真正的新意是什麼？最脆弱的那幾個環節，又長什麼樣子？

## 二、被忽略的情緒基礎

很多技術報告會在開頭搬出 Pew 的隱私民調，拿一個大數字撐起論述。這篇想把這件事做得誠實一點。

Pew Research Center 在 2019 年的全國調查中發現，大約每五位美國成人裡就有四位，對企業蒐集與使用個人資料「至少有點擔心」；同一份調查裡，約八成的人覺得自己對這些資料的後續流向「幾乎沒有控制權」<sup>1</sup>。四年後，Pew 在 2023 年另一項調查中則顯示，67% 的受訪者表示不太理解企業如何利用他們的資料，71% 對政府使用個資感到擔心<sup>2</sup>。

兩份調查的問項不完全相同，不宜直接作時間序列對照。但放在一起看，它們至少指向同一個情緒方向——「模糊的擔憂」才是基本盤，絕大多數人並沒有走到極端恐懼那一步。這個區分很重要。政策與產品若把情緒誤讀成「大家都強烈拒絕被蒐集」，就會過度補償；若誤讀成「大家其實不在乎」，就會低估反彈。英國 VPN 暴增那組數字，正是這個「模糊擔憂」一遇到強制揭露就炸開的樣本。

身份悖論的結構形狀也從這裡長出來。平台擔心機器人與詐騙，就想拉高識別；但每一次拉高，都踩在使用者的那條「模糊擔憂」上。付費藍勾、強制 KYC、政府身份證上傳，三條路走到最後都得到相似的結局，信任沒有建立，隱私又進一步流失。

## 三、誰在做這件事

Applied Social Media Lab 是 Berkman Klein Center for Internet & Society 近年新設的單位，James Mickens 任 faculty director，焦點放在社群媒體的治理、設計與技術介面。這間實驗室不走傳統密碼學路線，也不屬於身份產業的標準組織。這個出身很要緊，因為他們帶著「社群研究」的問題意識，切進了一個原本屬於 SSI 社群與政府 eID 部門的戰場。

Digital Identity Symposium 的議程裡，除了 ASML 團隊自己的 demo，與談名單還包括 Jonathan Zittrain（Berkman Klein 共同創辦人）與 Drummond Reed（身份標準的資深貢獻者、First Person Project 的主要推動者）<sup>7</sup>。Drummond Reed 的出席本身就是一條線索。它暗示 Keyring 並非 ASML 閉門造出的新協定，定位較接近把 First Person Project 近年推動的 First-Person Credentials 概念拉進一個社群平台的示範場景。ASML 與 First Person Project 之間的具體合作形式（是否有 MOU、資金交互、technical contribution），目前沒有公開資料。

另一條對照線索來自同一週的兩場技術社群活動。2026 年 3 月 16 日的 First Person Project Summit，以及 3 月 19 日的 Linux Foundation Summit Week，ASML 團隊在這兩個場合都公開介紹過，Keyring 建構於 **OpenWallet Foundation 的 Bifold** 堆疊之上<sup>8</sup><sup>9</sup>。Bifold 原本由加拿大 British Columbia 省政府主導開發，以 React Native 寫成，是 BC Wallet 的底層。從技術血統看，Keyring 是一個把政府錢包框架改寫、瞄準社群平台用途的 fork。它的 GitHub 倉庫叫 `berkmancenter/asml-wallet-mobile`，採 Apache-2.0 授權，最後一次 commit 是 2024 年 12 月，在 repo 層級確實是 `bcgov/bc-wallet-mobile` 的後代<sup>10</sup>。

這三件事拼起來，一間社群媒體實驗室為何要去做身份錢包的動機就立得住了。ASML 真正盯住的題目從來不在「如何發駕照」或「如何做金融 KYC」；他們想處理的是另一道題，當社群平台的身份層失靈，有沒有辦法從使用者端重建一條不必交出完整身份的信任通路。

## 四、Keyring 組了哪三塊拳

ASML 在官方頁把 Keyring 定位為「advanced digital identity wallet」，列出兩個核心用例。一個叫 Proof of Age，出示成年但不揭露生日。另一個叫 Proof of Linked Accounts，用來證明同一人持有多個社群帳號<sup>11</sup>。包裝在這兩個用例之下的，其實是三塊組合拳。

### 第一塊，選擇性揭露

這個技術本身並不是新發明。W3C 在 2025 年 5 月 15 日正式把 Verifiable Credentials Data Model 2.0 升級為 Recommendation，支援 SD-JWT、JOSE/COSE、BBS+ 等多條路徑<sup>12</sup><sup>13</sup>。IETF 的 `draft-ietf-oauth-sd-jwt-vc-13` 則讓 SD-JWT VC 成為當下主流的選擇性揭露簽章格式<sup>14</sup>。同一時期，ISO/IEC 18013-5 定義的行動駕照（mDL）在美國已經擴展到 21 個州加上波多黎各，光是加州一州到 2025 年 8 月就發出超過 265 萬張<sup>15</sup>。

這些標準與部署都已經打好底子。Keyring 做的事是把「只揭露屬性、不揭露全貌」這個做法，從政府場景搬進社群平台。這塊拳的重點在場景位置，不在技術深度。

### 第二塊，Profile Badges

這塊的設計有一點對抗氣味。ASML 官方頁明寫，這個機制讓使用者「在社群應用上出示某項特定資訊的證明，並以 profile badge 形式顯示」<sup>11</sup>。驗證性本身被寫進了 UI。

可以把這個和 X 付費藍勾、Bluesky 在 2025 年 4 月推出的 Trusted Verifier 放在一起對照。那兩條是「平台替你發勾」的路徑。Keyring 的 badge 則反過來，它從使用者手上的錢包出發，平台只負責呈現，驗證過程在使用者裝置端完成。設計假設是讓「驗證」與「品牌」脫鉤。誰夠格發勾，在這個設計裡不再由平台獨佔決定，改為由多個 issuer 競爭，由 verifier 各自選擇相信誰。

### 第三塊，First-Person Credentials

又稱 Verifiable Relationship Credentials（VRCs）。核心想法是讓使用者彼此對等發證，把「人與人的關係」本身變成身份資產。

這個概念的原始文獻是 2024 年 8 月的 arXiv 論文〈Personhood credentials〉，由 OpenAI、Microsoft、Harvard 等機構的 32 位作者共同署名<sup>16</sup>。實作推動則由 Drummond Reed 主導的 First Person Project 負責，2025 年在 Hedera 的 Web3 Summit 完成了第一次公開 demo<sup>17</sup>。ASML 在這條路徑上的角色是**採用者**，把 VRC 的概念塞進 Keyring 的發憑證流程，讓「我認識的人是真人」這條連結得以累積成抗機器人的網狀證明。

### 三塊合起來看

Keyring 的技術 lineage 其實是一串既有零件的組合，W3C VC 2.0 是資料模型，SD-JWT 是選擇性揭露簽章，ISO mDL 是政府憑證介面，Hyperledger Aries 是憑證交換框架，OpenWallet Foundation Bifold 是錢包外殼，First Person Project 的 VRC 則貢獻了概念層。沒有一項密碼學原語是 ASML 發明的。

那麼它的新意究竟在哪？答案是**上下文的選擇**。既有的 SSI 與 VC 部署，幾乎全部在政府服務、金融 KYC、教育憑證、駕照這四個圈子裡打轉。歐盟 EUDI Wallet 依 Reg (EU) 2024/1183 要求 27 個成員國於 2026 年底前提供，預設用途也框在政府服務、銀行 KYC、駕照這類「官方場景」<sup>18</sup>。Keyring 是少數把這整套堆疊綁在社群平台 profile 欄位旁邊的案例。

這就是這場賭注的位置。

## 五、為什麼從 Bluesky 下手

為什麼示範場景落在 Bluesky？Reddit、Discord 或另起爐灶的獨立 app 都沒有被選上。制度上有一個現成的答案。

Bluesky 建立在 AT Protocol 之上，身份層使用 `did:plc` 與 `did:web` 作為穩定識別符，handle 是人類可讀的名字，兩者分開<sup>19</sup><sup>20</sup>。這代表一個 Bluesky 帳號的「真正 ID」並非由平台發給你，而是一個去中心化識別符。你可以換 handle、搬到另一個 Personal Data Server，身份仍然延續。對 ASML 來說，這是現成可用的地基，他們不必先說服一個平台打開 DID 介面，就能讓 Keyring 跑起來。

換成 symposium 的用語，Bluesky 是一個 sympathetic ecosystem。X 或 Instagram 要做同樣的事，得先拆掉自己的核心身份層才能讓外部錢包在 profile 上放 badge，而那意味著放棄目前每一個平台都視為收入命脈的身份主權。Bluesky 願意開放，是因為它從出生就承諾開放。

不過這個選擇也帶著一個立即的張力。Bluesky 自己在 2025 年 4 月 21 日宣布啟動官方藍勾與 Trusted Verifier 制度，決策權仍集中在平台本體<sup>21</sup>。同一個平台、同一年，一條中央式的驗證路線與一條使用者主權的路線並行，兩者目前彼此沒有互斥，也還沒整合。Keyring 的 profile badge 與 Bluesky 的藍勾能否共存、彼此補位，甚至互相抵銷，是仍未公開揭露答案的工程與治理問題。把 Bluesky 形容成「Keyring 的空白畫布」會忽略這條平行路線。它其實是一張已經有人塗了一半的畫布。

## 六、最脆弱的三個地方

### 6.1 VRC 的種子信任問題

VRC 的邏輯聽起來優雅。每個人替自己認識的人簽一張「我認識這個人，這個人是真人」的憑證，一張接一張累積出一張抗 Sybil 的關係網。

麻煩的是，這張網必須從某個地方長出來。最初的種子一旦被污染，也就是一小群共謀者互相簽證、大量註冊假身份、再從網的邊緣向外擴張，整張信任圖就會被牽著走。

這層擔憂已經有文獻可對照。Humanode 團隊整理的 Proof-of-Personhood 比較研究指出，像 BrightID 這類依賴社群圖的方案，在面對有組織的「farming」攻擊時，並沒有數學上的抗性保證<sup>22</sup>。原始 Personhood Credentials 論文本身也承認，抗 Sybil 需要「多因子組合」，且目前沒有任何一種方案在百萬級規模上通過公開實證驗證<sup>16</sup>。First Person Project 白皮書把 VRC 描述為「對等的真實世界關係密碼學證明」<sup>23</sup>，這個定位指向的是概念層的新穎性，離「已被驗證的規模可靠性」還有一段距離。

「First-Person Credentials 跳過第三方發證機構」這句話在技術上站得住，因為 VRC 確實把發證權放回使用者之間。它跳不過的是「最初的可信種子從哪裡來」。如果 ASML 或任何採用此模式的團隊，沒有把「誰有資格成為第一批合法種子」這個問題制度化，VRC 的抗 Sybil 宣稱就只剩概念論述的強度。Keyring 在發布時尚未公開種子治理規則。這是第一個、而且可能是最硬的脆弱點。

### 6.2 跨平台還沒發生

有一種句子很容易被寫成行銷文。「Keyring 把身份從平台主權推向使用者主權。」如果不加括號地放出去，這句話承諾得太滿。

目前可查的公開資料中，沒有任何 X、Meta、TikTok、Reddit 與 ASML 有合作意向、技術洽談或整合計畫的紀錄。Keyring 在發布日能跑的平台就只有 Bluesky。

歷史上這一關特別難過。Sovrin Foundation 成立於 2016 年，曾經是 SSI 的標竿基礎設施。2025 年 3 月 31 日，Sovrin 宣告主鏈即將關閉，官方公告列出的原因包含使用量衰退、監管不確定性、累積約 200 萬美元債務，以及 2024 年沒有任何新的 Transaction Endorser 加入<sup>24</sup>。IDTechWire 一篇標題很直接的分析寫著「社群搬走了」<sup>25</sup>。Sovrin 倒下的卡點不在密碼學，真正出事的是商業化生態沒接起來。ASML 若想避免複製這條曲線，需要一個可驗證的跨平台採用路徑。目前這條路徑還只存在於演講 deck。

換個角度說，Keyring 能不能在 Bluesky 上跑起來，不是最終指標。真正的指標在問另一件事，某家 Bluesky 以外的主流平台，願不願意把 profile 欄位的一部分讓渡給外部錢包發的 badge？歷史上幾乎沒有人願意這樣做。這也是為什麼判斷 Keyring 會不會起飛，關鍵跡象應該看「第二個平台」，第一個反而不是重點。

### 6.3 SSI 使用者體驗的舊帳

把身份交回到使用者手上，必然要求使用者承擔金鑰管理、錢包恢復、術語理解的成本。SSI 社群這十年最誠實的學術紀錄並不樂觀。

USENIX SOUPS 2022 由 Korir、Parkin、Dunphy 合寫的〈An Empirical Study of a Decentralized Identity Wallet〉是同儕審查過的實證研究，他們在真實受試者身上觀察到，一般使用者難以分辨「credential」「service」「connection」「contact」這四個 SSI 錢包內的核心概念<sup>26</sup>。2022 年 Sartor、Sedlmeir、Rieger、Roth 在 ECIS 發表的〈Love at First Sight?〉測試了四款主流 SSI 錢包，發現使用者歡迎選擇性揭露的概念，但實際操作時被術語卡住的比例相當高<sup>27</sup>。Christopher Allen（SSI 概念之父）2025 年的反思文章〈Has Our SSI Ecosystem Become Morally Bankrupt?〉更直接地對社群喊話，說主流 SSI 方案長年陷入技術自滿，與使用者真正的需求脫節<sup>28</sup>。

再往制度層拉一階，W3C 自己的 VC Data Model Privacy Analysis 承認，「issuer 與 verifier 共謀」能把選擇性揭露的匿名性反推出來<sup>29</sup>。密碼學可以壓低 verifier-verifier linkability，前提是錢包正確使用 BBS+ 或每次出示都切換簽章。這在目前主流 wallet 的實作中尚未成為預設。ASML 是否在 Bifold 上啟用 BBS+，目前的公開資料（GitHub 倉庫依賴樹、symposium 公開紀錄）尚未能確認。在有更強證據之前，這篇文章不對 Keyring 的 linkability 防線做強度判斷。

三件事放在一起，VRC 有種子信任問題、跨平台尚未落地、UX 與共謀是歷史債務。它們分別對應到社群層、商業層、工程與制度層。三個層都有 ASML 必須自己證明、而目前尚未證明的事。

## 七、兩股政策壓力，一條第三路

把鏡頭拉遠。當下歐美的身份政策正在製造一股反向壓力。

英國 Online Safety Act 在 2025 年 7 月 25 日強制成人內容與部分社群平台部署年齡驗證，隨之而來的 VPN 註冊暴增 1,400% 到 1,800% 不是偶發事件。ITIF 在 2025 年 9 月的分析把這個現象定調為「可預測的後果」，並提醒美國那些準備立類似法的州，好好看一下這條反彈曲線<sup>6</sup>。歐盟方向相反，但規模更大。Reg (EU) 2024/1183 要求 27 個成員國在 2026 年底前提供 EUDI Wallet，目標使用者為 4.5 億歐盟公民<sup>18</sup>。當這套制度正式上線，歐洲平台勢必得調整驗證介面去對接。

兩股壓力疊在一起的結果很清楚。平台要嘛走英國那條強制揭露、代價是大量隱私規避的路，要嘛走歐盟那條上 EUDI、把身份主權交給政府的路。

中間有沒有第三條？能夠在符合監管要求的同時，不把使用者推向 VPN 或政府錢包？ASML 看中的就是這第三條。選擇性揭露讓平台能回覆「此人已成年」而不必收到生日。Profile badge 讓監管機關或驗證者能看到可追蹤的證明。VRC 讓「真人性」有另一條非政府的補充途徑。整套邏輯要能成立，前提是監管願意接受「屬性證明」這個東西，把它當成合格的驗證路徑之一。

與此同時，既有的平台中心驗證路線還在持續失靈。X Premium 的付費藍勾被大量詐騙集團利用，Maldita 2026 年調查出 170 個藍勾帳號刊出 67,000 則詐騙廣告，就是最新、最難辯解的案例<sup>3</sup>。CNN 2024 年的報導則呈現了當初信任崩潰的文化層觀察<sup>4</sup>。Bluesky 2025 年 4 月的 Trusted Verifier 制度雖然仍是集中式的，但沒有商品化、也沒有引入付費層，可以算是在吸取 X 的教訓<sup>21</sup>。這些案例合在一起說明同一件事，平台自己賣身份驗證，或平台自己決定誰被驗證，已經很難再建立穩定的社會信號。當平台中心模式失靈，使用者中心模式才有機會被再試一次。這是 Keyring 出現在 2026 年、而沒有出現在 2020 年的環境因素。

## 八、判斷會不會成功，看四件事

Keyring 真正的賭注從來沒落在密碼學那一層。它押的是「身份主權歸誰」的結構戰。它組裝了一套成熟到接近商品化的開放技術，把這堆零件塞進社群平台的 profile 欄位旁邊，在「平台發勾」與「政府發勾」之外嘗試撐開一條第三路徑。技術本身沒有魔術，策略位置才是新的。

這場押注會不會兌現，我認為有四個可以追蹤、不虛的指標。

**第一個，第二個主流平台的採納公告。** 只要還只有 Bluesky，Keyring 就停留在 sympathetic ecosystem 的實驗階段。如果 2026 到 2027 年出現一家非 Bluesky 的平台，願意讓 Keyring badge 掛上 profile，跨平台的理論才算有了第一個實證。

**第二個，種子治理規則的公開。** VRC 若要宣稱抗 Sybil，它必須公布第一批可信種子是誰、如何產生、如何淘汰。在 ASML 或 First Person Project 公開這套規則之前，這條主張只能停留在概念層。

**第三個，採用率與可用性的公開數據。** Keyring 的 Google Play 頁面已經存在<sup>30</sup>。一個正常的學術 SSI 專案，應該會在一兩年內公布使用者測試、採用比例、錯誤率等數據。如果沒有，很容易複製 Sovrin 那條曲線，技術完美、採用荒蕪。

**第四個，監管的對應動作。** 歐盟 EUDI 預計 2026 年底上線，英國 OSA 的年齡驗證爭議還會擴張。如果哪一個主管機關願意在指引中承認「屬性證明」為合格的驗證路徑，使用者端錢包的法律位置就會被正式寫進制度。這是 Keyring 最深層的外部條件。

把 Keyring 放回它應該待的位置，我的判斷是——這是一場值得認真追蹤的結構實驗。它處理的是一個真問題，組合的是一套真技術，選擇的是一個真有對照意義的示範平台。它沒有逃開 SSI 過去十年累積的所有摩擦，它只是再一次、在一個更適合的位置上試一次。能不能成功，取決於三件事的組合，使用者願不願意扛金鑰、平台願不願意讓出 profile 主權、監管願不願意承認屬性證明。這三件事裡任何一件缺席，Keyring 都會變成 Sovrin 的下一個注腳。三件事同時到位，它才有機會變成十年後被引用的那個轉折點。

至於現在，這場賭注才剛開始。值得我們慢慢看下去。

---

## 參考資料

1. [Americans and Privacy: Concerned, Confused and Feeling Lack of Control Over Their Personal Information](https://www.pewresearch.org/internet/2019/11/15/americans-and-privacy-concerned-confused-and-feeling-lack-of-control-over-their-personal-information/)，全國性調查顯示約 4/5 美國成人對企業蒐集個資「至少有點擔心」／ Pew Research Center ／ 2019-11-15。
2. [How Americans View Data Privacy](https://www.pewresearch.org/internet/2023/10/18/how-americans-view-data-privacy/)，67% 不理解企業如何使用其資料，71% 擔心政府用資料 ／ Pew Research Center ／ 2023-10-18。
3. [Verified scams: how Meta's blue checkmark legitimizes 67 thousand fraudulent ads](https://maldita.es/investigaciones/20260408/blue-checkmark-facebook-scam-verified/)，170 個付費藍勾帳號刊出 67,000 則詐騙廣告 ／ Maldita.es ／ 2026-04-08。
4. [Elon Musk's X is back to giving out free blue checks](https://www.cnn.com/2024/04/04/tech/elon-musk-x-blue-check-subscription-business/index.html)，X Premium 藍勾付費制的信任崩潰 ／ CNN Business ／ 2024-04-04。
5. [Age checks for online safety — what you need to know as a user](https://www.ofcom.org.uk/online-safety/protecting-children/age-checks-for-online-safety--what-you-need-to-know-as-a-user)，UK Online Safety Act 2025-07-25 啟動年齡驗證 ／ Ofcom ／ 2025。
6. [The UK's Online Safety Act's Predictable Consequences Are a Cautionary Tale for the US](https://itif.org/publications/2025/09/03/the-uks-online-safety-acts-predictable-consequences-are-cautionary-tale-for-the-us/)，Proton 報告 UK 地區 VPN 註冊暴增 1,400%–1,800% ／ ITIF ／ 2025-09-03。
7. [Digital Identity Symposium: Towards User-Owned Identity](https://asml.cyber.harvard.edu/2026/04/01/digital-identity-symposium/)，2026-04-16 Keyring 公開首發，含 James Mickens、Jonathan Zittrain、Drummond Reed ／ Harvard ASML ／ 2026-04-01 公告。
8. [ASML presents at the Linux Foundation Summit Week](https://asml.cyber.harvard.edu/2026/03/19/asml-presents-at-the-linux-foundation-summit-week/)，ASML 公開介紹 Keyring 建構於 Bifold stack ／ Harvard ASML ／ 2026-03-19。
9. [ASML presents at the 2026 First Person Project Summit](https://asml.cyber.harvard.edu/2026/03/16/asml-2026-first-person-project-summit/)，ASML 團隊 demo「built on the Open Wallet Foundation's Bifold stack」 ／ Harvard ASML ／ 2026-03-16。
10. [berkmancenter/asml-wallet-mobile](https://github.com/berkmancenter/asml-wallet-mobile)，Keyring 開源碼，Apache-2.0，fork 自 bcgov/bc-wallet-mobile，最後 commit 2024-12-16 ／ GitHub ／ 查閱 2026-04-20。
11. [Advanced Digital Identity](https://asml.cyber.harvard.edu/advanced-digital-identity/)，Keyring 官方頁，列舉 Proof of Age、Proof of Linked Accounts、Profile Badges 三項用例 ／ Harvard ASML ／ 查閱 2026-04-20。
12. [W3C publishes Verifiable Credentials 2.0](https://www.w3.org/press-releases/2025/verifiable-credentials-2-0/)，VC Data Model 2.0 於 2025-05-15 成為正式 Recommendation ／ W3C ／ 2025-05-15。
13. [Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)，W3C 建議書，支援 SD-JWT、JOSE/COSE、BBS+ ／ W3C ／ 2025。
14. [SD-JWT-based Verifiable Credentials (SD-JWT VC) draft-ietf-oauth-sd-jwt-vc-13](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc-13)，IETF 草案，定義主流選擇性揭露 VC 簽章格式 ／ IETF ／ 查閱 2026-04-20。
15. [State of Mobile Driver's Licenses in the U.S.](https://trinsic.id/state-of-mobile-drivers-licenses-in-the-u-s/)，2026-01 mDL 已覆蓋 21 個美國州，加州 2025-08 累計發出 2,654,774 張 ／ Trinsic ／ 查閱 2026-04-20。
16. [Personhood credentials: Artificial intelligence and the value of privacy-preserving tools to distinguish who is real online](https://arxiv.org/abs/2408.07892)，Adler、Hitzig、Jain 等 32 位作者；OpenAI、Microsoft、Harvard 等機構 ／ arXiv:2408.07892 ／ 2024-08。
17. [Proof of Personhood in Action: The First Person Credentials Demo on Hedera](https://www.lfdecentralizedtrust.org/blog/proof-of-personhood-in-action-the-first-person-credentials-demo-on-hedera)，First Person Project 2025 Hedera Web3 Summit 首次公開示範 ／ LF Decentralized Trust ／ 2025。
18. [European Digital Identity Regulation](https://digital-strategy.ec.europa.eu/en/policies/eudi-regulation)，Reg (EU) 2024/1183 要求 27 個成員國 2026 年底前提供 EUDI Wallet ／ European Commission ／ 查閱 2026-04-20。
19. [AT Protocol DID specification](https://atproto.com/specs/did)，Bluesky 身份層使用 did:plc 與 did:web ／ AT Protocol ／ 查閱 2026-04-20。
20. [Bluesky Developer Documentation — AT Protocol](https://docs.bsky.app/docs/advanced-guides/atproto)，帳號識別符與 handle 的分離設計 ／ Bluesky ／ 查閱 2026-04-20。
21. [A New Form of Verification on Bluesky](https://bsky.social/about/blog/04-21-2025-verification)，Bluesky 官方藍勾與 Trusted Verifier 制度 ／ Bluesky ／ 2025-04-21。
22. [Comparative Analysis of Different Proof-of-Personhood (PoP) Protocols](https://blog.humanode.io/comparative-analysis-of-different-proof-of-personhood-pop-protocols/)，BrightID 等社群圖方案易被 farm，抗 Sybil 需多因子組合 ／ Humanode Blog ／ 查閱 2026-04-20。
23. [First Person Network — White Paper](https://www.firstperson.network/white-paper)，VRC 被定位為「對等的真實世界關係密碼學證明」 ／ First Person Network ／ 查閱 2026-04-20。
24. [Sovrin Foundation MainNet Ledger Shutdown Likely on or before March 31, 2025](https://sovrin.org/sovrin-foundation-mainnet-ledger-shutdown-likely-on-or-before-march-31-2025/)，Sovrin 關閉主鏈原因含使用衰退、$2M 債務、2024 年無新 endorser ／ Sovrin Foundation ／ 2025。
25. ["The Community Moved On": Sovrin Announces MainNet's "Likely Shutdown"](https://idtechwire.com/the-community-moved-on-sovrin-announces-mainnets-likely-shutdown/)，SSI 標竿關閉的產業分析 ／ IDTechWire ／ 2025。
26. [An Empirical Study of a Decentralized Identity Wallet: Usability, Security, and Perspectives on User Control](https://www.usenix.org/system/files/soups2022-korir.pdf)，使用者難以區分 credential/service/connection/contact ／ Korir, Parkin, Dunphy — USENIX SOUPS 2022。
27. [Love at First Sight? A User Experience Study of Self-Sovereign Identity Wallets](https://www.researchgate.net/publication/360021644_Love_at_First_Sight_A_User_Experience_Study_of_Self-Sovereign_Identity_Wallets)，四款 SSI 錢包的可用性研究，使用者歡迎選擇性揭露但被術語卡住 ／ Sartor, Sedlmeir, Rieger, Roth — ECIS 2022。
28. [Self-Sovereign Identity: 5 Years On / Has Our SSI Ecosystem Become Morally Bankrupt?](https://www.blockchaincommons.com/musings/SSI-5-Years-On/)，Christopher Allen 對 SSI 生態的自我反省 ／ Blockchain Commons ／ 2024–2025。
29. [VC Data Model Privacy Analysis](https://w3c.github.io/vc-data-model/privacy.html)，W3C 承認 issuer-verifier 共謀與 verifier-verifier linkability 攻擊面 ／ W3C VC WG ／ 查閱 2026-04-20。
30. [KeyRing Wallet on Google Play](https://play.google.com/store/apps/details?id=asml.bkc.harvard.wallet)，Keyring 在 Google Play 的公開上架頁 ／ Google Play ／ 查閱 2026-04-20。
