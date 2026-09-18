// Source-first static web deck. Run from the blog repository.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/decks/borderless-nomadism-2026");
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const term = (id, label) => `<button class="term" data-term="${id}">${label}<sup>註</sup></button>`;
const p = (s) => `<p>${s}</p>`;
const lead = (s) => `<p class="lead">${s}</p>`;
const quote = (s, c) => `<blockquote>${s}<cite>${c}</cite></blockquote>`;
const cols = (...items) =>
  `<div class="columns c${items.length}">${items.map((x) => `<div>${x}</div>`).join("")}</div>`;
const entry = (h, t) => `<h3>${h}</h3><p>${t}</p>`;
const flow = (steps, caption = "", parallel = false) =>
  `<div class="flow-wrap"><ol class="flow">${steps.map(([a, b], i) => `<li class="flow-step"><span class="step-no">${String(i + 1).padStart(2, "0")}</span><h3>${a}</h3><p>${b}</p>${!parallel && i < steps.length - 1 ? '<span class="flow-arrow" aria-hidden="true">⟶</span>' : ""}</li>`).join("")}</ol>${caption ? `<p class="flow-caption">${caption}</p>` : ""}<button class="replay" data-replay aria-label="重播本頁流程動畫">↻ 重播流程</button></div>`;
const photo = (file, alt, credit, cl = "") =>
  `<figure class="${cl}"><button class="image-zoom" data-image="assets/${file}.webp" data-caption="${esc(credit)}" aria-label="放大：${esc(alt)}"><img src="assets/${file}.webp" alt="${esc(alt)}" loading="lazy" width="1200" height="800"></button><figcaption>${credit}</figcaption></figure>`;
const table = (heads, rows) =>
  `<table><thead><tr>${heads.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const sources = {
  field: {
    title: "黃豆泥｜清邁遊牧觀察、加密社群三種落地實驗",
    detail:
      "講者為本場提供的兩篇文章。快閃城市／游擊實驗／新社會為講者的主觀分類；清邁描述是特定行程的田野觀察，不代表所有數位遊牧者。",
  },
  outline: {
    title: "黃豆泥｜本場講綱與口述案例",
    detail:
      "海外微信、波士頓司機、雲林女兒、SCP、海棠與博物館志工依講者大綱保留為案例關鍵字。沒有補寫未提供的人物經歷、對話或身分。",
  },
  identity: {
    title: "從編戶齊民到避秦：數位時代的亞洲身分自主權發展",
    url: "https://cjdproject.web.nycu.edu.tw/2025/08/24/from-households-to-exiles-tracing-the-rise-of-identity-autonomy-in-asias-digital-age/",
    detail:
      "黃豆泥，2025。取其制度分工、政府與平台的雙重身分管理，以及三個核心問題；不把文章的政策時點當成 2026 年最新狀態。",
  },
  internet: {
    title: "網路不只偶爾404錯誤，它比想像中更快崩塌",
    url: "https://artouch.com/artouch-column/mintmint-column/content-146860.html",
    detail:
      "黃豆泥，典藏，2024-07-02。以資料消失、維護成本與自主網路為主；圖像沿用作者網站本地化原圖。",
  },
  elixus: {
    title: "20年後初探藝立協Elixus（上）誕生自網絡的部落美學",
    url: "https://artouch.com/web3-x-art/content-107738.html",
    detail:
      "黃豆泥，典藏，2023-06-02。Elixus 的 IRC、部落格與茶館實踐；2001 年 Piraport 與 PiraGene 身分／版權藝術實驗。",
  },
  escape: {
    title: "來一場關於社群平台的密室逃脫！",
    url: "https://mashbean.net/decks/platform-escape-room-2026/",
    detail:
      "黃豆泥，2026。使用既有簡報第 21–27 頁的五條逃脫路徑，及協議、營運與治理的區別；不直接轉錄書中長篇引文。",
  },
  village: {
    title: "地域振興與數位村民的行動網絡——探訪山古志村與其分散自治組織",
    url: "https://artouch.com/artouch-column/mintmint-column/content-136816.html",
    detail:
      "張寶成、黃豆泥合著，典藏，2024-03-29。雪景攝影：張寶成；NFT 圖：張寶成收藏，作品 ykxotkx；合照：原文標示 Nishikigoi NFT Discord；治理畫面：Nishikigoi NFT Snapshot。訪問僅半天，不據此推論長期人口或經濟效果。",
  },
  pgp: {
    title: "Philip Zimmermann｜PGP Source Code and Internals 前言",
    url: "https://www.philzimmermann.com/EN/essays/BookPreface.html",
    detail:
      "MIT Press，1995。出版的是 C 原始碼，不是散發使用者私密金鑰。紙本出版與密碼軟體出口管制之間的張力，是本頁重點。",
  },
  declaration: {
    title: "John Perry Barlow｜A Declaration of the Independence of Cyberspace",
    url: "https://www.eff.org/cyberspace-independence",
    detail: "1996-02-08，EFF 保存之原文。簡報使用短引，其餘為講者對歷史宣言的提問。",
  },
  rarimo: {
    title: "Rarimo｜Freedom Tool 官方文件",
    url: "https://docs.rarimo.com/freedom-tool/",
    detail:
      "說明護照、零知識證明與鏈上投票組件。文件列出 Russia2024、Iranians Vote、United Space。本文沒有找到足以確認「加泰隆尼亞 Rarimo 投票」的直接資料，故保留講綱關鍵字並註明。",
  },
  vocdoni: {
    title: "Vocdoni｜數位投票工具",
    url: "https://vocdoni.io/",
    detail:
      "與 Rarimo 是不同專案。加泰隆尼亞案例與 Rarimo 的連結尚待講者補充；不將兩者合併，也不把匿名投票工具稱為受承認的國家選舉。",
  },
  radio: {
    title: "Deutsches Museum｜Amateurfunk / DLØDM",
    url: "https://www.deutsches-museum.de/museumsinsel/programm/veranstaltung/amateurfunk",
    detail:
      "館方確認 DLØDM 的業餘無線電示範與 DARC 合作。志工爺爺是講者的個人見聞，未推定特定人的姓名。原大綱「火退族」按語意寫為「火腿族」。",
  },
  asimov: {
    title: "Isaac Asimov｜The Naked Sun（1957）",
    url: "https://www.penguinrandomhouse.com/books/5794/the-naked-sun-by-isaac-asimov/",
    detail: "以 Solaria 的稀疏人口、機器人勞動及遠距交往為文學對照；並非預測或現實社會統計。",
  },
  asimovText: {
    title: "The Naked Sun｜Solaria 情節與文本線索",
    url: "https://websites.umich.edu/~engb415/literature/cyberzach/Asimov/naksun.html",
    detail:
      "用於確認作品與情節。本頁不援引不同時代 Solaria 的人口數字，避免與後期《基地與地球》設定混淆。",
  },
  ted: {
    title: "Ted Kaczynski｜Industrial Society and Its Future，§173",
    url: "https://www.washingtonpost.com/wp-srv/national/longterm/unabomber/manifesto.text.htm",
    detail:
      "1995 年原文，第 173 段。採用短引；中文為本簡報譯文。僅作批判性文本閱讀，不支持作者的暴力行動。",
  },
  ai: {
    title: "AI、工作與能動性｜原簡報第 15–60 頁",
    url: "https://mashbean.net/decks/ai-work-agency-reading-1/#15",
    detail:
      "黃豆泥，文化前線 II 讀書會。濃縮頁逐頁標出對應頁次；保留 Susskind、Srnicek & Williams、Acemoglu / Autor / Johnson 的分歧，書中假設不當成已發生的實證結果。",
  },
};
sources.radioImage = {
  title: "Deutsches Museum｜DLØDM Amateursendelizenz",
  url: "https://blog.deutsches-museum.de/2024/12/16/dloedm-amateursendelizenz-so-alt-wie-unser-grundgesetz",
  detail:
    "2024 年館方文章。使用 2022 年 6 月電台照片，圖／Deutsches Museum, München；照片並非講者此次拜訪的紀錄。",
};
const terms = {
  nomad: [
    "數位遊牧 Digital Nomad",
    "透過數位工具工作、維持收入與社群，同時在不同地方生活。這場演講著重移動背後的動機與組織實踐；「兩種人」是觀察用的理想型，不是固定人格或道德排序。",
    "field",
  ],
  lie: [
    "躺平／Copium",
    "講者用「躺平」描述暫時撤出高壓生活的策略。Copium 是 cope 與 opium 的混成迷因，指用自我安慰紓解困境；此處是文化比喻，不是醫療診斷，也不指實際吸毒。",
    "field",
  ],
  web3: [
    "Web3 與加密社群",
    "泛指運用區塊鏈、密碼學、鏈上資產或去中心工具的多樣社群。成員的政治立場、收入與資源差異很大，不能視為同一個群體。",
    "field",
  ],
  dali: [
    "瓦貓之夏／大里福尼亞",
    "講者文章中的 2022 年雲南大理聚會；「大里福尼亞」借用加州嬉皮文化的想像。活動受阻後以去中心方式進行，部分參與者後來流動到清邁。",
    "field",
  ],
  seven: [
    "706 青年空間",
    "由北京發展的青年共同生活、文化交流與自主組織脈絡。本場只沿用講者提供的部分成員流向清邁之觀察，不推論整個組織搬遷。",
    "field",
  ],
  scp: [
    "SCP 基金會",
    "以虛構機構與異常事物檔案為題材的協作創作社群。此處的「基金會」屬於世界觀設定，不是現實中收容異常事物的機構。",
    "outline",
  ],
  haitang: [
    "海棠論壇",
    "依講者大綱保留的網路文學／次文化案例。聚焦匿名、閱讀、創作與社群歸屬；不補上未確認的網站版本、人物或事件。",
    "outline",
  ],
  ham: [
    "火腿族／DLØDM",
    "火腿族是業餘無線電愛好者的俗稱；DLØDM 是德意志博物館業餘無線電台呼號。無線電社群早於網際網路，可用來對照遠距共同在場。",
    "radio",
  ],
  registry: [
    "編戶齊民",
    "把人口編入行政名冊，連結戶籍、賦稅、徭役與治理。此處借作集中管理身分的歷史隱喻，不把所有登記制度視為完全相同。",
    "identity",
  ],
  exile: [
    "避秦",
    "取自《桃花源記》先世避秦時亂的意象。本演講用來思考人在權力結構之外尋找自主空間；它是政治與文化隱喻，不是建議規避法律。",
    "identity",
  ],
  ssi: [
    "身分自主權 SSI",
    "Self-Sovereign Identity。重點是人對憑證、資料出示與授權有更多控制。核發者與驗證者仍然存在，架構本身不保證權利落實。",
    "identity",
  ],
  zkp: [
    "零知識證明 ZKP",
    "讓驗證者確認一個條件成立，而不取得用來證明的完整秘密。實際隱私仍取決於資料輸入、裝置、紀錄與整套流程；不等於絕對匿名。",
    "rarimo",
  ],
  pgp: [
    "PGP — Pretty Good Privacy",
    "Phil Zimmermann 於 1991 年發布的加密軟體。1995 年《PGP Source Code and Internals》將程式原始碼印成書；原始碼、公鑰與私鑰是不同事物。",
    "pgp",
  ],
  cypher: [
    "密碼龐克 Cypherpunk",
    "以密碼學、程式與實際工具支持隱私和自主的思想與實作傳統。社群內部有不同政治方向；不能直接等同加密投機或單一自由意志主義。",
    "pgp",
  ],
  elixus: [
    "藝立協 Elixus",
    "藝術家獨立協會，名稱來自 Elixir Nexus。1990 年代末至 2000 年代初的台灣網路社群，活動跨越 IRC、部落格、自由軟體與實體聚會。",
    "elixus",
  ],
  piraport: [
    "Piraport 複照",
    "2001 年《派樂西王國》中的身分認證藝術實驗，由唐鳳（當時使用 Autrijus Tang 名稱）與李士傑提出，對照微軟 Passport，探索去中心交互認證。",
    "elixus",
  ],
  fediverse: [
    "Fediverse 聯邦宇宙",
    "由多個可互通服務組成的社群網路。節點可各自管理，互通與遷移能力依協議與產品而異；伺服器費用和治理責任不會因此消失。",
    "escape",
  ],
  popup: [
    "快閃城市 Pop-up City",
    "講者對短期共居、共學與活動聚落的分類。Zuzalu、Edge City、Mu 等是文中案例；Frontier Tower 的較長期空間實踐也提醒這些分類會互相重疊。",
    "field",
  ],
  guerrilla: [
    "游擊實驗 Guerrilla Experimentation",
    "講者用來描述技術行動者投入既有社會衝突與制度現場的工作方式。「游擊」在此是組織與介入方式的比喻，不是暴力行動指引。",
    "field",
  ],
  rojava: [
    "羅賈瓦 Rojava",
    "常指敘利亞北部庫德自治實踐的脈絡，語義為「西方」。本頁談講者文章中的 Amir Taaki 與數位實驗，未宣稱其工具至今仍在運作。",
    "field",
  ],
  rarimo: [
    "Rarimo 與加泰隆尼亞案例",
    "目前能核對的是 Rarimo 的 Freedom Tool 護照／ZK 投票架構。加泰隆尼亞常見的數位投票專案 Vocdoni 是另一套系統；保留本場案例線索，未把兩者視為同一實驗。",
    "rarimo",
  ],
  network: [
    "網路國家／Network School",
    "Balaji Srinivasan 提出的網路社群集結、資源動員與實體聚居路徑。「網路國家」是倡議性概念，不等於取得主權承認；Network School 是具體社群實驗之一。",
    "field",
  ],
  dao: [
    "DAO 分散自治組織",
    "藉由共同規則、數位工具與可能的鏈上機制協作的組織形式。程式可處理部分程序，協商、照護、執行與責任仍由人承擔。",
    "village",
  ],
  nft: [
    "NFT 非同質化代幣",
    "可辨識特定代幣的鏈上紀錄。在山古志案例用作藝術與社群參與的入口；不是國家核發的居民身分，也不直接產生居留或公民權。",
    "village",
  ],
  relation: [
    "關係人口",
    "介於短期觀光客與定居居民之間，持續與地方互動、協作和投入的人。本演講關心連結能否轉為地方可感知的貢獻。",
    "village",
  ],
  mediator: [
    "中介行動者",
    "懂地方生活，也能串連外部資源的人。山古志文中提到竹內春華、中澤泉、福田洋介、高瀨俊明等人的角色；數位工具不能取代這些關係工作。",
    "village",
  ],
  solaria: [
    "Solaria／索拉利星",
    "艾希莫夫《裸陽》（The Naked Sun，1957）的星球：人少、機器人多，居民以遠距方式往來。這是小說的社會設定，不是對人類未來的保證。",
    "asimov",
  ],
  ted: [
    "泰德・卡辛斯基",
    "《論工業社會及其未來》的作者，也是 Unabomber 爆炸案犯人。本簡報僅把其對技術依賴的短句作為批判閱讀材料，不認同其暴力行動。",
    "ted",
  ],
  complement: [
    "替代與互補",
    "替代：機器接手人原本的任務。互補：工具提高人所做任務的生產力與需求。兩者可以同時發生；產出、就業與薪資不一定一起增加。",
    "ai",
  ],
  cbi: [
    "UBI／CBI",
    "UBI 是全民無條件基本收入；Susskind 的 CBI 帶有社群貢獻條件。兩者的差異牽涉誰定義貢獻、誰審查資格與如何對待無薪照護。",
    "ai",
  ],
  folk: [
    "常民政治 Folk Politics",
    "Srnicek 與 Williams 用以批評過度偏重即刻、地方、小規模與直接經驗的政治策略；不同於 populism（民粹主義），也不是否定所有地方行動。",
    "ai",
  ],
  freedom: [
    "合成自由 Synthetic Freedom",
    "自由需要收入、時間、知識、健康與公共設施的支持。這個概念追問一個人實際能做什麼，而不只看形式上是否允許。",
    "ai",
  ],
  proworker: [
    "親勞工 AI",
    "Acemoglu、Autor、Johnson 的框架：判斷技術有沒有擴展人類任務與專業價值，並讓勞工分享收益。提高效率或保留人類按確認鈕，本身並不充分。",
    "ai",
  ],
};
const slides = [];
function add(ch, title, body, opts = {}) {
  slides.push({ ch, title, body, notes: "", sources: [], ...opts });
}
add(
  "序",
  "無國界的遊牧",
  `<div class="cover-copy"><p class="edition">飛地・台灣季　｜　在世界之間</p><h1>無國界的<br><em>遊牧</em></h1><p class="cover-sub">那些數位流動者的<br>落地生根實驗</p><p class="cover-topics">人・勞動・社群・空間・世界</p><p class="byline">黃豆泥 Yen-Lin (mashbean) Huang<br><span>London · 20 September 2026</span></p></div>`,
  {
    layout: "cover",
    sources: ["field"],
    notes:
      "飛地「台灣季｜在世界之間 Taiwan Across Cities」。主辦：飛地書店、英國飛地 Nowhere UK；主持：志豪；場地：一頁舟圖書館，Studio 8, 181 Mansfield Road, London NW3 2HP。14:00–15:30 倫敦時間，主講約 45–60 分鐘，問答約 30 分鐘。",
  },
);
add(
  "序",
  "人、勞動、社群、空間、世界",
  `<ol class="contents">${[
    ["一", "兩種在清邁遊牧的人", 3],
    ["二", "故鄉可能是排他的，也可能是排擠的", 7],
    ["三", "數位避秦", 11],
    ["四", "何處是故鄉", 27],
  ]
    .map(([n, t, to]) => `<li><a href="#${to}"><span>${n}</span>${t}<small>↗</small></a></li>`)
    .join("")}</ol><p class="afterword">番外篇　AI 對人類的影響：人類與工作</p>`,
  { notes: "四章沿講者提供的大綱前進。番外篇可依現場時間選讀，也能從目錄直接進入。" },
);
add(
  "一",
  "兩種在清邁遊牧的人",
  cols(
    entry("躺平主義的遊牧", "離開高壓工作與生活，暫時換一種節奏。"),
    entry("身體力行的遊牧", "帶著理念、技術與關係，嘗試組織另一種生活。"),
  ) + lead(`同樣是${term("nomad", "數位遊牧")}，<br>有人想休息，有人想把社會重新做一次。`),
  {
    sources: ["field"],
    notes:
      "這是我在清邁看到的兩種傾向，不是對所有遊牧者的分類普查。一個人也可能在不同人生階段穿梭於兩者之間。",
    layout: "comparison",
  },
);
add(
  "一",
  "躺平主義的遊牧",
  flow(
    [
      ["高壓日常", "工作、房價、內卷"],
      ["移動到清邁", "較低生活成本、短暫喘息"],
      ["消耗積蓄", "生活體驗仍需要收入"],
      ["重返職場", "下一次再出發"],
    ],
    "一種可能反覆發生的生活循環",
  ) +
    p(
      `微信、抖音、小紅書上的數位遊民大會：${term("lie", "躺平與 Copium")}，也可能成為可消費的生活想像。`,
    ),
  {
    sources: ["field"],
    notes:
      "依我提供的清邁文章，這一群人來來去去，活動資訊又集中在中國平台。「不可持續」是我當時的田野判斷，不能用來否定所有遠距工作者；此處的 Copium 是比喻。",
  },
);
add(
  "一",
  "身體力行的遊牧",
  flow([
    [term("dali", "大理／瓦貓之夏"), "2022・活動受阻"],
    ["去中心的聚會", "沒有單一大台，仍繼續相遇"],
    ["清邁", "一部分人移動、留下"],
    ["多中心群落", "空間、合作與產業鏈"],
  ]) +
    p(
      `${term("seven", "706 青年空間")}的部分成員，也在環境變動中來到清邁。<br>${term("web3", "Web3 加密遊牧者")}帶走的不只有電腦，還有組織生活的經驗。`,
    ),
  {
    sources: ["field"],
    notes:
      "不要把不同社群的遷移拼成一條必然路線。大理到清邁是文中一部分人的路徑；706 是另一路來源。",
  },
);
add(
  "一",
  "留下來之後，生活開始變厚",
  quote(
    "「甚至還建造了多中心的群落，有了點衝突，也有相應的產業鏈出現。」",
    "黃豆泥・清邁的遊牧觀察",
  ) +
    cols(
      entry("人與勞動", "工作、收入、互助、合作"),
      entry("社群與空間", "共居、聚會、分歧、規則"),
    ) +
    p("社群不只供人歇腳；它也開始分配機會、形成邊界。"),
  { sources: ["field"] },
);
add(
  "二",
  "故鄉可能是排他的<br>也可能是排擠的",
  `<p class="chapter-number">第二章</p><h2 class="chapter-title">故鄉可能是排他的<br>也可能是<em>排擠的</em></h2><div class="chapter-pair"><p>千里共嬋娟<br><small>不同地方，共享同一個空間</small></p><p>神遊於物外<br><small>同樣空間，尋找逃離的地方</small></p></div>`,
  { layout: "chapter", sources: ["outline"] },
);
add(
  "二",
  "千里共嬋娟",
  lead("在不同的地方，<br>共享同一個空間") +
    cols(
      `<h3>在海外，還是使用微信的中國人</h3><p class="keywords">語言　熟人　資訊　共同時間</p>`,
      `<h3>在波士頓，罵罵咧咧的計程車司機</h3><p class="keywords">移居　日常　故鄉　情緒</p>`,
    ),
  {
    sources: ["outline"],
    notes:
      "兩個案例交由講者現場展開。沒有推定司機國籍、移民原因或實際說過的話；也不將微信使用習慣推論為個人政治立場。",
  },
);
add(
  "二",
  "神遊於物外",
  `<div class="big-word">雲林的女兒<br><em>穆斯林的信仰</em></div><p class="lead">在同樣的空間，尋找逃離的地方</p><p class="keywords">地方　家庭　信仰　歸屬　精神空間</p>`,
  {
    sources: ["outline"],
    notes: "依大綱保留關鍵字，由講者口述。沒有編造家庭反應、宗教轉變過程或這位女性的個人經歷。",
    layout: "sparse",
  },
);
add(
  "二",
  "次文化的遠方，也在日常裡",
  cols(
    entry(term("scp", "SCP 基金會"), "協作寫作，共同虛構一個世界。") +
      entry(term("haitang", "海棠論壇"), "閱讀與創作，找到自己的語言。") +
      entry(term("ham", "火腿族志工爺爺"), "德意志博物館，把訊號送往遠方。"),
    photo("radio", "德意志博物館 DLØDM 電台", "DLØDM 電台，2022。圖／Deutsches Museum, München"),
  ) + lead("人用不同的媒介，尋找同類。"),
  {
    sources: ["outline", "radio", "radioImage"],
    layout: "case-with-photo",
    notes:
      "火腿族不是網際網路才誕生的次文化。把它放在這裡，是對照技術如何延伸社群，而非宣稱無線電起源於數位空間。照片為館方 2022 年電台影像，不是講者遇見志工爺爺的現場照片。",
  },
);
add(
  "三",
  "數位避秦",
  `<p class="chapter-number">第三章</p><h2 class="chapter-title">數位<em>避秦</em></h2><p class="lead">人、資料、關係與制度，能搬到哪裡？</p><div class="era-line"><span>戶籍與邊境</span><span>1990s</span><span>2000–2010s</span><span>2020s</span></div>`,
  { layout: "chapter", sources: ["identity"] },
);
add(
  "三",
  "故鄉、邊境、戶口的誕生",
  flow([
    ["編入名冊", "誰是可辨認的人"],
    ["連到土地", "誰屬於哪個地方"],
    ["分配義務", "賦稅、徭役與管理"],
    ["劃定邊界", "誰可以進入、離開"],
  ]) +
    p(
      `${term("registry", "編戶齊民")}與${term("exile", "避秦")}：一邊讓人口可管理，一邊想像權力之外的生活。`,
    ),
  {
    sources: ["identity"],
    notes:
      "這是一張概念關係圖，不是宣稱現代國境、故鄉觀念與戶籍在同一時間誕生。沿原文，以制度如何辨識人口、連結義務與控制流動作為提問。",
  },
);
add(
  "三",
  "政府與平台的雙重戶籍",
  cols(
    entry("國家的名冊", "戶籍、證件、公共服務<br>你是誰，由誰核發？"),
    entry("平台的帳號", "登入、社交、支付、資料<br>你能否繼續出現，由誰決定？"),
  ) + lead("當帳號成為生活的入口，<br>停權也能成為一種驅逐。"),
  {
    sources: ["identity"],
    notes:
      "平台帳號在功能上具有身分入口的效果，但法律地位與國籍不同。此處保留類比，同時不把平台停權等同正式剝奪公民權。",
  },
);
add(
  "三",
  "把身分的三件事拆開",
  flow([
    ["識別", "核發者確認你是誰"],
    ["憑證", "把證明交到個人手上"],
    ["驗證與授權", "由個人選擇向誰出示"],
  ]) +
    cols(
      entry("誰掌握個資權力？", "誰可以核發、撤銷與要求？"),
      entry("資料存於何處？", "個人裝置、機構或平台？"),
      entry("足跡對誰可見？", "使用證件會留下什麼紀錄？"),
    ) +
    p(`${term("ssi", "身分自主權")}：讓資料的使用，重新有人的選擇。`),
  {
    sources: ["identity"],
    notes:
      "這是以人為本架構的設計方向，不是保證每一種數位皮夾都符合。憑證撤銷、備份、救濟與驗證端紀錄仍需逐一檢查。",
  },
);
add(
  "三",
  "1990 年代：散播潘朵拉之盒的人",
  lead(`${term("pgp", "PGP")} 原始碼出版計畫`) +
    flow([
      ["加密程式", "保護私密通訊"],
      ["出口管制", "程式跨境受到限制"],
      ["印成一本書", "1995・MIT Press"],
      ["可再讀取的文字", "出版與程式的邊界"],
    ]) +
    p(`${term("cypher", "密碼龐克")}把隱私寫成能使用、能傳遞的工具。`),
  {
    sources: ["pgp"],
    notes:
      "沿用講綱的「PGP 金鑰出版計畫」意象，但精確說法是原始碼出版。出版內容不是個人私鑰。紙本原始碼可被重新輸入或掃描；不能把這一案例推成所有密碼出口皆合法的結論。",
  },
);
add(
  "三",
  "1996：網路獨立宣言",
  quote(
    "“We are creating a world that all may enter without privilege”",
    "John Perry Barlow・1996",
  ) +
    lead("誰可以進入這個世界？<br>誰有權要求他離開？") +
    p("三十年後，把宣言放回伺服器、平台條款、網路封鎖與人的肉身之中。"),
  {
    sources: ["declaration"],
    layout: "manifesto",
    notes:
      "這是一份政治與文化宣言，不能視為網路真的沒有管轄權或實體依賴的證明。原引文取一個短片段，句末在原文尚有延伸。",
  },
);
add(
  "三",
  "2000–2010 年代：逃離數位壟斷",
  cols(
    `<h3>網路也會失憶</h3><p>無名小站下線，早期網頁失連。<br>「還在網路上」從來需要有人維護。</p><p>伺服器、網域、格式與資金，<br>都能決定哪些記憶繼續存在。</p>`,
    photo(
      "internet-404",
      "文章無法查看的截圖",
      "〈中文互聯網正在加速崩塌〉失連畫面。原文圖／黃豆泥",
    ),
  ) + p("保存自己的資料，也是在保存自己與他人的共同歷史。"),
  { sources: ["internet"], layout: "image-text" },
);
add(
  "三",
  "藝立協：誕生自網絡的部落美學",
  cols(
    photo("elixus", "派樂西王國網站頁面", "派樂西王國網站。原文圖／黃豆泥"),
    `<h3>${term("elixus", "Elixus")}</h3><p>IRC、部落格、紫藤廬。<br>線上相遇，也在實體空間裡生活。</p><p>${term("piraport", "Piraport 複照")}與 PiraGene：<br>在 2001 年，就把身分、版權與交互信任當成創作材料。</p>`,
  ) + p("一個社群留下的，也包括往後仍能運作的協作方法。"),
  {
    sources: ["elixus"],
    layout: "image-text",
    notes:
      "此頁放在 2000–2010 年代，是延續其 1990 年代末起源，不把 Elixus 的成立時間改寫成 2000 年。",
  },
);
add(
  "三",
  "逃離社群平台",
  flow([
    ["協議", "保留互通與搬遷"],
    ["結社", "承諾、分工與成員"],
    ["治理", "規則、申訴與交接"],
    ["金流", "誰支付維護成本"],
    ["抗審查", "受壓時仍能連結"],
  ]) + p(`${term("fediverse", "聯邦宇宙")}打開一條路；資料、朋友與共同生活，需要一起帶走。`),
  {
    sources: ["escape"],
    notes: "濃縮原簡報五把鑰匙。避免只講平台替代清單；帶回社群如何在工具更換後繼續存在。",
  },
);
add(
  "三",
  "2020 年代：三種落地實驗",
  table(
    ["", "快閃城市", "游擊實驗", "新社會"],
    [
      ["做什麼", "短期聚集", "投入既有現場", "建立自己的聚落"],
      ["帶著什麼", "社群與活動", "技術與理念", "資金與制度藍圖"],
      ["留下什麼", "關係？共同計畫？", "可維護的工具？", "誰的生活規則？"],
    ],
  ) + p("這是我的田野分類；實際案例會重疊，也會改變。"),
  { sources: ["field"] },
);
add(
  "三",
  "快閃城市：網友一起生活",
  lead(term("popup", "Pop-up City")) +
    `<div class="name-list"><span>Zuzalu</span><span>Edge City</span><span>Mu</span><span>Frontier Tower</span></div>` +
    flow([
      ["找到空間", "短期共居與活動"],
      ["網友見面", "讀書、工作、交換想法"],
      ["一起搞事", "嘗試新的合作"],
      ["再次離散", "把關係帶往下一站"],
    ]),
  {
    sources: ["field"],
    notes:
      "不同計畫有不同持續時間與組織方式。Frontier Tower 比典型短期聚會更接近持續空間，保留作為類型交界的例子。",
  },
);
add(
  "三",
  "快閃之後，什麼留在地方？",
  quote("「介於共同工作空間、招商大會、青年旅館與讀書會的複合體。」", "黃豆泥・加密社群田野文章") +
    cols(
      entry("對參與者", "認識的人、工作的機會、<br>新的想像與下一站"),
      entry("對在地居民", "關係、資源、工作與成本，<br>哪些真的能留下？"),
    ) +
    p("聚在一起容易被看見；散場之後的關係，需要更長的觀察。"),
  {
    sources: ["field"],
    notes:
      "我問 Vitalik「Zuzalu 後來怎麼了」，他的回答是去中心、各地有人繼續。這是我在文章中記錄的對話，不以此證明任何一座城市的長期成效。",
  },
);
add(
  "三",
  "游擊實驗：羅賈瓦的數位實驗",
  lead(
    `${term("guerrilla", "Guerrilla Experimentation")}<br>${term("rojava", "Rojava")} × Amir Taaki`,
  ) +
    cols(
      entry("走進真實的現場", "自治社區、通訊、經濟重建<br>把加密理念放進現實衝突"),
      entry("離開之後的問題", "誰會維修？誰繼續使用？<br>外來技術是否成為地方能力？"),
    ) +
    p("工具是否留下，與技術工作者曾經到過，是兩件需要分別回答的事。"),
  {
    sources: ["field"],
    notes:
      "依講者文章介紹 Taaki 投入羅賈瓦的脈絡。長期使用狀態尚未核實；略去原文不精確的外交承認描述，並將地名拼字校正為 Rojava。",
  },
);
add(
  "三",
  "加泰隆尼亞／RARIMO 投票實驗",
  lead("資格可以被證明，<br>政治選擇可以不暴露嗎？") +
    flow([
      ["已有的證件", "誰有資格參與"],
      [term("zkp", "零知識證明"), "只證明所需條件"],
      ["數位投票", "檢查程序與結果"],
    ]) +
    p(`${term("rarimo", "RARIMO／加泰隆尼亞案例")}：護照、匿名、公民資格與政治承認。`) +
    `<p class="caveat">案例線索：加泰隆尼亞的 Vocdoni 與 Rarimo 是不同專案；兩者關聯待補充。</p>`,
  {
    sources: ["rarimo", "vocdoni"],
    notes:
      "保留講者原定案例線索。可確認 Rarimo Freedom Tool 的護照與 ZK 架構，尚未確認講者指的加泰隆尼亞活動。流程是 Rarimo 工具的一般概念圖，不是特定加泰隆尼亞投票的已驗證流程。",
  },
);
add(
  "三",
  "新社會：把理念蓋成一個地方",
  lead(`${term("network", "New Society／網路國家")}`) +
    flow([
      ["網路社群", "共享理念與認同"],
      ["集結資源", "資金、技能與支持者"],
      ["實體聚居", "Network School"],
      ["生活規則", "誰制定？如何更改？"],
    ]) +
    p("Balaji Srinivasan 的倡議：讓網路社群走向實體社會的建構。"),
  {
    sources: ["field"],
    notes: "以講者文章中的 Network School 為例，不將網路國家的主權願景寫成已完成的事實。",
  },
);
add(
  "三",
  "自由意志，遇到共同生活的規則",
  quote(
    "「我還真沒辦法想像一群『自由意志主義者』會一起集體做早操。」",
    "黃豆泥・加密社群田野文章",
  ) +
    cols(
      entry("朋友轉述的經驗", "集體生活、居住問題、<br>公開抱怨與離開"),
      entry("制度上的追問", "誰掌握空間與資源？<br>異議者有沒有申訴與留下的權利？"),
    ) +
    `<p class="caveat">Network School 段落為講者友人的轉述，並非經獨立查證的調查報告。</p>`,
  {
    sources: ["field"],
    notes:
      "原文友人以「百花齊放」形容公開徵求意見後有人被逐出的經驗。若現場講述，維持「友人轉述」歸屬，不呈現為已核實的普遍政策；也不把政治制度之間的諷刺類比當作相同的歷史事實。",
  },
);
add(
  "四",
  "何處是故鄉",
  `<div class="landscape-title"><p class="chapter-number">第四章</p><h2 class="chapter-title">何處是<em>故鄉</em></h2><p class="lead">地方創生・山古志村・關係人口</p></div><p class="landscape-credit">山古志村雪景・攝影／張寶成</p>`,
  { layout: "landscape", sources: ["village"] },
);
add(
  "四",
  "不必先搬來，才開始與地方有關",
  cols(
    photo(
      "digital-villagers",
      "台灣小隊展示錦鯉 NFT",
      "台灣小隊展示錦鯉 NFT。原文圖／Nishikigoi NFT Discord",
    ),
    `<h3>${term("relation", "關係人口")}</h3><p>不只觀光，也不必立刻定居。<br>遠方的人可以持續參與一個地方。</p><h3>${term("nft", "錦鯉 NFT")}</h3><p>藝術與數位村民的入口，<br>把陌生人的注意力帶向真實的村落。</p>`,
  ),
  {
    layout: "image-text",
    sources: ["village"],
    notes:
      "原文合著者在村中停留半天。使用「關係人口」作為分析框架，不把 NFT 持有者直接當成活躍參與者或法定居民。",
  },
);
add(
  "四",
  "地方連結，需要中介行動者",
  flow([
    ["關注與加入", "看見山古志"],
    ["共同參與", "討論、提案、資源"],
    ["地方執行", "熟悉村落的人"],
    ["持續回應", "地方需求與日常"],
  ]) +
    cols(
      photo(
        "village-vote",
        "Nishikigoi 專案的投票頁面",
        "原文圖／Nishikigoi NFT Snapshot",
        "small-figure",
      ),
      `<p>${term("dao", "DAO")}可提供參與程序。<br>${term("mediator", "中介行動者")}把全球網路與村落生活接在一起。</p><p>誰執行、誰維護、誰願意再來，<br>都不會由代幣自動完成。</p>`,
    ),
  { sources: ["village"] },
);
add(
  "四",
  "海外者的數位結社？",
  `<div class="resource-list">${[
    ["資金", "共同支持什麼，如何支付長期成本"],
    ["人才", "誰能做什麼，如何分工與互助"],
    ["資訊", "如何保存知識，避免只留在聊天室"],
    ["制度", "如何決策、問責、交接與接納新成員"],
  ]
    .map(([h, t], i) => `<div><span>0${i + 1}</span><h3>${h}</h3><p>${t}</p></div>`)
    .join("")}</div>` + p("身在不同城市的人，如何形成一個能持續行動的「我們」？"),
  {
    sources: ["outline"],
    notes:
      "依講綱保留資金、人才、資訊、制度四個向度。這是開放的討論框架，不宣稱已存在某個正式組織。",
  },
);
add(
  "四",
  "落地生根，是持續的關係",
  quote("「與其說我在遊牧，不如說是在田野也不為過。」", "黃豆泥") +
    lead("我們想與誰一起生活？<br>又願意為哪個地方，持續付出？") +
    `<p class="keywords">人　勞動　社群　空間　世界</p><a class="appendix-link" href="#32">續讀番外篇：AI、人類與工作 ⟶</a>`,
  { layout: "closing", sources: ["field"] },
);
add(
  "番外",
  "兩種未來觀 I：被機器奴役",
  `<p class="edition">《論工業社會及其未來》・1995・§173</p>` +
    quote("“At that stage the machines will be in effective control.”", "Ted Kaczynski") +
    lead("「到了那個階段，機器將實際掌握控制權。」") +
    p("——本簡報譯文") +
    `<p class="caveat">${term("ted", "泰德・卡辛斯基")}的文本作為批判閱讀材料；不認同其暴力行動。</p>`,
  {
    sources: ["ted"],
    layout: "manifesto",
    notes:
      "從這句話提出討論：當生活依靠機器運作，人是否仍能改變系統的目標？將思想文本與作者暴力行動明確區分。",
  },
);
add(
  "番外",
  "兩種未來觀 II：機器工作，人類稀疏",
  cols(
    lead(`艾希莫夫《裸陽》<br>${term("solaria", "Solaria／索拉利星")}`) +
      entry("勞動的安排", "大量機器人承擔工作，人類分散生活。") +
      entry("關係的安排", "遠距交往成為常態，實際相見令人不安。"),
    photo(
      "naked-sun",
      "Isaac Asimov The Naked Sun 書封",
      "《The Naked Sun》再版封面／Penguin Random House",
    ),
  ) + p("如果不必再為工作聚集，我們還會為了什麼靠近彼此？"),
  {
    sources: ["asimov", "asimovText"],
    layout: "case-with-photo book",
    notes:
      "小說初版於 1957 年，圖為出版社現行再版封面，並非初版。這是文學情境，不要與後來《基地與地球》的索拉利人設定混為一談，也不要直接把這一社會稱為烏托邦。",
  },
);
function ai(title, body, range, notes = "") {
  add("工作", title, body, { sources: ["ai"], range, notes, condensed: true });
}
ai(
  "01｜問題在於「足夠的工作」",
  lead("工作仍然存在，<br>卻未必足以分配收入、地位與意義。") +
    p(
      "Susskind 把技術性失業描寫成任務逐步被接手的過程。單看工作是否消失，會漏掉薪資下降、工時不穩與人退出勞動市場。",
    ) +
    cols(
      entry("歷史提供經驗", "過去的替代與互補，曾讓新工作出現。"),
      entry("歷史不提供保證", "新任務也可能直接由機器完成。"),
    ),
  "15–18、20",
  "Leontief 的馬是對替代的比喻，不能用來證明人類必然被完全排除。",
);
ai(
  "02｜一份工作，是一束任務",
  flow([
    ["原本的工作", "由許多任務組成"],
    ["機器接手一部分", "未必需要通用人工智慧"],
    ["剩下的任務", "價值與需求可能改變"],
  ]) +
    cols(
      entry(term("complement", "替代力量"), "機器接手任務，人力需求下降。"),
      entry("互補力量", "提高生產力、擴大需求，或創造新的部門與任務。"),
    ),
  "19、21–23",
);
ai(
  "03｜有工作卻搆不到，與工作不夠",
  cols(
    `<h3>摩擦與錯配</h3><p><b>技能</b>：新工作所需能力不同。<br><b>認同</b>：某些工作與自我理解衝突。<br><b>地點</b>：機會集中，搬遷有成本。</p>`,
    `<h3>結構性的需求不足</h3><p>即使完成再訓練，市場仍可能不需要足夠的人類勞動。</p><p>商品服務增加，不保證人的工作機會同步增加。</p>`,
  ) + p("遠距與遊牧可以鬆動「地點」限制，卻不自動解決技能、照護與分配問題。"),
  "24–25",
);
ai(
  "04｜繁榮如何分配",
  table(
    ["所得來自", "技術變化後的問題"],
    [
      ["人力資本：技能、經驗、知識", "薪資與需求可能下滑"],
      ["其他資本：機器、土地、股權、資料", "收益可能更集中於所有者"],
    ],
  ) +
    p(
      "Susskind 提議收入分享、資本分享與勞動保障，也討論大型科技權力與休閒的公共安排。教育有用，卻不能獨自修補分配制度。",
    ) +
    p(`${term("cbi", "UBI／CBI")}的分歧：照護、創作與社群貢獻，由誰認定？`),
  "26–28、57",
);
ai(
  "05｜後工作，不等於無所事事",
  cols(
    entry("工資勞動", "為了維持生存，出售時間與能力。"),
    entry("人的活動", "學習、創作、照護、政治參與、社交與遊戲。"),
  ) +
    lead("Srnicek 與 Williams：<br>讓人有能力拒絕惡劣的工作。") +
    p(`${term("freedom", "合成自由")}需要收入、時間、公共服務與共同建設。`),
  "29–32、36",
);
ai(
  "06｜地方實驗，如何變成制度力量",
  p(
    `Srnicek 與 Williams 對${term("folk", "常民政治")}的批評：短期、地方、直接行動能帶來能量，但若始終停在這裡，難以改變較大的制度。`,
  ) +
    flow([
      ["共同想像", "提出可欲的未來"],
      ["組織累積", "社群、媒體、工會、政黨"],
      ["持續施力", "政策、投資與公共制度"],
    ]) +
    p("自治小島與數位遊牧社群，同樣需要面對：如何讓一次相聚超越一次活動？"),
  "33–35、37、39、58",
  "原簡報包含新自由主義長期思想與組織工程的對照。此處借其策略問題，不把所有地方組織都斷言為失敗。",
);
ai(
  "07｜後工作的四項要求與四條岔路",
  cols(
    `<h3>彼此支撐的要求</h3><ol class="plain-list"><li>把必要、枯燥的勞動自動化</li><li>縮短工作週</li><li>足以生活的全民基本收入</li><li>鬆動「不工作就不配」的倫理</li></ol>`,
    `<h3>後工作仍可能不平等</h3><p>富國享受紅利、窮國維持低薪勞動。<br>自動化增加能源與生態負擔。<br>男性少工作、女性繼續無薪照護。</p><p><b>作者主張的方向：</b><br>把解放連結到全球、性別與生態正義。</p>`,
  ),
  "38、40、58",
);
ai(
  "08｜什麼才算親勞工 AI",
  p(
    `${term("proworker", "Acemoglu／Autor／Johnson")}：產出增加、操作變容易，都不足以保證勞工受益。還要問誰的專業變重要、誰的報酬與自主增加。`,
  ) +
    table(
      ["技術方向", "可能的勞動效果"],
      [
        ["勞動增強／資本增強", "效率提高，分配結果仍不確定"],
        ["自動化", "接手任務，減少對人的需求"],
        ["專業平準化", "幫助新進者，也可能壓低原有專業價值"],
        ["創造新任務", "開啟對人類判斷與新專業的需求"],
      ],
    ),
  "41–46",
  "這是原簡報對 Building Pro-Worker AI 的整理。屬於分析框架與作者論點，不是對所有工具都適用的自動評分。",
);
ai(
  "09｜同一項技術，可以往三個方向走",
  flow(
    [
      ["自動化器", "把技師變成指令的眼睛與雙手"],
      ["技師助手", "協助診斷、判斷與複雜修復"],
      ["轉軌助手", "支持學習新領域與新任務"],
    ],
    "航空維修的三種假想工具・並列設計方向，不是必然的演進階段",
    true,
  ) +
    p(
      "既有案例包括電工、教師、專利審查與無障礙工作的輔助工具。部署也能走向中央監控；效果取決於目標與權力分配。",
    ) +
    p("採購、補助、稅制、競爭政策與勞工發言權，可以改變技術被開發與採用的誘因。"),
  "47–51",
  "本頁三個航空維修工具是原文寓言中的假想設計，並非聲稱已上市產品。流程動畫依序呈現三條路，但字幕明示是並列方向。",
);
ai(
  "10｜回到人、工作與共同生活",
  `<div class="question-list"><p><span>人</span>使用工具之後，我留下了哪些能力？</p><p><span>勞動</span>新任務、收入與收益，分給了誰？</p><p><span>社群</span>誰有力量改變規則，誰被排除？</p><p><span>制度</span>技術由誰設計、採購、管理與問責？</p></div>` +
    p(
      "這些作者對行動者、市場角色與工作本身的未來並不完全同意。共同的追問是：我們能否把選擇，變成實際的集體能力？",
    ),
  "52–60",
  "保留第 53–54 頁的共識與分歧，以及第 55–59 頁四層提問。這也把番外篇帶回海外數位結社：有人維護、有人參與、有人能改變制度，才是共同生活。",
);
const clean = (s) => s.replace(/<[^>]*>/g, "");
const html = slides
  .map(
    (s, i) =>
      `<section class="slide ${s.layout || ""}" id="slide-${i + 1}" data-slide="${i + 1}" data-chapter="${s.ch}" aria-labelledby="title-${i + 1}"><div class="folio-top"><span>無國界的遊牧</span><span>${s.ch === "序" ? "序章" : s.ch === "番外" ? "番外篇・兩種未來觀" : s.ch === "工作" ? "番外篇・關於工作的一點討論" : "第" + s.ch + "章"}</span></div>${["cover", "chapter", "landscape"].includes(s.layout) ? `<div class="slide-body special" id="title-${i + 1}">${s.body}</div>` : `<header><h2 id="title-${i + 1}">${s.title}</h2>${s.range ? `<p class="range">原簡報 P.${s.range}</p>` : ""}</header><div class="slide-body">${s.body}</div>`}<footer><span class="folio">${String(i + 1).padStart(2, "0")}<i> / ${slides.length}</i></span><span class="footer-center">${s.layout === "cover" ? "Borderless Nomadism" : "人・勞動・社群・空間・世界"}</span>${s.sources.length ? `<button class="source-button" data-source-slide="${i + 1}">來源與延伸 ↗</button>` : "<span></span>"}</footer><template class="speaker-notes">${esc(s.notes)}</template></section>`,
  )
  .join("\n");
await fs.writeFile(
  path.join(dir, "index.html"),
  `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f0e8d8"><title>無國界的遊牧：那些數位流動者的落地生根實驗｜黃豆泥</title><meta name="description" content="人、勞動、社群、空間、世界。飛地台灣季倫敦場，黃豆泥的數位遊牧田野與落地生根實驗，附 AI 與工作番外篇。"><link rel="canonical" href="https://mashbean.net/decks/borderless-nomadism-2026/"><meta property="og:type" content="website"><meta property="og:title" content="無國界的遊牧：那些數位流動者的落地生根實驗"><meta property="og:description" content="人・勞動・社群・空間・世界｜黃豆泥｜飛地台灣季・倫敦 2026.09.20"><meta property="og:url" content="https://mashbean.net/decks/borderless-nomadism-2026/"><meta property="og:image" content="https://mashbean.net/decks/borderless-nomadism-2026/assets/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://mashbean.net/decks/borderless-nomadism-2026/assets/og.png"><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png"><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16.png"><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="styles.css"><script defer src="vendor/gsap.min.js"></script><script defer src="deck.js"></script></head><body><a class="skip-link" href="#stage">進入簡報</a><div class="screen-head"><a href="/decks/">← 簡報集</a><span>飛地台灣季・London</span><button id="index-button" aria-haspopup="dialog">目錄 G</button></div><main id="stage" tabindex="-1" aria-label="無國界的遊牧簡報"><div id="deck">${html}</div></main><nav class="toolbar" aria-label="簡報控制"><button id="prev" aria-label="上一頁">←</button><output id="counter" aria-live="polite">1 / ${slides.length}</output><button id="next" aria-label="下一頁">→</button><span class="toolbar-line"></span><button id="reading" aria-pressed="false">閱讀 R</button><button id="notes" aria-haspopup="dialog">講者筆記 N</button><button id="fullscreen">全螢幕 F</button><button id="help" aria-haspopup="dialog" aria-label="操作說明">?</button></nav><div class="progress-track"><div id="progress"></div></div><dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title"></h2><button id="dialog-close" aria-label="關閉視窗">×</button></div><div id="dialog-content"></div></dialog><div id="toast" role="status"></div><script type="application/json" id="deck-data">${JSON.stringify({ slides: slides.map(({ ch, title, notes, sources, range, condensed }) => ({ ch, title: clean(title), notes, sources, range, condensed })), sources, terms }).replaceAll("<", "\\u003c")}</script></body></html>`,
);
await fs.writeFile(
  path.join(dir, "content-map.json"),
  JSON.stringify(
    slides.map((s, i) => ({
      page: i + 1,
      chapter: s.ch,
      title: clean(s.title),
      sourcePages: s.range || null,
      condensed: !!s.condensed,
      sources: s.sources,
    })),
    null,
    2,
  ) + "\n",
);
await fs.writeFile(
  path.join(dir, "sources.html"),
  `<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>來源｜無國界的遊牧</title><link rel="icon" href="/images/favicon-32.png"><style>body{background:#f0e8d8;color:#292720;font:18px/1.8 Georgia,serif;max-width:900px;margin:60px auto;padding:24px}h1,h2{font-family:serif}a{color:#813e30}article{border-top:1px solid #a58b61;padding:20px 0}small{color:#665f52}</style><a href="./">← 回簡報</a><h1>來源與圖像</h1><p>無國界的遊牧：那些數位流動者的落地生根實驗<br>黃豆泥・飛地台灣季・倫敦・2026.09.20</p>${Object.entries(
    sources,
  )
    .map(
      ([key, s]) =>
        `<article id="${key}"><h2>${s.url ? `<a href="${s.url}">${s.title}</a>` : s.title}</h2><p>${s.detail}</p></article>`,
    )
    .join(
      "",
    )}<article><h2>封面插畫</h2><p>使用內建 imagegen 生成的銅版畫風格概念插畫，並非歷史文物或事件紀錄。圖檔：assets/frontispiece.webp。</p><details><summary>插畫提示詞</summary><p>Use case: illustration-story. Asset type: full-bleed background illustration for a classical ornamental editorial web presentation about borderless digital nomads putting down roots. Create a sophisticated antique 18th-century copperplate engraving, landscape 3:2. On the RIGHT TWO THIRDS: a monumental open terrestrial globe assembled from delicate meridians and atlas lines, standing above a little village with a tree whose fine roots run into map lines; tiny anonymous travelers carrying books walk between faraway buildings and planted roots, an allegory of mobility, community, and belonging. Bottom edge fine botanical engraving. LEFT THIRD mostly empty warm ivory paper with only faint cartographic contour traces, plenty of quiet negative space for Chinese title overlay. Etching linework, crosshatching, drypoint texture, archival book frontispiece, tiny restrained copper brown and oxblood accents, otherwise dark sepia ink on warm aged ivory. Restrained antique ornamental corners. Beautiful sophisticated printmaking, not fantasy game, not UI, no text, no letters, no labels, no watermark, no bright colors. It is an original conceptual illustration, not a historical artifact.</p></details></article><article><h2>AI 番外篇對照</h2><p>兩種未來觀各一頁，另以十頁濃縮原簡報第 15–60 頁。</p>${slides
    .filter((s) => s.condensed)
    .map((s) => `<p>${clean(s.title)}：原簡報 P.${s.range}</p>`)
    .join("")}</article></html>`,
);
console.log(
  `${slides.length} slides; ${slides.filter((s) => s.condensed).length} condensed work slides; ${Object.keys(terms).length} glossary entries`,
);
