import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const LAB_ROOT = path.resolve(ROOT, "..", "rag-lab");
const DATA_DIR = path.join(LAB_ROOT, "data");
const CORPUS_FILE = path.join(DATA_DIR, "corpus.json");
const OUTPUT_FILE = path.join(DATA_DIR, "gold-set-candidates.json");
const GOLD_SET_FILE = path.join(DATA_DIR, "gold-set.json");

const TAG_RULES = {
  worldview_anchor: ["治理與民主", "公共網路", "AI與科技", "數位身分", "公共性", "隱私", "民主"],
  argument_anchor: ["治理與民主", "web3", "數位藝術", "公共網路", "AI與科技"],
  humor_anchor: ["facebook"],
  style_anchor: ["blog", "facebook"]
};

function overlapScore(values, rules) {
  return rules.reduce((sum, rule) => {
    return sum + (values.some((value) => value.includes(rule) || rule.includes(value)) ? 1 : 0);
  }, 0);
}

function buildDocumentScore(document, anchorType) {
  const tags = document.tags ?? [];
  const title = document.title ?? "";
  const keywords = (document.keywords ?? []).map((item) => item.token);
  const lexicalPool = [...tags, title, ...keywords];
  const tagScore = overlapScore(lexicalPool, TAG_RULES[anchorType] ?? []);
  const recentBoost = document.era === "recent" ? 1 : 0;
  const lengthBoost = Math.min(4, Math.round(document.tokenCount / 80));
  const collectionBoost =
    (anchorType === "humor_anchor" && document.collection === "facebook" ? 3 : 0) +
    (anchorType === "style_anchor" && document.collection === "blog" ? 2 : 0) +
    (anchorType === "worldview_anchor" && document.collection === "blog" ? 2 : 0);
  const contentTypeBoost =
    (anchorType === "argument_anchor" && ["commentary", "article", "speech"].includes(document.contentType) ? 2 : 0) +
    (anchorType === "style_anchor" && ["essay", "commentary", "micro-essay"].includes(document.contentType) ? 2 : 0);
  const antiTranslationPenalty = document.contentType === "translation" ? -2 : 0;
  const humorSignal =
    anchorType === "humor_anchor" &&
    /XD|哈哈|笑|荒謬|蛤|欸|靠|手叉腰|吐槽|尷尬/.test(`${title} ${document.description}`)
      ? 3
      : 0;

  return tagScore + recentBoost + lengthBoost + collectionBoost + contentTypeBoost + antiTranslationPenalty + humorSignal;
}

function pickCandidates(documents, anchorType, limit) {
  return documents
    .map((document) => ({
      anchorType,
      score: buildDocumentScore(document, anchorType),
      id: document.id,
      collection: document.collection,
      filepath: document.filepath,
      title: document.title,
      tags: document.tags,
      contentType: document.contentType,
      era: document.era,
      tokenCount: document.tokenCount,
      why: buildWhy(document, anchorType)
    }))
    .sort((left, right) => right.score - left.score || right.tokenCount - left.tokenCount)
    .slice(0, limit);
}

function buildWhy(document, anchorType) {
  const reasons = [];
  if (document.collection === "facebook") reasons.push("臉書文章來源");
  if (document.collection === "blog") reasons.push("精選文章來源");
  if (document.era === "recent") reasons.push("近年寫作樣態");
  if (document.contentType === "micro-essay") reasons.push("短篇節奏可觀察");
  if (document.contentType === "commentary") reasons.push("評論型論證明顯");
  if (document.contentType === "essay") reasons.push("隨筆感強");
  if (document.contentType === "translation") reasons.push("譯寫口吻，需人工確認是否適合作 anchor");
  if ((document.tags ?? []).length > 0) reasons.push(`tags: ${(document.tags ?? []).slice(0, 4).join("、")}`);
  reasons.push(`anchorType=${anchorType}`);
  return reasons;
}

async function main() {
  const corpus = JSON.parse(await fs.readFile(CORPUS_FILE, "utf8"));
  const documents = corpus.documents.filter(
    (document) => document.collection === "blog" || document.collection === "facebook"
  );

  const payload = {
    generatedAt: new Date().toISOString(),
    sourcePolicy: {
      allowedCollections: ["blog", "facebook"],
      counts: documents.reduce((accumulator, document) => {
        accumulator[document.collection] = (accumulator[document.collection] ?? 0) + 1;
        return accumulator;
      }, {}),
      note: "只從精選文章與臉書文章挑選，不納入其他來源。"
    },
    recommendation: {
      targetCount: "10-20",
      note: "這是機器預選 shortlist，不是最終 gold set；需要人工複核。"
    },
    candidates: {
      style_anchor: pickCandidates(documents, "style_anchor", 8),
      worldview_anchor: pickCandidates(documents, "worldview_anchor", 8),
      humor_anchor: pickCandidates(documents, "humor_anchor", 8),
      argument_anchor: pickCandidates(documents, "argument_anchor", 8)
    }
  };

  const curatedIds = {
    style_anchor: [
      "blog:2024-07-02-變革日紀要在美術館討論魔改規則-豆泥-matters",
      "blog:2025-06-18-icann隨筆-區塊鏈域名與頂級域名與穩定幣-豆泥-matters",
      "blog:2021-09-14-馬特市旅遊短記一名數位觀光客的凝視"
    ],
    worldview_anchor: [
      "blog:2023-07-18-尋找有別於電馭極權與財閥亂鬥的第三條路",
      "blog:2023-08-22-初探-polis-20邁向關鍵評論網絡",
      "blog:2024-10-22-薄荷薄荷以民主之名的ai自主武器臺灣人必須買單嗎-artouch"
    ],
    humor_anchor: [
      "facebook:2017-04-16-fb-0125",
      "facebook:2026-01-13-fb-0004",
      "facebook:2024-05-10-fb-0191"
    ],
    argument_anchor: [
      "blog:2023-09-02-引言何謂超越式的文化科技治理",
      "blog:2022-07-19-我們想要用web3工具打造台灣公共生態系",
      "blog:2025-06-29-薄菏薄菏專欄nft涼了數位藝術家呢-artouch"
    ]
  };

  const goldSet = {
    generatedAt: new Date().toISOString(),
    status: "seed",
    sourcePolicy: payload.sourcePolicy,
    note: "第一版正式 gold set，只從精選文章與臉書文章中挑出。後續仍可人工替換或擴充。",
    entries: Object.entries(curatedIds).flatMap(([anchorType, ids]) =>
      ids
        .map((id) => {
          const document = documents.find((item) => item.id === id);
          if (!document) return null;
          return {
            id: document.id,
            anchorType,
            collection: document.collection,
            filepath: document.filepath,
            title: document.title,
            tags: document.tags,
            contentType: document.contentType,
            era: document.era,
            tokenCount: document.tokenCount,
            rationale: buildWhy(document, anchorType),
            selectedBy: "seed-curation"
          };
        })
        .filter(Boolean)
    )
  };

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(GOLD_SET_FILE, `${JSON.stringify(goldSet, null, 2)}\n`, "utf8");
  console.log(
    `[rag:build-gold-set] wrote ${path.relative(ROOT, OUTPUT_FILE)} and ${path.relative(ROOT, GOLD_SET_FILE)}`
  );
}

main().catch((error) => {
  console.error("[rag:build-gold-set] failed:", error);
  process.exitCode = 1;
});
