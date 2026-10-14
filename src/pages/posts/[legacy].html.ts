import type { APIRoute, GetStaticPaths } from 'astro';
import { getPostSlug, getSortedPosts } from '@lib/content';
import migration from '../../../config/migration-manifest.json';

// Only publish aliases for migrated posts that are still public.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getSortedPosts();
  const slugs = new Set(posts.map(getPostSlug));
  return migration.filter((item) => slugs.has(item.link)).map((item) => ({
    params: { legacy: item.link },
    props: { target: item.canonical },
  }));
};

export const GET: APIRoute = ({ props, site }) => {
  const target = props.target as string;
  const canonical = new URL(target, site).href;
  return new Response(`<!doctype html><html lang="zh-CN"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>文章已迁移 · hainoir 的博客</title>
<link rel="canonical" href="${canonical}"><meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0; url=${target}"></noscript>
</head><body data-pagefind-ignore="all"><p>文章已迁移，<a href="${target}">点击阅读</a>。</p></body></html>`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
