// render.mjs — screenshot page.html to entry.png at exactly 1024x1024 via Playwright.
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const PW = '/home/ubuntu/gleam-scan/node_modules/.pnpm/playwright@1.65.0/node_modules/playwright/index.js';
const require = createRequire(PW);
const { chromium } = require(PW);
const EXEC = '/home/ubuntu/.cache/ms-playwright/chromium-1140/chrome-linux/chrome';

const target = process.argv[2] || 'entry.png';

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
await page.goto('file://' + join(here, 'page.html'), { waitUntil: 'load' });
await page.waitForTimeout(200);
const diag = await page.evaluate(() => window.__diag());
console.log('DIAG', JSON.stringify(diag));
const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1024, height: 1024 } });
writeFileSync(join(here, target), buf);
console.log('wrote', target, buf.length, 'bytes');
await browser.close();
