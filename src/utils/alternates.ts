import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/site.config";
import { getLocaleFromPathname, localizePath, withBase } from "@/utils/paths";

export interface LocaleAlternate {
  locale: Locale;
  /** base-relative URL (含站台 base、含語言前綴) */
  href: string;
}

export interface AlternateInfo {
  /** 目前頁面的語言 */
  current: Locale;
  /** 去除 base 與語言前綴後的邏輯路徑，例如 "about/"、""（首頁） */
  logicalPath: string;
  /** 各語言對應的 URL；hreflang 與語言切換共用 */
  alternates: LocaleAlternate[];
}

/**
 * 由目前頁面的 pathname 推導出各語言的對應網址。
 *
 * 預設假設每個頁面在兩種語言都有對應（靜態頁皆成立）。少數頁面
 * （例如只有部分文章有英譯）應改用 buildAlternatesFor 明確指定。
 */
export function getAlternatesFromPathname(pathname: string): AlternateInfo {
  const current = getLocaleFromPathname(pathname);
  const logicalPath = toLogicalPath(pathname);
  return {
    current,
    logicalPath,
    alternates: LOCALES.map((locale) => ({
      locale,
      href: localizePath(logicalPath, locale)
    }))
  };
}

/**
 * 明確以「邏輯路徑 → 各語言 URL」建立 alternates。
 * 傳入 availableLocales 可限制只在部分語言存在對應頁時輸出 hreflang。
 */
export function buildAlternatesFor(
  logicalPath: string,
  current: Locale,
  availableLocales: readonly Locale[] = LOCALES
): AlternateInfo {
  return {
    current,
    logicalPath,
    alternates: availableLocales.map((locale) => ({
      locale,
      href: localizePath(logicalPath, locale)
    }))
  };
}

/** 語言切換要指向的「另一個語言」的 URL（雙語情況下取非目前語言者）。 */
export function getSwitchTarget(info: AlternateInfo): LocaleAlternate | null {
  const other = info.alternates.find((a) => a.locale !== info.current);
  return other ?? null;
}

/** hreflang 用的 x-default：指向預設語言版本。 */
export function getXDefaultHref(info: AlternateInfo): string | null {
  const def = info.alternates.find((a) => a.locale === DEFAULT_LOCALE);
  return def?.href ?? null;
}

function toLogicalPath(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  let rest = pathname;
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  rest = rest.replace(/^\/+/, "");
  // 去掉語言前綴（en/）
  if (rest === "en" || rest.startsWith("en/")) {
    rest = rest.slice(2).replace(/^\/+/, "");
  }
  return rest;
}

// 保留 withBase 匯出方便呼叫端一併引入。
export { withBase };
