import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

// Keep the migrated Markdown untouched while making its former Typora image portable.
const images: Record<string, string> = {
  'typora-user-images/image-20241113154710962.png': '/img/posts/image-20241113154710962.png',
};

export function rehypeLegacyImages() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img' || typeof node.properties.src !== 'string') return;
      let source = node.properties.src;
      try { source = decodeURIComponent(source); } catch { return; }
      source = source.replace(/\\/g, '/');
      for (const [legacy, target] of Object.entries(images)) {
        if (source.endsWith(`/${legacy}`)) node.properties.src = target;
      }
    });
  };
}
