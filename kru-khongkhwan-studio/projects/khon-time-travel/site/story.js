// ท่องกาลเวลา: วิวัฒนาการโขน. A cartoon told with paper-cutout actors. Every frame is a pure function of t.
// lib.js supplies W,H, easing, torn paper, tagSpr, cutoutSpr, stickerSpr, blit, SEC, c2t.
const S = id => SEC[id];
function K(id, kw, n = 0) {            // time a keyword is spoken (n-th occurrence)
  const s = S(id); let i = -1; for (let k = 0; k <= n; k++) i = s.text.indexOf(kw, i + 1);
  if (i < 0) { console.error('kw', id, kw); return s.t0; } return c2t(s, i);
}
const SPEAKER = t => (t < S('s1').t0 || t >= S('outro').t0) ? 'kwan' : 'jiw';
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
  const name = base.startsWith('t_') ? base : pose(ch, base, t), im = IMG[name]; if (!im) { console.error('pose', name); return; }
  const ref = REF[ch] ? IMG[REF[ch][0]] : im, hh = (o.h || (REF[ch] ? REF[ch][1] : 400)), sc = hh / ref.height * (o.k ?? 1);
  if (sc <= .001) return;
  const a = anchor(name), walk = base === 'walk' || base === 'run';
  const bob = walk ? -Math.abs(Math.sin(t * 4.2 * Math.PI)) * 10 : (o.still ? 0 : Math.sin(t * 2.2 + x * .01) * 3);
  const breathe = walk || o.still ? 1 : 1 + Math.sin(t * 2.6 + x) * .008;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, y + bob + (o.dy || 0)); if (o.rot) ctx.rotate(o.rot);
  ctx.scale(sc * (o.flip ? -1 : 1), sc * breathe);
  // soft shadow on the ground
  if (!o.noShadow) { ctx.save(); ctx.scale(1, .22); ctx.fillStyle = 'rgba(40,25,15,.25)'; ctx.beginPath(); ctx.ellipse(0, 0, im.width * .32, im.width * .32, 0, 0, 7); ctx.fill(); ctx.restore(); }
  ctx.shadowColor = 'rgba(50,30,15,.3)'; ctx.shadowBlur = 14 / sc; ctx.shadowOffsetY = 6 / sc;
  ctx.drawImage(im, -a.ax, -im.height - (o.lift || 0) / sc);
  ctx.restore();
}
function prop(ctx, name, x, y, h, o = {}) {   // a sticker centred at x,y (or by its bottom with o.base)
  const im = IMG[name]; if (!im) { console.error('img', name); return; } const sc = h / im.height * (o.k ?? 1); if (sc <= .001 || (o.alpha ?? 1) <= 0) return;
  ctx.save(); ctx.globalAlpha = o.alpha ?? 1; ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot); ctx.scale(sc * (o.flip ? -1 : 1), sc);
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

// ======================= SCENES =======================
const TIMES = {};
function init() {
  const T = TIMES;
  // intro
  T.music = K('intro', 'เสียงดนตรีไทย'); T.train = K('intro', 'ขบวนรถไฟฟ้า'); T.mitti = K('intro', 'ทะลุมิติ'); T.jiw = K('intro', 'พี่โขนจิ๋ว');
  T.travel = K('intro', 'ผจญภัย'); T.title = K('intro', 'วิวัฒนาการ'); T.go = K('intro', 'ไปดูกันเลย'); T.anc = K('intro', 'บรรพบุรุษ');
  // s1
  T.s1n = K('s1', 'โขนกลางแปลง'); T.ayut = K('s1', 'สมัยอยุธยา'); T.nostage = K('s1', 'ไม่มีเวที'); T.nospot = K('s1', 'ไม่มีไฟ'); T.nomic = K('s1', 'ไม่มีไมโคร');
  T.grass = K('s1', 'สนามหญ้า'); T.army = K('s1', 'กองทัพยักษ์'); T.ling = K('s1', 'กองทัพลิง'); T.fight = K('s1', 'วิ่งไล่รบ'); T.drum = K('s1', 'กลองทัด');
  T.noline = K('s1', 'ไม่มีบทพูด'); T.phak = K('s1', 'คนพากย์'); T.piphat = K('s1', 'วงปี่พาทย์'); T.action = K('s1', 'หนังแอคชั่น');
  // s2
  T.s2n = K('s2', 'โขนโรงนอก'); T.nangrao = K('s2', 'นั่งราว'); T.rail = K('s2', 'นั่งราวไม้ไผ่'); T.roof = K('s2', 'หลังคาคลุม'); T.rain = K('s2', 'ฝนตก');
  // s3
  T.s3n = K('s3', 'โขนโรงใน'); T.fine = K('s3', 'ประณีตงดงาม'); T.palace = K('s3', 'พระราชฐาน'); T.train3 = K('s3', 'ฝึกซ้อม'); T.grace = K('s3', 'อ่อนช้อย');
  T.sing = K('s3', 'ขับร้อง'); T.mix = K('s3', 'ผสมผสาน');
  // s4
  T.s4n = K('s4', 'โขนหน้าจอ'); T.late = K('s4', 'อยุธยาตอนปลาย'); T.cloth = K('s4', 'ผ้าขาว'); T.paint = K('s4', 'วาดรูป'); T.battle = K('s4', 'รบกัน');
  T.puppet = K('s4', 'เชิดหนังใหญ่'); T.dance4 = K('s4', 'ร่ายรำ'); T.funny = K('s4', 'เฮฮา'); T.joke = K('s4', 'มุกตลก'); T.laugh = K('s4', 'หัวเราะ');
  // s5
  T.wow = K('s5', 'ว้าว'); T.s5n = K('s5', 'โขนฉาก'); T.r5 = K('s5', 'รัชกาลที่ 5'); T.royal = K('s5', 'โขนพระราชทาน'); T.real = K('s5', 'สมจริง'); T.change = K('s5', 'เปลี่ยนฉาก');
  T.magic = K('s5', 'เสกได้'); T.fly = K('s5', 'ยักษ์เหาะ'); T.arrow = K('s5', 'ยิงศร'); T.costume = K('s5', 'ชุดแต่งกาย'); T.gold = K('s5', 'หัวโขน');
  T.light = K('s5', 'แสง สี เสียง'); T.world = K('s5', 'ทั่วโลก');
  // outro
  T.back = K('outro', 'รถไฟฟ้าวิเศษ'); T.bell = K('outro', 'ระฆัง'); T.smile = K('outro', 'ส่งยิ้ม'); T.vanish = K('outro', 'หายไป'); T.mask = K('outro', 'หัวโขนจิ๋ว');
  T.years = K('outro', 'ผ่านไปกี่ร้อยปี'); T.e1 = K('outro', 'จากสนามหญ้า'); T.e2 = K('outro', 'สู่โรงละครหลวง'); T.e3 = K('outro', 'จนถึงเวที'); T.alive = K('outro', 'มีชีวิตชีวา');
  T.soul = K('outro', 'จิตวิญญาณ'); T.like = K('outro', 'กดไลก์'); T.keep = K('outro', 'อนุรักษ์'); T.bye = K('outro', 'ลาไปก่อน'); T.sawasdee = K('outro', 'สวัสดีค่ะ');
  console.log(JSON.stringify(Object.fromEntries(Object.entries(T).map(([k, v]) => [k, +v.toFixed(1)]))));
}

function intro(ctx, t) {
  const T = TIMES, inTrain = t > T.travel - .2;
  if (!inTrain) {
    const cam = { x: lerp(-80, 80, span(t, 0, T.travel)), z: 1.04 + .02 * span(t, 0, 20) };
    bg(ctx, 't_bg_station_night', t, cam);
    glow(ctx, 330, 330, 300, '255,220,150', .12 + .03 * Math.sin(t * 3));
    if (t > T.music - .3) notes(ctx, t, 1250, 640, span(t, T.music - .3, T.music + .6) * (1 - span(t, T.train - 1, T.train)));
    mist(ctx, t, .55 + .25 * span(t, T.music, T.music + 2));
    // train glides in and stops, doors open
    const tx = go(t, T.train - .3, T.train + 2.2, 2700, 1180), open = t > T.train + 2.6;
    if (t > T.train - .4) { prop(ctx, open ? 't_train_open' : 't_train_side', tx, 820, 470, { base: 1 }); if (open) glow(ctx, tx - 80, 700, 280, '255,200,120', .35); speedLines(ctx, t, 520, 820, 1 - span(t, T.train + 1.2, T.train + 2.2)); }
    if (open) sparkles(ctx, t, tx - 80, 650, 220, 18, '255,236,160', span(t, T.train + 2.6, T.train + 3.2), 3);
    // Kwan walks in, then stands and talks
    const kx = go(t, 0, 3.2, -200, 760);
    if (t < 3.2) actor(ctx, 'kwan', 'walk', t, kx, 900, { flip: false });
    else if (t > T.train - .4 && t < T.train + 2.4) actor(ctx, 'kwan', 'side', t, kx, 900);
    else if (t > T.jiw - .5) actor(ctx, 'kwan', t < T.jiw + 2.5 ? 't_kwan_wow' : 'front', t, kx, 900);
    else actor(ctx, 'kwan', 'front', t, kx, 900);
    // Phi Khon Jiw hops out of the doors
    if (t > T.jiw - .6) {
      const j0 = T.jiw - .6, jp = span(t, j0, j0 + .9), jx = lerp(1110, 960, jp), jy = 840 + (jp < 1 ? -Math.sin(jp * Math.PI) * 230 : 0);
      if (jp < 1) actor(ctx, 'jiw', 't_jiw_jump', t, jx, jy, { flip: true, noShadow: 1 });
      else actor(ctx, 'jiw', t < j0 + 3.2 ? 't_jiw_wave' : 'front', t, 960, 900);
      dust(ctx, t, j0 + .9, 960, 900, 7, .6);
      if (t < j0 + 3.6) bubble(ctx, t, 1180, 480, 'สวัสดีจ้า!', pop(t, j0 + 1, .35) * out(t, j0 + 3.6));
    }
    strip(ctx, 't_fg_station', t, 1100, { w: 520, dx: -760, px: cam.x });
    tint(ctx, 'rgba(20,30,70,.16)');
  } else {
    // inside the magic train, the time tunnel races past the windows
    const k = span(t, T.travel - .2, T.travel + .6);
    bg(ctx, 't_bg_train_inside', t, { z: 1.06 + Math.sin(t * 7) * .004, x: Math.sin(t * 9) * 6 });
    speedLines(ctx, t, 260, 640, .8);
    sparkles(ctx, t, 960, 420, 800, 30, '255,236,160', 1, 11);
    actor(ctx, 'kwan', 't_kwan_sit', t, 560, 900, { still: 1 });
    actor(ctx, 'jiw', t < T.go ? 'front' : 't_jiw_point', t, 1240, 900);
    prop(ctx, 'all_clock', 960, 330, 300, { rot: -t * 3, k: pop(t, T.travel), noShadow: 1, alpha: .95 });
    const tl = cutoutSpr('ท่องกาลเวลา: วิวัฒนาการโขน', 84, 77);
    blit(ctx, tl, 960, 540, { k: easeBack(span(t, T.title, T.title + .5)) * out(t, S('s1').t0 - .3), rot: Math.sin(t * 2) * .02 });
    if (t > T.anc) { const f = span(t, S('s1').t0 - 1.2, S('s1').t0); ctx.fillStyle = `rgba(255,250,235,${f})`; ctx.fillRect(0, 0, W, H); }
    ctx.fillStyle = `rgba(255,250,235,${1 - k})`; ctx.fillRect(0, 0, W, H);
  }
}

function era1(ctx, t) {
  const T = TIMES, t0 = S('s1').t0, t1 = S('s1').t1;
  const fighting = t > T.army - .3 && t < T.noline + .5;
  const [sx, sy] = shake(t, T.drum, 16, .8), [fx, fy] = shake(t, T.fight + 1.6, 10, .5);
  ctx.save(); ctx.translate(sx + fx, sy + fy);
  const cam = { x: fighting ? 0 : lerp(60, -60, span(t, t0, t1)), z: fighting ? 1.04 + .03 * span(t, T.army, T.fight + 1.5) : 1.04 };
  bg(ctx, 't_bg_field', t, cam);
  glow(ctx, 1700, 120, 600, '255,240,190', .18);
  // "no stage / no spotlight / no mic" crossed out
  [[T.nostage, 'เวที'], [T.nospot, 'สปอตไลท์'], [T.nomic, 'ไมโครโฟน']].forEach(([tt, w], i) => {
    const k = pop(t, tt - .1) * out(t, T.army - .2); if (k <= .01) return; const s = tagSpr(w, 46, CREAM, i + 70), x = 700 + i * 290, y = 560;
    blit(ctx, s, x, y, { k, rot: (i - 1) * .05 }); const c = span(t, tt + .25, tt + .55);
    ctx.save(); ctx.strokeStyle = '#d0403a'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - 90, y - 40); ctx.lineTo(lerp(x - 90, x + 90, c), lerp(y - 40, y + 40, c)); ctx.stroke(); ctx.restore(); });
  // the two armies charge, clash, one demon tumbles
  if (fighting) {
    const ya = span(t, T.army - .3, T.fight + 1.5), la = span(t, T.ling - .3, T.fight + 1.5), clash = t > T.fight + 1.5;
    for (let i = 0; i < 5; i++) {
      const row = i % 2, y = 800 + row * 110, x = lerp(-300 - i * 140, 760 - i * 70, ease(ya));
      const hit = clash && i === 0 && t > T.fight + 1.9;
      if (hit) actor(ctx, '', 't_yak_hit', t, x - span(t, T.fight + 1.9, T.fight + 2.6) * 220, y, { h: 340 - row * 20, rot: -.1 });
      else actor(ctx, '', ya < 1 || (clash && Math.floor(t * 3 + i) % 2) ? (Math.floor(t * 6 + i) % 2 ? 't_yak_run_a' : 't_yak_run_b') : 't_yak_soldier', t, x, y, { h: 340 - row * 20 });
    }
    for (let i = 0; i < 5; i++) {
      const row = (i + 1) % 2, y = 800 + row * 110, x = lerp(2200 + i * 140, 1160 + i * 70, ease(la));
      const leap = clash && i === 0 && t > T.fight + 1.6 && t < T.fight + 2.6;
      if (leap) actor(ctx, '', 't_ling_leap', t, x - 40, y, { h: 340 - row * 20, lift: Math.sin(span(t, T.fight + 1.6, T.fight + 2.6) * Math.PI) * 200 });
      else actor(ctx, '', la < 1 || clash ? (Math.floor(t * 6 + i) % 2 ? 't_ling_run_a' : 't_ling_run_b') : 't_ling_soldier', t, x, y, { h: 340 - row * 20 });
    }
    dust(ctx, t, T.fight + 1.5, 960, 880, 10, 1.3); burst(ctx, t, T.fight + 1.6, 960, 640, '255,230,140', 300);
    // the drum: BOOM rings
    if (t > T.drum - .1 && t < T.drum + 2.5) { for (let r = 0; r < 3; r++) { const p = ((t - T.drum) * 1.3 + r / 3) % 1; ctx.save(); ctx.strokeStyle = `rgba(255,245,220,${(1 - p) * .8})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(960, 560, 200 + p * 600, (200 + p * 600) * .5, 0, 0, 7); ctx.stroke(); ctx.restore(); }
      blit(ctx, cutoutSpr('ตึง! ตึง!', 96, 9), 960, 300, { k: pop(t, T.drum) * out(t, T.drum + 2.5), rot: Math.sin(t * 20) * .04 }); }
  }
  // narrator at the side of the field; piphat band
  if (t > T.noline - .4) { const k = easeOut(span(t, T.noline - .4, T.noline + .3)); actor(ctx, '', mouth(t) && t > T.phak - .2 ? 't_narrator_talk' : 't_narrator', t, lerp(2100, 1680, k), 900, { h: 400 });
    bubble(ctx, t, 1500, 420, 'พากย์สดๆ!', pop(t, T.phak) * out(t, T.piphat + .3)); }
  if (t > T.piphat - .3) prop(ctx, 't_piphat', 560, 960 + (1 - easeOut(span(t, T.piphat - .3, T.piphat + .4))) * 400, 230, { base: 1, rot: Math.sin(t * 5) * .01 });
  if (t > T.piphat) notes(ctx, t, 300, 720, span(t, T.piphat, T.piphat + .6));
  // hosts
  const hostOut = fighting && t < T.noline - .4;
  const jx = t < T.army - .3 ? 1500 : hostOut ? go(t, T.army - .3, T.army + .4, 1500, 2150) : go(t, T.noline - .6, T.noline + .3, 2150, 1500);
  const jb = t < t0 + 2 ? 'walk' : t < T.nostage ? 'front' : t < T.grass ? 't_jiw_point' : t < T.army ? 'front' : t > T.action - .3 ? 't_jiw_dance' : 'front';
  if (t < t0 + 2) actor(ctx, 'jiw', 'walk', t, go(t, t0, t0 + 2, 2100, 1500), 920);
  else if (!(fighting && t < T.noline - .4 && t > T.army + .4)) actor(ctx, 'jiw', jb, t, jx, 920, { flip: jb === 't_jiw_point' });
  const kx = t < T.army - .3 ? 420 : fighting && t < T.noline - .4 ? go(t, T.army - .3, T.army + .4, 420, -260) : go(t, T.noline - .6, T.noline + .3, -260, 380);
  if (!(fighting && t < T.noline - .4 && t > T.army + .4)) actor(ctx, 'kwan', t > T.action - .3 ? 't_kwan_wow' : 'front', t, t < t0 + 1.5 ? go(t, t0, t0 + 1.5, -200, 420) : kx, 910);
  strip(ctx, 't_fg_grass', t, 1110, { w: 2300, h: 250, px: cam.x });
  ctx.restore();
  tags(ctx, t, [['สมัยอยุธยา · แบบดั้งเดิมที่สุด', T.ayut], ['เล่นกลางแจ้ง บนสนามหญ้า', T.grass]], T.army - .2);
  vignette(ctx, .3);
}

function era2(ctx, t) {
  const T = TIMES, t0 = S('s2').t0, t1 = S('s2').t1;
  bg(ctx, 't_bg_rongnok', t, { x: lerp(-60, 60, span(t, t0, t1)), z: 1.05 });
  tint(ctx, 'rgba(60,70,90,.12)');
  // the performers sit on the bamboo rail, legs swinging
  const nk = pop(t, T.nangrao - .1, .5);
  if (nk > .01) prop(ctx, 't_nangrao', 1290, 610 + Math.sin(t * 3) * 4, 380, { k: nk });
  bubble(ctx, t, 1290, 300, 'รอคิวก่อนนะ~', pop(t, T.rail + .4) * out(t, T.roof));
  // rain falls but the roof keeps everyone dry
  const ra = span(t, T.rain - 1.2, T.rain - .2);
  rain(ctx, t, ra);
  if (t > T.rain - .4) prop(ctx, 't_sun_rain', 1500, 220, 240, { k: pop(t, T.rain - .3), rot: Math.sin(t * 2) * .05, noShadow: 1 });
  actor(ctx, 'jiw', t < t0 + 1.8 ? 'walk' : t < T.nangrao ? 'front' : t < T.rail + 1 ? 't_jiw_point' : t > T.rain ? 't_jiw_laugh' : 'front', t, t < t0 + 1.8 ? go(t, t0, t0 + 1.8, -200, 700) : 700, 930, { flip: false });
  actor(ctx, 'kwan', t > T.rain ? 't_kwan_point' : 'front', t, t < t0 + 1.4 ? go(t, t0, t0 + 1.4, -400, 330) : 330, 920);
  if (t > T.roof - .2) { const k = pop(t, T.roof - .2); ctx.save(); ctx.strokeStyle = `rgba(224,87,79,${.9 * k})`; ctx.lineWidth = 8; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.ellipse(1150, 230, 520 * k, 120 * k, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  tags(ctx, t, [['หรือ "โขนนั่งราว"', T.nangrao], ['เริ่มมีโรงแสดงง่ายๆ', T.roof - .5], ['มีหลังคาคลุม กันฝน กันแดด', T.roof]], t1);
  vignette(ctx, .32);
}

function era3(ctx, t) {
  const T = TIMES, t0 = S('s3').t0, t1 = S('s3').t1;
  bg(ctx, 't_bg_rongnai', t, { x: lerp(40, -40, span(t, t0, t1)), z: 1.04 + .03 * span(t, t0, t1) });
  glow(ctx, 960, 330, 900, '255,200,100', .14 + .03 * Math.sin(t * 2));
  sparkles(ctx, t, 960, 420, 900, 26, '255,236,160', 1, 31);
  // the dancers glide slowly; the singer kneels and sings, then bows
  const dk = easeOut(span(t, T.fine - .2, T.fine + .8));
  if (dk > 0) { const sway = Math.sin(t * 1.1) * 30; prop(ctx, 't_rongnai_dancers', 1000 + sway, 905, 520, { base: 1, alpha: dk, rot: Math.sin(t * 1.1) * .02 }); }
  if (t > T.sing - .4) prop(ctx, t < T.mix ? 't_palace_singer' : 't_palace_singer_wai', 1560, 905, 330, { base: 1, k: pop(t, T.sing - .4) });
  if (t > T.sing) notes(ctx, t, 1450, 560, span(t, T.sing, T.sing + .5) * out(t, t1, .5));
  if (t > T.palace - .2 && t < T.train3 + .5) { const k = pop(t, T.palace - .2) * out(t, T.train3 + .5); prop(ctx, 'all_clock', 0, 0, 1, { alpha: 0 }); bubble(ctx, t, 1000, 260, 'เฉพาะในวังเท่านั้น', k); }
  if (t > T.mix) burst(ctx, t, T.mix + .2, 1000, 600, '255,220,150', 340);
  actor(ctx, 'jiw', t < t0 + 1.6 ? 'walk' : t > T.grace - .3 && t < T.sing ? 't_jiw_dance' : 'front', t, t < t0 + 1.6 ? go(t, t0, t0 + 1.6, -200, 470) : 470, 930);
  actor(ctx, 'kwan', t > T.fine && t < T.fine + 2.5 ? 't_kwan_wow' : t > T.mix + 1 ? 't_kwan_wai' : 'front', t, t < t0 + 1.4 ? go(t, t0, t0 + 1.4, -400, 230) : 230, 920);
  tags(ctx, t, [['แสดงในพระราชฐาน', T.palace], ['ฝึกซ้อมเข้มงวด', T.train3], ['ท่ารำอ่อนช้อย ประณีต', T.grace], ['ขับร้อง-เจรจาแบบละครใน', T.sing]], t1);
  vignette(ctx, .34);
}

function era4(ctx, t) {
  const T = TIMES, t0 = S('s4').t0, t1 = S('s4').t1;
  bg(ctx, 't_bg_najo', t, { x: lerp(-40, 40, span(t, t0, t1)), z: 1.05 });
  tint(ctx, 'rgba(25,15,40,.22)');
  // the white cloth lights up; a big shadow puppet dances behind it
  const sc = span(t, T.cloth - .3, T.cloth + .8), fl = .8 + .2 * Math.sin(t * 13) * Math.sin(t * 7.7);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(ctx, 980, 430, 700, '255,190,110', (.12 + .22 * sc) * fl); ctx.restore();
  if (t > T.puppet - .5) { const k = span(t, T.puppet - .5, T.puppet + .2), x = 980 + Math.sin((t - T.puppet) * 1.4) * 300, y = 470 + Math.sin(t * 2.6) * 20;
    ctx.save(); ctx.beginPath(); ctx.rect(300, 180, 1360, 520); ctx.clip(); prop(ctx, 't_puppet_panel', x, y, 470, { filter: 'sepia(1) saturate(.6) brightness(.5) contrast(1.6)', alpha: .7 * k, noShadow: 1, rot: Math.sin(t * 2) * .06 }); ctx.restore(); }
  // a demon and a monkey fight in front of the screen
  if (t > T.battle - .4 && t < T.funny) { const k = easeOut(span(t, T.battle - .4, T.battle + .3)), ph = Math.floor(t * 2.5) % 2, o = out(t, T.funny);
    actor(ctx, '', ph ? 't_yak_run_a' : 't_yak_soldier', t, lerp(400, 820, k) + Math.sin(t * 5) * 30, 900, { h: 340, alpha: o });
    actor(ctx, '', ph ? 't_ling_leap' : 't_ling_run_a', t, lerp(1600, 1160, k) - Math.sin(t * 5) * 30, 900, { h: 340, alpha: o, lift: ph ? 80 : 0 });
    if (Math.floor(t * 2.5) !== Math.floor((t - 1 / 24) * 2.5)) {} burst(ctx, t, Math.floor(t * 2.5) / 2.5, 990, 640, '255,230,150', 160); }
  // the jokes: the monkey clowns, the crowd roars
  if (t > T.joke - .4) { prop(ctx, 't_funny_monkey', 1000, 905 + Math.abs(Math.sin(t * 6)) * -30, 380, { base: 1, k: pop(t, T.joke - .4), rot: Math.sin(t * 6) * .06 });
    blit(ctx, cutoutSpr('ฮ่าๆๆ!', 80, 3), 1480, 330, { k: pop(t, T.laugh) * out(t, t1, .4), rot: Math.sin(t * 10) * .05 }); }
  const crowdBob = t > T.laugh - .2 ? Math.abs(Math.sin(t * 9)) * -14 : 0;
  strip(ctx, 't_fg_crowd_back', t, 1120, { w: 2300, h: 300, dy: crowdBob });
  actor(ctx, 'jiw', t < t0 + 1.6 ? 'walk' : t > T.laugh - .3 ? 't_jiw_laugh' : t > T.cloth && t < T.paint + 1.5 ? 't_jiw_point' : 'front', t, t < t0 + 1.6 ? go(t, t0, t0 + 1.6, 2150, 1640) : 1640, 880, { flip: t < t0 + 1.6 || (t > T.cloth && t < T.paint + 1.5) });
  actor(ctx, 'kwan', t > T.laugh - .3 ? 't_kwan_wow' : 'front', t, t < t0 + 1.4 ? go(t, t0, t0 + 1.4, 2300, 1840) : 1840, 870);
  tags(ctx, t, [['สมัยอยุธยาตอนปลาย', T.late], ['ขึงผ้าขาวหน้าโรง', T.cloth], ['เชิดหนังใหญ่หลังผ้า', T.puppet], ['มีมุกตลกแทรก', T.joke]], t1);
  vignette(ctx, .4);
}

function era5(ctx, t) {
  const T = TIMES, t0 = S('s5').t0, t1 = S('s5').t1;
  // backdrop flips between painted scenes "like magic"
  const flipping = t > T.change - .2 && t < T.magic + .6, fi = Math.floor((t - T.change) * 2.4) % 3;
  const bgName = flipping ? ['t_bg_rongnai', 't_bg_field', 't_bg_grandstage'][(fi + 3) % 3] : 't_bg_grandstage';
  const [sx, sy] = shake(t, T.arrow + .8, 12, .5);
  ctx.save(); ctx.translate(sx, sy);
  bg(ctx, bgName, t, { z: 1.04 + .04 * span(t, t0, T.change), x: 0 });
  if (flipping && Math.floor((t - T.change) * 2.4) !== Math.floor((t - 1 / 24 - T.change) * 2.4)) {}
  if (flipping) { const p = ((t - T.change) * 2.4) % 1; ctx.fillStyle = `rgba(255,250,230,${Math.max(0, .7 - p * 3)})`; ctx.fillRect(0, 0, W, H); sparkles(ctx, t, 960, 450, 700, 30, '255,240,170', 1, 5); }
  // stage lights sweep
  const lightsOn = t > T.wow - .5;
  if (lightsOn) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const cols = t > T.light - .2 && t < T.light + 3 ? ['255,90,120', '90,200,255', '255,215,90'] : ['255,230,180', '255,230,180', '255,230,180'];
    cols.forEach((c, i) => { const x = 960 + Math.sin(t * .7 + i * 2.1) * 520, top = 320 + i * 640; const g = ctx.createLinearGradient(top, 0, x, 900); g.addColorStop(0, `rgba(${c},.18)`); g.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(top - 30, 0); ctx.lineTo(top + 30, 0); ctx.lineTo(x + 260, 920); ctx.lineTo(x - 260, 920); ctx.fill(); glow(ctx, x, 880, 260, c, .2); }); ctx.restore(); }
  // demon flies over the mountains
  if (t > T.fly - .5 && t < T.fly + 3) { const p = span(t, T.fly - .5, T.fly + 2.6); prop(ctx, 't_yak_flyer', lerp(-300, 2200, p), 360 - Math.sin(p * Math.PI) * 140, 300, { rot: -.15 + p * .3 }); speedLines(ctx, t, 200, 500, Math.sin(p * Math.PI)); }
  // Rama draws and the arrow flies in sparks
  if (t > T.arrow - 1.2 && t < T.costume + .5) { const k = pop(t, T.arrow - 1.2) * out(t, T.costume + .5); actor(ctx, '', t > T.arrow - .2 ? 't_rama_draw' : 't_rama_front', t, 560, 920, { h: 470, k });
    if (t > T.arrow) { const p = span(t, T.arrow, T.arrow + .8); prop(ctx, 't_arrow', lerp(760, 1900, p), 560, 120, { alpha: p < 1 ? 1 : 0, noShadow: 1 }); for (let i = 0; i < 18; i++) { const q = p - i * .02; if (q < 0) continue; ctx.fillStyle = `rgba(255,${180 + i * 4},90,${(1 - i / 18) * (p < 1 ? 1 : 1 - span(t, T.arrow + .8, T.arrow + 1.4))})`; ctx.beginPath(); ctx.arc(lerp(760, 1900, q) - 200, 560 + Math.sin(i * 1.7 + t * 20) * 14, 10 - i * .4, 0, 7); ctx.fill(); } }
    burst(ctx, t, T.arrow + .8, 1720, 560, '255,200,90', 320); }
  // costumes & the golden mask
  if (t > T.costume - .3 && t < T.gold - .3) actor(ctx, '', 't_thotsakan_laugh', t, 1000, 920, { h: 480, k: pop(t, T.costume - .3) * out(t, T.gold - .3) });
  if (t > T.gold - .3 && t < T.light) { const k = pop(t, T.gold - .3, .6) * out(t, T.light); glow(ctx, 960, 480, 420, '255,220,120', .45 * k); prop(ctx, 't_goldmask', 960, 480, 470, { k, rot: Math.sin(t * 1.5) * .04 }); sparkles(ctx, t, 960, 480, 330, 24, '255,245,190', k, 2); }
  if (t > T.world - .4) { const k = pop(t, T.world - .4, .6); prop(ctx, 't_world', 960, 470, 440, { k, rot: Math.sin(t * 2) * .06 }); sparkles(ctx, t, 960, 470, 380, 20, '255,236,160', k, 8); }
  strip(ctx, 't_fg_stage_lights', t, 300, { w: 2300, dy: -40 });
  const busy = (t > T.arrow - 1.2 && t < T.light) || t > T.world - .4;
  actor(ctx, 'jiw', t < t0 + 1.6 ? 'walk' : t > T.world - .4 ? 't_jiw_jump' : t > T.fly - .5 && t < T.fly + 2 ? 't_jiw_fly' : 'front', t, t < t0 + 1.6 ? go(t, t0, t0 + 1.6, 2150, 1560) : busy ? 1700 : 1560, 920, { flip: t < t0 + 1.6, lift: t > T.fly - .5 && t < T.fly + 2 ? 120 : t > T.world - .4 ? Math.abs(Math.sin(t * 5)) * 60 : 0 });
  actor(ctx, 'kwan', t > T.wow - .4 && t < T.wow + 2.5 ? 't_kwan_wow' : t > T.world ? 't_kwan_wave' : 'front', t, t < t0 + 1.4 ? go(t, t0, t0 + 1.4, 2300, 1800) : busy ? 1870 : 1800, 910);
  ctx.restore();
  tags(ctx, t, [['สมัยรัชกาลที่ 5 เป็นต้นมา', T.r5], ['→ โขนพระราชทาน (ปัจจุบัน)', T.royal], ['ฉากสมจริง เปลี่ยนได้เร็ว', T.real], ['เทคนิคพิเศษตื่นตา', T.fly - .6]], T.arrow - 1.3);
  vignette(ctx, .36);
}

function outro(ctx, t) {
  const T = TIMES, t0 = S('outro').t0;
  bg(ctx, 't_bg_station_morning', t, { x: lerp(60, -60, span(t, t0, TM.total)), z: 1.04 });
  glow(ctx, 1500, 200, 700, '255,200,150', .2);
  mist(ctx, t, .35 * (1 - span(t, T.vanish, T.vanish + 3)) + .1);
  // the train arrives, Kwan steps out, Jiw waves from the door then fades in the mist
  const tx = go(t, t0 - .2, t0 + 2.6, -900, 1100), open = t > t0 + 3, gone = span(t, T.vanish, T.vanish + 1.6);
  const trainLeave = t > T.mask + .8 ? go(t, T.mask + .8, T.mask + 3.8, 1100, 3000) : tx;
  prop(ctx, open && t < T.mask + .8 ? 't_train_open' : 't_train_side', trainLeave, 820, 470, { base: 1 });
  if (t > T.bell - .3) { prop(ctx, 't_bell', 300, 200, 200, { k: pop(t, T.bell - .3), rot: Math.sin((t - T.bell) * 8) * .3 * (1 - span(t, T.bell, T.bell + 3)), noShadow: 1 });
    for (let r = 0; r < 3; r++) { const p = ((t - T.bell) * .9 + r / 3) % 1; if (t < T.bell + 3.5) { ctx.save(); ctx.strokeStyle = `rgba(255,220,140,${(1 - p) * .7})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(300, 220, 80 + p * 180, -2.4, -.7); ctx.stroke(); ctx.restore(); } } }
  if (t > t0 + 3 && t < T.mask + 1) actor(ctx, 'jiw', t > T.smile - .3 ? 't_jiw_wave' : 'front', t, 1020, 790, { h: 300, alpha: 1 - gone, noShadow: 1 });
  if (t > T.vanish) sparkles(ctx, t, 1020, 640, 200, 20, '255,255,255', (1 - span(t, T.vanish + 1.6, T.vanish + 3)), 4);
  if (t > T.mask - .3) { prop(ctx, 't_minimask', 1010, 880, 140, { base: 1, k: pop(t, T.mask - .3) }); sparkles(ctx, t, 1010, 820, 110, 10, '255,236,160', 1, 6); }
  const kx = t < t0 + 3.6 ? 620 : go(t, t0 + 3.6, t0 + 5.4, 900, 620);
  actor(ctx, 'kwan', t < t0 + 3.6 ? 'side' : t < t0 + 5.4 ? 'walk' : t > T.sawasdee - .3 ? 't_kwan_wai' : t > T.like - .2 && t < T.keep + 1 ? 't_kwan_point' : 'front', t, kx, 910, { flip: t > t0 + 3.6 && t < t0 + 5.4, alpha: t < t0 + 3.6 ? 0 : 1 });
  // three cards: field → royal hall → world stage
  [[T.e1, 't_bg_field', 'สนามหญ้า'], [T.e2, 't_bg_rongnai', 'โรงละครหลวง'], [T.e3, 't_bg_grandstage', 'เวทีระดับโลก']].forEach(([tt, im, lb], i) => {
    const k = pop(t, tt - .1) * out(t, T.soul); if (k <= .01) return; const x = 1180 + i * 250, y = 380 + (i % 2) * 40;
    ctx.save(); ctx.translate(x, y); ctx.rotate((i - 1) * .06 + Math.sin(t * 2 + i) * .01); ctx.scale(k, k); ctx.fillStyle = '#fffaf0'; ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 14; ctx.fillRect(-120, -100, 240, 210); ctx.shadowColor = 'transparent';
    ctx.drawImage(IMG[im], -105, -88, 210, 118); ctx.fillStyle = INK; ctx.font = FONT(26); ctx.textAlign = 'center'; ctx.fillText(lb, 0, 72); ctx.restore();
    if (i < 2 && t > T[['e2', 'e3'][i]] - .2) { ctx.save(); ctx.fillStyle = INK; ctx.font = FONT(50); ctx.globalAlpha = k; ctx.fillText('→', x + 125, y + 10); ctx.restore(); } });
  if (t > T.soul - .2 && t < T.like) { const k = pop(t, T.soul - .2) * out(t, T.like); glow(ctx, 1280, 420, 300, '255,140,150', .35 * k); blit(ctx, cutoutSpr('มรดกล้ำค่าของไทย', 70, 12), 1280, 420, { k }); }
  if (t > T.like - .2) prop(ctx, 't_like_share', 1300, 440, 330, { k: pop(t, T.like - .2) * out(t, T.sawasdee + 1.5), rot: Math.sin(t * 3) * .05 });
  if (t > T.bye - .5) { const k = easeOut(span(t, T.bye - .5, T.bye + .3)); actor(ctx, 'jiw', 't_jiw_wave', t, lerp(2100, 1050, k), 910, { alpha: k });
    sparkles(ctx, t, 1050, 700, 200, 14, '255,255,255', k * out(t, T.bye + 1), 9); }
  strip(ctx, 't_fg_station', t, 1100, { w: 520, dx: -760 });
  // end card
  const ek = span(t, TM.total - .4, TM.total + .6);
  if (ek > 0) { ctx.fillStyle = `rgba(253,246,232,${ek})`; ctx.fillRect(0, 0, W, H);
    const k = easeBack(span(t, TM.total, TM.total + .6)); ctx.save(); ctx.globalAlpha = ek; ctx.drawImage(IMG.logo_round, 960 - 200 * k, 360 - 200 * k, 400 * k, 400 * k); ctx.restore();
    blit(ctx, cutoutSpr('ครูของขวัญ TS', 70, 4), 960, 690, { k: easeBack(span(t, TM.total + .4, TM.total + .9)) });
    actor(ctx, 'kwan', 't_kwan_wave', t, 470, 1000, { k: ek }); actor(ctx, 'jiw', 't_jiw_wave', t, 1450, 1000, { k: ek, flip: true }); }
}

// ======================= frame =======================
const END = TM.total + 3.5;
function drawFrame(ctx, t) {
  ctx.fillStyle = '#20180f'; ctx.fillRect(0, 0, W, H);
  const id = t < S('s1').t0 ? 'intro' : t < S('s2').t0 ? 's1' : t < S('s3').t0 ? 's2' : t < S('s4').t0 ? 's3' : t < S('s5').t0 ? 's4' : t < S('outro').t0 ? 's5' : 'outro';
  ({ intro, s1: era1, s2: era2, s3: era3, s4: era4, s5: era5, outro })[id](ctx, t);
  const ei = ['s1', 's2', 's3', 's4', 's5'].indexOf(id);
  if (ei >= 0) { eraTitle(ctx, t, ei, TIMES[id + 'n']); progress(ctx, t, ei); }
  if (t < TM.total) subtitles(ctx, t);
  if (t < TM.total - .4) { ctx.save(); ctx.globalAlpha = .5; ctx.drawImage(IMG.logo_round, 34, H - 112, 78, 78); ctx.restore(); }
  ['s2', 's3', 's4', 's5', 'outro'].forEach((s, i) => wipe(ctx, t, S(s).t0, ['#e9b83a', '#d9a42a', '#e0574f', '#5aa9d6', '#f19bb8'][i]));
  if (t < .6) { ctx.fillStyle = `rgba(20,15,10,${1 - t / .6})`; ctx.fillRect(0, 0, W, H); }
}
// ---------- sound cues ----------
function sfxEvents() {
  const T = TIMES, E = [], add = (t, type, g = 1) => E.push({ t: +t.toFixed(3), type, g });
  for (let s = .3; s < 3.2; s += 1 / 2.1) add(s, 'step', .5);
  add(T.train - .3, 'train', 1); add(T.train + 2.3, 'ding', .8); add(T.train + 2.6, 'door', .7);
  add(T.jiw - .6, 'boing', .9); add(T.jiw + .3, 'pop', .6); add(T.travel - .3, 'warp', 1); add(T.title, 'tada', .9); add(S('s1').t0 - 1, 'whoosh', 1);
  for (const id of ['s1', 's2', 's3', 's4', 's5']) { add(TIMES[id + 'n'] - .1, 'pop', .9); add(TIMES[id + 'n'] + 2.2, 'whoosh', .4); }
  for (const id of ['s2', 's3', 's4', 's5', 'outro']) add(S(id).t0 - .35, 'whoosh', 1);
  [T.nostage, T.nospot, T.nomic].forEach(x => { add(x - .1, 'pop', .6); add(x + .25, 'scribble', .6); });
  for (let s = T.army - .3; s < T.fight + 1.5; s += .28) add(s, 'step', .7);
  add(T.fight + 1.5, 'boom', .9); add(T.fight + 1.6, 'clang', .8); add(T.fight + 1.9, 'boing', .6);
  for (let i = 0; i < 4; i++) add(T.drum + i * .55, 'boom', 1 - i * .12);
  add(T.phak, 'pop', .5); add(T.piphat - .3, 'whoosh', .5); add(T.action - .3, 'sparkle', .7);
  add(T.nangrao - .1, 'pop', .8); add(T.rail + .4, 'pop', .5); add(T.roof - .2, 'scribble', .6); add(T.rain - .3, 'pop', .6);
  add(T.fine - .2, 'sparkle', .8); add(T.sing - .4, 'pop', .6); add(T.mix + .2, 'tada', .7);
  add(T.cloth, 'whoosh', .6); add(T.puppet - .5, 'whoosh', .5);
  for (let s = T.battle - .4; s < T.funny; s += .4) add(Math.floor(s * 2.5) / 2.5 + .02, 'clang', .55);
  add(T.joke - .4, 'boing', .8); add(T.laugh, 'laugh', 1);
  add(T.wow - .4, 'tada', .8);
  for (let s = T.change - .2; s < T.magic + .6; s += 1 / 2.4) add(s, 'whoosh', .45); add(T.magic, 'sparkle', .9);
  add(T.fly - .5, 'warp', .7); add(T.arrow - .2, 'stretch', .7); add(T.arrow, 'zing', 1); add(T.arrow + .8, 'boom', .9);
  add(T.costume - .3, 'pop', .7); add(T.gold - .3, 'sparkle', 1); add(T.world - .4, 'tada', 1);
  add(S('outro').t0 - .2, 'train', .9); add(S('outro').t0 + 2.6, 'ding', .8);
  add(T.bell - .3, 'bell', 1); add(T.vanish, 'sparkle', .9); add(T.mask - .3, 'pop', .8); add(T.mask + .8, 'train', .6);
  [T.e1, T.e2, T.e3].forEach(x => add(x - .1, 'pop', .7)); add(T.soul - .2, 'sparkle', .7); add(T.like - .2, 'pop', 1); add(T.bye - .5, 'boing', .7);
  add(TM.total, 'tada', 1);
  return E.filter(e => e.t >= 0).sort((a, b) => a.t - b.t);
}
