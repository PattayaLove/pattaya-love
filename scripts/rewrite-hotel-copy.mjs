#!/usr/bin/env node
/**
 * Rewrite generated hotel pages that still carry the old shared boilerplate.
 *
 * Earlier imports gave every page the same four paragraphs with only the hotel
 * name swapped, and one template for the meta description. This regenerates
 * both from scripts/lib/hotel-copy.mjs so each page is unique.
 *
 * Only pages still containing the old boilerplate are touched — hand-written
 * reviews are left alone. Output is deterministic, so re-running changes
 * nothing.
 *
 * Usage:
 *   node scripts/rewrite-hotel-copy.mjs            # dry run, live pages only
 *   node scripts/rewrite-hotel-copy.mjs --apply    # write them
 *   node scripts/rewrite-hotel-copy.mjs --all      # include pages not yet featured
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { buildBody, buildDescription } from './lib/hotel-copy.mjs';

const HOTELS = join(import.meta.dirname, '..', 'src', 'content', 'hotels');
const APPLY = process.argv.includes('--apply');
const ALL = process.argv.includes('--all');

/** Marker from the old import template. Its presence means the page is generated. */
const BOILERPLATE = "This puts you within reach of Pattaya's main attractions";

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split('\n')) {
    if (!line.includes(':') || line.startsWith(' ')) continue;
    const i = line.indexOf(':');
    data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '');
  }
  return { raw: m[1], data, body: m[2] };
}

let touched = 0;
let skipped = 0;

for (const file of readdirSync(HOTELS).filter((f) => f.endsWith('.md')).sort()) {
  const path = join(HOTELS, file);
  const text = readFileSync(path, 'utf-8');
  const fm = parseFrontmatter(text);
  if (!fm) continue;

  if (!text.includes(BOILERPLATE)) { skipped++; continue; }
  const isLive = fm.data.featured === 'true' && fm.data.draft === 'false';
  if (!ALL && !isLive) { skipped++; continue; }

  const input = {
    name: fm.data.name,
    slug: fm.data.slug,
    area: fm.data.area,
    street: fm.data.address || '',
    category: fm.data.category || 'Hotel',
    priceRange: fm.data.priceRange,
    rating: fm.data.rating,
    reviewsCount: fm.data.reviewsCount || 0,
    tomorrowland: fm.body.includes('Tomorrowland'),
  };

  const description = buildDescription(input).replace(/"/g, "'");
  const newFm = fm.raw.replace(/^description: ".*"$/m, `description: "${description}"`);
  const out = `---\n${newFm}\n---\n\n${buildBody(input)}`;

  if (APPLY) writeFileSync(path, out);
  else if (touched < 1) console.log(`\n--- ${file} (preview) ---\n${out}`);
  touched++;
}

console.log(
  `${APPLY ? 'Rewritten' : 'Would rewrite'}: ${touched} file(s)` +
  `\nUntouched: ${skipped}` +
  (ALL ? '' : '\n(pages not yet featured were skipped — pass --all to include them)') +
  (APPLY ? '' : '\nDry run. Pass --apply to write.')
);
