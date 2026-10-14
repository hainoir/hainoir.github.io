import assert from 'node:assert/strict';
import test from 'node:test';
import { rankRelatedPosts } from '../src/lib/content/recommendations';

function post(link: string, tags: string[] = [], categories: string[] | string[][] = [], extra = {}) {
  return { slug: link, data: { link, title: link, date: new Date('2026-01-01'), tags, categories, ...extra } };
}

test('specific shared tags outrank general categories; results are stable and inputs unchanged', () => {
  const current = post('current', ['算法', 'C++'], ['算法']);
  const general = post('general', ['算法'], ['算法']);
  const specific = post('specific', ['算法', 'C++'], ['算法']);
  const pool = [current, general, post('other', ['算法'], ['算法']), specific];
  const before = [...pool];
  assert.equal(rankRelatedPosts(current, pool)[0].data.link, 'specific');
  assert.deepEqual(rankRelatedPosts(current, pool), rankRelatedPosts(current, [...pool].reverse()));
  assert.deepEqual(pool, before);
});

test('exclude current permalink, duplicate links, drafts, protected and unrelated posts', () => {
  const current = post('current', ['React']);
  const match = post('related', ['react']);
  const draft = { ...post('draft', ['React']), data: { ...post('draft', ['React']).data, draft: true } };
  const locked = { ...post('locked', ['React']), data: { ...post('locked', ['React']).data, password: 'secret' } };
  const self = { ...current, slug: 'different-source-slug' };
  assert.deepEqual(rankRelatedPosts(current, [self, match, match, draft, locked, post('unrelated')]), [match]);
  assert.deepEqual(rankRelatedPosts(current, [post('unrelated')]), []);
  assert.deepEqual(rankRelatedPosts(current, [match], 0), []);
});

test('nested categories and meaningful text can relate posts with missing tags', () => {
  const current = post('current', [], [['技术', '前端']]);
  const sibling = post('sibling', [], [['技术', '前端']]);
  assert.deepEqual(rankRelatedPosts(current, [sibling]), [sibling]);
  const text = post('text', [], [], { title: '前缀和与差分：二维区间更新' });
  const other = post('other', [], [], { title: '二维前缀和：区间求和' });
  assert.deepEqual(rankRelatedPosts(text, [other]), [other]);
});

test('incidental words must not recommend posts from unrelated categories', () => {
  const react = post('react', ['React', '前端'], ['前端'], {
    title: 'React 自定义 Hook',
    description: '常用写法，结合示例理解不重复逻辑，维护组件边界。',
  });
  const algorithm = post('algorithm', ['C++', '算法'], ['算法'], {
    title: 'C++ 基础模板',
    description: '常用写法，结合示例理解不重复区间，维护二分边界。',
  });
  assert.deepEqual(rankRelatedPosts(react, [algorithm]), []);
});
