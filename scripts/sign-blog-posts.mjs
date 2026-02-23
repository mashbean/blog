#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { ethers } from "ethers";

const SIGNATURE_VERSION = "mashbean.article.v1";
const BLOG_DIR = path.resolve("src/content/blog");

const normalizeBody = (body) => body.replace(/\r\n/g, "\n").trim();

const buildPayload = ({ slug, title, description, pubDateISO, updatedDateISO, body }) =>
  JSON.stringify({
    version: SIGNATURE_VERSION,
    slug: String(slug ?? "").trim(),
    title: String(title ?? "").trim(),
    description: String(description ?? "").trim(),
    pubDateISO: String(pubDateISO ?? ""),
    updatedDateISO: String(updatedDateISO ?? ""),
    body: normalizeBody(String(body ?? ""))
  });

const computeHash = (payload) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(payload));
const signingMessage = (contentHash) => `${SIGNATURE_VERSION}:${contentHash}`;

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const dryRun = args.includes("--dry-run");
const fileArgIndex = args.indexOf("--file");
const fileFilter = fileArgIndex >= 0 ? args[fileArgIndex + 1] : null;

if (fileArgIndex >= 0 && !fileFilter) {
  console.error("[sign-blog-posts] Missing value for --file");
  process.exit(1);
}

const privateKey = process.env.WEB3_SIGNER_PRIVATE_KEY?.trim();
if (!privateKey && !checkOnly) {
  console.error("[sign-blog-posts] Missing WEB3_SIGNER_PRIVATE_KEY env var");
  process.exit(1);
}

const wallet = privateKey ? new ethers.Wallet(privateKey) : null;
const signerAddress = wallet?.address ?? null;

const patterns = fileFilter ? [fileFilter] : ["**/*.md", "**/*.mdx"];
const files = await fg(patterns, { cwd: BLOG_DIR, absolute: true });

if (files.length === 0) {
  console.log("[sign-blog-posts] No files matched");
  process.exit(0);
}

let changed = 0;
let verified = 0;
let unsigned = 0;

for (const filePath of files) {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  const slug = path.basename(filePath).replace(/\.(md|mdx)$/i, "");
  const payload = buildPayload({
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    pubDateISO: parsed.data.pubDate,
    updatedDateISO: parsed.data.updatedDate,
    body: parsed.content
  });

  const contentHash = computeHash(payload);
  const currentHash = String(parsed.data.contentHash ?? "").trim();
  const currentSig = String(parsed.data.signature ?? "").trim();

  if (checkOnly) {
    if (currentHash && currentSig) {
      verified += 1;
    } else {
      unsigned += 1;
    }
    continue;
  }

  const signature = await wallet?.signMessage(signingMessage(contentHash));
  if (!signature) {
    console.error(`[sign-blog-posts] Missing signature for ${filePath}`);
    process.exit(1);
  }
  parsed.data.contentHash = contentHash;
  parsed.data.signature = signature;
  parsed.data.signer = signerAddress;
  parsed.data.signatureVersion = SIGNATURE_VERSION;

  const next = matter.stringify(parsed.content, parsed.data);
  if (next !== raw) {
    changed += 1;
    if (!dryRun) {
      await fs.writeFile(filePath, next, "utf8");
    }
  }

  const mark = currentHash === contentHash && currentSig === signature ? "=" : "~";
  console.log(`${mark} ${path.relative(process.cwd(), filePath)}`);
}

if (checkOnly) {
  console.log(`[sign-blog-posts] verified=${verified} unsigned=${unsigned}`);
} else {
  console.log(`[sign-blog-posts] changed=${changed} total=${files.length}${dryRun ? " (dry-run)" : ""}`);
}
