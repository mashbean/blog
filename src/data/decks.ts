// Source of truth for the /decks/ index. Decks are static presentations under
// public/decks/<slug>/ and carry no structured metadata, so titles / events /
// dates are maintained here by hand. Pre-filled from each deck's <title>, the
// slug, and the git add-date — refine `event`, `location`, and `date` as needed
// (dates for the g0v/TWIGF/TWNIC talks are approximate add-dates).
//
// The index renders text-only cards (no thumbnails). For acronym events
// (TWIGF/TWNIC/…) include the Chinese name in `event` when there is one.
//
// Add a new deck: drop it in public/decks/<slug>/, then add an entry here.

export interface Deck {
  /** Folder under public/decks/, e.g. "Prof-Hu-Class-0526". */
  slug: string;
  /** Clean talk title (without the ·event·date suffix). */
  title: string;
  /** Occasion / host, shown under the title (bilingual where applicable). */
  event?: string;
  /** ISO date, used for sort + display. */
  date: string;
  /** Optional place. */
  location?: string;
  lang: "zh-Hant" | "en";
  /** Link target; defaults to `/decks/<slug>/`. */
  url?: string;
  featured?: boolean;
  /** Hidden in production (e.g. test decks). */
  draft?: boolean;
}

export const decks: Deck[] = [
  {
    slug: "toda-metagov-2026",
    title: "Taiwan's present, after touching the future",
    event: "Interoperable Deliberative Tools in the Asia Pacific · TODA Peace Institute × MetaGov",
    date: "2026-08-14",
    location: "Japan",
    lang: "en",
    featured: true,
  },
  {
    slug: "clinical-ai-agent-0814",
    title: "臨床工作者的 AI Agent 第一課",
    event: "AI 醫點也不難 · 醫療人的 AI 實作課",
    date: "2026-08-14",
    lang: "zh-Hant",
    featured: true,
  },
  {
    slug: "coscup-2026-open-procurement",
    title: "政府採購如何使用開源？為何開源？",
    event: "COSCUP 2026",
    date: "2026-08-09",
    lang: "zh-Hant",
  },
  {
    slug: "coscup-2026-age-verification",
    title: "年齡驗證、數位監控、隱私權，討論這些以前，不妨先開源吧",
    event: "COSCUP 2026",
    date: "2026-08-09",
    location: "TR209",
    lang: "zh-Hant",
  },
  {
    slug: "coscup-2026-privacy-money",
    title: "我不洗錢，為何要理解匿名支付？",
    event: "COSCUP 2026 · 匿名網路社群 anoni.net",
    date: "2026-08-08",
    location: "TR511",
    lang: "zh-Hant",
  },
  {
    slug: "tianjian-2026-0826",
    title: "平台中介者如何成為保護獨立記者的屏障",
    event: "在田間學 · 田間 China Media Project",
    date: "2026-08-26",
    lang: "zh-Hant",
  },
  {
    slug: "ai-work-agency-reading-1",
    title: "在被 AI 離職與焦慮之間，選擇躺平",
    event: "文化前線 II 讀書會",
    date: "2026-06-28",
    lang: "zh-Hant",
  },
  {
    slug: "c-lab-0610",
    title: "AI Agent 如何改變我的工作與生活",
    event: "C-LAB",
    date: "2026-06-10",
    lang: "zh-Hant",
  },
  {
    slug: "demo-2026-06-10",
    title: "Demo 假簡報",
    event: "簡報系統測試",
    date: "2026-06-10",
    lang: "zh-Hant",
    draft: true,
  },
  {
    slug: "Prof-Hu-Class-0526",
    title: "自由與管制的天平：安全的服務還是自由的網路",
    event: "胡博硯老師課堂",
    date: "2026-05-26",
    lang: "zh-Hant",
  },
  {
    slug: "g0v-summit-2026-fabdao",
    title: "web3 真的能實踐去中心自治嗎？",
    event: "g0v Summit 2026 · FAB DAO",
    date: "2026-05-22",
    lang: "zh-Hant",
  },
  {
    slug: "g0v-summit-2026-matters",
    title: "平台使用者是商品、是消費者、還是公民？",
    event: "g0v Summit 2026 · Matters 工作坊",
    date: "2026-05-22",
    lang: "zh-Hant",
  },
  {
    slug: "twigf-2026-pre-alignment",
    title: "AI Agent 與 Digital Twin 進入開放網路後的身分識別",
    event: "TWIGF 2026 · 台灣網路治理論壇",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "twigf-2026-matters",
    title: "平台使用者是商品、是消費者、還是公民？",
    event: "TWIGF 2026 · 台灣網路治理論壇",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "twnic-2026-newcomers",
    title: "網路治理的世界中，誰是新血？",
    event: "TWNIC Engagement Forum 2026 · 台灣網路資訊中心",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "isf-0427",
    title: "How AI Agents Changed My Work and Life",
    event: "International Strategic Forum · 國際戰略論壇",
    date: "2026-04-27",
    lang: "en",
  },
  {
    // Lives under /blog/, not /decks/ — needs a url override.
    slug: "allen-lab-share-0417-zh",
    title: "從國家證件到公民證明",
    event: "Harvard Ash Center · Allen Lab Fellow Meeting",
    date: "2026-04-17",
    lang: "zh-Hant",
    url: "/blog/allen-lab-share-0417-zh/",
  },
  {
    slug: "allen-lab-share-0417-en",
    title: "From State Credentials to Civic Proofs",
    event: "Harvard Ash Center · Allen Lab Fellow Meeting",
    date: "2026-04-17",
    lang: "en",
    url: "/blog/allen-lab-share-0417-en/",
  },
];

export interface ResolvedDeck extends Deck {
  url: string;
}

/** Decks sorted newest-first, with url defaults filled; drafts dropped in prod. */
export const getDecks = (): ResolvedDeck[] =>
  decks
    .filter((deck) => (import.meta.env.PROD ? !deck.draft : true))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((deck) => ({
      ...deck,
      url: deck.url ?? `/decks/${deck.slug}/`,
    }));
