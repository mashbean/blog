import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "../..");
const out = path.join(workspace, "tmp/borderless-nomadism-2026");
await fs.mkdir(out, { recursive: true });
const require = createRequire(
  "/Users/mashbean/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json",
);
const { chromium } = require("playwright");
const sharp = require("sharp");
const pub = path.join(root, "public");
const slug = "borderless-nomadism-2026";
const server = http.createServer(async (req, res) => {
  try {
    let name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (name.endsWith("/")) name += "index.html";
    const p = path.resolve(pub, "." + name);
    if (!p.startsWith(pub + path.sep)) throw Error("bad path");
    const b = await fs.readFile(p);
    const mime =
      {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".woff2": "font/woff2",
        ".webp": "image/webp",
        ".png": "image/png",
        ".json": "application/json",
      }[path.extname(p)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(b);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base =
  process.env.NOMAD_PUBLIC_URL || `http://127.0.0.1:${server.address().port}/decks/${slug}/`;
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const errors = [],
  bad = [],
  report = [];
async function make(width, height, reduce = true) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion: reduce ? "reduce" : "no-preference",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) bad.push([r.status(), r.url()]);
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}
try {
  const page = await make(1600, 1020);
  assert.equal(await page.locator(".slide").count(), 43);
  assert.equal(await page.locator("body.stage").count(), 1);
  for (let n = 1; n <= 43; n++) {
    await page.evaluate((n) => window.nomadDeck.show(n), n);
    const slide = page.locator(".slide.active");
    await slide.screenshot({ path: path.join(out, `slide-${String(n).padStart(2, "0")}.png`) });
    const issues = await slide.evaluate((s) => {
      const r = s.getBoundingClientRect(),
        body = s.querySelector(".slide-body").getBoundingClientRect(),
        footer = s.querySelector("footer").getBoundingClientRect();
      return [
        ...s.querySelectorAll(
          "h1,h2,h3,p,table,figure,.flow,.contents,.resource-list,.question-list,.big-word,.name-list,.era-line,.chapter-pair",
        ),
      ]
        .filter((e) => {
          const x = e.getBoundingClientRect();
          return (
            x.width &&
            (x.left < r.left - 1 ||
              x.right > r.right + 1 ||
              x.bottom > r.bottom + 1 ||
              x.top < r.top - 1 ||
              (e.closest(".slide-body") && x.bottom > footer.top - 3))
          );
        })
        .map((e) => ({ tag: e.tagName, text: e.textContent.slice(0, 80) }));
    });
    report.push({ slide: n, issues });
  }
  await fs.writeFile(path.join(out, "layout-report.json"), JSON.stringify(report, null, 2));
  assert.equal(
    report.filter((x) => x.issues.length).length,
    0,
    JSON.stringify(report.filter((x) => x.issues.length)),
  );
  await page.evaluate(() => window.nomadDeck.show(3));
  await page.locator(".active .term").first().click();
  assert.equal(await page.locator("#dialog").evaluate((e) => e.open), true);
  assert.match(await page.locator("#dialog-title").innerText(), /數位遊牧/);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#dialog").evaluate((e) => e.open), false);
  await page.keyboard.press("g");
  await page.locator('[data-go="26"]').click();
  assert.equal(await page.locator("#counter").innerText(), "27 / 43");
  await page.keyboard.press("n");
  assert.match(await page.locator("#dialog-content").innerText(), /張寶成/);
  await page.keyboard.press("Escape");
  await page.locator(".active .source-button").click();
  assert.match(await page.locator("#dialog-content").innerText(), /合著/);
  await page.keyboard.press("Escape");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowRight");
  assert.equal(await page.locator("#counter").innerText(), "2 / 43");
  await page.keyboard.press("End");
  assert.equal(await page.locator("#counter").innerText(), "43 / 43");
  await page.keyboard.press("r");
  assert.equal(await page.locator("body.reading").count(), 1);
  await page.keyboard.press("r");
  assert.equal(await page.locator("body.stage").count(), 1);
  await page.evaluate(() => window.nomadDeck.show(28));
  await page.locator(".active [data-image]").click();
  assert.equal(
    await page.locator("#dialog-content img").evaluate((e) => e.complete && e.naturalWidth > 0),
    true,
  );
  await page.keyboard.press("Escape");
  await page.locator("#fullscreen").click();
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
  await page.evaluate(() => document.exitFullscreen());
  for (const n of [16, 32]) {
    assert.equal(
      await page.locator(`#slide-${n}`).evaluate((e) => getComputedStyle(e).color),
      "rgb(247, 239, 220)",
      "Readable ink on dark manifesto pages",
    );
  }
  const animated = await make(1366, 768, false);
  await animated.evaluate(() => window.nomadDeck.show(5));
  await animated.waitForTimeout(3400);
  assert.equal(
    await animated
      .locator(".active .flow-step")
      .evaluateAll((es) => es.every((e) => getComputedStyle(e).opacity === "1")),
    true,
  );
  await animated.locator(".active [data-replay]").click();
  await animated.waitForTimeout(3400);
  assert.equal(
    await animated
      .locator(".active .flow-step")
      .evaluateAll((es) => es.every((e) => getComputedStyle(e).visibility === "visible")),
    true,
  );
  await animated.screenshot({ path: path.join(out, "animated-flow.png") });
  await animated.keyboard.press("ArrowRight");
  await animated.keyboard.press("ArrowRight");
  await animated.keyboard.press("ArrowLeft");
  await animated.waitForTimeout(800);
  assert.equal(await animated.locator(".slide.active").count(), 1);
  for (const n of [4, 14, 19, 29, 35, 42]) {
    await animated.evaluate((n) => window.nomadDeck.show(n), n);
    await animated.waitForTimeout(2900);
    assert.equal(
      await animated
        .locator(".active .flow-step")
        .evaluateAll((es) => es.every((e) => getComputedStyle(e).opacity === "1")),
      true,
      "Visible diagram " + n,
    );
    assert.equal(
      await animated
        .locator(".active .route")
        .evaluateAll((es) =>
          es.every((e) => Math.abs(parseFloat(getComputedStyle(e).strokeDashoffset)) < 0.1),
        ),
      true,
      "Completed routes " + n,
    );
  }
  await animated.close();
  for (const w of [320, 390, 700]) {
    const mobile = await make(w, 844);
    assert.equal(await mobile.locator("body.reading").count(), 1);
    assert.equal(
      await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      "overflow " + w,
    );
    const ms = await mobile
      .locator(".slide")
      .evaluateAll((es) =>
        es
          .map((s, i) => ({ n: i + 1, width: s.scrollWidth, client: s.clientWidth }))
          .filter((x) => x.width > x.client + 2),
      );
    assert.equal(ms.length, 0, JSON.stringify(ms));
    if (w === 390) {
      await mobile.screenshot({ path: path.join(out, "mobile-cover.png") });
      for (const n of [4, 7, 14, 30, 35, 42]) {
        await mobile
          .locator("#slide-" + n)
          .screenshot({ path: path.join(out, "mobile-" + n + ".png") });
      }
      await mobile.locator("#slide-24").scrollIntoViewIfNeeded();
      await mobile.locator("#slide-24 .term").last().click();
      await mobile.screenshot({ path: path.join(out, "mobile-note.png") });
      await mobile.keyboard.press("Escape");
    }
    await mobile.close();
  }
  const thumbs = [];
  for (let n = 1; n <= 43; n++) {
    const input = await sharp(path.join(out, `slide-${String(n).padStart(2, "0")}.png`))
      .resize(400, 225)
      .png()
      .toBuffer();
    thumbs.push({ input, left: ((n - 1) % 4) * 400, top: Math.floor((n - 1) / 4) * 225 });
  }
  await sharp({ create: { width: 1600, height: 2475, channels: 3, background: "#d8ceba" } })
    .composite(thumbs)
    .png()
    .toFile(path.join(out, "contact-sheet.png"));
  if (!process.env.NOMAD_PUBLIC_URL) {
    await page.evaluate(() => window.nomadDeck.show(1));
    const shot = await page.locator(".slide.active").screenshot();
    await sharp(shot)
      .resize(1200, 630, { fit: "cover" })
      .png()
      .toFile(path.join(pub, `decks/${slug}/assets/og.png`));
  }
  assert.equal(errors.length, 0, JSON.stringify(errors));
  assert.equal(bad.length, 0, JSON.stringify(bad));
  await fs.writeFile(
    path.join(out, process.env.NOMAD_PUBLIC_URL ? "qa-public.json" : "qa-local.json"),
    JSON.stringify({ base, report, errors, bad }, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        slides: 43,
        overflows: report.filter((x) => x.issues.length),
        errors,
        bad,
        interactionChecks: "passed",
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
  server.close();
}
