// gen.mjs — build page.html (1024x1024 broadsheet front page) from news.json
// One lead block + a dotted world map + THREE dense columns of short briefs.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(here, 'news.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const lead = news[0];
const briefs = news.slice(1);

// three balanced columns (~11 / ~10 / ~10)
const COLS = 3;
const n = briefs.length;
const base = Math.floor(n / COLS);
const rem = n % COLS;
let idx = 0;
const cols = [];
for (let i = 0; i < COLS; i++) {
  const size = base + (i < rem ? 1 : 0);
  cols.push(briefs.slice(idx, idx + size));
  idx += size;
}

const renderItem = (it) => `      <p class="item">
        <span class="r1"><span class="k">${esc(it.kicker)}</span><span class="rg">${esc(it.region)}</span></span>
        <span class="t">${esc(it.title)} <span class="s">${esc(it.source)}</span></span>
      </p>`;

const columnHtml = cols
  .map((c, i) => `    <div class="col" data-col="${i + 1}">\n${c.map(renderItem).join('\n')}\n    </div>`)
  .join('\n');

// six region markers on a schematic dotted world outline
const markers = [
  [78, 58, 'Americas', 1],
  [183, 45, 'Europe', 1],
  [180, 102, 'Africa', 1],
  [207, 81, 'Middle East', 1],
  [258, 50, 'Asia', 1],
  [287, 122, 'Oceania', -1],
];
const markerHtml = markers
  .map(([x, y, label, side]) => `
        <circle cx="${x}" cy="${y}" r="4" class="dot"/>
        <text x="${x + 6.5 * side}" y="${y + 3.5}" class="dotlbl" text-anchor="${side > 0 ? 'start' : 'end'}">${label}</text>`)
  .join('');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>THE WORLD TODAY — Wednesday 18 November 2026</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1024px; height: 1024px; }
  body {
    background: #f4f0e6;
    color: #17150f;
    font-family: Georgia, 'Times New Roman', 'DejaVu Serif', serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 12px 18px 12px;
  }
  /* ---------- masthead ---------- */
  .masthead { flex: 0 0 auto; border-bottom: 3px double #17150f; padding-bottom: 5px; }
  .brand {
    text-align: center;
    font-family: 'DejaVu Serif', Georgia, serif;
    font-weight: 700;
    font-size: 36px;
    line-height: 1.0;
    letter-spacing: 6px;
  }
  .date {
    text-align: center;
    font-family: 'DejaVu Serif', Georgia, serif;
    font-weight: 700;
    font-size: 49px;
    line-height: 1.06;
    letter-spacing: 0.5px;
    white-space: nowrap;
    margin-top: 1px;
  }
  .strap {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 14px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: #3a352b;
    border-top: 1px solid #b9b2a2;
    padding-top: 4px;
    margin-top: 5px;
  }
  .strap .accent { color: #b3261e; font-weight: 700; }

  /* ---------- top: lead + map ---------- */
  .top { flex: 0 0 auto; display: flex; gap: 18px; height: 258px; padding: 10px 0; border-bottom: 2px solid #17150f; }
  .lead { flex: 1 1 auto; overflow: hidden; }
  .lead .lk {
    display: inline-block;
    background: #b3261e;
    color: #fff;
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 9px;
    margin-bottom: 8px;
  }
  .lead h1 { font-size: 36px; line-height: 1.05; letter-spacing: -0.4px; margin-bottom: 8px; }
  .lead .standfirst { font-size: 16px; line-height: 1.32; color: #3a352b; font-style: italic; }

  .mapbox { flex: 0 0 372px; border-left: 1px solid #b9b2a2; padding-left: 16px; display: flex; flex-direction: column; }
  .mapcap {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    color: #b3261e;
    margin-bottom: 5px;
  }
  .mapbox svg { width: 356px; height: 196px; background: #eae4d5; border: 1px solid #cfc7b5; }
  .land { fill: #cfd6c9; stroke: #6b7566; stroke-width: 1; stroke-dasharray: 2.4 2.4; stroke-linejoin: round; }
  .dot { fill: #b3261e; stroke: #fff; stroke-width: 1.3; }
  .dotlbl {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    fill: #1c2b21;
    paint-order: stroke;
    stroke: #eae4d5;
    stroke-width: 3px;
    stroke-linejoin: round;
  }

  /* ---------- briefs: three dense columns ---------- */
  .columns { flex: 1 1 auto; display: flex; gap: 14px; padding-top: 8px; min-height: 0; overflow: hidden; }
  .col { flex: 1 1 0; min-width: 0; border-right: 1px solid #b9b2a2; padding-right: 12px; }
  .col:last-child { border-right: none; padding-right: 0; }
  .item { padding-bottom: 4px; margin-bottom: 4px; border-bottom: 1px dotted #c3bba8; }
  .item:last-child { border-bottom: none; }
  .item .r1 { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
  .item .k {
    color: #b3261e;
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }
  .item .rg {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #6b6455;
    white-space: nowrap;
    padding-left: 6px;
  }
  .item .t { display: block; font-size: 13.5px; line-height: 1.17; font-weight: 600; }
  .item .s {
    font-family: 'DejaVu Sans', Arial, sans-serif;
    font-size: 10.5px;
    font-weight: 400;
    color: #6b6455;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  #diag { display: none; }
</style>
</head>
<body>
  <header class="masthead">
    <div class="brand">THE WORLD TODAY</div>
    <div class="date">WEDNESDAY 18 NOVEMBER 2026</div>
    <div class="strap">
      <span class="accent">${news.length} stories &middot; six continents</span>
      <span>independent world edition</span>
    </div>
  </header>

  <section class="top">
    <div class="lead">
      <span class="lk">${esc(lead.kicker)}</span>
      <h1>${esc(lead.title)}</h1>
      <p class="standfirst">${esc(lead.standfirst)}</p>
    </div>
    <div class="mapbox">
      <div class="mapcap">World &middot; stories by region</div>
      <svg viewBox="0 0 330 180" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Dotted world map with a marker for each region covered">
        <path class="land" d="M11,25 L36.7,20 L77.9,18 L96.3,30 L114.6,40 L105.4,45 L91.7,65 L76.1,74 L68.8,70 L50.4,50 L45.8,35 Z"/>
        <path class="land" d="M123.8,30 L146.7,20 L142,8 L110,8 L111.8,22 Z"/>
        <path class="land" d="M91.7,80 L110,80 L132.9,95 L130.2,112 L114.6,125 L100.8,145 L96.3,135 L99,110 L91.7,90 Z"/>
        <path class="land" d="M155.8,54 L165,46 L174.2,45 L190.7,45 L201.7,42 L192.5,30 L190.7,20 L174.2,32 L165,40 Z"/>
        <path class="land" d="M201.7,42 L220,35 L247.5,35 L275,40 L293.3,40 L295,45 L288.8,70 L275,80 L261.3,80 L256.7,90 L238.3,82 L220,65 L206.3,78 L197,58 Z"/>
        <path class="land" d="M149.4,75 L150.3,85 L173.3,86 L174.2,92 L176,108 L183.3,125 L194.3,120 L204.5,102 L211.8,78 L197,58 L174.2,53 L159.5,54 Z"/>
        <path class="land" d="M268.6,112 L284.2,102 L295,101 L305.1,118 L298.6,128 L284.2,122 L270.4,124 Z"/>${markerHtml}
      </svg>
    </div>
  </section>

  <section class="columns">
${columnHtml}
  </section>

  <div id="diag"></div>
  <script>
    window.__diag = function () {
      var d = document.getElementById('diag');
      var out = { bodyScroll: document.body.scrollHeight, cols: [] };
      document.querySelectorAll('.col').forEach(function (c) {
        out.cols.push({ i: c.dataset.col, scroll: c.scrollHeight, client: c.clientHeight, items: c.querySelectorAll('.item').length });
      });
      var date = document.querySelector('.date');
      var rng = document.createRange(); rng.selectNodeContents(date);
      out.date = { textW: Math.round(rng.getBoundingClientRect().width), availW: 988, scrollW: date.scrollWidth, fontSize: getComputedStyle(date).fontSize };
      out.columnsBox = Math.round(document.querySelector('.columns').getBoundingClientRect().height);
      var last = document.querySelectorAll('.col')[2].querySelector('.item:last-child');
      out.lastItemBottom = Math.round(last.getBoundingClientRect().bottom);
      out.bodyBottom = 1024;
      d.textContent = JSON.stringify(out);
      return out;
    };
  </script>
</body>
</html>
`;

writeFileSync(join(here, 'page.html'), html);
console.log('wrote page.html', html.length, 'bytes;', news.length, 'stories;', briefs.length, 'briefs in', COLS, 'cols of', cols.map((c) => c.length).join('/'), '; lead:', lead.title.slice(0, 40));
