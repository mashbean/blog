import { getCollection, type CollectionEntry } from "astro:content";
import { localizePath, withBase } from "@/utils/paths";
import { DEFAULT_LOCALE, type Locale } from "@/site.config";

export type BlogEntry = CollectionEntry<"blog">;

interface GetBlogPostsOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
}

const blogPostsCache = new Map<string, Promise<BlogEntry[]>>();

export async function getBlogPosts(options: GetBlogPostsOptions = {}): Promise<BlogEntry[]> {
  const includeDrafts = options.includeDrafts ?? !import.meta.env.PROD;
  const includeFuture = options.includeFuture ?? !import.meta.env.PROD;
  const cacheKey = `${includeDrafts ? "1" : "0"}:${includeFuture ? "1" : "0"}`;
  const cached = blogPostsCache.get(cacheKey);
  if (cached) return cached;

  const task = (async () => {
    const now = Date.now();
    const posts = await getCollection("blog");

    return posts
      .filter((post) => {
        if (!includeDrafts && post.data.draft) return false;
        if (!includeFuture && post.data.pubDate.getTime() > now) return false;
        return true;
      })
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
  })();

  blogPostsCache.set(cacheKey, task);
  return task;
}

function normalizeSlug(input: string): string {
  return input
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("zh-TW")
    .replace(/[/\\]+/g, "-")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashText(input: string): number {
  let hash = 2166136261;
  for (const ch of input) {
    hash ^= ch.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stripLegacyPartsFromId(id: string): string {
  return id
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/-(豆泥-matters|matters|artouch|medium)$/iu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getShortCode(post: BlogEntry): string {
  const identity = `${post.id}|${post.data.pubDate.toISOString()}|${post.data.slug ?? ""}`;
  return hashText(identity).toString(36).padStart(6, "0").slice(0, 6);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

export function getPostCanonicalPathSegment(post: BlogEntry): string {
  const year = post.data.pubDate.getFullYear();
  const monthDay = `${pad2(post.data.pubDate.getMonth() + 1)}${pad2(post.data.pubDate.getDate())}`;
  const shortCode = getShortCode(post);
  return `${year}/${monthDay}-${shortCode}`;
}

export function getLegacyPostPathSegment(post: BlogEntry): string {
  return post.id;
}

function getVerbosePathSegment(post: BlogEntry): string {
  const year = post.data.pubDate.getFullYear();
  const monthDay = `${pad2(post.data.pubDate.getMonth() + 1)}${pad2(post.data.pubDate.getDate())}`;
  const rawSlug = post.data.slug ?? stripLegacyPartsFromId(post.id);
  const normalized = normalizeSlug(rawSlug);
  const shortened = normalized.length > 40 ? normalized.slice(0, 40).replace(/-+$/g, "") : normalized;
  return `${year}/${monthDay}-${shortened || "post"}`;
}

interface PostPathCandidateOptions {
  includeVerboseLegacy?: boolean;
}

export function getPostPathCandidates(post: BlogEntry, options: PostPathCandidateOptions = {}): string[] {
  const includeVerboseLegacy = options.includeVerboseLegacy ?? false;
  const candidates = [getPostCanonicalPathSegment(post), getLegacyPostPathSegment(post)];
  if (includeVerboseLegacy) {
    candidates.splice(1, 0, getVerbosePathSegment(post));
  }
  return [...new Set(candidates)];
}

interface BuildPostUrlOptions {
  locale?: Locale;
}

export function buildPostUrl(post: BlogEntry, options: BuildPostUrlOptions = {}): string {
  const locale = options.locale ?? DEFAULT_LOCALE;
  const segment = `blog/${getPostCanonicalPathSegment(post)}/`;
  return locale === DEFAULT_LOCALE ? withBase(segment) : localizePath(segment, locale);
}
