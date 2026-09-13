// Source of truth for the /works/ 作品集 index. Works are external sites with
// no structured metadata, so titles / taglines / URLs are maintained here by
// hand. Grouped into 個人手作 (personal) and 馬特市工程 (Matters Lab open
// source); order within each group is curatorial, not chronological.
//
// Add a new work: append an entry here — the page renders whatever this
// array holds. Covers live in public/images/works/<slug>.jpg (960w JPEG,
// sourced from each site's og:image or a homepage screenshot).
//
// English (`*En`) fields feed the /en/works/ page. When an English field is
// absent, the page falls back to the Chinese value.

export interface Work {
  /** Stable id, used as the DOM anchor (`/works/#<slug>`) and cover filename. */
  slug: string;
  title: string;
  titleEn?: string;
  /** One-liner shown under the title. */
  tagline: string;
  taglineEn?: string;
  /** Primary link target (the live site; may be a repo while unlaunched). */
  url: string;
  /** Optional source repo, rendered as a secondary link. */
  repo?: string;
  /** Short descriptors shown as chips in the meta row. */
  chips?: string[];
  chipsEn?: string[];
  /** Access caveat, e.g. Tor-only. */
  note?: string;
  noteEn?: string;
  /** Card cover, path under public/ (e.g. images/works/qian-dao.jpg). */
  cover?: string;
  /** Launch or meaningful-update date used by the unified home feed. */
  date: string;
  group: "personal" | "matters";
}

export const workGroups: Record<Work["group"], { title: string; titleEn: string }> = {
  personal: { title: "個人手作", titleEn: "Personal builds" },
  matters: { title: "馬特市工程", titleEn: "Matters Lab open source" },
};

export const works: Work[] = [
  {
    slug: "twdiw-vp-verifier-lite",
    title: "請出示皮夾",
    titleEn: "Show Your Wallet",
    tagline:
      "輕量化查驗數位憑證。支援數位發展部數位憑證皮夾與有備而來，從用途、最少揭露欄位、個資告知到 Cloudflare 一鍵部署都可公開檢查。",
    taglineEn:
      "Lightweight verification of digital credentials. Works with Taiwan MODA's digital credential wallet and Bonds — purpose, minimal-disclosure fields, privacy notice, and one-click Cloudflare deployment are all open to inspection.",
    url: "https://verifier.mashbean.net/",
    repo: "https://github.com/mashbean/twdiw-vp-verifier-lite",
    chips: ["數位身分", "OpenID4VP", "隱私設計", "開源"],
    chipsEn: ["Digital identity", "OpenID4VP", "Privacy by design", "Open source"],
    cover: "images/works/twdiw-vp-verifier-lite.jpg",
    date: "2026-09-03",
    group: "personal",
  },
  {
    slug: "pocket-polis",
    title: "Pocket Polis 口袋審議",
    titleEn: "Pocket Polis",
    tagline:
      "不用架伺服器的輕量版 Polis：一鍵發起線上審議，意見地圖即時顯示分歧與跨群共識。想要自己的版本，一句話交給 AI Agent 加一個 Cloudflare 帳號就能部署。",
    taglineEn:
      "A lightweight Polis with no server to run: launch an online deliberation in one click and watch the opinion map surface divides and cross-group consensus in real time. Want your own? One sentence to an AI agent plus a Cloudflare account deploys it.",
    url: "https://polis.mashbean.net/",
    repo: "https://github.com/mashbean/pocket-polis",
    chips: ["審議工具", "數位公共基礎設施", "中英雙語", "開源"],
    chipsEn: ["Deliberation tool", "Digital public infrastructure", "Bilingual", "Open source"],
    cover: "images/works/pocket-polis.jpg",
    date: "2026-09-01",
    group: "personal",
  },
  {
    slug: "call-in",
    title: "Call-in 簡單叩應",
    titleEn: "Call-in",
    tagline:
      "把簡報、觀眾 QR Code 與即時回應放進同一個講者畫面。支援 PDF、Google 簡報與公開網址，也能自行託管的開源互動工具。",
    taglineEn:
      "Put your slides, an audience QR code, and live reactions on one speaker screen. Supports PDF, Google Slides, and public URLs — an open-source interactive tool you can also self-host.",
    url: "https://call-in.mashbean.net/",
    repo: "https://github.com/mashbean/call-in",
    chips: ["現場互動", "數位公共基礎設施", "開源"],
    chipsEn: ["Live interaction", "Digital public infrastructure", "Open source"],
    cover: "images/works/call-in.jpg",
    date: "2026-08-27",
    group: "personal",
  },
  {
    slug: "libreoffice-tw-card-signing",
    title: "LibreOffice 臺灣自然人憑證簽章",
    titleEn: "LibreOffice Taiwan Card Signing",
    tagline:
      "讓 macOS 與 Linux 的 LibreOffice 直接使用自然人憑證簽署 ODF、OOXML 與 PDF，完成信任鏈、PAdES B-LTA 長期驗證與公證安裝器。",
    taglineEn:
      "Let LibreOffice on macOS and Linux sign ODF, OOXML, and PDF directly with Taiwan's Citizen Digital Certificate — with a full trust chain, PAdES B-LTA long-term validation, and a notarized installer.",
    url: "https://github.com/mashbean/libreoffice-tw-card-signing",
    repo: "https://github.com/mashbean/libreoffice-tw-card-signing",
    chips: ["自然人憑證", "LibreOffice", "PAdES B-LTA", "開源"],
    chipsEn: ["Citizen Digital Certificate", "LibreOffice", "PAdES B-LTA", "Open source"],
    cover: "images/works/libreoffice-tw-card-signing.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "open-book",
    title: "OpenBook 臺灣開放預算",
    titleEn: "OpenBook Taiwan Open Budget",
    tagline:
      "把哈佛 Allen Lab 的市政預算透明工具改造成臺灣版：22 縣市總預算彙編一站看完，官方資料、OpenFun、TwinkleAI 三層對帳。",
    taglineEn:
      "Adapts Harvard Allen Lab's municipal budget-transparency tool for Taiwan: browse the compiled budgets of all 22 counties and cities in one place, reconciled across three layers — official data, OpenFun, and TwinkleAI.",
    url: "https://mashbean.github.io/Open-Book/",
    repo: "https://github.com/mashbean/Open-Book",
    chips: ["開放資料", "中英雙語"],
    chipsEn: ["Open data", "Bilingual"],
    cover: "images/works/open-book.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "civic-proof",
    title: "civic-proof 公民證明",
    titleEn: "civic-proof",
    tagline:
      "從國家憑證到公民自我證明的學術研究站：25 篇系列文章，涵蓋數位身分、規範理論、工程實作與跨國治理。",
    taglineEn:
      "An academic research site tracing the path from state credentials to civic self-proof: a 25-article series spanning digital identity, normative theory, engineering practice, and cross-border governance.",
    url: "https://civic-proof.mashbean.net/",
    repo: "https://github.com/mashbean/civic-proof-en",
    chips: ["研究站", "中英雙語"],
    chipsEn: ["Research site", "Bilingual"],
    cover: "images/works/civic-proof.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "roost-zh-hant-tw",
    title: "ROOST 台灣繁體中文指南",
    titleEn: "ROOST Taiwan Traditional Chinese Guide",
    tagline:
      "把 ROOST 的開放原始碼社群安全資料帶進繁體中文，從偵測、調查、審查到執行，整理小型社群可直接採用的治理流程與工具。",
    taglineEn:
      "Brings ROOST's open-source community-safety materials into Traditional Chinese — from detection and investigation to review and enforcement — as governance workflows and tools small communities can adopt directly.",
    url: "https://roost.mashbean.net/",
    repo: "https://github.com/open-safety-tw/coop",
    chips: ["平台治理", "繁中在地化"],
    chipsEn: ["Platform governance", "Traditional Chinese localization"],
    cover: "images/works/roost-zh-hant-tw.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "writing-experiment",
    title: "AI 匿名互評平台",
    titleEn: "AI Anonymous Peer-Review Platform",
    tagline:
      "一套可實際進行的 AI 文學創作與匿名互評實驗。參與者完成單次提交寫作、盲式評論、分階段揭露與成果閱讀，研究資料則以匿名編號保存。",
    taglineEn:
      "A runnable experiment in AI literary creation and anonymous peer review. Participants complete a single-submission write-up, blind review, staged reveal, and results reading, while research data is kept under anonymized IDs.",
    url: "https://writing.mashbean.net/",
    repo: "https://github.com/mashbean/writing-experiment",
    chips: ["AI 文學創作", "匿名互評"],
    chipsEn: ["AI literary creation", "Anonymous peer review"],
    cover: "images/works/writing-experiment.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "bonds",
    title: "Bond 有備而來",
    titleEn: "Bonds",
    tagline: "也許今天風和日麗，但 BEAR 可能隨時闖入——把身分與證明先備份好，有備而來。",
    taglineEn:
      "The weather may be fine today, but a BEAR could break in at any time — back up your identity and proofs ahead of time, and come prepared.",
    url: "https://bonds.tw/",
    chips: ["數位備災"],
    chipsEn: ["Digital disaster prep"],
    cover: "images/works/bonds.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "nanti-pro",
    title: "難題",
    titleEn: "Hard Problems",
    tagline: "由豆泥提問、AI 代筆作答的研究報告站——許多問題還沒有正解，但是要有人開始問。",
    taglineEn:
      "A research-report site where mashbean poses the questions and AI drafts the answers — many of these problems have no settled answer yet, but someone has to start asking.",
    url: "https://pro.mashbean.net/",
    repo: "https://github.com/mashbean/blog-pro",
    chips: ["AI 代筆", "研究報告"],
    chipsEn: ["AI-drafted", "Research reports"],
    cover: "images/works/nanti-pro.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "fiction",
    title: "小說集《普通人》",
    titleEn: "Fiction Collection: Ordinary People",
    tagline: "五篇小說：框架由豆泥設計、文字由 AI 執筆，把還沒有正解的難題寫成故事。",
    taglineEn:
      "Five short stories: framed by mashbean, written by AI — turning unresolved hard problems into stories.",
    url: "https://pro.mashbean.net/fiction/",
    repo: "https://github.com/mashbean/blog-pro",
    chips: ["小說", "AI 代筆"],
    chipsEn: ["Fiction", "AI-drafted"],
    cover: "images/works/fiction.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "qian-dao",
    title: "籤到",
    titleEn: "Qian-Dao · Fortune Check-in",
    tagline:
      "上班前，先打卡籤到。128 首原創籤詩的線上求籤所：稟告、擲筊、搖籤筒、三聖筊確認——神明可以說不。",
    taglineEn:
      "Clock in before work — with a fortune stick. An online oracle of 128 original fortune poems: state your case, cast the moon blocks, shake the cylinder, and confirm with three sacred casts — the deity is allowed to say no.",
    url: "https://check.mashbean.net/",
    repo: "https://github.com/mashbean/qian-dao",
    chips: ["純靜態", "WebAudio 合成音效"],
    chipsEn: ["Fully static", "WebAudio synthesized sound"],
    cover: "images/works/qian-dao.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "onion-gateway",
    title: "洋蔥小站",
    titleEn: "Onion Gateway",
    tagline:
      "Matters 的 Tor 唯讀閱讀入口：匿名讀者不留痕跡地讀文章、查作者、下載 Markdown，全站不記 log。",
    taglineEn:
      "Matters' read-only Tor reading portal: anonymous readers browse articles, look up authors, and download Markdown without leaving a trace — no logs anywhere on the site.",
    url: "http://v234hfbpwvhly7byty2pc7yvmp2f5nvvu6g6estjmbd7dimavj6xieqd.onion/",
    repo: "https://github.com/thematters/matters-onion-gateway",
    chips: ["Tor", "匿名閱讀"],
    chipsEn: ["Tor", "Anonymous reading"],
    note: "需以 Tor Browser 開啟",
    noteEn: "Open with Tor Browser",
    cover: "images/works/onion-gateway.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "safety-guide",
    title: "Matters 安全指南",
    titleEn: "Matters Safety Guide",
    tagline:
      "給獨立記者與敏感議題寫作者的安全指南：從查資料、聯絡、上稿到收款，看懂平台來函、洋蔥小站、IPFS 與個人備份。",
    taglineEn:
      "A safety guide for independent journalists and writers on sensitive topics: from research, contact, and publishing to receiving payment — making sense of platform notices, the Onion Gateway, IPFS, and personal backups.",
    url: "https://safety.matters.town/",
    repo: "https://github.com/thematters/matters-safety-guide",
    chips: ["數位安全", "獨立記者"],
    chipsEn: ["Digital safety", "Independent journalists"],
    cover: "images/works/safety-guide.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "seven-day-book-museum",
    title: "七日書博物館",
    titleEn: "Seven-Day Book Museum",
    tagline: "歷屆七日書的典藏館：每一期的七道題目、大滿貫與參加獎名冊，寫過的都留了下來。",
    taglineEn:
      "The archive of every Seven-Day Book round: each edition's seven prompts, the grand-slam finishers, and the roll of participants — everything written, kept.",
    url: "https://freewriting.matters.town/museum",
    repo: "https://github.com/thematters/seven-day-book-landing",
    chips: ["社群書寫"],
    chipsEn: ["Community writing"],
    cover: "images/works/seven-day-book-museum.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "lifeboat",
    title: "記憶吐司",
    titleEn: "Lifeboat",
    tagline:
      "matters.town 文章一鍵備份：下載 ZIP、pin 上 IPFS、或直接長成自己的獨立站。你的文字，自己好好收著。",
    taglineEn:
      "One-click backup for matters.town articles: download a ZIP, pin to IPFS, or grow it into your own standalone site. Your words, kept safely by you.",
    url: "https://lifeboat.matters.town/",
    repo: "https://github.com/thematters/matters-lifeboat",
    chips: ["資料可攜", "IPFS"],
    chipsEn: ["Data portability", "IPFS"],
    cover: "images/works/lifeboat.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "fediverse-gateway",
    title: "聯邦宇宙閘道",
    titleEn: "Fediverse Gateway",
    tagline:
      "ActivityPub gateway，讓 Matters 長文走進聯邦宇宙：Mastodon、Misskey、Threads 都能追蹤、回覆、轉發。",
    taglineEn:
      "An ActivityPub gateway that carries Matters long-form writing into the fediverse: follow, reply, and boost from Mastodon, Misskey, and Threads.",
    url: "https://fediverse-gateway.matters.town/",
    repo: "https://github.com/thematters/matters-fediverse-gateway",
    chips: ["ActivityPub", "開發中"],
    chipsEn: ["ActivityPub", "In development"],
    cover: "images/works/fediverse-gateway.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "community-watch",
    title: "守望相助隊",
    titleEn: "Community Watch",
    tagline:
      "讓一小群受信任的市民清理 spam 留言：每一次出手都公開可稽核、可申訴、可回復，把審查攤在陽光下。",
    taglineEn:
      "Lets a small group of trusted citizens clear spam comments — every action public and auditable, appealable, and reversible, putting moderation in the open.",
    url: "https://community-watch.matters.town/",
    repo: "https://github.com/thematters/community-watch",
    chips: ["社群治理"],
    chipsEn: ["Community governance"],
    cover: "images/works/community-watch.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "governance",
    title: "平台清道夫",
    titleEn: "Platform Janitor",
    tagline:
      "審查還是抗審查？以 Matters 2018–2025 的治理史為案例，科普垃圾清理、排序演算法與透明開盒的兩難。",
    taglineEn:
      "Censorship or anti-censorship? Using Matters' 2018–2025 governance history as a case study, an explainer on the dilemmas of spam cleanup, ranking algorithms, and radical transparency.",
    url: "https://governance.matters.town/",
    repo: "https://github.com/thematters/matters-governance-site",
    chips: ["治理科普", "TWNIC 計畫"],
    chipsEn: ["Governance explainer", "TWNIC project"],
    cover: "images/works/governance.jpg",
    date: "2026-07-23",
    group: "matters",
  },
];
