#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");
const PUBLIC_COVER_DIR_REL = path.posix.join("images", "covers", "home");
const PUBLIC_COVER_DIR_ABS = path.join(ROOT, "public", "images", "covers", "home");
const PROMPTS_PATH = path.join(ROOT, "scripts", "home-cover-prompts.json");
const REPORT_PATH = path.join(ROOT, "scripts", "home-cover-report.json");
const HOMEPAGE_LIMIT = 12;

const COVER_PRESETS = {
  editorialResearch: {
    basePrompt:
      "editorial gouache illustration, layered paper collage, visible paper fibers and cut edges, dry gouache and wax crayon texture, clean diagrammatic composition, warm research desk mood, restrained but vivid palette, no text, no typography, no letters, no watermark, no logo, no characters, no animals, no mascots",
    negativePrompt:
      "text, typography, letters, watermark, logo, signature, caption, people, faces, hands, animals, birds, foxes, pigs, cats, mascots, character illustration, photorealistic, 3d render, UI screenshot, low contrast, empty abstract background, cluttered composition"
  },
  bolognaAnimals: {
    basePrompt:
      "playful naive storybook illustration, hand-cut paper collage, visible torn paper edges, wax crayon and dry gouache texture, imperfect hand-drawn ink outlines, childlike animal characters, airy editorial composition, mint + apricot + cream + sky blue palette, cozy creative studio mood, no text, no typography, no letters, no watermark, no logo",
    negativePrompt:
      "text, typography, letters, watermark, logo, signature, caption, UI, screenshot, photo, photorealistic, 3d render, ugly, low quality, dark red, maroon, burgundy"
  }
};

const DEFAULT_COVER_PRESET = "editorialResearch";
const COVER_PRESET_ALIASES = {
  editorial: "editorialResearch",
  research: "editorialResearch",
  archive: "editorialResearch",
  map: "editorialResearch",
  diagram: "editorialResearch",
  bologna: "bolognaAnimals",
  animal: "bolognaAnimals",
  animals: "bolognaAnimals",
  storybook: "bolognaAnimals"
};

const ZH_STOPWORDS = new Set([
  "我們",
  "你們",
  "他們",
  "這個",
  "這些",
  "那個",
  "那些",
  "以及",
  "可以",
  "如果",
  "因為",
  "但是",
  "就是",
  "不是",
  "一個",
  "一種",
  "平台",
  "內容",
  "文章",
  "目前",
  "這樣",
  "其中",
  "更多",
  "開始",
  "如何",
  "沒有",
  "自己",
  "使用者",
  "第一",
  "第二",
  "第三",
  "因此",
  "然而",
  "我們",
  "你",
  "我",
  "他",
  "她",
  "它",
  "自己"
]);

const EN_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "will",
  "your",
  "about",
  "have",
  "has",
  "been",
  "are",
  "was",
  "were",
  "not",
  "more",
  "than",
  "blog",
  "post",
  "posts",
  "imported",
  "matters"
]);

const GENERIC_KEYWORDS = new Set([
  "公共網路",
  "ai與科技",
  "數位自主",
  "部落格",
  "blog",
  "分類",
  "文章",
  "內容"
]);

const ZH_VERBISH = new Set([
  "覺得",
  "看到",
  "可以",
  "開始",
  "完成",
  "處理",
  "使用",
  "覺得",
  "進行",
  "更新",
  "判斷",
  "分享",
  "希望",
  "記錄"
]);

const ZH_CONNECTOR_CHARS = /[從到與和及或並而但在把讓將被]/;
const ZH_BAD_SUFFIX = /(之後|之中|而已|流程|歷程|記錄|完成|判斷|這樣|這些)$/;

function parseArgs(argv) {
  const args = {
    apply: false,
    dryRun: false,
    file: ""
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--apply") args.apply = true;
    if (token === "--dry-run") args.dryRun = true;
    if (token === "--file") args.file = argv[i + 1] ?? "";
    if (token === "--file") i += 1;
  }

  return args;
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

function hashText(input = "") {
  let hash = 2166136261;
  for (const ch of input) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function addKeyword(score, key, weight = 1) {
  if (!key) return;
  const norm = normalizeText(key).toLocaleLowerCase("zh-TW");
  if (!norm) return;
  score.set(norm, (score.get(norm) ?? 0) + weight);
}

function isLikelyNounKeyword(term) {
  if (!term) return false;
  const t = normalizeText(term).toLocaleLowerCase("zh-TW");
  if (!t) return false;
  if (GENERIC_KEYWORDS.has(t)) return false;
  if (/^[\d\s./+-]+$/.test(t)) return false;
  if (t.length < 2 || t.length > 18) return false;
  if (t.includes(",")) return false;
  if (ZH_CONNECTOR_CHARS.test(t)) return false;
  if (ZH_BAD_SUFFIX.test(t)) return false;
  if (ZH_STOPWORDS.has(t) || ZH_VERBISH.has(t) || EN_STOPWORDS.has(t)) return false;
  if (/^(這|那|其|並|而|且|但|所以|因為)/.test(t)) return false;
  return true;
}

function extractKeywords({ title, description, body, tags, category }) {
  const score = new Map();
  const source = [title, description, body].filter(Boolean).join("\n");
  const plain = stripMarkdown(source)
    .replace(/^來源[:：]?\s*/gim, "")
    .replace(/^source[:：]?\s*/gim, "")
    .trim();

  // Keep tags, but reduce dominance so article nouns can surface.
  for (const tag of tags ?? []) addKeyword(score, tag, 4);
  if (category) addKeyword(score, category, 2);

  const titleParts = normalizeText(title ?? "")
    .split(/[：:，、／/（）()「」『』·\-\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
  for (const part of titleParts) {
    if (isLikelyNounKeyword(part)) addKeyword(score, part, 6);
  }

  const descParts = normalizeText(description ?? "")
    .split(/[：:，、。；／/（）()「」『』·\-\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
  for (const part of descParts) {
    if (isLikelyNounKeyword(part)) addKeyword(score, part, 4.5);
  }

  const zhTokens = plain.match(/[\p{Script=Han}]{2,8}/gu) ?? [];
  for (const token of zhTokens) {
    if (!isLikelyNounKeyword(token)) continue;
    addKeyword(score, token, 2.2);
  }

  const enTokens = plain.match(/[A-Za-z][A-Za-z0-9/+.-]{2,}/g) ?? [];
  for (const tokenRaw of enTokens) {
    const token = tokenRaw.toLocaleLowerCase("en-US");
    if (!isLikelyNounKeyword(token)) continue;
    addKeyword(score, token, 1);
  }

  const ranked = [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key)
    .filter(isLikelyNounKeyword);

  // Always keep up to 8 noun-like keywords; fallback to title parts if sparse.
  const out = [...new Set(ranked)].slice(0, 8);
  if (out.length < 4) {
    for (const part of [...titleParts, ...descParts]) {
      if (!isLikelyNounKeyword(part)) continue;
      if (out.includes(part.toLocaleLowerCase("zh-TW"))) continue;
      out.push(part.toLocaleLowerCase("zh-TW"));
      if (out.length >= 8) break;
    }
  }
  return out;
}

function resolveCoverPreset(value) {
  const raw = normalizeText(value).toLocaleLowerCase("en-US");
  if (!raw) return null;
  return COVER_PRESETS[raw] ? raw : COVER_PRESET_ALIASES[raw] ?? null;
}

function inferCoverPreset({ data, keywords, motif }) {
  const explicit = resolveCoverPreset(data.coverPreset);
  if (explicit) return explicit;

  const haystack = [
    data.title,
    data.description,
    ...(Array.isArray(data.tags) ? data.tags : []),
    keywords.join(" "),
    motif
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("zh-TW");

  if (/編年記|小記|日記|錄取|vibe|叔叔|旅遊|travel|life|memo/.test(haystack)) {
    return "bolognaAnimals";
  }

  return DEFAULT_COVER_PRESET;
}

function getPresetConfig(name) {
  return COVER_PRESETS[name] ?? COVER_PRESETS[DEFAULT_COVER_PRESET];
}

function pickMotif(keywords) {
  const joined = keywords.join(" ");
  if (/隱私|匿名|privacy|cipher|zk|crypt|加密/.test(joined)) return "privacy";
  if (/身分|identity|wallet|did|憑證/.test(joined)) return "identity";
  if (/民主|治理|policy|law|政府|公民/.test(joined)) return "governance";
  if (/牛津|大學|學院|研究所|學術|校園|留學|公共政策|政策/.test(joined)) return "academy";
  if (/nft|藝術|art|gallery|創作/.test(joined)) return "art";
  if (/esim|旅遊|travel|國際|global/.test(joined)) return "globe";
  if (/網路|社群|platform|network|matters/.test(joined)) return "network";
  return "abstract";
}

function motifPrompt(preset, motif) {
  if (preset === "bolognaAnimals") {
    switch (motif) {
      case "privacy":
        return "symbolic lock, shield, hidden patterns, privacy by design";
      case "identity":
        return "identity card silhouette, wallet motif, credential layers, subtle geometric frames";
      case "governance":
        return "civic architecture, columns, assembly, structured grid, governance";
      case "art":
        return "gallery frame, brush strokes, abstract sculpture, creative tools";
      case "academy":
        return "honey-stone university quadrangle, gothic arches, academic gown, bicycle, books, scholarly celebration";
      case "globe":
        return "globe lines, travel map, routes, connection arcs";
      case "network":
        return "community workshop scene, shared desk, cards and notes, collaborative civic mood";
      default:
        return "abstract shapes, calm geometry, editorial composition";
    }
  }

  switch (motif) {
    case "privacy":
      return "research board with hidden routes, layered note cards, shield motif, privacy by design";
    case "identity":
      return "credential cards, wallet token, structured forms, identity verification diagram";
    case "governance":
      return "civic archive board, assembly notes, policy documents, public decision map";
    case "art":
      return "gallery labels, sketch cards, creative tools, archival curation board";
    case "academy":
      return "scholarly desk, books, campus map, notes and diagrams";
    case "globe":
      return "map routes, checkpoints, signal towers, international connection diagram";
    case "network":
      return "node map, relay arcs, linked cards, community infrastructure diagram";
    default:
      return "structured archival collage, note cards, map fragments, investigative editorial composition";
  }
}

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function hasExplicitNoPublish(data) {
  return data.published === false || data.draft === true;
}

function upsertFrontmatter(raw, updates) {
  const doc = matter(raw);
  for (const [key, value] of Object.entries(updates)) {
    doc.data[key] = value;
  }
  return matter.stringify(doc.content, doc.data);
}

async function loadPostByFileName(fileName) {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const doc = matter(raw);
  return {
    filePath,
    fileName: path.basename(filePath),
    raw,
    data: doc.data,
    body: doc.content,
    pubDate: toDate(doc.data.pubDate ?? doc.data.date)
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const files = await fg("*.md", { cwd: BLOG_DIR, absolute: true });
  const now = Date.now();
  const posts = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, "utf8");
    const doc = matter(raw);
    const pubDate = toDate(doc.data.pubDate ?? doc.data.date);
    if (!pubDate) continue;
    if (hasExplicitNoPublish(doc.data)) continue;
    if (pubDate.getTime() > now) continue;
    posts.push({ filePath, fileName: path.basename(filePath), raw, data: doc.data, body: doc.content, pubDate });
  }

  posts.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  const targets = posts.slice(0, HOMEPAGE_LIMIT);

  if (args.file) {
    const explicitPost = await loadPostByFileName(args.file);
    const existingIndex = targets.findIndex((item) => item.fileName === explicitPost.fileName);
    if (existingIndex >= 0) {
      targets[existingIndex] = explicitPost;
    } else {
      targets.unshift(explicitPost);
    }
  }

  await fs.mkdir(PUBLIC_COVER_DIR_ABS, { recursive: true });

  const items = [];

  for (const post of targets) {
    const baseName = post.fileName.replace(/\.md$/i, "");
    const jpgName = `${baseName}.jpg`;
    const coverRelJpg = `${PUBLIC_COVER_DIR_REL}/${jpgName}`;
    const coverAbsJpg = path.join(PUBLIC_COVER_DIR_ABS, jpgName);

    const keywords = extractKeywords({
      title: post.data.title,
      description: post.data.description,
      body: post.body,
      tags: post.data.tags,
      category: post.data.category
    });
    const motif = pickMotif(keywords);
    const presetName = inferCoverPreset({ data: post.data, keywords, motif });
    const preset = getPresetConfig(presetName);
    const seed = hashText(`${post.fileName}|${keywords.join("|")}|${motif}`);

    const prompt = post.data.coverPrompt?.trim()
      ? post.data.coverPrompt.trim()
      : `${preset.basePrompt}, ${motifPrompt(presetName, motif)}, keywords: ${keywords.slice(0, 6).join(", ")}`;
    const negativePrompt = post.data.coverNegativePrompt?.trim()
      ? post.data.coverNegativePrompt.trim()
      : preset.negativePrompt;

    items.push({
      file: post.fileName,
      title: post.data.title ?? "",
      coverPng: coverRelJpg,
      width: 1200,
      height: 630,
      seed,
      prompt,
      negativePrompt,
      keywords: keywords.slice(0, 8),
      motif,
      preset: presetName
    });

    if (!args.apply) continue;

    let exists = false;
    try {
      await fs.access(coverAbsJpg);
      exists = true;
    } catch {
      exists = false;
    }

    if (!exists) continue;
    const nextRaw = upsertFrontmatter(post.raw, { cover: coverRelJpg });
    if (!args.dryRun) await fs.writeFile(post.filePath, nextRaw, "utf8");
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    defaultPreset: DEFAULT_COVER_PRESET,
    basePrompt: COVER_PRESETS[DEFAULT_COVER_PRESET].basePrompt,
    negativePrompt: COVER_PRESETS[DEFAULT_COVER_PRESET].negativePrompt,
    presets: Object.keys(COVER_PRESETS),
    items
  };
  if (!args.dryRun) {
    await fs.writeFile(PROMPTS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    await fs.writeFile(REPORT_PATH, `${JSON.stringify({ generatedAt: payload.generatedAt, items: items.map((x) => ({ file: x.file, coverPng: x.coverPng, keywords: x.keywords, motif: x.motif })) }, null, 2)}\n`, "utf8");
  }

  console.log("[home-cover-diffusion] prompts ready");
  console.log(`Targets: ${items.length}`);
  console.log(`Prompts: ${path.relative(ROOT, PROMPTS_PATH)}`);
  console.log(`Report: ${path.relative(ROOT, REPORT_PATH)}`);
  if (args.file) console.log(`Pinned file: ${args.file}`);
  if (args.apply) console.log("Applied: cover updated where PNG exists.");
}

main().catch((error) => {
  console.error("[home-cover-diffusion] failed:", error);
  process.exitCode = 1;
});
