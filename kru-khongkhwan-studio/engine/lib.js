// Paper-cutout storybook engine, 1920x1080. Every frame is a pure function of t.
const W = 1920, H = 1080, INK = '#4a3228', CREAM = '#fbf3e1';
const PAL = ['#e0574f', '#e9b83a', '#3f9e8f', '#f19bb8', '#7cb77a', '#5aa9d6', '#f08a4b'];
const SECCOL = { intro: '#f19bb8', c1: '#f08a4b', c2: '#e9b83a', c3: '#d9a42a', c4: '#e0574f', c5: '#f19bb8', c6: '#3f9e8f', c7: '#a06ad6', c8: '#7cb77a', c9: '#5aa9d6' };
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const span = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const ease = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const easeBack = k => { k = clamp(k); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; };
const FONT = (s, wgt = 700) => `${wgt} ${s}px Mali`;

// ---------- timing ----------
const SEC = {};
TM.secs.forEach(s => SEC[s.id] = s);
function c2t(sec, idx) { const m = sec.cmap; for (let i = 0; i < m.length - 1; i++) if (idx <= m[i + 1][0]) return lerp(m[i][1], m[i + 1][1], (idx - m[i][0]) / Math.max(1, m[i + 1][0] - m[i][0])); return m[m.length - 1][1]; }
function kwIdx(sec, kw, from) { let i = sec.text.indexOf(kw, from); if (i < 0) i = sec.text.indexOf(kw); if (i < 0) { console.error('kw missing', sec.id, kw); return from; } return i; }

// ---------- paper helpers ----------
function torn(w, h, seed, j = 5) {   // a rectangle with torn edges, as a point list
  const r = rng(seed), p = [], step = 14;
  for (let x = 0; x <= w; x += step) p.push([x, (r() - .5) * j]);
  for (let y = 0; y <= h; y += step) p.push([w + (r() - .5) * j, y]);
  for (let x = w; x >= 0; x -= step) p.push([x, h + (r() - .5) * j]);
  for (let y = h; y >= 0; y -= step) p.push([(r() - .5) * j, y]);
  return p;
}
function path(x, p) { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); }
function paperFill(x, p, col, seed) {
  x.save(); path(x, p); x.fillStyle = col; x.fill(); x.clip();
  const r = rng(seed); x.globalAlpha = .06;
  for (let i = 0; i < 260; i++) { x.fillStyle = r() < .5 ? '#000' : '#fff'; x.fillRect(r() * 2000, r() * 400, 2, 1.5); }
  x.restore();
}
function tape(x, cx, cy, ang, seed) {
  x.save(); x.translate(cx, cy); x.rotate(ang); x.globalAlpha = .78;
  const p = torn(110, 34, seed, 4).map(([a, b]) => [a - 55, b - 17]); paperFill(x, p, '#efe3c2', seed); x.restore();
}
// ---------- sprites ----------
const SPR = {};
function stickerSpr(name) {
  if (SPR[name]) return SPR[name];
  const im = IMG[name], pad = 30, c = mk(im.width + pad * 2, im.height + pad * 2), x = c.getContext('2d');
  x.shadowColor = 'rgba(70,45,25,.38)'; x.shadowBlur = 18; x.shadowOffsetY = 10; x.shadowOffsetX = 4;
  x.drawImage(im, pad, pad);
  return (SPR[name] = { c, w: c.width, h: c.height, ih: im.height, iw: im.width, pad });
}
function tagSpr(text, size, col, seed) {
  const key = text + size + col; if (SPR[key]) return SPR[key];
  const m = mk(4, 4).getContext('2d'); m.font = FONT(size);
  const lines = text.split('\n'), lh = size * 1.35, tw = Math.max(...lines.map(l => m.measureText(l).width));
  const w = tw + size * 1.2, h = lh * lines.length + size * .55, pad = 30, c = mk(w + pad * 2, h + pad * 2), x = c.getContext('2d');
  x.translate(pad, pad);
  x.shadowColor = 'rgba(70,45,25,.32)'; x.shadowBlur = 12; x.shadowOffsetY = 6;
  const p = torn(w, h, seed, 6); path(x, p); x.fillStyle = col; x.fill(); x.shadowColor = 'transparent';
  paperFill(x, p, col, seed);
  x.font = FONT(size); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = col === INK ? CREAM : INK;
  lines.forEach((l, i) => x.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * lh + size * .05));
  tape(x, w * .5, 2, (hash(seed) - .5) * .3, seed + 3);
  return (SPR[key] = { c, w: c.width, h: c.height });
}
function cutoutSpr(text, size, seed) {   // newspaper-cutout letters: one paper tile per grapheme
  const key = 'cut' + text + size; if (SPR[key]) return SPR[key];
  const seg = [...new Intl.Segmenter('th', { granularity: 'grapheme' }).segment(text)].map(s => s.segment);
  const m = mk(4, 4).getContext('2d'); m.font = FONT(size);
  const tiles = []; let X = 0; const r = rng(seed);
  for (const g of seg) {
    if (g === ' ') { X += size * .4; continue; }
    const gw = m.measureText(g).width, tw = gw + size * .28, col = PAL[Math.floor(r() * PAL.length)];
    tiles.push({ g, x: X, w: tw, col, rot: (r() - .5) * .16, dy: (r() - .5) * size * .12, light: r() < .35 });
    X += tw - size * .04;
  }
  const h = size * 1.55, pad = 40, c = mk(X + pad * 2, h + pad * 2), x = c.getContext('2d');
  tiles.forEach((tl, i) => {
    x.save(); x.translate(pad + tl.x + tl.w / 2, pad + h / 2 + tl.dy); x.rotate(tl.rot);
    x.shadowColor = 'rgba(60,40,20,.35)'; x.shadowBlur = 10; x.shadowOffsetY = 5;
    const bg = tl.light ? CREAM : tl.col, p = torn(tl.w, h * .92, seed + i, 5).map(([a, b]) => [a - tl.w / 2, b - h * .46]);
    path(x, p); x.fillStyle = bg; x.fill(); x.shadowColor = 'transparent';
    x.font = FONT(size); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = tl.light ? tl.col : '#fffaf0';
    if (tl.light && tl.col === '#e9b83a') x.fillStyle = INK;
    x.fillText(tl.g, 0, size * .12); x.restore();
  });
  return (SPR[key] = { c, w: c.width, h: c.height, tiles, pad });
}
function blit(ctx, s, x, y, o = {}) {   // draw sprite centred at x,y (or anchored at its bottom when o.base)
  const k = o.k ?? 1; if (k <= .001 || (o.alpha ?? 1) <= .001) return;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(k * (o.fx || 1), k);
  const w = o.w || s.w, h = o.h || s.h;
  if (o.base) ctx.drawImage(s.c, -w / 2, -h, w, h); else ctx.drawImage(s.c, -w / 2, -h / 2, w, h);
  ctx.restore();
}
