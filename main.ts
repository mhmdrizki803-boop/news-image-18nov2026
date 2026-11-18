// main.ts — VARIANT B handoff. Hands this entry.png to make.fun's output directory.
// Node 22+ type stripping; standard library only. Before copying it re-reads the
// PNG header and refuses anything that is not exactly 1024x1024 or over 1 MiB.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] entry.png not found at ${source}; run gen.mjs first`);
  process.exit(1);
}

const bytes = statSync(source).size;
const head = readFileSync(source);
const isPng = head.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
const width = isPng ? head.readUInt32BE(16) : 0;
const height = isPng ? head.readUInt32BE(20) : 0;

const faults: string[] = [];
if (!isPng) faults.push('not a PNG (bad signature)');
if (width !== 1024 || height !== 1024) faults.push(`pixels ${width}x${height}, want 1024x1024`);
if (bytes > 1048576) faults.push(`bytes ${bytes} over 1048576`);
if (faults.length) {
  console.error('[main] entry rejected:', faults.join('; '));
  process.exit(1);
}

const targetDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const target = join(targetDir, 'entry.png');
mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
console.log(`[main] entry.png ${width}x${height}, ${bytes} bytes -> ${target}`);
