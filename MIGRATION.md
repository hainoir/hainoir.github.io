# Astro 迁移说明

当前仓库处于 Hexo 到 Astro 的并行迁移阶段。文章仍统一存放在 `source/_posts`，两套构建均可读取现有内容，线上切换前无需移动 Markdown 文件。

## 新版开发

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Astro 构建结果位于 `dist/`。文章继续使用现有 Frontmatter，其中 `abbrlink` 会生成与旧站一致的 `/posts/{abbrlink}.html` URL。

## Hexo 回退

```bash
pnpm build:hexo
pnpm server:hexo
pnpm deploy:hexo
```

旧 Hexo 配置和 Fluid 主题依赖暂时保留。确认 Astro 版本上线稳定后，再单独删除 Hexo 配置、依赖以及旧的部署方式。

## GitHub Pages 切换

新版工作流监听 `hexo` 分支，并通过 GitHub Pages Actions 发布 `dist/`。首次切换时，需要在仓库的 **Settings > Pages > Build and deployment** 中将 Source 设置为 **GitHub Actions**。
