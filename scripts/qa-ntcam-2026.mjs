import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { slides, titleEn } from './ntcam-2026-slides.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.resolve(root, '../..');
const qa = path.join(workspace, 'tmp/ntcam-2026-publicness');
const output = path.join(workspace, 'output/ntcam-2026-publicness');
const require = createRequire(path.join(process.env.CODEX_NODE_MODULES || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'), 'package.json'));
const { chromium } = require('playwright');
const publicRoot = path.join(root, 'public');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.json': 'application/json' };
let server;
let url = process.env.NTCAM_PUBLIC_URL;
if (!url) {
  server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const local = path.join(publicRoot, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    try { const body = await fs.readFile(local); res.writeHead(200, { 'Content-Type': mime[path.extname(local)] || 'application/octet-stream' }); res.end(body); }
    catch { res.writeHead(404); res.end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${server.address().port}/decks/ntcam-2026-publicness/`;
}
await fs.mkdir(qa, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const errors = [];
const badResources = [];
const overflow = [];
page.on('pageerror', e => errors.push(e.message));
page.on('response', r => { if (r.status() >= 400) badResources.push([r.status(), r.url()]); });
try {
  await page.goto(url, { waitUntil: 'load' });
  assert.equal(await page.locator('.slide').count(), 18);
  assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), titleEn);
  for (const size of [[1440,900],[1920,1080],[1280,720],[390,844],[320,667],[844,390],[667,375]]) {
    await page.setViewportSize({ width: size[0], height: size[1] });
    for (let i = 1; i <= slides.length; i++) {
      await page.evaluate(n => { location.hash = String(n); }, i);
      await page.waitForFunction(n => document.querySelector('.slide.active')?.dataset.slide === String(n), i);
      const geometry = await page.locator('.slide.active').evaluate(s => {
        const c = s.querySelector('.content').getBoundingClientRect();
        return { top: c.top, bottom: c.bottom, left: c.left, right: c.right, width: innerWidth, height: innerHeight,
          uncentred: [...s.querySelectorAll('p,h1,h2')].some(e => getComputedStyle(e).textAlign !== 'center'),
          oversize: [...s.querySelectorAll('.pair,.label,.credits')].some(e => e.scrollWidth > e.clientWidth + 1) };
      });
      if (geometry.top < 10 || geometry.bottom > size[1] - 56 || geometry.left < 0 || geometry.right > size[0] + 1 || geometry.oversize || geometry.uncentred) overflow.push({ size, slide: i, ...geometry });
      if (size[0] === 1440) {
        await page.evaluate(() => document.body.classList.add('idle'));
        await page.screenshot({ path: path.join(qa, `slide-${String(i).padStart(2,'0')}.png`) });
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.keyboard.press('Home');
  assert.equal(await page.locator('.active').getAttribute('data-slide'), '1');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.active').getAttribute('data-slide'), '2');
  await page.keyboard.press('End');
  assert.equal(await page.locator('.active').getAttribute('data-slide'), '18');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.active').getAttribute('data-slide'), '18');
  await page.keyboard.press('r');
  assert.equal(await page.locator('.slide:visible').count(), 18);
  await page.keyboard.press('r');
  await page.locator('#sources').click();
  assert.equal(await page.locator('#source-dialog').isVisible(), true);
  assert.equal(await page.locator('#source-dialog a').count(), 3);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Home');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(900);
  assert.equal(await page.locator('.active .motion').first().evaluate(el => getComputedStyle(el).opacity), '1');
  await page.keyboard.press('f');
  await page.waitForTimeout(150);
  assert.equal(await page.evaluate(() => !!document.fullscreenElement), true);
  await page.keyboard.press('f');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Home');
  if (!process.env.NTCAM_PUBLIC_URL && !overflow.length) {
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.locator('.controls').evaluate(el => el.style.visibility = 'hidden');
    await page.locator('.progress').evaluate(el => el.style.visibility = 'hidden');
    await page.screenshot({ path: path.join(publicRoot, 'decks/ntcam-2026-publicness/assets/og.png') });
    await page.setViewportSize({ width: 1536, height: 864 });
    await fs.mkdir(output, { recursive: true });
    await page.pdf({ path: path.join(output, 'ntcam-2026-publicness.pdf'), preferCSSPageSize: true, printBackground: true });
  }
  const fallback = await browser.newPage({ javaScriptEnabled: false });
  await fallback.goto(url, { waitUntil: 'load' });
  assert.equal(await fallback.locator('.slide:visible').count(), 18);
  await fallback.close();
  const result = { url, slides: 18, overflow, errors, badResources, interactions: 'passed' };
  await fs.writeFile(path.join(qa, 'result.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  assert.equal(overflow.length, 0, 'Text must fit all tested screen sizes');
  assert.deepEqual(errors, []);
  assert.deepEqual(badResources, []);
} finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }
