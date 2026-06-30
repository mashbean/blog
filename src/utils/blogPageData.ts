import type { CollectionEntry } from "astro:content";
import { getBlogPosts } from "@/utils/blog";
import { cleanPostTitle } from "@/utils/title";
import { classifyPostTags, type ClassifiedTags } from "@/utils/blogTags";

type BlogEntry = CollectionEntry<"blog">;

export type BlogPageContext = {
  newerPostId: string | null;
  olderPostId: string | null;
  relatedPostIds: string[];
  classifiedCurrent: ClassifiedTags;
};

export type BlogPageData = {
  posts: BlogEntry[];
  postsById: Map<string, BlogEntry>;
  contextById: Map<string, BlogPageContext>;
};

const pageDataCache = new Map<string, Promise<BlogPageData>>();

const normalizeTitle = (value: string): string =>
  value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

const bigrams = (value: string): Set<string> => {
  if (value.length < 2) return new Set([value]);
  const out = new Set<string>();
  for (let i = 0; i < value.length - 1; i += 1) out.add(value.slice(i, i + 2));
  return out;
};

const titleSimilarity = (a: string, b: string): number => {
  const aa = bigrams(normalizeTitle(a));
  const bb = bigrams(normalizeTitle(b));
  const union = new Set([...aa, ...bb]).size;
  if (union === 0) return 0;
  const overlap = [...aa].filter((item) => bb.has(item)).length;
  return overlap / union;
};

export async function buildBlogPageData(options?: {
  includeDrafts?: boolean;
  includeFuture?: boolean;
}): Promise<BlogPageData> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeFuture = options?.includeFuture ?? false;
  const cacheKey = `${includeDrafts ? "1" : "0"}:${includeFuture ? "1" : "0"}`;
  const cached = pageDataCache.get(cacheKey);
  if (cached) return cached;

  const task = (async (): Promise<BlogPageData> => {
    const posts = await getBlogPosts({
      includeDrafts,
      includeFuture,
    });
    const postsById = new Map(posts.map((item) => [item.id, item]));
    const classifiedById = new Map(
      posts.map((item) => [
        item.id,
        classifyPostTags({
          title: cleanPostTitle(item.data.title),
          description: item.data.description,
          body: item.body,
          tags: item.data.tags,
        }),
      ]),
    );
    const contextById = new Map<string, BlogPageContext>();

    for (let index = 0; index < posts.length; index += 1) {
      const post = posts[index];
      const postTitle = cleanPostTitle(post.data.title);
      const classifiedCurrent = classifiedById.get(post.id)!;
      const semanticTagsCurrent = [
        ...classifiedCurrent.topics,
        ...classifiedCurrent.keywords,
        ...classifiedCurrent.secondaryKeywords,
      ];
      const baseTitle = normalizeTitle(postTitle);
      const baseDate = post.data.pubDate.getTime();

      const relatedCandidates = posts
        .filter((item) => item.id !== post.id)
        .filter((item) => {
          const candidateTitleClean = cleanPostTitle(item.data.title);
          const sim = titleSimilarity(postTitle, candidateTitleClean);
          const candidateTitle = normalizeTitle(candidateTitleClean);
          const nearDuplicate =
            sim >= 0.66 || candidateTitle.includes(baseTitle) || baseTitle.includes(candidateTitle);
          const nearDate =
            Math.abs(item.data.pubDate.getTime() - baseDate) <= 7 * 24 * 60 * 60 * 1000;
          return !(nearDuplicate && nearDate);
        })
        .map((item) => {
          const classifiedItem = classifiedById.get(item.id)!;
          const semanticItemTags = [
            ...classifiedItem.topics,
            ...classifiedItem.keywords,
            ...classifiedItem.secondaryKeywords,
          ];
          const sharedTags = semanticItemTags.filter((tag) => semanticTagsCurrent.includes(tag));
          const sameCategory =
            post.data.category && item.data.category && post.data.category === item.data.category;
          const yearGap = Math.abs(
            item.data.pubDate.getFullYear() - post.data.pubDate.getFullYear(),
          );
          const score = sharedTags.length * 3 + (sameCategory ? 1 : 0) + (yearGap <= 2 ? 1 : 0);
          return { item, score, sharedTags, year: item.data.pubDate.getFullYear(), classifiedItem };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.item.data.pubDate.getTime() - a.item.data.pubDate.getTime();
        });

      const relatedPosts: CollectionEntry<"blog">[] = [];
      const usedYears = new Set<number>();
      const usedPrimaryTags = new Set<string>();
      for (const entry of relatedCandidates) {
        if (relatedPosts.length >= 4) break;
        const primaryTag =
          entry.sharedTags[0] ??
          entry.classifiedItem.topics[0] ??
          entry.classifiedItem.keywords[0] ??
          entry.classifiedItem.secondaryKeywords[0] ??
          "";
        const yearUsed = usedYears.has(entry.year);
        const tagUsed = primaryTag !== "" && usedPrimaryTags.has(primaryTag);
        if (relatedPosts.length < 2 || !(yearUsed && tagUsed)) {
          relatedPosts.push(entry.item);
          usedYears.add(entry.year);
          if (primaryTag) usedPrimaryTags.add(primaryTag);
        }
      }
      if (relatedPosts.length < 4) {
        for (const entry of relatedCandidates) {
          if (relatedPosts.length >= 4) break;
          if (relatedPosts.some((item) => item.id === entry.item.id)) continue;
          relatedPosts.push(entry.item);
        }
      }

      contextById.set(post.id, {
        newerPostId: index > 0 ? posts[index - 1].id : null,
        olderPostId: index < posts.length - 1 ? posts[index + 1].id : null,
        relatedPostIds: relatedPosts.map((item) => item.id),
        classifiedCurrent,
      });
    }

    return { posts, postsById, contextById };
  })();

  pageDataCache.set(cacheKey, task);
  return task;
}
