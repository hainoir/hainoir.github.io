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
pnpm new-weekly "第 1 期：本周复盘"
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

周刊草稿生成在 `src/content/blog/周刊/`，自动设置周刊分类，正文使用 `templates/weekly.md` 中的学习、工作、生活和下周计划模板。将 `draft` 改为 `false` 后，构建时自动收录到 `/weekly`、首页、文章时间线和 RSS；草稿不会出现在正式站点。

## 站点配置与发布

- 站点名称、头像、导航、分类、评论等：`config/site.yaml`。
- 关于页：`src/pages/about.astro`；工作经历配置：`config/experiences.yaml`，日期使用 `YYYY-MM`，省略结束时间表示至今。关于页和侧栏共用这份配置，时间轴根据容器宽度切换横向／纵向卡片布局。可选 `logo`（本地品牌图片）、`icon`（已安装的 Iconify 图标）和 `iconColor`（十六进制颜色），优先使用 `logo`。当前两家公司采用官网标识，来源记录在 `public/img/companies/README.md`。
- 文章时间线：`/timeline`，自动按发布日期倒序展示已发布文章。
- 静态图片：`public/img/`。
- 现有分类：前端、算法、工具。
- 专栏：`/frontend-notes/`（前端手记）和 `/algorithm-notes/`（算法手记），基于现有分类自动收录文章；顶部和侧栏的“专栏”菜单提供入口。
- 首页置顶：《深入浅出 TypeScript：类型系统、接口与泛型》和《前缀和与差分：一维与二维区间操作》。文章 frontmatter 设置 `sticky: true` 即可置顶，删除该字段或改为 `false` 即可取消。
- `featuredSeries[].readingOrder` 使用文章的稳定 `link` 定义推荐阅读顺序，专栏列表、文章页的系列列表与上一篇／下一篇共用这条路线；未列出的新文章会追加在后，首页与归档仍按日期排序。
- `description` 用于首页卡片、专栏列表、文章摘要和 SEO，建议根据正文填写具体概述。现有 14 篇文章已补齐。
- 专栏文章仍出现在首页普通列表和分页中；置顶或高亮文章单独展示，避免重复。`featuredSeries[].highlightOnHome` 控制是否自动高亮该专栏最新的一篇文章，目前关闭以使用手动精选。
- 文章页底部展示最多 4 篇相关文章，按共享标签、分类和标题／摘要主题匹配；不推荐当前文章、草稿或加密文章，无关联时隐藏。无需手动生成 AI 相似度文件。
- 分享预览图在构建时自动生成：站点使用 `/og/site.png`，文章使用 `/og/posts/<link>.png`，尺寸为 1200 × 630。OG、Twitter 和文章结构化数据共用该图片；复用主题字体，Windows/Linux 构建无需安装额外中文字体。
- 评论使用 Giscus，对应 `hainoir/hainoir.github.io` 的 Announcements 讨论分类。用稳定的 `/post/<link>` 关联讨论，修改文章标题不影响评论；滚动到评论区时加载，支持明暗主题。
- 访问统计使用 [Umami Cloud](https://cloud.umami.is/)，可在后台查看访问量、访客、来源与热门文章。`analytics.umami.endpoint` 填完整脚本地址，`id` 填 Website ID；只在正式域名记录访问，通过 Astro 切页事件上报，本地开发／预览不发送统计。
- 音乐页：`/music`。歌单和全站浮动播放器共用 `config/site.yaml` 的 `bgm.audio`，目前为网易云歌单 824962536；可以修改歌单名称和链接。手动开始播放，浮动播放器支持站内切页时持续播放。歌单解析依赖 `bgm.metingApi`，接口失败可重试；具体歌曲能否播放受音乐平台资源可用性影响。
- 周刊栏目：`/weekly`，名称为“周刊：每周学习、工作与生活复盘”，自动收录分类含“周刊”的文章。尚无已发布周刊时展示空状态。
- 追番未配置；可在站点配置中启用。
- GitHub Actions 部署流程监听 `hexo` 源码分支，将 `dist/` 发布到 GitHub Pages。迁移已合入该分支。

## 迁移记录

从 Fuwari 迁移到 astro-koharu；上游提交为 `0cccc0f6ca99f878af27bcbf2aaa59059f596b2e`。

- `published → date`、`image → cover`、`category → categories`、`abbrlink → link`。
- 迁移时原样保留了 14 篇文章正文，去除了旧分类名称开头的 `- `。后续阅读体验优化调整了文章标题与 Markdown 小节层级，代码块未改动。
- `config/migration-manifest.json` 记录旧 URL、新 URL 和原始正文 SHA-256。
- `config/editorial-manifest.json` 记录后续确认的标题与正文版本，原始迁移记录保持不变。
- `/posts/<abbrlink>.html` 跳转到 `/post/<abbrlink>`，保留查询参数和锚点。
- `/archive/` 及旧标签、分类查询兼容新路由；旧第二页 `/2/` 跳转到 `/posts/2`。
- 主题示例文章、友链和作者个人服务未带入。
- 原文里的 Typora 本地截图已复制到 `public/img/posts/`，渲染时转换图片地址。
- 通过 pnpm `packageExtensions` 补齐 Langium 的两项隐式依赖，确保本地和 CI 都能使用冻结锁文件安装。

迁移验收命令：

```sh
pnpm verify-migration
pnpm verify-migration --built
```

验收脚本优先对照已确认的编辑版本，其余文章对照原始迁移记录，兼容 Git 在 Windows/Linux 间转换的 LF/CRLF 换行符；后续修改正文时会提示内容已变更，需要审阅后更新对应的编辑记录。

阅读排序回归检查：`pnpm exec tsx --test scripts/reading-order.test.ts`。
推荐排序回归检查：`pnpm exec tsx --test scripts/recommendations.test.ts`。
音乐接口回归检查：`pnpm exec tsx --test scripts/meting.test.ts`。

主题代码遵循 [AGPL-3.0](LICENSE)，保留上游主题署名。博客文章采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)。
