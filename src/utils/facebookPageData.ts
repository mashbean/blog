import type { CollectionEntry } from "astro:content";
import { getFacebookPosts } from "@/utils/facebook";
import { cleanPostTitle } from "@/utils/title";
import { classifyPostTags, type ClassifiedTags } from "@/utils/blogTags";

type FacebookEntry = CollectionEntry<"facebook">;

export type FacebookPageContext = {
  newerPostId: string | null;
  olderPostId: string | null;
  relatedPostIds: string[];
  classifiedCurrent: ClassifiedTags;
};

export type FacebookPageData = {
  posts: FacebookEntry[];
  postsById: Map<string, FacebookEntry>;
  contextById: Map<string, FacebookPageContext>;
};

const pageDataCache = new Map<string, Promise<FacebookPageData>>();

export async function buildFacebookPageData(options?: {
  includeDrafts?: boolean;
  includeFuture?: boolean;
}): Promise<FacebookPageData> {
  const includeDrafts = options?.includeDrafts ?? false;
  const includeFuture = options?.includeFuture ?? false;
  const cacheKey = `${includeDrafts ? "1" : "0"}:${includeFuture ? "1" : "0"}`;
  const cached = pageDataCache.get(cacheKey);
  if (cached) return cached;

  const task = (async (): Promise<FacebookPageData> => {
    const posts = await getFacebookPosts({
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
    const contextById = new Map<string, FacebookPageContext>();

    for (let index = 0; index < posts.length; index += 1) {
      const post = posts[index];
      const classifiedCurrent = classifiedById.get(post.id)!;
      const currentTopics = new Set(classifiedCurrent.topics);
      const relatedPostIds = posts
        .filter((item) => item.id !== post.id)
        .map((item) => {
          const classified = classifiedById.get(item.id)!;
          const overlap = classified.topics.filter((topic) => currentTopics.has(topic)).length;
          return { item, score: overlap };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.item.data.pubDate.getTime() - a.item.data.pubDate.getTime();
        })
        .slice(0, 4)
        .map((entry) => entry.item.id);

      contextById.set(post.id, {
        newerPostId: index > 0 ? posts[index - 1].id : null,
        olderPostId: index < posts.length - 1 ? posts[index + 1].id : null,
        relatedPostIds,
        classifiedCurrent,
      });
    }

    return { posts, postsById, contextById };
  })();

  pageDataCache.set(cacheKey, task);
  return task;
}
