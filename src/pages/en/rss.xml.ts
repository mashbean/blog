import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION_EN, SITE_TITLE_EN } from "@/site.config";
import { buildPostUrl, getBlogPosts } from "@/utils/blog";
import { cleanPostTitle } from "@/utils/title";

// 英文 RSS：僅收錄已有英譯的文章，連到 /en/blog。
export const GET: APIRoute = async ({ site }) => {
  const posts = await getBlogPosts();
  const postById = new Map(posts.map((post) => [post.id, post]));
  const translations = await getCollection("translations");

  const items = translations
    .flatMap((translation) => {
      const post = postById.get(translation.data.translationOf);
      if (!post) return [];
      return [
        {
          title: cleanPostTitle(translation.data.title),
          description: translation.data.description,
          pubDate: post.data.pubDate,
          link: buildPostUrl(post, { locale: "en" })
        }
      ];
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    site: site ?? "https://mashbean.net",
    items,
    customData: `<language>en</language>`
  });
};
