import { getCollection, type CollectionEntry } from "astro:content";
import { withBase } from "@/utils/paths";

export type BlogEntry = CollectionEntry<"blog">;

interface GetBlogPostsOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
}

export async function getBlogPosts(options: GetBlogPostsOptions = {}): Promise<BlogEntry[]> {
  const includeDrafts = options.includeDrafts ?? !import.meta.env.PROD;
  const includeFuture = options.includeFuture ?? !import.meta.env.PROD;
  const now = Date.now();

  const posts = await getCollection("blog");

  return posts
    .filter((post) => {
      if (!includeDrafts && post.data.draft) return false;
      if (!includeFuture && post.data.pubDate.getTime() > now) return false;
      return true;
    })
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function buildPostUrl(post: BlogEntry): string {
  return withBase(`blog/${post.id}/`);
}
