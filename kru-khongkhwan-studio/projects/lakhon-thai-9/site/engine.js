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
const END = TM.total + 2.0;

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
// ---------- build the timeline of pages and items ----------
const PAGES = [];
function build() {
  for (const id of ORDER) {
    const S = SECS[id], sec = SEC[id]; let from = 0;
    S.nameT = sec.t0;
    if (S.name) { const i = sec.text.indexOf(S.name); S.nameT = i >= 0 ? c2t(sec, i) : sec.t0 + 1; }
    S.fly = id === 'intro' ? sec.t0 : Math.max(S.nameT + 1.1, sec.t0 + 2.4);
    S.pages.forEach((P, pi) => {
      const ai = kwIdx(sec, P.at, from); from = ai;
      P.sec = id; P.t0 = pi === 0 ? sec.t0 : c2t(sec, ai) - .2; P.ai = ai;
      P.items.forEach(it => { if (typeof it.t === 'string') it.tx = it.t; it.t = c2t(sec, kwIdx(sec, it.kw, ai)) + (it.d || 0) - .08; });
      if (P.curtain) P.curtainT = c2t(sec, kwIdx(sec, P.curtain, ai));
      PAGES.push(P);
    });
  }
  PAGES.forEach((P, i) => {   // a page lasts until its last item has been seen for a while
    const Q = PAGES[i - 1];
    if (Q && Q.sec === P.sec && Q.items.length) P.t0 = Math.min(Math.max(P.t0, Math.max(...Q.items.map(it => it.t)) + 1.7), SEC[P.sec].t1 - 1.2);
  });
  PAGES.forEach((P, i) => { P.t1 = i + 1 < PAGES.length ? PAGES[i + 1].t0 : END; });
  for (const P of PAGES) {
    const S = SECS[P.sec], minT = (S.fly || 0) + .65;
    P.items.forEach(it => { it.t = clamp(it.t, Math.max(P.t0 + .15, minT), P.t1 - 1.1); });
    layout(P);
  }
}
function layout(P) {
  const imgs = P.items.filter(i => i.a), tags = P.items.filter(i => i.tx && !i.big), bigs = P.items.filter(i => i.big || i.title);
  const x0 = tags.length && imgs.length ? 700 : 110, x1 = P.kru ? 1590 : 1830;
  const n = imgs.length;
  imgs.forEach((it, i) => {
    const sp = stickerSpr(it.a);
    it.h = it.h || 540;
    it.w = it.h * sp.iw / sp.ih;
    it.x = n === 1 ? (x0 + x1) / 2 : lerp(x0 + (x1 - x0) / (2 * n), x1 - (x1 - x0) / (2 * n), i / (n - 1));
    it.y = 935 - (it.h < 420 ? 40 : 0);
  });
  // squeeze if too wide
  const tot = imgs.reduce((a, i) => a + i.w, 0);
  if (tot > (x1 - x0) * .98) imgs.forEach(i => { const k = (x1 - x0) * .98 / tot; i.h *= k; i.w *= k; });
  if (tags.length && !imgs.length) {   // tags alone: a centred stack
    const fs = tags.length > 3 || tags.some(i => i.tx.includes('\n')) ? 50 : 62; let y = tags.length > 3 ? 190 : 260; tags.forEach((it, i) => { it.spr = tagSpr(it.tx, fs, i % 2 ? '#fff3c4' : CREAM, 7 + i * 13 + P.t0); it.x = 960 + (i % 2 ? 60 : -60); it.y = y + it.spr.h / 2; y += it.spr.h - 8; });
  } else {
    let y = 205; tags.forEach((it, i) => { it.spr = tagSpr(it.tx, 46, i % 3 === 1 ? '#fff3c4' : CREAM, 7 + i * 13 + P.t0); it.x = 70 + it.spr.w / 2 - 30 + (i % 2) * 24; it.y = y + it.spr.h / 2; y += it.spr.h - 14; });
  }
  bigs.forEach(it => {
    if (it.title) { it.spr = cutoutSpr(it.title, 104, 31); it.x = 960; it.y = P.sec === 'intro' ? 330 : 360; }
    else { it.spr = tagSpr(it.tx, 66, '#fff3c4', 99); it.x = 960; it.y = 290; }
  });
  imgs.forEach(it => { if (it.label) it.lspr = tagSpr(it.label, 36, INK, it.label.length * 7); });
}
// ---------- drawing ----------
function itemAnim(t, it, P) {
  const k = easeBack(span(t, it.t, it.t + .45)), out = 1 - span(t, P.t1 - .28, P.t1 - .02);
  return { k: k * (out < 1 ? easeOut(out) : 1), on: t >= it.t, wig: (Math.floor(t * 8) % 3 - 1) * .006 };
}
function drawItem(ctx, t, it, P, idx) {
  const A = itemAnim(t, it, P); if (!A.on || A.k <= .001) return;
  const bob = Math.sin(t * 2.2 + idx * 1.7) * 5, sway = Math.sin(t * 1.6 + idx) * .018;
  if (it.a) {
    const s = stickerSpr(it.a), sc = it.h / s.ih;
    ctx.save(); ctx.translate(it.x, it.y + bob * .5);
    ctx.rotate(sway + A.wig + (1 - clamp(A.k)) * .25); ctx.scale(A.k, A.k);
    if (it.spin) { const cy = -s.h * sc / 2; ctx.translate(0, cy); ctx.rotate(-t * 1.6); ctx.drawImage(s.c, -s.w * sc / 2, -s.h * sc / 2, s.w * sc, s.h * sc); }
    else ctx.drawImage(s.c, -s.w * sc / 2, -s.h * sc + s.pad * sc, s.w * sc, s.h * sc);
    ctx.restore();
    if (it.lspr) blit(ctx, it.lspr, it.x, it.y + 6, { k: easeBack(span(t, it.t + .25, it.t + .65)) * Math.min(1, A.k + .001) * .95, rot: (hash(idx) - .5) * .08 });
    if (P.bubbles && t > it.t + .5) drawBubble(ctx, t, it.x + it.w * .32, it.y - it.h - 10, idx);
  } else if (it.title) {
    const s = it.spr, n = s.tiles.length;
    s.tiles.forEach((tl, i) => {
      const k = easeBack(span(t, it.t + i * .045, it.t + i * .045 + .35)) * A.k / Math.max(.001, easeBack(span(t, it.t, it.t + .45)) || 1);
      const kk = Math.min(k, A.k > 0 ? 9 : 0);
      if (kk <= .001) return;
      const sx = it.x - s.w / 2 + s.pad + tl.x + tl.w / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(sx - s.pad - tl.w / 2 - 6, 0, tl.w + s.pad * 2 + 12, H); ctx.clip();
      blit(ctx, s, it.x, it.y + Math.sin(t * 3 + i) * 3, { k: 1 }); ctx.restore();
    });
  } else {
    blit(ctx, it.spr, it.x, it.y + bob * .3, { k: A.k, rot: (hash(it.t) - .5) * .05 + A.wig });
  }
}
function drawBubble(ctx, t, x, y, i) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + i) * 4); ctx.fillStyle = '#fffdf6'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(0, 0, 62, 40, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-18, 34); ctx.lineTo(-34, 62); ctx.lineTo(2, 38); ctx.fill();
  ctx.fillStyle = INK; for (let k = -1; k <= 1; k++) { ctx.globalAlpha = .4 + .6 * (Math.floor(t * 3 + k) % 3 === 0); ctx.beginPath(); ctx.arc(k * 20, 0, 7, 0, 7); ctx.fill(); }
  ctx.restore();
}
function drawNotes(ctx, t) {
  ctx.save(); ctx.font = FONT(64); ctx.textAlign = 'center';
  for (let i = 0; i < 9; i++) {
    const ph = (t * .18 + i / 9) % 1, x = 760 + Math.sin(i * 2.3) * 520 + Math.sin(t + i) * 30, y = 900 - ph * 700;
    ctx.globalAlpha = Math.sin(ph * Math.PI) * .85; ctx.fillStyle = PAL[i % PAL.length];
    ctx.fillText(i % 2 ? '♪' : '♫', x, y);
  }
  ctx.restore();
}
// background with a slow push-in; returns its camera for the lights
function drawBg(ctx, t, name, P, alpha = 1) {
  const im = IMG[name], k = 1.02 + .035 * span(t, P.t0, P.t1 + 4), cam = { k, ox: W / 2 * (1 - k), oy: H / 2 * (1 - k) };
  ctx.save(); ctx.globalAlpha = alpha; ctx.drawImage(im, cam.ox, cam.oy, W * k, H * k); ctx.restore();
  return cam;
}
const P2S = (cam, u, v) => [cam.ox + u * W * cam.k, cam.oy + v * H * cam.k];
function glow(ctx, x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
let DARK = null;
function spotLayer(ctx, dark, spots) {   // dark veil with soft holes
  if (!DARK) DARK = mk(W, H); const x = DARK.getContext('2d');
  x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); x.fillStyle = dark; x.fillRect(0, 0, W, H);
  x.globalCompositeOperation = 'destination-out';
  for (const s of spots) { const g = x.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.save(); x.translate(s.x, s.y); x.scale(1, s.sy || 1); x.translate(-s.x, -s.y); x.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2); x.restore(); }
  ctx.drawImage(DARK, 0, 0);
}
function lights(ctx, t, look, cam, P) {
  ctx.save();
  const fl = i => .75 + .25 * Math.sin(t * 13 + i * 2) * Math.sin(t * 7.3 + i);
  if (look === 'torch') {
    ctx.fillStyle = 'rgba(25,15,45,.22)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    [[.305, .34], [.432, .37], [.603, .37], [.705, .34]].forEach(([u, v], i) => { const [x, y] = P2S(cam, u, v); glow(ctx, x, y, 300, 'rgba(255,140,40,A)', .28 * fl(i)); glow(ctx, x, y, 90, 'rgba(255,210,120,A)', .35 * fl(i + 5)); });
    for (let i = 0; i < 26; i++) { const ph = (t * .4 + hash(i)) % 1, [x, y] = P2S(cam, [.305, .432, .603, .705][i % 4], .33); ctx.fillStyle = `rgba(255,180,80,${(1 - ph) * .8})`; ctx.fillRect(x + Math.sin(t * 3 + i) * 20 * ph, y - ph * 160, 3, 3); }
  } else if (look === 'sun') {
    ctx.globalCompositeOperation = 'soft-light'; const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,220,140,.55)'); g.addColorStop(1, 'rgba(255,170,90,.1)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; glow(ctx, 260, 60, 700, 'rgba(255,230,170,A)', .18);
  } else if (look === 'gold') {
    ctx.globalCompositeOperation = 'lighter'; glow(ctx, 960, 300, 900, 'rgba(255,200,90,A)', .14 + .03 * Math.sin(t * 2));
    for (let i = 0; i < 40; i++) { const x = hash(i) * W, y = hash(i + 50) * H * .8, a = Math.max(0, Math.sin(t * 2.5 + i * 1.9)); ctx.fillStyle = `rgba(255,235,160,${a * .9})`; ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-2, -9 * a, 4, 18 * a); ctx.fillRect(-9 * a, -2, 18 * a, 4); ctx.restore(); }
  } else if (look === 'foot') {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(20,10,20,.45)'); g.addColorStop(.6, 'rgba(20,10,20,.05)'); g.addColorStop(1, 'rgba(20,10,20,.2)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 7; i++) { const [x, y] = P2S(cam, .36 + i * .047, .73); glow(ctx, x, y - 120, 260, 'rgba(255,200,120,A)', .12 * fl(i)); }
  } else if (look === 'lamp') {
    ctx.fillStyle = 'rgba(60,30,70,.18)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; const [x, y] = P2S(cam, .565, .49); glow(ctx, x, y, 520, 'rgba(255,170,70,A)', .26 * fl(1)); glow(ctx, x, y, 120, 'rgba(255,230,150,A)', .4 * fl(2));
  } else if (look === 'sea') {
    ctx.fillStyle = 'rgba(10,25,60,.18)'; ctx.fillRect(0, 0, W, H);
    const ph = (t % 7) / 7; if (ph > .9) { ctx.fillStyle = `rgba(230,240,255,${Math.sin((ph - .9) * 10 * Math.PI) * .35})`; ctx.fillRect(0, 0, W, H); }
  } else if (look === 'spot' || look === 'spotblue' || look === 'stage') {
    const sx = 960 + Math.sin(t * .5) * 160;
    spotLayer(ctx, look === 'spotblue' ? 'rgba(10,20,60,.55)' : 'rgba(15,8,25,.5)', [{ x: sx, y: 640, r: 620, sy: .85 }]);
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(sx, 0, sx, 900); g.addColorStop(0, look === 'spotblue' ? 'rgba(140,180,255,.16)' : 'rgba(255,240,200,.16)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(sx - 60, -10); ctx.lineTo(sx + 60, -10); ctx.lineTo(sx + 520, 1000); ctx.lineTo(sx - 520, 1000); ctx.fill();
    for (let i = 0; i < 40; i++) { const x = sx + (hash(i) - .5) * 700 + Math.sin(t * .7 + i) * 30, y = (hash(i + 9) * 900 + t * 12 * (1 + hash(i))) % 900; ctx.fillStyle = `rgba(255,245,220,${.25 + .35 * hash(i + 3)})`; ctx.beginPath(); ctx.arc(x, y, 1.6 + hash(i) * 2, 0, 7); ctx.fill(); }
  } else if (look === 'multi') {
    const sp = [0, 1, 2].map(i => ({ x: 960 + Math.sin(t * .6 + i * 2.1) * 620, y: 720, r: 380, sy: .7 }));
    spotLayer(ctx, 'rgba(12,8,28,.5)', sp);
    ctx.globalCompositeOperation = 'lighter';
    ['rgba(255,90,120,A)', 'rgba(90,200,255,A)', 'rgba(255,215,90,A)'].forEach((c, i) => { const s = sp[i]; glow(ctx, s.x, s.y, 360, c, .22);
      const g = ctx.createLinearGradient(s.x, 0, s.x, 800); g.addColorStop(0, c.replace('A', .14)); g.addColorStop(1, c.replace('A', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(960 + (i - 1) * 500 - 40, -10); ctx.lineTo(960 + (i - 1) * 500 + 40, -10); ctx.lineTo(s.x + 330, 760); ctx.lineTo(s.x - 330, 760); ctx.fill(); });
  } else if (look === 'tv') {
    ctx.globalCompositeOperation = 'lighter'; const [x, y] = P2S(cam, .515, .37), f = .7 + .3 * Math.sin(t * 9) * Math.sin(t * 3.7);
    glow(ctx, x, y, 700, 'rgba(120,170,255,A)', .2 * f);
  } else if (look === 'tunnel') {
    ctx.globalCompositeOperation = 'lighter'; glow(ctx, 960, 470, 520, 'rgba(255,240,200,A)', .25 + .1 * Math.sin(t * 4));
  } else if (look === 'room') {
    ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,210,150,.35)'; ctx.fillRect(0, 0, W, H);
  }
  ctx.restore();
  // warm vignette everywhere
  ctx.save(); const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(60,30,10,0)'); v.addColorStop(1, 'rgba(60,30,10,.38)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// ---------- header, progress, subtitles ----------
function header(ctx, t, id) {
  const S = SECS[id], sec = SEC[id]; if (!S.n) return;
  const s = cutoutSpr(`${S.n}  ${S.name}`, 78, S.n * 17);
  const k0 = easeBack(span(t, sec.t0 + .1, sec.t0 + .6)), fk = ease(span(t, S.fly, S.fly + .6));
  const big = 1.45, x = lerp(960, 60 + s.w * .6 / 2, fk), y = lerp(470, 92, fk), k = lerp(big, .6, fk) * k0;
  if (fk < 1) { ctx.save(); ctx.fillStyle = `rgba(40,20,10,${.35 * (1 - fk) * k0})`; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  blit(ctx, s, x, y, { k, rot: Math.sin(t * 1.3) * .01 });
  // little badge "ประเภทที่ N"
  if (fk < .3) blit(ctx, tagSpr(`ประเภทที่ ${S.n}`, 44, '#fff3c4', S.n), 960, 300, { k: easeBack(span(t, sec.t0 + .35, sec.t0 + .8)) * (1 - fk / .3) });
}
function progress(ctx, t, id) {
  const S = SECS[id]; if (!S.n) return;
  const x0 = 1330, gap = 62, y = 70;
  ctx.save();
  ctx.strokeStyle = 'rgba(74,50,40,.55)'; ctx.lineWidth = 4; ctx.setLineDash([2, 9]); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + gap * 8, y); ctx.stroke(); ctx.setLineDash([]);
  for (let i = 1; i <= 9; i++) {
    const cur = i === S.n, past = i < S.n, x = x0 + gap * (i - 1), r = cur ? 27 + 2 * Math.sin(t * 4) : 19;
    ctx.fillStyle = cur ? SECCOL['c' + i] : past ? '#d8c9a8' : '#fbf3e1'; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = cur ? '#fff' : INK; ctx.font = FONT(cur ? 30 : 22); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i, x, y + 2);
  }
  ctx.restore();
}
const SUBS = {};
function subSpr(text) {
  if (SUBS[text]) return SUBS[text];
  const m = mk(4, 4).getContext('2d'); m.font = FONT(44, 600); const tw = m.measureText(text).width;
  const w = tw + 90, h = 82, c = mk(w + 40, h + 40), x = c.getContext('2d'); x.translate(20, 20);
  x.shadowColor = 'rgba(40,25,15,.35)'; x.shadowBlur = 12; x.shadowOffsetY = 5;
  const p = torn(w, h, text.length, 7); path(x, p); x.fillStyle = 'rgba(253,247,232,.96)'; x.fill(); x.shadowColor = 'transparent';
  x.font = FONT(44, 600); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK; x.fillText(text, w / 2, h / 2 + 3);
  return (SUBS[text] = { c, w: c.width, h: c.height });
}
function subtitles(ctx, t) {
  TM.subs.forEach((s, i) => { const nx = TM.subs[i + 1], gap = nx && nx.t0 - s.t1 < .3; const end = gap ? nx.t0 : s.t1 + .15;
    if (t >= s.t0 && t < end) { const k = span(t, s.t0, s.t0 + .1) * (gap ? 1 : 1 - span(t, s.t1, s.t1 + .15)); blit(ctx, subSpr(s.text), 960, 1012, { alpha: k }); } });
}
// ---------- special beats ----------
function curtain(ctx, t, tc) {
  const k = ease(span(t, tc - .1, tc + .5)) * (1 - ease(span(t, tc + 1.3, tc + 1.9))); if (k <= 0) return;
  const s = stickerSpr('all_curtain'), h = H * 1.12, w = h * s.iw / s.ih * 1.05;
  blit(ctx, s, lerp(-w / 2, W / 2 - w / 2 + 30, k), H / 2, { w: s.w * h / s.ih, h: s.h * h / s.ih });
  blit(ctx, s, lerp(W + w / 2, W / 2 + w / 2 - 30, k), H / 2, { w: s.w * h / s.ih, h: s.h * h / s.ih, fx: -1 });
}
function recap(ctx, t, P) {
  RECAP.forEach(([a, lb], i) => {
    const row = i < 5 ? 0 : 1, col = row ? i - 5 : i, n = row ? 4 : 5, x = 960 + (col - (n - 1) / 2) * 340, y = row ? 790 : 430;
    const t0 = P.t0 + .3 + i * .42, k = easeBack(span(t, t0, t0 + .4)) * (1 - easeOut(span(t, P.t1 - .3, P.t1))); if (k <= 0) return;
    const card = tagSpr(' \n \n \n \n ', 58, i % 2 ? '#fff3c4' : CREAM, 70 + i);
    ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i) - .5) * .08 + Math.sin(t * 2 + i) * .01); ctx.scale(k, k);
    ctx.drawImage(card.c, -150, -170, 300, 340);
    const s = stickerSpr(a), hh = 230, ww = hh * s.w / s.h; ctx.drawImage(s.c, -ww / 2, -150, ww, hh);
    ctx.font = FONT(36); ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(lb, 0, 128);
    ctx.fillStyle = SECCOL['c' + (i + 1)]; ctx.beginPath(); ctx.arc(-120, -140, 30, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = FONT(34); ctx.fillText(i + 1, -120, -128);
    ctx.restore();
  });
  blit(ctx, cutoutSpr('ละครไทย 9 แบบ', 70, 5), 960, 120, { k: easeBack(span(t, P.t0, P.t0 + .5)) * (1 - easeOut(span(t, P.t1 - .3, P.t1))) });
}
function wipe(ctx, t, tb, col) {
  const d = .45; if (t < tb - d || t > tb + d) return;
  const k = (t - tb + d) / (2 * d), a = k < .5 ? -300 : lerp(-300, W + 300, (k - .5) * 2), b = k < .5 ? lerp(-300, W + 300, k * 2) : W + 300;
  ctx.save(); ctx.shadowColor = 'rgba(40,20,10,.4)'; ctx.shadowBlur = 20;
  const p = [[a, -20]]; for (let y = -20; y <= H + 20; y += 30) p.push([b + Math.sin(y * .05 + tb) * 24 + (hash(y + tb) - .5) * 22, y]); p.push([a, H + 20]);
  paperFill(ctx, p, col, Math.floor(tb)); ctx.restore();
}
// ---------- frame ----------
function pageAt(t) { let P = PAGES[0]; for (const q of PAGES) if (t >= q.t0) P = q; return P; }
function drawFrame(ctx, t) {
  const P = pageAt(t), S = SECS[P.sec], i = PAGES.indexOf(P), prev = PAGES[i - 1];
  const bgName = P.bg || S.bg, look = P.light || (P.bg && P.bg !== S.bg && !P.light ? S.light : S.light);
  ctx.fillStyle = '#f4ead4'; ctx.fillRect(0, 0, W, H);
  let cam = drawBg(ctx, t, bgName, P);
  const pb = prev && prev.sec === P.sec ? (prev.bg || SECS[prev.sec].bg) : null;
  if (pb && pb !== bgName && t < P.t0 + .6) drawBg(ctx, t, pb, prev, 1 - ease(span(t, P.t0, P.t0 + .6)));
  lights(ctx, t, look, cam, P);
  if (P.notes) drawNotes(ctx, t);
  if (P.recap) recap(ctx, t, P);
  P.items.forEach((it, j) => { if (it.a) drawItem(ctx, t, it, P, j); });
  P.items.forEach((it, j) => { if (!it.a) drawItem(ctx, t, it, P, j); });
  if (P.kru) {
    const s = stickerSpr(P.kru), h = 430, sc = h / s.ih, k = easeOut(span(t, P.t0 + .2, P.t0 + .8)) * (1 - easeOut(span(t, P.t1 - .35, P.t1)));
    ctx.save(); ctx.translate(1770 + (1 - k) * 360, 958 + Math.sin(t * 2.4) * 4); ctx.rotate(Math.sin(t * 1.8) * .02 - (1 - k) * .3);
    ctx.drawImage(s.c, -s.w * sc / 2, -s.h * sc + s.pad * sc, s.w * sc, s.h * sc); ctx.restore();
  }
  if (P.curtainT) curtain(ctx, t, P.curtainT);
  header(ctx, t, P.sec); progress(ctx, t, P.sec);
  subtitles(ctx, t);
  // watermark
  ctx.save(); ctx.globalAlpha = .5; ctx.drawImage(IMG.logo_round, 34, H - 112, 78, 78); ctx.restore();
  for (const id of ORDER.slice(1)) wipe(ctx, t, SEC[id].t0, SECCOL[id]);
  if (t > TM.total) { ctx.fillStyle = `rgba(30,18,10,${span(t, TM.total + .5, END)})`; ctx.fillRect(0, 0, W, H); }
}
// ---------- sound cues ----------
function sfxEvents() {
  const E = [], add = (t, type, g = 1) => E.push({ t: +t.toFixed(3), type, g });
  for (const id of ORDER.slice(1)) { add(SEC[id].t0 - .35, 'whoosh', 1); add(SEC[id].t0 + .1, 'pop', .8); add(SECS[id].fly, 'whoosh', .4); }
  PAGES.forEach((P, i) => {
    if (i && PAGES[i - 1].sec === P.sec) add(P.t0, 'whoosh', .35);
    if (P.kru) add(P.t0 + .25, 'pop', .5);
    P.items.forEach(it => { if (it.a) add(it.t, 'pop', .75); else if (it.title) add(it.t, 'sparkle', .8); else { add(it.t, 'pop', .45); add(it.t + .05, 'scribble', .35); } });
    if (P.curtainT) add(P.curtainT - .1, 'whoosh', .8), add(P.curtainT + 1.3, 'whoosh', .6);
    if (P.recap) RECAP.forEach((_, j) => add(P.t0 + .3 + j * .42, 'pop', .6));
  });
  return E.sort((a, b) => a.t - b.t);
}
