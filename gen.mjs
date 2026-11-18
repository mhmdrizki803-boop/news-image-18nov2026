// gen.mjs — build page.html (1024x1024) from news.json
// A "one day in the world" card: a huge masthead date, a strip of ten icon story boxes,
// a BY THE NUMBERS band, a world map with numbered pins (one per featured story),
// the remaining thirty as a single narrow numbered column, and the wire sources.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(here, 'news.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// one muted accent + tint per region
const REGION = {
  Europe:        { c: '#3b5b8c', bg: '#e8edf5' },
  Americas:      { c: '#a4442e', bg: '#f4e7e2' },
  Asia:          { c: '#a6791c', bg: '#f5edd9' },
  Africa:        { c: '#5f8a37', bg: '#eaf1df' },
  'Middle East': { c: '#8a5a9e', bg: '#efe6f4' },
  Oceania:       { c: '#2f8f8a', bg: '#e2efee' },
};
const rc = (r) => (REGION[r] || REGION.Europe).c;
const rb = (r) => (REGION[r] || REGION.Europe).bg;

// simple 24x24 stroke icons — recognisable at ~28px
const ICONS = {
  flame: '<path d="M12 3c1 3 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-2-1-4 1-8z"/>',
  bridge: '<path d="M3 15h18"/><path d="M5 15a7 7 0 0 1 14 0"/><path d="M7 15v5"/><path d="M17 15v5"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10.5" y="10.5" width="3" height="3"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  parliament: '<path d="M4 10 12 5l8 5"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/><path d="M3 18h18"/>',
  cyclone: '<path d="M12 4a8 8 0 0 1 8 8c0 3-2 5-5 5"/><path d="M12 20a8 8 0 0 1-8-8c0-3 2-5 5-5"/><circle cx="12" cy="12" r="1.6"/>',
  chart: '<path d="M4 20h17"/><path d="M6 20v-7M11 20V5M16 20v-10M20 20V9"/>',
  rocket: '<path d="M12 3c3 2.5 4 6 4 9l-2 3h-4l-2-3c0-3 1-6.5 4-9z"/><circle cx="12" cy="9" r="1.5"/><path d="M10 18l-2 3M14 18l2 3"/>',
  ship: '<path d="M4 15h16l-2.5 4h-11z"/><rect x="7" y="10" width="3" height="4"/><rect x="11" y="10" width="3" height="4"/><path d="M6 12h12"/>',
  ballot: '<rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M9 4h6v7H9z"/><path d="M9.5 15h5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  health: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/>',
  scales: '<path d="M12 3v17"/><path d="M8 20h8"/><path d="M5 8h14"/><path d="M5 8l-2 5a3 3 0 0 0 6 0z"/><path d="M19 8l2 5a3 3 0 0 1-6 0z"/>',
};
const icon = (name, size = 28) =>
  `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.globe}</svg>`;

const featured = news.filter((n) => n.num <= 10).sort((a, b) => a.num - b.num);
const list = news.filter((n) => n.num > 10).sort((a, b) => a.num - b.num);
const countLine = `${news.length} STORIES \u00b7 6 CONTINENTS \u00b7 ONE DAY`;

// four figures pulled straight from the featured facts
const NUMBERS = [
  { value: '480,000',   label: 'hectares burned', fact: '480,000 hectares burned' },
  { value: '240 km/h',  label: 'cyclone gusts',   fact: 'gusts reach 240 km/h offshore' },
  { value: '14 million', label: 'children reached', fact: '14 million jabs given' },
  { value: '78%',       label: 'voter turnout',   fact: '78% of electors cast a ballot' },
];
for (const nm of NUMBERS)
  if (!featured.some((f) => f.fact.includes(nm.value)))
    console.warn('WARN number not found verbatim in a fact:', nm.value);

// numbered pins — one per featured story, placed on its region
const PIN = {
  1: [172, 40], 2: [58, 40], 3: [256, 50], 4: [178, 94], 5: [204, 70],
  6: [296, 130], 7: [154, 52], 8: [100, 114], 9: [216, 92], 10: [162, 124],
};
const pins = featured
  .map((f) => {
    const [x, y] = PIN[f.num] || [170, 90];
    return `<g><circle cx="${x}" cy="${y}" r="10.5" fill="${rc(f.region)}" stroke="#f4f0e6" stroke-width="1.6"/><text x="${x}" y="${y + 3.9}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">${f.num}</text></g>`;
  })
  .join('');

// schematic continent outline (viewBox 0 0 340 190)
const LAND = [
  'M18,28 L70,22 L92,34 L104,44 L88,50 L74,68 L60,74 L48,58 L34,44 Z',
  'M112,18 L140,14 L136,30 L112,30 Z',
  'M96,76 L118,78 L128,96 L120,120 L108,152 L100,140 L104,110 L94,88 Z',
  'M152,30 L182,26 L188,40 L176,52 L160,50 L150,42 Z',
  'M152,62 L182,58 L196,70 L194,96 L182,120 L166,134 L158,112 L150,86 Z',
  'M188,26 L248,22 L292,32 L300,46 L286,62 L262,70 L240,86 L214,80 L200,62 L190,44 Z',
  'M210,82 L226,80 L222,102 L212,96 Z',
  'M244,86 L268,84 L276,96 L258,104 L246,98 Z',
  'M272,118 L304,112 L316,126 L300,142 L280,138 L272,128 Z',
].map((d) => `<path class="land" d="${d}"/>`).join('');

const featBox = (f) => `    <div class="bx" style="--ac:${rc(f.region)};background:${rb(f.region)}">
      <div class="bxtop"><span class="bxi" style="color:${rc(f.region)}">${icon(f.icon)}</span><span class="bxr">${esc(f.region)}</span></div>
      <div class="bxh">${esc(f.headline)}</div>
      <div class="bxf">${esc(f.fact)}</div>
    </div>`;

const numCell = (n, i) => `    <div class="nb"${i ? ' style="border-left:1px solid #cfc7b5"' : ''}><div class="nbv">${esc(n.value)}</div><div class="nbl">${esc(n.label)}</div></div>`;

const row = (it) => `    <div class="row" data-n="${it.num}"><span class="rn" style="color:${rc(it.region)}">${it.num}</span><span class="rr" style="color:${rc(it.region)}">${esc(it.region)}</span><span class="rh">${esc(it.headline)}</span></div>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>THE WORLD TODAY — Wednesday 18 November 2026</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1024px; height:1024px; }
  body { background:#f4f0e6; color:#17150f; overflow:hidden; font-family:'DejaVu Sans', Arial, sans-serif; display:flex; flex-direction:column; padding:14px 18px 12px; }
  #diag { display:none; }
  /* masthead */
  .brand { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:25px; letter-spacing:11px; }
  .dsub { text-align:center; font-size:10.5px; letter-spacing:4px; color:#6b6455; margin-top:3px; }
  .date { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:49px; line-height:1.04; letter-spacing:0.4px; margin-top:5px; white-space:nowrap; }
  .rule { border:0; border-top:3px double #17150f; margin-top:7px; }
  .count { text-align:center; font-size:15px; font-weight:700; letter-spacing:4px; color:#b3261e; margin-top:5px; }
  /* featured strip */
  .feat { display:grid; grid-template-columns:repeat(5,1fr); grid-template-rows:repeat(2,1fr); gap:9px; margin-top:11px; height:250px; }
  .bx { border:1px solid #ddd6c6; border-top:4px solid var(--ac); border-radius:5px; padding:6px 8px 6px; display:flex; flex-direction:column; overflow:hidden; }
  .bxtop { display:flex; align-items:center; gap:6px; }
  .bxi { display:flex; flex:0 0 auto; }
  .bxr { font-size:10px; font-weight:700; letter-spacing:0.7px; text-transform:uppercase; color:#3a352b; }
  .bxh { font-family:'DejaVu Serif', Georgia, serif; font-size:12.8px; font-weight:700; line-height:1.15; margin-top:4px; overflow:hidden; }
  .bxf { margin-top:auto; font-size:10px; line-height:1.15; color:#4a4436; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  /* by the numbers */
  .nums { display:flex; margin-top:11px; border-top:2px solid #17150f; border-bottom:2px solid #17150f; padding:6px 0; }
  .nb { flex:1 1 0; text-align:center; }
  .nbv { font-family:'DejaVu Serif', Georgia, serif; font-size:38px; font-weight:700; line-height:0.95; letter-spacing:-1px; }
  .nbl { font-size:10px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:#6b6455; margin-top:3px; }
  .cap { font-size:11px; font-weight:700; letter-spacing:2.4px; text-transform:uppercase; color:#6b6455; text-align:center; margin-top:4px; }
  /* map + list band */
  .band { flex:1 1 auto; display:flex; gap:16px; margin-top:11px; min-height:0; }
  .mapcol { flex:1.9 1 0; display:flex; flex-direction:column; min-width:0; }
  .maptop { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:5px; }
  .maptop .h { font-family:'DejaVu Serif', Georgia, serif; font-size:16px; font-weight:700; }
  .maptop .leg { font-size:10px; letter-spacing:1.2px; text-transform:uppercase; color:#6b6455; }
  .mapbox { flex:1 1 auto; border:1px solid #cfc7b5; background:#eae4d5; border-radius:5px; min-height:0; }
  .mapbox svg { display:block; width:100%; height:100%; }
  .land { fill:#cfd6c9; stroke:#6b7566; stroke-width:1; stroke-dasharray:2.4 2.4; stroke-linejoin:round; }
  .listcol { flex:1 1 0; display:flex; flex-direction:column; min-width:0; border-left:1px solid #cfc7b5; padding-left:13px; overflow:hidden; }
  .listhead { font-size:11px; font-weight:700; letter-spacing:1.6px; text-transform:uppercase; color:#17150f; border-bottom:2px solid #17150f; padding-bottom:4px; margin-bottom:3px; }
  .rows { flex:1 1 auto; min-height:0; display:flex; flex-direction:column; justify-content:space-between; }
  .row { display:flex; align-items:baseline; gap:6px; white-space:nowrap; overflow:hidden; }
  .rn { flex:0 0 auto; font-size:11px; font-weight:700; min-width:15px; text-align:right; }
  .rr { flex:0 0 auto; font-size:8.5px; font-weight:700; letter-spacing:0.3px; text-transform:uppercase; }
  .rh { font-size:11px; overflow:hidden; text-overflow:ellipsis; }
  /* footer */
  .foot { flex:0 0 auto; margin-top:9px; border-top:2px solid #17150f; padding-top:6px; display:flex; justify-content:space-between; gap:12px; }
  .foot .s { font-size:10px; letter-spacing:1.2px; text-transform:uppercase; color:#6b6455; }
  .foot .d { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#b3261e; text-align:right; }
</style>
</head>
<body>
  <header>
    <div class="brand">THE WORLD TODAY</div>
    <div class="dsub">INDEPENDENT WORLD EDITION</div>
    <div class="date">WEDNESDAY 18 NOVEMBER 2026</div>
    <hr class="rule">
    <div class="count">${countLine}</div>
  </header>

  <section class="feat">
${featured.map(featBox).join('\n')}
  </section>

  <section class="nums">
${NUMBERS.map(numCell).join('\n')}
  </section>
  <div class="cap">By the numbers &middot; taken from today&rsquo;s stories</div>

  <section class="band">
    <div class="mapcol">
      <div class="maptop"><span class="h">Where the day happened</span><span class="leg">numbered pins = the ten featured stories</span></div>
      <div class="mapbox">
        <svg viewBox="0 0 340 190" preserveAspectRatio="xMidYMid meet" role="img" aria-label="World map; the ten numbered pins are the ten featured stories">
          ${LAND}${pins}
        </svg>
      </div>
    </div>
    <div class="listcol">
      <div class="listhead">The rest of the day &middot; ${list.length} stories</div>
      <div class="rows">
${list.map(row).join('\n')}
      </div>
    </div>
  </section>

  <footer class="foot">
    <span class="s">Sources: Reuters &middot; AP &middot; AFP &middot; BBC &middot; Bloomberg</span>
    <span class="d">Every story happened, or was first reported, on this day</span>
  </footer>

  <div id="diag"></div>
  <script>
    window.__diag = function () {
      var out = { scrollH: document.body.scrollHeight, scrollW: document.body.scrollWidth };
      var d = document.querySelector('.date');
      out.dateFont = getComputedStyle(d).fontSize;
      out.dateScrollW = d.scrollWidth;
      out.feat = document.querySelectorAll('.feat .bx').length;
      out.rows = document.querySelectorAll('.row').length;
      var rows = document.querySelector('.rows');
      out.rowsBox = Math.round(rows.getBoundingClientRect().height);
      var last = document.querySelector('.row:last-child');
      out.lastRowBottom = Math.round(last.getBoundingClientRect().bottom);
      out.footTop = Math.round(document.querySelector('.foot').getBoundingClientRect().top);
      var over = [];
      document.querySelectorAll('.bx').forEach(function (b) { if (b.scrollHeight > b.clientHeight + 1) over.push('bx:' + b.querySelector('.bxr').textContent); });
      document.querySelectorAll('.bxf').forEach(function (f) { if (f.scrollWidth > f.clientWidth + 1) over.push('factClipped'); });
      var trunc = [];
      document.querySelectorAll('.row').forEach(function (r) { var h = r.querySelector('.rh'); if (h.scrollWidth > h.clientWidth + 1) trunc.push(r.dataset.n); });
      out.truncatedRows = trunc;
      var lr = document.querySelector('.rows');
      if (lr.scrollHeight > lr.clientHeight + 1) over.push('listOverflow');
      out.overflow = over;
      document.getElementById('diag').textContent = JSON.stringify(out);
      return out;
    };
  </script>
</body>
</html>
`;

writeFileSync(join(here, 'page.html'), html);
console.log('wrote page.html', html.length, 'bytes;', featured.length, 'featured;', list.length, 'listed');
