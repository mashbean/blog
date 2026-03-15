import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, "src", "content");
const LAB_ROOT = path.resolve(ROOT, "..", "rag-lab");
const OUTPUT_DIR = path.join(LAB_ROOT, "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "corpus.json");
const COLLECTIONS = [
  { key: "blog", dir: path.join(CONTENT_ROOT, "blog") },
  { key: "facebook", dir: path.join(CONTENT_ROOT, "facebook") }
];
const DEFAULT_CHUNK_SIZE = 460;
const LONG_PARAGRAPH_THRESHOLD = 800;
const SENTENCE_CHUNK_TARGET = 280;
const SENTENCE_CHUNK_OVERLAP = 60;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      if (!entry.isFile()) return [];
      if (!/\.(md|mdx)$/i.test(entry.name)) return [];
      return [fullPath];
    })
  );
  return files.flat();
}

function parseFrontmatter(raw) {
  if (!raw.startsWith("---\n")) return { data: {}, body: raw };
  const closingIndex = raw.indexOf("\n---\n", 4);
  if (closingIndex === -1) return { data: {}, body: raw };

  const frontmatter = raw.slice(4, closingIndex);
  const body = raw.slice(closingIndex + 5);
  const lines = frontmatter.split(/\r?\n/);
  const data = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!rawValue) {
      const list = [];
      for (let next = index + 1; next < lines.length; next += 1) {
        const candidate = lines[next];
        if (/^\s*-\s+/.test(candidate)) {
          list.push(candidate.replace(/^\s*-\s+/, "").trim().replace(/^['"]|['"]$/g, ""));
          index = next;
          continue;
        }
        break;
      }
      data[key] = list;
      continue;
    }

    const value = rawValue.trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
      continue;
    }

    if (value === "true" || value === "false") {
      data[key] = value === "true";
      continue;
    }

    data[key] = value.replace(/^['"]|['"]$/g, "");
  }

  return { data, body };
}

function stripMarkdown(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#+\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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

function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length >= 30)
    .flatMap(splitLongParagraph);
}

function splitLongParagraph(paragraph) {
  if (paragraph.length <= LONG_PARAGRAPH_THRESHOLD) return [paragraph];

  const sentences = paragraph
    .split(/(?<=[。！？；!?;])/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    return splitByLength(paragraph, SENTENCE_CHUNK_TARGET, SENTENCE_CHUNK_OVERLAP);
  }

  const chunks = [];
  let buffer = "";

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer}${sentence}` : sentence;
    if (candidate.length > SENTENCE_CHUNK_TARGET && buffer) {
      chunks.push(buffer.trim());
      const overlap = buildOverlap(buffer, SENTENCE_CHUNK_OVERLAP);
      buffer = `${overlap}${sentence}`.trim();
      continue;
    }
    buffer = candidate;
  }

  if (buffer) chunks.push(buffer.trim());

  return chunks
    .flatMap((chunk) =>
      chunk.length > LONG_PARAGRAPH_THRESHOLD
        ? splitByLength(chunk, SENTENCE_CHUNK_TARGET, SENTENCE_CHUNK_OVERLAP)
        : [chunk]
    )
    .filter((chunk) => chunk.length >= 30);
}

function splitByLength(text, target, overlap) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(text.length, start + target);
    const chunk = text.slice(start, end).trim();
    if (chunk.length >= 30) chunks.push(chunk);
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

function buildOverlap(text, overlapSize) {
  return text.slice(Math.max(0, text.length - overlapSize));
}

function buildChunks(paragraphs) {
  const chunks = [];
  let buffer = "";
  let startParagraph = 0;

  paragraphs.forEach((paragraph, index) => {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (candidate.length > DEFAULT_CHUNK_SIZE && buffer) {
      chunks.push({
        chunkIndex: chunks.length,
        text: buffer,
        position: chunkPosition(startParagraph, index - 1, paragraphs.length)
      });
      buffer = paragraph;
      startParagraph = index;
      return;
    }
    buffer = candidate;
  });

  if (buffer) {
    chunks.push({
      chunkIndex: chunks.length,
      text: buffer,
      position: chunkPosition(startParagraph, paragraphs.length - 1, paragraphs.length)
    });
  }

  return chunks;
}

function chunkPosition(start, end, total) {
  if (start === 0) return "opening";
  if (end >= total - 1) return "closing";
  return "middle";
}

function inferEra(frontmatter, filepath) {
  const dateValue = `${frontmatter.pubDate ?? frontmatter.updatedDate ?? ""}` || path.basename(filepath);
  const year = Number(String(dateValue).slice(0, 4));
  if (!Number.isFinite(year)) return "unknown";
  if (year <= 2020) return "early";
  if (year <= 2023) return "transition";
  return "recent";
}

function inferContentType(collectionKey, frontmatter, text) {
  if (collectionKey === "facebook") return "micro-essay";
  const title = `${frontmatter.title ?? ""} ${frontmatter.description ?? ""} ${text.slice(0, 160)}`;
  if (/譯文|translation/i.test(title)) return "translation";
  if (/演講|講稿/.test(title)) return "speech";
  if (/隨筆|紀要|短記|編年記/.test(title)) return "essay";
  if (/導讀|評論|掃描|總覽/.test(title)) return "commentary";
  return "article";
}

function buildKeywordScores(tokens) {
  const counts = new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 24)
    .map(([token, count]) => ({ token, count }));
}

async function buildDocument(collectionKey, filepath) {
  const raw = await fs.readFile(filepath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const plainText = stripMarkdown(body);
  const paragraphs = splitParagraphs(plainText);
  if (paragraphs.length === 0) return null;

  const chunks = buildChunks(paragraphs);
  const documentTokens = tokenize(
    `${data.title ?? ""}\n${data.description ?? ""}\n${data.tags?.join(" ") ?? ""}\n${plainText}`
  );
  const relativePath = path.relative(ROOT, filepath).replace(/\\/g, "/");

  return {
    id: `${collectionKey}:${path.basename(filepath, path.extname(filepath))}`,
    collection: collectionKey,
    filepath: relativePath,
    slug: path.basename(filepath, path.extname(filepath)),
    title: data.title ?? path.basename(filepath, path.extname(filepath)),
    description: data.description ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    source: data.source ?? collectionKey,
    contentType: inferContentType(collectionKey, data, plainText),
    era: inferEra(data, filepath),
    draft: data.draft === true,
    tokenCount: documentTokens.length,
    keywords: buildKeywordScores(documentTokens),
    chunks: chunks.map((chunk) => ({
      ...chunk,
      tokens: tokenize(`${data.title ?? ""}\n${chunk.text}`)
    }))
  };
}

async function main() {
  const documents = [];

  for (const collection of COLLECTIONS) {
    const files = await walk(collection.dir);
    for (const filepath of files) {
      const document = await buildDocument(collection.key, filepath);
      if (document && !document.draft) {
        documents.push(document);
      }
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    documentCount: documents.length,
    chunkCount: documents.reduce((sum, document) => sum + document.chunks.length, 0),
    collections: COLLECTIONS.map((collection) => collection.key),
    documents
  };

  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `[rag:build-corpus] wrote ${payload.documentCount} documents / ${payload.chunkCount} chunks to ${path.relative(ROOT, OUTPUT_FILE)}`
  );
}

main().catch((error) => {
  console.error("[rag:build-corpus] failed:", error);
  process.exitCode = 1;
});
