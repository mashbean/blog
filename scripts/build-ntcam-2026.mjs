import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slides, titleZh, titleEn } from "./ntcam-2026-slides.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public/decks/ntcam-2026-publicness");
await fs.mkdir(path.join(dir, "assets"), { recursive: true });
await fs.mkdir(path.join(dir, "vendor"), { recursive: true });
await fs.copyFile(path.join(root, "public/decks/borderless-nomadism-2026/vendor/gsap.min.js"), path.join(dir, "vendor/gsap.min.js"));
await fs.copyFile(path.join(root, "public/decks/g0v-summit-2026-fabdao/assets/mark-dark.png"), path.join(dir, "assets/fabdao.png"));
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const lines = (s) => escape(s).replaceAll("\n", "<br>");
const section = (s, i) => `<section class="slide ${s.type || "standard"}${s.dark ? " dark" : ""}" id="slide-${i + 1}" aria-label="${i + 1} / ${slides.length}" data-slide="${i + 1}">
  <div class="content">
    ${s.label ? `<div class="label motion"><p lang="zh-Hant">${lines(s.label[0])}</p><p lang="en">${lines(s.label[1])}</p></div>` : ""}
    ${s.image ? `<img class="brand motion" src="${s.image.src}" alt="${s.image.alt}" width="930" height="838">` : ""}
    ${s.pairs.map(([zh, en], j) => `<div class="pair pair-${j + 1} motion"><${j === 0 ? (i === 0 ? "h1" : "h2") : "p"} class="zh" lang="zh-Hant">${lines(zh)}</${j === 0 ? (i === 0 ? "h1" : "h2") : "p"}><p class="en" lang="en">${lines(en)}</p></div>`).join("\n")}
    ${s.credits ? `<p class="credits motion">${escape(s.credits)}</p>` : ""}
  </div>
  <span class="print-number" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
</section>`;
const allSources = slides.flatMap(s => s.sources || []);
await fs.writeFile(path.join(dir, "index.html"), `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#fafaf8">
  <title>${titleZh} · mashbean</title>
  <meta name="description" content="${escape(titleEn)}">
  <link rel="canonical" href="https://mashbean.net/decks/ntcam-2026-publicness/">
  <meta property="og:title" content="${escape(titleZh)}">
  <meta property="og:description" content="${escape(titleEn)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mashbean.net/decks/ntcam-2026-publicness/">
  <meta property="og:image" content="https://mashbean.net/decks/ntcam-2026-publicness/assets/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16.png">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="stylesheet" href="styles.css">
  <script src="vendor/gsap.min.js" defer></script>
  <script src="deck.js" defer></script>
</head>
<body>
  <main id="deck" aria-label="${escape(titleZh)}">${slides.map(section).join("\n")}</main>
  <nav class="controls" aria-label="簡報操作 / Presentation controls">
    <a href="/decks/" title="簡報區 / All presentations" aria-label="簡報區 / All presentations">⌂</a>
    <button id="previous" aria-label="上一頁 / Previous slide" title="上一頁 / Previous (←)">‹</button>
    <output id="counter" aria-live="polite">01 / 18</output>
    <button id="next" aria-label="下一頁 / Next slide" title="下一頁 / Next (→)">›</button>
    <button id="overview" aria-label="閱讀模式 / Reading mode" title="閱讀模式 / Reading mode (R)" aria-pressed="false">☷</button>
    <button id="sources" aria-label="資料來源 / Sources" title="資料來源 / Sources">ⓘ</button>
    <button id="fullscreen" aria-label="全螢幕 / Fullscreen" title="全螢幕 / Fullscreen (F)">⛶</button>
    <button id="print" aria-label="列印或儲存 PDF / Print or save PDF" title="列印或儲存 PDF / Print or save PDF (P)">↥</button>
  </nav>
  <div class="progress" aria-hidden="true"><div id="progress-bar"></div></div>
  <dialog id="source-dialog" aria-labelledby="source-title">
    <button class="close" aria-label="關閉 / Close">×</button>
    <h2 id="source-title">資料來源 <span lang="en">Sources</span></h2>
    <p class="source-intro">第 17 頁 / Slide 17</p>
    ${allSources.map(s => `<article><a href="${s.url}" target="_blank" rel="noopener noreferrer">${escape(s.title)}</a><p>${escape(s.note)}</p></article>`).join("\n")}
    <article><p>FAB DAO 標誌沿用既有簡報資產。 / FAB DAO logo reused from the existing presentation.</p></article>
  </dialog>
</body>
</html>\n`);
await fs.writeFile(path.join(dir, "sources.json"), JSON.stringify(allSources, null, 2) + "\n");
console.log(`Built ${slides.length} slides at ${dir}`);
