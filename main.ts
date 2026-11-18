// main.ts — Node 22+ (type stripping), standard library only.
// Places the rendered entry.png into the make.fun output directory.
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const target = join(process.env.MAKEFUN_OUTPUT_DIR || '/output', 'entry.png');

if (!existsSync(source)) {
  console.error(`[main] entry.png is missing at ${source}; run gen.mjs first`);
  process.exit(1);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
console.log(`[main] ${source} -> ${target}`);
