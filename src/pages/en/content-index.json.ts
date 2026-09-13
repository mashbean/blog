import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildPostUrl, getBlogPosts } from "@/utils/blog";
import { cleanPostTitle } from "@/utils/title";

// 英文機讀內容索引：僅涵蓋已有英譯的文章。
const CONTENT_INDEX_BODY_LIMIT = 1200;

function normalizeForIndex(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[>*_#\-~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = await getBlogPosts();
  const postById = new Map(posts.map((post) => [post.id, post]));
  const translations = await getCollection("translations");

  const data = translations
    .flatMap((translation) => {
      const post = postById.get(translation.data.translationOf);
      if (!post) return [];
      return [
        {
          id: `en:${post.id}`,
          title: cleanPostTitle(translation.data.title),
          description: translation.data.description,
          url: buildPostUrl(post, { locale: "en" }),
          pubDate: post.data.pubDate.toISOString(),
          updatedDate: post.data.updatedDate?.toISOString(),
          source: "translation",
          language: "en",
          tags: translation.data.tags ?? [],
          content: normalizeForIndex(translation.body ?? "").slice(0, CONTENT_INDEX_BODY_LIMIT)
        }
      ];
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=600"
    }
  });
};
