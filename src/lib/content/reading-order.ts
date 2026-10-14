/** Place a curated reading route first, preserving the order of other posts. */
export function sortByReadingOrder<T>(
  posts: readonly T[],
  readingOrder: readonly string[] | undefined,
  getId: (post: T) => string,
): T[] {
  const ranks = new Map((readingOrder ?? []).map((id, index) => [id, index]));
  return [...posts].sort((a, b) => (ranks.get(getId(a)) ?? ranks.size) - (ranks.get(getId(b)) ?? ranks.size));
}
