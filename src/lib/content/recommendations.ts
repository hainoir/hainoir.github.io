interface RecommendationPost {
  slug: string;
  data: {
    link?: string;
    title: string;
    description?: string;
    tags?: string[];
    categories?: string[] | string[][];
    draft?: boolean;
    password?: string;
    date: Date;
  };
}

const normalize = (text: string) => text.normalize('NFKC').trim().toLowerCase();
const postKey = (post: RecommendationPost) => post.data.link ?? post.slug;
const tagsFor = (post: RecommendationPost) => new Set((post.data.tags ?? []).map(normalize).filter(Boolean));
const categoriesFor = (post: RecommendationPost) => new Set((post.data.categories ?? []).flat().map(normalize).filter(Boolean));

// Chinese bigrams and technical terms give title/summary matching a small tie-breaking weight.
function topicsFor(post: RecommendationPost): Set<string> {
  const text = normalize(`${post.data.title} ${post.data.description ?? ''}`);
  const topics = new Set(text.match(/[a-z][a-z0-9+#.-]*/g) ?? []);
  for (const phrase of text.match(/\p{Script=Han}+/gu) ?? []) {
    const chars = [...phrase];
    for (let i = 0; i < chars.length - 1; i++) topics.add(chars[i] + chars[i + 1]);
  }
  for (const generic of ['常用', '基础', '方法', '整理', '记录', '说明', '理解', '代码', '示例', '与其']) {
    topics.delete(generic);
  }
  return topics;
}

/** Rank public posts by shared tags/category, then title/summary topics. Never fill with unrelated posts. */
export function rankRelatedPosts<T extends RecommendationPost>(current: T, allPosts: readonly T[], count = 4): T[] {
  if (count <= 0 || current.data.password) return [];
  const seen = new Set([postKey(current)]);
  const candidates = allPosts.filter((post) => {
    const key = postKey(post);
    if (post.data.draft || post.data.password || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const currentTags = tagsFor(current);
  const currentCategories = categoriesFor(current);
  const currentTopics = topicsFor(current);
  const prepared = candidates.map((post) => ({
    post,
    tags: tagsFor(post),
    categories: categoriesFor(post),
    topics: topicsFor(post),
  }));
  const tagFrequency = new Map<string, number>();
  for (const { tags } of prepared) {
    for (const tag of tags) tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1);
  }
  return prepared
    .map(({ post, tags, categories, topics }) => {
      const sharedTags = [...tags].filter((tag) => currentTags.has(tag));
      const sharedCategories = [...categories].filter((category) => currentCategories.has(category));
      const sharedTopics = [...topics].filter((topic) => currentTopics.has(topic)).length;
      // Require a meaningful relationship; one incidental word is insufficient.
      const sparseCategories = currentCategories.size === 0 || categories.size === 0;
      const related = sharedTags.length > 0 || sharedCategories.length > 0 || (sparseCategories && sharedTopics >= 4);
      const tagScore = sharedTags.reduce(
        (score, tag) => score + 8 * Math.log1p(candidates.length / (tagFrequency.get(tag) ?? 1)),
        0,
      );
      const score = related ? tagScore + sharedCategories.length * 8 + Math.min(sharedTopics, 12) * 0.5 : 0;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.data.date.getTime() - a.post.data.date.getTime() ||
        postKey(a.post).localeCompare(postKey(b.post)),
    )
    .slice(0, Math.floor(count))
    .map(({ post }) => post);
}
