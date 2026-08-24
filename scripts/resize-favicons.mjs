/**
 * scripts/resize-favicons.mjs
 * One-off script to resize the oversized favicon PNGs in public/.
 * Run with: node scripts/resize-favicons.mjs
 *
 * All four favicon PNGs were 186 KB each (same unresized source).
 * After running this, each will be the correct size & compressed.
 */

import sharp from "sharp";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../public");

const targets = [
  { file: "favicon-16x16.png", size: 16 },
  { file: "favicon-32x32.png", size: 32 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "logo-icon.png", size: 32 },
];

// Use apple-touch-icon as the source (it's a copy of the same 186 KB PNG).
// Any of the four will work — they're all the same image.
const sourcePath = path.join(publicDir, "apple-touch-icon.png");
const sourceBuffer = readFileSync(sourcePath);

console.log("🔧 Resizing favicon PNGs...\n");

for (const { file, size } of targets) {
  const outPath = path.join(publicDir, file);
  const beforeSize = readFileSync(outPath).length;

  await sharp(sourceBuffer)
    .resize(size, size, { fit: "cover", position: "center" })
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile(outPath);

  const afterSize = readFileSync(outPath).length;
  const saving = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(0);
  console.log(
    `  ✅ ${file.padEnd(24)} ${(beforeSize / 1024).toFixed(1)} KB → ${(afterSize / 1024).toFixed(1)} KB  (${saving}% smaller)`
  );
}

console.log("\n✨ Done. Deploy to apply savings.");
