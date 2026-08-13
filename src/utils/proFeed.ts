const PRO_RSS_URL = "https://pro.mashbean.net/rss.xml";
const PRO_BASE_URL = "https://pro.mashbean.net";

export interface ProFeedEntry {
  title: string;
  description: string;
  date: Date;
  url: string;
  image?: string;
}

const fallbackEntries: ProFeedEntry[] = [
  {
    title: "人民的維基百科被硬分叉之後",
    description:
      "俄語維基百科與 Ruwiki 從近兩百萬篇相同條目出發。逐頁比較戰爭、納瓦尼、LGBT 與華格納兵變等主題，看見百科全書外觀下逐漸收窄的爭論範圍。",
    date: new Date("2026-08-12T00:00:00Z"),
    url: `${PRO_BASE_URL}/reports/2026-08-12-ruwiki-wikipedia-censorship/`,
    image: `${PRO_BASE_URL}/og/2026-08-12-ruwiki-wikipedia-censorship.png`,
  },
  {
    title: "少看臉，會讓人長大後臉盲嗎？自閉特質、早期經驗與直視文化的證據",
    description:
      "成人臉孔辨識困難、自閉相關的觀看差異與文化中的避免直視確有部分關聯，現有研究仍不足以證明少看眼睛會單向造成成年臉盲。",
    date: new Date("2026-08-12T00:00:00Z"),
    url: `${PRO_BASE_URL}/reports/2026-08-12-face-recognition-autistic-traits-eye-contact-culture/`,
    image: `${PRO_BASE_URL}/og/2026-08-12-face-recognition-autistic-traits-eye-contact-culture.png`,
  },
  {
    title: "讓作品先說話　AI 文學創作與匿名互評的國際案例",
    description:
      "整理人機共寫、文學盲讀、匿名同儕回饋與單次生成活動的國際案例，提出讓創作者兼任評讀者、分階段揭露來源的課程原型。",
    date: new Date("2026-08-10T00:00:00Z"),
    url: `${PRO_BASE_URL}/reports/2026-08-10-ai-literary-creation-anonymous-review/`,
    image: `${PRO_BASE_URL}/og/2026-08-10-ai-literary-creation-anonymous-review.png`,
  },
  {
    title: "用政府自己公開的資料檢查 DNS RPZ：第一輪分析",
    description:
      "以公共後綴清單、Tranco 排名與 Wayback 存檔比對警政署公開的停止解析網域，檢查資料規模、恢復率與治理品質。",
    date: new Date("2026-08-10T00:00:00Z"),
    url: `${PRO_BASE_URL}/reports/2026-08-10-dns-rpz-open-data-first-pass/`,
    image: `${PRO_BASE_URL}/og/2026-08-10-dns-rpz-open-data-first-pass.png`,
  },
  {
    title: "台灣 DNS RPZ 治理機制：法源、演進、爭議與可研究的資料",
    description:
      "盤點台灣停止解析網域的法源結構、程序設計、當事人配置與國際定位，並提出可執行的研究設計與政策建議。",
    date: new Date("2026-08-06T00:00:00Z"),
    url: `${PRO_BASE_URL}/reports/2026-08-06-taiwan-dns-rpz-governance/`,
    image: `${PRO_BASE_URL}/og/2026-08-06-taiwan-dns-rpz-governance.png`,
  },
];

const decodeXml = (value: string): string =>
  value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const readTag = (item: string, tag: string): string => {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
};

const getOgImage = (url: string): string | undefined => {
  try {
    const pathParts = new URL(url).pathname.split("/").filter(Boolean);
    const slug = pathParts.at(-1);
    return slug ? `${PRO_BASE_URL}/og/${slug}.png` : undefined;
  } catch {
    return undefined;
  }
};

const parseRss = (xml: string): ProFeedEntry[] =>
  [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const item = match[1];
      const title = readTag(item, "title");
      const description = readTag(item, "description");
      const url = readTag(item, "link");
      const date = new Date(readTag(item, "pubDate"));
      return { title, description, url, date, image: getOgImage(url) };
    })
    .filter(
      (entry) =>
        entry.title.length > 0 &&
        entry.description.length > 0 &&
        entry.url.startsWith(`${PRO_BASE_URL}/`) &&
        !Number.isNaN(entry.date.getTime()),
    );

export async function getProFeedEntries(): Promise<ProFeedEntry[]> {
  try {
    const response = await fetch(PRO_RSS_URL, {
      headers: { Accept: "application/rss+xml, application/xml;q=0.9" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`RSS ${response.status}`);

    const entries = parseRss(await response.text());
    return entries.length > 0 ? entries : fallbackEntries;
  } catch {
    return fallbackEntries;
  }
}
