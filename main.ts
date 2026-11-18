// main.ts — hands the rendered entry.png to make.fun's output directory.
// Node 22+ (type stripping), standard library only.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const targetDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const target = join(targetDir, 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] entry.png missing at ${source}; run gen.mjs first`);
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[main] copied ${source} -> ${target}`);
