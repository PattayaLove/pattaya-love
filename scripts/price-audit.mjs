#!/usr/bin/env node
/**
 * List guides that quote prices, and when those prices were last verified.
 *
 * The site claims to be current. This is the check on that claim: it finds
 * every page carrying a figure in THB, USD or euro and reports whether anyone
 * has confirmed it lately. Pages with no `pricesCheckedAt` have never been
 * verified — that is not a formatting gap, it is an unchecked number in front
 * of a reader.
 *
 * Usage: node scripts/price-audit.mjs [--stale-days 180]
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const GUIDES = join(import.meta.dirname, '..', 'src', 'content', 'guides');
const staleArg = process.argv.indexOf('--stale-days');
const STALE_DAYS = staleArg > -1 ? Number(process.argv[staleArg + 1]) : 180;

const PRICE = /\b\d[\d,]*\s?(THB|baht|USD)\b|[$€฿]\s?\d/gi;
const DAY = 86_400_000;

const rows = [];

for (const file of readdirSync(GUIDES).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(GUIDES, file), 'utf-8');
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) continue;
  const [, fm, body] = m;

  if (/^draft:\s*true/m.test(fm)) continue;

  const prices = (body.match(PRICE) || []).length;
  if (prices === 0) continue;

  const checked = fm.match(/^pricesCheckedAt:\s*(\S+)/m)?.[1];
  const ageDays = checked ? Math.floor((Date.now() - new Date(checked)) / DAY) : null;

  rows.push({ slug: file.replace(/\.md$/, ''), prices, checked, ageDays });
}

/* Never checked first, then oldest. Both are things to act on. */
rows.sort((a, b) => {
  if (!a.checked && b.checked) return -1;
  if (a.checked && !b.checked) return 1;
  if (!a.checked && !b.checked) return b.prices - a.prices;
  return b.ageDays - a.ageDays;
});

const never = rows.filter((r) => !r.checked);
const stale = rows.filter((r) => r.checked && r.ageDays > STALE_DAYS);
const fresh = rows.filter((r) => r.checked && r.ageDays <= STALE_DAYS);

const line = (r) =>
  `  ${String(r.prices).padStart(3)} prices  ${
    r.checked ? `checked ${r.checked} (${r.ageDays}d)` : 'never checked'.padEnd(24)
  }  ${r.slug}`;

if (never.length) {
  console.log(`\nNever verified (${never.length}) — highest price count first:`);
  never.forEach((r) => console.log(line(r)));
}
if (stale.length) {
  console.log(`\nOlder than ${STALE_DAYS} days (${stale.length}):`);
  stale.forEach((r) => console.log(line(r)));
}
if (fresh.length) {
  console.log(`\nCurrent (${fresh.length}):`);
  fresh.forEach((r) => console.log(line(r)));
}

const unchecked = never.reduce((n, r) => n + r.prices, 0);
console.log(
  `\n${rows.length} guides quote prices. ` +
    `${never.length} have never been verified, covering ${unchecked} figures.`
);
