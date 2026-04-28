#!/usr/bin/env node
/**
 * Resize + convert referenced public/ images to WebP.
 *
 * Each SPEC entry: { src, maxWidth, quality, out? }
 *   - src:      filename under public/
 *   - maxWidth: resize cap (never upscales)
 *   - quality:  1-100 for webp encoder
 *   - out:      optional override for output filename (default: <base>.webp)
 *
 * After run: public/<name>.webp exists. Caller must update code to reference it
 * and delete originals as desired.
 */
import fs from "fs";
import path from "path";
import url from "url";
import sharp from "sharp";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "public");

const SPECS = [
  { src: "logo.png",           maxWidth: 400,  quality: 92 },
  { src: "hero-new-1.jpg",     maxWidth: 1600, quality: 82 },
  { src: "hero-new-2.jpg",     maxWidth: 1600, quality: 82 },
  { src: "hero-1.png",         maxWidth: 800,  quality: 80 },
  { src: "hero-2.png",         maxWidth: 800,  quality: 80 },
  { src: "hero-3.png",         maxWidth: 400,  quality: 80 },
  { src: "Rice Bowls.avif",    maxWidth: 400,  quality: 80, out: "rice-bowls-cat.webp" },
  { src: "rice bown-2.jpg",    maxWidth: 800,  quality: 80, out: "rice-bowl-fav.webp" },
  { src: "sandwich-1.jpg",     maxWidth: 400,  quality: 80 },
  { src: "spaghetti.jpg",      maxWidth: 400,  quality: 80 },
  { src: "drink-2.jpg",        maxWidth: 400,  quality: 80 },
  { src: "snack-1.jpg",        maxWidth: 800,  quality: 80 },
  { src: "catering-2.png",     maxWidth: 1200, quality: 82 },
  { src: "DSC06408.jpg",       maxWidth: 800,  quality: 80 },
  { src: "promo-1.png",        maxWidth: 1200, quality: 82 },
  { src: "store-front-1.avif", maxWidth: 800,  quality: 80 },
  { src: "Chicken-1.avif",     maxWidth: 800,  quality: 80, out: "chicken-1.webp" },
];

const log = (...a) => console.log("[optimize]", ...a);

const convert = async ({ src, maxWidth, quality, out }) => {
  const srcPath = path.join(PUBLIC_DIR, src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  SKIP: ${src} (not found)`);
    return;
  }
  const baseName = out || `${path.basename(src, path.extname(src))}.webp`;
  const outPath = path.join(PUBLIC_DIR, baseName);
  const before = fs.statSync(srcPath).size;

  await sharp(srcPath)
    .resize({ width: maxWidth, withoutEnlargement: true, fit: "inside" })
    .webp({ quality })
    .toFile(outPath);

  const after = fs.statSync(outPath).size;
  const saved = ((1 - after / before) * 100).toFixed(0);
  const fmt = (n) => (n / 1024 >= 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${(n / 1024).toFixed(0)}KB`);
  log(`${src.padEnd(22)} → ${baseName.padEnd(22)}  ${fmt(before)} → ${fmt(after)}  (-${saved}%)`);
};

const generateFavicons = async () => {
  const logo = path.join(PUBLIC_DIR, "logo.png");
  if (!fs.existsSync(logo)) {
    console.warn("  SKIP favicons: logo.png not found");
    return;
  }
  const variants = [
    { name: "favicon-16.png", size: 16 },
    { name: "favicon-32.png", size: 32 },
    { name: "apple-touch-icon.png", size: 180 },
  ];
  for (const v of variants) {
    const out = path.join(PUBLIC_DIR, v.name);
    await sharp(logo)
      .resize({ width: v.size, height: v.size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(out);
    const size = fs.statSync(out).size;
    log(`favicon ${v.name.padEnd(22)}  ${v.size}x${v.size}  ${(size / 1024).toFixed(1)}KB`);
  }
};

const main = async () => {
  if (!fs.existsSync(PUBLIC_DIR)) throw new Error(`public/ not found at ${PUBLIC_DIR}`);
  for (const spec of SPECS) {
    await convert(spec);
  }
  await generateFavicons();
  log("✅ Done");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
