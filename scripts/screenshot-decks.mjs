// Generate first-slide thumbnails for the /decks/ index.
//
// Decks are static presentations under public/decks/<slug>/. This loads each
// deck in headless Chromium (bundled with the repo via @mermaid-js/mermaid-cli)
// at 16:9 and saves a JPEG to public/images/decks/<slug>.jpg. Run locally and
// commit the JPEGs so the Cloudflare build needs no browser.
//
//   npm run decks:thumbs                 # all manifest decks, from the live site
//   npm run decks:thumbs -- isf-0427     # just one (or more) slugs
//   DECKS_BASE_URL=http://localhost:4321 npm run decks:thumbs   # against `astro preview`
//
// Slugs come from src/data/decks.ts so we only shoot decks we actually list.

import { mkdirSync, readFileSync } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import puppeteer from "puppeteer";

const BASE_URL = (process.env.DECKS_BASE_URL || "https://mashbean.net").replace(/\/+$/, "");
const OUT_DIR = path.join(process.cwd(), "public", "images", "decks");
const VIEWPORT = { width: 1280, height: 720, deviceScaleFactor: 1 }; // 16:9
const MAX_KB = 900; // matches scripts/check-cover-sizes.mjs
const SETTLE_MS = 1200; // let deck-stage.js / SPA finish painting

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const manifest = readFileSync(path.join(process.cwd(), "src/data/decks.ts"), "utf8");
const slugs = [...manifest.matchAll(/slug:\s*"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((slug) => only.length === 0 || only.includes(slug));

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Screenshotting ${slugs.length} deck(s) from ${BASE_URL} → public/images/decks/`);

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

let ok = 0;
let fail = 0;
for (const slug of slugs) {
  const url = `${BASE_URL}/decks/${slug}/`;
  const out = path.join(OUT_DIR, `${slug}.jpg`);
  const page = await browser.newPage();
  try {
    await page.setViewport(VIEWPORT);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
    await new Promise((r) => setTimeout(r, SETTLE_MS));
    // deck-stage renders a navigator (filmstrip/controls) marked `.export-hidden`
    // in its shadow DOM; hide it and let the slide go full-bleed for a clean
    // thumbnail. No-op for decks that don't use deck-stage.
    await page.evaluate(() => {
      const ds = document.querySelector("deck-stage");
      if (ds && ds.shadowRoot) {
        const s = document.createElement("style");
        s.textContent =
          ".export-hidden{display:none!important}" +
          ".stage{inset:0!important;left:0!important;right:0!important;width:100%!important;margin:0!important}";
        ds.shadowRoot.appendChild(s);
      }
      const l = document.createElement("style");
      l.textContent = "button.fs-toggle{display:none!important}.export-hidden{display:none!important}";
      document.head.appendChild(l);
      window.dispatchEvent(new Event("resize"));
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: out, type: "jpeg", quality: 85 });
    const kb = Math.round((await stat(out)).size / 1024);
    console.log(`  ✓ ${slug}.jpg (${kb} KB)${kb > MAX_KB ? `  ⚠ over ${MAX_KB}KB` : ""}`);
    ok += 1;
  } catch (error) {
    console.warn(`  ✗ ${slug}: ${error.message} (card will use the title fallback)`);
    fail += 1;
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`Done: ${ok} ok, ${fail} failed.`);
