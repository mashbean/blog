#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const PROMPTS_PATH = path.join(ROOT, "scripts", "home-cover-prompts.json");

function parseArgs(argv) {
  const args = {
    apiBase: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
    model: "gpt-image-1",
    size: "1536x1024",
    quality: "high",
    maxItems: 0,
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--api-base") args.apiBase = argv[++i] ?? args.apiBase;
    if (token === "--api-key-env") args.apiKeyEnv = argv[++i] ?? args.apiKeyEnv;
    if (token === "--model") args.model = argv[++i] ?? args.model;
    if (token === "--size") args.size = argv[++i] ?? args.size;
    if (token === "--quality") args.quality = argv[++i] ?? args.quality;
    if (token === "--max-items") args.maxItems = Number(argv[++i] ?? 0);
    if (token === "--dry-run") args.dryRun = true;
  }
  return args;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function buildPrompt(prompt, negativePrompt) {
  if (!negativePrompt) {
    return `${prompt}. Strictly no text, letters, words, logos, signatures, watermark.`;
  }

  return `${prompt}. Avoid: ${negativePrompt}. Strictly no text, letters, words, logos, signatures, watermark.`;
}

async function generateImage(apiBase, apiKey, body) {
  const res = await fetch(`${apiBase.replace(/\/+$/, "")}/images/generations`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`images api failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const image = data?.data?.[0]?.b64_json;
  if (!image) throw new Error("images api returned no b64_json");
  return Buffer.from(image, "base64");
}

function postProcessToCover(filePath) {
  execFileSync("sips", ["-s", "format", "png", filePath], { stdio: "ignore" });
  execFileSync("sips", ["-c", "630", "1200", filePath], { stdio: "ignore" });
  execFileSync("sips", ["-z", "630", "1200", filePath], { stdio: "ignore" });
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env[args.apiKeyEnv];
  if (!apiKey && !args.dryRun) {
    throw new Error(`missing API key env: ${args.apiKeyEnv}`);
  }

  const raw = await fs.readFile(PROMPTS_PATH, "utf8");
  const prompts = JSON.parse(raw);
  let items = Array.isArray(prompts.items) ? prompts.items : [];
  if (args.maxItems > 0) items = items.slice(0, args.maxItems);
  if (items.length === 0) throw new Error("no prompt items found");

  console.log(`[openai-render] items=${items.length} model=${args.model}`);

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const outPath = path.join(ROOT, "public", ...String(item.coverPng).split("/"));
    if (args.dryRun) {
      console.log(`[dry-run] ${index + 1}/${items.length} ${item.coverPng}`);
      continue;
    }

    const prompt = buildPrompt(String(item.prompt ?? ""), String(item.negativePrompt ?? ""));
    const payload = {
      model: args.model,
      prompt,
      size: args.size,
      quality: args.quality
    };

    const imageBuffer = await generateImage(args.apiBase, apiKey, payload);
    await ensureDir(outPath);
    await fs.writeFile(outPath, imageBuffer);
    postProcessToCover(outPath);
    console.log(`[ok] ${index + 1}/${items.length} ${item.coverPng}`);
  }

  console.log("[openai-render] done");
}

run().catch((error) => {
  console.error("[openai-render] failed:", error);
  process.exitCode = 1;
});
