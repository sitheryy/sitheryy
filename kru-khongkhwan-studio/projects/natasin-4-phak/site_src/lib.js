// Crayon / coloured-pencil drawing kit. Every frame is a pure function of time t.
const W = 1080, H = 1920, FPS = 24;
const INK = '#4a3a33', PAPER = '#fdf6e8';
const RC = {
  north:   { main: '#7cb77a', light: '#d3ebc7', dark: '#3f7a48', name: 'ภาคเหนือ' },
  central: { main: '#f2b445', light: '#fbe5ab', dark: '#b97a1c', name: 'ภาคกลาง' },
  isan:    { main: '#ee8a68', light: '#fad0bd', dark: '#b8553a', name: 'ภาคอีสาน' },
  south:   { main: '#5cb1d8', light: '#c3e4f3', dark: '#2f78a0', name: 'ภาคใต้' },
};
const REGIONS = ['north', 'central', 'isan', 'south'];

function rng(seed) { let a = (seed * 2654435761) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hash(n) { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
function vnoise(x, seed) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (hash(i + seed * 17.3) * (1 - u) + hash(i + 1 + seed * 17.3) * u) * 2 - 1; }
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const easeBack = k => { k = clamp(k); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const span = (t, a, b) => clamp((t - a) / (b - a));

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }

// ---- wax texture: a colour tile with tiny holes so the paper shows through, like crayon on rough paper
const PAT = {};
let patCtx = null;
function pat(color) {
  if (PAT[color]) return PAT[color];
  const s = 160, c = mkCanvas(s, s), x = c.getContext('2d');
  x.fillStyle = color; x.fillRect(0, 0, s, s);
  const r = rng(color.length * 31 + parseInt(color.slice(1), 16) % 997);
  x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 1500; i++) { x.globalAlpha = .25 + r() * .6; x.fillRect(r() * s, r() * s, 1 + r() * 2.2, 1 + r() * 1.2); }
  x.globalCompositeOperation = 'source-atop'; x.globalAlpha = .18; x.fillStyle = '#000';
  for (let i = 0; i < 260; i++) x.fillRect(r() * s, r() * s, 1, 1);
  x.globalAlpha = .22; x.fillStyle = '#fff';
  for (let i = 0; i < 260; i++) x.fillRect(r() * s, r() * s, 1.5, 1);
  if (!patCtx) patCtx = mkCanvas(2, 2).getContext('2d');
  return (PAT[color] = patCtx.createPattern(c, 'repeat'));
}

// resample a polyline into short steps and push each point sideways by smooth noise: a hand-drawn wobble
function wob(pts, closed, amp, seed, step = 9) {
  const out = []; const P = closed ? [...pts, pts[0]] : pts; let s = 0;
  for (let i = 0; i < P.length - 1; i++) {
    const [x0, y0] = P[i], [x1, y1] = P[i + 1], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(L / step));
    const nx = -(y1 - y0) / (L || 1), ny = (x1 - x0) / (L || 1);
    for (let k = 0; k < n; k++) {
      const f = k / n, d = vnoise((s + f * L) * .03, seed) * amp;
      out.push([x0 + (x1 - x0) * f + nx * d, y0 + (y1 - y0) * f + ny * d]);
    }
    s += L;
  }
  const last = P[P.length - 1]; out.push([last[0] + vnoise(s * .03, seed) * amp * .3, last[1]]);
  return out;
}
function polyPath(ctx, pts, closed) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]); if (closed) ctx.closePath(); }

// a crayon line: two wobbly waxy passes
function cline(ctx, pts, o = {}) {
  const seed = o.seed || 1, w = o.width || 6, closed = !!o.closed;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = pat(o.color || INK);
  const passes = o.passes || 2;
  for (let p = 0; p < passes; p++) {
    ctx.globalAlpha = (o.alpha ?? 1) * (p ? .55 : .92); ctx.lineWidth = w * (p ? .55 : 1);
    polyPath(ctx, wob(pts, closed, (o.jit ?? 1.6) * (p ? 1.6 : 1), seed + p * 7.7), false); ctx.stroke();
  }
  ctx.restore();
}
// crayon fill: hatching clipped to a shape (pathFn builds the path)
function cfill(ctx, pathFn, color, o = {}) {
  const seed = o.seed || 3, r = rng(seed), gap = o.gap || 5.5, ang = o.ang ?? -0.62;
  ctx.save(); pathFn(ctx); ctx.clip();
  const b = o.bbox || [-2000, -2000, 2000, 2000];
  const cx = (b[0] + b[2]) / 2, cy = (b[1] + b[3]) / 2, R = Math.hypot(b[2] - b[0], b[3] - b[1]) / 2 + 10;
  ctx.translate(cx, cy); ctx.rotate(ang);
  ctx.fillStyle = pat(color); ctx.globalAlpha = o.base ?? .55; ctx.fillRect(-R, -R, 2 * R, 2 * R);   // soft underlayer
  ctx.strokeStyle = pat(color); ctx.lineCap = 'round';
  for (let y = -R; y < R; y += gap * (0.8 + r() * .4)) {
    ctx.globalAlpha = (o.alpha ?? .8) * (.6 + r() * .4); ctx.lineWidth = gap * (1.0 + r() * .6);
    ctx.beginPath(); const j = (r() - .5) * 3; ctx.moveTo(-R, y + j); ctx.lineTo(R, y - j + (r() - .5) * 3); ctx.stroke();
  }
  ctx.restore();
}
function fillShape(ctx, pts, color, o = {}) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  cfill(ctx, c => polyPath(c, pts, true), color, { ...o, bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] });
}
// fill + outline of a closed shape in one call
function shape(ctx, pts, fill, line, o = {}) {
  if (fill) fillShape(ctx, wob(pts, true, o.fj ?? 1.2, (o.seed || 1) + 3), fill, o);
  if (line) cline(ctx, pts, { closed: true, color: line, width: o.lw || 4.5, seed: o.seed || 1, jit: o.jit });
}
// geometry helpers
function ell(cx, cy, rx, ry, n = 40, a0 = 0, a1 = Math.PI * 2) { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; }
function rrect(x, y, w, h, r = 18) { const p = []; const c = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + Math.PI / 2 * i / 6; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  c(x + w - r, y + r, -Math.PI / 2); c(x + w - r, y + h - r, 0); c(x + r, y + h - r, Math.PI / 2); c(x + r, y + r, Math.PI); return p; }
function bez(p0, p1, p2, p3, n = 16) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }
function quad(p0, p1, p2, n = 14) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]]); } return o; }
const dot = (ctx, x, y, r, color, seed = 1) => shape(ctx, ell(x, y, r, r, 14), color, null, { seed, gap: 3, base: .9 });

// ---- sprites: a drawing cached in 3 slightly different hand-drawn takes; frames cycle them ("boiling" crayon at 8 fps)
function sprite(w, h, fn, variants = 3, scale = 1) {
  const out = [];
  for (let v = 0; v < variants; v++) {
    const c = mkCanvas(w * scale, h * scale), x = c.getContext('2d');
    x.scale(scale, scale); x.translate(w / 2, h / 2); fn(x, 11 + v * 101); out.push(c);
  }
  return { w, h, c: out, scale };
}
const BOIL = 8;
function boil(t, n, off = 0) { return ((Math.floor(t * BOIL) + off) % n + n) % n; }
// draw sprite centred at x,y
function put(ctx, spr, t, x, y, o = {}) {
  const k = o.scale ?? 1; if (k <= 0.001 || (o.alpha ?? 1) <= 0.001) return;
  ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(k, k * (o.sy ?? 1));
  ctx.globalAlpha = o.alpha ?? 1;
  const c = spr.c[o.still ? 0 : boil(t, spr.c.length, o.off || 0)];
  ctx.drawImage(c, -spr.w / 2, -spr.h / 2, spr.w, spr.h);
  ctx.restore();
}

// ---- crayon lettering
const FONT = 'Mali';
function textSpr(str, size, color, o = {}) {
  const weight = o.weight || 700, font = `${weight} ${size}px ${o.font || FONT}`;
  const m = mkCanvas(4, 4).getContext('2d'); m.font = font;
  const lines = String(str).split('\n'), lh = size * (o.lh || 1.45);
  const tw = Math.max(...lines.map(l => m.measureText(l).width));
  const w = tw + size * .6 + (o.padX || 0) * 2, h = lh * lines.length + size * .5;
  return sprite(w, h, (x, seed) => {
    x.font = font; x.textAlign = o.align || 'center'; x.textBaseline = 'middle';
    const ax = o.align === 'left' ? -w / 2 + size * .3 + (o.padX || 0) : 0;
    lines.forEach((l, i) => {
      const y = (i - (lines.length - 1) / 2) * lh, r = rng(seed + i);
      if (o.halo) { x.save(); x.strokeStyle = o.halo; x.lineWidth = size * .22; x.lineJoin = 'round'; x.globalAlpha = .95; x.strokeText(l, ax, y); x.restore(); }
      x.fillStyle = pat(color); x.globalAlpha = 1; x.fillText(l, ax + (r() - .5) * 1.2, y + (r() - .5) * 1.2);
      x.globalAlpha = .55; x.fillText(l, ax + 1.1, y + .8);
      x.globalAlpha = .35; x.strokeStyle = color; x.lineWidth = 1.2; x.strokeText(l, ax, y);
    });
  });
}
// cached text sprites by key
const TXT = {};
function T(key, str, size, color, o) { return TXT[key] || (TXT[key] = textSpr(str, size, color, o)); }
// reveal a sprite left-to-right as if written (k 0..1)
function putWrite(ctx, spr, t, x, y, k, o = {}) {
  if (k <= 0) return; const s = o.scale ?? 1;
  ctx.save(); ctx.beginPath(); ctx.rect(x - spr.w * s / 2 - 4, y - spr.h * s / 2 - 20, (spr.w * s + 8) * clamp(k), spr.h * s + 40); ctx.clip();
  put(ctx, spr, t, x, y, o); ctx.restore();
}

// ---- paper
let PAPERC = null;
function paper() {
  if (PAPERC) return PAPERC;
  const c = mkCanvas(W, H), x = c.getContext('2d');
  x.fillStyle = PAPER; x.fillRect(0, 0, W, H);
  const id = x.getImageData(0, 0, W, H), d = id.data, r = rng(7);
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - .5) * 13;
    d[i] += n; d[i + 1] += n; d[i + 2] += n * .9;
  }
  x.putImageData(id, 0, 0);
  for (let i = 0; i < 40; i++) { const gx = r() * W, gy = r() * H, gr = 80 + r() * 260, gg = x.createRadialGradient(gx, gy, 0, gx, gy, gr); gg.addColorStop(0, `rgba(${r() < .5 ? '255,250,240' : '200,170,130'},0.035)`); gg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gg; x.fillRect(gx - gr, gy - gr, gr * 2, gr * 2); }
  const g = x.createRadialGradient(W / 2, H / 2, H * .25, W / 2, H / 2, H * .75);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(120,90,60,0.10)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  return (PAPERC = c);
}
