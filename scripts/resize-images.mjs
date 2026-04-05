#!/usr/bin/env node
/**
 * Create responsive image sizes for all WebP images in public/images/
 * Creates: original, 1200w, 800w, 400w versions
 * Run: node scripts/resize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const PUBLIC_IMAGES = './public/images';
const SIZES = [400, 800, 1200];
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

async function resize() {
  const allFiles = await walkDir(PUBLIC_IMAGES);
  const images = allFiles.filter(f => f.endsWith('.webp'));

  let created = 0;

  for (const img of images) {
    try {
      const meta = await sharp(img).metadata();
      const name = basename(img, '.webp');
      const dir = dirname(img);

      for (const width of SIZES) {
        if (meta.width && meta.width > width) {
          const outPath = join(dir, `${name}-${width}w.webp`);
          const exists = await stat(outPath).catch(() => null);
          if (exists) continue;

          await sharp(img)
            .resize(width)
            .webp({ quality: QUALITY })
            .toFile(outPath);

          const newSize = (await stat(outPath)).size;
          console.log(`${basename(img)} → ${width}w (${Math.round(newSize/1024)}KB)`);
          created++;
        }
      }

      // Also optimize the original if it's wider than 1920
      if (meta.width && meta.width > 1920) {
        const optimized = await sharp(img)
          .resize(1920)
          .webp({ quality: QUALITY })
          .toBuffer();

        const origSize = (await stat(img)).size;
        if (optimized.length < origSize * 0.9) {
          const { writeFile } = await import('fs/promises');
          await writeFile(img, optimized);
          console.log(`${basename(img)} resized to 1920w (was ${meta.width}w, saved ${Math.round((1 - optimized.length/origSize) * 100)}%)`);
        }
      }
    } catch (e) {
      console.error(`Failed: ${basename(img)}: ${e.message}`);
    }
  }

  console.log(`\nCreated ${created} responsive variants`);
}

resize();
