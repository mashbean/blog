import { DEFAULT_LOCALE, type Locale } from "@/site.config";

// 全站 UI 字串目錄。文章／頁面正文不在此（走 content collections 與資料檔），
// 這裡只放介面 chrome、狀態訊息、aria-label 等。逐階段擴充。
export interface UIStrings {
  langName: string; // 目前語言的名稱（顯示在語言切換上，指向「另一個」語言）
  switchToLabel: string; // 語言切換連結文字（指向另一語言）
  switchToAria: string;

  nav: {
    about: string;
    blog: string;
    decks: string;
    works: string;
    tags: string;
    search: string;
    subscribe: string;
    menu: string; // aria: 主選單
    addFriend: string; // 加我好友
    closeDrawer: string; // 關閉抽屜
    close: string; // 關閉
    sectionSocial: string; // 社群平台
    sectionWeb3: string; // WEB3 聯邦宇宙
    sectionSubscribe: string; // 訂閱
    sectionFederation: string; // 聯邦入口
  };

  footer: {
    license: string; // CC 授權句（完整）
    subscribe: string; // RSS 訂閱
  };

  layout: {
    skipToContent: string; // 跳到主要內容
    focusReading: string; // 聚焦閱讀
  };

  postCard: {
    fallbackCategory: string; // 文章
    readingMinutes: (n: number) => string; // 約 N 分鐘
    updated: string; // 更新
    tagsAria: string; // 文章標籤
  };

  workCard: {
    sourceCode: string; // 原始碼
  };

  deckCard: {
    en: string; // EN
    zh: string; // 中文
  };

  legacyRedirect: {
    heading: string; // 文章網址已更新
    link: string; // 文章網址已更新，點此前往新網址。
  };

  notFound: {
    metaTitle: string;
    metaDescription: string;
    body: string;
    home: string;
    blog: string;
  };

  subscribe: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    step1: [string, string]; // [粗體, 說明]
    step2: [string, string];
    step3: [string, string];
    feedUrl: string;
    copy: string;
    openFeedly: string;
    openInoreader: string;
    copied: string;
    copyFailed: string;
  };

  works: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
  };

  decks: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    meta: (n: number) => string;
    empty: string;
    listAria: string;
  };

  home: {
    metaDescription: string;
    heading: string;
    recentUpdates: string;
    browseAllAria: string;
    feedAria: string;
    empty: string;
    viewMore: string;
    statusShown: (visible: number, total: number) => string;
    statusAll: (total: number) => string;
    continueAria: string;
    continueCloseAria: string;
    continueReading: string;
    continuePrefix: (title: string) => string;
    progress: (pct: number) => string;
    sourceArticle: string;
    sourceDeck: string;
    sourceWork: string;
    sourcePro: string;
    labelArticle: string;
    labelDeck: string;
    labelWork: string;
    labelPro: string;
    deckEnglishTag: string;
  };
}

const zhTW: UIStrings = {
  langName: "中文",
  switchToLabel: "EN",
  switchToAria: "切換到英文版",

  nav: {
    about: "關於",
    blog: "文章",
    decks: "簡報",
    works: "作品",
    tags: "標籤",
    search: "搜尋",
    subscribe: "RSS 訂閱",
    menu: "主選單",
    addFriend: "加我好友",
    closeDrawer: "關閉抽屜",
    close: "關閉",
    sectionSocial: "社群平台",
    sectionWeb3: "WEB3 聯邦宇宙",
    sectionSubscribe: "訂閱",
    sectionFederation: "聯邦入口"
  },

  footer: {
    license:
      "本站文章皆採 CC BY-NC 4.0（姓名標示-非商業性）授權。",
    subscribe: "RSS 訂閱"
  },

  layout: {
    skipToContent: "跳到主要內容",
    focusReading: "聚焦閱讀"
  },

  postCard: {
    fallbackCategory: "文章",
    readingMinutes: (n) => `· 約 ${n} 分鐘`,
    updated: "更新",
    tagsAria: "文章標籤"
  },

  workCard: {
    sourceCode: "原始碼"
  },

  deckCard: {
    en: "EN",
    zh: "中文"
  },

  legacyRedirect: {
    heading: "文章網址已更新",
    link: "文章網址已更新，點此前往新網址。"
  },

  notFound: {
    metaTitle: "找不到頁面",
    metaDescription: "404 Not Found",
    body: "你要找的頁面不存在，或路徑已調整。",
    home: "回首頁",
    blog: "看文章列表"
  },

  subscribe: {
    metaTitle: "RSS 訂閱",
    metaDescription: "使用 RSS Reader 訂閱本站更新。",
    heading: "RSS 訂閱",
    intro: "如果你使用 RSS Reader，建議先選閱讀器，再貼上 Feed URL。",
    step1: ["選一個閱讀器：", "Feedly、Inoreader、NetNewsWire 都可以。"],
    step2: ["匯入 Feed URL：", "複製下面網址貼到閱讀器的「Add Feed」。"],
    step3: ["確認更新頻率：", "預設會抓最新文章與摘要。"],
    feedUrl: "Feed URL",
    copy: "複製 Feed URL",
    openFeedly: "用 Feedly 開啟",
    openInoreader: "用 Inoreader 開啟",
    copied: "Feed URL 已複製",
    copyFailed: "複製失敗，請手動選取網址"
  },

  works: {
    metaTitle: "作品集 / Works",
    metaDescription: "豆泥（mashbean）的數位手作攤位：個人實驗與馬特市的開源公共設施。",
    heading: "作品集"
  },

  decks: {
    metaTitle: "簡報 / Decks",
    metaDescription: "豆泥（mashbean）在各場演講、課堂與工作坊的簡報與投影片彙整。",
    heading: "簡報",
    meta: (n) => `${n} 份 · 各場演講、課堂與工作坊的投影片`,
    empty: "目前還沒有簡報。",
    listAria: "簡報列表"
  },

  home: {
    metaDescription: "站在單向鏡後方觀看世界應對加速科技的方式。",
    heading: "mashbean.net 是黃豆泥的部落格",
    recentUpdates: "最近更新",
    browseAllAria: "瀏覽所有內容",
    feedAria: "近期更新時間軸",
    empty: "目前還沒有更新。",
    viewMore: "觀看更多",
    statusShown: (v, total) => `已顯示 ${v} / ${total} 則更新`,
    statusAll: (total) => `已顯示全部 ${total} 則更新`,
    continueAria: "繼續閱讀通知",
    continueCloseAria: "關閉繼續閱讀通知",
    continueReading: "繼續閱讀",
    continuePrefix: (title) => `繼續閱讀｜${title}`,
    progress: (pct) => `進度 ${pct}%`,
    sourceArticle: "文章",
    sourceDeck: "簡報",
    sourceWork: "專題",
    sourcePro: "難題",
    labelArticle: "文章",
    labelDeck: "簡報",
    labelWork: "專題",
    labelPro: "難題",
    deckEnglishTag: "English"
  }
};

const en: UIStrings = {
  langName: "EN",
  switchToLabel: "中文",
  switchToAria: "Switch to Chinese",

  nav: {
    about: "About",
    blog: "Writing",
    decks: "Decks",
    works: "Works",
    tags: "Tags",
    search: "Search",
    subscribe: "RSS",
    menu: "Main menu",
    addFriend: "Connect with me",
    closeDrawer: "Close drawer",
    close: "Close",
    sectionSocial: "Social platforms",
    sectionWeb3: "Web3 fediverse",
    sectionSubscribe: "Subscribe",
    sectionFederation: "Federation portals"
  },

  footer: {
    license:
      "All articles on this site are licensed under CC BY-NC 4.0 (Attribution-NonCommercial).",
    subscribe: "RSS"
  },

  layout: {
    skipToContent: "Skip to main content",
    focusReading: "Focus mode"
  },

  postCard: {
    fallbackCategory: "Article",
    readingMinutes: (n) => `· ~${n} min read`,
    updated: "Updated",
    tagsAria: "Article tags"
  },

  workCard: {
    sourceCode: "Source"
  },

  deckCard: {
    en: "EN",
    zh: "中文"
  },

  legacyRedirect: {
    heading: "This URL has moved",
    link: "This article's URL has changed — click here for the new address."
  },

  notFound: {
    metaTitle: "Page not found",
    metaDescription: "404 Not Found",
    body: "The page you're looking for doesn't exist, or its path has changed.",
    home: "Back to home",
    blog: "Browse writing"
  },

  subscribe: {
    metaTitle: "RSS",
    metaDescription: "Subscribe to site updates with an RSS reader.",
    heading: "Subscribe via RSS",
    intro: "If you use an RSS reader, pick your reader first, then paste in the Feed URL.",
    step1: ["Pick a reader: ", "Feedly, Inoreader, or NetNewsWire all work."],
    step2: ["Import the Feed URL: ", "copy the address below into your reader's “Add Feed”."],
    step3: ["Set the refresh cadence: ", "by default it fetches the latest posts and summaries."],
    feedUrl: "Feed URL",
    copy: "Copy Feed URL",
    openFeedly: "Open in Feedly",
    openInoreader: "Open in Inoreader",
    copied: "Feed URL copied",
    copyFailed: "Copy failed — please select the address manually"
  },

  works: {
    metaTitle: "Works",
    metaDescription:
      "mashbean's digital-craft stall: personal experiments and Matters' open-source public infrastructure.",
    heading: "Works"
  },

  decks: {
    metaTitle: "Decks",
    metaDescription:
      "Slides from mashbean's talks, classes, and workshops, collected in one place.",
    heading: "Decks",
    meta: (n) => `${n} decks · slides from talks, classes, and workshops`,
    empty: "No decks yet.",
    listAria: "Deck list"
  },

  home: {
    metaDescription:
      "Standing behind a one-way mirror, watching how the world responds to accelerating technology.",
    heading: "mashbean.net is Yen-Lin (mashbean) Huang's blog",
    recentUpdates: "Recent updates",
    browseAllAria: "Browse all content",
    feedAria: "Recent updates timeline",
    empty: "No updates yet.",
    viewMore: "View more",
    statusShown: (v, total) => `Showing ${v} / ${total} updates`,
    statusAll: (total) => `Showing all ${total} updates`,
    continueAria: "Continue reading notification",
    continueCloseAria: "Dismiss continue-reading notification",
    continueReading: "Continue reading",
    continuePrefix: (title) => `Continue reading | ${title}`,
    progress: (pct) => `${pct}% read`,
    sourceArticle: "Writing",
    sourceDeck: "Decks",
    sourceWork: "Projects",
    sourcePro: "Hard problems",
    labelArticle: "Article",
    labelDeck: "Deck",
    labelWork: "Project",
    labelPro: "Hard problem",
    deckEnglishTag: "English"
  }
};

export const ui: Record<Locale, UIStrings> = {
  "zh-TW": zhTW,
  en
};

export function useTranslations(locale: Locale = DEFAULT_LOCALE): UIStrings {
  return ui[locale] ?? ui[DEFAULT_LOCALE];
}
