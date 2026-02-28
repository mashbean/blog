#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PROMPTS_PATH = path.join(ROOT, "scripts", "home-cover-prompts.json");

function parseArgs(argv) {
  const args = {
    api: "http://127.0.0.1:7860",
    steps: 28,
    cfg: 6.5,
    sampler: "DPM++ 2M Karras",
    model: "",
    width: 0,
    height: 0,
    maxItems: 0,
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--api") args.api = argv[++i] ?? args.api;
    if (token === "--steps") args.steps = Number(argv[++i] ?? args.steps);
    if (token === "--cfg") args.cfg = Number(argv[++i] ?? args.cfg);
    if (token === "--sampler") args.sampler = argv[++i] ?? args.sampler;
    if (token === "--model") args.model = argv[++i] ?? "";
    if (token === "--width") args.width = Number(argv[++i] ?? 0);
    if (token === "--height") args.height = Number(argv[++i] ?? 0);
    if (token === "--max-items") args.maxItems = Number(argv[++i] ?? 0);
    if (token === "--dry-run") args.dryRun = true;
  }
  return args;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function setModel(apiBase, modelName) {
  if (!modelName) return;
  const res = await fetch(`${apiBase}/sdapi/v1/options`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sd_model_checkpoint: modelName })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`set model failed: ${res.status} ${text}`);
  }
}

async function renderOne(apiBase, item, settings) {
  const payload = {
    prompt: item.prompt,
    negative_prompt: item.negativePrompt,
    seed: item.seed,
    width: settings.width > 0 ? settings.width : item.width,
    height: settings.height > 0 ? settings.height : item.height,
    steps: settings.steps,
    cfg_scale: settings.cfg,
    sampler_name: settings.sampler,
    batch_size: 1,
    n_iter: 1,
    restore_faces: false,
    tiling: false,
    send_images: true,
    save_images: false
  };

  const res = await fetch(`${apiBase}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`txt2img failed (${item.file}): ${res.status} ${text}`);
  }

  const data = await res.json();
  const img = data?.images?.[0];
  if (!img) throw new Error(`no image returned (${item.file})`);

  return Buffer.from(img, "base64");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiBase = args.api.replace(/\/+$/, "");

  const raw = await fs.readFile(PROMPTS_PATH, "utf8");
  const prompts = JSON.parse(raw);
  let items = Array.isArray(prompts.items) ? prompts.items : [];
  if (args.maxItems > 0) items = items.slice(0, args.maxItems);
  if (items.length === 0) throw new Error("no prompt items found");

  if (!args.dryRun) {
    await setModel(apiBase, args.model);
  }

  console.log(`[a1111-render] items=${items.length} api=${apiBase}`);
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const absOut = path.join(ROOT, "public", ...item.coverPng.split("/"));
    if (args.dryRun) {
      console.log(`[dry-run] ${index + 1}/${items.length} -> ${item.coverPng}`);
      continue;
    }

    const buffer = await renderOne(apiBase, item, args);
    await ensureDir(absOut);
    await fs.writeFile(absOut, buffer);
    console.log(`[ok] ${index + 1}/${items.length} ${item.coverPng}`);
  }
  console.log("[a1111-render] done");
}

main().catch((error) => {
  console.error("[a1111-render] failed:", error);
  process.exitCode = 1;
});
