import { tagCatalog, type TagCatalogItem } from "@/data/tagCatalog";

export interface PostTagInput {
  title: string;
  description?: string;
  body?: string;
  tags?: string[];
}

export interface ClassifiedTags {
  topics: string[];
  keywords: string[];
  metaTags: string[];
}

const TOPIC_KEYS = new Set(tagCatalog.map((item) => item.key));

const IGNORE_TAGS = new Set([
  "matters",
  "imported",
  "astro",
  "migration",
  "github pages",
  "hello"
]);

const TOPIC_ALIASES: Record<string, string> = {
  ai: "AI與科技",
  "人工智慧": "AI與科技",
  did: "AI與科技",
  "數位身分": "AI與科技",
  "digital identity": "AI與科技",

  dao: "治理與民主",
  "審議式民主": "治理與民主",
  "公共治理": "治理與民主",
  democracy: "治理與民主",
  governance: "治理與民主",

  web3: "web3",
  "公共網路": "公共網路",
  matters: "公共網路",
  "網路國家": "公共網路",
  "抗審查": "公共網路",

  nft: "web3",
  tezos: "web3",
  ethereum: "web3",
  "區塊鏈": "web3",
  "以太坊": "web3",
  "加密貨幣": "web3",

  "生成藝術": "數位藝術",
  "數位藝術": "數位藝術",
  art: "數位藝術",
  "藝術": "數位藝術",
  exhibition: "數位藝術",
  "展覽": "數位藝術",

  artouch: "薄荷薄荷專欄",
  "薄荷薄荷": "薄荷薄荷專欄",
  "薄荷薄荷專欄": "薄荷薄荷專欄"
};

const TOPIC_HINTS: Array<{ topic: string; regex: RegExp }> = [
  { topic: "薄荷薄荷專欄", regex: /薄荷薄荷|artouch/i },
  { topic: "AI與科技", regex: /\bai\b|人工智慧|數位身分|did|隱私|科技|技術/i },
  { topic: "治理與民主", regex: /治理|民主|政策|審議|公民|dao|公共財|補助|制度/i },
  { topic: "公共網路", regex: /公共網路|社群|媒體|出版|matters|網路|言論|抗審查|平台/i },
  { topic: "web3", regex: /\bnft\b|web3|tezos|ethereum|區塊鏈|以太坊|加密/i },
  { topic: "數位藝術", regex: /數位藝術|生成藝術|藝術|展覽|策展|linz|林茲/i }
];

function normalizeTag(raw: string): string {
  return raw
    .trim()
    .replace(/^#\s*/, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("zh-TW");
}

function denormalizeTag(raw: string): string {
  return raw.trim().replace(/^#\s*/, "").replace(/\s+/g, " ");
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function getTopicCatalog(): TagCatalogItem[] {
  return tagCatalog;
}

export function classifyPostTags(input: PostTagInput): ClassifiedTags {
  const rawTags = uniqueStrings((input.tags ?? []).map(denormalizeTag));
  const normalizedTags = rawTags.map((tag) => normalizeTag(tag));

  const topics: string[] = [];
  const keywords: string[] = [];
  const metaTags: string[] = [];

  for (let i = 0; i < rawTags.length; i += 1) {
    const raw = rawTags[i];
    const norm = normalizedTags[i];

    if (TOPIC_KEYS.has(raw)) {
      topics.push(raw);
      continue;
    }

    if (IGNORE_TAGS.has(norm)) {
      metaTags.push(raw);
      continue;
    }

    const aliasTopic = TOPIC_ALIASES[norm];
    if (aliasTopic) {
      topics.push(aliasTopic);
    }

    keywords.push(raw);
  }

  const text = `${input.title} ${input.description ?? ""} ${input.body ?? ""}`;

  if (topics.length === 0) {
    for (const hint of TOPIC_HINTS) {
      if (hint.regex.test(text)) topics.push(hint.topic);
    }
  }

  if (topics.length === 0) {
    topics.push("公共網路");
  }

  const uniqueTopics = uniqueStrings(topics).filter((topic) => TOPIC_KEYS.has(topic));

  const keywordFiltered = uniqueStrings(keywords)
    .filter((tag) => !TOPIC_KEYS.has(tag))
    .filter((tag) => !IGNORE_TAGS.has(normalizeTag(tag)))
    .slice(0, 12);

  return {
    topics: uniqueTopics,
    keywords: keywordFiltered,
    metaTags: uniqueStrings(metaTags)
  };
}

export function getTopicAliasKeywords(topicKey: string): string[] {
  return Object.entries(TOPIC_ALIASES)
    .filter(([, target]) => target === topicKey)
    .map(([alias]) => alias);
}
