// Source-first static web deck. Run from the blog repository.
import fs from "node:fs/promises";
import { makeSlides } from "./borderless-nomadism-slides.mjs";
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
const slides = makeSlides({ term, photo, quote, lead, p, cols, entry, table });
const illustrations = JSON.parse(
  await fs.readFile(path.join(dir, "assets/illustrations.json"), "utf8"),
);
const clean = (s) => s.replace(/<[^>]*>/g, "");
const html = slides
  .map(
    (s, i) =>
      `<section class="slide plate-${i + 1} ${s.layout || ""}" id="slide-${i + 1}" data-slide="${i + 1}" data-chapter="${s.ch}" aria-labelledby="title-${i + 1}"><div class="folio-top"><span>無國界的遊牧</span><span>${s.ch === "序" ? "序章" : s.ch === "番外" ? "番外篇・兩種未來觀" : s.ch === "工作" ? "番外篇・關於工作的一點討論" : "第" + s.ch + "章"}</span></div>${["cover", "chapter", "landscape"].includes(s.layout) ? `<div class="slide-body special" id="title-${i + 1}">${s.body}</div>` : `<header><h2 id="title-${i + 1}">${s.title}</h2>${s.range ? `<p class="range">原簡報 P.${s.range}</p>` : ""}</header><div class="slide-body">${s.body}</div>`}<footer><span class="folio">${String(i + 1).padStart(2, "0")}<i> / ${slides.length}</i></span><span class="footer-center">${s.layout === "cover" ? "Borderless Nomadism" : "人・勞動・社群・空間・世界"}</span>${s.sources.length ? `<button class="source-button" data-source-slide="${i + 1}">來源與延伸 ↗</button>` : "<span></span>"}</footer><template class="speaker-notes">${esc(s.notes)}</template></section>`,
  )
  .join("\n");
await fs.writeFile(
  path.join(dir, "index.html"),
  `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f0e8d8"><title>無國界的遊牧：那些數位流動者的落地生根實驗｜黃豆泥</title><meta name="description" content="人、勞動、社群、空間、世界。飛地台灣季倫敦場，黃豆泥的數位遊牧田野與落地生根實驗，附 AI 與工作番外篇。"><link rel="canonical" href="https://mashbean.net/decks/borderless-nomadism-2026/"><meta property="og:type" content="website"><meta property="og:title" content="無國界的遊牧：那些數位流動者的落地生根實驗"><meta property="og:description" content="人・勞動・社群・空間・世界｜黃豆泥｜飛地台灣季・倫敦 2026.09.20"><meta property="og:url" content="https://mashbean.net/decks/borderless-nomadism-2026/"><meta property="og:image" content="https://mashbean.net/decks/borderless-nomadism-2026/assets/og.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://mashbean.net/decks/borderless-nomadism-2026/assets/og.png"><link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png"><link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16.png"><link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png"><link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="controls.css"><script defer src="vendor/gsap.min.js"></script><script defer src="deck.js"></script></head><body><a class="skip-link" href="#stage">進入簡報</a><div class="screen-head"><a href="/decks/">← 簡報集</a><span>飛地台灣季・London</span><button id="index-button" aria-haspopup="dialog">目錄 G</button></div><main id="stage" tabindex="-1" aria-label="無國界的遊牧簡報"><div id="deck">${html}</div></main><nav class="toolbar" aria-label="簡報控制"><button id="prev" aria-label="上一頁">←</button><output id="counter" aria-live="polite">1 / ${slides.length}</output><button id="next" aria-label="下一頁">→</button><span class="toolbar-line"></span><button id="reading" aria-pressed="false">閱讀 R</button><button id="notes" aria-haspopup="dialog">講者筆記 N</button><button id="fullscreen">全螢幕 F</button><button id="help" aria-haspopup="dialog" aria-label="操作說明">?</button></nav><div class="progress-track"><div id="progress"></div></div><dialog id="dialog" aria-labelledby="dialog-title"><div class="dialog-head"><h2 id="dialog-title"></h2><button id="dialog-close" aria-label="關閉視窗">×</button></div><div id="dialog-content"></div></dialog><div id="toast" role="status"></div><script type="application/json" id="deck-data">${JSON.stringify({ slides: slides.map(({ ch, title, notes, sources, range, condensed }) => ({ ch, title: clean(title), notes, sources, range, condensed })), sources, terms }).replaceAll("<", "\\u003c")}</script></body></html>`,
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
    )}<article><h2>第二輪・原創銅版畫風格插畫</h2><p>十張圖由內建 imagegen 生成，為本簡報的概念插畫與裝飾，並非歷史文物、現場照片或特定人物的肖像。採平面線刻、暖白紙色與褐紅雙色。動物作為移動、結社與歸屬的視覺意象，未對人物作動物化分類。</p><p><a href="assets/illustrations.json">完整圖像清單與提示詞</a></p>${illustrations.map((x) => `<details><summary>${x.file}</summary><img src="assets/${x.file}" alt="原創概念插畫 ${x.file}" style="max-width:300px;width:100%" loading="lazy"><p>${esc(x.prompt)}</p></details>`).join("")}</article><article><h2>AI 番外篇對照</h2><p>兩種未來觀各一頁，另以十頁濃縮原簡報第 15–60 頁。</p>${slides
    .filter((s) => s.condensed)
    .map((s) => `<p>${clean(s.title)}：原簡報 P.${s.range}</p>`)
    .join("")}</article></html>`,
);
console.log(
  `${slides.length} slides; ${slides.filter((s) => s.condensed).length} condensed work slides; ${Object.keys(terms).length} glossary entries`,
);
