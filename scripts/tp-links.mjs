#!/usr/bin/env node
/**
 * Turn plain partner URLs into Travelpayouts affiliate links, once.
 *
 * These links are static, so they belong in the content rather than being
 * fetched at build time. Run this when adding a partner, paste the result into
 * the markdown, and the site keeps working even if the API is down.
 *
 * The token is read from .env (already gitignored) and never printed.
 *
 *   TRAVELPAYOUTS_TOKEN=xxxx          in .env
 *   node scripts/tp-links.mjs <url> [<url> ...]
 *
 * Optional: TRAVELPAYOUTS_API_URL to override the endpoint.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');

/* ── Token from .env, without pulling in a dependency ── */
function readToken() {
  if (process.env.TRAVELPAYOUTS_TOKEN) return process.env.TRAVELPAYOUTS_TOKEN.trim();
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return null;
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*TRAVELPAYOUTS_TOKEN\s*=\s*(.+?)\s*$/);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

const token = readToken();
if (!token) {
  console.error('No TRAVELPAYOUTS_TOKEN found.\n');
  console.error('Add this line to .env in the project root (the file is gitignored):');
  console.error('  TRAVELPAYOUTS_TOKEN=your-token-here');
  process.exit(1);
}

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error('Usage: node scripts/tp-links.mjs <url> [<url> ...]   (max 10 per run)');
  process.exit(1);
}
if (urls.length > 10) {
  console.error(`The API accepts at most 10 links per request — you passed ${urls.length}.`);
  process.exit(1);
}

const API = process.env.TRAVELPAYOUTS_API_URL || 'https://api.travelpayouts.com/links/v1/create';

const res = await fetch(API, {
  method: 'POST',
  headers: {
    'X-Access-Token': token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({ links: urls.map((u) => ({ url: u })) }),
});

const body = await res.text();

if (!res.ok) {
  console.error(`API returned ${res.status} ${res.statusText}`);
  console.error(body.slice(0, 600));
  console.error('\nIf this is a 404, the endpoint has moved — check the docs and rerun with');
  console.error('TRAVELPAYOUTS_API_URL=<correct endpoint> node scripts/tp-links.mjs ...');
  process.exit(1);
}

/* Print whatever came back next to the URL that produced it. */
let data;
try {
  data = JSON.parse(body);
} catch {
  console.log(body);
  process.exit(0);
}

console.log(JSON.stringify(data, null, 2));
