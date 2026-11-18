// gen.mjs — build page.html (1024x1024) from news.json, then render entry.png.
// A one-day world front page: a dated masthead, a lead brief, four figures,
// a grid of story cards, a rail listing the rest of the day, and a wire footer.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(here, 'news.json'), 'utf8'));
const sorted = [...news].sort((a, b) => a.num - b.num);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// one ink + wash tint per region
const TINT = {
  Europe: { ink: '#38507e', wash: '#e9eef7' },
  Americas: { ink: '#a04329', wash: '#f6e7e1' },
  Asia: { ink: '#9c7418', wash: '#f6efda' },
  Africa: { ink: '#5c8634', wash: '#ebf2e0' },
  'Middle East': { ink: '#855a99', wash: '#f0e7f5' },
  Oceania: { ink: '#2c8b86', wash: '#e3efee' },
};
const ink = (r) => (TINT[r] || TINT.Europe).ink;
const wash = (r) => (TINT[r] || TINT.Europe).wash;

// simple 24x24 stroke glyphs, legible at card size
const GLYPH = {
  bridge: '<path d="M3 16h18"/><path d="M6 16a6 6 0 0 1 12 0"/><path d="M8 16v5"/><path d="M16 16v5"/>',
  flame: '<path d="M12 3c1 3.5 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2.4-4.6-.2 2 .9 3 2 3-.2-2.2-.6-4.4.6-7.4z"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="1"/><rect x="10" y="10" width="4" height="4"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  cyclone: '<path d="M12 4a8 8 0 0 1 8 8c0 3-2 5-5 5"/><path d="M12 20a8 8 0 0 1-8-8c0-3 2-5 5-5"/><circle cx="12" cy="12" r="1.5"/>',
  chart: '<path d="M4 20h17"/><path d="M6 20v-6M11 20V6M16 20v-9M20 20V9"/>',
  rocket: '<path d="M12 3c3 2.5 4 6 4 9l-2 3h-4l-2-3c0-3 1-6.5 4-9z"/><circle cx="12" cy="9" r="1.4"/><path d="M10 18l-2 3M14 18l2 3"/>',
  ballot: '<rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M9 4h6v7H9z"/><path d="M9 15h5"/>',
  ship: '<path d="M4 15h16l-2.5 4h-11z"/><rect x="7" y="10" width="3" height="4"/><rect x="11" y="10" width="3" height="4"/><path d="M6 12h12"/>',
  health: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  scales: '<path d="M12 3v17M8 20h8M5 8h14"/><path d="M5 8l-2 5a3 3 0 0 0 6 0z"/><path d="M19 8l2 5a3 3 0 0 1-6 0z"/>',
  parliament: '<path d="M4 10 12 5l8 5"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8"/><path d="M3 18h18"/>',
};
const glyph = (name, size = 26) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${GLYPH[name] || GLYPH.globe}</svg>`;

const lead = sorted[0];
const cards = sorted.slice(1, 9);
const rail = sorted.slice(9);

// four figures, each one taken verbatim from a brief
const FIGURES = [
  { v: '480,000', l: 'hectares burned' },
  { v: '240 km/h', l: 'cyclone gusts' },
  { v: '14 million', l: 'children reached' },
  { v: '78%', l: 'voter turnout' },
];
for (const f of FIGURES)
  if (!sorted.some((s) => s.fact.includes(f.v)))
    console.warn('WARN figure not found verbatim in a brief:', f.v);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>THE WORLD TODAY - Wednesday 18 November 2026</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1024px; height:1024px; }
  body { background:#f7f3ea; color:#1a1811; overflow:hidden; font-family:'DejaVu Sans', Arial, sans-serif; display:flex; flex-direction:column; padding:24px 30px 14px; }
  .mast { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:30px; letter-spacing:12px; }
  .kicker { text-align:center; font-size:11px; letter-spacing:5px; color:#7a7362; margin-top:4px; }
  .date { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:42px; margin-top:6px; }
  .hr { border:0; border-top:3px double #1a1811; margin-top:8px; }
  .tally { text-align:center; font-size:13px; font-weight:700; letter-spacing:3px; color:#a8281f; margin-top:6px; }
  .lead { display:flex; gap:14px; align-items:center; margin-top:12px; border:1px solid #dfd7c5; border-left:6px solid var(--lc); border-radius:6px; background:var(--lb); padding:10px 14px; }
  .lead .gl { display:flex; flex:0 0 auto; color:var(--lc); }
  .lead .badge { font-size:10.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--lc); }
  .lead h2 { font-family:'DejaVu Serif', Georgia, serif; font-size:23px; font-weight:700; line-height:1.1; margin-top:2px; }
  .lead p { font-size:12.5px; color:#4c4638; margin-top:3px; }
  .figs { display:flex; margin-top:12px; border-top:2px solid #1a1811; border-bottom:2px solid #1a1811; padding:6px 0; }
  .fig { flex:1 1 0; text-align:center; }
  .fig .v { font-family:'DejaVu Serif', Georgia, serif; font-size:34px; font-weight:700; line-height:1; letter-spacing:-0.5px; }
  .fig .l { font-size:9.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:#7a7362; margin-top:3px; }
  .band { flex:1 1 auto; display:flex; gap:16px; margin-top:12px; min-height:0; }
  .cards { flex:1.65 1 0; display:grid; grid-template-columns:repeat(2,1fr); grid-template-rows:repeat(4,1fr); gap:10px; min-height:0; }
  .card { border:1px solid #e2dac9; border-top:3px solid var(--cc); border-radius:5px; background:#fffdf8; padding:7px 10px; display:flex; flex-direction:column; overflow:hidden; }
  .card .top { display:flex; align-items:center; gap:6px; }
  .card .rg { font-size:9.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#57503f; }
  .card h3 { font-family:'DejaVu Serif', Georgia, serif; font-size:13px; font-weight:700; line-height:1.14; margin-top:5px; overflow:hidden; }
  .card p { margin-top:auto; font-size:10px; line-height:1.2; color:#514a3a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .rail { flex:1 1 0; display:flex; flex-direction:column; min-width:0; border-left:2px solid #1a1811; padding-left:12px; }
  .rail h4 { font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; border-bottom:2px solid #1a1811; padding-bottom:4px; margin-bottom:4px; }
  .rows { flex:1 1 auto; display:flex; flex-direction:column; justify-content:space-between; min-height:0; }
  .line { display:flex; gap:6px; align-items:baseline; white-space:nowrap; overflow:hidden; }
  .line b { flex:0 0 auto; min-width:16px; text-align:right; font-size:10px; }
  .line .rt { flex:0 0 auto; font-size:8.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
  .line .ht { font-size:10.5px; overflow:hidden; text-overflow:ellipsis; }
  .foot { flex:0 0 auto; margin-top:10px; border-top:2px solid #1a1811; padding-top:6px; display:flex; justify-content:space-between; gap:12px; font-size:10px; letter-spacing:1px; text-transform:uppercase; color:#7a7362; }
  #diag { display:none; }
</style>
</head>
<body>
  <div class="mast">THE WORLD TODAY</div>
  <div class="kicker">INDEPENDENT WORLD EDITION</div>
  <div class="date">WEDNESDAY 18 NOVEMBER 2026</div>
  <hr class="hr">
  <div class="tally">${sorted.length} STORIES &middot; 6 CONTINENTS &middot; ONE DAY</div>

  <div class="lead" style="--lc:${ink(lead.region)};--lb:${wash(lead.region)}">
    <span class="gl">${glyph(lead.icon, 40)}</span>
    <div>
      <div class="badge">${esc(lead.region)} &middot; lead</div>
      <h2>${esc(lead.headline)}</h2>
      <p>${esc(lead.fact)}</p>
    </div>
  </div>

  <div class="figs">
${FIGURES.map((f) => `    <div class="fig"><div class="v">${f.v}</div><div class="l">${f.l}</div></div>`).join('\n')}
  </div>

  <div class="band">
    <div class="cards">
${cards.map((c) => `      <div class="card" style="--cc:${ink(c.region)}">
        <div class="top"><span style="display:flex;color:${ink(c.region)}">${glyph(c.icon, 22)}</span><span class="rg">${esc(c.region)}</span></div>
        <h3>${esc(c.headline)}</h3>
        <p>${esc(c.fact)}</p>
      </div>`).join('\n')}
    </div>
    <div class="rail">
      <h4>The rest of the day &middot; ${rail.length} briefs</h4>
      <div class="rows">
${rail.map((it) => `        <div class="line" data-n="${it.num}"><b style="color:${ink(it.region)}">${it.num}</b><span class="rt" style="color:${ink(it.region)}">${esc(it.region)}</span><span class="ht">${esc(it.headline)}</span></div>`).join('\n')}
      </div>
    </div>
  </div>

  <div class="foot">
    <span>Sources: Reuters &middot; AP &middot; AFP &middot; BBC &middot; Bloomberg</span>
    <span style="color:#a8281f;font-weight:700">Every brief happened, or was first reported, on this day</span>
  </div>

  <div id="diag"></div>
  <script>
    window.__diag = function () {
      var out = { w: document.body.scrollWidth, h: document.body.scrollHeight };
      out.cards = document.querySelectorAll('.card').length;
      out.lines = document.querySelectorAll('.line').length;
      var bad = [];
      document.querySelectorAll('.card').forEach(function (c) {
        if (c.scrollHeight > c.clientHeight + 1) bad.push('card-overflow');
      });
      document.querySelectorAll('.card p').forEach(function (p) {
        if (p.scrollWidth > p.clientWidth + 1) bad.push('fact-clipped');
      });
      document.querySelectorAll('.line .ht').forEach(function (h) {
        if (h.scrollWidth > h.clientWidth + 1) bad.push('rail-truncated');
      });
      var rows = document.querySelector('.rows');
      if (rows.scrollHeight > rows.clientHeight + 1) bad.push('rail-overflow');
      var band = document.querySelector('.band');
      if (band.scrollHeight > band.clientHeight + 1) bad.push('band-overflow');
      out.overflow = bad;
      document.getElementById('diag').textContent = JSON.stringify(out);
      return out;
    };
  </script>
</body>
</html>
`;

writeFileSync(join(here, 'page.html'), html);
console.log('page.html', html.length, 'bytes; lead:', lead.num, 'cards:', cards.length, 'rail:', rail.length);

// render entry.png from the page we just wrote
const r = spawnSync(process.execPath, [join(here, 'render.mjs'), 'entry.png'], { cwd: here, stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status || 1);
