import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import YAML from 'yaml';

const manifest = JSON.parse(await readFile('config/migration-manifest.json', 'utf8'));
for (const item of manifest) {
  const text = await readFile(`src/content/blog/${item.file}`, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  assert.ok(match, `Missing frontmatter: ${item.file}`);
  const metadata = YAML.parse(match[1]);
  const body = text.slice(match[0].length);
  const lfBody = body.replace(/\r\n/g, '\n');
  const bodyHashes = [body, lfBody, lfBody.replace(/\n/g, '\r\n')]
    .map((value) => createHash('sha256').update(value).digest('hex'));
  assert.ok(bodyHashes.includes(item.bodySha256), `Changed body: ${item.file}`);
  assert.equal(metadata.title, item.title);
  assert.equal(String(metadata.link), item.link);
  assert.equal(String(metadata.date), item.date);
  assert.deepEqual(metadata.tags, item.tags);
  assert.deepEqual(metadata.categories, item.categories);
  if (process.argv.includes('--built')) {
    const post = await readFile(`dist${item.canonical}/index.html`, 'utf8');
    assert.ok(post.includes(item.title), `Missing rendered title: ${item.title}`);
    const legacy = await readFile(`dist${item.legacy}`, 'utf8');
    assert.ok(legacy.includes(item.canonical), `Missing legacy alias: ${item.legacy}`);
  }
}
console.log(`已验证 ${manifest.length} 篇文章：正文、标题、日期、标签和分类均完整${process.argv.includes('--built') ? '，旧链接均已生成' : ''}。`);
