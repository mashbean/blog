export const SITE_TITLE = "mashbean blog";
export const SITE_DESCRIPTION = "站在單向鏡後方觀看世界應對加速科技的方式。";
export const SITE_TITLE_EN = "mashbean blog";
export const SITE_DESCRIPTION_EN =
  "Standing behind a one-way mirror, watching how the world responds to accelerating technology.";
export const SITE_LANG = "zh-TW";
export const SITE_TIMEZONE = "Asia/Taipei";
export const DEFAULT_AUTHOR = "mashbean";
export const DEFAULT_OG_IMAGE = "images/og-home-1200x630.png";

// 支援的語言。zh-TW 為預設（無網址前綴），en 對應 /en/ 子路徑。
export const LOCALES = ["zh-TW", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh-TW";
