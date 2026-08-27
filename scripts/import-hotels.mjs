#!/usr/bin/env node
/**
 * Import hotels from Apify Google Maps Scraper JSON into Astro content collections.
 * Usage: node scripts/import-hotels.mjs <path-to-json>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { buildBody, buildDescription } from './lib/hotel-copy.mjs';

const INPUT = process.argv[2];
if (!INPUT) {
  console.error('Usage: node scripts/import-hotels.mjs <path-to-json>');
  process.exit(1);
}

const OUTPUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'hotels');
if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const raw = JSON.parse(readFileSync(INPUT, 'utf-8'));

// ── Filter: only actual hotels/resorts, deduplicate ──
const validCategories = new Set([
  'Hotel', 'Resort hotel', 'Wellness hotel', 'Guest house', 'Inn',
  'Hostel', 'Capsule hotel', 'Extended stay hotel', 'Bed & breakfast',
  'Serviced accommodation', 'Holiday apartment rental', 'Indoor lodging',
]);

const seen = new Set();
const hotels = raw.filter((h) => {
  if (!h.title || !h.totalScore) return false;
  if (!validCategories.has(h.categoryName)) return false;
  if (seen.has(h.title)) return false;
  seen.add(h.title);
  return true;
});

console.log(`Filtered: ${hotels.length} hotels from ${raw.length} entries`);

// ── Area detection based on address/street ──
function detectArea(h) {
  const addr = `${h.street || ''} ${h.title || ''}`.toLowerCase();
  if (addr.includes('jomtien') || addr.includes('jomthien')) return 'Jomtien';
  if (addr.includes('na jomtien') || addr.includes('najomtien')) return 'Na Jomtien';
  if (addr.includes('walking street') || addr.includes('walking st')) return 'Walking Street';
  if (addr.includes('soi 6') || addr.includes('soi6')) return 'Soi 6';
  if (addr.includes('soi buakhao') || addr.includes('buakhao')) return 'Soi Buakhao';
  if (addr.includes('pratamnak') || addr.includes('pratumnak')) return 'Pratamnak Hill';
  if (addr.includes('naklua') || addr.includes('na klua')) return 'Naklua';
  if (addr.includes('beach rd') || addr.includes('beach road')) return 'Beach Road';
  if (addr.includes('second rd') || addr.includes('2nd rd')) return 'Second Road';
  if (addr.includes('north pattaya') || addr.includes('pattaya nua')) return 'North Pattaya';
  if (addr.includes('south pattaya') || addr.includes('pattaya tai')) return 'South Pattaya';
  return 'Central Pattaya';
}

// ── Price range heuristic ──
function detectPriceRange(h) {
  const name = h.title.toLowerCase();
  const cat = (h.categoryName || '').toLowerCase();
  if (cat.includes('resort') || cat.includes('wellness')) return 'luxury';
  if (name.includes('hilton') || name.includes('marriott') || name.includes('hyatt') ||
      name.includes('sheraton') || name.includes('intercontinental') || name.includes('movenpick') ||
      name.includes('centara grand') || name.includes('royal cliff') || name.includes('amari') ||
      name.includes('dusit') || name.includes('pullman') || name.includes('melia') ||
      name.includes('hard rock') || name.includes('siam@siam') || name.includes('mytt') ||
      name.includes('cape dara') || name.includes('grande centre')) return 'luxury';
  if (name.includes('hostel') || name.includes('dormitory') || name.includes('backpack')) return 'budget';
  if (h.totalScore >= 4.5 && (cat.includes('resort') || name.includes('resort'))) return 'luxury';
  if (h.totalScore >= 4.0) return 'mid-range';
  return 'budget';
}

// ── Slug generation ──
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// ── Page copy ──
// Both live in scripts/lib/hotel-copy.mjs so imports and rewrites stay in sync.
// Do not inline template text here again: identical copy across pages is what
// made the previous batch of imports duplicates of one another.
function toCopyInput(h, area, priceRange, slug) {
  return {
    name: h.title,
    slug,
    area,
    street: h.street || '',
    category: h.categoryName || 'Hotel',
    priceRange,
    rating: h.totalScore,
    reviewsCount: h.reviewsCount || 0,
  };
}

// ── Generate markdown files ──
let created = 0;
let skipped = 0;

for (const h of hotels) {
  const slug = toSlug(h.title);
  const filePath = join(OUTPUT_DIR, `${slug}.md`);

  // Skip if file already exists (don't overwrite hand-written content)
  if (existsSync(filePath)) {
    skipped++;
    continue;
  }

  const area = detectArea(h);
  const priceRange = detectPriceRange(h);
  const copyInput = toCopyInput(h, area, priceRange, slug);
  const description = buildDescription(copyInput);
  const body = buildBody(copyInput);

  const frontmatter = [
    '---',
    `name: "${h.title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `rating: ${h.totalScore}`,
    `reviewsCount: ${h.reviewsCount || 0}`,
    `priceRange: "${priceRange}"`,
    `category: "${h.categoryName || 'Hotel'}"`,
    `area: "${area}"`,
    h.street ? `address: "${h.street.replace(/"/g, '\\"')}"` : null,
    h.phone ? `phone: "${h.phone}"` : null,
    h.website ? `website: "${h.website}"` : null,
    h.url ? `googleMapsUrl: "${h.url}"` : null,
    `amenities: []`,
    `publishDate: 2026-04-04`,
    `draft: false`,
    '---',
  ].filter(Boolean).join('\n');

  writeFileSync(filePath, `${frontmatter}\n\n${body}`);
  created++;
}

console.log(`Created: ${created} new hotel files`);
console.log(`Skipped: ${skipped} (already existed)`);
console.log(`Output: ${OUTPUT_DIR}`);
