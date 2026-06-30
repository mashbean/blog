// Source of truth for the /decks/ index. Decks are static HTML under
// public/decks/<slug>/ and carry no structured metadata, so titles / events /
// dates are maintained here by hand. Pre-filled from each deck's <title>, the
// slug, and the git add-date — refine `event`, `location`, and `date` as needed
// (dates for the g0v/TWIGF/TWNIC talks are approximate add-dates).
//
// Add a new deck: drop it in public/decks/<slug>/, add an entry here, then run
// `npm run decks:thumbs` to generate its thumbnail.

export interface Deck {
  /** Folder under public/decks/, e.g. "Prof-Hu-Class-0526". */
  slug: string;
  /** Clean talk title (without the ·event·date suffix). */
  title: string;
  /** Occasion / host, shown under the title. */
  event?: string;
  /** ISO date, used for sort + display. */
  date: string;
  /** Optional place. */
  location?: string;
  lang: "zh-Hant" | "en";
  /** Link target; defaults to `/decks/<slug>/`. */
  url?: string;
  /** Thumbnail; defaults to `/images/decks/<slug>.jpg`. */
  thumb?: string;
  featured?: boolean;
  /** Hidden in production (e.g. test decks). */
  draft?: boolean;
}

export const decks: Deck[] = [
  {
    slug: "ai-work-agency-reading-1",
    title: "AI、工作與能動性",
    event: "文化前線 II 讀書會",
    date: "2026-06-28",
    lang: "zh-Hant",
  },
  {
    slug: "ai-work-agency-reading",
    title: "AI、工作焦慮與能動性",
    event: "文化前線 II 讀書會",
    date: "2026-06-17",
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
    title: "Matters 工作坊",
    event: "g0v Summit 2026",
    date: "2026-05-22",
    lang: "zh-Hant",
  },
  {
    slug: "twigf-2026-pre-alignment",
    title: "AI Agent 與 Digital Twin 進入開放網路後的身分識別",
    event: "TWIGF 2026",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "twigf-2026-matters",
    title: "會前討論簡報",
    event: "TWIGF 2026",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "twnic-2026-newcomers",
    title: "網路治理的世界中，誰是新血？",
    event: "TWNIC Engagement Forum 2026 · Opening",
    date: "2026-05-04",
    lang: "zh-Hant",
  },
  {
    slug: "isf-0427",
    title: "How AI Agents Changed My Work and Life",
    event: "ISF",
    date: "2026-04-27",
    lang: "en",
  },
];

export interface ResolvedDeck extends Deck {
  url: string;
  thumb: string;
}

/** Decks sorted newest-first, with url/thumb defaults filled; drafts dropped in prod. */
export const getDecks = (): ResolvedDeck[] =>
  decks
    .filter((deck) => import.meta.env.PROD ? !deck.draft : true)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((deck) => ({
      ...deck,
      url: deck.url ?? `/decks/${deck.slug}/`,
      thumb: deck.thumb ?? `/images/decks/${deck.slug}.jpg`,
    }));
