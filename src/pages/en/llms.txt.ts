import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildPostUrl, getBlogPosts } from "@/utils/blog";
import { localizePath, withBase } from "@/utils/paths";
import { SITE_DESCRIPTION_EN } from "@/site.config";
import { cleanPostTitle } from "@/utils/title";

// 英文 llms.txt：英文站點導覽 + 已有英譯的文章列表。
export const GET: APIRoute = async ({ site, url }) => {
  const posts = await getBlogPosts();
  const postById = new Map(posts.map((post) => [post.id, post]));
  const translations = await getCollection("translations");
  const base = site ? site.toString().replace(/\/$/, "") : `${url.origin}${withBase("")}`.replace(/\/$/, "");

  const lines: string[] = [
    "# mashbean blog (English)",
    "",
    "Site: mashbean.net",
    `Description: ${SITE_DESCRIPTION_EN}`,
    "",
    "## Key URLs",
    `${base}${localizePath("", "en")}`,
    `${base}${localizePath("blog/", "en")}`,
    `${base}${localizePath("works/", "en")}`,
    `${base}${localizePath("decks/", "en")}`,
    `${base}${localizePath("tags/", "en")}`,
    `${base}${localizePath("search/", "en")}`,
    `${base}${withBase("en/rss.xml")}`,
    `${base}${withBase("sitemap-index.xml")}`,
    `${base}${withBase("en/content-index.json")}`,
    "",
    "## Articles available in English"
  ];

  const enPosts = translations
    .flatMap((translation) => {
      const post = postById.get(translation.data.translationOf);
      if (!post) return [];
      return [{ post, translation }];
    })
    .sort((a, b) => b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime());

  for (const { post, translation } of enPosts) {
    lines.push(`- ${cleanPostTitle(translation.data.title)} | ${base}${buildPostUrl(post, { locale: "en" })}`);
  }

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=600"
    }
  });
};
