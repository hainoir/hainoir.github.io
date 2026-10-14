# hainoir 的博客

基于 [astro-koharu v3.3.1](https://github.com/cosZone/astro-koharu/tree/v3.3.1)，使用 Astro 5、React 19、TypeScript 和 Tailwind CSS 4，部署到 GitHub Pages。

## 本地开发

使用 Node.js 22 和 pnpm 11.7.0：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

正式搜索索引由构建过程生成，测试搜索请使用 `pnpm build` 后的 `pnpm preview`。

## 写文章

```sh
pnpm new-post "我的新文章"
```

文章位于 `src/content/blog/`，新文章默认是草稿。发布前将 `draft` 改为 `false`：

```yaml
---
title: 我的新文章
date: 2026-10-14T10:00:00+08:00
link: my-new-post
description: 一句话介绍
tags: [前端]
categories: [前端]
draft: false
---
```

`link` 是稳定的文章标识，对应 `/post/<link>`，发布后不要随意修改。

## 站点配置与发布

- 站点名称、头像、导航、分类、评论等：`config/site.yaml`。
- 关于页：`src/pages/about.md`。
- 静态图片：`public/img/`。
- 现有分类：前端、算法、工具。
- 评论、统计、音乐和追番默认未配置；可在站点配置中启用。
- 原有 GitHub Actions 部署流程仍监听 `hexo` 源码分支，将 `dist/` 发布到 GitHub Pages。迁移工作位于 `codex/migrate-astro-koharu`，合入源码分支后生效。

## 迁移记录

从 Fuwari 迁移到 astro-koharu；上游提交为 `0cccc0f6ca99f878af27bcbf2aaa59059f596b2e`。

- `published → date`、`image → cover`、`category → categories`、`abbrlink → link`。
- 14 篇文章正文原样保留，去除了旧分类名称开头的 `- `。
- `config/migration-manifest.json` 记录旧 URL、新 URL 和原始正文 SHA-256。
- `/posts/<abbrlink>.html` 跳转到 `/post/<abbrlink>`，保留查询参数和锚点。
- `/archive/` 及旧标签、分类查询兼容新路由；旧第二页 `/2/` 跳转到 `/posts/2`。
- 主题示例文章、友链和作者个人服务未带入。
- 原文里的 Typora 本地截图已复制到 `public/img/posts/`，渲染时转换图片地址，文章正文保持原样。
- 通过 pnpm `packageExtensions` 补齐 Langium 的两项隐式依赖，确保本地和 CI 都能使用冻结锁文件安装。

迁移验收命令：

```sh
pnpm verify-migration
pnpm verify-migration --built
```

验收脚本对照迁移时的正文校验值，兼容 Git 在 Windows/Linux 间转换的 LF/CRLF 换行符；日后修改文章正文后，这项历史验收会提示内容已变更。

主题代码遵循 [AGPL-3.0](LICENSE)，保留上游主题署名。博客文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。
