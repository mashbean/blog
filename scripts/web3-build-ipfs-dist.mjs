#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const toPosixPath = (value) => value.split(path.sep).join("/");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    srcDir: "dist",
    outDir: "dist-ipfs",
    keepPagefind: false
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--src" && args[i + 1]) options.srcDir = String(args[++i]).trim();
    if (arg === "--out" && args[i + 1]) options.outDir = String(args[++i]).trim();
    if (arg === "--keep-pagefind") options.keepPagefind = true;
  }
  return options;
};

const resetDir = async (dirPath) => {
  await fs.rm(dirPath, { recursive: true, force: true });
  await fs.mkdir(dirPath, { recursive: true });
};

const copyDirRecursive = async (fromDir, toDir) => {
  const entries = await fg(["**/*"], {
    cwd: fromDir,
    dot: true,
    onlyFiles: false
  });
  for (const relPathRaw of entries) {
    const relPath = toPosixPath(relPathRaw);
    const srcPath = path.join(fromDir, relPath);
    const dstPath = path.join(toDir, relPath);
    const stat = await fs.lstat(srcPath);
    if (stat.isDirectory()) {
      await fs.mkdir(dstPath, { recursive: true });
    } else if (stat.isFile()) {
      await fs.mkdir(path.dirname(dstPath), { recursive: true });
      await fs.copyFile(srcPath, dstPath);
    }
  }
};

const isCanonicalBlogPath = (relPath) =>
  /^blog\/\d{4}\/\d{4}-[a-z0-9]{6}\/index\.html$/.test(relPath);

const isRequiredBlogIndex = (relPath) => relPath === "blog/index.html";

const pruneBlogNonCanonical = async (outDir) => {
  const blogHtml = await fg(["blog/**/index.html"], {
    cwd: outDir,
    onlyFiles: true,
    dot: false
  });

  let removed = 0;
  let kept = 0;
  for (const relPathRaw of blogHtml) {
    const relPath = toPosixPath(relPathRaw);
    if (isCanonicalBlogPath(relPath) || isRequiredBlogIndex(relPath)) {
      kept += 1;
      continue;
    }
    await fs.rm(path.join(outDir, relPath), { force: true });
    removed += 1;
  }
  return { removed, kept };
};

const removeEmptyDirs = async (outDir) => {
  const dirs = await fg(["**/*"], {
    cwd: outDir,
    onlyDirectories: true,
    dot: true
  });
  const sorted = dirs.sort((a, b) => b.length - a.length);
  for (const relPathRaw of sorted) {
    const relPath = toPosixPath(relPathRaw);
    const abs = path.join(outDir, relPath);
    const entries = await fs.readdir(abs).catch(() => []);
    if (entries.length === 0) {
      await fs.rmdir(abs).catch(() => {});
    }
  }
};

const countFiles = async (dirPath) => {
  const files = await fg(["**/*"], {
    cwd: dirPath,
    onlyFiles: true,
    dot: false
  });
  return files.length;
};

const topLevelBreakdown = async (dirPath) => {
  const files = await fg(["**/*"], {
    cwd: dirPath,
    onlyFiles: true,
    dot: false
  });
  const byTop = new Map();
  for (const relPathRaw of files) {
    const relPath = toPosixPath(relPathRaw);
    const top = relPath.split("/")[0] || relPath;
    byTop.set(top, (byTop.get(top) ?? 0) + 1);
  }
  return [...byTop.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
};

const main = async () => {
  const options = parseArgs();
  const srcAbs = path.resolve(options.srcDir);
  const outAbs = path.resolve(options.outDir);

  const srcStat = await fs.stat(srcAbs).catch(() => null);
  if (!srcStat || !srcStat.isDirectory()) {
    throw new Error(`Source directory not found: ${srcAbs}. Run npm run build first.`);
  }

  await resetDir(outAbs);
  await copyDirRecursive(srcAbs, outAbs);

  let removedPagefindFiles = 0;
  if (!options.keepPagefind) {
    const pagefindDir = path.join(outAbs, "pagefind");
    const exists = await fs.stat(pagefindDir).catch(() => null);
    if (exists?.isDirectory()) {
      removedPagefindFiles = await countFiles(pagefindDir);
      await fs.rm(pagefindDir, { recursive: true, force: true });
    }
  }

  const blogPrune = await pruneBlogNonCanonical(outAbs);
  await removeEmptyDirs(outAbs);

  const totalFiles = await countFiles(outAbs);
  const breakdown = await topLevelBreakdown(outAbs);

  console.log(
    JSON.stringify(
      {
        srcDir: toPosixPath(path.relative(process.cwd(), srcAbs)),
        outDir: toPosixPath(path.relative(process.cwd(), outAbs)),
        removedPagefindFiles,
        removedNonCanonicalBlogPages: blogPrune.removed,
        keptCanonicalBlogPages: blogPrune.kept,
        totalFiles,
        breakdown
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error(`[web3-build-ipfs-dist] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
