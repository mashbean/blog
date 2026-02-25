export interface ResolvedCoverPath {
  primary: string;
  fallback?: string;
}

const isExternalUrl = (value: string): boolean => /^https?:\/\//i.test(value);

/**
 * Prefer lighter cover format when we have known paired assets.
 * Current policy:
 * - For local home covers ending with `.png`, prefer `.jpg`.
 * - Keep original path as fallback to avoid broken images.
 */
export const resolveCoverPath = (cover?: string | null): ResolvedCoverPath | null => {
  const raw = String(cover ?? "").trim();
  if (!raw) return null;
  if (isExternalUrl(raw)) return { primary: raw };

  if (/^\/images\/covers\/home\/.+\.png$/i.test(raw)) {
    return {
      primary: raw.replace(/\.png$/i, ".jpg"),
      fallback: raw
    };
  }

  return { primary: raw };
};

