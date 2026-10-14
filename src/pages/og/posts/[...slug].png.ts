import { siteConfig } from '@constants/site-config';
import { getPostDescription, getPostLastCategory, getPostSlug, getSortedPosts } from '@lib/content';
import { renderShareCard } from '@lib/seo/share-card';
import type { APIRoute, GetStaticPaths } from 'astro';
import type { BlogPost } from 'types/blog';
import { defaultLocale } from '@/i18n';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getSortedPosts(defaultLocale);
  return posts.map((post) => ({ params: { slug: getPostSlug(post) }, props: { post } }));
};

export const GET: APIRoute = async ({ props }) => {
  const post = props.post as BlogPost;
  const image = await renderShareCard({
    title: post.data.title,
    description: getPostDescription(post),
    siteName: siteConfig.title,
    category: getPostLastCategory(post).name,
    hostname: new URL(siteConfig.site).hostname,
    avatar: siteConfig.avatar,
  });
  return new Response(new Uint8Array(image), { headers: { 'Content-Type': 'image/png' } });
};
