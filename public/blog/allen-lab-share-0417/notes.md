# Speaker Notes — From State Credentials to Civic Proofs

Allen Lab Fellowship Meeting · 2026.04.17 · mashbean

> 簡報中按 `S` 鍵可開啟 Reveal.js 講者視窗（含計時器與備註）

---

## Slide 1 — 標題（2:00）

上一次會議，Jeremy 幫大家從 Payment 的角度切進 DPI。今天我想接著補上另一塊拼圖，也就是 Identity。若沿用目前常見的 DPI 三分法，討論通常會落在 Data、Payment、Identity 這三塊。Allen Lab 在 Data 上已經累積很多材料，所以今天我想補上最後這一塊，也就是數位身分。

我自己過去一年大約有一半的時間都在這個題目裡面。過去兩年半我在台灣的數位發展部進行數位皮夾的推動與規劃。去年中離開政府之後，我持續做數位身分的政策研究，也參與一些公民場景的實驗，例如示範性地採納 ZKP、協助開放社群平台思考如何介接身分，以及如何在不揭露完整身分的情況下建立可驗證的資格。與此同時，因為另一條工作線的關係，我也非常關注離散社群與流亡社群如何採用新興科技。我原本以為這會是一個數位民主題目，後來發現裡面反覆碰到的其實是數位身分。東歐、加泰隆尼亞、城市級民主實驗，很多都在碰同一個問題：人要如何在數位空間裡證明「足夠的資格」，又不要因此把自己交給國家、平台或任何單一中介者。

真正讓我把這些材料串起來的，是來到 Allen Lab 之後接觸到 Digital Civic Infrastructure 這個概念。我開始意識到，自己真正關心的方向，不只是大型國家專案能否制度化，也不只是商業服務能否穩定接入。更核心的問題，是數位身分能不能成為一種支撐 civic action 的基礎設施。它能不能幫助人連結、理解、行動，同時避免過度揭露、過度追蹤與過度排除。Ash Center 將 DCI 理解為一套支撐公民 Connect、Learn、Act 的制度與技術條件，我今天關心的就是：數位身分如何決定一個人能否從連結走向行動。

我一直認為數位工具在所謂「數位集會」的階段已經有許多成功案例，甚至有許多國家的政權轉換，數位集會扮演重要的角色，但是「數位結社」一直都沒有非常好的案例，我認為有一個很重要的原因是因為「結社」的底層，也就是「數位身分」，並沒有很好的基礎。這是我的假設，未經實證，但我的推論是因為「數位身分不夠隱私」，因此「數位身分所衍伸的秘密結社」一直無法有效實踐，更不用談數位行動主義的成效了。

因此我今天的焦點放在一個更窄、也更政治的問題：什麼樣的數位身分架構，能讓公民在數位空間中低摩擦、低暴露、可救濟地行動。只把證件搬到手機上，對我來說只是表層的產品語言。更深的問題牽涉國家權力、平台責任、公民自由、跨境互通，以及公共空間的進入條件。這也是我想把身分重新放回 DCI 脈絡來談的原因。我認為這是我可以為 Allen Lab 帶來的價值。

**轉場** 既然今天要談的是 civic action，那下一張就要先回答一個根本問題：為什麼 DCI 一定要談數位身分。

---

## Slide 2 — 為什麼 DCI 一定要談數位身分（1:30）

如果把 DCI 看成一套讓公民得以連結、理解並行動的制度堆疊，那麼數位身分最敏感的位置，會出現在系統開始 gate action 的瞬間。在 Connect 這一層，身分主要處理的是持續性、社群治理、角色分工與基本信任。例如社群裡面誰是誰、誰能擔任管理者、誰能維持一個長期的貢獻紀錄。我在 g0v（台灣最大的公民科技社群）的經驗是，開源協作的社群，並沒有 gate action 的問題，因為人與人之前的信任，建構在長期貢獻之中，想關術語叫做「做中學（Do-ocracy）」、「用做來取得信任（Trust through contribution）」，或者源自於 IETF 的術語「Rough consensus and running code」。在這樣的公民行動社群中，強大的貢獻者甚至是可以匿名的，因此數位身分只是一個象徵的 trust anchor，不涉及任何數位服務。過去也有許多試圖紀錄開源貢獻的專案（如 web3 的 hypercerts），但大多失敗了，可能是因為任何量化指標，都無法取代社群自然累積的社會資本。

到了 Learn 這一層，許多資訊取得與討論其實不需要強身分。匿名閱讀、低門檻討論、弱身分參與，往往仍然成立。

真正的政治壓力落在 Act。只要系統開始問你有沒有資格、是不是重複、是否屬於某個地域、年齡是否達標、是否符合程序、是否對某個結果負責，數位身分就會進入 public decision 的核心。從那一刻開始，身分不再只是登入細節，它會直接參與公共資源分配、公共空間的進入條件，以及數位公共生活的正當性結構。Ash Center 的 DCI 框架把 Connect、Learn、Act 視為彼此連動的公民參與入口；我的觀察是，identity 在這三者裡最強烈地介入 Act。因為 Act 可能與公共服務接壤，包含吹哨、投票、附議、參選、長期結社治理等等。

因此，我今天想提出三個工作命題。第一，主流數位身分體系其實已經相當成功，尤其在服務交付、認證、簽章、合規與 fraud reduction 上。第二，當身分基礎設施開始進入年齡驗證、平台治理與公共空間入口時，它就開始決定誰能進入哪些空間、用什麼條件進入。第三，wallet、selective disclosure、unlinkability、ZK 以及 browser API 的成熟，讓較民主的數位身分設計第一次進入政策與產品的可行區，但制度治理明顯落後於技術可能性。後面幾張，就是沿著這三個命題展開。

**轉場** 既然問題出在 action 的門檻，那就要先分清楚我們談的究竟是哪一種身分、哪一種 proof。

---

## Slide 3 — 定義：從數位身分到 civic proof（2:00）

我建議把數位身分先拆成兩層再談。第一層是發證正當性，也就是誰有權核發會產生 civic consequences 的資格。這一層處理的是法律效力、主權、制度問責、撤銷權，以及一個 credential 為什麼值得被相信。第二層是交換架構，也就是憑證如何被持有、如何被出示、誰來驗證、如何撤銷、如何跨系統重用、以及整個流程會不會留下可追蹤的痕跡。把這兩層拆開之後，很多看起來混在一起的爭論就會清楚很多。PKI、VC、wallet、browser、trust list、trust registry，各自在不同層發生作用。

我想在這裡多加一個詞，叫做 **civic proof**。這個詞的作用，是把焦點從「證件本身」移到「能不能支撐公共行動的證明形式」。很多時候，公民行動並不需要完整 legal identity。它需要的可能只是一個 attribute proof，例如證明你年滿 18 歲，或你住在某個轄區。它也可能只需要 uniqueness proof，例如一人一票、一人一帳號，卻不需要知道你的真名。再往政治敏感場景走，還會碰到 pseudonymous participation，也就是你必須能參與、能發言、能貢獻、能被事後稽核，但不必在平常狀態下暴露真實身分。這四種需求若不先拆開，後面所有關於「數位身分到底需不需要強身分」的討論，都會變得模糊。

規範上，我會用四個條件來檢查制度，並且根據不同需求、制度設計、架構設計來驗證四個條件是否滿足。第一，匿名。第二，不可連結。第三，可驗證。第四，可問責。這四個條件必須同時成立，不能互相替代。其中在我參與新型態數位身分的各種專案中，我發現一個違反直覺、但是在密碼學（或政治哲學？）上自洽的狀態是「**可問責並不需要以實名為前提。**」這句話會貫穿後面所有段落。因為只要承認這件事，很多原本被認為只能靠個資全部揭露（全量識別）解決的問題，就會出現新的制度空間。

**轉場** 定義清楚之後，接下來就要看現實世界是如何配置這兩層權力的。

---

## Slide 4 — 國際比較（2:00）

如果從上層的發證正當性來看，高保證力的信任根所產生的數位身分，在今天仍然多半由國家，或由國家承認的制度提供。這一點沒有真正改變。個人自發行身分（如 ethereum address）、公民團體自發行的身分（如工會會員、俱樂部、協會等等），或者企業發行的身分（如 gmail），基本上都無法真正滿足 legal proof, attribute proof 的需求，而在 uniqueness proof 或 pseudonymous participation 方面，有許多實驗性的專案出現（如 web3 領域的 gitcoin passport，但該專案已經被賣掉轉手了），但多數最後都採用國家發行的證件為主（如 zkPassport）。我認為主因還是在「人民，即使是他國人民，相信主權國家的身分發行權力」。

這十年來，真正開始分化的是下層交換架構，也就是憑證如何被持有、如何被呈現、誰能驗證、誰能加入生態、誰控制信任清單、誰承擔 onboarding 成本。這一層的差異，會直接改變數位身分能不能走進 DCI 的 Act layer。真正啟動改變的歷史脈絡是 COVID-19，因為疫苗護照具有非常多敏感個資，開始有不同標準制定組織提出「去中心身分」的概念，去對應過去由政府資料庫儲存、使用的「中心化身分資料庫」，去避免政府監控的風險。這個領域後來衍伸出 Verifiable Credential、Decentralized Identifier，甚至應用 Zero-knowledge proof 等等的領域。不過今天我們不專注在技術發展，而是看各國在兩個層次的差異。

我先抓三組主比較。第一組是台灣。台灣同時存在 MOICA 這條高保證力、強法效、issuer-centric 的路徑，以及 TW DIW 這條朝多發證者、場景化出示、選擇性揭露前進的 wallet 路徑。第二組是歐盟。歐盟的上層仍然是 eIDAS trust services 與 national trusted lists，下層則由 EUDI Wallet 將 attestation、wallet 持有、使用者同意與跨境呈現整合在一起。第三組是瑞典。瑞典最有趣的地方在於，社會高度依賴商業的 BankID，有企業壟斷的風險，央行因此公開主張政府 e-identification 應成為重要補充。這說明商業身份系統可以非常深入社會生活，但公共治理問題並不會因此消失。

再往外看幾個補充對照。美國不是單一路徑，而是州級與市場平台交錯的叢集。California 的 OpenCred 和 wallet 生態、Utah 的 digital identity rights 語言，都很值得觀察。MOSIP 提供的是一種模組化、開源、可由國家自行擁有的基礎設施想像。Aadhaar 則提醒我們，大規模驗證與高覆蓋度不等於 civic-freedom-first。至於不丹，它的價值在於主權支持的 NDI 路線已經把 trusted wallet 與 VC 放進國家級方向之中，是值得持續觀察的 high-signal direction case。

這一張真正要講清楚的是：世界各地的競爭焦點，已經從「誰發身分」擴大成「誰控制信任清單、誰控制呈現介面、誰承擔 verifier onboarding 與 ecosystem cost」。數位身分進入 DCI 的關鍵，不在根身分是否存在，重點在於根身分被放進什麼樣的交換架構。

**轉場** 接下來，我想把鏡頭拉近到台灣，因為台灣同時壓縮了 warning case、testbed 與可能的 playbook source。

---

## Slide 5 — 台灣深描：MOICA 與 TW DIW（2:30）

台灣值得單獨講，因為它同時包含 warning case 與 testbed。

MOICA 是台灣的自然人憑證，也就是傳統的 PKI 晶片卡，後來也有推出 mobile app 的服務。它提供高保證力、強法效，以及相對清楚的政府流程整合能力。對許多政府場景來說，這非常重要。

2020 年，台灣政府甚至想要將 MOICA 與紙本的國民身分證整合，名為 New e-ID，但遇到大量民眾反彈，普遍意見認為，New eID 缺乏法律授權，而且有資安風險，因此最後暫緩。New-eID 目前仍然不會推出，而且在政府內部成為冷凍的方案。

MOICA 的問題核心不在 PKI 這三個字，也不在強 credential 本身。真正的問題在於開放生態的接入摩擦、申辦資格、臨櫃流程、第三方介接成本，以及整體制度高度 issuer-centric。MOICA 官方的身分確認服務甚至明確要求應用系統先提出申請並獲准，才能取得相關能力。這種設計非常適合高控制、高法效、高責任鏈的場景，但對第三方 civic service 來說，摩擦就會很高。

TW DIW 走的是另一條路。它的官方路徑不是再發一張集中式國民數位身分，而是把政府與民間既有憑證轉成可由持有者管理的數位憑證卡片。TW DIW 今天開源了 Mobile App 的程式碼，算是一個很重要的里程碑。目前有電信商的電信卡，支援便利商店領取網購貨物。未來應該會支援工商憑證與駕照。

TW DIW 的政策設計上強調選擇性揭露、互通性、開放生態、以及多發證者與多驗證者的可能性。這讓它在 DCI 的視角下變得很有潛力，因為 civic action 很多時候需要的不是更強的中央登入，而是更可攜、更可組合、更低揭露的 proof。

不過，TW DIW 的民主問題不能只講成 adoption friction。更準確的說法，是 **civic burden 的重新分配**。因為 DIW 可以容納多種機構發行的「數位身分」，因此多信任根、多信任清單、多發證者雖然擴大了生態空間，也把理解、授權、驗證、申訴、責任判定的門檻轉嫁給民眾與驗證者。

MOICA 的摩擦，比較集中在進場前，也就是申請、審查、接入。TW DIW 的摩擦，則比較集中在生態運作中，也就是你如何理解自己手上的 credential、你信不信這個 issuer、verifier 要怎麼驗、發生爭議時誰負責。這對 DCI 很重要，因為 civic infrastructure 不是只有技術能不能跑得動，還包括一整套使用與問責成本的分配。

**案例 A：PTT × 自然人憑證 × ZK 藍勾勾**

台灣最大的 BBS 系統 PTT，到目前仍然有數十萬人使用，但該平台長期受到選舉前協同行為與網軍操作的困擾，志工團隊很難靠傳統 moderation 解決。今年是台灣 mid-term 選舉年，工程團隊以自然人憑證產生 ZK proof，讓使用者在不揭露真實身分的情況下拿到「藍勾勾」，去降低網軍攻擊的頻率。這件事的證明意義非常強，它等於示範了一件事：國家根憑證可以提供 trust root，但不必把 full identity 交給平台，也不必讓平台知道具體是誰。這正是一種從 state credential 轉成 civic proof 的具體路徑。

**案例 B：g0v Summit × TW DIW × 民間 issuer / verifier**

另一個同樣重要的方向，是 g0v Summit 2026，g0v 是台灣最大的公民科技社群，每兩年辦一次年會。今年 g0v 志工團隊將使用數位皮夾發放證件與入場憑證，並由非政府的第三方擔任 issuer 與 verifier。這會直接證明一個 holder-centric 的生態不是只能由政府單獨操作。公民社群、活動組織者、非官方的 verifier 也可以在信任框架之中運作。它和 PTT 案例剛好形成對照：前者是拿強國家 credential 產生低揭露 proof，後者則是用 wallet 架構擴大非政府發證與驗證的實作空間。

**轉場** 把台灣放回國際視野後，下一個最清楚的壓力測試就是年齡驗證，因為它直接把身分推到公共空間的入口。

---

## Slide 6 — 年齡驗證是最好的壓力測試（2:00）

我把年齡驗證當成整場最清楚的壓力測試。因為它把原本位在後台的身分基礎設施，直接推到公共空間入口：使用者不是先接觸內容，再被治理，而是先證明自己，才能進入。

這波立法速度其實快過技術標準與人權評估；在 ISO/IEC 27566-1 於 2025 年底發布之前，英國已要求強年齡查核、澳洲法律已生效，歐盟也已宣布 age verification app 可部署。

這四個法域代表四條不同路徑。英國是高監理強度與技術中立，澳洲是平台責任模式，歐盟則試圖把「只證明 over 18」制度化。美國最值得注意，因為轉折最清楚：最高法院在 *Paxton* 案接受了成人內容年齡驗證，而加州 AB1043 更往前一步，要求作業系統在帳號設定時產生 age-bracket signal，並透過 API 提供給 app。這代表年齡確認正在從內容網站，往裝置、OS 與 app distribution 的基礎設施層下沉。

所以這一頁真正要問的，不只是誰來保護兒少，而是用什麼 proof flow 來保護。若設計不好，代價會同時落在隱私、匿名、言論自由與數位落差上；若設計得好，年齡驗證不必等於 full identity upload。這也是我下一頁要談 minimal proof 的原因。

**轉場** 年齡驗證清楚展示了 full identity 的代價。下一個問題就是：minimal proof 到底到了什麼程度。

---

## Slide 7 — 從 full identity 走向 minimal proof（2:00）

年齡驗證是一個非常好的案例，揭示了「政策」先於「技術」會出現什麼問題。

年齡驗證就是一個典型的 attribute proof，有兩種數位身分的證明方案，一個是 full identity 另一個是 minimal proof。今天的技術成熟度，已經不是技術做不做得到，而是哪些情境應把 minimal proof 當成預設。很多時候，我們需要的只是某一個條件是否成立，例如 over 18、居住在某個轄區、擁有學生資格、屬於某個 membership。若系統每次都要求 full identity，就等於把過度揭露制度化。相反地，若系統能以 selective disclosure、unlinkability、no-phone-home 來設計 proof flow，數位身分才有機會支撐較民主的公共空間治理。

這一頁也要更明確回答一個問題：wallet 是否必要。我的回答是條件式的。若需求只是單一服務登入，federation（像是 sign in with Google）、passkey 或既有高保證力登入工具常常已經足夠。當需求變成多發證者、跨場景重用、最小揭露、使用者同意、跨境互通，wallet 的制度價值就會顯著上升。因為這時候 wallet 不只是容器，它還承擔 presentation、consent、credential management、以及不同 issuer 之間的組合邏輯。NIST 把 subscriber-controlled wallets 納入模型，其實就是在承認這件事。

我也想強調「呈現層正在快速平台化」。當 wallet、OS、browser 開始成為數位憑證的預設出入口，真正的競爭就從「誰核發身分」擴大成「誰控制身分的呈現與同意介面」。Google Wallet、Chrome、Apple Wallet、EUDI 的 browser-mediated presentation，全部都在往這個方向走。這代表 platform layer 已經不是中性的。它可能成為新的 gatekeeper，也可能成為權利保護的新位置。EUDI 對瀏覽器與作業系統的限制條款、Google 對 no server tracking 的表述，都說明這一層正在被制度化。

最後，我想把 Ethereum Foundation PSE 補進來。因為 minimal proof 與 ZKP 息息相關，若 minimal proof 要進入真正可用的公民場景，光有標準還不夠，還需要 client-side proving 的性能突破、revocation 的可用設計、以及讓手機或一般消費裝置足以承擔 proving 的工程化努力。PSE 把 client-side proving 與 zkID 放到 roadmap 上，並在 2026 年持續討論 GPU acceleration 與 revocation，這讓 ZK 不再只是研究語言，也開始成為產品與公民實驗可依賴的技術底座。

**轉場** 如果主流制度還沒有充分支援低暴露、可攜、可驗證的 civic proof，那麼公民與次國家實驗就會出現。

---

## Slide 8 — 公民與次國家實驗（1:30）

當主流制度未充分支援低暴露、可攜、可驗證的 civic proof，公民與次國家實驗就會出現。這些專案最重要的價值，不是它們已經證明 alternative identity regime 成熟，而是它們把未被主流制度充分服務的需求直接暴露出來。

Vocdoni 是在加泰隆尼亞的技術開發非營利組織。自從 2017 年加泰隆尼亞獨立公投失敗以後，加泰隆尼亞的政治活動面臨巨大的限縮，因此有許多新興組織試圖走向了新的公民參與形式。Vocdoni 專案透過「西班牙護照」來驗證持有者是「加泰隆尼亞人」，進行模擬投票。Vocdoni 的案例告訴我們，地方政府與民間組織真的需要可驗證、可稽核、privacy-first 的數位投票工具。

而 Rarimo 同樣使用各地的 Passport 轉化為匿名的數位身分，進行模擬投票，Rarimo 在羅馬尼亞、俄羅斯與伊朗都有小規模的模擬投票。在流亡社群與威權脈絡下，passport-rooted、ZK-based 的匿名資格證明具有實際需求。

QuarkID 則顯示城市級政府也在嘗試把 digital trust framework 與 citizen-controlled credentials 放進公共治理。

但我想採取很節制的說法。這些案例比較適合作為需求證據，不適合作為完整替代證據。它們大多仍然依賴既有護照、會員邊界、地方政府文件或其他制度型 trust root。也就是說，根身分仍然需要公共正當性與民主問責。只是往外分岔之後，彈性提高了，信任基礎也會變得更弱。從這個角度看，更可能的未來不是 state-rooted credentials 被全面替代，而是 state-rooted credentials 與 civic-layer participation tools 的結合。

這一頁還有一個更深的政治問題：如何讓公民相信，政府提供的證件不會變成政府追蹤公民的工具。這其實是很多公民實驗最重要的隱含問題。若公民相信 credential 只是 trust root，而驗證流程本身不會把交易回傳給國家，接受度會完全不同。這也是為什麼前一頁的 no-phone-home 與 unlinkability 這麼重要。

**轉場** 如果需求存在，而主流制度又仍然需要可信的 trust root，那下一張就要問：public blockchain 在這裡最適合扮演什麼角色。

---

## Slide 9 — 公共區塊鏈的定位（1:30）

在新型態的數位身分服務中，有一個一直在標準規劃中，但幾乎沒有國家採用的案例，便是公共區塊鏈。這是我認為最重要、同時也最需要節制表述的一環。因為公共區塊鏈在數位身分服務中有很高的制度想像，但真正大規模部署的國家案例並不多，目前只有不丹與台灣真的實作而已。

我的看法是，public blockchain 在這裡的制度價值，不在合法性本身，也不在把個人資料放到鏈上。它最適合的位置，是 trust layer、status anchoring、跨組織共見、以及可稽核的狀態發布。

這裡談的不是把個資上鏈。無論從 GDPR、隱私、不可連結性，或實務上的資料治理來看，把個資本體上鏈都不是好方向。真正比較合理的上鏈內容，是 issuer 的 DID、公鑰、trust list 的錨點、status list 的承諾值，或其他公開可驗但不直接暴露個資的資料。這樣一來，holder 或 verifier 可以在不逐筆聯繫 issuer 的情況下確認某個發證者是否可信。這對 civic proof 很關鍵，因為它有助於減少中心查詢，也就是減少 phone-home 的可能性。

為什麼我要特別強調 public blockchain，而不是泛稱 DLT。因為在現有成熟基礎設施中，public blockchain 是少數能同時提供 permissionless publication、跨組織共見、獨立驗證、以及較強抗單點失效能力的工具。這在跨法域、公民社群、次國家治理、城市級 trust framework 中尤其有吸引力。反過來看，permissioned consortium infrastructure 的價值，通常在特定法域或聯盟內部的協調效率，但它的節點治理與全球可驗性邏輯完全不同。以歐盟的 trusted lists 來說，它們的核心價值來自法制與監理。若把 public chain 放進這個位置，最合理的角色會更接近 trust layer 與 registry interface，而不是取代法制正當性本身。

這也是我建議用 **federated trust-list alliance** 來理解互通的原因。未來真正可行的方向，很可能不是單一全球 trust root，而是不同法域、城市、機構、社群的 trust list 彼此橋接，形成一個可對接、可查核、可分層治理的網絡。為了這件事，我參與了一整年 ICANN 相關的 fellowship，試圖理解 DNS 的信任根是如何建立。但結論就是 DNS 走出了一條與國家權力完全不同的道路，至今 12 個信任根仍然很大程度不是由國家管理。基於天差地別的歷史脈絡，我認為這在數位身分的領域很難重現。

**轉場** 如果前面幾張是在拆解問題，下一張就要把它們收斂成可操作的政策議程。

---

## Slide 10 — 政策議程（1:30）

在我的工作經驗裡面，我發現從政府方推動 DCI 是極為困難的事情，雖然幾年前我並不知道 DCI 這個專有名詞，但實踐路徑是類似的。我發現最困難的不是技術應用，而是用公務員、民間團體可以理解的語言，將「技術架構」與「政治哲學的理想」轉化為行動語言，如採購案需求、milestone 檢核點、甚至是「目前的政府」可以採用的政策語彙。而且我發現，這是極為專業，但不同領域的專業工作者都不太會有交集的領域。政治工作者、技術官僚、技術工作者、乃至於 System Integrator 彼此用的語言真的差異太多了，雖然都是用中文，但我彷彿活在不同文化的世界。

因此我試圖列出最重要的幾項原則，來確保數位身分領域，DPI 可以成功轉化為 DCI。

我把政策議程重寫成五個可操作的動作。

第一，先固定 **privacy-first baseline**。這裡至少要包含最小揭露、不可連結、no-phone-home、自願性、紙本或非智慧型手機替代路徑、以及明確的申訴救濟。這一組原則和 ACLU、EFF、Access Now、No Phone Home 這類數位權利倡議方向是相互呼應的。原因很簡單：如果沒有先固定這些底線，新的 use case 幾乎都會從最高可見性、最方便管理、最容易資料化的方向起跑。

第二，要求 **open wallets / standardized provisioning**。因為 presentation layer 會成為新的 gatekeeper。若 wallet、OS、browser 層被單一平台主導，數位身分只會從國家壟斷轉成平台壟斷。TW DIW 官方 app 以 OID4VC / OID4VP 為核心、Chrome 將 Digital Credentials API 帶入實作、California 以 OpenCred 來處理 verifier 生態，這些都提供了可以觀察的材料。政策要做的，是讓 provisioning、presentation、verifier onboarding 盡量標準化，避免形成新的封閉生態。

第三，建立 **procurement sandbox**。這一點很容易被忽略，但我認為非常重要。很多權利主張在政策白皮書裡看起來都很漂亮，一進入 rollout 就消失。原因是它們沒有被翻成採購語言。真正需要被測試的，是全生命週期成本、第三方測試、incident response、模組替換能力、退出條款、以及 verifier onboarding 的現實摩擦。換句話說，rollout 不是最後一步，它本身就是制度設計的一部分，而且因為 procurement 太過於流程化，非常容易被忽略。

第四，建立 **testbed network**。我不建議一開始就追求通用數位身分。更穩健的做法，是挑幾種 civic use case 做小規模、可比較的試驗。論壇或公共討論場域中的 uniqueness proof 是一種。年齡或居住資格的最小揭露 proof 是一種。社群自治或公民團體 membership proof 也是一種。這些試點如果能做出一套可比較、可評估、可擴散的材料，對 Allen Lab 這種關心 DCI 的環境也會很有貢獻。

第五，**AI delegated authority** 必須被正式納入主線。因為 AI Agent 已經快速侵略人類的工作領域與生活領域。下一階段最大的問題，會從「誰登入」轉成「誰可以代表誰行動」。AI agent 是否能代表我查詢、購買、簽署、投票、提交資料、或操作某種 civic workflow，這些都需要 scope limitation、revocation、auditability 與 human override。OpenID Foundation 與 NIST 都已經把這個問題寫進正式文件，所以我建議這一張至少要留一段，把 agentic identity 與 delegated authority 接回主題。

**轉場** 最後，我想用一個比較凝縮的句子收尾，然後把問題留給大家。

---

## Slide 11 — 結論與討論問題（1:30）

我最後想留下的句子是：**一個民主社會需要的數位身分體系，不只要證明我是誰，也要決定我在什麼時候可以不暴露超過必要的資訊，仍然能合法參與公共生活。**

從 DCI 的角度看，數位身分的核心問題，不只是如何讓每個人更容易被辨識。更重要的是，如何把具正當性的資格來源，轉成低摩擦、低暴露、可救濟的 civic proof。這個轉換過程會碰到兩層信任模型。上層是發證正當性，下層是交換架構。今天的世界已經顯示，主流國家身分制度很擅長支撐 government service、簽章、合規與平台接入；比較薄弱的部分，往往是假名式參與、不可連結、申訴救濟、以及低門檻的 civic reuse。DCI 的 Connect、Learn、Act 讓我看到，身分真正進入核心的地方，發生在系統開始 gate action 的時候。

我也想把問題公開地留給大家。第一，哪些 civic acts 真的需要 legal identity，哪些其實只需要 attribute proof、uniqueness proof，或 pseudonymous participation。第二，wallet、OS、browser 若逐漸成為預設的 presentation layer，它們是否已經成為新的公共基礎設施。第三，若 state-rooted credentials 在可見未來仍是主流，那麼什麼樣的 exchange architecture 才足以支撐民主社會需要的 privacy、portability、redress 與 inclusion。

最後，這也是我自己的研究問題。我現在最大的困擾有兩個。第一，這個研究方向牽涉數位政策、標準、密碼學、公民參與、平台治理、跨法域制度，範圍很大。我很希望知道，接下來應該沿著什麼軸收斂會比較好。是沿 use case，沿 actor，沿 trust layer，還是沿特定法域。第二，從行動者、政策倡議者、學術研究者三個位置來看，下一步各自是什麼。因為眼前能做的事情非常多，反而更需要一個清楚的研究與行動排序。
