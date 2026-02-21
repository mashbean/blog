import type { APIRoute } from "astro";
import { withBase } from "@/utils/paths";

export const GET: APIRoute = ({ site }) => {
  const sitemapPath = withBase("sitemap-index.xml");
  const sitemapURL = site ? new URL(sitemapPath, site).toString() : sitemapPath;

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemapURL}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
