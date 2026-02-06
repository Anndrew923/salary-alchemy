/**
 * 產生 1024×1024 純黑 PNG，作為 Android 適應性圖示背景層。
 * 輸出：assets/icon-background.png
 */
import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outPath = join(root, 'assets', 'icon-background.png');

const SIZE = 1024;
// 最小合法 PNG（1x1 黑像素）的 binary，再以 raw 填滿 1024x1024 會過大，故用 sharp 產生
const sharp = await import('sharp').catch(() => null);
if (!sharp?.default) {
  console.error('請先安裝 sharp：npm install -D sharp');
  process.exit(1);
}

await sharp
  .default({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  })
  .png()
  .toFile(outPath);

console.log('已產生純黑背景圖：', outPath);
