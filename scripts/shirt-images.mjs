// Renders the web images for /shirts/ from the print vectors in
// designs/las-vaginas/production-v4/ (local working files, not in the repo).
//
//   node scripts/shirt-images.mjs
//
// Output in src/assets/images/shirts/:
//   motif-<slug>.png  1200 px wide, transparent: the product preview
//   thumb-<slug>.png   300 px wide, palette PNG: the design picker tiles.
//                      Vercel's image service cannot go below 640 px, so the
//                      tiles use these files directly.
//
// Classic Vegas is shown on a white shirt, so it uses the white-shirt variant
// with the dark wordmark (run white-shirt.mjs in the design folder first).
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const SRC = new URL('../designs/las-vaginas/production-v4/', import.meta.url);
const OUT = new URL('../src/assets/images/shirts/', import.meta.url);

const motifs = {
  'classic-vegas': '01-classic-vegas-white-shirt',
  'neon-club': '02-neon-club',
  'desert-gold': '03-desert-gold',
};

async function render(svg, width) {
  const meta = await sharp(svg).metadata();
  return sharp(svg, { density: (72 * width) / meta.width }).resize(width);
}

for (const [slug, file] of Object.entries(motifs)) {
  const svg = await readFile(new URL(`${file}.svg`, SRC));

  const motif = await (await render(svg, 1200))
    .png({ compressionLevel: 9 })
    .toFile(new URL(`motif-${slug}.png`, OUT).pathname);

  const thumb = await (await render(svg, 300))
    .png({ palette: true, colours: 48, compressionLevel: 9 })
    .toFile(new URL(`thumb-${slug}.png`, OUT).pathname);

  console.log(
    `${slug}: motif ${motif.width}x${motif.height} ${Math.round(motif.size / 1024)} KB, ` +
      `thumb ${thumb.width}x${thumb.height} ${Math.round(thumb.size / 1024)} KB`,
  );
}
