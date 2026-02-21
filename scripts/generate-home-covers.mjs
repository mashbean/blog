#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const COVER_DIR_REL = path.join("images", "covers", "home");
const COVER_DIR_ABS = path.join(ROOT, "public", COVER_DIR_REL);
const HOMEPAGE_LIMIT = 12;

function escapeXml(input = "") {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeText(input = "") {
  return String(input)
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .trim();
}

function stripMarkdown(md = "") {
  return normalizeText(md)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/[|]/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSnippet(body = "", maxChars = 34) {
  const plain = stripMarkdown(body)
    .replace(/^來源[:：]?\s*/gim, "")
    .replace(/^source[:：]?\s*/gim, "")
    .trim();
  if (!plain) return "內容縮圖";
  const candidates = plain
    .split(/[。！？.!?]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => !/^來源[:：]?$/i.test(s))
    .filter((s) => !/^(https?:\/\/|www\.)/i.test(s));
  const sentence = candidates[0] ?? plain;
  const picked = sentence.slice(0, maxChars).trim();
  return picked || plain.slice(0, maxChars).trim() || "內容縮圖";
}

function wrapByChars(text, maxChars = 20, maxLines = 2) {
  const source = normalizeText(text);
  if (!source) return [];
  const lines = [];
  let cursor = 0;

  while (cursor < source.length && lines.length < maxLines) {
    const next = source.slice(cursor, cursor + maxChars).trim();
    if (!next) break;
    lines.push(next);
    cursor += maxChars;
  }

  if (cursor < source.length && lines.length > 0) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, Math.max(0, maxChars - 1))}…`;
  }

  return lines;
}

function createPencilIllustration({ title, subtitle, category, dateLabel }) {
  const titleLines = wrapByChars(title, 18, 3);
  const subtitleLines = wrapByChars(subtitle, 24, 2);
  const safeCategory = escapeXml(category || "文章");
  const safeDate = escapeXml(dateLabel || "");

  const titleSvg = titleLines
    .map((line, i) => `<tspan x="92" dy="${i === 0 ? 0 : 56}">${escapeXml(line)}</tspan>`)
    .join("");

  const subtitleSvg = subtitleLines
    .map((line, i) => `<tspan x="94" dy="${i === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <filter id="grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.04"/>
      </feComponentTransfer>
    </filter>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8f5ee"/>
      <stop offset="100%" stop-color="#f1ece3"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#paper)"/>
  <rect width="1200" height="630" filter="url(#grain)"/>

  <g stroke="#71685f" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.62">
    <path d="M68 92 C244 52, 418 98, 612 76"/>
    <path d="M628 72 C768 58, 930 92, 1122 66"/>
    <path d="M72 520 C262 544, 448 498, 658 526"/>
    <path d="M672 534 C826 550, 968 510, 1132 538"/>
  </g>

  <g opacity="0.2" stroke="#7d7268" stroke-width="1">
    <line x1="760" y1="172" x2="1098" y2="172"/>
    <line x1="760" y1="196" x2="1098" y2="196"/>
    <line x1="760" y1="220" x2="1098" y2="220"/>
    <line x1="760" y1="244" x2="1098" y2="244"/>
    <line x1="760" y1="268" x2="1098" y2="268"/>
    <line x1="760" y1="292" x2="1098" y2="292"/>
  </g>

  <g transform="translate(736,146)">
    <rect x="0" y="0" width="382" height="312" rx="18" fill="#f5f0e7" stroke="#8f8579" stroke-width="1.2"/>
    <path d="M30 248 C94 186, 152 194, 210 142 C248 106, 282 98, 340 58" stroke="#625a52" stroke-width="3" fill="none"/>
    <path d="M34 244 C102 272, 158 258, 238 264 C286 268, 314 254, 356 266" stroke="#7a6f63" stroke-width="2" fill="none"/>
    <circle cx="98" cy="102" r="24" stroke="#6e6459" stroke-width="2" fill="none"/>
    <path d="M90 84 L106 120 M106 84 L90 120" stroke="#786d61" stroke-width="1.6"/>
  </g>

  <g transform="translate(92,86)">
    <rect x="0" y="0" width="124" height="34" rx="17" fill="#ece6dc" stroke="#9a9084" stroke-width="1"/>
    <text x="62" y="22" text-anchor="middle" font-size="16" font-family="'Noto Sans TC', 'PingFang TC', sans-serif" fill="#4f463e">${safeCategory}</text>
  </g>

  <text x="92" y="196" font-size="58" font-family="'Noto Serif TC', 'PingFang TC', serif" fill="#2f2a25" letter-spacing="0.3">${titleSvg}</text>

  <text x="94" y="392" font-size="30" font-family="'Noto Sans TC', 'PingFang TC', sans-serif" fill="#4f463e" letter-spacing="0.2">${subtitleSvg}</text>

  <text x="94" y="562" font-size="18" font-family="'JetBrains Mono', monospace" fill="#655d54" opacity="0.9">${safeDate}</text>
  <text x="1106" y="562" text-anchor="end" font-size="18" font-family="'Noto Sans TC', sans-serif" fill="#655d54" opacity="0.9">pencil sketch · bologna mood</text>
</svg>`;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

function hasExplicitNoPublish(data) {
  return data.published === false || data.draft === true;
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildCoverAlt(data, snippet) {
  const category = data.category ? `${data.category} ` : "";
  return `${category}${data.title}｜鉛筆素描風文章縮圖，摘句：${snippet}`;
}

function upsertFrontmatter(raw, updates) {
  if (!raw.startsWith("---\n")) {
    throw new Error("File has no YAML frontmatter block.");
  }

  const end = raw.indexOf("\n---", 4);
  if (end < 0) {
    throw new Error("Frontmatter closing marker not found.");
  }

  const head = raw.slice(4, end);
  const tail = raw.slice(end + 4);
  let nextHead = head;

  for (const [key, value] of Object.entries(updates)) {
    const encoded = String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
    const lineRegex = new RegExp(`^${key}:\\s*.*$`, "m");
    if (lineRegex.test(nextHead)) {
      nextHead = nextHead.replace(lineRegex, `${key}: "${encoded}"`);
      continue;
    }
    nextHead = `${nextHead.replace(/\n+$/g, "")}\n${key}: "${encoded}"\n`;
  }

  const normalizedHead = `${nextHead.replace(/^\n+/, "").replace(/\n*$/g, "")}\n`;
  return `---\n${normalizedHead}---${tail}`;
}

async function main() {
  const files = await fg("*.md", { cwd: BLOG_DIR, absolute: true });
  const now = new Date();

  const parsed = [];
  const warnings = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const doc = matter(raw);
    const pubDate = toDate(doc.data.pubDate ?? doc.data.date);

    if (!pubDate) {
      warnings.push(`[skip] invalid pubDate: ${path.basename(filePath)}`);
      continue;
    }

    if (hasExplicitNoPublish(doc.data)) continue;
    if (pubDate.getTime() > now.getTime()) continue;

    parsed.push({
      filePath,
      fileName: path.basename(filePath),
      raw,
      data: doc.data,
      body: doc.content,
      pubDate
    });
  }

  parsed.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const targets = parsed.slice(0, HOMEPAGE_LIMIT);

  await fs.mkdir(COVER_DIR_ABS, { recursive: true });

  const report = {
    totalCandidates: parsed.length,
    selected: targets.length,
    generatedImages: 0,
    updatedFrontmatter: 0,
    skippedHasCover: 0,
    warnings
  };

  for (const item of targets) {
    const relName = item.fileName.replace(/\.md$/i, ".svg");
    const coverRelPath = path.posix.join(COVER_DIR_REL.split(path.sep).join("/"), relName);
    const coverAbsPath = path.join(COVER_DIR_ABS, relName);
    const snippet = firstSnippet(item.body, 36);
    const category = normalizeText(item.data.category || item.data.tags?.[0] || "文章").slice(0, 8) || "文章";

    const svg = createPencilIllustration({
      title: normalizeText(item.data.title || "Untitled").slice(0, 72),
      subtitle: snippet,
      category,
      dateLabel: formatDate(item.pubDate)
    });

    await fs.writeFile(coverAbsPath, svg, "utf8");
    report.generatedImages += 1;

    const frontmatterUpdates = {};
    if (!item.data.cover) {
      frontmatterUpdates.cover = coverRelPath;
    } else {
      report.skippedHasCover += 1;
    }

    if (!item.data.coverAlt || String(item.data.cover).includes("images/covers/home/")) {
      frontmatterUpdates.coverAlt = buildCoverAlt(item.data, snippet).slice(0, 180);
    }

    if (Object.keys(frontmatterUpdates).length === 0) continue;

    const nextRaw = upsertFrontmatter(item.raw, frontmatterUpdates);

    await fs.writeFile(item.filePath, nextRaw, "utf8");
    report.updatedFrontmatter += 1;
  }

  console.log("[home-cover-gen] done");
  console.log(JSON.stringify(report, null, 2));
  if (report.warnings.length) {
    console.log("\\nWarnings:");
    report.warnings.forEach((line) => console.log(`- ${line}`));
  }
}

main().catch((error) => {
  console.error("[home-cover-gen] failed:", error);
  process.exitCode = 1;
});
