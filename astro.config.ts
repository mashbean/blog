import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

const site = process.env.SITE_URL ?? "https://username.github.io";
const rawBase = process.env.BASE_PATH ?? "/";
const normalizedBase = rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

export default defineConfig({
  site,
  base: normalizedBase,
  trailingSlash: "always",
  output: "static",
  build: {
    format: "directory"
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        const segments = pathname.split("/").filter(Boolean);
        if (segments[0] !== "blog") return true;
        return segments.length === 3 && /^\d{4}$/.test(segments[1]);
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true
    }
  }
});
