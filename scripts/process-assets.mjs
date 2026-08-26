// One-off asset pipeline for Fase 1.
//
// The dog photos and icons in Downloads\perross were exported from WhatsApp,
// which flattened their original transparency to a solid black background.
// This script removes that black background (flood-fill from the image
// edges, so it never eats into dark pixels that are surrounded by other
// colors, like eyes or a black bulldog's fur), crops to content, and writes
// clean PNGs with real alpha into public/images/. It also copies the
// already-composited banners as-is and the two full mockups into
// docs/design-reference (not served by the app).
//
// Run once with: node scripts/process-assets.mjs

import { Jimp } from "jimp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = "C:\\Users\\arlen\\Downloads\\perross";
const IMAGES_OUT = path.join(ROOT, "public", "images");
const REFERENCE_OUT = path.join(ROOT, "docs", "design-reference");

const SEED_LUMINANCE = 60; // border pixels darker than this can start the flood fill
const STEP_TOLERANCE = 45; // max color distance between adjacent pixels for the flood to keep spreading
const ABSOLUTE_LUMINANCE_CAP = 110; // flood never spreads onto a pixel brighter than this, regardless of step distance
const EDGE_THRESHOLD = 70; // pixels touching removed background get their alpha feathered if darker than this
const CROP_PADDING = 6;

/** @type {{src: string, out: string, tolerance?: number}[]} */
const CUTOUTS = [
  { src: "WhatsApp Image 2026-08-25 at 23.19.31 (2).jpeg", out: "dogs/hero-golden-retriever.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.31 (3).jpeg", out: "dogs/hero-doodle-cream.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.32.jpeg", out: "dogs/golden-retriever-lying.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.31 (1).jpeg", out: "dogs/golden-retriever-puppy-ball.png", tolerance: 30 },
  { src: "WhatsApp Image 2026-08-25 at 23.19.31.jpeg", out: "dogs/doodle-hoodie-yellow.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.32 (1).jpeg", out: "dogs/corgi-bowl-blue.png" },
  // Black & white bulldog: its dark fur is close in color to the removed
  // background, so it needs a much tighter tolerance to avoid eating the fur.
  { src: "WhatsApp Image 2026-08-25 at 23.19.32 (3).jpeg", out: "dogs/bulldog-sunglasses.png", tolerance: 14 },
  { src: "WhatsApp Image 2026-08-25 at 23.19.30 (3).jpeg", out: "dogs/corgi-bandana-yellow.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.30 (2).jpeg", out: "dogs/golden-puppy-sleeping-bed.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.33 (1).jpeg", out: "dogs/bulldog-peeking.png", tolerance: 14 },
  { src: "WhatsApp Image 2026-08-25 at 23.19.33 (3).jpeg", out: "icons/icon-shipping.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.32 (2).jpeg", out: "icons/icon-secure.png" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.33 (2).jpeg", out: "icons/icon-love.png" },
  // Flat brand icons with their own dark elements (TikTok's black badge,
  // Visa/Mastercard's dark strokes) sitting right on the removed
  // background need a tight tolerance too, for the same reason.
  { src: "WhatsApp Image 2026-08-25 at 23.19.55.jpeg", out: "icons/social-strip.png", tolerance: 12 },
  { src: "WhatsApp Image 2026-08-25 at 23.19.58.jpeg", out: "icons/payment-strip.png", tolerance: 12 },
  { src: "WhatsApp Image 2026-08-25 at 23.19.34 (3).jpeg", out: "brand/logo-mark.png" },
];

/** @type {{src: string, out: string}[]} */
const COPY_ONLY = [
  { src: "WhatsApp Image 2026-08-25 at 23.19.34 (2).jpeg", out: "banners/promo-todo-consentir.jpg" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.34.jpeg", out: "banners/promo-lo-mejor-para-ellos.jpg" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.34 (1).jpeg", out: "banners/promo-envio-gratis.jpg" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.35.jpeg", out: "banners/promo-hacelos-felices.jpg" },
];

/** @type {{src: string, out: string}[]} */
const REFERENCE_ONLY = [
  { src: "WhatsApp Image 2026-08-25 at 23.19.30.jpeg", out: "mockup-mobile.jpg" },
  { src: "WhatsApp Image 2026-08-25 at 23.19.30 (1).jpeg", out: "mockup-desktop.jpg" },
];

function luminance(r, g, b) {
  return (r + g + b) / 3;
}

function colorDist(idxA, idxB, data) {
  const a = idxA * 4;
  const b = idxB * 4;
  return (
    Math.abs(data[a] - data[b]) +
    Math.abs(data[a + 1] - data[b + 1]) +
    Math.abs(data[a + 2] - data[b + 2])
  );
}

// Chain-tolerance flood fill (like a "magic wand" with contiguous tolerance):
// a pixel joins the background region if it's close enough in color to the
// neighboring pixel that's already in the region. This lets it spread through
// JPEG noise/gradients in a flat black backdrop while still stopping hard at
// the actual subject edge, where the color jump is large.
function removeBlackBackground(image, stepTolerance = STEP_TOLERANCE) {
  const { width, height, data } = image.bitmap;
  const size = width * height;
  const visited = new Uint8Array(size);
  const queue = new Int32Array(size);
  let queueLength = 0;

  const trySeed = (x, y) => {
    const idx = y * width + x;
    if (visited[idx]) return;
    const p = idx * 4;
    if (luminance(data[p], data[p + 1], data[p + 2]) < SEED_LUMINANCE) {
      visited[idx] = 1;
      queue[queueLength++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  let head = 0;
  while (head < queueLength) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
        const nIdx = ny * width + nx;
        if (visited[nIdx]) continue;
        const p = nIdx * 4;
        if (luminance(data[p], data[p + 1], data[p + 2]) > ABSOLUTE_LUMINANCE_CAP) continue;
        if (colorDist(idx, nIdx, data) > stepTolerance) continue;
        visited[nIdx] = 1;
        queue[queueLength++] = nIdx;
      }
    }
  }

  for (let idx = 0; idx < size; idx++) {
    const p = idx * 4;
    if (visited[idx]) {
      data[p + 3] = 0;
      continue;
    }
    const x = idx % width;
    const y = (idx - x) / width;
    let touchesBg = false;
    if (x > 0 && visited[idx - 1]) touchesBg = true;
    if (!touchesBg && x < width - 1 && visited[idx + 1]) touchesBg = true;
    if (!touchesBg && y > 0 && visited[idx - width]) touchesBg = true;
    if (!touchesBg && y < height - 1 && visited[idx + width]) touchesBg = true;
    if (touchesBg) {
      const lum = (data[p] + data[p + 1] + data[p + 2]) / 3;
      if (lum < EDGE_THRESHOLD) {
        const alpha = Math.round((lum / EDGE_THRESHOLD) * 255);
        data[p + 3] = Math.min(data[p + 3], alpha);
      }
    }
  }

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return image;

  const cx = Math.max(0, minX - CROP_PADDING);
  const cy = Math.max(0, minY - CROP_PADDING);
  const cw = Math.min(width, maxX + CROP_PADDING) - cx;
  const ch = Math.min(height, maxY + CROP_PADDING) - cy;
  image.crop({ x: cx, y: cy, w: cw, h: ch });
  return image;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  console.log("Processing cutouts (background removal)...");
  for (const job of CUTOUTS) {
    const srcPath = path.join(SRC_DIR, job.src);
    const outPath = path.join(IMAGES_OUT, job.out);
    const image = await Jimp.read(srcPath);
    removeBlackBackground(image, job.tolerance ?? STEP_TOLERANCE);
    await ensureDir(outPath);
    await image.write(/** @type {`${string}.png`} */ (outPath));
    console.log(`  ${job.src} -> public/images/${job.out}`);
  }

  console.log("Copying ready-made banners...");
  for (const job of COPY_ONLY) {
    const srcPath = path.join(SRC_DIR, job.src);
    const outPath = path.join(IMAGES_OUT, job.out);
    await ensureDir(outPath);
    await fs.copyFile(srcPath, outPath);
    console.log(`  ${job.src} -> public/images/${job.out}`);
  }

  console.log("Copying design-reference mockups (not served by the app)...");
  for (const job of REFERENCE_ONLY) {
    const srcPath = path.join(SRC_DIR, job.src);
    const outPath = path.join(REFERENCE_OUT, job.out);
    await ensureDir(outPath);
    await fs.copyFile(srcPath, outPath);
    console.log(`  ${job.src} -> docs/design-reference/${job.out}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
