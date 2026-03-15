#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COLLECTION_DIRS = [
  path.resolve(ROOT, "src/content/blog"),
  path.resolve(ROOT, "src/content/facebook"),
];
const FRONTMATTER_KEYS = ["slug", "sourceId"];

function walkMarkdownFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(abs, out);
      continue;
    }
    if (/\.mdx?$/i.test(entry.name)) out.push(abs);
  }
  return out;
}

function readFrontmatterValue(text, key) {
  const match = text.match(new RegExp(`^${key}:\\s*['"]?([^'"\\n]+)['"]?\\s*$`, "m"));
  return match ? match[1].trim() : "";
}

function buildIndex(files, key) {
  const map = new Map();
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const value = readFrontmatterValue(text, key);
    if (!value) continue;
    const list = map.get(value) ?? [];
    list.push(file);
    map.set(value, list);
  }
  return map;
}

function printDuplicates(key, duplicates) {
  console.error(`\n[duplicate:${key}] count=${duplicates.length}`);
  for (const [value, files] of duplicates) {
    console.error(`- ${value}`);
    for (const file of files) {
      console.error(`  - ${path.relative(ROOT, file)}`);
    }
  }
}

function main() {
  const files = COLLECTION_DIRS.flatMap((dir) => walkMarkdownFiles(dir));
  let hasError = false;

  for (const key of FRONTMATTER_KEYS) {
    const index = buildIndex(files, key);
    const duplicates = [...index.entries()].filter(([, paths]) => paths.length > 1);
    if (duplicates.length > 0) {
      hasError = true;
      printDuplicates(key, duplicates);
    } else {
      console.log(`[ok] ${key}: no duplicates`);
    }
  }

  if (hasError) {
    process.exitCode = 1;
    console.error("\nFound duplicate content ids. Resolve duplicates before build/release.");
    return;
  }

  console.log(`Scanned ${files.length} markdown files.`);
}

main();
