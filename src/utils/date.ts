import { DEFAULT_LOCALE, SITE_TIMEZONE, type Locale } from "@/site.config";

const dateOptions: Intl.DateTimeFormatOptions = {
  timeZone: SITE_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
};

const formatters: Record<Locale, Intl.DateTimeFormat> = {
  "zh-TW": new Intl.DateTimeFormat("zh-TW", dateOptions),
  en: new Intl.DateTimeFormat("en-CA", dateOptions) // en-CA yields YYYY-MM-DD
};

export function formatDate(date: Date, locale: Locale = DEFAULT_LOCALE): string {
  return (formatters[locale] ?? formatters[DEFAULT_LOCALE]).format(date);
}
