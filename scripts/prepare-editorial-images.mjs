import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root = process.cwd();
const mapping = JSON.parse(await fs.readFile('generated_images/article-image-manifest.json', 'utf8'));
const output = 'public/images/guides/editorial-2026';
await fs.mkdir(output, { recursive: true });
const entries = Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b));
const records = [];
for (const [slug, source] of entries) {
  const original = path.join('generated_images', source);
  for (const width of [400, 800, 1200, 1600]) {
    const suffix = width === 1600 ? '' : `-${width}w`;
    await sharp(original).resize(width, Math.round(width * 9 / 16), { fit: 'cover' }).webp({ quality: 84, effort: 5 }).toFile(`${output}/${slug}${suffix}.webp`);
  }
  const data = await fs.stat(`${output}/${slug}.webp`);
  records.push({slug, source: original, image: `/images/guides/editorial-2026/${slug}.webp`, width:1600,height:900,bytes:data.size,type:'AI-generated conceptual editorial illustration'});
}
await fs.writeFile(`${output}/manifest.json`, JSON.stringify(records,null,2)+'\n');
for(let page=0;page<2;page++){
  const composites=[];
  const subset=entries.slice(page*25,page*25+25);
  for(let i=0;i<subset.length;i++){
    const [slug]=subset[i]; const left=(i%5)*320, top=Math.floor(i/5)*210;
    composites.push({input:await sharp(`${output}/${slug}.webp`).resize(320,180).toBuffer(),left,top});
    const label=Buffer.from(`<svg width="320" height="30"><rect width="320" height="30" fill="white"/><text x="8" y="19" font-size="11" font-family="sans-serif" fill="black">${slug}</text></svg>`);
    composites.push({input:label,left,top:top+180});
  }
  await sharp({create:{width:1600,height:1050,channels:3,background:'white'}}).composite(composites).jpeg({quality:90}).toFile(`/tmp/pattaya-editorial-review-${page+1}.jpg`);
}
console.log(JSON.stringify({images:records.length,webpFiles:records.length*4,totalMainBytes:records.reduce((s,x)=>s+x.bytes,0),maxMainBytes:Math.max(...records.map(x=>x.bytes)),output:path.join(root,output)}));
