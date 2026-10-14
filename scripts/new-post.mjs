import { randomBytes } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

const args = process.argv.slice(2);
const isWeekly = args[0] === '--weekly';
const title = (isWeekly ? args.slice(1) : args).join(' ').trim();
if (!title || /[/\\\x00-\x1f]/.test(title) || title === '.' || title === '..') {
  console.error(`用法：pnpm ${isWeekly ? 'new-weekly' : 'new-post'} "文章标题"（标题不能包含路径分隔符）`);
  process.exit(1);
}
const root = path.resolve('src/content/blog');
async function existingLinks(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return existingLinks(file);
    if (!entry.name.endsWith('.md')) return [];
    const raw = await readFile(file, 'utf8');
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    return frontmatter ? [String(YAML.parse(frontmatter[1]).link ?? '')] : [];
  }));
  return groups.flat();
}
const used = new Set(await existingLinks(root));
let link;
do { link = randomBytes(4).toString('hex'); } while (used.has(link));
const directory = path.join(root, isWeekly ? '周刊' : '随笔');
await mkdir(directory, { recursive: true });
const file = path.join(directory, `${title.replace(/[<>:"|?*]/g, '-').replace(/[. ]+$/, '') || link}.md`);
const content = YAML.stringify({
  title, date: new Date().toISOString(), link, description: '',
  tags: isWeekly ? ['周刊'] : [], categories: isWeekly ? ['周刊'] : [], draft: true,
});
const body = isWeekly
  ? await readFile(new URL('../templates/weekly.md', import.meta.url), 'utf8')
  : '从这里开始写作。\n';
await writeFile(file, `---\n${content}---\n\n${body}`, { flag: 'wx' });
console.log(`已创建草稿：${file}\n文章链接：/post/${link}\n发布前将 draft 改为 false。`);
