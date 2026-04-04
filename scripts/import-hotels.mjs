#!/usr/bin/env node
/**
 * Import hotels from Apify Google Maps Scraper JSON into Astro content collections.
 * Usage: node scripts/import-hotels.mjs <path-to-json>
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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

// ── SEO description with Tomorrowland ──
function generateDescription(h, area, priceRange) {
  const rating = h.totalScore.toFixed(1);
  const reviews = h.reviewsCount || 0;
  const priceLabel = priceRange === 'luxury' ? 'luxury' : priceRange === 'mid-range' ? 'mid-range' : 'budget-friendly';

  // Areas near likely Tomorrowland venue
  const tomorrowlandAreas = ['Jomtien', 'Na Jomtien', 'Pratamnak Hill', 'South Pattaya'];
  const nearTomorrowland = tomorrowlandAreas.includes(area);

  let desc = `${h.title} is a ${priceLabel} ${(h.categoryName || 'hotel').toLowerCase()} in ${area}, Pattaya. Rated ${rating}/5 from ${reviews.toLocaleString()}+ Google reviews.`;

  if (nearTomorrowland) {
    desc += ` Great location for Tomorrowland Thailand 2026 in November.`;
  }

  // Truncate to ~155 chars for SEO
  if (desc.length > 160) {
    desc = desc.slice(0, 157) + '...';
  }

  return desc;
}

// ── Body content ──
function generateBody(h, area, priceRange) {
  const tomorrowlandAreas = ['Jomtien', 'Na Jomtien', 'Pratamnak Hill', 'South Pattaya'];
  const nearTomorrowland = tomorrowlandAreas.includes(area);

  let body = `## Overview\n\n`;
  body += `${h.title} is located in the ${area} area of Pattaya, one of Thailand's most popular coastal destinations. `;
  body += `With a ${h.totalScore.toFixed(1)}/5 rating from ${(h.reviewsCount || 0).toLocaleString()} Google reviews, `;
  body += `it's a solid ${priceRange} option for travelers visiting Pattaya in 2026.\n\n`;

  if (h.street) {
    body += `## Location\n\n`;
    body += `The hotel is situated at ${h.street}, ${area}. `;
    body += `This puts you within reach of Pattaya's main attractions, restaurants, and nightlife areas.\n\n`;
  }

  if (nearTomorrowland) {
    body += `## Tomorrowland Thailand 2026\n\n`;
    body += `${h.title} is well-positioned for the historic **Tomorrowland Thailand 2026** festival coming to Pattaya in November 2026. `;
    body += `The ${area} location offers convenient access to the expected festival grounds. Book early — hotels in this area will fill up fast for this landmark event.\n\n`;
  }

  body += `## Guest-Friendly\n\n`;
  body += `Most hotels in Pattaya are guest-friendly, meaning visitors are welcome without additional fees. `;
  body += `We recommend confirming the guest policy directly with ${h.title} before booking.\n\n`;

  body += `## How to Book\n\n`;
  body += `Check the latest rates and availability on popular booking platforms. Prices vary significantly by season — `;
  body += `the high season (November to February) typically commands premium rates, `;
  body += `while the low season (June to September) offers the best deals.\n`;

  return body;
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
  const description = generateDescription(h, area, priceRange);
  const body = generateBody(h, area, priceRange);

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
