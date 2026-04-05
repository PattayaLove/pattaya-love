#!/usr/bin/env node
/**
 * Convert all JPG/PNG images in public/images/ to WebP.
 * Keeps originals and creates .webp alongside them.
 * Run: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_IMAGES = './public/images';
const QUALITY = 80;

async function walkDir(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function convert() {
  const allFiles = await walkDir(PUBLIC_IMAGES);
  const images = allFiles.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  let converted = 0;
  let skipped = 0;

  for (const img of images) {
    const webpPath = img.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    try {
      const info = await stat(webpPath).catch(() => null);
      if (info) { skipped++; continue; }

      await sharp(img).webp({ quality: QUALITY }).toFile(webpPath);
      const origSize = (await stat(img)).size;
      const webpSize = (await stat(webpPath)).size;
      const saved = Math.round((1 - webpSize / origSize) * 100);
      console.log(`${basename(img)} → ${basename(webpPath)} (${saved}% smaller)`);
      converted++;
    } catch (e) {
      console.error(`Failed: ${basename(img)}: ${e.message}`);
    }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped (already exist)`);
}

convert();
