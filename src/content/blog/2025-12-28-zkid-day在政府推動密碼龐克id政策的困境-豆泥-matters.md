---
title: "zkID Day：在政府推動密碼龐克ID政策的困境 - 豆泥 - Matters"
description: "來源：https://matters.town/a/ehku76i9wdoc zkID Day：在政府推動密碼龐克ID政策的困境 在政府推動密碼龐克ID政策的困境 The Har…"
pubDate: "2025-12-28T02:00:00.000Z"
tags:
  - "matters"
  - "imported"
category: "matters"
cover: "images/covers/home/2025-12-28-zkid-day在政府推動密碼龐克id政策的困境-豆泥-matters.svg"
coverAlt: "matters zkID Day：在政府推動密碼龐克ID政策的困境 - 豆泥 - Matters｜鉛筆素描風文章縮圖，摘句：zkID Day:在政府推動密碼龐克ID政策的困境 在政府推動密碼龐克I"
---
來源：[https://matters.town/a/ehku76i9wdoc](https://matters.town/a/ehku76i9wdoc)

zkID Day：在政府推動密碼龐克ID政策的困境

在政府推動密碼龐克ID政策的困境
The Hard Road to a Cypherpunk ID: What Governments Haven’t Achieved, and How We Support It

黃豆泥，發表於 2025 年 11 月，布宜諾斯艾利斯，Devconnect zkID and Client-Side Proving Day。

在為政府服務以前，我在台灣推動 DAO 的運動。我們的 DAO，FAB DAO，是一個非營利性的實驗性合作社。以前在 web3 的世界中，我很嚮往一些新穎且可能深具影響力的概念，譬如數位民主的投票系統（譬如 Quadratic Voting）、隱私秘密的通訊（譬如 E2EE）、社會聲譽的紀錄系統（譬如 Hypercert），甚至是資源分配的方式，這些的概念的基本前提都是 Digital ID，沒有完善良好的 ID System，上述的專案就很難成功，或是根本就沒辦法互相串連。我相信這些都是未來的數位民主的重要典範。

我在以太坊的生態系中，看到非常多值得參考的案例，因此當我有機會進入政府服務時，我非常想要將這些概念帶進政府，落實這些新穎的概念，為台灣的民主盡一份力。

但實際上加入政府之後，就會發現整個步調與速度與 web3 世界不一樣，雖然預算多了很多，但要考慮的因素也呈等比級數般的複雜，所以速度慢很多。我知道以太坊基金會從兩年前開始，就對國家層次的數位身分系統（National ID System）非常有企圖心，並且在不丹的數位身分政策上開花結果，今天我想討論的議題就是以各國政策為核心進行討論，希望可以為整個無限花園（infinite garden）進一分力。

我是在 2023 年初加入台灣的新的部分——數位發展部，然後於 2025 年離開，我服務的單位叫做「多元宇宙科」（Section of Plurality），除了進行很多國家級的 web3 政策研究之外，主要就是在推動去中心識別符／身分（Decentralized Identity[identifier]），名為數位憑證皮夾（Taiwan Digital Identity Project）。web3 跳入政府服務，我今天的分享就是想要與大家討論，以官方的視角，如何推動去中心身分（DID）與可驗證憑證（VC）發展，在政府有獲得許多優勢，也踢到很多鐵板。我想從裡邊的視角（insider）應該可以對未來的各種國際合作會有幫助。

以下會分成三個主題依序進行討論，公民隱私、數位信任、以及各國趨勢，最後還會分享我自己離職後以公民科技社群成員身分進行的相關專案。

一、公民隱私

以太坊基金會（Ethereum Foundation）PSE 團隊（PSE Team）設有 ZKID 小組，推動將零知識證明（Zero-Knowledge Proof, ZKP）技術導入數位身分（Digital Identity）領域。這確實是一項國際趨勢，但目前真正落地採用的國家仍然不多。其原因可能包括：技術尚未成熟、尚未完成標準化；或更直接地說，我們也應當自問——公務體系是否能理解什麼是零知識證明（Zero-Knowledge Proof, ZKP）？一般民眾是否能理解？

此外，當我們討論零知識證明（Zero-Knowledge Proof, ZKP）或以隱私為優先的數位身分政策時，必須同時將各國網路安全（Cybersecurity）相關政策與法案納入討論，因為兩者彼此牽動、互相影響。

以下先分享兩個故事。

1993 年，《紐約客》（The New Yorker）Peter Steiner 畫了一幅著名漫畫（cartoon）——「在網路上，沒人知道你是一條狗。」（on the Internet, nobody knows you are a dog）。三十年後，情況在某種程度上仍然相同：由於網路長期缺乏明確且普遍的數位身分驗證機制，這帶來許多便利與自由，同時也衍生大量治理與風險挑戰。

三十年後的 2025 年，我以人工智慧重新生成這張圖，將坐在椅子上的狗改成了機器人，因為「在網路上，沒人知道你是人類或機器人。」（on the Internet, nobody knows you are human or robot）。網路使用者是否為機器人，已成為重大問題；無論對日常網路使用，或對整體民主體制而言，皆然。尤其在台灣，機器人協同攻擊、資訊操弄，以及意識形態宣傳等，對社群平台與公共討論造成顯著影響；特別是來自威權國家的惡意行為，更加劇平台極化。我想，這不僅是台灣的處境，世界各地亦有相似現象。

因此，去年 8 月，多位我所熟識的朋友共同撰寫一篇論文〈Personhood Credentials - artificial intelligence and the value of privacy-preserving tools to distinguish who is real online〉，提出將既有標準與原則加以框架化的觀點，亦相當完整地梳理人工智慧（Artificial Intelligence, AI）與數位信任（Digital Trust）的問題意識。

然而，在人工智慧（Artificial Intelligence, AI）之前，僅就網路治理（Internet Governance）或數位治理（Digital Governance）而言，身分驗證本就是一個高度棘手的議題。近期一個案例同樣出自《紐約客》（The New Yorker）：專欄作家 Kyle Chayka，亦為《扁平時代：演算法如何限縮我們的品味與文化》（Filter World）作者，撰寫〈The Internet wants to check your ID〉一文，提及英國近期通過《線上安全法》（Online Safety Act），要求多種線上服務必須進行年齡驗證（age verification）。同一時間，英國一個匿名開源平台 Tea 亦爆發事件。

Tea 是一個讓女性得以匿名分享「哪些男性在交友軟體上可能具高度風險、應避免交往」的平台；換言之，使用者會在平台上揭露那些男性可能存在的問題。惟因 Tea 屬非營利平台，資安防護相對不足，最終發生資料外洩（data breach），導致大量女性使用者個資外洩，並有人在另一平台 4chan 上進行肉搜與擴散，使 Tea 使用者陷入高度恐慌。Kyle Chayka 即以此事件指出：當強制性年齡驗證（mandatory age verification）與資安防護不足的數位平台並存時，將更可能引發大規模個資外洩的系統性風險。

因此，從此事件可見，愈來愈多國家開始要求線上服務強制導入年齡驗證（age verification）。近者包括英國與澳洲；澳洲亦開始管制未成年人使用社群平台。部分西方國家亦逐步推進；而中國更早已實施網路實名制，並對個人身分驗證設有強制規範。這會造成什麼問題？關鍵在於：服務提供者（service providers）蒐集個人資料，卻忽視或未能建立充分的網路資安防護（proper cybersecurity safeguards）；其結果是，這類設計在各處形成無數個個資蜜罐（honeypots），並加速資料外洩（data breaches）的頻率與規模。

因此，我們今日若在討論數位身分（Digital Identity），亦應將線上安全（Online Safety）納入同一討論框架；因為線上安全（Online Safety）不僅日益重要，且正以更快速度被強制落實。若欠缺健全的數位身分解決方案（Digital Identity Solution），社會大眾的隱私（privacy）與個人資料（personal data）將置於極高風險之中。

與此同時，資料外洩（data leaks）早已不是新問題；無論台灣過去各式數位身分資料庫，或印度廣為人知的 Aadhaar 身分系統（Aadhaar identity system），皆曾因集中式身分資料庫（centralized identity database）而創造龐大外洩風險。若今日又因線上安全（Online Safety）需求，將集中式資料庫連接到各個服務提供者（service providers），風險將更形擴大。

近年公民意識抬頭，尤其聚焦數位隱私（digital privacy）與數位人權（digital human rights）。當政府欲將身分證明文件數位化時，社會自然不希望政府得以隨時追蹤民眾使用證件的行為軌跡；此一概念稱為「不回家通報」（no phone home）。其具體對應的技術標準之一，即可驗證憑證（Verifiable Credential, VC）：政府在簽發憑證後，不再透過中心化資料庫記錄民眾的證件使用紀錄。

然而，這類身分政策在亞洲並非常態。多數亞洲政府仍傾向以集中式數位身分（centralized digital identity）落實政策，例如台灣的健保資料庫、印度的 Aadhaar ，更不必提中國各式數位身分系統。

我因而好奇：這種集中式身分管理或公民管理的行政傳統究竟如何形成，尤其在亞洲脈絡之下。此前我撰寫一篇短論文，刊載於國立陽明交通大學期刊《衝突、正義與去殖民》（Conflict, Justice and Decolonization），題為〈從編戶齊民到避秦：數位時代的亞洲身分自主權發展〉（From households to exiles, tracing the rise of identity autonomy in Asia digital age）。文中主張：在許多亞洲政府或國家，特別是受中文文化影響的區域，戶籍／戶口／身分管理的制度傳統，源自王朝體制與威權式治理，並一路延伸至今日的數位世界；因此，當代仍大量依賴大型集中式資料庫管理公民身分，可能與「公共行政的路徑依賴」密切相關。包括中國的數位信用分數（social credit），或台灣、日本的戶口資料庫，皆可在此脈絡下理解；我亦於文中整理其歷史脈絡。

這進一步引出另一層問題：當我們進入數位世界，科技巨頭（Big Tech）為了取得更多個人資料與使用行為，形成數位監控系統（digital surveillance system），並以「提供更好服務」為名；然而其副作用可能是演算法壓迫等新型傷害，有人稱之為數位封建主義（digital feudalism）。另一方面，威權國家的數位監控系統（digital surveillance system）則導向數位威權主義（digital authoritarianism），在中國及其影響所及地區（例如一帶一路國家）亦可見相似風險。

回到身分領域，當我們討論新型態的數位公民基礎設施（digital civic infrastructure），常提及多元身分（pluralistic / plural identity）有可能為民主革新（democracy renovation）開啟新的可能性。然而，在這些願景得以扎根之前，我們必須先確保充分的數位隱私與數位自主（digital autonomy）；唯有如此，相關願景方能成立，因其依賴社會信任（social trust）與數位信任（digital trust）的基礎。這不僅是技術問題；以我近三年的工作經驗而言，其中亦包含大量公共行政、國際關係，乃至地緣衝突背後的意識形態衝突等複合因素。因此，當我們討論身分，特別是數位身分（Digital Identity），其背後問題結構極其複雜。

近五年出現一個新名詞：自我主權身分（self-sovereign identity, SSI），強調使用者得以完整掌握自身身分。其核心意涵在於：當身分憑證由使用者／公民持有並出示時，驗證者（verifier）無須在每次驗證時回連國家資料庫或大型企業資料庫，從而確保使用者隱私，並保障其在網路與實體場景（online and offline）中進行活動與驗證（verification）的自主性。

這亦是一項國際趨勢。以科技巨頭（Big Tech）為例，Apple 錢包（Apple Wallet）本月隨 iOS 26（iOS 26）正式更新，該版本使美國護照（US passport）可支援於 iPhone 端使用，亦使真實身分法（Real ID）等服務進入 Apple 生態系。我們先前亦曾多次與 Apple 討論，他們也表達希望進入台灣。另一方面，Google 錢包（Google Wallet）亦提供護照整合（passport integration）服務，並支援零知識驗證（zero-knowledge verification）：例如，英國護照可放入 Google 錢包（Google Wallet），並可在不揭露任何個人資料的情況下，證明使用者在購票或購酒時已成年。其關鍵技術即零知識證明（zero-knowledge proof），屬於較新的隱私強化技術（privacy-enhancing technology, PET），亦獲開發者社群高度肯定。

除大型企業外，亦有多家新創積極投入。那麼，主權國家是否有人在做？答案是肯定的，其中規模最大者之一即歐盟。歐盟推出歐盟數位身分皮夾（EU Digital Identity Wallet, EUDI Wallet），並規定在 2027 年以前，每一個歐盟會員國都必須向所有歐盟公民與居民（EU citizens and residents）提供此數位錢包服務，可容納各國身分證件。

我在台灣任職期間，亦於兩年前提出幾乎相同架構的台灣數位身分方案（Taiwan Digital Identity），重點同樣是自我主權（self-sovereign）、安全（safe）與簡易（simple）。在我離職後，相關工作仍持續推進，我也持續以外部角色提供協助。

我不確定各位是否有公共行政服務經驗，但要確保政策延續極其不易。數位發展部（Ministry of Digital Affairs, MODA）成立至今也僅三年多，已更換三位部長（minister）。所幸三位部長皆全力支持數位憑證皮夾（digital identity wallet）計畫。更重要的是，今年五月行政院青年諮詢委員會（Executive Yuan Youth Advisory Committee）促成行政院支持整體計畫，因此正式要求跨部會協作（mandated inter-ministerial collaboration），並預期於一至三年內逐步推動上線（roll out）。這是一項重要鼓舞，因為台灣許多關鍵政策需要自上而下（top-down）推進；否則單一部會往往難以有效協調其他部會。之所以數位身分（digital identity）需要跨部會，是因為許多證件並非數位發展部主管，可能屬教育部、衛生福利部、外交部等。某種程度上，這可視為一種制度性協作（。

若各位有興趣，台灣數位身分皮夾的沙盒環境（sandbox environment）已上線，亦可觀看部分展示（demo）。官方展示網站為 demo.wallet.gov.tw。亦可下載 iOS 或 Android 應用程式（app）；若欲自行簽發證件，亦可申請帳號以進行沙盒測試。我也曾與朋友建立 vc.mashbean.net，發行 Mashbean 卡（Mashbean card）；只要取得該卡，即可在特定論壇發言，作為一個簡易示範（demo）。

然而，我們也必須誠實面對兩個巨大的風險。

第一個風險，是數位威權。中國將臉部辨識、DNA 蒐集、手機定位、社群媒體審查，以及大數據「預測性維穩」系統等技術，整合為可即時監控少數民族、維權人士，乃至一般公民日常行動的龐大基礎設施，包含新疆與西藏在內。這並非科幻，而是已在現實世界中運轉的治理機器，且常以「社會信用」、「數位治理」等看似現代化名詞包裝，其目標是將每個人的日常身分、移動與金融紀錄，轉化為可預測、可懲罰的控制系統。若我們將「數位身分」建構為一站式監控入口，數位化本質上即可能把人變成可即時管理的物件，公民權亦可能在介面上被重新定義。

第二個風險，是資本壟斷。全球的數位錢包／數位皮夾、生物辨識登入、行動支付與身分驗證，正快速集中於少數大型平台之手，最明顯者即 Apple 錢包（Apple Wallet）與 Google 錢包（Google Wallet）。兩者因掌控 iOS／Android 生態系，已被監管機關點名具有「實質的結構性市占優勢」，亦在司法程序中面臨「是否形成事實上的獨占入口」之質疑。當數位駕照、登機證、金融憑證，甚至未來的職業資格與健保紀錄，都集中於同一科技巨頭 App，且政府與商業服務僅接受該 App 時，我們實際上正把國家的數位主權與產業競爭空間，逐步外包給兩三家公司。這不僅是產業政策問題，更直接決定未來是否仍有本土創新者的生存空間。

因此，剛才新舊大陸的圖像，其實應當納入更多解方。我們看到大型企業試圖建構數位監控系統（digital surveillance system），主權國家亦可能朝同一路徑前進；但無論在國家或科技領域，也有部分行動者開始以數位人權（digital human rights）為導向提供服務，尤其聚焦於高度敏感的個資與證件。基於此，我們可將其視為一個光譜；而我認為位於核心、且具關鍵精神者，仍是自我主權身分（self-sovereign identity, SSI）。它可能是抵抗數位封建主義（digital feudalism）與數位威權主義（digital authoritarianism）的新型解方。

不過，國際上自我主權身分（self-sovereign identity, SSI）運動仍處於尚未穩定的階段，尤其在標準制定組織（standards development organizations, SDOs）之中。目前數位身分標準（digital identity standards）已進入近乎自由競逐（free-for-all）的階段；隨著產業標準與國際政策逐步成形，關於框架的競爭也正升溫。我們可以看到全球資訊網協會（World Wide Web Consortium, W3C）、FIDO 聯盟（FIDO Alliance）、網際網路工程任務組（Internet Engineering Task Force, IETF）與 OpenID 基金會（OpenID Foundation）等，皆各自推進多套尚待完成或發布的標準。國際標準化組織（International Organization for Standardization, ISO）亦有其標準體系；但目前標準多元、互通性不足（non-interoperable），且其背後價值與意識形態亦可能不同。

例如，今年六月，以全球資訊網協會（World Wide Web Consortium, W3C）與網際網路工程任務組（Internet Engineering Task Force, IETF）為主的標準開發者發現：國際標準化組織（International Organization for Standardization, ISO）的行動駕照（mobile driver’s license, mDL）標準中，存在疑似後門設計，使憑證簽發國家或法人可能在未告知使用者情況下，啟用追蹤使用者足跡（footprint）的功能。此事引發相當程度的恐慌，因其屬於典型的回連通報（phone home）行為，並嚴重違背自我主權身分（self-sovereign identity, SSI）的核心精神。因而有許多國際組織與個人發起連署，推動「不回家通報」倡議（no phone home campaign）。後續事件之所以暫告一段落，是因為國際標準化組織（International Organization for Standardization, ISO）開發者表示該條目係基於部分國家需求而納入，並承諾刪除。至於 ISO 為何會承受國家層級壓力，原因在於 ISO 以國家為會員單位，而威權國家亦能在此體系內運作。此即國際標準競爭的一段插曲。

面對如此多標準，如何整合？其背後涉及人權價值、商業利益，以及地緣政治下的主權議題，各方皆希望取得主導權。因此，今年七月於瑞士日內瓦（Switzerland Geneva）舉辦由三十餘個組織共同主辦的全球數位合作大會（Global Digital Collaboration conferences），被視為史上首次以數位身分（digital identity）為核心的大型聚會。聯合國體系的國際電信聯盟（International Telecommunication Union, ITU）、世界貿易組織（World Trade Organization, WTO）、世界銀行（World Bank）、經濟合作暨發展組織（Organisation for Economic Co-operation and Development, OECD），以及標準制定組織如全球資訊網協會（World Wide Web Consortium, W3C）、OpenID 基金會（OpenID Foundation），甚至 Google（Google）、華為（Huawei）、萬事達卡（Mastercard）、維薩（Visa）等皆參與其中，主要試圖處理數位身分互通性不足與隱私相關問題。該活動有千餘名參與者、四十餘個組織，亦有多國代表、標準制定者及不同類型組織分享。然而，這類「大拜拜式」會議最終仍未形成明確結論；面對標準多元、主權國家與企業利益、以及公民個人權利等議題，各方仍各執一詞、難以定論。

因此，目前的核心問題在於：多數國家的數位錢包（digital wallets）因零知識證明（Zero-Knowledge Proof, ZKP）採用有限，尚難確保不可連結性（unlinkability）。這既是技術問題，也反映公眾與公務體系（civic servants）對相關概念的認知不足。第二個問題則是：各國身分（IDs）在很大程度上仍缺乏互通性（non-interoperable）。

二、數位信任是數位經濟的基石，不可輕忽

更直白地說：若我們仍以紙本證件作為媒介，反而可能比數位身分更容易互通，因為紙本可被直接持有、可被直接閱讀。然而，針對可信名單（trusted list）的互通，目前並不存在一致的通訊協定（protocol），而其成因同時涉及政治與標準問題。

因此，我想用幾分鐘談「兩種信任」。

第一種信任，是「可信中立」的技術信任，如開源、可驗證、以隱私為預設。從瑞士公開要求 e-ID 與 Swiyu 必須是開放原始碼（open source）、並必須確保不同服務場景之間不得被任意串聯；到德國與歐盟強調零知識證明（Zero-Knowledge Proof, ZKP）與最小揭露（minimal disclosure），使人民僅在必要時揭露必要屬性；再到美國猶他州（Utah）以法律文字直接承認「身分」首先屬於人民本人，政府僅負背書；以及 MOSIP（MOSIP）等開源模組，讓中低所得國家得以依自身規則、使用自身供應商打造身分系統。我們可以看到共通點：個人自主權並非與國家主權對立，反而是國家數位主權（digital sovereignty）的必要條件。當人民能夠主動選擇、最小揭露、並拒絕被追蹤，國家才能主張「這套系統可信，且可置於國際談判桌上」。

第二種信任，是「跨境互信」的制度信任。歐盟以 eIDAS 2.0（eIDAS 2.0）將跨國登入、簽章、年齡驗證、醫療與金融服務取用，納入同一法規框架，並要求 2026 至 2027 年間，會員國與特定產業「必須接受」數位身分皮夾，使人民得以攜帶自身憑證在單一市場中移動。世界銀行（World Bank）、聯合國開發計畫署（United Nations Development Programme, UNDP）甚至將「身分＋支付＋資料互通」的組合視為數位公共基礎建設（digital public infrastructure），並認為其是未來包容式成長、跨境服務，乃至女性經濟參與的必要條件。換言之，這已不再是單一國家的「內政」，而是全球供應鏈、人才流動與資料治理的新型關稅同盟。然而，全球數位身分信任架構仍未形成明確的共同遵循架構；亞太經合會（Asia-Pacific Economic Cooperation, APEC）亦在今年才於 DESG（Digital Economy Steering Group）啟動相關數位身分信任議題。台灣有機會成為相關政策的領先者，甚至成為主動協作者與領域領導者。

回到台灣。我們今日討論的「可驗證憑證」（Verifiable Credential, VC）與「數位憑證皮夾」，不是在做一張更漂亮的數位身分證；這已不是過去 New eID（New eID）政策，而是全然不同的政策架構。現在要回答的，是兩個根本問題：第一，我們能否以開源（open source）、最小揭露（minimal disclosure）、零知識（zero-knowledge）等技術，保障人民選擇權，使國家在對外談數位主權（digital sovereignty）與個人隱私權時站得住腳？第二，我們能否把這套皮夾式信任架構，做成可被國際夥伴理解、互信、互通的格式，使台灣公民、企業與專業服務能在全球數位經濟中被即時認可，而不是每次都必須重新解釋「我是誰」？這既是明示，也是地緣政治的隱喻。如此一來，一方面可大幅降低國際介接所需成本，加速台灣數位企業走向國際；另一方面亦可在民主陣營中，強化台灣作為技術夥伴的角色。

若答案是肯定的，我們便不只是追上他人的規格，而是在為下一代民主社會鋪設一條可持續、可出口、可被信任的公共建設。這就是數位信任（digital trust），也是台灣下一步必須主動提出的治理藍圖。

在數位信任議題中，「信任清單」（trust list）仍是一個巨大的、尚未標準化的問題，甚至比零知識證明（Zero-Knowledge Proof, ZKP）更早期。原因在於：數位身分不僅牽涉商業利益，更是地緣政治議題，因為許多身分由政府發行。各國政治差異極為關鍵，僅憑技術解方無法處理所有問題。

我們可以以網域名稱系統（Domain Name System, DNS）作為借鏡。網際網路名稱與號碼指派機構（Internet Corporation for Assigned Names and Numbers, ICANN）社群透過國碼域名支持組織（ccNSO）、通用域名支持組織（gNSO）及多方利害關係人社群共同治理網域，使網域不僅是各國政府事務。ICANN 採多方利害關係人治理（multistakeholder governance），而非如聯合國（United Nations, UN）體系的多邊治理（multilateralism）；兩者邏輯截然不同，並可形成正向獲利的生態系，進而推動更多看似不具直接獲利的政策，例如通用接受度（Universal Acceptance, UA）、國際化網域名稱（Internationalized Domain Names, IDN）或青年培力等計畫。

在此脈絡下，無需許可、可公開參與的公共區塊鏈（trustless, permissionless public blockchain）是否可能成為解方？這是一個值得持續討論的議題。

三、以國家為單位的國際趨勢

接著談自我主權身分（self-sovereign identity, SSI）的最新趨勢。今年有多個國家案例值得參考。第一個案例是不丹。2025 年 10 月，不丹將全國國家數位身分（National Digital Identity, NDI）系統正式錨定到以太坊公鏈（Ethereum public blockchain）上，成為全球第一個將國民數位身分直接掛載於公開、去中心化區塊鏈（permissionless decentralized blockchain）的國家。這已非區塊鏈行銷口號，而是由國王立法與國家技術團隊共同決策，目的在確保「國民身分憑證」能在國界之外被驗證，且是無需許可（permissionless）的。換言之，未來不丹公民持其可驗證憑證（Verifiable Credential, VC）即可直接對接境外服務，不必仰賴層層國際備忘錄。另據數位信任協會成員於上月與不丹推動者直接交流，不丹並未將任何個人資料上鏈，而是將發行者資訊上鏈，讓全球驗證者得以透過區塊鏈確認發行者非詐騙，因而建立數位信任（digital trust）。這凸顯一個重要轉型：主體是公民本人，國家扮演的是「背書其真實性」的角色，而非「集中保管所有資料、人民只能透過國家」；國家所提供的數位服務正在轉型。

台灣亦採取相近架構，並使用公共區塊鏈（public blockchain），期待未來有機會與不丹直接合作。

第二個案例是瑞士。瑞士於 2025 年 9 月 28 日舉辦全國公投，最終以約 50.4% 的些微差距通過新版聯邦電子身分法（e-ID Act）。該法案重點包括：第一，電子身分必須由國家親自簽發，不得外包給單一大型私人業者，以避免身分資料成為新的壟斷平台。第二，e-ID 將以 Swiyu 數位皮夾形式發行，免費、自願，並要求系統開放原始碼（open source），供全民與產業檢視與重用，以降低黑箱風險。第三，瑞士政府亦公開承諾不可連結性（unlinkability）：不同服務場景下使用的憑證不得被直接串聯，以追蹤個人行為路徑。這代表隱私保護不是口號，而是被寫入設計規格。

第三個案例是德國與歐洲數位身分皮夾（European Digital Identity Wallet, EUDI Wallet）。德國創新機構 SPRIN-D 將「國民數位皮夾」視為國家級專案，要求皮夾必須支援零知識證明（Zero-Knowledge Proof, ZKP）：例如，只證明「我已滿 18 歲」或「我持有某項執照」，而非交出整張身分證、生日與住址等完整資料。在 2025 年柏林 re:publica（re:publica）的公開論壇中，德國聯邦數位化與現代化部部長指出：數位皮夾不僅是技術，更是「歐洲數位主權」（European digital sovereignty）的核心工具；每個人都應擁有一個可容納身分證、健保卡、交通票券，乃至退休保險證明的通用錢包，且必須由人民先同意，政府才得以調用，而非反過來。

第四個案例是美國猶他州（Utah）。猶他州於 2025 年通過 SB260（SB260），被稱為「個人數位身分修正案」（Personal Digital Identity Amendment），並獲跨黨派支持。該法案在法律語言上做出重要轉向：州政府不再宣稱「我發給你一個身分」，而是宣稱「我承認你主張的數位身分，並為其背書」，且居民可選擇是否參與。亦即，數位身分被視為自然人的固有權利，而非政府新創造的編號系統。這種定位迫使政府承認：個人自治與隱私優先，政府僅提供驗證服務，而非將民眾全面「納管」。

但另一方面，電子駕照標準仍是多國採行的主流。

除了上述「國家級」做法，許多國家是從最貼身的證件——駕照——開始推動。ISO/IEC 18013-5（ISO/IEC 18013-5）標準將手機駕照（mobile driver’s license, mDL）定義為可被掃描、可部分揭露資訊，甚至可離線驗證真偽的數位證件。美國運作模式係由各州與運輸安全管理局（Transportation Security Administration, TSA）合作，讓旅客在部分機場安檢口僅需出示手機皮夾中的數位駕照，而不必遞交實體證件；同時 iPhone 或 Android 會清楚顯示「本次僅提供姓名、年齡」等最小必要資訊，以減少過度蒐集。

澳洲多個州（例如新南威爾士州 NSW（New South Wales, NSW））已允許以官方 App 出示數位駕照，用於酒吧、警察臨檢或年齡檢查，並朝向與國家數位身分、甚至去中心化憑證服務整合，同步比照 ISO/IEC 18013-5（ISO/IEC 18013-5）。日本則將「駕照功能」整合進全國 My Number 卡（My Number Card），自 2025 年 3 月起，公民可選擇以該卡作為駕照身分證明，並透過手機讀取卡片晶片內容後放入 Apple 錢包（Apple Wallet），但仍保留不強迫全面數位化的選項。紐西蘭與紐澳政府亦同步建構數位身分信任框架，要求數位駕照在法律上保障「自願參與」與「不得拒收實體證件」，以避免數位化對未持有智慧型手機者形成變相歧視。

四、數位身分社群與區塊鏈社群彼此的距離

雖然去中心化識別碼（Decentralized Identifier, DID）標準最早確實源自區塊鏈身分（Blockchain Identity）概念，但在標準制定組織與相關社群中，幾乎看不到區塊鏈開發者；以我自身參與經驗而言，許多傳統標準社群參與者對區塊鏈生態系多採敬而遠之的態度。然而，從我的觀點來看，以太坊（Ethereum）與這些組織在意識形態與方向上其實高度接近；我認為弭平兩者誤解已是當務之急。

五、結論

離開數位發展部（Ministry of Digital Affairs, MODA）後，在以太坊基金會（Ethereum Foundation）Next Billion Fellowship 專案的支持下，我進行了「有備而來」（Bonds）的計畫，可於 bonds.tw 查看相關內容，這是一個非營利專案。

我們希望完成三件事。第一，我認為存在一條理想的數位身分路徑，但對主權國家或大型企業而言，包袱與限制太多；相對地，非營利小型專案可進行更多創新行為，甚至較具前瞻性的研究，因此我們啟動此專案。我們製作一個示範性行動應用程式（mobile app），用於備份政府身分證件（government ID）。考量台灣面臨多重地緣政治風險，也需要在自然災害情境下支援離線驗證（offline verification）。近期台灣受颱風影響，甚至出現某縣市網路中斷的情況，凸顯離線驗證的重要性。更關鍵的是人為災害（man-made disaster）情境：我們需要全新的數位信任架構（digital trust architecture），以抵抗地緣政治風險，尤其是網路惡意行為。同時，數位監控（digital surveillance）亦是嚴峻問題，因此推動自我主權身分（self-sovereign identity, SSI）亦可同步提升數位隱私（digital privacy）。

接著，我們建立了一些架構與架構圖，並完成一個應用程式。此應用程式源自台灣推動 New eID（New eID）政策時所遭遇、與瑞士相似的問題。當時政策構想是推動具 IC 晶片的身分證，民眾在驗證身分時需插卡操作，並可用以報稅或就醫。然而，該政策因風險過高、法規未定、亦有資安疑慮，最終在民眾反彈下停止。五年後，我們認為此時代的人權價值已更新，且基礎建設亦較成熟，因此我們使用台灣電子簽章系統 TW FidO（TW FidO），去存取台灣 MyData（MyData）資料庫並取得國民身分資料（national ID data）。取得後再轉換為符合自我主權身分（self-sovereign identity, SSI）的應用程式，即 Bonds。其中亦採用較先進的零知識證明（zero-knowledge proof）技術；而這些服務目前並非台灣或歐盟作為主權國家的數位身分政策所普遍提供。我們之所以如此設計，目的在於提供一個具體示範。

此外，我們也撰寫一篇較偏台灣脈絡的政策類文章，說明為何台灣與國際社群都應嚴肅考量以零知識證明（Zero-Knowledge Proof, ZKP）解決不可連結性（unlinkable）問題，或提出聯邦式信任清單（federated trust list）概念以滿足互通性（interoperable）需求。目前論文已完成，但仍為中文版本；待翻譯為英文後，我將再與各位分享並共同討論。

第二，我們除政策論文（policy paper）與應用程式（app）之外，認為此階段亦應讓更多人理解零知識證明（Zero-Knowledge Proof, ZKP）與新型數位身分（digital identity）概念。因此，我們在網站上設計一則兒童故事，目標是讓國中小學生也能理解數位身分究竟是什麼。我們以「蜜罐」（honeypot）的「大型蜜罐與小型蜜罐」對比，闡述分散式（distributed）、去中心（decentralized）身分，多元身分，以及新的數位信任（digital trust）概念。若連小學生都能理解，或許公務體系與社會大眾也能更容易理解。

當然，內容亦涵蓋台灣與國外案例。國際間與數位身分資料外洩相關的案例非常多，皆值得整體性討論；但在台灣，目前仍較少見到完整的系統性討論。

本日的演講總結共有三點：

信任清單（trust list）（國際合作議題）

信任清單（trust list）（國際合作議題）

零知識證明（Zero-Knowledge Proof, ZKP）（技術變革）

零知識證明（Zero-Knowledge Proof, ZKP）（技術變革）

數位公共建設（digital public infrastructure）（各國政策改革）

數位公共建設（digital public infrastructure）（各國政策改革）

歡迎自由分享與交流。謝謝大家。
