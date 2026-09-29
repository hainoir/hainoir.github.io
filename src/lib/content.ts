import type { CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export const getDateValue = (date: string | Date) => {
  if (date instanceof Date) {
    return new Date(Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
    ) - 8 * 60 * 60 * 1000);
  }
  const normalized = date.trim().replace(' ', 'T');
  return new Date(normalized.endsWith('Z') ? normalized : `${normalized}+08:00`);
};

export const byNewest = (a: Post, b: Post) =>
  getDateValue(b.data.date).getTime() - getDateValue(a.data.date).getTime();

export const getPostUrl = (post: Post) => `/posts/${post.data.abbrlink}.html`;

export const getPrimaryCategory = (post: Post) =>
  post.data.categories.at(0)?.at(-1) ?? '未分类';

export const getCategories = (posts: Post[]) =>
  [...new Set(posts.map(getPrimaryCategory))].sort((a, b) => a.localeCompare(b, 'zh-CN'));

export const getTags = (posts: Post[]) =>
  [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));

export const getExcerpt = (post: Post, maxLength = 110) => {
  if (post.data.excerpt) return post.data.excerpt;

  const plain = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}...` : plain;
};

export const formatDate = (date: string | Date) => {
  if (typeof date === 'string') return date.slice(0, 10).replaceAll('-', '/');
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Shanghai',
  }).format(getDateValue(date));
};

export const toIsoDate = (date: string | Date) => getDateValue(date).toISOString();

export const getReadingMinutes = (post: Post) => {
  const characters = (post.body ?? '').replace(/\s/g, '').length;
  return Math.max(1, Math.ceil(characters / 500));
};
