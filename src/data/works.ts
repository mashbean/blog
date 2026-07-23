// Source of truth for the /works/ 作品集 index. Works are external sites with
// no structured metadata, so titles / taglines / URLs are maintained here by
// hand. Grouped into 個人手作 (personal) and 馬特市工程 (Matters Lab open
// source); order within each group is curatorial, not chronological.
//
// Add a new work: append an entry here — the page renders whatever this
// array holds.

export interface Work {
  /** Stable id, used as the DOM anchor (`/works/#<slug>`). */
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
  group: "personal" | "matters";
}

export const workGroups: Record<Work["group"], { title: string; blurb: string }> = {
  personal: {
    title: "個人手作",
    blurb: "自己的攤位：一人專案，想到就做。",
  },
  matters: {
    title: "馬特市工程",
    blurb: "在 Matters 蓋的開源公共設施，程式碼全部公開。",
  },
};

export const works: Work[] = [
  {
    slug: "open-book",
    title: "OpenBook 臺灣開放預算",
    tagline:
      "把哈佛 Allen Lab 的市政預算透明工具改造成臺灣版：22 縣市總預算彙編一站看完，官方資料、OpenFun、TwinkleAI 三層對帳。",
    url: "https://mashbean.github.io/Open-Book/",
    repo: "https://github.com/mashbean/Open-Book",
    chips: ["開放資料", "中英雙語"],
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
    group: "personal",
  },
  {
    slug: "zhaogu",
    title: "照骨",
    tagline:
      "三世輪迴武俠文字 RPG：全文本二十萬字、22 種結局，選擇是唯一的機制。死過，才算入了江湖。",
    url: "https://github.com/mashbean/sanshi-jianghu",
    chips: ["文字遊戲", "位元像素", "線上版籌備中"],
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
    group: "matters",
  },
  {
    slug: "seven-day-book-museum",
    title: "七日書博物館",
    tagline: "歷屆七日書的典藏館：每一期的七道題目、大滿貫與參加獎名冊，寫過的都留了下來。",
    url: "https://freewriting.matters.town/museum",
    repo: "https://github.com/thematters/seven-day-book-landing",
    chips: ["社群書寫"],
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
    group: "matters",
  },
];
