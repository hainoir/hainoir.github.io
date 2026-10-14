import { siteConfig } from '@constants/site-config';
import { encodeSlug } from '@lib/route';

/**
 * Get the OG image URL with proper fallback chain
 * Priority: generated post card → cover → defaultOgImage → avatar
 *
 * @param cover - Optional post cover image path
 * @param site - Site URL for absolute URL generation
 * @returns Absolute URL string or undefined
 */
export function getOgImageUrl(cover: string | undefined, site: URL | undefined, postSlug?: string): string | undefined {
  const imagePath = postSlug
    ? `/og/posts/${encodeSlug(postSlug)}.png`
    : cover || siteConfig.defaultOgImage || siteConfig.avatar;
  return imagePath && site ? new URL(imagePath, site).href : undefined;
}
