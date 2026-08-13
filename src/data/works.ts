// Source of truth for the /works/ 作品集 index. Works are external sites with
// no structured metadata, so titles / taglines / URLs are maintained here by
// hand. Grouped into 個人手作 (personal) and 馬特市工程 (Matters Lab open
// source); order within each group is curatorial, not chronological.
//
// Add a new work: append an entry here — the page renders whatever this
// array holds. Covers live in public/images/works/<slug>.jpg (960w JPEG,
// sourced from each site's og:image or a homepage screenshot).

export interface Work {
  /** Stable id, used as the DOM anchor (`/works/#<slug>`) and cover filename. */
  slug: string;
  title: string;
  /** One-liner shown under the title. */
  tagline: string;
  /** Primary link target (the live site; may be a repo while unlaunched). */
  url: string;
  /** Optional source repo, rendered as a secondary link. */
  repo?: string;
  /** Short descriptors shown as chips in the meta row. */
  chips?: string[];
  /** Access caveat, e.g. Tor-only. */
  note?: string;
  /** Card cover, path under public/ (e.g. images/works/qian-dao.jpg). */
  cover?: string;
  /** Launch or meaningful-update date used by the unified home feed. */
  date: string;
  group: "personal" | "matters";
}

export const workGroups: Record<Work["group"], { title: string }> = {
  personal: { title: "個人手作" },
  matters: { title: "馬特市工程" },
};

export const works: Work[] = [
  {
    slug: "libreoffice-tw-card-signing",
    title: "LibreOffice 臺灣自然人憑證簽章",
    tagline:
      "讓 macOS 與 Linux 的 LibreOffice 直接使用自然人憑證簽署 ODF、OOXML 與 PDF，完成信任鏈、PAdES B-LTA 長期驗證與公證安裝器。",
    url: "https://github.com/mashbean/libreoffice-tw-card-signing",
    repo: "https://github.com/mashbean/libreoffice-tw-card-signing",
    chips: ["自然人憑證", "LibreOffice", "PAdES B-LTA", "開源"],
    cover: "images/works/libreoffice-tw-card-signing.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "open-book",
    title: "OpenBook 臺灣開放預算",
    tagline:
      "把哈佛 Allen Lab 的市政預算透明工具改造成臺灣版：22 縣市總預算彙編一站看完，官方資料、OpenFun、TwinkleAI 三層對帳。",
    url: "https://mashbean.github.io/Open-Book/",
    repo: "https://github.com/mashbean/Open-Book",
    chips: ["開放資料", "中英雙語"],
    cover: "images/works/open-book.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "civic-proof",
    title: "civic-proof 公民證明",
    tagline:
      "從國家憑證到公民自我證明的學術研究站：25 篇系列文章，涵蓋數位身分、規範理論、工程實作與跨國治理。",
    url: "https://civic-proof.mashbean.net/",
    repo: "https://github.com/mashbean/civic-proof-en",
    chips: ["研究站", "中英雙語"],
    cover: "images/works/civic-proof.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "roost-zh-hant-tw",
    title: "ROOST 台灣繁體中文指南",
    tagline:
      "把 ROOST 的開放原始碼社群安全資料帶進繁體中文，從偵測、調查、審查到執行，整理小型社群可直接採用的治理流程與工具。",
    url: "https://roost.mashbean.net/",
    repo: "https://github.com/open-safety-tw/coop",
    chips: ["平台治理", "繁中在地化"],
    cover: "images/works/roost-zh-hant-tw.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "writing-experiment",
    title: "AI 匿名互評平台",
    tagline:
      "一套可實際進行的 AI 文學創作與匿名互評實驗。參與者完成單次提交寫作、盲式評論、分階段揭露與成果閱讀，研究資料則以匿名編號保存。",
    url: "https://writing.mashbean.net/",
    repo: "https://github.com/mashbean/writing-experiment",
    chips: ["AI 文學創作", "匿名互評"],
    cover: "images/works/writing-experiment.jpg",
    date: "2026-08-13",
    group: "personal",
  },
  {
    slug: "bonds",
    title: "Bond 有備而來",
    tagline: "也許今天風和日麗，但 BEAR 可能隨時闖入——把身分與證明先備份好，有備而來。",
    url: "https://bonds.tw/",
    chips: ["數位備災"],
    cover: "images/works/bonds.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "nanti-pro",
    title: "難題",
    tagline: "由豆泥提問、AI 代筆作答的研究報告站——許多問題還沒有正解，但是要有人開始問。",
    url: "https://pro.mashbean.net/",
    repo: "https://github.com/mashbean/blog-pro",
    chips: ["AI 代筆", "研究報告"],
    cover: "images/works/nanti-pro.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "fiction",
    title: "小說集《普通人》",
    tagline: "五篇小說：框架由豆泥設計、文字由 AI 執筆，把還沒有正解的難題寫成故事。",
    url: "https://pro.mashbean.net/fiction/",
    repo: "https://github.com/mashbean/blog-pro",
    chips: ["小說", "AI 代筆"],
    cover: "images/works/fiction.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "qian-dao",
    title: "籤到",
    tagline:
      "上班前，先打卡籤到。128 首原創籤詩的線上求籤所：稟告、擲筊、搖籤筒、三聖筊確認——神明可以說不。",
    url: "https://check.mashbean.net/",
    repo: "https://github.com/mashbean/qian-dao",
    chips: ["純靜態", "WebAudio 合成音效"],
    cover: "images/works/qian-dao.jpg",
    date: "2026-07-23",
    group: "personal",
  },
  {
    slug: "onion-gateway",
    title: "洋蔥小站",
    tagline:
      "Matters 的 Tor 唯讀閱讀入口：匿名讀者不留痕跡地讀文章、查作者、下載 Markdown，全站不記 log。",
    url: "http://v234hfbpwvhly7byty2pc7yvmp2f5nvvu6g6estjmbd7dimavj6xieqd.onion/",
    repo: "https://github.com/thematters/matters-onion-gateway",
    chips: ["Tor", "匿名閱讀"],
    note: "需以 Tor Browser 開啟",
    cover: "images/works/onion-gateway.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "safety-guide",
    title: "Matters 安全指南",
    tagline:
      "給獨立記者與敏感議題寫作者的安全指南：從查資料、聯絡、上稿到收款，看懂平台來函、洋蔥小站、IPFS 與個人備份。",
    url: "https://safety.matters.town/",
    repo: "https://github.com/thematters/matters-safety-guide",
    chips: ["數位安全", "獨立記者"],
    cover: "images/works/safety-guide.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "seven-day-book-museum",
    title: "七日書博物館",
    tagline: "歷屆七日書的典藏館：每一期的七道題目、大滿貫與參加獎名冊，寫過的都留了下來。",
    url: "https://freewriting.matters.town/museum",
    repo: "https://github.com/thematters/seven-day-book-landing",
    chips: ["社群書寫"],
    cover: "images/works/seven-day-book-museum.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "lifeboat",
    title: "記憶吐司",
    tagline:
      "matters.town 文章一鍵備份：下載 ZIP、pin 上 IPFS、或直接長成自己的獨立站。你的文字，自己好好收著。",
    url: "https://lifeboat.matters.town/",
    repo: "https://github.com/thematters/matters-lifeboat",
    chips: ["資料可攜", "IPFS"],
    cover: "images/works/lifeboat.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "fediverse-gateway",
    title: "聯邦宇宙閘道",
    tagline:
      "ActivityPub gateway，讓 Matters 長文走進聯邦宇宙：Mastodon、Misskey、Threads 都能追蹤、回覆、轉發。",
    url: "https://fediverse-gateway.matters.town/",
    repo: "https://github.com/thematters/matters-fediverse-gateway",
    chips: ["ActivityPub", "開發中"],
    cover: "images/works/fediverse-gateway.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "community-watch",
    title: "守望相助隊",
    tagline:
      "讓一小群受信任的市民清理 spam 留言：每一次出手都公開可稽核、可申訴、可回復，把審查攤在陽光下。",
    url: "https://community-watch.matters.town/",
    repo: "https://github.com/thematters/community-watch",
    chips: ["社群治理"],
    cover: "images/works/community-watch.jpg",
    date: "2026-07-23",
    group: "matters",
  },
  {
    slug: "governance",
    title: "平台清道夫",
    tagline:
      "審查還是抗審查？以 Matters 2018–2025 的治理史為案例，科普垃圾清理、排序演算法與透明開盒的兩難。",
    url: "https://governance.matters.town/",
    repo: "https://github.com/thematters/matters-governance-site",
    chips: ["治理科普", "TWNIC 計畫"],
    cover: "images/works/governance.jpg",
    date: "2026-07-23",
    group: "matters",
  },
];
