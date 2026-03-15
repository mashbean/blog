#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const TYPE_ORDER = {
  page: 0,
  post: 1,
  facebook_post: 2,
};

const DEFAULT_QUERIES = [
  "隱私",
  "治理",
  "臨床",
  "當兵",
  "數位身份",
  "科技",
  "文化",
  "薄荷",
  "區塊鏈",
  "Matters",
  "臉書",
  "豆泥",
];

const normalize = (value) => value.toLocaleLowerCase("zh-TW").normalize("NFKC").trim();
const tokenize = (value) => normalize(value).split(/\s+/).filter(Boolean);

function scoreDoc(doc, tokens) {
  const titleText = normalize(doc.title ?? "");
  const descText = normalize(doc.description ?? "");
  const bodyText = normalize(doc.content ?? "");
  const tagText = normalize((doc.tags ?? []).join(" "));
  let score = 0;
  for (const token of tokens) {
    if (titleText.includes(token)) score += 6;
    if (tagText.includes(token)) score += 4;
    if (descText.includes(token)) score += 2;
    if (bodyText.includes(token)) score += 1;
  }
  return score;
}

function toTimestamp(raw) {
  if (!raw) return 0;
  const ts = new Date(raw).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function searchDocs(docs, query) {
  const tokens = tokenize(query);
  const started = performance.now();
  const ranked = docs
    .map((doc) => ({ doc, score: scoreDoc(doc, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      const typeGap = (TYPE_ORDER[a.doc.type] ?? 99) - (TYPE_ORDER[b.doc.type] ?? 99);
      if (typeGap !== 0) return typeGap;
      if (b.score !== a.score) return b.score - a.score;
      return toTimestamp(b.doc.pubDate) - toTimestamp(a.doc.pubDate);
    })
    .slice(0, 100)
    .map((item) => item.doc);
  const ended = performance.now();
  return {
    results: ranked,
    elapsedMs: Number((ended - started).toFixed(3)),
  };
}

function validateOrdering(results) {
  let last = -1;
  for (const doc of results) {
    const now = TYPE_ORDER[doc.type] ?? 99;
    if (now < last) return false;
    last = now;
  }
  return true;
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return Number(sorted[idx].toFixed(3));
}

function summarizeByType(docs) {
  const out = { page: 0, post: 0, facebook_post: 0 };
  for (const doc of docs) {
    if (doc.type in out) out[doc.type] += 1;
  }
  return out;
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

async function main() {
  const cwd = process.cwd();
  const jsonPath = path.resolve(cwd, "dist/search-index.json");
  const reportsDir = path.resolve(cwd, "reports");
  await fs.mkdir(reportsDir, { recursive: true });

  const raw = await fs.readFile(jsonPath, "utf-8");
  const docs = JSON.parse(raw);
  const totalBytes = Buffer.byteLength(raw, "utf-8");
  const typeCounts = summarizeByType(docs);

  const bench = [];
  for (const q of DEFAULT_QUERIES) {
    const { results, elapsedMs } = searchDocs(docs, q);
    const ok = validateOrdering(results);
    const topTypes = results.slice(0, 10).map((item) => item.type);
    bench.push({
      query: q,
      elapsedMs,
      resultCount: results.length,
      orderOK: ok,
      top10Types: topTypes,
    });
  }

  const msValues = bench.map((x) => x.elapsedMs);
  const allOrdered = bench.every((x) => x.orderOK);

  const reportLines = [
    "# Search Benchmark Report",
    "",
    `- generatedAt: ${new Date().toISOString()}`,
    `- documentCount: ${docs.length}`,
    `- indexSizeBytes: ${totalBytes}`,
    `- indexSizeKB: ${(totalBytes / 1024).toFixed(2)}`,
    `- typeCounts: page=${typeCounts.page}, post=${typeCounts.post}, facebook_post=${typeCounts.facebook_post}`,
    `- latencyMs: min=${Math.min(...msValues).toFixed(3)}, p50=${percentile(msValues, 50).toFixed(3)}, p95=${percentile(msValues, 95).toFixed(3)}, max=${Math.max(...msValues).toFixed(3)}`,
    `- orderingRule: page -> post -> facebook_post`,
    `- orderingAllPass: ${allOrdered}`,
    "",
    "## Query Results",
    "",
    "| query | elapsedMs | resultCount | orderingPass | top10Types |",
    "|---|---:|---:|---|---|",
    ...bench.map((row) => `| ${row.query} | ${row.elapsedMs.toFixed(3)} | ${row.resultCount} | ${row.orderOK ? "yes" : "no"} | ${row.top10Types.join(", ")} |`),
    "",
  ];

  const reportName = `search-benchmark-${nowStamp()}.md`;
  const reportPath = path.resolve(reportsDir, reportName);
  const latestPath = path.resolve(reportsDir, "search-benchmark-latest.md");
  const body = reportLines.join("\n");
  await fs.writeFile(reportPath, body, "utf-8");
  await fs.writeFile(latestPath, body, "utf-8");

  console.log(`docs=${docs.length}`);
  console.log(`index_size_bytes=${totalBytes}`);
  console.log(`ordering_all_pass=${allOrdered}`);
  console.log(`latency_ms_p50=${percentile(msValues, 50).toFixed(3)}`);
  console.log(`latency_ms_p95=${percentile(msValues, 95).toFixed(3)}`);
  console.log(`report=${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
