import { DEFAULT_LOCALE, type Locale } from "@/site.config";

export function withBase(path = ""): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  const normalizedPath = path.replace(/^\/+/, "");
  if (!normalizedPath) return base;

  return `${base}${normalizedPath}`;
}

// 具語言意識的路徑：非預設語言（en）在 base 之後加上語言前綴，
// 例如 localizePath("about/", "en") -> "{base}en/about/"。
// 預設語言（zh-TW）行為與 withBase 相同，避免動到既有連結。
export function localizePath(path = "", locale: Locale = DEFAULT_LOCALE): string {
  const normalizedPath = path.replace(/^\/+/, "");
  if (locale === DEFAULT_LOCALE) return withBase(normalizedPath);
  return withBase(`${locale}/${normalizedPath}`);
}

// 由 pathname（含或不含 base）判斷目前語言。/en 或 /en/... 視為 en。
export function getLocaleFromPathname(pathname: string): Locale {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  let rest = pathname;
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  rest = rest.replace(/^\/+/, "");
  const first = rest.split("/")[0];
  return first === "en" ? "en" : DEFAULT_LOCALE;
}
