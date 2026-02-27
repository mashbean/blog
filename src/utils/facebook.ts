import { getCollection, type CollectionEntry } from "astro:content";
import { withBase } from "@/utils/paths";

export type FacebookEntry = CollectionEntry<"facebook">;

interface GetFacebookPostsOptions {
  includeDrafts?: boolean;
  includeFuture?: boolean;
  featuredOnly?: boolean;
}

export async function getFacebookPosts(
  options: GetFacebookPostsOptions = {},
): Promise<FacebookEntry[]> {
  const includeDrafts = options.includeDrafts ?? !import.meta.env.PROD;
  const includeFuture = options.includeFuture ?? !import.meta.env.PROD;
  const featuredOnly = options.featuredOnly ?? false;
  const now = Date.now();
  const posts = await getCollection("facebook");

  return posts
    .filter((post) => {
      if (!includeDrafts && post.data.draft) return false;
      if (!includeFuture && post.data.pubDate.getTime() > now) return false;
      if (featuredOnly && !post.data.isFeatured) return false;
      return true;
    })
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
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

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function getShortCode(post: FacebookEntry): string {
  const identity = `${post.id}|${post.data.pubDate.toISOString()}|${post.data.slug ?? ""}`;
  return hashText(identity).toString(36).padStart(6, "0").slice(0, 6);
}

export function getFacebookCanonicalPathSegment(post: FacebookEntry): string {
  const year = post.data.pubDate.getFullYear();
  const monthDay = `${pad2(post.data.pubDate.getMonth() + 1)}${pad2(post.data.pubDate.getDate())}`;
  const shortCode = getShortCode(post);
  return `${year}/${monthDay}-${shortCode}`;
}

export function getFacebookLegacyPathSegment(post: FacebookEntry): string {
  return post.id;
}

function getVerbosePathSegment(post: FacebookEntry): string {
  const year = post.data.pubDate.getFullYear();
  const monthDay = `${pad2(post.data.pubDate.getMonth() + 1)}${pad2(post.data.pubDate.getDate())}`;
  const rawSlug = post.data.slug ?? post.id;
  const normalized = normalizeSlug(rawSlug);
  const shortened = normalized.length > 40 ? normalized.slice(0, 40).replace(/-+$/g, "") : normalized;
  return `${year}/${monthDay}-${shortened || "post"}`;
}

interface FacebookPathCandidateOptions {
  includeVerboseLegacy?: boolean;
}

export function getFacebookPathCandidates(
  post: FacebookEntry,
  options: FacebookPathCandidateOptions = {},
): string[] {
  const includeVerboseLegacy = options.includeVerboseLegacy ?? !import.meta.env.PROD;
  const canonical = getFacebookCanonicalPathSegment(post);
  const candidates = [canonical, getFacebookLegacyPathSegment(post)];
  if (includeVerboseLegacy) {
    candidates.splice(1, 0, getVerbosePathSegment(post));
  }
  return [...new Set(candidates)];
}

export function buildFacebookPostUrl(post: FacebookEntry): string {
  return withBase(`facebook/${getFacebookCanonicalPathSegment(post)}/`);
}
