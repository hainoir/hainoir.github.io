---
description: 如何编写和发布博客文章
---

本工作流将指导您完成创建新博客文章、本地预览以及发布到 GitHub 的全过程。

# 前置条件
- 确保您正处于 `hexo` 分支（用于存放源代码）。

# 1. 创建新文章
运行以下命令创建一个新的 Markdown 文件。请将 "My New Post" 替换为您的文章标题。

```bash
npx hexo new "My New Post"
```

这将在 `source/_posts/` 目录下创建一个名为 `My-New-Post.md` 的文件。

# 2. 编辑文章
使用编辑器打开并编写 `source/_posts/My-New-Post.md`。
- 在文件顶部的 Frontmatter 中设置标题 (`title`)、日期 (`date`) 和标签 (`tags`)。
- 使用 Markdown 语法编写您的正文内容。

# 3. 本地预览
启动本地服务器以预览您的更改。

```bash
// turbo
npx hexo server
```
- 在浏览器中打开 [http://localhost:4000](http://localhost:4000) 查看效果。
- 预览完成后，在终端按 `Ctrl+C` 停止服务器。

# 4. 保存源码
将您的更改提交到 `hexo` 分支以保存您的工作进度。

```bash
git add source/_posts
git commit -m "Add new post: My New Post"
git push origin hexo
```

# 5. 发布到网站
生成静态文件并将其部署到 `main` 分支（您的线上网站）。

```bash
// turbo
npx hexo generate
npx hexo deploy
```

> [!NOTE]
> `hexo deploy` 已配置为将生成的静态网站自动推送到您 GitHub 仓库的 `main` 分支。
