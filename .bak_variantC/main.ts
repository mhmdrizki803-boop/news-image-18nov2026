// main.ts — the make.fun hand-in step for this entry (Node 22+, stdlib only).
//
// This is the COLLAGE edition of the 18 November 2026 front page. The build is:
//   node gen.mjs            -> writes page.html from news.json
//   chrome --headless=new … -> screenshot page.html to a 1024x1024 entry.png
//   node main.ts            -> copy entry.png into the make.fun output directory
//
// The output directory is $MAKEFUN_OUTPUT_DIR when set, otherwise /output.
// A missing source is a hard failure, so the submitter notices instead of
// shipping an empty directory.
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] missing source image: ${source}`);
  console.error('[main] run gen.mjs and the headless-chrome screenshot first.');
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
mkdirSync(outDir, { recursive: true });

const target = join(outDir, 'entry.png');
copyFileSync(source, target);

console.log(`[main] handed ${statSync(source).size} bytes to ${target}`);
