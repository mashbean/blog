import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL ?? "https://mashbean.net";
const rawBase = process.env.BASE_PATH ?? "/";
const normalizedBase = rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

const publicDeckDirectoryIndex = () => ({
  name: "public-deck-directory-index",
  configureServer(server: { middlewares: { use: (handler: (req: { url?: string }, res: unknown, next: () => void) => void) => void } }) {
    server.middlewares.use((req, _res, next) => {
      if (req.url) {
        const url = new URL(req.url, "http://localhost");
        if (/^\/decks\/[^/]+\/$/.test(url.pathname)) {
          url.pathname = `${url.pathname}index.html`;
          req.url = `${url.pathname}${url.search}`;
        }
      }
      next();
    });
  }
});

export default defineConfig({
  site,
  base: normalizedBase,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory",
    // Pages rendered in parallel. Default 1 keeps existing behavior; CI sets
    // BUILD_CONCURRENCY to overlap per-page render latency on its slow runner.
    // Tune in the deploy workflow if CI time/memory regresses.
    concurrency: Math.max(1, Number(process.env.BUILD_CONCURRENCY ?? "1"))
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        if (!pathname.startsWith("/blog/")) return true;
        return /^\/blog\/\d{4}\/\d{4}-[a-z0-9]{6}\/$/i.test(pathname);
      }
    })
  ],
  vite: {
    plugins: [tailwindcss(), publicDeckDirectoryIndex()]
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true
    }
  }
});
