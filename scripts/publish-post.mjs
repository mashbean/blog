#!/usr/bin/env node
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");

function parseArgs(argv) {
  const args = {
    file: "",
    message: "",
    noPush: false,
    skipCover: false,
    skipSign: false,
    skipCheck: false,
    dryRun: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--file") args.file = argv[++i] ?? "";
    if (token === "--message") args.message = argv[++i] ?? "";
    if (token === "--no-push") args.noPush = true;
    if (token === "--skip-cover") args.skipCover = true;
    if (token === "--skip-sign") args.skipSign = true;
    if (token === "--skip-check") args.skipCheck = true;
    if (token === "--dry-run") args.dryRun = true;
  }

  if (!args.file) {
    throw new Error("Missing required --file <post.md>");
  }

  return args;
}

function run(cmd, cmdArgs, env = process.env) {
  execFileSync(cmd, cmdArgs, { cwd: ROOT, stdio: "inherit", env });
}

function safeRunOutput(cmd, cmdArgs) {
  return execFileSync(cmd, cmdArgs, { cwd: ROOT, encoding: "utf8" }).trim();
}

async function readPost(fileName) {
  const filePath = path.join(BLOG_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf8");
  const doc = matter(raw);
  return { filePath, raw, data: doc.data };
}

function normalizeCommitMessage(fileName, explicitMessage) {
  if (explicitMessage.trim()) return explicitMessage.trim();
  const slug = fileName.replace(/\.(md|mdx)$/i, "");
  return `feat: publish ${slug}`;
}

function loadEnvFile(envPath) {
  const parsed = {};
  const content = fsSync.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

function getEnvForSign() {
  if (process.env.WEB3_SIGNER_PRIVATE_KEY?.trim()) return process.env;

  const envLocal = path.join(ROOT, ".env.local");
  try {
    const loaded = loadEnvFile(envLocal);
    if (loaded.WEB3_SIGNER_PRIVATE_KEY?.trim()) {
      return { ...process.env, WEB3_SIGNER_PRIVATE_KEY: loaded.WEB3_SIGNER_PRIVATE_KEY.trim() };
    }
  } catch {
    // ignore
  }

  return process.env;
}

function isTrackedOrExists(relPath) {
  try {
    const out = safeRunOutput("git", ["ls-files", "--", relPath]);
    if (out) return true;
  } catch {
    // ignore
  }
  try {
    fsSync.accessSync(path.join(ROOT, relPath));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const postRelPath = path.posix.join("src", "content", "blog", args.file);

  const before = await readPost(args.file);
  const commitMessage = normalizeCommitMessage(args.file, args.message);

  if (!args.skipCover) {
    const coverArgs = ["run", "cover:latest", "--", "--file", args.file];
    if (args.dryRun) coverArgs.push("--dry-run");
    run("npm", coverArgs);
  }

  if (!args.skipSign) {
    const signEnv = getEnvForSign();
    run("npm", ["run", "sign:posts", "--", "--file", args.file], signEnv);
  }

  if (!args.skipCheck) {
    run("npm", ["run", "check"]);
  }

  const after = await readPost(args.file);
  const staged = [postRelPath, "scripts/home-cover-prompts.json"];

  const cover = String(after.data.cover ?? "").trim();
  if (cover && !/^https?:\/\//.test(cover)) staged.push(path.posix.join("public", cover));

  if (!args.dryRun && before.raw !== after.raw) {
    run("git", ["add", postRelPath]);
  }

  for (const relPath of staged) {
    if (!isTrackedOrExists(relPath)) continue;
    if (args.dryRun) continue;
    run("git", ["add", relPath]);
  }

  const stagedDiff = safeRunOutput("git", ["diff", "--cached", "--name-only"]);
  if (!stagedDiff) {
    console.log("[publish-post] no staged changes; nothing to commit");
    return;
  }

  if (args.dryRun) {
    console.log("[publish-post] dry-run staged files:\n" + stagedDiff);
    return;
  }

  run("git", ["commit", "-m", commitMessage]);

  if (!args.noPush) {
    run("git", ["push"]);
  } else {
    console.log("[publish-post] skipped push (--no-push)");
  }
}

main().catch((error) => {
  console.error("[publish-post] failed:", error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
