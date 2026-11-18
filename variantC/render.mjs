// render.mjs — VARIANT C: screenshot this dir's page.html to a 1024x1024 PNG
// with the local Chromium build. Reads window.__diag() before shooting so layout
// faults surface as text, not as a silently clipped picture.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PLAYWRIGHT = '/home/ubuntu/gleam-scan/node_modules/.pnpm/playwright@1.65.0/node_modules/playwright/index.js';
const CHROME = '/home/ubuntu/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';
const SIZE = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const outFile = process.argv[2] || 'entry.png';

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
