// One-off image optimization. Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\//, '');
const formatKB = (b) => (b / 1024).toFixed(0) + ' KB';

async function task(name, fn) {
  const t = Date.now();
  await fn();
  console.log(`✓ ${name} (${Date.now() - t}ms)`);
}

// 1. Portrait (used in About — biggest visible)
await task('jason-portrait.jpg (640x800)', () =>
  sharp('images/bg_json.png')
    .resize(640, 800, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile('images/jason-portrait.jpg')
);

// 2. Avatar (nav + footer, small circle)
await task('jason-avatar.jpg (96x96)', () =>
  sharp('images/bg_json.png')
    .resize(96, 96, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile('images/jason-avatar.jpg')
);

// 2b. ShoptimizePro logo (480w max, palette PNG for transparency)
await task('shoptimize_logo.png (palette optimized)', () =>
  sharp('images/shoptimize_logo.png')
    .resize(480, null, { withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile('images/_opt_shoptimize_logo.png')
);

// 2c. Jason logo (192x192 PNG palette — nav, footer, favicon)
await task('jason_logo.png (palette optimized)', () =>
  sharp('images/jason_logo.png')
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile('images/_opt_jason_logo.png')
);

// 2d. Trust-badge images (small JPEGs for hero trust row)
await task('shopifypartners_icon.jpg (120x120)', () =>
  sharp('images/shopifypartners_icon.jpg')
    .resize(120, 120, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile('images/_opt_shopifypartners_icon.jpg')
);
await task('ph_flag.jpg (224x132)', () =>
  sharp('images/ph_flag.jpg')
    .resize(224, 132, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile('images/_opt_ph_flag.jpg')
);

// 3. Project screenshots — resize to 1280x800 max, re-encode
const websiteUsed = ['sb.jpg', 'nb.jpg', 'a1.jpg', 'anyt.jpg', 'ff.jpg', 'keeva.jpg'];
for (const file of websiteUsed) {
  await task(`website/${file}`, () =>
    sharp(`images/website/${file}`)
      .resize(1280, 800, { fit: 'cover' })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(`images/website/_opt_${file}`)
  );
}

// Print size report
console.log('\n--- Size report ---');
const files = [
  'images/bg_json.png',
  'images/jason-portrait.jpg',
  'images/jason-avatar.jpg',
  ...websiteUsed.map(f => `images/website/${f}`),
  ...websiteUsed.map(f => `images/website/_opt_${f}`),
];
for (const f of files) {
  try {
    const s = await stat(f);
    console.log(`  ${f.padEnd(40)} ${formatKB(s.size)}`);
  } catch {}
}
