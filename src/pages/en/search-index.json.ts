import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildPostUrl, getBlogPosts } from "@/utils/blog";
import { localizePath } from "@/utils/paths";
import { cleanPostTitle } from "@/utils/title";

// 英文搜尋索引：僅涵蓋英文靜態頁與已有英譯的文章。
interface SearchDocument {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "post" | "facebook_post" | "page";
  pubDate?: string;
  content: string;
  tags: string[];
  topics?: string[];
}

const SEARCH_BODY_LIMIT = 900;

const staticPages: SearchDocument[] = [
  {
    id: "page:home",
    title: "Home",
    description:
      "Standing behind a one-way mirror, watching how the world responds to accelerating technology.",
    url: localizePath("", "en"),
    type: "page",
    content: "home latest writing featured",
    tags: ["home", "navigation"]
  },
  {
    id: "page:blog",
    title: "Writing",
    description: "Selected articles available in English, newest first.",
    url: localizePath("blog/", "en"),
    type: "page",
    content: "writing articles by year",
    tags: ["writing", "articles"]
  },
  {
    id: "page:works",
    title: "Works",
    description: "Personal experiments and Matters' open-source public infrastructure.",
    url: localizePath("works/", "en"),
    type: "page",
    content: "works projects open source",
    tags: ["works", "projects"]
  },
  {
    id: "page:decks",
    title: "Decks",
    description: "Slides from talks, classes, and workshops.",
    url: localizePath("decks/", "en"),
    type: "page",
    content: "decks slides talks",
    tags: ["decks", "slides"]
  },
  {
    id: "page:tags",
    title: "Tags",
    description: "Explore articles by topic tag.",
    url: localizePath("tags/", "en"),
    type: "page",
    content: "tags topics explore",
    tags: ["tags", "topics"]
  },
  {
    id: "page:about",
    title: "About",
    description: "Résumé and work focus of Yen-Lin (mashbean) Huang.",
    url: localizePath("about/", "en"),
    type: "page",
    content: "about author profile",
    tags: ["about", "author"]
  },
  {
    id: "page:subscribe",
    title: "Subscribe via RSS",
    description: "Subscribe to site updates with an RSS reader.",
    url: localizePath("subscribe/", "en"),
    type: "page",
    content: "rss subscribe feed reader",
    tags: ["rss", "subscribe"]
  },
  {
    id: "page:search",
    title: "Search",
    description: "Search articles and page content across the site.",
    url: localizePath("search/", "en"),
    type: "page",
    content: "search site search",
    tags: ["search"]
  }
];

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

  const postDocs: SearchDocument[] = translations.flatMap((translation) => {
    const post = postById.get(translation.data.translationOf);
    if (!post) return [];
    const tags = translation.data.tags ?? [];
    const searchableBody = normalizeForIndex(translation.body ?? "").slice(0, SEARCH_BODY_LIMIT);
    const searchableText = [translation.data.description, tags.join(" "), searchableBody]
      .filter(Boolean)
      .join(" ");
    return [
      {
        id: `en:${post.id}`,
        title: cleanPostTitle(translation.data.title),
        description: translation.data.description,
        url: buildPostUrl(post, { locale: "en" }),
        type: "post" as const,
        pubDate: post.data.pubDate.toISOString(),
        content: searchableText,
        tags,
        topics: tags
      }
    ];
  });

  return new Response(JSON.stringify([...staticPages, ...postDocs]), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=600"
    }
  });
};
