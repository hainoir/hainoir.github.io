import { siteConfig } from '@constants/site-config';
import { renderShareCard } from '@lib/seo/share-card';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const image = await renderShareCard({
    title: siteConfig.title,
    description: siteConfig.description ?? '',
    siteName: siteConfig.name,
    category: siteConfig.subtitle,
    hostname: new URL(siteConfig.site).hostname,
    avatar: siteConfig.avatar,
  });
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png' } });
};
