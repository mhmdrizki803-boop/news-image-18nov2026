// render.mjs — VARIANT D: screenshot this dir's page.html with the local Chromium.
// Default: a 1024x1024 PNG (entry.png). With PREVIEW=300 it shoots a 300x300 PNG
// so we can look at the page exactly as the judge will: a 1024px page at 300px.
// window.__diag() is read first, so layout faults surface as text, not as a silently
// clipped picture.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PLAYWRIGHT = '/home/ubuntu/gleam-scan/node_modules/.pnpm/playwright@1.65.0/node_modules/playwright/index.js';
const CHROME = '/home/ubuntu/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';

const preview = process.env.PREVIEW ? Number(process.env.PREVIEW) : 0;
const SIZE = preview || 1024;

const here = dirname(fileURLToPath(import.meta.url));
const outFile = process.argv[2] || (preview ? `preview-${SIZE}.png` : 'entry.png');

const require = createRequire(PLAYWRIGHT);
const { chromium } = require(PLAYWRIGHT);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ['--no-sandbox', '--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: 1 });
  await page.goto('file://' + join(here, 'page.html'), { waitUntil: 'load' });
  await page.waitForTimeout(150);
  const diag = await page.evaluate(() => window.__diag());
  console.log('diag', JSON.stringify(diag));
  const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: SIZE, height: SIZE } });
  writeFileSync(join(here, outFile), png);
  console.log('wrote', outFile, png.length, 'bytes');
} finally {
  await browser.close();
}
