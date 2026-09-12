// Generate the notes, slide captures and five-page PDF from the web source.
// Local runtime packages may be provided through CODEX_NODE_MODULES.
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import os from "node:os";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deck = path.join(root, "public/decks/mentor-madness-2026");
const workspace = path.resolve(root, "../..");
const output = process.env.MENTOR_OUTPUT || path.join(workspace, "output/mentor-madness-2026");
const qa = process.env.MENTOR_QA || path.join(workspace, "tmp/mentor-madness-2026");
const packageRoot =
  process.env.CODEX_NODE_MODULES ||
  path.join(
    os.homedir(),
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/",
  );
const require = createRequire(path.join(packageRoot, "package.json"));
const { chromium } = require("playwright");
await fs.mkdir(qa, { recursive: true });
const notes = {};
for (const lang of ["en", "zh"]) {
  const name = `speech-${lang}-v2.md`;
  const markdown = await fs.readFile(path.join(output, name), "utf8");
  const body = markdown.split("<!-- SPEECH START -->")[1].split("<!-- SPEECH END -->")[0];
  notes[lang] = body
    .split(/^### /m)
    .slice(1)
    .map((section) => {
      const [title, ...lines] = section.split("\n");
      return {
        title: title.trim(),
        paragraphs: lines
          .join("\n")
          .trim()
          .split(/\n\s*\n/)
          .map((p) => p.trim()),
      };
    });
  assert.equal(notes[lang].length, 5);
  await fs.copyFile(path.join(output, name), path.join(deck, name));
}
await fs.writeFile(path.join(deck, "notes.json"), JSON.stringify(notes, null, 2) + "\n");
const publicRoot = path.join(root, "public");
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".md": "text/plain",
};
const server = http.createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    const file = path.resolve(publicRoot, "." + pathname);
    if (!file.startsWith(publicRoot + path.sep)) throw Error("Invalid path");
    const bytes = await fs.readFile(file);
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const local = `http://127.0.0.1:${server.address().port}/decks/mentor-madness-2026/`;
const base = process.env.MENTOR_PUBLIC_URL || local;
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const errors = [];
const failed = [];
const reports = [];
async function pageAt(width, height) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
try {
  const desktop = await pageAt(1920, 1142);
  assert.equal(await desktop.locator(".slide").count(), 5);
  for (let i = 0; i < 5; i++) {
    if (i) await desktop.keyboard.press("ArrowRight");
    assert.equal(await desktop.locator("#counter").innerText(), `${i + 1} / 5`);
    const slide = desktop.locator(".slide.active");
    await slide.screenshot({ path: path.join(qa, `slide-${i + 1}.png`) });
    const overflow = await slide.evaluate((s) => {
      const bounds = s.getBoundingClientRect();
      return [...s.querySelectorAll("h1,h2,h3,p,figcaption,blockquote,img")]
        .map((e) => ({
          el: e.tagName,
          text: (e.textContent || e.getAttribute("alt") || "").slice(0, 60),
          r: e.getBoundingClientRect(),
        }))
        .filter(
          ({ r }) =>
            r.left < bounds.left - 1 ||
            r.right > bounds.right + 1 ||
            r.top < bounds.top - 1 ||
            r.bottom > bounds.bottom + 1,
        )
        .map(({ el, text }) => ({ el, text }));
    });
    reports.push({ slide: i + 1, overflow });
    assert.equal(overflow.length, 0, `Slide ${i + 1} overflow`);
  }
  assert.equal(
    await desktop
      .locator("img")
      .evaluateAll((imgs) => imgs.every((img) => img.complete && img.naturalWidth > 0)),
    true,
  );
  await desktop.keyboard.press("Home");
  await desktop.keyboard.press("n");
  await desktop.waitForFunction(() =>
    document.querySelector("#notes-body").textContent.includes("Good morning"),
  );
  await desktop.locator("#notes-zh").click();
  assert.match(await desktop.locator("#notes-body").innerText(), /大家早安/);
  await desktop.locator("#notes-next").click();
  assert.match(await desktop.locator("#notes-body").innerText(), /你太天真了/);
  await desktop.screenshot({ path: path.join(qa, "notes-zh.png") });
  await desktop.keyboard.press("Escape");
  assert.equal(await desktop.locator("#notes-dialog").evaluate((e) => e.open), false);
  await desktop.keyboard.press("End");
  assert.equal(await desktop.locator("#counter").innerText(), "5 / 5");
  await desktop.keyboard.press("Home");
  await desktop.locator("#reading-button").click();
  assert.equal(
    await desktop.locator("body").evaluate((e) => e.classList.contains("reading")),
    true,
  );
  await desktop.locator("#reading-button").click();
  const laptop = await pageAt(1366, 768);
  await laptop.keyboard.press("ArrowRight");
  await laptop.screenshot({ path: path.join(qa, "laptop-slide-2.png") });
  for (const width of [390, 700, 320]) {
    const mobile = await pageAt(width, 844);
    assert.equal(
      await mobile.locator("body").evaluate((e) => e.classList.contains("reading")),
      true,
    );
    const dimensions = await mobile.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
    }));
    if (dimensions.scroll > dimensions.width) {
      console.log(
        await mobile.locator("body *").evaluateAll((elements) =>
          elements
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return r.width > 0 && (r.right > innerWidth || r.left < 0);
            })
            .map((e) => ({
              tag: e.tagName,
              cls: e.className,
              text: e.textContent.slice(0, 50),
              right: e.getBoundingClientRect().right,
            }))
            .slice(-25),
        ),
      );
    }
    assert.equal(
      dimensions.scroll <= dimensions.width,
      true,
      `Horizontal mobile overflow at ${width}: ${dimensions.scroll}`,
    );
    await mobile.screenshot({ path: path.join(qa, `mobile-${width}.png`), fullPage: true });
    if (width === 390) {
      for (let i = 0; i < 5; i++) {
        await mobile
          .locator(".slide")
          .nth(i)
          .screenshot({ path: path.join(qa, `mobile-slide-${i + 1}.png`) });
      }
      await mobile.keyboard.press("Home");
      await mobile.locator("#notes-button").click();
      await mobile.locator("#notes-zh").click();
      await mobile.screenshot({ path: path.join(qa, "mobile-notes.png") });
    }
    await mobile.close();
  }
  const sourceResponse = await desktop.request.get(base + "sources.html");
  assert.equal(sourceResponse.status(), 200);
  if (!process.env.MENTOR_PUBLIC_URL) {
    const pdf = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: "reduce",
    });
    await pdf.goto(base + "?print=1", { waitUntil: "networkidle" });
    await pdf.evaluate(() => document.fonts.ready);
    await pdf.evaluate(() => {
      document.title = "A Good Excuse — Yen-Lin Huang — Mentor Madness 2026";
      for (const anchor of document.querySelectorAll("a[href]")) {
        anchor.href = new URL(
          anchor.getAttribute("href"),
          "https://mashbean.net/decks/mentor-madness-2026/",
        ).href;
      }
    });
    await pdf.pdf({
      path: path.join(output, "mentor-madness-2026.pdf"),
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
    await fs.copyFile(
      path.join(output, "mentor-madness-2026.pdf"),
      path.join(deck, "mentor-madness-2026.pdf"),
    );
    await desktop
      .locator(".slide.active")
      .screenshot({ path: path.join(deck, "assets/cover.jpg"), type: "jpeg", quality: 86 });
    await pdf.close();
  }
  const pdfResponse = await desktop.request.get(base + "mentor-madness-2026.pdf");
  assert.equal(pdfResponse.status(), 200);
  assert.equal(
    Buffer.from(await pdfResponse.body())
      .subarray(0, 5)
      .toString(),
    "%PDF-",
  );
  const downloadPromise = desktop.waitForEvent("download");
  await desktop.locator(".pdf-download").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "mentor-madness-2026.pdf");
  assert.equal(errors.length, 0, JSON.stringify(errors));
  assert.equal(failed.length, 0, JSON.stringify(failed));
  const summary = {
    base,
    slides: 5,
    reports,
    browserErrors: errors,
    httpErrors: failed,
    checks: [
      "all slide bounds",
      "images loaded",
      "keyboard navigation",
      "EN / ZH notes",
      "notes follow slide",
      "Escape closes dialog",
      "desktop reading toggle",
      "1366px layout",
      "320 / 390 / 700px reading view",
      "source page",
      "PDF bytes",
      "PDF download interaction",
    ],
  };
  await fs.writeFile(
    path.join(qa, process.env.MENTOR_PUBLIC_URL ? "public-qa.json" : "local-qa.json"),
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
  server.close();
  server.closeAllConnections();
}
