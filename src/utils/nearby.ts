/**
 * Internal-link helpers for "nearby / related" lists.
 *
 * A fixed `.slice(0, N)` hands the same few entries every internal link while the
 * rest of a collection ends up with almost none. These helpers walk the sorted
 * list from the current entry onwards and wrap around at the end, so every entry
 * is linked from the same number of sibling pages.
 */

/** Entries following `current` in `sorted` (wrapping around), current excluded. */
export function rotateFrom<T>(sorted: T[], isCurrent: (item: T) => boolean, count: number): T[] {
  const index = sorted.findIndex(isCurrent);
  const rest = sorted.filter((item) => !isCurrent(item));
  if (index === -1) return rest.slice(0, count);
  // `rest` has the current entry removed, so the entry that followed it now sits at `index`.
  return [...rest.slice(index), ...rest.slice(0, index)].slice(0, count);
}

/** Stable alphabetical ordering by slug, so the rotation never changes between builds. */
export function bySlug<T extends { data: { slug: string } }>(a: T, b: T): number {
  return a.data.slug.localeCompare(b.data.slug);
}
