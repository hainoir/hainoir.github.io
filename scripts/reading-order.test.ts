import assert from 'node:assert/strict';
import test from 'node:test';
import { sortByReadingOrder } from '../src/lib/content/reading-order';

test('curated routes keep newly added posts and do not mutate date-sorted input', () => {
  const posts = ['new-post', 'graphs', 'basics', 'other-post', 'prefix-sum'];
  const before = [...posts];
  assert.deepEqual(
    sortByReadingOrder(posts, ['basics', 'prefix-sum', 'missing-draft', 'graphs'], (id) => id),
    ['basics', 'prefix-sum', 'graphs', 'new-post', 'other-post'],
  );
  assert.deepEqual(posts, before);
});

test('an unconfigured or empty route preserves the existing order', () => {
  const posts = [{ link: 'new' }, { link: 'old' }];
  assert.deepEqual(
    sortByReadingOrder(posts, undefined, (post) => post.link),
    posts,
  );
  assert.deepEqual(
    sortByReadingOrder(posts, [], (post) => post.link),
    posts,
  );
});
