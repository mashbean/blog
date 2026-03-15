import { promises as fs, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import os from "node:os";
import fg from "fast-glob";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "diagrams");
const TMP_BASE = path.join(os.tmpdir(), "mb-mermaid-export");

const DEFAULT_GLOBS = {
  blog: ["src/content/blog/**/*.{md,mdx}"],
  facebook: ["src/content/facebook/**/*.{md,mdx}"],
  all: ["src/content/blog/**/*.{md,mdx}", "src/content/facebook/**/*.{md,mdx}"]
};

const argCollection = process.argv.find((arg) => arg.startsWith("--collection="));
const collectionName = (argCollection?.split("=")[1] ?? "all").trim();
const globs = DEFAULT_GLOBS[collectionName] ?? DEFAULT_GLOBS.all;

function extractMermaidBlocks(markdown) {
  const blocks = [];
  const regex = /```mermaid\s*([\s\S]*?)```/gim;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const source = match[1]?.trim();
    if (!source) continue;
    blocks.push(source);
  }
  return blocks;
}

function normalizeStem(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}._-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getMmdcCommand() {
  const local = path.join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "mmdc.cmd" : "mmdc");
  return local;
}

function resolveChromeExecutable() {
  const hits = fg.sync("**/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing", {
    cwd: path.join(os.homedir(), ".cache", "puppeteer"),
    absolute: true,
    onlyFiles: true,
    suppressErrors: true
  });
  return hits[0];
}

function runMmdc(inputPath, outputPath) {
  const command = getMmdcCommand();
  const puppeteerConfigPath = path.join(TMP_BASE, "puppeteer-config.json");
  const userDataDir = path.join(TMP_BASE, "chrome-user-data");
  const executablePath = resolveChromeExecutable();
  const puppeteerConfig = {
    headless: "new",
    userDataDir,
    ...(executablePath ? { executablePath } : {}),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-crash-reporter",
      "--disable-breakpad"
    ]
  };
  try {
    writeFileSync(puppeteerConfigPath, `${JSON.stringify(puppeteerConfig, null, 2)}\n`, "utf8");
  } catch {
    // ignore
  }
  const result = spawnSync(
    command,
    [
      "-i",
      inputPath,
      "-o",
      outputPath,
      "--outputFormat",
      "png",
      "--backgroundColor",
      "transparent",
      "--width",
      "1400",
      "--height",
      "900",
      "--scale",
      "2",
      "--theme",
      "neutral",
      "--puppeteerConfigFile",
      puppeteerConfigPath
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        HOME: TMP_BASE,
        XDG_CONFIG_HOME: TMP_BASE,
        XDG_CACHE_HOME: path.join(os.homedir(), ".cache")
      }
    }
  );
  return result;
}

async function ensureCliInstalled() {
  const command = getMmdcCommand();
  try {
    await fs.access(command);
  } catch {
    throw new Error(
      "找不到 mmdc，請先執行 npm install。需要 devDependency: @mermaid-js/mermaid-cli。"
    );
  }
}

async function main() {
  await ensureCliInstalled();
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(TMP_BASE, { recursive: true });

  const files = await fg(globs, { cwd: ROOT, absolute: true });
  let exportedCount = 0;
  let scannedCount = 0;
  const warnings = [];
  const manifest = [];

  for (const file of files) {
    scannedCount += 1;
    const markdown = await fs.readFile(file, "utf8");
    const blocks = extractMermaidBlocks(markdown);
    if (blocks.length === 0) continue;

    const relPath = path.relative(path.join(ROOT, "src", "content"), file);
    const stemBase = normalizeStem(path.basename(file, path.extname(file)));
    const outputFolder = path.join(OUT_DIR, path.dirname(relPath));
    await fs.mkdir(outputFolder, { recursive: true });

    for (let index = 0; index < blocks.length; index += 1) {
      const source = blocks[index];
      const suffix = blocks.length > 1 ? `-${index + 1}` : "";
      const stem = `${stemBase}${suffix}`;
      const tmpInput = path.join(TMP_BASE, `${stem}.mmd`);
      const outputPath = path.join(outputFolder, `${stem}.png`);

      await fs.writeFile(tmpInput, source, "utf8");
      const run = runMmdc(tmpInput, outputPath);
      if (run.status !== 0) {
        warnings.push({
          file: relPath,
          block: index + 1,
          message: run.stderr?.trim() || "mmdc failed"
        });
        continue;
      }

      exportedCount += 1;
      manifest.push({
        sourceFile: relPath,
        block: index + 1,
        imagePath: path.relative(ROOT, outputPath).replaceAll(path.sep, "/")
      });
    }
  }

  const manifestPath = path.join(OUT_DIR, "manifest.json");
  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        collection: collectionName,
        scannedFiles: scannedCount,
        exported: exportedCount,
        warningsCount: warnings.length,
        items: manifest,
        warnings
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  console.log(`掃描檔案：${scannedCount}`);
  console.log(`輸出圖檔：${exportedCount}`);
  console.log(`清單檔案：${path.relative(ROOT, manifestPath)}`);
  if (warnings.length > 0) {
    console.warn(`警告：${warnings.length} 項，請檢查 manifest.json`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
