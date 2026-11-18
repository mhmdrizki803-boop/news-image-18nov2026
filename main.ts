// main.ts — the make.fun hand-in step for this entry.
// Runs on Node 22+ (native type stripping), standard library only: resolve this
// file's directory, hand its entry.png to the make.fun output directory. The
// output directory is $MAKEFUN_OUTPUT_DIR when set, otherwise /output. A missing
// source is a hard failure, so the submission script notices instead of shipping
// an empty directory.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] missing source image: ${source}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(source, target);

console.log(`[main] handed ${statSync(source).size} bytes to ${target}`);
