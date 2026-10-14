import { readFileSync } from 'node:fs';
import path from 'node:path';
import { type Font, openSync } from 'fontkit';
import sharp from 'sharp';

export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;

type Weight = 'Regular' | 'Bold';
interface FontSubset {
  file: string;
  ranges: [number, number][];
}
const subsets = new Map<Weight, FontSubset[]>();
const fonts = new Map<string, Font>();
const glyphs = new Map<string, { path: string; width: number; units: number }>();

// Reuse the theme's bundled WOFF2 subsets. SVG paths make Chinese rendering
// deterministic on Windows and Linux, without system fonts or network access.
function getSubsets(weight: Weight): FontSubset[] {
  let result = subsets.get(weight);
  if (result) return result;
  const directory = path.resolve('public/fonts', `ChillRoundF${weight}`);
  const css = readFileSync(path.join(directory, 'result.css'), 'utf8');
  result = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(([, face]) => {
    const filename = face.match(/url\("\.\/([^")]+)"\)/)?.[1];
    const unicode = face.match(/unicode-range:([^;]+);/)?.[1];
    if (!filename || !unicode) throw new Error('Invalid bundled font subset');
    const ranges = unicode.split(',').map((range): [number, number] => {
      const [from, to] = range.trim().replace(/^U\+/i, '').split('-');
      return [Number.parseInt(from, 16), Number.parseInt(to ?? from, 16)];
    });
    return { file: path.join(directory, filename), ranges };
  });
  if (!result.length) throw new Error('No bundled fonts found for share cards');
  subsets.set(weight, result);
  return result;
}

function glyphFor(character: string, weight: Weight) {
  const key = `${weight}:${character}`;
  const cached = glyphs.get(key);
  if (cached) return cached;
  const codePoint = character.codePointAt(0) ?? 32;
  const subset = getSubsets(weight).find(({ ranges }) => ranges.some(([from, to]) => codePoint >= from && codePoint <= to));
  if (!subset) {
    // Unsupported emoji/symbols use a visible replacement rather than a missing-glyph box.
    return glyphFor('?', weight);
  }
  let font = fonts.get(subset.file);
  if (!font) {
    font = openSync(subset.file) as Font;
    fonts.set(subset.file, font);
  }
  const glyph = font.glyphForCodePoint(codePoint);
  const result = { path: glyph.path.toSVG(), width: glyph.advanceWidth, units: font.unitsPerEm };
  glyphs.set(key, result);
  return result;
}

const textWidth = (text: string, size: number, weight: Weight) =>
  [...text].reduce((width, character) => {
    const glyph = glyphFor(character, weight);
    return width + (glyph.width / glyph.units) * size;
  }, 0);

function wrapText(text: string, size: number, weight: Weight, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  const words = [...new Intl.Segmenter('zh', { granularity: 'word' }).segment(text)].map(({ segment }) => segment);
  for (const word of words) {
    const pieces = textWidth(word, size, weight) > maxWidth ? [...word] : [word];
    for (const piece of pieces) {
      if (line && textWidth(line + piece, size, weight) > maxWidth) {
        let carry = '';
        // Keep closing punctuation with the preceding character when wrapping Chinese titles.
        if (/^[、，。；：！？…）》】,.!?;:)]/.test(piece)) {
          const characters = [...line.trimEnd()];
          carry = characters.pop() ?? '';
          line = characters.join('');
        }
        lines.push(line.trim());
        line = `${carry}${piece}`.trimStart();
      } else line += piece;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function fitText(text: string, maxWidth: number, maxLines: number, sizes: number[], weight: Weight) {
  for (const size of sizes) {
    const lines = wrapText(text, size, weight, maxWidth);
    if (lines.length <= maxLines) return { lines, size };
  }
  const size = sizes[sizes.length - 1];
  const lines = wrapText(text, size, weight, maxWidth).slice(0, maxLines);
  let last = lines[lines.length - 1] ?? '';
  while (last && textWidth(`${last}…`, size, weight) > maxWidth) last = [...last].slice(0, -1).join('');
  lines[lines.length - 1] = `${last}…`;
  return { lines, size };
}

function drawText(text: string, x: number, baseline: number, size: number, weight: Weight, color: string) {
  let cursor = x;
  return [...text]
    .map((character) => {
      const glyph = glyphFor(character, weight);
      const scale = size / glyph.units;
      const svg = `<path fill="${color}" transform="translate(${cursor.toFixed(2)} ${baseline}) scale(${scale} ${-scale})" d="${glyph.path}"/>`;
      cursor += glyph.width * scale;
      return svg;
    })
    .join('');
}

interface ShareCard {
  title: string;
  description: string;
  siteName: string;
  category?: string;
  hostname: string;
  avatar?: string;
}

export async function renderShareCard(card: ShareCard): Promise<Buffer> {
  const heading = fitText(card.title, 824, 3, [62, 58, 54, 50, 46, 42, 38], 'Bold');
  const summary = fitText(card.description, 820, 2, [23], 'Regular');
  const brand = fitText(card.siteName, 800, 1, [28, 24], 'Bold');
  let avatar = '';
  if (card.avatar?.startsWith('/img/') && !card.avatar.includes('..')) {
    const data = await sharp(path.join(process.cwd(), 'public', card.avatar))
      .resize(144, 144)
      .png()
      .toBuffer();
    avatar = `<image x="970" y="74" width="144" height="144" href="data:image/png;base64,${data.toString('base64')}" clip-path="url(#avatar)"/>`;
  }
  const titleTop = 286 - (heading.lines.length - 1) * heading.size * 0.4;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9536a"/><stop offset="1" stop-color="#ef9676"/></linearGradient>
      <clipPath id="avatar"><circle cx="1042" cy="146" r="72"/></clipPath>
    </defs>
    <rect width="1200" height="630" fill="#fcfafb"/>
    <rect width="14" height="630" fill="url(#accent)"/>
    <circle cx="1164" cy="478" r="192" fill="#fbe6eb"/>
    <circle cx="1164" cy="478" r="138" fill="none" stroke="#f4c7d2" stroke-width="2"/>
    <rect x="64" y="70" width="38" height="6" rx="3" fill="url(#accent)"/>
    ${drawText(brand.lines[0], 120, 82, brand.size, 'Bold', '#514550')}
    ${avatar}
    ${drawText((card.category || '技术笔记').slice(0, 20), 66, 160, 22, 'Regular', '#b64259')}
    ${heading.lines.map((line, i) => drawText(line, 64, titleTop + i * heading.size * 1.24, heading.size, 'Bold', '#282331')).join('')}
    ${summary.lines.map((line, i) => drawText(line, 66, 454 + i * 34, summary.size, 'Regular', '#625965')).join('')}
    <path d="M64 530H1136" stroke="#e7dce2" stroke-width="2"/>
    ${drawText(card.hostname, 66, 580, 22, 'Regular', '#625965')}
    ${drawText('HAINOIR', 997, 580, 22, 'Bold', '#b64259')}
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
