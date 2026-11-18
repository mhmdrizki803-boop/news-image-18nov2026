// gen.mjs — VARIANT C of the 18 Nov 2026 world front page (1024x1024).
//
// Hierarchy (deliberately different from BOTH the shipped entry and variant B):
//   a masthead row with the day's pooled briefs on the left and a SMALL world map
//   tucked in on the right (eleven numbered dots)  ->  the date, huge, full width
//   ->  ELEVEN featured cards in a tight six-column photo grid, each a 150x110
//   DRAWN scene  ->  BY THE NUMBERS as two enormous figures across the full width,
//   captions beneath  ->  the remaining TWENTY-FIVE stories as a numbered two-column
//   list with a rule between the columns  ->  sources footer.
//
// Everything is drawn from news.json; no external assets.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const news = JSON.parse(readFileSync(join(here, 'news.json'), 'utf8'));
const sorted = [...news].sort((a, b) => a.num - b.num);

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// one accent per region (muted ink)
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

// ---- ELEVEN drawn scenes, native 120x90, scaled into a 150x110 frame ---------
const SCENES = {
  // 1 Europe — storm over the Rhine: bridge span, swollen river, boats, slanting rain
  1: (c) => `<rect x="0" y="0" width="120" height="90" fill="#dbe4ee"/>
    <rect x="0" y="60" width="120" height="30" fill="#7f9ab4"/>
    <path d="M0 63 Q15 59 30 63 T60 63 T90 63 T120 63" stroke="#6f8aa4" stroke-width="1" fill="none"/>
    <line x1="6" y1="40" x2="114" y2="40" stroke="${c}" stroke-width="4"/>
    <path d="M18 40 Q34 24 50 40" stroke="${c}" stroke-width="3" fill="none"/>
    <path d="M50 40 Q66 24 82 40" stroke="${c}" stroke-width="3" fill="none"/>
    <line x1="18" y1="40" x2="18" y2="61" stroke="${c}" stroke-width="2"/>
    <line x1="82" y1="40" x2="82" y2="61" stroke="${c}" stroke-width="2"/>
    <path d="M24 70 h12 l-3 5 h-6 z" fill="#2f4a66"/><line x1="30" y1="70" x2="30" y2="62" stroke="#2f4a66" stroke-width="1.5"/>
    <path d="M86 76 h12 l-3 5 h-6 z" fill="#2f4a66"/><line x1="92" y1="76" x2="92" y2="68" stroke="#2f4a66" stroke-width="1.5"/>
    <g stroke="#b6c6d8" stroke-width="1.5" stroke-linecap="round">
      <line x1="22" y1="10" x2="16" y2="26"/><line x1="42" y1="6" x2="36" y2="22"/>
      <line x1="64" y1="12" x2="58" y2="28"/><line x1="90" y1="8" x2="84" y2="24"/>
      <line x1="106" y1="14" x2="100" y2="30"/></g>`,
  // 2 Americas — wildfire hillside: trees, drifting smoke, a low fire line
  2: (c) => `<rect x="0" y="0" width="120" height="90" fill="#f0e3d2"/>
    <path d="M0 74 Q28 50 56 74 T120 74 L120 90 L0 90 Z" fill="#8f8a62"/>
    <path d="M0 82 Q32 66 60 82 T120 82 L120 90 L0 90 Z" fill="#767a4e"/>
    <path d="M24 76 l6 -15 l6 15 z" fill="#4f5a35"/><line x1="30" y1="76" x2="30" y2="83" stroke="#4f5a35" stroke-width="2"/>
    <path d="M44 78 l5 -12 l5 12 z" fill="#4f5a35"/><line x1="49" y1="78" x2="49" y2="84" stroke="#4f5a35" stroke-width="2"/>
    <path d="M96 76 l6 -13 l6 13 z" fill="#4f5a35"/><line x1="102" y1="76" x2="102" y2="83" stroke="#4f5a35" stroke-width="2"/>
    <path d="M8 72 q10 -7 6 -18 q15 7 8 22" stroke="#c9a17c" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M56 70 q13 -8 7 -21 q17 9 8 25" stroke="#c49a72" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.75"/>
    <path d="M80 74 q10 -6 5 -16 q14 6 7 20" stroke="#c9a17c" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M8 81 H114" stroke="#d8762a" stroke-width="2.5" stroke-dasharray="4 3"/>`,
  // 3 Asia — chip fab: plant, wafer disc, two steaming towers
  3: (c) => `<rect x="0" y="0" width="120" height="90" fill="#e9ece3"/>
    <rect x="12" y="46" width="66" height="34" fill="#cdd2c1"/>
    <line x1="12" y1="46" x2="78" y2="46" stroke="${c}" stroke-width="3"/>
    <rect x="20" y="56" width="10" height="12" fill="#b7bdaa"/><rect x="36" y="56" width="10" height="12" fill="#b7bdaa"/>
    <rect x="52" y="56" width="10" height="12" fill="#b7bdaa"/>
    <rect x="86" y="30" width="26" height="50" fill="#d7dbcb"/>
    <rect x="88" y="24" width="7" height="34" fill="#c2c7b6"/>
    <circle cx="99" cy="18" r="5" fill="#dfe3d6"/><circle cx="107" cy="10" r="4" fill="#e4e8dc"/>
    <circle cx="34" cy="24" r="12" fill="#eae4d2" stroke="${c}" stroke-width="2"/>
    <line x1="34" y1="12" x2="34" y2="36" stroke="#c3bba4" stroke-width="1"/>
    <line x1="22" y1="24" x2="46" y2="24" stroke="#c3bba4" stroke-width="1"/>
    <rect x="0" y="80" width="120" height="10" fill="#c7cbb9"/>`,
  // 4 Middle East — parliament chamber: tiers of benches, rows of figures, rostrum
  4: (c) => {
    const g = [];
    [[34, 5, 30], [50, 6, 24], [64, 7, 18]].forEach(([y, n, x0], i) => {
      for (let k = 0; k < n; k++) {
        const x = x0 + k * 12;
        g.push(`<rect x="${x}" y="${y}" width="10" height="4" rx="1.5" fill="#c9bfa8"/>`);
        if ((k + i) % 2 === 0)
          g.push(`<circle cx="${x + 5}" cy="${y - 9}" r="3" fill="${c}"/><rect x="${x + 2.5}" y="${y - 6}" width="5" height="6" rx="1" fill="${c}" opacity="0.85"/>`);
      }
    });
    return `<rect x="0" y="0" width="120" height="90" fill="#efe9dc"/>
    <line x1="0" y1="88" x2="120" y2="88" stroke="#d3c9b3"/>
    ${g.join('')}
    <rect x="46" y="74" width="28" height="11" rx="2" fill="#8a7f66"/>
    <rect x="58" y="69" width="4" height="5" fill="#6f6650"/>`;
  },
  // 5 Africa — field clinic: tent, queue of figures, high sun
  5: (c) => `<rect x="0" y="0" width="120" height="90" fill="#f0ede2"/>
    <rect x="0" y="72" width="120" height="18" fill="#cfc9b6"/>
    <path d="M14 72 L40 34 L66 72 Z" fill="#cfd8c6"/>
    <path d="M36 72 L40 62 L44 72 Z" fill="#a8b79c"/>
    <line x1="40" y1="34" x2="40" y2="25" stroke="${c}" stroke-width="2"/>
    <path d="M40 25 l11 4 l-11 4 z" fill="${c}"/>
    <circle cx="101" cy="20" r="8" fill="#e7d9a8"/>
    <g fill="#6d7a5d">
      <circle cx="78" cy="52" r="3.4"/><rect x="75" y="56" width="6" height="16" rx="2"/>
      <circle cx="90" cy="52" r="3.4"/><rect x="87" y="56" width="6" height="16" rx="2"/>
      <circle cx="102" cy="52" r="3.4"/><rect x="99" y="56" width="6" height="16" rx="2"/>
      <circle cx="114" cy="52" r="3.4"/><rect x="111" y="56" width="6" height="16" rx="2"/></g>`,
  // 6 Oceania — cyclone spiral over a coastline lined with small houses
  6: (c) => `<rect x="0" y="0" width="120" height="90" fill="#e7eef1"/>
    <rect x="0" y="30" width="60" height="60" fill="#7f9ab4"/>
    <path d="M56 90 L56 58 Q80 48 120 54 L120 90 Z" fill="#8a9c6a"/>
    <rect x="78" y="60" width="12" height="10" fill="#e0d7c2"/><path d="M76 60 L84 52 L92 60 Z" fill="#b5533e"/>
    <rect x="98" y="62" width="11" height="8" fill="#e0d7c2"/><path d="M96 62 L103.5 55 L111 62 Z" fill="#b5533e"/>
    <line x1="70" y1="74" x2="70" y2="60" stroke="#5d6b45" stroke-width="2"/>
    <path d="M70 60 q-8 -4 -10 -10 M70 60 q8 -4 10 -10 M70 60 q0 -8 0 -12" stroke="#5d6b45" stroke-width="1.6" fill="none"/>
    <path d="M48 20 a16 16 0 1 1 -16 16" fill="none" stroke="${c}" stroke-width="3"/>
    <path d="M42 30 a9 9 0 1 1 -9 9" fill="none" stroke="${c}" stroke-width="2.5"/>
    <circle cx="36" cy="35" r="3" fill="${c}"/>`,
  // 7 Europe — inflation easing: falling line over low bars on a faint grid
  7: (c) => `<rect x="0" y="0" width="120" height="90" fill="#fbf7ef"/>
    <g stroke="#ddd6c6" stroke-width="1">
      <line x1="18" y1="24" x2="112" y2="24"/><line x1="18" y1="42" x2="112" y2="42"/>
      <line x1="18" y1="60" x2="112" y2="60"/><line x1="42" y1="12" x2="42" y2="78"/>
      <line x1="66" y1="12" x2="66" y2="78"/><line x1="90" y1="12" x2="90" y2="78"/></g>
    <line x1="18" y1="12" x2="18" y2="78" stroke="#8a8168" stroke-width="2"/>
    <line x1="18" y1="78" x2="112" y2="78" stroke="#8a8168" stroke-width="2"/>
    <g fill="#cdd3c2">
      <rect x="30" y="58" width="9" height="20"/><rect x="54" y="48" width="9" height="30"/>
      <rect x="78" y="54" width="9" height="24"/><rect x="100" y="64" width="9" height="14"/></g>
    <polyline points="24,28 46,34 68,48 90,58 108,68" fill="none" stroke="${c}" stroke-width="3"/>
    <g fill="${c}"><circle cx="24" cy="28" r="2.5"/><circle cx="46" cy="34" r="2.5"/><circle cx="68" cy="48" r="2.5"/><circle cx="90" cy="58" r="2.5"/><circle cx="108" cy="68" r="2.5"/></g>`,
  // 8 Asia — lunar relay: satellite over the Earth limb, ground dish, stars
  8: (c) => `<rect x="0" y="0" width="120" height="90" fill="#eef3f7"/>
    <g fill="#c3ccd6"><circle cx="14" cy="14" r="1.4"/><circle cx="34" cy="8" r="1.1"/><circle cx="98" cy="12" r="1.4"/><circle cx="112" cy="26" r="1.1"/><circle cx="80" cy="6" r="1"/></g>
    <path d="M0 78 Q60 52 120 78 L120 90 L0 90 Z" fill="#9db8cf"/>
    <rect x="52" y="24" width="16" height="13" rx="2" fill="#8a93a0"/>
    <rect x="30" y="26" width="20" height="8" fill="${c}"/><rect x="70" y="26" width="20" height="8" fill="${c}"/>
    <line x1="52" y1="31" x2="50" y2="31" stroke="#8a93a0" stroke-width="2"/>
    <path d="M60 37 v8" stroke="#8a93a0" stroke-width="2"/>
    <path d="M88 76 Q100 62 112 76" fill="#b9c3cc" stroke="#8a949f" stroke-width="1.5"/>
    <line x1="100" y1="76" x2="100" y2="84" stroke="#8a949f" stroke-width="2"/>`,
  // 9 Americas — colonnaded courthouse on broad steps, two figures
  9: (c) => `<rect x="0" y="0" width="120" height="90" fill="#eef0ee"/>
    <path d="M24 34 L60 16 L96 34 Z" fill="#e2ded1" stroke="#b9b3a2" stroke-width="1.5"/>
    <rect x="24" y="34" width="72" height="8" fill="#d8d3c5"/>
    <g fill="#e6e2d6" stroke="#c6c0b0" stroke-width="1">
      <rect x="30" y="42" width="6" height="26"/><rect x="44" y="42" width="6" height="26"/>
      <rect x="58" y="42" width="6" height="26"/><rect x="72" y="42" width="6" height="26"/>
      <rect x="86" y="42" width="6" height="26"/></g>
    <rect x="24" y="68" width="72" height="7" fill="#d8d3c5"/>
    <rect x="18" y="75" width="84" height="4" fill="#cfc9b8"/>
    <rect x="12" y="79" width="96" height="4" fill="#c6c0af"/>
    <rect x="6" y="83" width="108" height="7" fill="#bcb6a5"/>
    <g fill="${c}">
      <circle cx="42" cy="72" r="2.6"/><rect x="39.5" y="75" width="5" height="8" rx="1.5"/>
      <circle cx="76" cy="72" r="2.6"/><rect x="73.5" y="75" width="5" height="8" rx="1.5"/></g>`,
  // 10 Africa — freight train on rails between the sea and low hills
  10: (c) => `<rect x="0" y="0" width="120" height="90" fill="#e8eef0"/>
    <rect x="0" y="18" width="34" height="72" fill="#7f9ab4"/>
    <path d="M34 62 Q72 44 120 60 L120 90 L34 90 Z" fill="#9aa77e"/>
    <path d="M40 74 H120" stroke="#8a8168" stroke-width="1.5"/>
    <path d="M40 82 H120" stroke="#8a8168" stroke-width="1.5"/>
    <g stroke="#a49b83" stroke-width="1.5">
      <line x1="46" y1="72" x2="46" y2="84"/><line x1="60" y1="72" x2="60" y2="84"/>
      <line x1="74" y1="72" x2="74" y2="84"/><line x1="88" y1="72" x2="88" y2="84"/>
      <line x1="102" y1="72" x2="102" y2="84"/><line x1="114" y1="72" x2="114" y2="84"/></g>
    <rect x="48" y="60" width="30" height="14" rx="2" fill="${c}"/>
    <rect x="52" y="64" width="6" height="6" fill="#e8eef0"/><rect x="62" y="64" width="6" height="6" fill="#e8eef0"/><rect x="70" y="64" width="6" height="6" fill="#e8eef0"/>
    <rect x="82" y="60" width="30" height="14" rx="2" fill="#c8ccc0"/>
    <rect x="86" y="64" width="6" height="6" fill="#eef1f4"/><rect x="96" y="64" width="6" height="6" fill="#eef1f4"/><rect x="104" y="64" width="6" height="6" fill="#eef1f4"/>
    <g fill="#5c5a50"><circle cx="56" cy="76" r="2.6"/><circle cx="72" cy="76" r="2.6"/><circle cx="90" cy="76" r="2.6"/><circle cx="106" cy="76" r="2.6"/></g>`,
  // 11 Europe — data ruling: a gavel on a desk beside stacked case files
  11: (c) => `<rect x="0" y="0" width="120" height="90" fill="#f2ece0"/>
    <rect x="0" y="64" width="120" height="26" fill="#cdc2a6"/>
    <line x1="0" y1="64" x2="120" y2="64" stroke="#b3a884" stroke-width="1.5"/>
    <g stroke="#b9ae90" stroke-width="1">
      <rect x="10" y="47" width="44" height="8" fill="#e8dfc8"/>
      <rect x="12" y="39" width="44" height="8" fill="#ded4ba"/>
      <rect x="14" y="31" width="44" height="8" fill="#d6cbb0"/>
      <line x1="16" y1="35" x2="54" y2="35"/>
      <line x1="16" y1="43" x2="54" y2="43"/>
      <line x1="16" y1="51" x2="54" y2="51"/></g>
    <g fill="${c}">
      <rect x="72" y="26" width="32" height="13" rx="3"/>
      <rect x="85" y="39" width="6" height="24" rx="3"/></g>
    <rect x="68" y="55" width="40" height="9" rx="4.5" fill="#8a7f66"/>`,
};

const sceneSVG = (it) => {
  const fn = SCENES[it.num] || SCENES[1];
  return `<svg class="scene" viewBox="0 0 150 110" width="150" height="110" role="img" aria-label="${esc(it.scene)}"><title>${esc(it.scene)}</title><g transform="scale(1.25 1.2222222)">${fn(ink(it.region))}</g></svg>`;
};

// ---- simple outline world map, small, with eleven numbered dots --------------
const LAND = `
  <path d="M70 96 L120 62 L200 52 L286 66 L304 104 L262 132 L236 170 L206 178 L190 154 L150 140 L118 156 L92 138 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M330 46 L372 40 L386 62 L354 74 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M262 150 L318 148 L336 184 L322 226 L296 238 L276 222 L268 182 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M470 62 L520 50 L560 60 L574 88 L548 108 L506 110 L478 96 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M480 118 L546 112 L600 132 L606 172 L584 214 L556 230 L536 206 L512 176 L478 150 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M572 74 L660 44 L770 40 L872 62 L908 100 L872 138 L812 148 L772 126 L706 140 L646 122 L600 100 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>
  <path d="M792 168 L872 166 L900 196 L878 232 L826 234 L794 208 Z" fill="#cec5a8" stroke="#7d7460" stroke-width="2"/>`;

const DOTS = [
  [1, 505, 76], [2, 120, 54], [3, 852, 82], [4, 644, 104], [5, 556, 152],
  [6, 906, 200], [7, 552, 96], [8, 722, 66], [9, 286, 196], [10, 592, 180],
  [11, 512, 112],
];
const featured = sorted.slice(0, 11);
const byNum = Object.fromEntries(featured.map((f) => [f.num, f]));
const dots = DOTS.map(([n, x, y]) => {
  const r = (byNum[n] && byNum[n].region) || 'Europe';
  return `<circle cx="${x}" cy="${y}" r="20" fill="${ink(r)}"/><text x="${x}" y="${y}" dy="7" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">${n}</text>`;
}).join('');
const mapSVG = `<svg class="map" viewBox="0 0 1000 240" role="img" aria-label="world map with eleven numbered dots"><title>world map with eleven numbered dots</title>${LAND}${dots}</svg>`;

// ---- TWO figures pulled verbatim from featured facts -------------------------
const FIGURES = [
  { v: '480,000', l: 'hectares of forest burned this year' },
  { v: '14 million', l: 'measles jabs given in six weeks' },
];
for (const f of FIGURES)
  if (!sorted.some((s) => s.fact.includes(f.v)))
    console.warn('WARN figure not found verbatim:', f.v);

const list = sorted.slice(11);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>THE WORLD TODAY - Wednesday 18 November 2026</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:1024px; height:1024px; }
  body { background:#f7f3ea; color:#1a1811; overflow:hidden; font-family:'DejaVu Sans', Arial, sans-serif; display:flex; flex-direction:column; padding:13px 26px 11px; }
  .band { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
  .mast { font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:30px; letter-spacing:9px; line-height:1; }
  .kicker { font-size:9px; letter-spacing:4px; color:#7a7362; margin-top:5px; }
  .mapwrap { flex:0 0 auto; width:334px; text-align:right; }
  .mapbox { border:1.5px solid #1a1811; background:#f1ecdf; padding:4px 5px 3px; }
  .mapttl { font-size:7px; font-weight:700; letter-spacing:1.6px; color:#7a7362; margin-bottom:2px; }
  .map { width:100%; height:auto; display:block; }
  .mapcap { font-size:7.5px; letter-spacing:0.8px; text-transform:uppercase; color:#7a7362; margin-top:2px; }
  .date { text-align:center; font-family:'DejaVu Serif', Georgia, serif; font-weight:700; font-size:56px; line-height:1.02; margin-top:3px; }
  .tally { text-align:center; font-size:12px; font-weight:700; letter-spacing:3px; color:#a8281f; margin-top:4px; }
  .hr { border:0; border-top:3px double #1a1811; margin-top:6px; }
  .featured { display:grid; grid-template-columns:repeat(6,1fr); gap:7px; margin-top:7px; }
  .card { border:1px solid #e3dbca; border-top:3px solid var(--cc); border-radius:4px; background:#fffdf8; padding:3px 3px 5px; display:flex; flex-direction:column; align-items:center; overflow:hidden; }
  .card svg.scene { display:block; border:1px solid #e6ded0; border-radius:2px; }
  .card .rg { font-size:7px; font-weight:700; letter-spacing:0.4px; text-transform:uppercase; color:#57503f; margin-top:3px; text-align:center; }
  .card h3 { font-family:'DejaVu Serif', Georgia, serif; font-size:10.5px; font-weight:700; line-height:1.05; margin-top:2px; text-align:center; }
  .card p { font-size:8px; line-height:1.1; color:#514a3a; margin-top:2px; text-align:center; }
  .numhead { text-align:center; font-size:10px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#7a7362; margin-top:7px; }
  .numbers { display:flex; border-top:2px solid #1a1811; border-bottom:2px solid #1a1811; margin-top:3px; }
  .num { flex:1 1 0; text-align:center; padding:5px 0 6px; }
  .num + .num { border-left:1px solid #1a1811; }
  .num .v { font-family:'DejaVu Serif', Georgia, serif; font-size:84px; font-weight:700; line-height:1; white-space:nowrap; }
  .num .l { font-size:9.5px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase; color:#7a7362; margin-top:3px; }
  .list { margin-top:7px; border-top:2px solid #1a1811; padding-top:6px; column-count:2; column-gap:30px; column-rule:1px solid #b3ab95; }
  .item { display:flex; gap:6px; align-items:baseline; font-size:11px; line-height:1.46; break-inside:avoid; }
  .item b { flex:0 0 auto; min-width:17px; text-align:right; font-weight:700; }
  .item .rt { flex:0 0 auto; font-size:7.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.3px; }
  .item .ht { flex:1 1 auto; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .foot { margin-top:auto; border-top:2px solid #1a1811; padding-top:5px; display:flex; justify-content:space-between; gap:14px; font-size:8.5px; letter-spacing:0.7px; text-transform:uppercase; color:#7a7362; }
  .foot .say { color:#a8281f; font-weight:700; }
  #diag { display:none; }
</style>
</head>
<body>
  <div class="band">
    <div class="mastblock">
      <div class="mast">THE WORLD TODAY</div>
      <div class="kicker">INDEPENDENT WORLD EDITION &middot; ${sorted.length} STORIES</div>
    </div>
    <div class="mapwrap">
      <div class="mapbox"><div class="mapttl">THE WORLD &middot; ELEVEN STORIES MARKED</div>${mapSVG}</div>
      <div class="mapcap">The eleven numbered dots mark the featured stories 1&ndash;11</div>
    </div>
  </div>

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

  <div class="numhead">By the numbers</div>
  <div class="numbers">
${FIGURES.map((f) => `    <div class="num"><div class="v">${esc(f.v)}</div><div class="l">${esc(f.l)}</div></div>`).join('\n')}
  </div>

  <div class="list">
${list.map((it) => `    <div class="item"><b style="color:${ink(it.region)}">${it.num}</b><span class="rt" style="color:${ink(it.region)}">${esc(it.region)}</span><span class="ht">${esc(it.headline)}</span></div>`).join('\n')}
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
        scenePx: (function () { var r = document.querySelector('svg.scene').getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); })(),
        dateFs: getComputedStyle(document.querySelector('.date')).fontSize,
        mapW: Math.round(document.querySelector('.map').getBoundingClientRect().width),
        figFs: getComputedStyle(document.querySelector('.num .v')).fontSize
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
      var d = document.querySelector('.date'); if (d.scrollWidth > d.clientWidth + 1) bad.push('date-wide:' + d.scrollWidth);
      document.querySelectorAll('.num .v').forEach(function (x) { if (x.scrollWidth > x.clientWidth + 1) bad.push('figure-wide:' + x.textContent); });
      document.querySelectorAll('.item .ht').forEach(function (x) { if (x.scrollWidth > x.clientWidth + 1) bad.push('list-truncated'); });
      if (out.featured !== 11) bad.push('featured!=' + out.featured);
      if (out.items !== 25) bad.push('items!=' + out.items);
      if (out.dots !== 11) bad.push('dots!=' + out.dots);
      if (out.figs !== 2) bad.push('figs!=' + out.figs);
      if (out.scenePx !== '150x110') bad.push('scene!=' + out.scenePx);
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
