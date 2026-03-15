import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";

const ROOT = process.cwd();
const LAB_DIR = path.resolve(ROOT, "..", "rag-lab");
const SESSIONS_DIR = path.join(LAB_DIR, "sessions");
const EXPORTS_DIR = path.join(LAB_DIR, "exports");
const LOGS_DIR = path.join(LAB_DIR, "logs");
const SESSION_FILE = path.join(SESSIONS_DIR, "sessions.json");
const DATA_DIR = path.join(LAB_DIR, "data");
const GOLD_REVIEW_FILE = path.join(DATA_DIR, "gold-set-review.json");
const GOLD_SET_FILE = path.join(DATA_DIR, "gold-set.json");
const GOLD_CANDIDATES_FILE = path.join(DATA_DIR, "gold-set-candidates.json");
const CORPUS_FILE = path.join(DATA_DIR, "corpus.json");
const WORLDVIEW_FILE = path.join(DATA_DIR, "worldview-profile.json");
const DRAFT_LOG_FILE = path.join(LOGS_DIR, "draft-api.log");
const HOST = process.env.RAG_LAB_HOST ?? "127.0.0.1";
const PORT = Number(process.env.RAG_LAB_PORT ?? "4173");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const RAG_DRAFT_MODEL = process.env.RAG_DRAFT_MODEL ?? "gpt-5.2";
const RAG_REASONING_EFFORT = process.env.RAG_REASONING_EFFORT ?? "medium";
const RAG_TEMPERATURE = Number(process.env.RAG_TEMPERATURE ?? "1");
const OPENAI_TIMEOUT_MS = Number(process.env.RAG_OPENAI_TIMEOUT_MS ?? "120000");
const RAG_OPENAI_RETRIES = Number(process.env.RAG_OPENAI_RETRIES ?? "2");

let corpusCache = null;
let worldviewCache = null;
let retrievalIndexCache = null;
let goldSetCache = null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

async function ensureStorage() {
  await fs.mkdir(SESSIONS_DIR, { recursive: true });
  await fs.mkdir(EXPORTS_DIR, { recursive: true });
  await fs.mkdir(LOGS_DIR, { recursive: true });
  try {
    await fs.access(SESSION_FILE);
  } catch {
    await fs.writeFile(
      SESSION_FILE,
      `${JSON.stringify({ updatedAt: new Date().toISOString(), sessions: [] }, null, 2)}\n`,
      "utf8"
    );
  }
  try {
    await fs.access(GOLD_REVIEW_FILE);
  } catch {
    await fs.writeFile(
      GOLD_REVIEW_FILE,
      `${JSON.stringify({ updatedAt: new Date().toISOString(), decisions: {} }, null, 2)}\n`,
      "utf8"
    );
  }
}

async function appendDraftLog(entry) {
  const line = JSON.stringify({ timestamp: new Date().toISOString(), ...entry });
  await fs.appendFile(DRAFT_LOG_FILE, `${line}\n`, "utf8");
}

async function readSessionStore() {
  await ensureStorage();
  return JSON.parse(await fs.readFile(SESSION_FILE, "utf8"));
}

async function writeSessionStore(store) {
  await fs.writeFile(
    SESSION_FILE,
    `${JSON.stringify({ ...store, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    "utf8"
  );
}

async function readGoldReview() {
  await ensureStorage();
  return JSON.parse(await fs.readFile(GOLD_REVIEW_FILE, "utf8"));
}

async function writeGoldReview(review) {
  await fs.writeFile(
    GOLD_REVIEW_FILE,
    `${JSON.stringify({ ...review, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    "utf8"
  );
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function loadCorpus() {
  if (!corpusCache) {
    corpusCache = JSON.parse(await fs.readFile(CORPUS_FILE, "utf8"));
  }
  return corpusCache;
}

async function loadWorldview() {
  if (!worldviewCache) {
    worldviewCache = JSON.parse(await fs.readFile(WORLDVIEW_FILE, "utf8"));
  }
  return worldviewCache;
}

async function loadGoldSet() {
  if (!goldSetCache) {
    goldSetCache = JSON.parse(await fs.readFile(GOLD_SET_FILE, "utf8"));
  }
  return goldSetCache;
}

class HttpError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

function tokenize(text) {
  const lowered = String(text).toLowerCase();
  const latinTokens = lowered.match(/[a-z0-9][a-z0-9_-]{1,}/g) ?? [];
  const cjkSegments = lowered.match(/[㐀-鿿]+/g) ?? [];
  const cjkTokens = [];

  for (const segment of cjkSegments) {
    if (segment.length >= 2 && segment.length <= 12) cjkTokens.push(segment);
    const maxGram = Math.min(4, segment.length);
    for (let size = 2; size <= maxGram; size += 1) {
      for (let index = 0; index <= segment.length - size; index += 1) {
        cjkTokens.push(segment.slice(index, index + size));
      }
    }
  }

  return Array.from(new Set([...latinTokens, ...cjkTokens]));
}

function countTerms(tokens) {
  const counts = new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeComparable(text) {
  return String(text).toLowerCase().replace(/\s+/g, "");
}

function detectSensitiveTopic(input) {
  const combined = [input.topic, input.material, input.observation, (input.links ?? []).join(" ")].join("\n");
  const patterns = [
    /美國|以色列|伊朗|中國|俄羅斯|烏克蘭|台海|中東/,
    /戰爭|空襲|攻打|制裁|軍事|衝突|外交/,
    /選舉|大選|罷免|公投|總統|政黨/
  ];
  return patterns.some((pattern) => pattern.test(combined));
}

function hasGroundingInput(input) {
  return (input.links ?? []).length > 0 || String(input.material ?? "").trim().length >= 40;
}

function detectInputProfile(input) {
  const combined = [input.topic, input.material, input.observation, (input.links ?? []).join(" ")].join("\n");
  const style = String(input.style ?? "");
  return {
    style,
    isCommentary: style === "評論",
    isNarrative: style === "敘事",
    isShortForm: style === "小品文",
    isEssay: style === "小品文" || style === "敘事",
    isScience: style === "科普",
    isSensitive: detectSensitiveTopic(input),
    wantsHumor: Number(input.humor ?? 0) >= 2,
    wantsSharpStance: Number(input.stance ?? 0) >= 2,
    topicSignals: {
      governance: /治理|制度|民主|公共|權力|政策|國家|平台|韌性/.test(combined),
      technology: /ai|web3|區塊鏈|數位|網路|平台|協議|身份|隱私/i.test(combined),
      narrative: /我|我們|經驗|現場|場景|故事|日常/.test(combined)
    }
  };
}

function buildGoldAnchorMap(goldSet) {
  const map = new Map();
  for (const entry of goldSet.entries ?? []) {
    const anchorTypes = map.get(entry.id) ?? new Set();
    anchorTypes.add(entry.anchorType);
    map.set(entry.id, anchorTypes);
  }
  return map;
}

function scoreAnchorProfile(anchorTypes, profile) {
  if (!anchorTypes?.size) {
    return {
      total: 0,
      parts: {
        style_anchor: 0,
        worldview_anchor: 0,
        humor_anchor: 0,
        argument_anchor: 0
      }
    };
  }

  const parts = {
    style_anchor: 0,
    worldview_anchor: 0,
    humor_anchor: 0,
    argument_anchor: 0
  };

  if (anchorTypes.has("style_anchor")) {
    parts.style_anchor += profile.isNarrative ? 2.4 : profile.isEssay ? 1.35 : 0.35;
    parts.style_anchor += profile.topicSignals.narrative ? 0.55 : 0;
  }
  if (anchorTypes.has("worldview_anchor")) {
    parts.worldview_anchor += profile.isSensitive ? 1.9 : 0.6;
    parts.worldview_anchor += profile.topicSignals.governance ? 0.85 : 0;
    parts.worldview_anchor += profile.isCommentary && profile.topicSignals.governance ? 0.55 : 0;
  }
  if (anchorTypes.has("humor_anchor")) {
    parts.humor_anchor += profile.wantsHumor ? 2.1 : 0.3;
    parts.humor_anchor += profile.isShortForm ? 0.9 : profile.isEssay ? 0.35 : 0;
  }
  if (anchorTypes.has("argument_anchor")) {
    parts.argument_anchor += profile.isCommentary ? 1.9 : profile.isShortForm ? 1.05 : 0.45;
    parts.argument_anchor += profile.topicSignals.governance || profile.topicSignals.technology ? 0.7 : 0;
    parts.argument_anchor += profile.isScience ? 0.35 : 0;
    parts.argument_anchor += profile.isCommentary && profile.wantsSharpStance ? 0.45 : 0.2;
  }

  return {
    total: Object.values(parts).reduce((sum, value) => sum + value, 0),
    parts
  };
}

function scoreDocumentProfile(document, chunk, profile) {
  const parts = {
    contentType: 0,
    era: 0,
    position: 0,
    collection: 0
  };

  if (profile.isCommentary && ["commentary", "article", "speech"].includes(document.contentType)) {
    parts.contentType += 1.15;
  } else if (profile.isNarrative && document.contentType === "essay") {
    parts.contentType += 1.35;
  } else if (profile.isNarrative && document.contentType === "micro-essay") {
    parts.contentType += 0.45;
  } else if (profile.isShortForm && document.contentType === "micro-essay") {
    parts.contentType += 1.2;
  } else if (profile.isShortForm && document.contentType === "essay") {
    parts.contentType += 0.65;
  } else if (profile.isScience && ["article", "commentary"].includes(document.contentType)) {
    parts.contentType += 0.7;
  } else if (["essay", "commentary", "micro-essay"].includes(document.contentType)) {
    parts.contentType += 0.2;
  }

  if (profile.isNarrative && document.collection === "blog") parts.collection += 0.4;
  if (profile.isShortForm && document.collection === "facebook") parts.collection += 0.35;

  if (document.era === "recent") parts.era += 0.22;
  else if (document.era === "transition") parts.era += 0.14;

  if (chunk.position === "opening") parts.position += profile.isEssay ? 0.35 : 0.12;
  if (chunk.position === "middle") parts.position += profile.isCommentary ? 0.26 : 0.08;
  if (chunk.position === "closing") parts.position += profile.isNarrative ? 0.2 : profile.isCommentary ? 0.12 : 0.05;

  return {
    total: parts.contentType + parts.era + parts.position + parts.collection,
    parts
  };
}

function buildRetrievalIndex(corpus) {
  const documents = [];
  const documentFrequency = new Map();
  const byChunkKey = new Map();

  for (const document of corpus.documents) {
    for (const chunk of document.chunks) {
      const tf = countTerms(chunk.tokens);
      const entry = {
        key: `${document.id}#${chunk.chunkIndex}`,
        documentId: document.id,
        chunkIndex: chunk.chunkIndex,
        tf,
        tokenCount: chunk.tokens.length || 1
      };
      documents.push(entry);
      byChunkKey.set(entry.key, entry);
      for (const token of tf.keys()) {
        documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
      }
    }
  }

  return {
    documents,
    byChunkKey,
    documentFrequency,
    totalDocuments: documents.length
  };
}

async function loadRetrievalIndex() {
  if (!retrievalIndexCache) {
    retrievalIndexCache = buildRetrievalIndex(await loadCorpus());
  }
  return retrievalIndexCache;
}

function tfidfWeight(termFrequency, documentFrequency, totalDocuments) {
  const tf = 1 + Math.log(termFrequency);
  const idf = Math.log((1 + totalDocuments) / (1 + documentFrequency)) + 1;
  return tf * idf;
}

function cosineSimilarity(queryTf, docTf, documentFrequency, totalDocuments) {
  let dot = 0;
  let queryNorm = 0;
  let docNorm = 0;

  for (const [token, frequency] of queryTf.entries()) {
    const df = documentFrequency.get(token) ?? 0;
    const queryWeight = tfidfWeight(frequency, df, totalDocuments);
    queryNorm += queryWeight * queryWeight;

    if (docTf.has(token)) {
      const docWeight = tfidfWeight(docTf.get(token), df, totalDocuments);
      dot += queryWeight * docWeight;
    }
  }

  for (const [token, frequency] of docTf.entries()) {
    const df = documentFrequency.get(token) ?? 0;
    const docWeight = tfidfWeight(frequency, df, totalDocuments);
    docNorm += docWeight * docWeight;
  }

  if (dot === 0 || queryNorm === 0 || docNorm === 0) return 0;
  return dot / (Math.sqrt(queryNorm) * Math.sqrt(docNorm));
}

function desiredAnchorTypes(profile) {
  if (profile.isNarrative) return ["style_anchor", "humor_anchor"];
  if (profile.isShortForm) return ["humor_anchor", "argument_anchor"];
  if (profile.isCommentary) return ["worldview_anchor", "argument_anchor"];
  if (profile.isScience) return ["argument_anchor", "worldview_anchor"];
  return [];
}

function retrievalPolicy(profile) {
  if (profile.isNarrative) {
    return {
      topicSlots: 4,
      styleSlots: 4,
      articlePreference: "同文體優先",
      interleave: ["style", "topic", "style", "topic", "style", "topic", "topic", "style"]
    };
  }
  if (profile.isShortForm) {
    return {
      topicSlots: 5,
      styleSlots: 3,
      articlePreference: "平均混搭",
      interleave: ["topic", "style", "topic", "style", "topic", "topic", "style", "topic"]
    };
  }
  if (profile.isCommentary || profile.isScience) {
    return {
      topicSlots: 5,
      styleSlots: 3,
      articlePreference: "同主題優先",
      interleave: ["topic", "style", "topic", "topic", "style", "topic", "topic", "style"]
    };
  }
  return {
    topicSlots: 6,
    styleSlots: 2,
    articlePreference: "同主題優先",
    interleave: ["topic", "topic", "style", "topic", "topic", "style", "topic", "topic"]
  };
}

function diversifyReferences(references, limit, maxChunksPerDocument = 1) {
  const picked = [];
  const counts = new Map();

  for (const reference of references) {
    const current = counts.get(reference.document.id) ?? 0;
    if (current >= maxChunksPerDocument) continue;
    picked.push(reference);
    counts.set(reference.document.id, current + 1);
    if (picked.length >= limit) break;
  }

  return picked;
}

function mergeReferencePools(topicPool, stylePool, limit, interleave) {
  const picked = [];
  const used = new Set();
  const pools = {
    topic: [...topicPool],
    style: [...stylePool]
  };

  for (const lane of interleave) {
    const pool = pools[lane];
    while (pool.length && used.has(pool[0].document.id)) pool.shift();
    if (!pool.length) continue;
    const item = pool.shift();
    picked.push(item);
    used.add(item.document.id);
    if (picked.length >= limit) return picked;
  }

  for (const lane of ["topic", "style"]) {
    const pool = pools[lane];
    while (pool.length && picked.length < limit) {
      const item = pool.shift();
      if (used.has(item.document.id)) continue;
      picked.push(item);
      used.add(item.document.id);
    }
  }

  return picked.slice(0, limit);
}

function selectStylePool(corpus, goldAnchorMap, profile, limit) {
  const wanted = desiredAnchorTypes(profile);
  if (!wanted.length || limit <= 0) return [];

  const candidates = corpus.documents
    .filter((document) => Array.from(goldAnchorMap.get(document.id) ?? []).some((anchorType) => wanted.includes(anchorType)))
    .flatMap((document) =>
      document.chunks.map((chunk) => {
        const anchorTypes = Array.from(goldAnchorMap.get(document.id) ?? []);
        const anchorMatches = anchorTypes.filter((anchorType) => wanted.includes(anchorType));
        const anchorScore = scoreAnchorProfile(goldAnchorMap.get(document.id), profile);
        const documentScore = scoreDocumentProfile(document, chunk, profile);
        const totalAnchorScore = anchorScore.total ?? anchorScore;
        const totalDocumentScore = documentScore.total ?? documentScore;
        return {
          score: totalAnchorScore * 3 + totalDocumentScore * 1.5 + (chunk.position === "opening" ? 0.15 : 0),
          lexicalScore: 0,
          semanticScore: 0,
          document,
          chunk,
          anchorMatches,
          retrievalPool: "style"
        };
      })
    )
    .sort((left, right) => right.score - left.score);

  return diversifyReferences(candidates, limit, 1);
}

function referencePreferenceBoost(input, document, chunk, goldAnchorMap, profile) {
  if (!input.allowClosing && chunk.position === "closing") {
    return { total: -999, parts: { closingPenalty: -999 } };
  }

  const parts = {
    articlePreference: 0,
    anchorProfile: 0,
    documentProfile: 0
  };

  if (input.articlePreference === "同文體優先" && document.contentType === "essay") parts.articlePreference += 0.4;
  if (input.articlePreference === "同年代優先" && document.era === "recent") parts.articlePreference += 0.3;
  if (
    input.articlePreference === "同主題優先" &&
    document.tags.some((tag) => input.topic.includes(tag) || input.material.includes(tag))
  ) {
    parts.articlePreference += 0.55;
  }

  const anchorScore = scoreAnchorProfile(goldAnchorMap.get(document.id), profile);
  const documentScore = scoreDocumentProfile(document, chunk, profile);
  parts.anchorProfile = anchorScore.total;
  parts.documentProfile = documentScore.total;

  return {
    total: parts.articlePreference + parts.anchorProfile + parts.documentProfile,
    parts: {
      ...parts,
      anchorBreakdown: anchorScore.parts,
      documentBreakdown: documentScore.parts
    }
  };
}

async function retrieveReferences(corpus, input) {
  const goldSet = await loadGoldSet();
  const goldAnchorMap = buildGoldAnchorMap(goldSet);
  const retrievalIndex = await loadRetrievalIndex();
  const profile = detectInputProfile(input);
  const query = [input.topic, input.material, input.observation, (input.links ?? []).join(" ")].join("\n");
  const tokens = tokenize(query);
  const queryTf = countTerms(tokens);

  const scoredReferences = corpus.documents
    .flatMap((document) =>
      document.chunks.map((chunk) => {
        const indexEntry = retrievalIndex.byChunkKey.get(`${document.id}#${chunk.chunkIndex}`);
        const overlap = chunk.tokens.filter((token) => tokens.includes(token)).length;
        const titleBoost =
          tokenize(document.title).filter((token) => tokens.includes(token)).length * 1.5;
        const tagBoost = document.tags.filter((tag) => query.includes(tag)).length * 1.2;
        const semanticScore = indexEntry
          ? cosineSimilarity(
              queryTf,
              indexEntry.tf,
              retrievalIndex.documentFrequency,
              retrievalIndex.totalDocuments
            )
          : 0;
        const preferenceBoost = referencePreferenceBoost(input, document, chunk, goldAnchorMap, profile);
        const score =
          overlap * 1.15 +
          titleBoost +
          tagBoost +
          preferenceBoost.total +
          (chunk.position === "opening" ? 0.4 : 0.2) +
          semanticScore * 4;
        if (score <= 0) return null;
        return {
          score,
          lexicalScore: overlap + titleBoost + tagBoost,
          semanticScore,
          scoreBreakdown: {
            overlap: Number((overlap * 1.15).toFixed(3)),
            titleBoost: Number(titleBoost.toFixed(3)),
            tagBoost: Number(tagBoost.toFixed(3)),
            semanticBoost: Number((semanticScore * 4).toFixed(3)),
            positionBoost: Number((chunk.position === "opening" ? 0.4 : 0.2).toFixed(3)),
            preferenceBoost: Number(preferenceBoost.total.toFixed(3)),
            preferenceParts: preferenceBoost.parts
          },
          document,
          chunk,
          retrievalPool: "topic"
        };
      })
    )
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  const limit = Math.max(3, Number(input.k) || 8);
  const policy = retrievalPolicy(profile);
  const topicPool = diversifyReferences(scoredReferences, Math.min(limit, policy.topicSlots), 1);
  const stylePool = selectStylePool(corpus, goldAnchorMap, profile, Math.min(limit, policy.styleSlots));
  return mergeReferencePools(topicPool, stylePool, limit, policy.interleave);
}

function detectQualityMode(input) {
  if (String(input.qualityMode ?? "").trim()) return String(input.qualityMode).trim();
  if ((input.links ?? []).some((link) => String(link).startsWith("benchmark://"))) return "benchmark";
  return "production";
}

function qualityPolicy(input) {
  const mode = detectQualityMode(input);
  return {
    mode,
    blockOnSuitability: mode !== "benchmark",
    blockOnValidation: mode !== "benchmark",
    strictWeakMatch: mode === "production",
    strictTopicCoverage: mode === "production",
    strictContamination: mode === "production",
    allowRetry: true
  };
}

function resolveSuitabilityDecision(policy, suitability) {
  const escalations = [];
  if (policy.strictWeakMatch) {
    if (suitability.strongReferenceCount === 0) {
      escalations.push("production mode：現有語料裡找不到足夠貼近這個題目的參考片段。");
    }
    if (suitability.lexicalAverage < 1.3 && suitability.semanticAverage < 0.085) {
      escalations.push("production mode：目前取回片段與主題語義距離過大，拒絕直接生稿。");
    }
  }
  return {
    ok: suitability.reasons.length === 0 && escalations.length === 0,
    reasons: [...suitability.reasons, ...escalations]
  };
}

function resolveValidationDecision(policy, validation) {
  const escalations = [];
  if (!policy.blockOnValidation) {
    return { ok: validation.ok, reasons: escalations };
  }
  for (const report of validation.reports) {
    for (const warning of report.warnings ?? []) {
      if (policy.strictTopicCoverage && warning.includes("草稿沒有真正回到主題本身")) {
        escalations.push(`draft ${report.index + 1}：${warning}`);
      }
      if (policy.strictContamination && (warning.includes("疑似混入不相干舊文詞彙") || warning.includes("含有可能與題目無關的既有語料專名"))) {
        escalations.push(`draft ${report.index + 1}：${warning}`);
      }
    }
  }
  return {
    ok: validation.ok && escalations.length === 0,
    reasons: escalations
  };
}

function assessTopicSuitability(input, references) {
  const topReferences = references.slice(0, 4);
  const lexicalAverage = average(topReferences.map((reference) => Number(reference.lexicalScore ?? 0)));
  const semanticAverage = average(topReferences.map((reference) => Number(reference.semanticScore ?? 0)));
  const strongReferenceCount = topReferences.filter(
    (reference) => Number(reference.lexicalScore ?? 0) >= 2.4 || Number(reference.semanticScore ?? 0) >= 0.14
  ).length;
  const sensitiveTopic = detectSensitiveTopic(input);
  const reasons = [];
  const warnings = [];

  if (sensitiveTopic && !hasGroundingInput(input)) {
    reasons.push("這個題目屬於高時效或高風險政治議題，但目前缺少足夠素材或外部連結。");
  }
  if (strongReferenceCount === 0) {
    warnings.push("現有語料裡找不到足夠貼近這個題目的參考片段。");
  }
  if (lexicalAverage < 1.3 && semanticAverage < 0.085) {
    warnings.push("目前取回片段與主題語義距離過大，硬生稿只會把舊文殘片拼進新題目。");
  }

  return {
    ok: reasons.length === 0,
    sensitiveTopic,
    hasGrounding: hasGroundingInput(input),
    lexicalAverage: Number(lexicalAverage.toFixed(3)),
    semanticAverage: Number(semanticAverage.toFixed(3)),
    strongReferenceCount,
    reasons,
    warnings
  };
}

function cleanReferenceText(text) {
  return String(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^#{1,6}\s*/.test(line))
    .filter((line) => !/^(中文|英文)\s*[:：]/.test(line))
    .filter((line) => !/^https?:\/\//.test(line))
    .filter((line) => (line.match(/#/g) ?? []).length < 2)
    .join(" ");
}

function buildReferenceNotes(input, references, goldSet) {
  const queryText = [input.topic, input.material, input.observation, (input.links ?? []).join(" ")].join("\n");
  const queryTokens = new Set(tokenize(queryText));
  const goldAnchorMap = buildGoldAnchorMap(goldSet);

  return references.slice(0, Math.max(4, Math.min(6, Number(input.k) || 6))).map((reference, index) => {
    const anchorTypes = Array.from(goldAnchorMap.get(reference.document.id) ?? []);
    const titleTokens = tokenize(reference.document.title).filter((token) => queryTokens.has(token)).slice(0, 4);
    const tagTokens = reference.document.tags.filter((tag) => queryText.includes(tag)).slice(0, 3);
    const excerpt = cleanReferenceText(reference.chunk.text);
    const styleRole =
      reference.chunk.position === "opening"
        ? "適合借開場節奏、觀察起手式與場景切入"
        : reference.chunk.position === "closing"
          ? "適合借收束方式與問題意識"
          : "適合借中段論證推進與轉折節奏";
    const structureCue =
      reference.document.contentType === "micro-essay"
        ? "偏短段與口語節奏，只借語感，不借具體事件。"
        : ["commentary", "article", "speech"].includes(reference.document.contentType)
          ? "偏制度分析與論證推進，可借結構，不直接搬用句子。"
          : "偏隨筆與觀察式寫法，可借反差、視角與段落感。";
    const overlapCue = unique([...titleTokens, ...tagTokens]).join("、") || "主題詞重合很少，最多只借風格與段落功能";
    const caution = excerpt.length > 0 ? "禁止直接複製原文專名、事件細節、hashtag 或既有開場句。" : "這則參考只作風格背景。";
    return {
      index: index + 1,
      source: `${reference.document.collection}/${reference.document.contentType}/${reference.chunk.position}`,
      title: reference.document.title,
      anchorTypes,
      overlapCue,
      styleRole,
      structureCue,
      caution,
      lexicalScore: Number(reference.lexicalScore ?? 0),
      semanticScore: Number(reference.semanticScore ?? 0)
    };
  });
}

function buildDraftPrompt(input, worldview, referenceNotes, suitability) {
  const referencesBlock = referenceNotes
    .map(
      (note) =>
        `${note.index}. [${note.source}] ${note.title}\n` +
        `可借用：${note.styleRole}；${note.structureCue}\n` +
        `與本題相接：${note.overlapCue}\n` +
        `注意：${note.caution}` +
        (note.anchorTypes.length ? `\nanchor: ${note.anchorTypes.join(", ")}` : "")
    )
    .join("\n\n");

  const antiAiStyleRules = [
    "表面語氣要像真人寫作者，不要像模型在整理觀點。",
    "少用過度整齊的評論模板句，尤其避免「這不是……，而是……」這類泛用句型。",
    "少用展示性標點與修辭符號，不要靠符號製造文氣。",
    "句子能短就短，不要把簡單判斷硬拉成長句。",
    "不要把名詞故意寫膨脹，能用短名詞就用短名詞，例如終結、制裁、重擊，不要硬加符號感或氣勢詞。",
    "抽象名詞只在必要時使用；如果可以直接講人物、權力、制度動作，就不要退回空泛概念。",
    "不要反覆宣告立場，要讓立場從觀察、排序與推論裡自然長出來。",
    "收尾不要太像標準答案，寧可留下仍待追問的真問題。"
  ];

  return [
    "你在協助建立一個模仿作者本人寫作風格的私有寫作系統。",
    "任務：針對同一個輸入生成 2 篇繁體中文（台灣用語）草稿，角度不同，但都要像同一位作者寫的。",
    "請依據作者既有文章的世界觀、語感、論證路徑與幽默機制來寫，不要寫成制式 AI 文。",
    "參考資料只能作為風格、論證與段落節奏的提示，不得直接複製原文句子、專名、hashtag、舊事件細節。",
    "",
    "輸入條件：",
    `主題：${input.topic}`,
    `文體：${input.style}`,
    `長度：${input.length}`,
    `讀者：${input.reader}`,
    `幽默強度：${input.humor}`,
    `立場強度：${input.stance}`,
    `語言：${input.language}`,
    input.material ? `素材：${input.material}` : "",
    input.observation ? `觀察：${input.observation}` : "",
    input.links?.length ? `連結：${input.links.join(" | ")}` : "",
    `主題提醒：每篇草稿都要直接回到「${input.topic}」這個題目本身，不要只寫延伸感想。`,
    input.style === "小品文" ? `短評提醒：篇幅再短，前兩句也要至少點出一次「${input.topic}」或其核心短語。` : "",
    "",
    "世界觀與風格摘要：",
    `價值排序：${worldview.values.map((item) => `${item.priority}.${item.name}`).join(" / ")}`,
    `政治語氣：${worldview.toneRules.politics}`,
    `構句習慣：${worldview.syntaxProfile.sentenceLengthMix}`,
    `段落習慣：${worldview.paragraphProfile.openingMove}；${worldview.paragraphProfile.endingMove}`,
    `幽默機制：${worldview.humorProfile.primaryMechanisms.join("、")}`,
    `避免：${worldview.antiPatterns.join("、")}`,
    `反 AI 腔提醒：${antiAiStyleRules.join(" / ")}`,
    `適配檢查：lexical=${suitability.lexicalAverage} / semantic=${suitability.semanticAverage} / strongRefs=${suitability.strongReferenceCount}`,
    "",
    "參考寫作筆記：",
    referencesBlock,
    "",
    "輸出要求：",
    "1. 只輸出有效 JSON，不要多餘說明。",
    '2. JSON 結構必須是 {"drafts":[{"angle":"...","title":"...","text":"..."},{"angle":"...","title":"...","text":"..."}],"comparison":{"winnerIndex":0或1,"rationale":"...","criteria":["...","..."]}}',
    "3. 兩篇草稿都要完整可讀，不要只是大綱。",
    "4. comparison 要指出哪一篇更像作者本人，以及為什麼。",
    "5. 敏感資訊若無法確證，必須保守表述。",
    "6. 如果語料與主題距離偏大，就降低引用感，改用作者慣用的論證方式與台灣繁體中文語感來寫。",
    "7. 每一篇草稿都必須明確回到主題核心詞，至少要直接點名一次主題或其核心短語，不能只寫抽象感想。",
    "8. 標題禁止使用冒號、破折號或過度展示性的標點。",
    "9. 能直接說終結、制裁、重擊、曝光，就不要寫成終結符號、終極制裁、重拳一擊、曝出這類膨脹說法。",
    "10. 禁止出現與主題無關的專名殘片、tag 列表、部落格 metadata、舊文標題殘骸。"
  ]
    .filter(Boolean)
    .join("\n");
}

function parseJSONResponse(content) {
  if (!String(content ?? "").trim()) {
    throw new Error("Model returned empty content.");
  }
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("Model did not return valid JSON.");
  }
}

function normalizeDraftSurface(text, { isTitle = false } = {}) {
  let normalized = String(text ?? "");

  const replacements = [
    [/終結符號/g, "終結"],
    [/終極制裁/g, "制裁"],
    [/重拳一擊/g, "重擊"],
    [/曝出/g, "曝光"],
    [/揭示了其實/g, "其實"],
    [/揭示了/g, ""],
    [/然而，/g, "然而"],
    [/但是，/g, "但是"],
    [/同時，/g, "同時"]
  ];

  for (const [pattern, value] of replacements) {
    normalized = normalized.replace(pattern, value);
  }

  if (isTitle) {
    normalized = normalized
      .replace(/[:：]/g, " ")
      .replace(/[—–-]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return normalized
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

function normalizeDrafts(drafts) {
  return drafts.map((draft) => ({
    ...draft,
    title: normalizeDraftSurface(draft.title, { isTitle: true }),
    text: normalizeDraftSurface(draft.text)
  }));
}

async function generateDraftsWithOpenAI(input, references) {
  const policy = qualityPolicy(input);
  const worldview = await loadWorldview();
  const goldSet = await loadGoldSet();
  const suitability = assessTopicSuitability(input, references);
  const suitabilityDecision = resolveSuitabilityDecision(policy, suitability);
  const suitabilityWarnings = !suitabilityDecision.ok ? [...suitabilityDecision.reasons] : [];
  if (!policy.blockOnSuitability && !suitabilityDecision.ok) {
    suitabilityWarnings.push("benchmark mode：suitability 不阻斷生稿，但已保留警告。");
  }
  if (policy.blockOnSuitability && !suitabilityDecision.ok) {
    throw new HttpError(422, "目前語料不適合直接生稿。", {
      code: "topic_unsuitable",
      noFallback: true,
      suitability: {
        ...suitability,
        reasons: suitabilityDecision.reasons
      },
      qualityMode: policy.mode
    });
  }
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set.");
  }
  const referenceNotes = buildReferenceNotes(input, references, goldSet);
  const prompt = buildDraftPrompt(input, worldview, referenceNotes, suitability);
  const requestBody = {
    model: RAG_DRAFT_MODEL,
    temperature: RAG_TEMPERATURE,
    reasoning_effort: RAG_REASONING_EFFORT,
    messages: [
      {
        role: "system",
        content: [
          "你是資深編輯與中文寫作者，擅長模仿既有作者的寫作節奏、幽默感、台灣繁體中文語感與制度評論方式。",
          "你的任務不是寫出漂亮的 AI 評論，而是寫出像作者本人會交出去的草稿。",
          "特別避免制式生成痕跡：不要濫用引號、冒號、破折號等展示性標點；不要堆疊空泛抽象名詞；不要把一句話可以講完的意思拖成長句。",
          "避免常見模板句，尤其不要寫成「這不是……，而是……」的論說文公式。",
          "少做總結姿態，多做具體判斷；少講抽象態度，多講權力如何運作、制度如何卡住人。",
          "如果句子太工整、太平滑、太像模型在平衡觀點，就主動改得更像真人。"
        ].join("\n")
      },
      {
        role: "user",
        content: prompt
      }
    ]
  };

  let lastError = null;
  for (let attempt = 1; attempt <= Math.max(1, RAG_OPENAI_RETRIES); attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        },
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`OpenAI API ${response.status}: ${await response.text()}`);
      }

      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content ?? "";
      const parsed = parseJSONResponse(content);
      const drafts = Array.isArray(parsed.drafts) ? normalizeDrafts(parsed.drafts.slice(0, 2)) : [];
      const comparison = parsed.comparison ?? null;
      if (drafts.length < 2) {
        throw new Error("Model response did not include two drafts.");
      }
      const validation = validateDrafts(input, drafts, references);
      const validationDecision = resolveValidationDecision(policy, validation);
      const validationWarnings = validation.reports
        .filter((report) => !report.ok || (report.warnings ?? []).length > 0)
        .map((report) => ({ index: report.index, reasons: report.reasons, warnings: report.warnings }));
      if (!validationDecision.ok) {
        throw new HttpError(422, "生成結果因為污染或偏題而被自動拒收。", {
          code: "draft_rejected",
          noFallback: true,
          validation,
          validationDecision,
          qualityMode: policy.mode
        });
      }
      return {
        drafts,
        comparison,
        prompt,
        model: RAG_DRAFT_MODEL,
        qualityMode: policy.mode,
        suitability: {
          ...suitability,
          reasons: suitabilityDecision.reasons,
          warnings: unique([...(suitability.warnings ?? []), ...suitabilityWarnings])
        },
        referenceNotes,
        validation,
        acceptance: {
          qualityMode: policy.mode,
          suitabilityBlocked: policy.blockOnSuitability && !suitability.ok,
          validationBlocked: policy.blockOnValidation && !validation.ok,
          warnings: validationWarnings,
          retryCount: attempt - 1
        }
      };
    } catch (error) {
      if (error?.name === "AbortError") {
        lastError = new Error(`OpenAI request timed out after ${OPENAI_TIMEOUT_MS}ms.`);
      } else {
        lastError = error;
      }
      const retryable = policy.allowRetry && attempt < Math.max(1, RAG_OPENAI_RETRIES) && !(lastError instanceof HttpError);
      if (!retryable) throw lastError;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw lastError ?? new Error("Draft generation failed.");
}

function buildContaminationLexicon(input, references) {
  const queryTokens = new Set(tokenize([input.topic, input.material, input.observation, (input.links ?? []).join(" ")].join("\n")));
  const ignoredTokens = new Set(["一般讀者", "台灣", "治理", "制度", "公共性", "民主", "科技", "政治", "評論", "小品文", "我們", "你們", "他們", "想要", "工具", "打造", "公共", "生態", "生態系", "討論", "規則", "未來", "思考"]);
  const suspiciousTokens = new Set();

  for (const reference of references.slice(0, 8)) {
    const relevance = Number(reference.lexicalScore ?? 0) + Number(reference.semanticScore ?? 0) * 8;
    if (relevance >= 3.4) continue;

    for (const token of tokenize(reference.document.title)) {
      if (queryTokens.has(token) || ignoredTokens.has(token) || token.length < 3) continue;
      suspiciousTokens.add(token);
    }
    for (const tag of reference.document.tags) {
      if (!queryTokens.has(tag) && !ignoredTokens.has(tag)) suspiciousTokens.add(tag);
    }
  }

  return Array.from(suspiciousTokens);
}

function containsVerbatimReferenceLeak(text, references) {
  const draftText = normalizeComparable(text);
  for (const reference of references.slice(0, 6)) {
    const cleaned = cleanReferenceText(reference.chunk.text);
    if (cleaned.length < 24) continue;
    const snippets = [cleaned.slice(0, 24), cleaned.slice(12, 36)].filter((snippet) => snippet.length >= 20);
    for (const snippet of snippets) {
      if (draftText.includes(normalizeComparable(snippet))) {
        return snippet;
      }
    }
  }
  return null;
}

function extractTopicSignals(input) {
  const raw = [input.topic, input.material, input.observation]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" ");
  const normalized = raw.replace(/[，。、「」『』（）()｜|:：,.;；!?！？]/g, " ");
  const chunks = normalized
    .split(/\s+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const stopChars = /^(的|了|和|與|及|在|把|是|對|讓|又|但|而|或|跟|將)$/;
  const signals = new Set();

  for (const chunk of chunks) {
    if (/[\u3400-\u9fff]/.test(chunk)) {
      const compact = chunk.replace(/[的了和與及在把是對讓又但而或跟將]/g, "");
      if (compact.length >= 2) signals.add(compact);
      for (let size = 4; size >= 2; size -= 1) {
        for (let index = 0; index <= compact.length - size; index += 1) {
          const piece = compact.slice(index, index + size);
          if (!stopChars.test(piece) && piece.length >= 2) signals.add(piece);
        }
      }
      continue;
    }
    if (chunk.length >= 3) signals.add(chunk.toLowerCase());
  }

  return Array.from(signals).slice(0, 16);
}

function computeTopicCoverage(text, input) {
  const normalizedText = normalizeComparable(text);
  const topicSignals = extractTopicSignals(input);
  const matchedSignals = topicSignals.filter((signal) => normalizedText.includes(normalizeComparable(signal)));
  return {
    topicSignals,
    matchedSignals
  };
}

function validateDrafts(input, drafts, references) {
  const contaminationLexicon = buildContaminationLexicon(input, references);
  const draftReports = drafts.map((draft, index) => {
    const text = String(draft.text ?? "");
    const reasons = [];
    const warnings = [];
    const contaminationTerms = contaminationLexicon.filter((term) => text.toLowerCase().includes(String(term).toLowerCase()));
    if ((text.match(/(^|\n)\s*#/g) ?? []).length >= 2) {
      reasons.push("含有 hashtag 或 metadata 殘片");
    }
    if (/【臉書】|Matters|Tezos|XTZ|loot/i.test(text) && !/[#＃]?nft/i.test(input.topic + input.material + input.observation)) {
      warnings.push("含有可能與題目無關的既有語料專名");
    }
    if (contaminationTerms.length >= 3) {
      warnings.push(`疑似混入不相干舊文詞彙：${contaminationTerms.slice(0, 5).join("、")}`);
    }
    const leakedSnippet = containsVerbatimReferenceLeak(text, references);
    if (leakedSnippet) {
      reasons.push("疑似直接複製參考片段原句");
    }
    const topicCoverage = computeTopicCoverage(text, input);
    if (topicCoverage.topicSignals.length > 0 && topicCoverage.matchedSignals.length === 0) {
      warnings.push("草稿沒有真正回到主題本身");
    }
    return {
      index,
      ok: reasons.length === 0,
      reasons,
      warnings,
      contaminationTerms: contaminationTerms.slice(0, 8),
      matchedTopicSignals: topicCoverage.matchedSignals.slice(0, 8)
    };
  });

  return {
    ok: draftReports.every((report) => report.ok),
    reports: draftReports
  };
}

function sendJSON(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(payload, null, 2)}\n`);
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  response.end(text);
}

async function serveFile(response, filepath) {
  try {
    const file = await fs.readFile(filepath);
    const ext = path.extname(filepath).toLowerCase();
    response.writeHead(200, { "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream" });
    response.end(file);
  } catch {
    sendText(response, 404, "Not found");
  }
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendText(response, 400, "Bad request");
    return;
  }

  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const pathname = url.pathname;

  if (pathname === "/api/health") {
    sendJSON(response, 200, { ok: true, host: HOST, port: PORT });
    return;
  }

  if (pathname === "/api/sessions" && request.method === "GET") {
    const store = await readSessionStore();
    sendJSON(response, 200, store);
    return;
  }

  if (pathname === "/api/sessions" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      const session = JSON.parse(body);
      const store = await readSessionStore();
      store.sessions.push(session);
      await writeSessionStore(store);
      sendJSON(response, 201, { ok: true, session });
    } catch (error) {
      sendJSON(response, 400, { ok: false, error: String(error) });
    }
    return;
  }

  if (pathname === "/api/sessions" && request.method === "DELETE") {
    await writeSessionStore({ sessions: [] });
    sendJSON(response, 200, { ok: true, sessions: [] });
    return;
  }

  if (pathname === "/api/gold-review" && request.method === "GET") {
    const review = await readGoldReview();
    sendJSON(response, 200, review);
    return;
  }

  if (pathname === "/api/gold-review" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      const review = JSON.parse(body);
      await writeGoldReview(review);
      sendJSON(response, 200, { ok: true, review });
    } catch (error) {
      sendJSON(response, 400, { ok: false, error: String(error) });
    }
    return;
  }

  if (pathname === "/api/gold-review/apply" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      const review = JSON.parse(body);
      const candidates = JSON.parse(await fs.readFile(GOLD_CANDIDATES_FILE, "utf8"));
      const finalGold = {
        generatedAt: new Date().toISOString(),
        status: "reviewed",
        sourcePolicy: candidates.sourcePolicy,
        note: "由 gold-review.html 人工標記保留後輸出。",
        entries: Object.entries(review.decisions ?? {})
          .filter(([, decision]) => decision?.decision === "keep")
          .map(([id, decision]) => {
            const candidate = Object.values(candidates.candidates)
              .flat()
              .find((item) => item.id === id);
            if (!candidate) return null;
            return {
              id: candidate.id,
              anchorType: candidate.anchorType,
              collection: candidate.collection,
              filepath: candidate.filepath,
              title: candidate.title,
              tags: candidate.tags,
              contentType: candidate.contentType,
              era: candidate.era,
              tokenCount: candidate.tokenCount,
              rationale: candidate.why ?? [],
              reviewNotes: decision.notes ?? "",
              selectedBy: "human-review"
            };
          })
          .filter(Boolean)
      };
      await fs.writeFile(GOLD_SET_FILE, `${JSON.stringify(finalGold, null, 2)}\n`, "utf8");
      await writeGoldReview(review);
      sendJSON(response, 200, {
        ok: true,
        output: path.relative(ROOT, GOLD_SET_FILE),
        count: finalGold.entries.length
      });
    } catch (error) {
      sendJSON(response, 400, { ok: false, error: String(error) });
    }
    return;
  }

  if (pathname === "/api/draft" && request.method === "POST") {
    try {
      const body = await readRequestBody(request);
      const input = JSON.parse(body);
      const corpus = await loadCorpus();
      const references = await retrieveReferences(corpus, input);
      await appendDraftLog({
        phase: "request_received",
        topic: input.topic,
        model: RAG_DRAFT_MODEL,
        retrievalMode: "hybrid-lexical-tfidf",
        referenceCount: references.length,
        qualityMode: detectQualityMode(input)
      });
      const result = await generateDraftsWithOpenAI(input, references);
      await appendDraftLog({
        phase: "request_succeeded",
        topic: input.topic,
        model: result.model,
        referenceCount: references.length,
        winnerIndex: result.comparison?.winnerIndex ?? null,
        suitability: result.suitability,
        qualityMode: result.qualityMode,
        acceptance: result.acceptance
      });
      sendJSON(response, 200, {
        ok: true,
        retrievalMode: "hybrid-lexical-tfidf",
        model: result.model,
        qualityMode: result.qualityMode,
        prompt: result.prompt,
        suitability: result.suitability,
        acceptance: result.acceptance,
        referenceNotes: result.referenceNotes,
        references,
        drafts: result.drafts.map((draft, index) => ({
          id: `draft-${Date.now()}-${index}`,
          angle: draft.angle,
          title: draft.title,
          text: draft.text,
          input,
          references
        })),
        comparison: result.comparison,
        validation: result.validation
      });
    } catch (error) {
      await appendDraftLog({
        phase: "request_failed",
        error: String(error),
        model: RAG_DRAFT_MODEL,
        details: error instanceof HttpError ? error.details : undefined,
        qualityMode: error instanceof HttpError ? error.details?.qualityMode : undefined
      });
      sendJSON(response, error instanceof HttpError ? error.statusCode : 503, {
        ok: false,
        error: String(error),
        ...(error instanceof HttpError ? error.details : {}),
        retrievalMode: "hybrid-lexical-tfidf",
        timeoutMs: OPENAI_TIMEOUT_MS,
        hint: "If OPENAI_API_KEY is missing or the upstream model call fails, the client can fall back to local drafting."
      });
    }
    return;
  }

  const normalized = pathname === "/" ? "/index.html" : pathname;
  const filepath = path.normalize(path.join(LAB_DIR, normalized));
  if (!filepath.startsWith(LAB_DIR)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  await serveFile(response, filepath);
});

await ensureStorage();

server.listen(PORT, HOST, () => {
  console.log(`[rag:serve] http://${HOST}:${PORT}/`);
  console.log(`[rag:serve] sessions -> ${path.relative(ROOT, SESSION_FILE)}`);
});
