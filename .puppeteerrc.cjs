// The site build (`astro build`) never uses puppeteer — it's only pulled in by
// @mermaid-js/mermaid-cli for the occasional, manual `npm run diagrams:build`
// (whose PNG outputs are committed under public/images/diagrams/). Skip the
// ~150–470 MB Chromium download on `npm ci` so Cloudflare/CI builds aren't
// dominated by fetching a browser the build never runs.
//
// To regenerate diagrams on a machine without a cached Chrome:
//   npx puppeteer browsers install chrome
module.exports = { skipDownload: true };
