import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { byNewest, getDateValue, getExcerpt, getPostUrl } from '../lib/content';

export async function GET(context: { site: URL }) {
  const posts = (await getCollection('posts')).sort(byNewest);

  return rss({
    title: 'hainoir 的博客',
    description: '记录前端学习、项目实践与算法思考。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: getExcerpt(post, 180),
      pubDate: getDateValue(post.data.date),
      link: getPostUrl(post),
      categories: post.data.tags,
    })),
  });
}
