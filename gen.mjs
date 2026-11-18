// gen.mjs — VARIANT B of the 18 Nov 2026 world front page (1024x1024).
//
// Hierarchy (deliberately different from the shipped entry):
//   masthead + huge date  ->  SIX featured cards (one per continent, 3x2 grid,
//   each a LARGE 200x140 DRAWN scene)  ->  world map LARGER, centred, six dots
//   ->  BY THE NUMBERS as one wide band of four very large figures
//   ->  the other THIRTY stories in four narrow columns -> sources footer.
//
// Everything is drawn from news.json; no external assets.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(here, 'news.json'), 'utf8'));
const sorted = [...news].sort((a, b) => a.num - b.num);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const TINT = {
  Europe: '#38507e',
  Americas: '#a04329',
  Asia: '#9c7418',
  Africa: '#5c8634',
  'Middle East': '#855a99',
  Oceania: '#2c8b86',
};
const ink = (r) => TINT[r] || TINT.Europe;
const kick = (s) => esc(String(s).toUpperCase());

// ---- SIX drawn scenes, native 200 x 140, one per continent -------------------
const SCENES = {
  // 1 EUROPE — a bridge span over a swollen river, two boats, slanting rain
  1: (c) => `<rect x="0" y="0" width="200" height="140" fill="#dbe4ee"/>
    <rect x="0" y="86" width="200" height="54" fill="#7f9ab4"/>
    <path d="M0 94 Q25 88 50 94 T100 94 T150 94 T200 94" stroke="#6f8aa4" stroke-width="2" fill="none"/>
    <path d="M0 112 Q30 105 60 112 T120 112 T180 112" stroke="#8fa8bf" stroke-width="2" fill="none"/>
    <path d="M0 126 Q34 120 68 126 T136 126 T200 126" stroke="#6f8aa4" stroke-width="2" fill="none"/>
    <line x1="6" y1="58" x2="194" y2="58" stroke="${c}" stroke-width="7"/>
    <path d="M22 58 Q42 28 62 58" stroke="${c}" stroke-width="5" fill="none"/>
    <path d="M78 58 Q98 28 118 58" stroke="${c}" stroke-width="5" fill="none"/>
    <path d="M134 58 Q154 30 174 58" stroke="${c}" stroke-width="5" fill="none"/>
    <line x1="22" y1="58" x2="22" y2="90" stroke="${c}" stroke-width="3"/>
    <line x1="118" y1="58" x2="118" y2="90" stroke="${c}" stroke-width="3"/>
    <line x1="174" y1="58" x2="174" y2="90" stroke="${c}" stroke-width="3"/>
    <path d="M42 100 h22 l-5 10 h-12 z" fill="#2f4a66"/><line x1="53" y1="100" x2="53" y2="88" stroke="#2f4a66" stroke-width="2"/>
    <path d="M140 116 h22 l-5 10 h-12 z" fill="#2f4a66"/><line x1="151" y1="116" x2="151" y2="104" stroke="#2f4a66" stroke-width="2"/>
    <g stroke="#b6c6d8" stroke-width="2" stroke-linecap="round">
      <line x1="30" y1="12" x2="22" y2="34"/><line x1="58" y1="8" x2="50" y2="30"/>
      <line x1="92" y1="14" x2="84" y2="36"/><line x1="126" y1="10" x2="118" y2="32"/>
      <line x1="160" y1="16" x2="152" y2="38"/><line x1="186" y1="22" x2="178" y2="44"/></g>`,

  // 2 AMERICAS — a hillside of trees under drifting smoke with a low fire line
  2: (c) => `<rect x="0" y="0" width="200" height="140" fill="#f0e3d2"/>
    <path d="M0 104 Q46 72 92 104 T200 104 L200 140 L0 140 Z" fill="#8f8a62"/>
    <path d="M0 122 Q50 100 100 122 T200 122 L200 140 L0 140 Z" fill="#767a4e"/>
    <path d="M34 116 l11 -28 l11 28 z" fill="#4f5a35"/><line x1="45" y1="116" x2="45" y2="128" stroke="#4f5a35" stroke-width="3"/>
    <path d="M64 118 l9 -22 l9 22 z" fill="#4f5a35"/><line x1="73" y1="118" x2="73" y2="128" stroke="#4f5a35" stroke-width="3"/>
    <path d="M150 114 l11 -26 l11 26 z" fill="#4f5a35"/><line x1="161" y1="114" x2="161" y2="126" stroke="#4f5a35" stroke-width="3"/>
    <path d="M118 120 l9 -22 l9 22 z" fill="#4f5a35"/><line x1="127" y1="120" x2="127" y2="130" stroke="#4f5a35" stroke-width="3"/>
    <path d="M10 102 q16 -11 10 -28 q24 11 13 35" stroke="#c9a17c" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M86 98 q20 -13 11 -33 q27 14 13 39" stroke="#c49a72" stroke-width="11" fill="none" stroke-linecap="round" opacity="0.75"/>
    <path d="M152 100 q16 -9 8 -25 q22 10 11 31" stroke="#c9a17c" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M6 119 H194" stroke="#d8762a" stroke-width="4" stroke-dasharray="7 5"/>`,

  // 3 ASIA — a fabrication plant beside a wafer disc and two steaming towers
  3: (c) => `<rect x="0" y="0" width="200" height="140" fill="#e9ece3"/>
    <path d="M18 70 H130" stroke="${c}" stroke-width="5"/>
    <rect x="18" y="70" width="112" height="54" fill="#cdd2c1"/>
    <rect x="28" y="82" width="16" height="18" fill="#b7bdaa"/><rect x="54" y="82" width="16" height="18" fill="#b7bdaa"/>
    <rect x="80" y="82" width="16" height="18" fill="#b7bdaa"/><rect x="106" y="82" width="16" height="18" fill="#b7bdaa"/>
    <rect x="150" y="46" width="42" height="78" fill="#d7dbcb"/>
    <rect x="154" y="34" width="11" height="44" fill="#c2c7b6"/>
    <circle cx="171" cy="26" r="8" fill="#dfe3d6"/><circle cx="185" cy="14" r="6" fill="#e4e8dc"/>
    <circle cx="52" cy="38" r="21" fill="#eae4d2" stroke="${c}" stroke-width="3"/>
    <line x1="52" y1="17" x2="52" y2="59" stroke="#c3bba4" stroke-width="1.5"/>
    <line x1="31" y1="38" x2="73" y2="38" stroke="#c3bba4" stroke-width="1.5"/>
    <rect x="0" y="124" width="200" height="16" fill="#c7cbb9"/>`,

  // 4 MIDDLE EAST — a chamber of tiered benches with rows of figures
  4: (c) => {
    const g = [];
    [[46, 5, 30], [72, 6, 22], [98, 7, 14]].forEach(([y, n, x0], i) => {
      for (let k = 0; k < n; k++) {
        const x = x0 + k * 26;
        g.push(`<rect x="${x}" y="${y}" width="22" height="7" rx="2.5" fill="#c9bfa8"/>`);
        if ((k + i) % 2 === 0) {
          g.push(`<circle cx="${x + 11}" cy="${y - 14}" r="5" fill="${c}"/><rect x="${x + 6}" y="${y - 10}" width="10" height="10" rx="2" fill="${c}" opacity="0.85"/>`);
        }
      }
    });
    return `<rect x="0" y="0" width="200" height="140" fill="#efe9dc"/>
    <line x1="0" y1="136" x2="200" y2="136" stroke="#d3c9b3" stroke-width="2"/>
    ${g.join('')}
    <rect x="76" y="114" width="48" height="19" rx="3" fill="#8a7f66"/>
    <rect x="96" y="105" width="7" height="9" fill="#6f6650"/>`;
  },

  // 5 AFRICA — a field clinic tent with a queue of figures under a high sun
  5: (c) => `<rect x="0" y="0" width="200" height="140" fill="#f0ede2"/>
    <rect x="0" y="110" width="200" height="30" fill="#cfc9b6"/>
    <path d="M22 110 L66 50 L110 110 Z" fill="#cfd8c6"/>
    <path d="M58 110 L66 92 L74 110 Z" fill="#a8b79c"/>
    <line x1="66" y1="50" x2="66" y2="34" stroke="${c}" stroke-width="3"/>
    <path d="M66 34 l18 6 l-18 6 z" fill="${c}"/>
    <circle cx="168" cy="34" r="13" fill="#e7d9a8"/>
    <g fill="#6d7a5d">
      <circle cx="126" cy="84" r="5"/><rect x="121" y="90" width="10" height="24" rx="3"/>
      <circle cx="146" cy="84" r="5"/><rect x="141" y="90" width="10" height="24" rx="3"/>
      <circle cx="166" cy="84" r="5"/><rect x="161" y="90" width="10" height="24" rx="3"/>
      <circle cx="186" cy="84" r="5"/><rect x="181" y="90" width="10" height="24" rx="3"/></g>`,

  // 6 OCEANIA — a spiral storm over a coastline lined with small houses
  6: (c) => `<rect x="0" y="0" width="200" height="140" fill="#e7eef1"/>
    <rect x="0" y="46" width="96" height="94" fill="#7f9ab4"/>
    <path d="M92 140 L92 88 Q130 72 200 82 L200 140 Z" fill="#8a9c6a"/>
    <rect x="128" y="92" width="20" height="16" fill="#e0d7c2"/><path d="M124 92 L138 79 L152 92 Z" fill="#b5533e"/>
    <rect x="162" y="96" width="18" height="13" fill="#e0d7c2"/><path d="M158 96 L171 85 L184 96 Z" fill="#b5533e"/>
    <line x1="114" y1="114" x2="114" y2="92" stroke="#5d6b45" stroke-width="3"/>
    <path d="M114 92 q-13 -6 -16 -16 M114 92 q13 -6 16 -16 M114 92 q0 -13 0 -19" stroke="#5d6b45" stroke-width="2.5" fill="none"/>
    <path d="M78 26 a26 26 0 1 1 -26 26" fill="none" stroke="${c}" stroke-width="5"/>
    <path d="M70 44 a15 15 0 1 1 -15 15" fill="none" stroke="${c}" stroke-width="4"/>
    <circle cx="60" cy="50" r="5" fill="${c}"/>`,
};

const sceneSVG = (it) => {
  const fn = SCENES[it.num] || SCENES[1];
  return `<svg class="scene" viewBox="0 0 200 140" width="200" height="140" role="img" aria-label="${esc(it.scene)}"><title>${esc(it.scene)}</title>${fn(ink(it.region))}</svg>`;
};

// ---- one outline world map, LARGER, with six numbered dots --------------------
const LAND = `
  <path d="M70 96 L120 62 L200 52 L286 66 L304 104 L262 132 L236 170 L206 178 L190 154 L150 140 L118 156 L92 138 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M330 46 L372 40 L386 62 L354 74 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M262 150 L318 148 L336 184 L322 226 L296 238 L276 222 L268 182 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M470 62 L520 50 L560 60 L574 88 L548 108 L506 110 L478 96 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M480 118 L546 112 L600 132 L606 172 L584 214 L556 230 L536 206 L512 176 L478 150 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M572 74 L660 44 L770 40 L872 62 L908 100 L872 138 L812 148 L772 126 L706 140 L646 122 L600 100 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>
  <path d="M792 168 L872 166 L900 196 L878 232 L826 234 L794 208 Z" fill="#ddd6c3" stroke="#b3ab95" stroke-width="2"/>`;

const DOTS = [
  [1, 505, 78], [2, 130, 62], [3, 848, 86], [4, 646, 106], [5, 556, 158], [6, 902, 202],
];

const featured = sorted.slice(0, 6);
const list = sorted.slice(6);
const byNum = Object.fromEntries(featured.map((f) => [f.num, f]));
const dots = DOTS.map(([n, x, y]) => {
  const r = (byNum[n] && byNum[n].region) || 'Europe';
  return `<circle cx="${x}" cy="${y}" r="17" fill="${ink(r)}"/><text x="${x}" y="${y}" dy="6" text-anchor="middle" font-size="19" font-weight="700" fill="#fff">${n}</text>`;
}).join('');
const mapSVG = `<svg class="map" viewBox="0 0 1000 250" role="img" aria-label="world map with six numbered dots">${LAND}${dots}</svg>`;

// ---- four very large figures, every one verbatim from a featured fact ---------
const FIGURES = [
  { v: '480,000', l: 'hectares burned' },
  { v: '14 million', l: 'jabs in six weeks' },
  { v: '240 km/h', l: 'cyclone gusts' },
  { v: '4.2 metres', l: 'above the seasonal level' },
];
for (const f of FIGURES)
  if (!featured.some((s) => s.fact.includes(f.v)))
    console.warn('WARN figure not found verbatim in featured six:', f.v);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>THE WORLD TODAY - Wednesday 18 November 2026 (variant B)</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1024px; height:1024px; }
  body { background:#f7f3ea; color:#1a1811; overflow:hidden; font-family:'DejaVu Sans', Arial, sans-serif; display:flex; flex-direction:column; padding:12px 26px 8px; }
  .mast { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:17px; letter-spacing:10px; }
  .kicker { text-align:center; font-size:9px; letter-spacing:5px; color:#7a7362; margin-top:1px; }
  .date { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:42px; line-height:1; margin-top:3px; }
  .tally { text-align:center; font-size:12px; font-weight:700; letter-spacing:3px; color:#a8281f; margin-top:4px; }
  .hr { border:0; border-top:3px double #1a1811; margin-top:5px; }
  .featured { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:6px; }
  .card { border:1px solid #e2dac9; border-top:3px solid var(--cc); border-radius:5px; background:#fffdf8; padding:3px 6px 4px; display:flex; flex-direction:column; align-items:center; overflow:hidden; }
  .card svg.scene { display:block; border-radius:3px; border:1px solid #e6ded0; }
  .card .rg { font-size:9px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:#57503f; margin-top:3px; text-align:center; }
  .card h3 { font-family:'DejaVu Serif', Georgia, serif; font-size:15.5px; font-weight:700; line-height:1.06; margin-top:3px; text-align:center; }
  .card p { font-size:9.5px; line-height:1.12; color:#514a3a; margin-top:2px; text-align:center; }
  .mapwrap { margin:6px -26px 0; }
  .map { width:100%; height:auto; display:block; }
  .mapcap { text-align:center; font-size:9px; letter-spacing:1.2px; text-transform:uppercase; color:#7a7362; margin-top:1px; }
  .numhead { font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#7a7362; text-align:center; margin-top:4px; }
  .numbers { display:flex; border-top:2px solid #1a1811; border-bottom:2px solid #1a1811; padding:4px 0; margin-top:3px; }
  .num { flex:1 1 0; text-align:center; }
  .num .v { font-family:'DejaVu Serif', Georgia, serif; font-size:38px; font-weight:700; line-height:1; letter-spacing:-1px; }
  .num .l { font-size:9px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#7a7362; margin-top:3px; }
  .list { margin-top:8px; border-top:2px solid #1a1811; padding-top:5px; column-count:4; column-gap:16px; }
  .item { display:flex; gap:4px; align-items:baseline; font-size:8.7px; line-height:1.15; margin-bottom:0px; break-inside:avoid; }
  .item b { flex:0 0 auto; min-width:14px; text-align:right; font-weight:700; }
  .item .rt { flex:0 0 auto; font-size:7px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
  .item .ht { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .foot { margin-top:auto; border-top:2px solid #1a1811; padding-top:5px; display:flex; justify-content:space-between; gap:14px; font-size:9px; letter-spacing:0.8px; text-transform:uppercase; color:#7a7362; }
  .foot .say { color:#a8281f; font-weight:700; }
  #diag { display:none; }
</style>
</head>
<body>
  <div class="mast">THE WORLD TODAY</div>
  <div class="kicker">INDEPENDENT WORLD EDITION &middot; VARIANT B</div>
  <div class="date">WEDNESDAY 18 NOVEMBER 2026</div>
  <div class="tally">${sorted.length} STORIES &middot; SIX CONTINENTS &middot; ONE DAY</div>
  <hr class="hr">

  <div class="featured">
${featured.map((it) => `    <div class="card" style="--cc:${ink(it.region)}">
      ${sceneSVG(it)}
      <div class="rg">${esc(it.region)} &middot; ${kick(it.kicker)}</div>
      <h3>${esc(it.headline)}</h3>
      <p>${esc(it.fact)}</p>
    </div>`).join('\n')}
  </div>

  <div class="mapwrap">
    ${mapSVG}
    <div class="mapcap">The six numbered dots mark the featured stories 1&ndash;6, one to a continent</div>
  </div>

  <div class="numhead">By the numbers</div>
  <div class="numbers">
${FIGURES.map((f) => `    <div class="num"><div class="v">${esc(f.v)}</div><div class="l">${esc(f.l)}</div></div>`).join('\n')}
  </div>

  <div class="list">
${list.map((it) => `    <div class="item"><b style="color:${ink(it.region)}">${it.num}</b><span class="ht">${esc(it.headline)}</span></div>`).join('\n')}
  </div>

  <div class="foot">
    <span>Wires: ${[...new Set(sorted.map((s) => s.source))].join(' &middot; ')}</span>
    <span class="say">Every story on this page happened, or was first reported, on this day.</span>
  </div>

  <div id="diag"></div>
  <script>
    window.__diag = function () {
      var out = {
        w: document.body.scrollWidth, h: document.body.scrollHeight,
        featured: document.querySelectorAll('.card').length,
        items: document.querySelectorAll('.item').length,
        scenes: document.querySelectorAll('svg.scene').length,
        dots: document.querySelectorAll('.map circle').length,
        figs: document.querySelectorAll('.num .v').length,
        scenePx: (function () { var r = document.querySelector('svg.scene').getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); })()
      };
      var bad = [];
      if (out.h > 1024) bad.push('body-tall:' + out.h);
      if (out.w > 1024) bad.push('body-wide:' + out.w);
      document.querySelectorAll('.card').forEach(function (c) {
        if (c.scrollHeight > c.clientHeight + 1) bad.push('card-overflow');
        var h = c.querySelector('h3'); if (h && h.scrollHeight > h.clientHeight + 1) bad.push('headline-clipped');
        var p = c.querySelector('p'); if (p && p.scrollHeight > p.clientHeight + 1) bad.push('fact-clipped');
      });
      var f = document.querySelector('.featured'); if (f.scrollHeight > f.clientHeight + 1) bad.push('featured-overflow');
      var l = document.querySelector('.list'); if (l.scrollHeight > l.clientHeight + 1) bad.push('list-overflow');
      document.querySelectorAll('.item .ht').forEach(function (x) { if (x.scrollWidth > x.clientWidth + 1) bad.push('list-truncated'); });
      if (out.featured !== 6) bad.push('featured!=' + out.featured);
      if (out.items !== 30) bad.push('items!=' + out.items);
      if (out.dots !== 6) bad.push('dots!=' + out.dots);
      out.overflow = bad;
      document.getElementById('diag').textContent = JSON.stringify(out);
      return out;
    };
  </script>
</body>
</html>
`;

writeFileSync(join(here, 'page.html'), html);
console.log('page.html', html.length, 'bytes; featured:', featured.length, 'list:', list.length, 'scenes:', Object.keys(SCENES).length, 'dots:', DOTS.length);

const r = spawnSync(process.execPath, [join(here, 'render.mjs'), 'entry.png'], { cwd: here, stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status || 1);
