const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../source/_posts');

// Helper to format date as YYYY-MM-DD HH:mm:ss
function formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds())
    );
}

if (!fs.existsSync(postsDir)) {
    console.error(`Directory not found: ${postsDir}`);
    process.exit(1);
}

const files = fs.readdirSync(postsDir);

files.forEach((file) => {
    if (path.extname(file) !== '.md') return;

    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file starts with YAML frontmatter
    if (content.trim().startsWith('---')) {
        console.log(`Skipping (already has frontmatter): ${file}`);
        return;
    }

    const stats = fs.statSync(filePath);
    const birthtime = stats.birthtime; // Creation time
    const title = path.basename(file, '.md');
    const dateStr = formatDate(birthtime);

    const frontmatter = `---
title: ${title}
date: ${dateStr}
tags:
---

`;

    const newContent = frontmatter + content;
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added frontmatter to: ${file}`);
});
