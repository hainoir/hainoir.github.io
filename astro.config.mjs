import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const flattenLegacyPostFiles = () => ({
  name: 'flatten-legacy-post-files',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const postsDir = fileURLToPath(new URL('./posts/', dir));
      const entries = await readdir(postsDir, { withFileTypes: true });

      await Promise.all(entries
        .filter((entry) => entry.isDirectory() && /^[a-f0-9]{7,8}(?:\.html)?$/i.test(entry.name))
        .map(async (entry) => {
          const directory = join(postsDir, entry.name);
          const indexPath = join(directory, 'index.html');
          const content = await readFile(indexPath);
          await rm(directory, { recursive: true, force: true });
          const outputName = entry.name.endsWith('.html') ? entry.name : `${entry.name}.html`;
          await writeFile(join(postsDir, outputName), content);
        }));

      const sitemapFiles = (await readdir(fileURLToPath(dir)))
        .filter((name) => /^sitemap-.*\.xml$/.test(name));
      await Promise.all(sitemapFiles.map(async (name) => {
        const sitemapPath = join(fileURLToPath(dir), name);
        const sitemap = await readFile(sitemapPath, 'utf8');
        await writeFile(sitemapPath, sitemap.replace(/(\/posts\/[^<]+\.html)\//g, '$1'));
      }));
    },
  },
});

export default defineConfig({
  site: 'https://hainoir.github.io',
  output: 'static',
  outDir: './dist',
  publicDir: './static',
  integrations: [sitemap(), flattenLegacyPostFiles()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});
