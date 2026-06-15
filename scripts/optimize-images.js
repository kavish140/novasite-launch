import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToOptimize = [
  'hero-bg.jpg',
  'dashboard-preview.jpg'
];

async function optimize() {
  for (const img of imagesToOptimize) {
    const inputPath = path.resolve(__dirname, '../src/assets', img);
    const outputPath = path.resolve(__dirname, '../src/assets', img.replace('.jpg', '.webp'));
    
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`Optimized ${img} to WebP`);
    } catch (err) {
      console.error(`Error optimizing ${img}:`, err);
    }
  }
}

optimize();
