// main.ts — the make.fun hand-in step for VARIANT D of this entry.
// Runs on Node 22+ (native type stripping), standard library only. It resolves
// this file's directory, sanity-checks that entry.png is a real PNG of the
// expected 1024x1024 size, then hands it to the make.fun output directory
// ($MAKEFUN_OUTPUT_DIR, else /output). Any problem is a hard failure so the
// submission script notices instead of shipping an empty or wrong-size directory.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] missing source image: ${source}`);
  process.exit(1);
}

// PNG magic + IHDR width/height (big-endian at bytes 16..24).
const buf = readFileSync(source);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!buf.subarray(0, 8).equals(PNG_MAGIC)) {
  console.error('[main] entry.png is not a PNG');
  process.exit(1);
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  console.error(`[main] expected 1024x1024, got ${width}x${height}`);
  process.exit(1);
}
if (buf.length > 1048576) {
  console.error(`[main] entry.png is ${buf.length} bytes, over the 1 MiB cap`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(source, target);

console.log(`[main] handed ${width}x${height}, ${statSync(source).size} bytes to ${target}`);
