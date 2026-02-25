#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const ROOT = process.cwd();

function parseArgs(argv) {
  const args = {
    dir: "public/images/covers/home",
    maxKb: 900,
    failOnExceed: true
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--dir") args.dir = argv[++i] ?? args.dir;
    if (token === "--max-kb") args.maxKb = Number(argv[++i] ?? args.maxKb);
    if (token === "--warn-only") args.failOnExceed = false;
  }

  return args;
}

const toKb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targetDir = path.isAbsolute(args.dir) ? args.dir : path.join(ROOT, args.dir);
  const pattern = path.join(targetDir, "*.{jpg,jpeg,png,webp}").replaceAll("\\", "/");
  const files = await fg(pattern, { onlyFiles: true, absolute: true });

  if (files.length === 0) {
    console.log(`[cover-size] no files found under ${path.relative(ROOT, targetDir)}`);
    return;
  }

  const limitBytes = Math.max(1, Math.floor(args.maxKb * 1024));
  const offenders = [];

  for (const file of files) {
    const stat = await fs.stat(file);
    if (stat.size > limitBytes) {
      offenders.push({
        file: path.relative(ROOT, file),
        kb: toKb(stat.size)
      });
    }
  }

  const maxSeen = Math.max(
    ...(
      await Promise.all(
        files.map(async (file) => {
          const stat = await fs.stat(file);
          return stat.size;
        })
      )
    )
  );

  console.log(
    `[cover-size] checked ${files.length} files, limit=${args.maxKb}KB, max=${toKb(maxSeen)}KB`
  );

  if (offenders.length === 0) {
    console.log("[cover-size] all covers within size limit");
    return;
  }

  console.log("[cover-size] oversized files:");
  offenders
    .sort((a, b) => b.kb - a.kb)
    .forEach((item) => console.log(`  - ${item.file} (${item.kb}KB)`));

  if (args.failOnExceed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("[cover-size] failed:", error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

