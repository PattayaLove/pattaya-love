import fs from 'node:fs/promises';
import sharp from 'sharp';
const mapping=JSON.parse(await fs.readFile('generated_images/homepage-image-manifest.json','utf8'));
const output='public/images/homepage/editorial-2026';
await fs.mkdir(output,{recursive:true});
const records=[];
for(const [slug,source] of Object.entries(mapping)){
 const input=`generated_images/${source}`;
 const meta=await sharp(input).metadata();
 const mainWidth=Math.min(meta.width,slug==='hero-pattaya-bay'?1920:1600);
 const widths=[...new Set((slug.startsWith("trending-")?[200,400,800,1200]:[400,800,1200]).filter(w=>w<mainWidth).concat(mainWidth))];
 for(const width of widths){
  const name=`${slug}${width===mainWidth?'':`-${width}w`}.webp`;
  await sharp(input).resize({width,withoutEnlargement:true}).webp({quality:85,effort:5}).toFile(`${output}/${name}`);
  const result=await sharp(`${output}/${name}`).metadata();
  if(result.width!==width)throw new Error(name);
 }
 records.push({slug,source:input,image:`/images/homepage/editorial-2026/${slug}.webp`,width:mainWidth,height:Math.round(meta.height*mainWidth/meta.width),widths,bytes:(await fs.stat(`${output}/${slug}.webp`)).size,type:'AI-generated or AI-edited editorial image'});
}
await fs.writeFile(`${output}/manifest.json`,JSON.stringify(records,null,2));
const composites=[];
for(let i=0;i<records.length;i++){
 const r=records[i];const left=(i%5)*320,top=Math.floor(i/5)*270;
 composites.push({input:await sharp(`.${r.image.replace('/images/','/public/images/')}`).resize(320,240,{fit:'contain',background:'#eef0f3'}).toBuffer(),left,top});
 const label=Buffer.from(`<svg width="320" height="30"><rect width="320" height="30" fill="white"/><text x="8" y="19" font-size="12" font-family="sans-serif">${r.slug}</text></svg>`);
 composites.push({input:label,left,top:top+240});
}
await sharp({create:{width:1600,height:Math.ceil(records.length/5)*270,channels:3,background:'white'}}).composite(composites).jpeg({quality:90}).toFile('/tmp/pattaya-homepage-review.jpg');
console.log(JSON.stringify({images:records.length,files:records.reduce((s,r)=>s+r.widths.length,0),mainBytes:records.reduce((s,r)=>s+r.bytes,0)}));
