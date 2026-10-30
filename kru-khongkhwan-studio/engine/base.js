let NOW = 0;
// ท่องกาลเวลา: วิวัฒนาการโขน. A cartoon told with paper-cutout actors. Every frame is a pure function of t.
// lib.js supplies W,H, easing, torn paper, tagSpr, cutoutSpr, stickerSpr, blit, SEC, c2t.
const S = id => SEC[id];
function K(id, kw, n = 0) {            // time a keyword is spoken (n-th occurrence)
  const s = S(id); let i = -1; for (let k = 0; k <= n; k++) i = s.text.indexOf(kw, i + 1);
  if (i < 0) { console.error('kw', id, kw); return s.t0; } return c2t(s, i);
}
const SPEAKER = t => 'none';
function mouth(t) { const f = Math.floor(t * 10) / 10, e = TM.env, i = Math.floor(f * 24); const v = Math.max(e[i] || 0, e[i + 1] || 0); return v > .3; }
const blinkAt = (t, seed) => ((t + hash(seed) * 3) % 3.3) < .13;

// ---------- actors ----------
const ACT = {};   // per-image: scale-independent foot anchor
function anchor(name) {
  if (ACT[name]) return ACT[name];
  const im = IMG[name], c = mk(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0);
  const d = x.getImageData(0, Math.floor(im.height * .8), im.width, Math.ceil(im.height * .2)).data;
  let sx = 0, n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) { sx += (i >> 2) % im.width; n++; }
  return (ACT[name] = { ax: n ? sx / n : im.width / 2 });
}
const REF = { kwan: ['t_kwan_front', 410], jiw: ['t_jiw_front', 400] };
function pose(ch, base, t) {
  const sp = SPEAKER(t) === ch && mouth(t), bl = blinkAt(t, ch.length);
  const P = 't_' + ch + '_';
  if (base === 'front') return sp ? P + 'front_talk' : bl ? P + 'front_blink' : P + 'front';
  if (base === 'side') return sp ? P + 'side_talk' : P + 'side';
  if (base === 'walk' || base === 'run') return ch === 'kwan' && base === 'run' ? P + 'run' : (Math.floor(t * 4.2) % 2 ? P + 'walk_a' : P + 'walk_b');
  if (base === 'point' && ch === 'jiw') return sp ? P + 'point' : P + 'point';
  return P + base;
}
// draw a character: x,y = feet on screen. o.flip faces left (side poses face right)
function actor(ctx, ch, base, t, x, y, o = {}) {
  const name = IMG[base] ? base : pose(ch, base, t), im = IMG[name]; if (!im) { console.error('pose', name); return; }
  const ref = REF[ch] ? IMG[REF[ch][0]] : im, hh = (o.h || (REF[ch] ? REF[ch][1] : 400)), sc = hh / ref.height * (o.k ?? 1);
  if (sc <= .001) return;
  const a = anchor(name), walk = base === 'walk' || base === 'run';
  const ph = x * .013, bob = walk ? -Math.abs(Math.sin(t * 4.2 * Math.PI)) * 10 : (o.still ? 0 : -Math.abs(Math.sin(t * 2.6 + ph)) * 14);
  const kk = o.k ?? 1, sway = o.still ? 0 : Math.sin(t * 1.3 + ph) * .035 + (1 - Math.min(1, kk)) * .5;
  const breathe = walk || o.still ? 1 : 1 + Math.sin(t * 5.2 + ph * 2) * .02;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, y + bob + (o.dy || 0)); ctx.rotate((o.rot || 0) + sway);
  ctx.scale(sc * (o.flip ? -1 : 1) / Math.sqrt(breathe), sc * breathe);
  // soft shadow on the ground
  if (!o.noShadow) { ctx.save(); ctx.scale(1, .22); ctx.fillStyle = 'rgba(40,25,15,.25)'; ctx.beginPath(); ctx.ellipse(0, 0, im.width * .32, im.width * .32, 0, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.shadowColor = 'rgba(50,30,15,.3)'; ctx.shadowBlur = 14 / sc; ctx.shadowOffsetY = 6 / sc;
  ctx.drawImage(im, -a.ax, -im.height - (o.lift || 0) / sc);
  ctx.restore();
}
function prop(ctx, name, x, y, h, o = {}) {   // a sticker centred at x,y (or by its bottom with o.base)
  const im = IMG[name]; if (!im) { console.error('img', name); return; } const sc = h / im.height * (o.k ?? 1); if (sc <= .001 || (o.alpha ?? 1) <= 0) return;
  const fl = o.still ? 0 : 1, kk = o.k ?? 1, t = NOW;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, y + fl * Math.sin(t * 1.8 + x * .01) * 9); ctx.rotate((o.rot || 0) + fl * Math.sin(t * 1.1 + x) * .03 + (1 - Math.min(1, kk)) * .5); ctx.scale(sc * (o.flip ? -1 : 1), sc);
  if (o.filter) ctx.filter = o.filter;
  if (!o.noShadow) { ctx.shadowColor = 'rgba(50,30,15,.32)'; ctx.shadowBlur = 16 / sc; ctx.shadowOffsetY = 8 / sc; }
  ctx.drawImage(im, -im.width / 2, o.base ? -im.height : -im.height / 2); ctx.restore();
}
const pop = (t, t0, d = .45) => easeBack(span(t, t0, t0 + d));
const out = (t, t1, d = .3) => 1 - easeOut(span(t, t1 - d, t1));
const go = (t, a, b, x0, x1) => lerp(x0, x1, ease(span(t, a, b)));
const walking = (t, a, b) => t > a && t < b;

// ---------- background, camera, layers ----------
function bg(ctx, name, t, cam = {}, alpha = 1) {
  const z = cam.z || 1.04, px = cam.x || 0, im = IMG[name];
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(W / 2 - px * .5, H / 2 + (cam.y || 0) * .5); ctx.scale(z, z); ctx.drawImage(im, -W / 2, -H / 2, W, H); ctx.restore();
}
function strip(ctx, name, t, y, o = {}) {   // a foreground strip stretched across the bottom, parallax
  const im = IMG[name], w = (o.w || 2200), h = o.h || w * im.height / im.width, x = W / 2 - (o.px || 0) * 1.4 + (o.dx || 0);
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.drawImage(im, x - w / 2, y - h + (o.dy || 0), w, h); ctx.restore();
}
function vignette(ctx, a = .38) { const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05); v.addColorStop(0, 'rgba(50,25,10,0)'); v.addColorStop(1, `rgba(50,25,10,${a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
function glow(ctx, x, y, r, rgb, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }
function tint(ctx, col) { ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); }
// ---------- effects ----------
function mist(ctx, t, a = .5, y0 = 760) {
  ctx.save(); for (let i = 0; i < 9; i++) { const x = ((i * 300 + t * (18 + i * 3)) % 2600) - 340, y = y0 + Math.sin(i * 2.1 + t * .3) * 60 + (i % 3) * 50;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 380); g.addColorStop(0, `rgba(255,255,255,${a * .45})`); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.save(); ctx.translate(x, y); ctx.scale(1.9, .55); ctx.translate(-x, -y); ctx.fillRect(x - 380, y - 380, 760, 760); ctx.restore(); }
  ctx.restore();
}
function sparkles(ctx, t, cx, cy, rad, n, col = '255,236,160', k = 1, seed = 1) {
  ctx.save(); for (let i = 0; i < n; i++) { const a = hash(i + seed) * 6.28 + t * .3, r = rad * (.3 + .7 * hash(i * 3 + seed)), x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .7;
    const s = Math.max(0, Math.sin(t * 4 + i * 1.7)) * k * (6 + 10 * hash(i + 9)); if (s < .5) continue;
    ctx.fillStyle = `rgba(${col},.95)`; ctx.save(); ctx.translate(x, y); ctx.beginPath(); ctx.moveTo(0, -s * 2); ctx.quadraticCurveTo(0, 0, s * 2, 0); ctx.quadraticCurveTo(0, 0, 0, s * 2); ctx.quadraticCurveTo(0, 0, -s * 2, 0); ctx.quadraticCurveTo(0, 0, 0, -s * 2); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
function notes(ctx, t, x0, y0, k = 1) {
  ctx.save(); ctx.font = FONT(62); ctx.textAlign = 'center';
  for (let i = 0; i < 7; i++) { const ph = (t * .22 + i / 7) % 1; ctx.globalAlpha = Math.sin(ph * Math.PI) * .9 * k; ctx.fillStyle = PAL[i % PAL.length]; ctx.fillText(i % 2 ? '♪' : '♫', x0 + ph * 700 + Math.sin(t * 2 + i) * 40, y0 - ph * 220 + Math.sin(i * 3) * 60); }
  ctx.restore();
}
function rain(ctx, t, a) {
  if (a <= 0) return; ctx.save(); ctx.strokeStyle = `rgba(200,215,235,${.55 * a})`; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  for (let i = 0; i < 160; i++) { const x = (hash(i) * 2100 + t * 90) % 2100 - 90, y = (hash(i + 7) * 1200 + t * 1400 * (.8 + hash(i) * .4)) % 1200 - 60; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 10, y + 38); ctx.stroke(); }
  ctx.restore();
}
function dust(ctx, t, t0, x, y, n = 8, k = 1) {
  const p = span(t, t0, t0 + .9); if (p <= 0 || p >= 1) return;
  ctx.save(); for (let i = 0; i < n; i++) { const a = -Math.PI + (i / (n - 1)) * Math.PI, r = 40 + p * 200 * k * (.6 + .4 * hash(i)); ctx.globalAlpha = (1 - p) * .8; ctx.fillStyle = '#e8d8b8';
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .45, (24 + 30 * p) * k, 0, 7); ctx.fill(); }
  ctx.restore();
}
function burst(ctx, t, t0, x, y, col = '255,220,120', R = 260) {
  const p = span(t, t0, t0 + .7); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.strokeStyle = `rgba(${col},${1 - p})`; ctx.lineWidth = 10 * (1 - p) + 2; ctx.lineCap = 'round';
  for (let i = 0; i < 14; i++) { const a = i / 14 * 6.28, r0 = R * p * .4, r1 = R * (.3 + p); ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); ctx.stroke(); }
  glow(ctx, x, y, R * (1 - p * .5), col, .6 * (1 - p)); ctx.restore();
}
function speedLines(ctx, t, y0, y1, a) { if (a <= 0) return; ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${.5 * a})`; ctx.lineWidth = 4; for (let i = 0; i < 24; i++) { const y = lerp(y0, y1, hash(i)), x = (hash(i + 3) * 2400 - t * 2600) % 2400 + 2400; ctx.beginPath(); ctx.moveTo(x % 2400 - 200, y); ctx.lineTo(x % 2400 + 140, y); ctx.stroke(); } ctx.restore(); }
function bubble(ctx, t, x, y, text, k) {   // speech bubble with hand lettering
  if (k <= .01) return; const s = tagSpr(text, 44, '#fffdf6', text.length + 5); ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = '#fffdf6'; ctx.beginPath(); ctx.moveTo(-20, s.h / 2 - 34); ctx.lineTo(-56, s.h / 2 + 20); ctx.lineTo(16, s.h / 2 - 34); ctx.fill();
  ctx.drawImage(s.c, -s.w / 2, -s.h / 2); ctx.restore();
}
// ---------- titles, info tags, progress, subtitles ----------
const ERAS = [['s1', 'โขนกลางแปลง', '#7cb77a'], ['s2', 'โขนโรงนอก', '#e9b83a'], ['s3', 'โขนโรงใน', '#d9a42a'], ['s4', 'โขนหน้าจอ', '#e0574f'], ['s5', 'โขนฉาก', '#5aa9d6']];
function eraTitle(ctx, t, i, tName) {
  const [id, name] = ERAS[i], s = cutoutSpr(name, 92, i * 31 + 7), sub = tagSpr(['ยุคที่ 1 · สมัยอยุธยา', 'ยุคที่ 2', 'ยุคที่ 3', 'ยุคที่ 4 · อยุธยาตอนปลาย', 'ยุคที่ 5 · รัชกาลที่ 5 – ปัจจุบัน'][i], 40, '#fff3c4', i + 50);
  const k0 = easeBack(span(t, tName - .1, tName + .4)), fk = ease(span(t, tName + 2.2, tName + 2.9));
  const x = lerp(960, 80 + s.w * .55 / 2, fk), y = lerp(330, 92, fk), k = lerp(1.25, .55, fk) * k0;
  blit(ctx, s, x, y, { k, rot: Math.sin(t * 1.4) * .01 });
  if (fk < 1) blit(ctx, sub, 960, 450, { k: easeBack(span(t, tName + .35, tName + .8)) * (1 - fk) });
}
function progress(ctx, t, cur) {
  const x0 = 1300, gap = 135, y = 70;
  ctx.save(); ctx.strokeStyle = 'rgba(74,50,40,.6)'; ctx.lineWidth = 5; ctx.setLineDash([3, 10]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + gap * 4, y); ctx.stroke(); ctx.setLineDash([]);
  ERAS.forEach(([id, name, col], i) => { const on = i === cur, x = x0 + gap * i, r = on ? 30 + 2 * Math.sin(t * 4) : 20;
    ctx.fillStyle = on ? col : i < cur ? '#d8c9a8' : CREAM; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = on ? '#fff' : INK; ctx.font = FONT(on ? 30 : 22); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i + 1, x, y + 2);
    if (on) { ctx.font = FONT(24); ctx.fillStyle = INK; ctx.fillText(name, x, y + 52); } });
  ctx.restore();
}
function tags(ctx, t, list, t1) {   // [[text, time]] stacked top-left under the era title
  let y = 190; list.forEach(([tx, t0], i) => { const s = tagSpr(tx, 42, i % 2 ? '#fff3c4' : CREAM, tx.length * 3 + i);
    const k = easeBack(span(t, t0, t0 + .4)) * out(t, t1, .35); if (k > .01) blit(ctx, s, 60 + s.w / 2 - 30, y + s.h / 2, { k, rot: (hash(i + tx.length) - .5) * .05 }); y += s.h - 16; });
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
  TM.subs.forEach((s, i) => { const nx = TM.subs[i + 1], gap = nx && nx.t0 - s.t1 < .3, end = gap ? nx.t0 : s.t1 + .15;
    if (t >= s.t0 && t < end) blit(ctx, subSpr(s.text), 960, 1012, { alpha: span(t, s.t0, s.t0 + .1) * (gap ? 1 : 1 - span(t, s.t1, s.t1 + .15)) }); });
}
function wipe(ctx, t, tb, col) {
  const d = .45; if (t < tb - d || t > tb + d) return;
  const k = (t - tb + d) / (2 * d), a = k < .5 ? -300 : lerp(-300, W + 300, (k - .5) * 2), b = k < .5 ? lerp(-300, W + 300, k * 2) : W + 300;
  ctx.save(); ctx.shadowColor = 'rgba(40,20,10,.4)'; ctx.shadowBlur = 20;
  const p = [[a, -20]]; for (let y = -20; y <= H + 20; y += 30) p.push([b + Math.sin(y * .05 + tb) * 24 + (hash(y + tb) - .5) * 22, y]); p.push([a, H + 20]);
  paperFill(ctx, p, col, Math.floor(tb)); ctx.restore();
}
function shake(t, t0, amp = 14, d = .5) { const k = 1 - span(t, t0, t0 + d); if (k <= 0 || t < t0) return [0, 0]; return [Math.sin(t * 90) * amp * k, Math.cos(t * 77) * amp * k]; }

