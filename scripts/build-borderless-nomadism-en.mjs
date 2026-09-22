import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "public/decks/borderless-nomadism-2026");
const targetDir = path.join(root, "public/decks/borderless-nomadism-2026-en");

await fs.cp(sourceDir, targetDir, { recursive: true });

const pairs = [
  ["無國界的遊牧", "Borderless Nomadism"],
  ["那些數位流動者的落地生根實驗", "How Digital Drifters Try to Put Down Roots"],
  ["飛地・台灣季　｜　在世界之間", "NOWHERE · TAIWAN SEASON  |  BETWEEN WORLDS"],
  ["人・勞動・社群・空間・世界", "PEOPLE · LABOUR · COMMUNITY · PLACE · WORLD"],
  ["人、勞動、社群、空間、世界", "People, Labour, Community, Place, World"],
  ["虛擬與現實交錯的觀察筆記", "Field notes where online and offline life overlap"],
  ["兩種在清邁遊牧的人", "Two Ways of Living Nomadically in Chiang Mai"],
  ["故鄉可能是排他的<br>也可能是排擠的", "Home Can Exclude<br>and It Can Push People Out"],
  ["數位避秦", "Digital Exiles"],
  ["何處是故鄉", "Where Is Home?"],
  ["番外篇　AI、人類與工作 ↗", "EPILOGUE  AI, PEOPLE AND WORK ↗"],
  ["I · 暫時離開", "I · A TEMPORARY EXIT"],
  ["躺平主義的遊牧", "Nomadism as Lying Flat"],
  ["具有旅遊或體驗性質的追尋", "A search shaped by travel and experience"],
  ["II · 動手重做", "II · STARTING OVER"],
  ["身體力行的遊牧", "Nomadism as Reconstruction"],
  ["具有生活或砍掉重練的實驗", "An experiment in rebuilding everyday life"],
  ["這裡講的", "The "],
  ["數位遊牧", "digital nomads"],
  ["，是我在清邁遇見的兩種人。", " I met in Chiang Mai followed two different impulses."],
  ["躺平體驗作為一種消費產業鏈", "Lying Flat as a Consumer Industry"],
  ["「只要將整個世界倒轉 90 度，人們就會發現一個平時難以啟齒的真理：躺平才是真正的站立，而站立的正是爬行。」", "“Turn the whole world ninety degrees and an awkward truth appears: lying flat is standing upright, while those who stand are the ones crawling.”"],
  ["《躺平主義宣言》", "Manifesto of Lying Flat"],
  ["高壓日常", "High-pressure life"],
  ["工作、房價、內卷", "Work, housing costs, involution"],
  ["清邁躺一躺", "Lie flat in Chiang Mai"],
  ["換一種生活節奏", "Try a different pace"],
  ["積蓄見底", "Savings run low"],
  ["生活還是要花錢", "Daily life still costs money"],
  ["回去當牛馬", "Return to the grind"],
  ["存到錢，下次再來", "Save enough to come back"],
  ["清邁 ⇄ 職場", "CHIANG MAI ⇄ WORK"],
  ["清邁筆記・之一", "CHIANG MAI NOTE · I"],
  ["微信、抖音、小紅書上的遊民大會，賣的正是這種生活想像。", "Nomad gatherings promoted on WeChat, Douyin and Xiaohongshu sell precisely this image of life."],
  ["原文裡，我把這叫做精神上的", "In the original essay, I called this psychological "],
  ["躺平／Copium", "Lying Flat / Copium"],
  ["從大理，流動到清邁", "From Dali to Chiang Mai"],
  ["瓦貓之夏", "Summer of Tile Cats"],
  ["2022・大理的活動被清場", "2022 · An event in Dali was shut down"],
  ["沒有大台，也繼續辦", "They carried on without a central stage"],
  ["聚會改用去中心的方式進行", "The gathering continued through decentralised coordination"],
  ["一部分人來到清邁", "Some participants moved to Chiang Mai"],
  ["有人就這樣定居下來", "Some decided to stay"],
  ["多中心的群落", "A polycentric community"],
  ["有衝突，也長出了產業鏈", "Conflict appeared, along with a local economy"],
  ["706 青年空間", "706 Youth Space"],
  ["也匯入清邁", " also fed into Chiang Mai"],
  ["由於 Web3 生態系短暫繁榮，年輕工作者擁有了實踐生活型態的餘裕。", "A brief Web3 boom gave some young workers enough financial room to try a different way of living."],
  ["「甚至還建造了多中心的群落，有了點衝突，也有相應的產業鏈出現。」", "“They even built a polycentric community. Conflict followed, and so did an economy around it.”"],
  ["黃豆泥・清邁的遊牧觀察", "Yen-Lin Huang · Notes from Chiang Mai"],
  ["Web3 加密遊牧者", "Web3 crypto nomads"],
  ["彼此也不見得熟；有些人反而更常與各自的西方社群往來。", " did not necessarily know one another. Some spent more time in their own Western networks."],
  ["第二章　/　HOME & ELSEWHERE", "CHAPTER II  /  HOME & ELSEWHERE"],
  ["千里共嬋娟", "Under the Same Moon"],
  ["不同地方，共享同一個空間", "Different places, one shared space"],
  ["神遊於物外", "Elsewhere in the Mind"],
  ["同樣空間，尋找神遊的地方", "In the same place, finding somewhere else to be"],
  ["遠方之一", "DISTANCE · I"],
  ["人在海外<br>還是使用微信", "Living abroad,<br>still using WeChat"],
  ["語言・熟人<br>資訊・共同時間", "Language · familiar people<br>news · shared time"],
  ["遠方之二", "DISTANCE · II"],
  ["波士頓<br>罵罵咧咧的司機", "A driver in Boston<br>cursing as he goes"],
  ["移居・日常<br>故鄉・情緒", "Migration · daily life<br>home · emotion"],
  ["在不同的地方，共享同一個空間。", "Living in different places while sharing the same social space."],
  ["另一種遠方", "ANOTHER KIND OF ELSEWHERE"],
  ["雲林的女兒<br><em>穆斯林的信仰</em>", "A daughter of Yunlin<br><em>her Muslim faith</em>"],
  ["在同樣的空間，<br>尋找神遊的地方。", "In the same physical space,<br>the mind finds somewhere else."],
  ["地方・家庭・信仰・歸屬", "PLACE · FAMILY · FAITH · BELONGING"],
  ["次文化的遠方", "Distant Worlds of Subculture"],
  ["德意志博物館 DLØDM 電台", "DLØDM radio station at the Deutsches Museum"],
  ["DLØDM 電台，2022。圖／Deutsches Museum, München", "DLØDM radio station, 2022. Image: Deutsches Museum, Munich"],
  ["德意志博物館・火腿族志工爺爺", "DEUTSCHES MUSEUM · AN ELDERLY AMATEUR RADIO VOLUNTEER"],
  ["SCP 基金會", "SCP Foundation"],
  ["一起把不存在的世界寫出來。", "Writing an impossible world together."],
  ["海棠論壇", "Haitang Forum"],
  ["在閱讀與創作裡找到同類。", "Finding one another through reading and writing."],
  ["業餘無線電", "Amateur radio"],
  ["訊號先抵達，人未必要見面。", "Signals arrive before people ever meet."],
  ["第三章　/　EXODUS", "CHAPTER III  /  EXODUS"],
  ["戶籍", "Household registers"],
  ["故鄉、邊境與名冊", "Home, borders and rolls"],
  ["把加密工具傳出去", "Moving cryptographic tools across borders"],
  ["從平台手裡搬走", "Moving away from platforms"],
  ["真的去蓋一個地方", "Building an actual place"],
  ["故鄉、邊境、戶口的誕生", "Home, Borders and the Household Register"],
  ["制度如何看見人", "HOW INSTITUTIONS SEE PEOPLE"],
  ["編戶齊民", "Household Registration"],
  ["進了名冊，<br>也就進了治理的範圍。", "Once entered on a register,<br>a person enters the reach of government."],
  ["避秦", "Seeking Refuge beyond the State"],
  ["：想像名冊之外的生活。", ": imagining life beyond the register."],
  ["編入名冊", "Enter the register"],
  ["把人辨認出來", "Make people identifiable"],
  ["連到土地", "Tie people to land"],
  ["人屬於哪個地方", "Assign a place of belonging"],
  ["分配義務", "Assign obligations"],
  ["賦稅、徭役與管理", "Tax, corvée labour and administration"],
  ["劃定邊界", "Draw boundaries"],
  ["限制進入與離開", "Control entry and exit"],
  ["重播本頁流程動畫", "Replay this slide's sequence"],
  ["↻ 重播", "↻ Replay"],
  ["我們都有兩套戶籍", "We Live with Two Identity Systems"],
  ["國家", "STATE"],
  ["戶籍・證件<br>公共服務", "Registers · documents<br>public services"],
  ["證明你的身分，<br>也決定你能使用哪些服務。", "They prove who you are<br>and shape which services you can use."],
  ["平台", "PLATFORM"],
  ["帳號・登入<br>社交與支付", "Accounts · logins<br>social life · payments"],
  ["朋友、作品與交易都在裡面。<br>帳號一停，入口就關了。", "Friends, work and transactions sit inside.<br>If the account stops, the door closes."],
  ["國籍與帳號的法律地位不同；但生活被擋在門外的感覺，未必那麼遙遠。", "Citizenship and platform accounts have different legal standing. Yet losing either can feel like being shut out of ordinary life."],
  ["把身分的三件事拆開", "Three Parts of Digital Identity"],
  ["識別", "Identification"],
  ["核發者確認身分", "An issuer confirms identity"],
  ["憑證", "Credential"],
  ["把證明交給個人保管", "The individual holds the evidence"],
  ["驗證與授權", "Verification and consent"],
  ["需要時，由個人出示", "The individual presents it when needed"],
  ["身分自主權", "Self-Sovereign Identity"],
  ["核發 ≠ 保管 ≠ 使用", "ISSUANCE ≠ CUSTODY ≠ USE"],
  ["個資權力：核發與撤銷", "Power over data: issuance and revocation"],
  ["儲存位置：裝置與機構", "Storage: devices and institutions"],
  ["使用足跡：紀錄對誰可見", "Use trails: who can see the records"],
  ["把程式印成一本書", "Printing Software as a Book"],
  [" 原始碼出版計畫", " Source Code Publication"],
  ["加密程式", "Encryption software"],
  ["讓私人通訊保持私密", "Keep private communications private"],
  ["出口管制", "Export controls"],
  ["程式跨境受到限制", "Software faces border restrictions"],
  ["印成紙本", "Print the source"],
  ["C 原始碼成了出版物", "C source code becomes a publication"],
  ["讀回程式", "Read it back"],
  ["文字又能變成工具", "Printed text becomes software again"],
  ["密碼龐克", "Cypherpunks"],
  ["把主張寫成程式，也把程式印上了紙。", " wrote their politics into code, and put the code on paper."],
  ["1996：網路獨立宣言", "1996: A Declaration of the Independence of Cyberspace"],
  ["三十年後，<br>進入這個世界仍需要誰的許可？", "Thirty years later,<br>whose permission do we still need to enter?"],
  ["伺服器、平台條款、網路封鎖。<br>還有，沒辦法搬進網路的肉身。", "Servers, platform rules and network blocks.<br>And bodies that cannot move into cyberspace."],
  ["網路也會失憶", "The Internet Also Forgets"],
  ["2000–2010 年代・逃離數位壟斷", "2000s–2010s · LEAVING DIGITAL MONOPOLIES"],
  ["無名小站下線，<br>早期網頁一個個失連。", "Wretch shut down.<br>Early web pages vanished link by link."],
  ["伺服器要錢，網域要續，格式會過時。<br>「還在網路上」這件事，一直都需要有人照顧。", "Servers cost money, domains expire and formats age.<br>Staying online has always required care."],
  ["文章無法查看的截圖", "Screenshot of an article that can no longer be viewed"],
  ["〈中文互聯網正在加速崩塌〉失連畫面。原文圖／黃豆泥", "Broken page from “The Chinese Internet Is Collapsing Faster Than We Think.” Original image: Yen-Lin Huang"],
  ["連談論網路崩塌的文章，也可能消失。", "Even an article about digital decay can disappear."],
  ["藝立協：誕生自網絡的部落美學", "Elixus: A Tribal Aesthetic Born Online"],
  ["派樂西王國網站頁面", "Kingdom of Piracy website"],
  ["派樂西王國網站。原文圖／黃豆泥", "Kingdom of Piracy website. Original image: Yen-Lin Huang"],
  ["2001・派樂西王國", "2001 · KINGDOM OF PIRACY"],
  ["IRC、部落格、紫藤廬。<br>網友也會在茶館見面。", "IRC, blogs and Wistaria Tea House.<br>Online friends also met over tea."],
  ["Piraport 複照", "Piraport Passport"],
  ["身分、版權、交互信任，<br>都可以拿來當創作材料。", "Identity, copyright and mutual trust<br>could all become artistic material."],
  ["逃離社群平台", "Leaving Social Platforms"],
  ["五把鑰匙", "Five keys"],
  ["帶著朋友一起走", "Move with your people"],
  ["協議", "Protocol"],
  ["讓資料可以搬遷", "Make data portable"],
  ["結社", "Association"],
  ["成員、承諾與分工", "Membership, commitments and roles"],
  ["治理", "Governance"],
  ["申訴、決策與交接", "Appeals, decisions and succession"],
  ["金流", "Funding"],
  ["維護成本有人支付", "Pay the cost of maintenance"],
  ["抗審查", "Censorship resistance"],
  ["受壓時仍能連結", "Remain connected under pressure"],
  ["聯邦宇宙", "Fediverse"],
  ["提供一條路。搬家之後，總還得有人付房租、整理公共空間。", " offers one route. After moving, someone still has to pay the rent and maintain the commons."],
  ["三種落地實驗", "Three Experiments in Putting Down Roots"],
  ["快閃城市", "Pop-up city"],
  ["包下一個地方，<br>讓網友來住一陣子。", "Take over a place<br>and let online peers live there for a while."],
  ["短期聚集 ↗", "TEMPORARY GATHERING ↗"],
  ["游擊實驗", "Guerrilla experiment"],
  ["帶著技術與理念，<br>投入已經在發生的事。", "Bring skills and ideas<br>into a struggle already under way."],
  ["投入現場 ↗", "ENTER THE FIELD ↗"],
  ["新社會", "New society"],
  ["集結資源，<br>照自己的藍圖蓋聚落。", "Gather resources<br>and build a settlement from a shared plan."],
  ["圈地實踐 ↗", "BUILD A PLACE ↗"],
  ["這幾年看到了許多不同模式，也與不同參與者碰面聊過天，我覺得都是很有意思的田野題材。", "Over the past few years I have encountered several models and spoken with people involved in them. Each offers a different field site."],
  ["快閃城市：Zuzalu 的兩個月", "Pop-up City: Two Months at Zuzalu"],
  ["黑山共和國 Luštica Bay 的月夜", "Moonrise over Luštica Bay, Montenegro"],
  ["Zuzalu 所在的 Luštica Bay・照片／Cat Thu", "Luštica Bay, where Zuzalu took place. Photo: Cat Thu"],
  ["Zuzalu 的零知識證明課程現場", "A zero-knowledge course at Zuzalu"],
  ["Zuzalu 的 ZK 課程・照片／Cat Thu", "A ZK course at Zuzalu. Photo: Cat Thu"],
  ["住在一起，<br>也把課堂、晚餐與工作帶進日常。", "They lived together,<br>bringing classes, dinners and work into daily life."],
  ["約兩個月的共同居住與活動。", "About two months of shared residence and events."],
  ["技術與生活並排", "TECHNOLOGY BESIDE DAILY LIFE"],
  ["ZK、公共財、健康，也包含居民自發的課程與共餐。", "ZK, public goods and health, plus resident-led classes and shared meals."],
  ["散場後繼續分岔", "BRANCHING AFTER THE GATHERING"],
  ["後續計畫在不同城市各自延伸。", "Later projects continued in different cities."],
  ["散場之後，地方留下了什麼？", "What Remains after the Gathering?"],
  ["「介於共同工作空間、招商大會、青年旅館與讀書會的複合體。」", "“A hybrid of coworking space, investment fair, youth hostel and reading group.”"],
  ["黃豆泥・加密社群田野文章", "Yen-Lin Huang · field essay on crypto communities"],
  ["對參與者", "FOR PARTICIPANTS"],
  ["朋友、工作機會<br>下一站的邀請", "Friends, work opportunities<br>and invitations to the next place"],
  ["對在地居民", "FOR LOCAL RESIDENTS"],
  ["哪些關係與資源<br>能待得久一點？", "Which relationships and resources<br>can remain a little longer?"],
  ["我問 Vitalik，Zuzalu 後來怎麼了。他說：去中心了，各地都有人繼續。", "I asked Vitalik what happened after Zuzalu. He said it had decentralised, with people continuing in different places."],
  ["游擊的人：Amir Taaki", "A Guerrilla Experiment: Amir Taaki"],
  ["Amir Taaki 肖像", "Portrait of Amir Taaki"],
  ["Amir Taaki・攝影／Anastasia Taylor-Lind for WIRED", "Amir Taaki. Photo: Anastasia Taylor-Lind for WIRED"],
  ["羅賈瓦 Rojava", "Rojava"],
  ["WIRED 記錄他在中東停留約 15 個月。", "WIRED reported that he spent about fifteen months in the Middle East."],
  ["離開前線之後", "AFTER LEAVING THE FRONT"],
  ["教當地人使用開源軟體與網路，並參與肥料工廠及太陽能研究。", "He taught local people to use open-source software and the internet, and worked on a fertiliser factory and solar research."],
  ["留下的工作", "WORK LEFT BEHIND"],
  ["他也協助設計新教育體系的技術課程。", "He also helped design the technology curriculum for a new education system."],
  ["這些紀錄能確認他做過什麼；課程與工具後來是否延續，公開資料沒有回答。", "The report documents what he did. Public sources do not establish whether the courses or tools continued."],
  ["兩條數位投票路徑：Rarimo × Vocdoni", "Two Routes to Digital Voting: Rarimo × Vocdoni"],
  ["Rarimo Freedom Tool 投票流程", "Rarimo Freedom Tool voting flow"],
  ["Freedom Tool 流程圖／Rarimo 官方文件", "Freedom Tool diagram: official Rarimo documentation"],
  ["先證明資格，再匿名投票", "Prove eligibility, then vote privately"],
  ["手機讀取生物特徵護照，以", "A phone reads a biometric passport. A "],
  ["零知識證明", "zero-knowledge proof"],
  ["確認資格；官方列出的案例包括 Russia2024、Iranians Vote、United Space。", " confirms eligibility without revealing the passport data. Officially listed projects include Russia2024, Iranians Vote and United Space."],
  ["加泰隆尼亞政府的 Vocdoni 案例圖", "Vocdoni case study graphic from the Government of Catalonia"],
  ["Vocdoni 案例圖／Generalitat de Catalunya", "Vocdoni case study graphic: Generalitat de Catalunya"],
  ["讓數位投票可以公開驗證", "Make digital votes publicly verifiable"],
  ["加泰隆尼亞政府把 Vocdoni 列為區塊鏈成功案例：提供去中心化、可普遍驗證的投票基礎設施。", "The Government of Catalonia listed Vocdoni as a blockchain success case: decentralised voting infrastructure whose results can be independently verified."],
  ["兩者不是同一專案", "These are separate projects"],
  ["：Rarimo 著重護照資格與隱私證明；Vocdoni 是另一套數位投票工具。", ": Rarimo centres passport-based eligibility and private proofs. Vocdoni provides a different voting system."],
  ["把理念蓋成一個地方", "Turning an Idea into a Place"],
  ["Network School 在馬來西亞 Forest City 的展示空間", "Network School exhibition space in Forest City, Malaysia"],
  ["Network School 展示空間，Forest City，2026・攝影／CNA・Zamzahuri Abas", "Network School exhibition space, Forest City, 2026. Photo: Zamzahuri Abas for CNA"],
  ["網路社群", "Network community"],
  ["先有共同認同", "Begin with a shared identity"],
  ["集結資源", "Pool resources"],
  ["資金、技能、支持者", "Money, skills and supporters"],
  ["實體聚居", "Live together"],
  ["生活規則", "Rules for daily life"],
  ["在同一棟樓裡實踐", "Put them into practice in one building"],
  ["網路國家的主權願景，還不是已經發生的事。", "The sovereign vision of a network state remains a proposal, not an accomplished fact."],
  ["自由意志主義者，也要做早操？", "Do Libertarians Exercise Together?"],
  ["NETWORK SCHOOL・朋友轉述", "NETWORK SCHOOL · A FRIEND'S ACCOUNT"],
  ["「我還真沒辦法想像一群『自由意志主義者』會一起集體做早操。」", "“I still cannot imagine a group of ‘libertarians’ doing morning exercises together.”"],
  ["黃豆泥", "Yen-Lin Huang"],
  ["一", "I"],
  ["一起生活", "Living together"],
  ["早操、居住問題，<br>還有公開表達的不滿。", "Morning exercises, housing disputes<br>and complaints voiced in public."],
  ["二", "II"],
  ["「百花齊放」", "“Let a hundred flowers bloom”"],
  ["朋友用這四個字，形容<br>徵求意見後有人被逐出的經驗。", "A friend used the phrase to describe<br>people being expelled after feedback was invited."],
  ["三", "III"],
  ["誰能留下？", "Who gets to stay?"],
  ["空間握在主理人手上時，<br>異議者有什麼選擇？", "When organisers control the space,<br>what choices remain for dissenters?"],
  ["以上為講者友人的轉述，尚未經獨立查證。", "This account comes from a friend of the speaker and has not been independently verified."],
  ["第四章　/　PUTTING DOWN ROOTS", "CHAPTER IV  /  PUTTING DOWN ROOTS"],
  ["地方創生<br>山古志村<br>關係人口", "Rural regeneration<br>Yamakoshi Village<br>relationship population"],
  ["山古志村雪景，張寶成攝影", "Snow in Yamakoshi Village, photographed by Pao-Cheng Chang"],
  ["山古志村雪景・攝影／張寶成", "Snow in Yamakoshi Village. Photo: Pao-Cheng Chang"],
  ["遠方的人，也能成為村民嗎？", "Can People Far Away Become Villagers?"],
  ["台灣小隊展示錦鯉 NFT", "Taiwan team displaying a Nishikigoi NFT"],
  ["台灣小隊展示錦鯉 NFT。原文圖／Nishikigoi NFT Discord", "Taiwan team displaying a Nishikigoi NFT. Original image: Nishikigoi NFT Discord"],
  ["關係人口", "Relationship Population"],
  ["不只來玩一次，<br>也不必立刻搬來住。", "More than a single visit,<br>without immediately moving in."],
  ["錦鯉 NFT", "Nishikigoi NFT"],
  ["從一件作品、一個群組，<br>開始與山古志有來往。", "An artwork and a chat group<br>become the start of a relationship with Yamakoshi."],
  ["網路與村落之間，要有人來回跑", "Someone Must Move between the Network and the Village"],
  ["關注與加入", "Notice and join"],
  ["第一次看見山古志", "First encounter with Yamakoshi"],
  ["共同參與", "Participate together"],
  ["討論、提案與資源", "Discussion, proposals and resources"],
  ["地方執行", "Local implementation"],
  ["熟悉村落的人接手", "People who know the village take over"],
  ["持續回應", "Keep responding"],
  ["再把日常需求帶回來", "Bring everyday needs back into the network"],
  ["中介行動者", "Intermediary actors"],
  ["懂地方，也接得住外部資源", "They know the place and can work with outside resources"],
  ["Nishikigoi 專案的投票頁面", "Voting page for the Nishikigoi project"],
  ["原文圖／Nishikigoi NFT Snapshot", "Original image: Nishikigoi NFT Snapshot"],
  ["有投票程序。<br>提案落地，還是得靠人。", " has a voting process.<br>People are still needed to put proposals into practice."],
  ["海外者的數位結社？", "A Digital Association for People Abroad?"],
  ["我們", "US"],
  ["資金", "Funding"],
  ["共同支持什麼？<br>長期成本怎麼付？", "What do we support together?<br>Who pays the long-term cost?"],
  ["人才", "People"],
  ["把專長接起來。<br>也把工作分下去。", "Connect expertise.<br>Share the work."],
  ["資訊", "Knowledge"],
  ["經驗不要只留在<br>滑過就找不到的聊天室。", "Do not leave experience buried<br>in chat rooms that vanish from view."],
  ["制度", "Institutions"],
  ["有人決策、有人接手，<br>新人也進得來。", "Someone decides and someone succeeds them.<br>New people can still enter."],
  ["被機器奴役的未來", "A Future Ruled by Machines"],
  ["兩種未來觀 I・1995・§173", "TWO VISIONS OF THE FUTURE I · 1995 · §173"],
  ["「到了那個階段，<br>機器將實際掌握控制權。」", "“At that stage the machines<br>will be in effective control.”"],
  ["本簡報譯文", "English original"],
  ["〈論工業社會及其未來〉", "Industrial Society and Its Future"],
  ["文章", "The essay "],
  ["作為批判閱讀材料；不認同作者的暴力行動。", " is included for critical reading. This deck rejects the author's violence."],
  ["機器工作，人類稀疏", "Machines Work, Humans Live Apart"],
  ["兩種未來觀 II・1957", "TWO VISIONS OF THE FUTURE II · 1957"],
  ["艾希莫夫《裸陽》<br>", "Isaac Asimov, <i>The Naked Sun</i><br>"],
  ["Solaria／索拉利星", "Solaria"],
  ["工作交給機器人", "Robots do the work"],
  ["人類分散住在各自的領地。", "Humans live far apart on private estates."],
  ["見面變成難事", "Meeting becomes difficult"],
  ["遠距交往很熟悉，肉身相見卻令人不安。", "Remote contact feels normal. Physical presence causes distress."],
  ["不必再為工作聚集之後，<br>還有什麼讓人願意靠近彼此？", "If work no longer brings people together,<br>what would make us seek one another out?"],
  ["Isaac Asimov The Naked Sun 英文版書封", "Cover of Isaac Asimov's The Naked Sun"],
  ["《The Naked Sun》英文版／Penguin Random House", "The Naked Sun, English edition: Penguin Random House"],
  ["繁體中文版", "TRADITIONAL CHINESE EDITION"],
  ["艾西莫夫《裸陽》繁體中文版書封", "Traditional Chinese cover of Isaac Asimov's The Naked Sun"],
  ["《機器人四部曲 II：裸陽》繁體中文版／貓頭鷹出版社", "Robot Series II: The Naked Sun, Traditional Chinese edition: Owl Publishing House"],
  ["01｜還有多少「足夠的工作」？", "01 | How Much Work Is Enough?"],
  ["工作還在。<br><em>薪水呢？</em>", "Work remains.<br><em>What about wages?</em>"],
  ["Susskind 看的是任務如何被逐步接手。<br>職缺沒有歸零，仍可能發生薪資下降、<br>工時不穩；收入、地位與意義，也跟著鬆動。", "Susskind asks how machines gradually take over tasks.<br>Jobs need not disappear for wages to fall or hours to become unstable.<br>Income, status and meaning can all weaken."],
  ["過去：新任務曾抵銷替代。", "PAST: new tasks offset displacement."],
  ["往後：新任務也可能交給機器。", "FUTURE: machines may take the new tasks too."],
  ["02｜一份工作，是一束任務", "02 | A Job Is a Bundle of Tasks"],
  ["一份工作", "ONE JOB"],
  ["觀察", "Observe"], ["診斷", "Diagnose"], ["操作", "Operate"], ["記錄", "Record"], ["協調", "Coordinate"], ["判斷", "Judge"],
  ["示意任務，非特定職業清單", "Illustrative tasks, not a list for any one occupation"],
  ["替代力量", "Substitution"],
  ["機器接手其中一部分，<br>對人的需求可能減少。", "Machines take over some tasks.<br>Demand for people may fall."],
  ["互補力量", "Complementarity"],
  ["生產力提高、需求擴大，<br>也可能長出新的部門與任務。", "Productivity and demand can rise.<br>New sectors and tasks may appear."],
  ["不用先做出通用人工智慧，也能一步一步改變一份工作。", "Changing a job task by task does not require artificial general intelligence."],
  ["03｜有工作搆不到，還是工作不夠？", "03 | Out of Reach, or Not Enough Work?"],
  ["摩擦與錯配", "FRICTION AND MISMATCH"],
  ["機會在另一邊", "The opportunity is elsewhere"],
  ["技能", "Skills"], ["能力與職缺對不上", "Abilities do not match vacancies"],
  ["認同", "Identity"], ["不願或不敢換一種身分", "Changing occupational identity feels impossible"],
  ["地點", "Place"], ["機會集中，搬遷有成本", "Opportunity is concentrated and moving is costly"],
  ["結構性需求不足", "STRUCTURAL LACK OF DEMAND"],
  ["過了橋，也沒有職缺", "There is no job on the other side"],
  ["即使再訓練完成，市場仍可能<br>不需要那麼多人類勞動。", "Even after retraining, the market may still<br>need less human labour."],
  ["商品與服務變多，<br>人的工作機會未必跟著增加。", "More goods and services do not guarantee<br>more opportunities for people to work."],
  ["遠距與遊牧鬆動了地點限制。技能、照護、收入分配，還在原地等著。", "Remote work and nomadism loosen the constraint of place. Skills, care and income distribution remain unresolved."],
  ["04｜機器創造的繁榮，分到誰手上？", "04 | Who Receives the Prosperity Machines Create?"],
  ["人力資本", "HUMAN CAPITAL"], ["技能・經驗・知識", "Skills · experience · knowledge"],
  ["靠工資分享收益。<br>需求與薪資卻可能往下走。", "People share in gains through wages.<br>Demand and pay may still fall."],
  ["其他資本", "OTHER CAPITAL"], ["機器・土地・股權・資料", "Machines · land · equity · data"],
  ["持有資產的人，<br>可能拿走更多新增收益。", "Asset owners may capture<br>a larger share of new gains."],
  ["Susskind 的回應", "Susskind's response"],
  ["收入分享、資本分享、勞動保障；也要處理大型科技權力與休閒的公共安排。", "Share income and capital, protect labour, curb concentrated technology power and build public institutions for leisure."],
  ["UBI／CBI", "UBI / CBI"],
  ["：照護與社群貢獻，要不要換成收入？由誰認定？", ": should care and community contributions count as income-bearing activity, and who decides?"],
  ["05｜少一點上班，空出來做什麼？", "05 | What Might Less Work Make Possible?"],
  ["學習、創作、照護、<br>政治參與、社交、遊戲。", "Learning, making and care.<br>Politics, friendship and play."],
  ["後工作主張讓人有能力拒絕惡劣的工作。<br>少賣一點時間，不代表人的活動也少了。", "Post-work politics seeks the power to refuse bad work.<br>Selling less time does not mean doing less with life."],
  ["合成自由", "Synthetic Freedom"],
  ["需要收入、時間、公共服務。<br>不能只叫大家勇敢做自己。", " requires income, time and public services.<br>Individual courage is not enough."],
  ["06｜一次活動，怎麼變成長期的力量？", "06 | How Does an Event Become Lasting Power?"],
  ["他們批評", "They criticise "],
  ["常民政治", "folk politics"],
  ["：短期、地方、直接行動可以聚人；若始終停在這裡，就很難改變更大的制度。", ": short, local and direct action can bring people together, but cannot by itself change larger institutions."],
  ["共同想像", "Shared horizon"], ["提出值得爭取的未來", "Name a future worth pursuing"],
  ["組織累積", "Build organisations"], ["社群、媒體與工會", "Communities, media and unions"],
  ["擴大聯盟", "Broaden alliances"], ["連結政治組織與公共討論", "Connect political organisations with public debate"],
  ["持續施力", "Sustain pressure"], ["政策、投資、公共制度", "Policy, investment and public institutions"],
  ["這也是快閃城市會遇到的問題：人散了，事情還做得下去嗎？", "Pop-up cities face the same question: when people disperse, can the work continue?"],
  ["07｜後工作的要求，與它的岔路", "07 | Post-Work Demands and Their Diverging Paths"],
  ["四項要求，一起推", "FOUR CONNECTED DEMANDS"],
  ["必要勞動自動化", "Automate necessary labour"],
  ["縮短工作週", "Shorten the working week"],
  ["足以生活的基本收入", "A basic income sufficient to live on"],
  ["鬆動工作倫理", "Loosen the work ethic"],
  ["走下去，也可能走歪", "THE PATH CAN BEND"],
  ["富國享受紅利，窮國繼續低薪勞動。", "Rich countries may take the gains while poorer countries continue low-paid work."],
  ["機器多了，能源與生態負擔也多了。", "More machines can increase energy use and ecological costs."],
  ["男性少上班，女性繼續無薪照護。", "Men may work fewer paid hours while women continue unpaid care."],
  ["作者要求的解放，同時包含全球、性別與生態正義。", "The authors' account of liberation includes global, gender and ecological justice."],
  ["08｜什麼才算親勞工 AI？", "08 | What Counts as Pro-Worker AI?"],
  ["Acemoglu／Autor／Johnson", "Acemoglu / Autor / Johnson"],
  ["關心的是：專業價值、報酬與自主，有沒有一起增加？", " ask whether professional value, pay and autonomy rise together."],
  ["增強勞動／資本", "Augment labour / capital"], ["效率提高。<br>收益分配仍未定。", "Efficiency rises.<br>Distribution remains unsettled."],
  ["自動化", "Automation"], ["機器接手任務。<br>對人的需求可能下降。", "Machines take over tasks.<br>Demand for people may fall."],
  ["專業平準化", "Level expertise"], ["新手更容易上手。<br>原有專業也可能貶值。", "Novices gain access.<br>Existing expertise may lose value."],
  ["創造新任務", "Create new tasks"], ["出現新的工作，<br>需要人的判斷與專業。", "New work appears<br>that needs human judgement and expertise."],
  ["產出增加了、按鈕變少了，還不足以回答這個問題。", "Higher output and fewer clicks do not answer the question."],
  ["09｜同一項技術，可以分成三條路", "09 | One Technology, Three Possible Designs"],
  ["自動化器", "Automator"], ["技師成為指令的眼睛與雙手", "The mechanic becomes the system's eyes and hands"],
  ["技師助手", "Mechanic's assistant"], ["協助診斷、判斷與複雜修復", "Support diagnosis, judgement and complex repairs"],
  ["轉軌助手", "Transition assistant"], ["支持學習新領域與新任務", "Support learning in a new field and new tasks"],
  ["航空維修的 AI", "AI FOR AIRCRAFT MAINTENANCE"],
  ["三種假想設計，並非演進順序", "Three hypothetical designs, not a sequence of progress"],
  ["改變誘因的工具", "TOOLS THAT CHANGE INCENTIVES"],
  ["採購・補助・稅制・競爭政策・勞工發言權", "Procurement · subsidies · taxation · competition policy · worker voice"],
  ["電工、教師、專利審查與無障礙工作已有輔助案例；部署也可能走向中央監控。", "Assistive cases already exist in electrical work, teaching, patent review and accessibility. Deployment can also move towards central surveillance."],
  ["10｜帶著這些分歧，繼續討論", "10 | Questions to Carry Forward"],
  ["人", "People"], ["用了工具，我還留下哪些能力？", "Which abilities remain with me after I use the tool?"],
  ["勞動", "Labour"], ["新任務、收入與收益，分給了誰？", "Who receives the new tasks, income and gains?"],
  ["社群", "Community"], ["誰有力量改規則？誰被排除？", "Who can change the rules, and who gets excluded?"],
  ["誰設計、採購、管理，又向誰負責？", "Who designs, buys and manages the system, and to whom are they accountable?"],
  ["這幾位作者對市場、行動者，<br>甚至工作本身的未來，都不完全同意。", "These authors disagree about markets, political actors<br>and even the future of work itself."],
  ["序章", "PROLOGUE"],
  ["番外篇・兩種未來觀", "EPILOGUE · TWO VISIONS OF THE FUTURE"],
  ["番外篇・關於工作的一點討論", "EPILOGUE · NOTES ON WORK"],
  ["第一章", "CHAPTER I"], ["第二章", "CHAPTER II"], ["第三章", "CHAPTER III"], ["第四章", "CHAPTER IV"],
  ["來源與延伸 ↗", "SOURCES AND READING ↗"],
  ["進入簡報", "Skip to presentation"],
  ["← 簡報集", "← Decks"],
  ["飛地台灣季・London", "Nowhere Taiwan Season · London"],
  ["目錄 G", "INDEX G"],
  ["無國界的遊牧簡報", "Borderless Nomadism presentation"],
  ["簡報控制", "Presentation controls"],
  ["上一頁", "Previous slide"], ["下一頁", "Next slide"],
  ["閱讀 R", "READ R"], ["講者筆記 N", "NOTES N"], ["全螢幕 F", "FULLSCREEN F"],
  ["操作說明", "Help"], ["關閉視窗", "Close dialog"],
];

const enNotes = [
  "Nowhere's Taiwan Across Cities season. Organised by Nowhere Bookshop and Nowhere UK; hosted by Zhi-Hao at Studio 8, 181 Mansfield Road, London NW3 2HP. The event ran 14:00–15:30 London time, with a 45–60 minute talk and about 30 minutes for questions.",
  "The four chapters follow the speaker's supplied outline. The epilogue can be selected according to the time available, or opened directly from the index.",
  "These are two tendencies I encountered in Chiang Mai, not a census of all digital nomads. One person may move between them at different stages of life.",
  "In my Chiang Mai essay, people came and went while event information remained concentrated on Chinese platforms. 'Unsustainable' was my field judgement at the time, not a verdict on all remote workers; Copium is used here as a metaphor.",
  "Do not turn movement among different communities into an inevitable route. Dali to Chiang Mai describes one group in the essay; 706 Youth Space was another point of origin.",
  "",
  "",
  "The speaker develops these two cases orally. The deck does not infer the driver's nationality, reason for migration or exact words, and does not treat WeChat use as evidence of a political position.",
  "Keywords from the supplied outline are retained for oral explanation. The deck does not invent family reactions, a conversion narrative or the woman's personal history.",
  "Amateur radio predates the internet. It appears here to compare how technologies sustain communities, not to claim that radio began online. The image is the museum's 2022 station photograph, not a record of the speaker's encounter with the volunteer.",
  "",
  "This is a conceptual relationship diagram. It does not claim that modern borders, ideas of home and household registration arose simultaneously. Following the cited essay, it asks how institutions identify populations, attach obligations and control movement.",
  "Platform accounts can function as gateways to identity, but they do not have the same legal status as nationality. The analogy does not equate an account suspension with formal loss of citizenship.",
  "This is a human-centred design direction, not a claim that every digital wallet meets it. Revocation, backup, redress and verifier-side records must still be assessed case by case.",
  "The outline's image of a 'PGP key publication project' is retained, but the precise subject is source-code publication, not the release of anyone's private key. Printed source could be retyped or scanned; this case does not prove that every export of cryptographic software was lawful.",
  "This was a political and cultural declaration, not proof that the internet lacks jurisdiction or physical dependencies. The slide quotes only a short passage; the original sentence continues.",
  "",
  "The slide sits in the 2000s–2010s to follow the project's late-1990s origins; it does not move Elixus's founding date to 2000.",
  "The five keys organise possible routes away from a platform. The point is not a list of replacement services, but how a community survives a change of tools.",
  "",
  "Projects differ in duration and organisation. Resident notes and photographs establish shared living, classes and daily routines at Zuzalu. Frontier Tower is closer to an ongoing space than a typical short gathering and is kept as a boundary case.",
  "I asked Vitalik what happened after Zuzalu. His answer was that it decentralised and people continued in different places. This is a conversation recorded in my essay, not evidence of any city's long-term results.",
  "The speaker's essay provides the context for Taaki's involvement in Rojava; WIRED's 2017 report supplies checkable details. Long-term use of the work remains unverified. An imprecise claim about diplomatic recognition was removed, and the place name was corrected to Rojava.",
  "The speaker's intended case is retained. Rarimo's passport and zero-knowledge architecture can be verified, but the referenced Catalonia event could not. The diagram shows the general Freedom Tool flow, not a verified Catalan vote.",
  "Network School is presented as an example from the speaker's essay. The network-state sovereignty proposal is not described as an accomplished fact.",
  "A friend used 'Let a hundred flowers bloom' to describe an experience in which feedback was invited and someone was then expelled. When presented, it remains attributed hearsay rather than a verified general policy; the political analogy is not treated as historical equivalence.",
  "",
  "The co-authors spent half a day in the village. 'Relationship population' is an analytical frame; holding an NFT does not by itself make someone an active participant or legal resident.",
  "",
  "Funding, people, knowledge and institutions come from the supplied outline. This is an open discussion frame, not a claim that a formal association already exists.",
  "",
  "The quotation opens a question: when life depends on machines, can people still alter the goals of the system? The deck separates critical reading of the text from the author's violence.",
  "The novel first appeared in 1957. The English image is a current publisher edition, not the first edition. This is a literary setting; it should not be merged with the later Solarian setting in Foundation and Earth or casually labelled a utopia.",
  "Leontief's horses are an analogy for substitution, not proof that people must be excluded from work altogether.",
  "",
  "",
  "",
  "",
  "The associated material contrasts long-term neoliberal intellectual and organisational work. The slide borrows the strategic question without declaring every local organisation a failure.",
  "",
  "This summarises Building Pro-Worker AI. It is an analytical framework and an authorial argument, not an automatic score applicable to every tool.",
  "The three aircraft-maintenance tools are hypothetical designs from the source parable, not products claimed to be on the market. The animation presents them in sequence while the caption states that they are parallel directions.",
  "The slide retains the agreements and disagreements on source pages 53–54 and the four layers of questions on pages 55–59. It also returns the epilogue to overseas digital association: common life requires maintainers, participants and people able to change institutions.",
];
// Source pages 6 and 31 were intentionally consolidated/removed in the 41-slide deck.
const deckNotes = enNotes.filter((_, index) => index !== 5 && index !== 30);

const enSources = {
  field: { title: "Yen-Lin Huang | Chiang Mai field notes and three experiments in crypto-community settlement", detail: "Two essays supplied by the speaker. Pop-up city, guerrilla experimentation and new society are the speaker's working categories. The Chiang Mai account describes a particular field visit and does not represent every digital nomad." },
  outline: { title: "Yen-Lin Huang | Talk outline and orally presented cases", detail: "The overseas WeChat user, Boston driver, daughter from Yunlin, SCP, Haitang and museum volunteer remain case prompts from the supplied outline. No unprovided biography, dialogue or identity has been invented." },
  identity: { title: "From Household Registers to Exile: Identity Autonomy in Digital Asia", url: "https://cjdproject.web.nycu.edu.tw/2025/08/24/from-households-to-exiles-tracing-the-rise-of-identity-autonomy-in-asias-digital-age/", detail: "Yen-Lin Huang, 2025. Used for the division of institutional roles, the dual identity management of states and platforms, and three central questions. Policy dates in the essay are not presented as the latest 2026 status." },
  internet: { title: "The Internet Does Not Merely Return 404s: It Decays Faster Than We Think", url: "https://artouch.com/artouch-column/mintmint-column/content-146860.html", detail: "Yen-Lin Huang, ARTouch, 2 July 2024. Used for data loss, maintenance costs and autonomous networks; the image is a locally preserved original from the author's site." },
  elixus: { title: "Revisiting Elixus after Twenty Years: A Tribal Aesthetic Born Online", url: "https://artouch.com/web3-x-art/content-107738.html", detail: "Yen-Lin Huang, ARTouch, 2 June 2023. Covers Elixus across IRC, blogs and tea-house meetings, and the 2001 Piraport and PiraGene identity and copyright experiments." },
  escape: { title: "An Escape Room about Social Platforms", url: "https://mashbean.net/decks/platform-escape-room-2026/", detail: "Yen-Lin Huang, 2026. The five exit routes and the distinctions among protocol, operations and governance come from slides 21–27 of the earlier deck; no long passage from the book is reproduced." },
  village: { title: "Regional Revitalisation and Digital Villagers: Visiting Yamakoshi and Its DAO", url: "https://artouch.com/artouch-column/mintmint-column/content-136816.html", detail: "Chang Pao-Cheng and Yen-Lin Huang, ARTouch, 29 March 2024. Snow photograph by Chang; NFT image from Chang's collection, work by ykxotkx; group image credited in the article to Nishikigoi NFT Discord; governance screen from Nishikigoi NFT Snapshot. A half-day visit does not establish long-term demographic or economic effects." },
  pgp: { title: "Philip Zimmermann | Preface to PGP Source Code and Internals", url: "https://www.philzimmermann.com/EN/essays/BookPreface.html", detail: "MIT Press, 1995. The book published C source code, not users' private keys. The slide focuses on the tension between print publication and controls on exporting cryptographic software." },
  declaration: { title: "John Perry Barlow | A Declaration of the Independence of Cyberspace", url: "https://www.eff.org/cyberspace-independence", detail: "Original dated 8 February 1996 and preserved by EFF. The deck quotes a short passage and frames the remaining text as the speaker's question to this historical declaration." },
  zuzalu: { title: "Cat Thu | Notes from Zuzalu", url: "https://www.catthu.com/writings/zuzalu-experience/", detail: "A resident account of shared life, classes, meals and discussion at Zuzalu in Montenegro in April and May 2023. The Luštica Bay moonrise and ZK class photographs are by Cat Thu." },
  rojavaWired: { title: "WIRED | Amir Taaki's Work in Rojava", url: "https://www.wired.com/2017/03/anarchist-bitcoin-coder-found-fighting-isis-syria/", detail: "Andy Greenberg, 29 March 2017. Reports about fifteen months in the Middle East; after leaving the front, Taaki taught open-source software and internet use, worked on a fertiliser factory and solar research, and helped design a technical curriculum. Portrait by Anastasia Taylor-Lind for WIRED." },
  networkSchool: { title: "CNA | Reporting from Network School in Forest City", url: "https://www.channelnewsasia.com/asia/network-school-johor-malaysia-lessons-foreign-tech-investors-6285236", detail: "29 July 2026. The slide uses CNA's 16 July 2026 photograph of the Network School display space by Zamzahuri Abas. The image documents a physical site and does not endorse its politics or operating claims." },
  rarimo: { title: "Rarimo | Freedom Tool Documentation", url: "https://docs.rarimo.com/freedom-tool/", detail: "Describes passport verification, zero-knowledge proofs and blockchain voting components, and lists Russia2024, Iranians Vote and United Space. No direct source was found for a 'Rarimo Catalonia vote', so that outline prompt is marked as unverified." },
  vocdoni: { title: "Government of Catalonia | Vocdoni Digital Voting Case", url: "https://politiquesdigitals.gencat.cat/ca/detalls/Article/Nou-article-04638", detail: "The Government of Catalonia lists Vocdoni as a blockchain success case and describes a universally verifiable, decentralised, anonymous and censorship-resistant voting infrastructure. It is separate from Rarimo and is not presented as a recognised national election." },
  radio: { title: "Deutsches Museum | Amateur Radio / DLØDM", url: "https://www.deutsches-museum.de/museumsinsel/programm/veranstaltung/amateurfunk", detail: "The museum confirms DLØDM amateur-radio demonstrations in cooperation with DARC. The elderly volunteer is the speaker's personal observation; no name is inferred." },
  radioImage: { title: "Deutsches Museum | DLØDM Amateur Radio Licence", url: "https://blog.deutsches-museum.de/2024/12/16/dloedm-amateursendelizenz-so-alt-wie-unser-grundgesetz", detail: "Museum article from 2024. The slide uses a June 2022 station photograph credited to Deutsches Museum, Munich; it is not a photograph of the speaker's visit." },
  asimov: { title: "Isaac Asimov | The Naked Sun (1957)", url: "https://www.penguinrandomhouse.com/books/5794/the-naked-sun-by-isaac-asimov/", detail: "Solaria's sparse population, robot labour and mediated social contact are used as a literary comparison, not a prediction or a statistic about real society." },
  asimovZh: { title: "Owl Publishing | Traditional Chinese Edition of The Naked Sun", url: "https://pansci.asia/archives/books/%E6%A9%9F%E5%99%A8%E4%BA%BA%E5%9B%9B%E9%83%A8%E6%9B%B2%E4%B9%8B%E2%85%B1%EF%BC%9A%E8%A3%B8%E9%99%BD", detail: "Traditional Chinese edition published in 2013, translated by Yeh Lee-hwa, ISBN 9789862621530. The deck shows the English and Taiwan Traditional Chinese covers together." },
  asimovText: { title: "The Naked Sun | Plot and Textual Context for Solaria", url: "https://websites.umich.edu/~engb415/literature/cyberzach/Asimov/naksun.html", detail: "Used to check the work and its plot. The slide avoids population figures from later portrayals of Solaria in Foundation and Earth." },
  ted: { title: "Ted Kaczynski | Industrial Society and Its Future, paragraph 173", url: "https://www.washingtonpost.com/wp-srv/national/longterm/unabomber/manifesto.text.htm", detail: "Original text from 1995, paragraph 173. A short quotation is used for critical reading; the deck rejects the author's violence." },
  ai: { title: "AI, Work and Agency | Cultural Frontline II Reading Group", url: "https://mashbean.net/decks/ai-work-agency-reading-1/#15", detail: "Yen-Lin Huang. Preserves the disagreements among Susskind, Srnicek and Williams, and Acemoglu, Autor and Johnson. The authors' assumptions are not treated as completed empirical outcomes." },
};

const enTerms = {
  nomad: ["Digital nomad", "A person who uses digital tools to work, maintain income and community, and live across places. This talk asks what motivates movement and how people organise; its two types are observational ideals, not fixed personalities or a moral ranking.", "field"],
  lie: ["Lying flat / Copium", "The speaker uses lying flat for a temporary withdrawal from a high-pressure life. Copium blends cope and opium in internet slang: self-consolation in difficulty. Here it is a cultural metaphor, not a diagnosis or a reference to drug use.", "field"],
  web3: ["Web3 and crypto communities", "A broad label for communities using blockchains, cryptography, on-chain assets or decentralised tools. Their politics, income and resources vary widely.", "field"],
  dali: ["Summer of Tile Cats / Dalifornia", "A 2022 gathering in Dali, Yunnan, described in the speaker's essay. 'Dalifornia' borrows an image of Californian counterculture. After disruption, activity continued through decentralised coordination and some participants later moved to Chiang Mai.", "field"],
  seven: ["706 Youth Space", "A youth co-living, cultural exchange and self-organisation network that developed in Beijing. The deck uses only the speaker's observation that some participants later moved to Chiang Mai; it does not claim the whole organisation relocated.", "field"],
  scp: ["SCP Foundation", "A collaborative fiction community built around files about a fictional institution and anomalous objects. The 'Foundation' belongs to the story world, not a real organisation containing anomalies.", "outline"],
  haitang: ["Haitang Forum", "An online literature and subculture case retained from the speaker's outline, used to discuss anonymity, reading, creation and belonging without inventing unprovided history.", "outline"],
  ham: ["Amateur radio", "Licensed non-commercial radio practice. The DLØDM museum station demonstrates how technical infrastructure, volunteers and shared protocols sustain contact.", "radio"],
  registry: ["Household registration", "A historical technique for registering populations, tying people to place and assigning taxes, labour and administrative obligations. The slide uses it as an institutional lens, not a single universal history.", "identity"],
  exile: ["Seeking refuge beyond the register", "An allusion to people who fled Qin rule in the Peach Blossom Spring tradition. Here it names the wish to live beyond a governing register, without claiming that digital exit removes law or power.", "identity"],
  ssi: ["Self-sovereign identity", "An approach that separates issuance, personal custody and presentation of credentials. It aims to give individuals more control, while revocation, recovery and verifier records still require institutional design.", "identity"],
  zkp: ["Zero-knowledge proof", "A cryptographic method for proving a statement, such as eligibility, without revealing all underlying information. Privacy depends on the complete system, not the proof alone.", "rarimo"],
  pgp: ["Pretty Good Privacy (PGP)", "Encryption software created by Philip Zimmermann. The 1995 MIT Press book published its C source code amid US export-control disputes.", "pgp"],
  cypher: ["Cypherpunks", "A loose movement that treated cryptography and deployable code as tools for privacy and political autonomy. Members did not share one politics or organisation.", "pgp"],
  elixus: ["Elixus", "A Taiwan-based artists' network whose name came from Elixir Nexus. From the late 1990s into the 2000s it connected IRC, blogs, free software and physical gatherings.", "elixus"],
  piraport: ["Piraport Passport", "An identity and copyright art experiment associated with the 2001 Kingdom of Piracy project. It used the form of a passport as an artistic and social device, not a state document.", "elixus"],
  fediverse: ["Fediverse", "Federated social services that can communicate through shared protocols. Portability and federation help, but operations, moderation, governance and funding still require people and institutions.", "escape"],
  popup: ["Pop-up city", "A time-limited co-living and event format combining residence, learning, work and community life. Duration and access vary by project.", "zuzalu"],
  guerrilla: ["Guerrilla experimentation", "The speaker's category for bringing skills and political ideas into an existing struggle or institution. It does not imply that every participant shares the same goals or methods.", "field"],
  rojava: ["Rojava", "The Autonomous Administration of North and East Syria. WIRED documented specific work by Amir Taaki; the deck does not infer long-term adoption from that visit.", "rojavaWired"],
  rarimo: ["Rarimo and Vocdoni are separate projects", "Rarimo Freedom Tool centres passport-based eligibility and privacy proofs. Vocdoni is a different digital voting infrastructure cited by the Government of Catalonia.", "rarimo"],
  network: ["New Society", "A proposal to turn an online community into a physical settlement. Network School is used as an experiment in shared space, not proof that a sovereign network state already exists.", "networkSchool"],
  dao: ["DAO", "A decentralised autonomous organisation: governance procedures and assets coordinated through software and collective rules. Voting code does not remove the need for local implementation, maintenance or accountability.", "village"],
  nft: ["Nishikigoi NFT", "A digital artwork and community-access project linked to Yamakoshi. It can open a path to participation but does not itself grant residence or citizenship.", "village"],
  relation: ["Relationship population", "People between short-term tourists and permanent residents who maintain ongoing ties, cooperation and contribution to a place.", "village"],
  mediator: ["Intermediary actor", "A person who understands local life and can connect outside resources. Digital tools do not replace this relationship work.", "village"],
  solaria: ["Solaria", "The planet in Isaac Asimov's The Naked Sun (1957): few people, many robots and social life conducted at a distance. It is a fictional setting, not a promise about the future.", "asimov"],
  ted: ["Ted Kaczynski", "Author of Industrial Society and Its Future and perpetrator of the Unabomber attacks. The deck uses one sentence as critical reading and rejects his violence.", "ted"],
  complement: ["Substitution and complementarity", "Substitution means machines take over tasks people performed. Complementarity means tools raise the productivity and demand for human tasks. Both can occur, and output, jobs and wages need not rise together.", "ai"],
  cbi: ["UBI / CBI", "UBI is unconditional universal basic income. Susskind's CBI attaches income to community contribution, raising questions about who defines contribution, judges eligibility and values unpaid care.", "ai"],
  folk: ["Folk politics", "Srnicek and Williams's term for politics centred on immediacy, locality, small scale and direct experience. It is distinct from populism and does not dismiss all local action.", "ai"],
  freedom: ["Synthetic freedom", "Freedom supported by income, time, knowledge, health and public infrastructure. The concept asks what people can actually do, not only what is formally permitted.", "ai"],
  proworker: ["Pro-worker AI", "Acemoglu, Autor and Johnson ask whether technology expands human tasks and professional value while sharing gains with workers. Efficiency or a final human confirmation step is not enough by itself.", "ai"],
};

const replaceAll = (input) => {
  let output = input;
  // Replace complete phrases before shorter labels. Single-character CJK
  // replacements corrupt compound words (for example, 人 inside 人才), so
  // they are deliberately excluded and handled by complete phrase entries.
  for (const [from, to] of [...pairs]
    .filter(([from]) => [...from.replace(/<[^>]*>/g, "")].length > 1)
    .sort((a, b) => b[0].length - a[0].length)) {
    output = output.split(from).join(to);
  }
  return output;
};

const extraPairs = [
  ["<h1>無國界的<span>遊牧</span></h1>", "<h1>Borderless <span>Nomadism</span></h1>"],
  ["黃豆泥 Yen-Lin (mashbean) Huang", "Yen-Lin (mashbean) Huang"],
  ["<sup>註</sup>", '<sup aria-label="note">note</sup>'],
  ["人在海外<br>還是使用微信", "Living abroad,<br>still using WeChat"],
  ["語言・熟人<br>資訊・共同時間", "Language · familiar people<br>news · shared time"],
  ["波士頓<br>罵罵咧咧的司機", "A driver in Boston<br>cursing as he goes"],
  ["移居・日常<br>故鄉・情緒", "Migration · daily life<br>home · emotion"],
  ["進了名冊，<br>也就進了治理的範圍。", "Once entered on a register,<br>a person enters the reach of government."],
  ["IRC、部落格、紫藤廬。<br>網友也會在茶館見面。", "IRC, blogs and Wistaria Tea House.<br>Online friends also met over tea."],
  ["身分、版權、交互信任，<br>都可以拿來當創作材料。", "Identity, copyright and mutual trust<br>could all become artistic material."],
  ["住在一起，<br>也把課堂、晚餐與工作帶進日常。", "They lived together,<br>bringing classes, dinners and work into daily life."],
  ["不只來玩一次，<br>也不必立刻搬來住。", "More than a single visit,<br>without having to move in at once."],
  ["從一件作品、一個群組，<br>開始與山古志有來往。", "An artwork and a group chat<br>became a first connection to Yamakoshi."],
  ["共同支持什麼？<br>長期成本怎麼付？", "What will we support together?<br>Who pays the long-term costs?"],
  ["把專長接起來。<br>也把工作分下去。", "Connect specialised skills.<br>Distribute the work."],
  ["經驗不要只留在<br>滑過就找不到的聊天室。", "Keep experience from disappearing<br>inside a fast-moving chat room."],
  ["有人決策、有人接手，<br>新人也進得來。", "Decisions, succession<br>and a path for newcomers."],
  ["即使再訓練完成，市場仍可能<br>不需要那麼多人類勞動。", "Even after retraining, the market may still<br>need less human labour."],
  ["商品與服務變多，<br>人的工作機會未必跟著增加。", "More goods and services do not guarantee<br>more opportunities for people to work."],
  ["靠工資分享收益。<br>需求與薪資卻可能往下走。", "People share in gains through wages.<br>Demand and pay may still fall."],
  ["持有資產的人，<br>可能拿走更多新增收益。", "Asset owners may capture<br>a larger share of new gains."],
  ["學習、創作、照護、<br>政治參與、社交、遊戲。", "Learning, making and care.<br>Politics, friendship and play."],
  ["後工作主張讓人有能力拒絕惡劣的工作。<br>少賣一點時間，不代表人的活動也少了。", "Post-work politics seeks the power to refuse bad work.<br>Selling less time does not mean doing less with life."],
  ["需要收入、時間、公共服務。<br>不能只叫大家勇敢做自己。", "It requires income, time and public services.<br>Individual courage is not enough."],
  ["效率提高。<br>收益分配仍未定。", "Efficiency rises.<br>Distribution remains unsettled."],
  ["機器接手任務。<br>對人的需求可能下降。", "Machines take over tasks.<br>Demand for people may fall."],
  ["新手更容易上手。<br>原有專業也可能貶值。", "Novices gain access.<br>Existing expertise may lose value."],
  ["出現新的工作，<br>需要人的判斷與專業。", "New work appears<br>that needs human judgement and expertise."],
  ["<span>人</span><p>Which abilities", "<span>People</span><p>Which abilities"],
  ["這幾位作者對市場、行動者，<br>甚至工作本身的未來，都不完全同意。", "These authors disagree about markets, political actors<br>and even the future of work itself."],
  ["加泰隆尼亞政府把 Vocdoni 列為區塊鏈成功案例：提供去中心化、可普遍驗證的投票基礎設施。", "The Government of Catalonia lists Vocdoni as a blockchain success case offering decentralised, universally verifiable voting infrastructure."],
  ["著重護照資格與隱私證明；Vocdoni 是另一套數位投票工具。", "centres passport eligibility and privacy proofs; Vocdoni is a separate digital voting tool."],
  ["data-chapter=\"序\"", "data-chapter=\"Prologue\""], ["data-chapter=\"一\"", "data-chapter=\"I\""],
  ["data-chapter=\"二\"", "data-chapter=\"II\""], ["data-chapter=\"三\"", "data-chapter=\"III\""],
  ["data-chapter=\"四\"", "data-chapter=\"IV\""], ["data-chapter=\"番外\"", "data-chapter=\"Epilogue\""],
  ["data-chapter=\"工作\"", "data-chapter=\"Work\""], ["aria-label=\"放大：", "aria-label=\"Enlarge: "],
  ["<span>一</span>", "<span>I</span>"], ["<span>二</span>", "<span>II</span>"],
  ["<span>三</span>", "<span>III</span>"], ["<span>四</span>", "<span>IV</span>"],
];

const applyExtraPairs = (input) => {
  let output = input.replaceAll("<br />", "<br>");
  for (const [from, to] of extraPairs) output = output.split(from).join(to);
  return output;
};

let index = await fs.readFile(path.join(sourceDir, "index.html"), "utf8");
index = applyExtraPairs(replaceAll(index.replaceAll("<br />", "<br>")))
  .replace('<html lang="zh-Hant">', '<html lang="en-GB">')
  .replaceAll("https://mashbean.net/decks/borderless-nomadism-2026/", "https://mashbean.net/decks/borderless-nomadism-2026-en/")
  .replace(/(<link rel="stylesheet" href="controls\.css"\s*\/?>)/, '$1\n    <link rel="stylesheet" href="english.css" />')
  .replace('<a href="../borderless-nomadism-2026-en/" lang="en">EN</a>', '')
  .replace(/(<button id="index-button"[\s\S]*?<\/button>)/, '$1\n      <a class="language-switch" href="../borderless-nomadism-2026/">ZH</a>');

let noteIndex = 0;
index = index.replace(/<template class="speaker-notes"\s*>[\s\S]*?<\/template\s*>/g, () => {
  const text = deckNotes[noteIndex++] || "";
  return `<template class="speaker-notes">${text.replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</template>`;
});
if (noteIndex !== deckNotes.length) throw new Error(`Expected ${deckNotes.length} notes, replaced ${noteIndex}`);

index = index
  .replace(/「只要將整個世界倒轉 90\s*度，人們就會發現一個平時難以啟齒的真理：躺平才是真正的站立，而站立的正是爬行。」/g, "“Turn the whole world ninety degrees and an awkward truth appears: lying flat is standing upright, while those who stand are the ones crawling.”")
  .replace('content="People, Labour, Community, Place, World。飛地台灣季倫敦場，Yen-Lin Huang的digital nomads田野與落地生根實驗，附 AI 與工作番外篇。"', 'content="People, labour, community, place and world: Yen-Lin Huang’s field notes on digital nomads and experiments in putting down roots, with an epilogue on AI and work."')
  .replace('content="PEOPLE · LABOUR · COMMUNITY · PLACE · WORLD｜Yen-Lin Huang｜飛地台灣季・倫敦 2026.09.20"', 'content="PEOPLE · LABOUR · COMMUNITY · PLACE · WORLD | Yen-Lin Huang | Nowhere Taiwan Season · London · 20 September 2026"')
  .replace(/加泰隆尼亞政府把 Vocdoni\s*列為區塊鏈成功案例：提供去中心化、可普遍驗證的投票基礎設施。/g, "The Government of Catalonia lists Vocdoni as a blockchain success case offering decentralised, universally verifiable voting infrastructure.")
  .replace(/<span>人<\/span>/g, "<span>People</span>");
index = index
  .replaceAll("Borderless Nomadism：", "Borderless Nomadism: ")
  .replaceAll("｜Yen-Lin Huang", " | Yen-Lin Huang")
  .replaceAll("Yen-Lin Huang Yen-Lin (mashbean) Huang", "Yen-Lin (mashbean) Huang")
  .replaceAll("。</p>", ".</p>")
  .replace(/>\s*。/g, ">.")
  .replaceAll("</button>：", "</button>: ");

index = index.replace(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/, (_, raw) => {
  const data = JSON.parse(raw);
  data.slides.forEach((slide, i) => {
    slide.notes = deckNotes[i];
    slide.ch = ({ 序: "Prologue", 一: "I", 二: "II", 三: "III", 四: "IV", 番外: "Epilogue", 工作: "Work" })[slide.ch] || slide.ch;
    if (slide.title === "故鄉可能是排他的也可能是排擠的") slide.title = "Home Can Exclude and Push People Out";
    if (slide.range) slide.range = slide.range.replaceAll("、", ", ");
  });
  data.sources = enSources;
  data.terms = enTerms;
  return `<script type="application/json" id="deck-data">${JSON.stringify(data).replaceAll("<", "\\u003c")}</script>`;
});

const illustrations = JSON.parse(await fs.readFile(path.join(sourceDir, "assets/illustrations.json"), "utf8"));
const sourceArticles = Object.entries(enSources).map(([key, source]) => `<article id="${key}"><h2>${source.url ? `<a href="${source.url}">${source.title}</a>` : source.title}</h2><p>${source.detail}</p></article>`).join("");
const illustrationList = illustrations.map((item) => `<figure><img src="assets/${item.file}" alt="Original copperplate-style conceptual illustration" loading="lazy"><figcaption>${item.file}</figcaption></figure>`).join("");
const sources = `<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sources | Borderless Nomadism</title><link rel="icon" href="/images/favicon-32.png"><style>body{background:#f0e8d8;color:#292720;font:18px/1.8 Georgia,serif;max-width:900px;margin:60px auto;padding:24px}h1,h2{font-family:Georgia,serif}a{color:#813e30}article{border-top:1px solid #a58b61;padding:20px 0}small,figcaption{color:#665f52}figure{display:inline-block;width:240px;margin:12px}figure img{width:100%;height:auto}</style><a href="./">← Back to deck</a><h1>Sources and Images</h1><p><i>Borderless Nomadism: How Digital Drifters Try to Put Down Roots</i><br>Yen-Lin Huang · Nowhere Taiwan Season · London · 20 September 2026</p><p>Field observations remain attributed to the speaker. Product documentation establishes the stated technical mechanisms but does not establish social outcomes. Literary works are used as comparisons rather than predictions.</p>${sourceArticles}<article><h2>Original Copperplate-Style Illustrations</h2><p>These ten conceptual illustrations were generated for this deck. They are not historical artefacts, documentary photographs or portraits of specific people. Animals function as visual motifs for movement, association and belonging.</p>${illustrationList}</article><article><h2>AI Epilogue</h2><p>The epilogue contrasts two visions of the future, followed by ten slides on AI, work and agency. Arguments from the cited books remain attributed to their authors.</p></article></html>`;

await fs.writeFile(path.join(targetDir, "index.html"), index);
await fs.writeFile(path.join(targetDir, "sources.html"), sources);
await fs.writeFile(
  path.join(targetDir, "content-map.json"),
  JSON.stringify(
    JSON.parse(index.match(/<script type="application\/json" id="deck-data">([\s\S]*?)<\/script>/)[1]).slides.map((slide, i) => ({
      page: i + 1,
      chapter: slide.ch,
      title: slide.title,
      sourcePages: slide.range || null,
      condensed: !!slide.condensed,
      sources: slide.sources,
    })),
    null,
    2,
  ) + "\n",
);

let deckJs = await fs.readFile(path.join(sourceDir, "deck.js"), "utf8");
const jsPairs = [
  ["｜無國界的遊牧", " | Borderless Nomadism"], ["投影 R", "PRESENT R"], ["閱讀 R", "READ R"],
  ["目錄 · 43 頁", "INDEX · 41 SLIDES"], ["完整來源與圖像說明 ↗", "FULL SOURCES AND IMAGE NOTES ↗"],
  ["講者筆記 · ", "SPEAKER NOTES · "], ["本頁沿投影片內容展開。", "This slide follows the content shown on screen."],
  ["此瀏覽器未提供網頁全螢幕，可使用瀏覽器的全螢幕功能。", "This browser does not provide page fullscreen. Use the browser's fullscreen command."],
  ["全螢幕未能開啟，可使用瀏覽器的全螢幕功能。", "Fullscreen could not be opened. Use the browser's fullscreen command."],
  ["手機採用直式閱讀，橫向或加寬視窗後可切換投影。", "Phones use vertical reading mode. Rotate or widen the window to use presentation mode."],
  ["操作與閱讀", "NAVIGATION AND READING"],
  ["← → 或空白鍵：換頁<br>Home / End：第一頁／最後一頁<br>G：目錄　N：講者筆記<br>R：閱讀／投影　F：全螢幕<br>Esc：關閉註解或視窗", "← → or Space: change slide<br>Home / End: first / last slide<br>G: index · N: speaker notes<br>R: reading / presentation · F: fullscreen<br>Esc: close notes or dialog"],
  ["點有「註」的詞語讀解釋；點圖片可放大。流程會依序出現，可按「重播流程」。手機自動採用閱讀模式。", "Select a term marked 'note' for its explanation; select an image to enlarge it. Process diagrams animate in sequence and can be replayed. Phones use reading mode automatically."],
  ["來源、圖像授權歸屬與番外篇頁碼對照 ↗", "SOURCES, IMAGE CREDITS AND EPILOGUE CROSS-REFERENCE ↗"],
  ["來源與延伸 · ", "SOURCES AND FURTHER READING · "], ["完整來源目錄 ↗", "FULL SOURCE INDEX ↗"], ["圖像", "IMAGE"],
  ["離開全螢幕 F", "EXIT FULLSCREEN F"], ["全螢幕 F", "FULLSCREEN F"],
];
for (const [from, to] of jsPairs) deckJs = deckJs.split(from).join(to);
await fs.writeFile(path.join(targetDir, "deck.js"), deckJs);
await fs.writeFile(
  path.join(targetDir, "english.css"),
  `html[lang="en-GB"] { font-family: Georgia, "Times New Roman", serif; }
html[lang="en-GB"] .slide h1,
html[lang="en-GB"] .slide h2,
html[lang="en-GB"] .slide h3,
html[lang="en-GB"] .slide p,
html[lang="en-GB"] .slide li { letter-spacing: 0.005em; }
html[lang="en-GB"] .slide h2 { font-size: 48px; line-height: 1.2; }
html[lang="en-GB"] .slide p { line-height: 1.55; }
html[lang="en-GB"] .language-switch { font: 12px/1 system-ui; letter-spacing: .14em; text-decoration: none; border: 1px solid #a58b61; padding: 7px 9px; }
html[lang="en-GB"] .term sup { font-size: .45em; margin-left: .25em; }
html[lang="en-GB"] .plate-4 .cycle-core { width: 100px; top: 55%; }
html[lang="en-GB"] .plate-4 .cycle-core .engraving { width: 90px; height: 62px; }
html[lang="en-GB"] .plate-4 .cycle-core > span { font-size: 11px; letter-spacing: 0; }
html[lang="en-GB"] .plate-11 .registry-note { padding-top: 24px; }
html[lang="en-GB"] .plate-11 .registry-note .lead { font-size: 42px; line-height: 1.16; }
html[lang="en-GB"] .plate-11 .registry-note .marginal { font-size: 17px; line-height: 1.35; margin-top: 14px; }
html[lang="en-GB"] .plate-11 .registry-note .marginal { position: relative; top: -28px; }
html[lang="en-GB"] .plate-12 header h2 { font-size: 43px; }
html[lang="en-GB"] .plate-12 .passport h3 { font-size: 38px; line-height: 1.25; }
html[lang="en-GB"] .plate-12 .passport p { font-size: 24px; }
html[lang="en-GB"] .plate-12 .passport-plate .marginal,
html[lang="en-GB"] .plate-12 .marginal { margin-top: 20px; font-size: 16px; line-height: 1.25; position: relative; top: -24px; }
html[lang="en-GB"] .plate-19 .experiment-triptych h3 { font-size: 30px; }
html[lang="en-GB"] .plate-19 .experiment-triptych p { font-size: 23px; line-height: 1.35; }
html[lang="en-GB"] .plate-19 .marginal { font-size: 16px; line-height: 1.25; position: relative; top: -24px; }
html[lang="en-GB"] .plate-20 .popup-other { font-size: 14px; margin-top: 0; position: relative; top: -20px; }
html[lang="en-GB"] .plate-23 .caveat { font-size: 15px; padding-top: 8px; position: relative; top: -18px; }
html[lang="en-GB"] .plate-25 .caveat { font-size: 15px; position: relative; top: -22px; }
html[lang="en-GB"] .plate-27 .villagers-copy h3 { font-size: 30px; margin-top: 24px; }
html[lang="en-GB"] .plate-27 .villagers-copy h3:first-of-type { margin-top: 100px; }
html[lang="en-GB"] .plate-27 .villagers-copy p { font-size: 22px; line-height: 1.35; }
html[lang="en-GB"] .plate-27 .villagers-copy p:last-child { position: relative; top: -18px; }
html[lang="en-GB"] .plate-28 .hub-core { width: 180px; font-size: 19px; line-height: 1.3; padding: 16px 10px; }
html[lang="en-GB"] .plate-28 .hub-core small { font-size: 16px; }
html[lang="en-GB"] .plate-28 .flow-step { width: 24%; }
html[lang="en-GB"] .plate-28 .flow-step h3 { font-size: 24px; }
html[lang="en-GB"] .plate-28 .flow-step p { font-size: 18px; }
html[lang="en-GB"] .plate-34 .marginal { margin-top: 8px; padding-top: 8px; font-size: 16px; position: relative; top: -18px; }
html[lang="en-GB"] .plate-39 .ai-directions { margin-top: 26px; }
html[lang="en-GB"] .plate-39 .ai-directions h3 { font-size: 25px; min-height: 75px; }
html[lang="en-GB"] .plate-39 .ai-directions p { font-size: 20px; }
html[lang="en-GB"] .plate-39 .marginal { margin-top: 18px; font-size: 16px; position: relative; top: -20px; }
@media (max-width: 800px) {
  html[lang="en-GB"] .reading .cover h1 { font-size: 30px !important; letter-spacing: .03em; }
  html[lang="en-GB"] .reading .cover h1 span { font-size: 40px; letter-spacing: .02em; text-indent: 0; }
  html[lang="en-GB"] .reading .slide h1,
  html[lang="en-GB"] .reading .slide h2,
  html[lang="en-GB"] .reading .slide h3,
  html[lang="en-GB"] .reading .slide p,
  html[lang="en-GB"] .reading .slide .term { overflow-wrap: anywhere; }
  html[lang="en-GB"] .reading .escape-plate header h2 { white-space: normal; }
  html[lang="en-GB"] .reading .slide .marginal,
  html[lang="en-GB"] .reading .slide .caveat,
  html[lang="en-GB"] .reading .slide .popup-other { top: auto; }
}
`,
);

console.log(`Built English deck at ${targetDir}`);
