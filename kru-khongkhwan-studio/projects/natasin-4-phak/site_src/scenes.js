// The film: intro, four regions (map → dances → costume → music → real performance), outro, end card.
// ---------- content (times are narration seconds) ----------
const R = {
  north: {
    t: { start: 17.0, title: 17.37, hist: [19.37, 24.6], dance: 29.1, chips: [30.5, 31.9], cost: 33.37, costB: [34.64, 37.37, 40.26], music: 42.24, cap: 42.94, inst: [43.2, 44.75, 45.98], tempo: 46.96, end: 50.5 },
    icons: [['umbrella', 'ร่มบ่อสร้าง'], ['mountain', 'ภูเขาสูง'], ['lantern', 'โคมล้านนา']],
    hist: ['วิถีชีวิตสงบ · วัฒนธรรมล้านนา', 'เนิบนาบ อ่อนช้อย ละเมียดละไม'],
    dances: [['nails', 'ฟ้อนเล็บ', ''], ['candle', 'ฟ้อนเทียน', '']],
    cost: ['ชุดไทยล้านนา', 'นุ่งผ้าซิ่น · เกล้ามวยทัดดอกไม้', 'ใส่เล็บยาวสีทอง'],
    cap: 'วงสะล้อ ซอ ซึง', inst: [['salo', 'สะล้อ'], ['sueng', 'ซึง'], ['klongaew', 'กลองแอว']],
    tempo: 'จังหวะช้า นุ่มนวล ชวนเคลิ้ม', bpm: 54, clip: 'การแสดงพื้นเมืองภาคเหนือ',
  },
  central: {
    t: { start: 50.5, title: 50.87, hist: [52.8, 55.6, 59.44], dance: 62.46, chips: [63.52, 64.24, 65.5], cost: 68.41, costB: [69.63, 74.71, 78.0], music: 80.68, cap: 81.63, inst: [84.21, 85.59, 86.28, 86.77, 87.24], tempo: 87.44, end: 89.85 },
    icons: [['sickle', 'เคียว'], ['rice', 'ต้นข้าว'], ['ngob', 'งอบ']],
    hist: ['ดินแดนอารยธรรม & เกษตรกรรม', 'ร้องรำทำเพลงหลังฤดูเก็บเกี่ยว', 'สนุกสนาน · เกี้ยวพาราสี'],
    dances: [['sickle', 'เต้นกำรำเคียว', ''], ['ramwong', 'รำวงมาตรฐาน', ''], ['klongyao', 'รำกลองยาว', '']],
    cost: ['ชาย: นุ่งโจงกระเบน\nเสื้อคอพวงมาลัย / ราชปะแตน', 'หญิง: ห่มสไบ / เสื้อแขนกระบอก\nนุ่งโจงกระเบน', 'ชวนนึกถึงบรรยากาศทุ่งนา'],
    cap: 'เน้นเครื่องตี & เครื่องจังหวะ', inst: [['klongyao', 'กลองยาว'], ['ching', 'ฉิ่ง'], ['chap', 'ฉาบ'], ['krap', 'กรับ'], ['mong', 'โหม่ง']],
    tempo: 'จังหวะสนุกสนาน ชวนเต้นตาม', bpm: 118, clip: 'เต้นกำรำเคียว',
  },
  isan: {
    t: { start: 89.85, title: 90.17, hist: [92.25, 96.48, 99.6], dance: 103.11, chips: [104.15, 104.89, 106.22], cost: 108.98, costB: [109.3, 110.19, 113.34], music: 116.08, cap: 117.06, inst: [118.29, 118.8, 119.54, 120.2], tempo: 121.0, end: 125.6 },
    icons: [['kratib', 'กระติบข้าว'], ['somtam', 'ส้มตำ'], ['khaen', 'แคน']],
    hist: ['สนุกสนานรื่นเริง · พิธีกรรมความเชื่อ', 'อีสานเหนือ → สนุกสนาน', 'อีสานใต้ → กลิ่นอายอารยธรรมขอม'],
    dances: [['kratib', 'เซิ้งกระติบข้าว', 'อีสานเหนือ'], ['ponglang', 'เซิ้งโปงลาง', 'อีสานเหนือ'], ['apsara', 'ระบำอัปสรา', 'อีสานใต้ · ขอม']],
    cost: ['นุ่งผ้าซิ่นมัดหมี่', 'หรือผ้าขาวม้าผูกเอว', 'เรียบง่าย แต่สีสันสดใส'],
    cap: 'เอกลักษณ์ดนตรีอีสาน', inst: [['khaen', 'แคน'], ['phin', 'พิณ'], ['ponglang', 'โปงลาง'], ['wot', 'โหวด']],
    tempo: 'กระชับ เร็ว เร้าใจ สนุก!', bpm: 150, clip: 'เซิ้งกระติบข้าว',
  },
  south: {
    t: { start: 125.6, title: 125.92, hist: [127.95, 131.56, 136.75], dance: 141.1, chips: [141.9, 143.3], cost: 145.78, costB: [146.95, 149.5, 152.2], music: 154.7, cap: 155.2, inst: [156.11, 156.6, 157.23, 157.59, 157.86], tempo: 158.69, end: 161.2 },
    icons: [['sea', 'ทะเล'], ['serid', 'โนรา'], ['puppet', 'หนังตะลุง']],
    hist: ['ดินแดนติดทะเล · เอกลักษณ์สูง', 'ผีบรรพบุรุษ + วัฒนธรรมไทยมลายู', 'ท่ารำแข็งแรง ว่องไว แอคชั่นชัด'],
    dances: [['serid', 'มโนราห์ (โนรา)', ''], ['fan', 'รองเง็ง', 'ไทยมลายู']],
    cost: ['โนรา: สวมเทริด · ชะดา', 'เครื่องประดับลูกปัดร้อยสีสดใส', 'ติดเล็บโค้ง · ปีกนกแอ่น'],
    cap: 'ดุเดือด! เร้าอารมณ์', inst: [['thap', 'ทับ'], ['mongkhu', 'โหม่ง'], ['ching', 'ฉิ่ง'], ['krap', 'กรับ'], ['pinok', 'ปี่นอก']],
    tempo: 'จังหวะหนักแน่น เร้าอารมณ์สุดๆ', bpm: 132, clip: 'การแสดงพื้นเมืองภาคใต้',
  },
};
// screen slots for the three map icons of each region (chosen so nothing overlaps the region or each other)
const SLOTS = {
  north: [[150, 470], [930, 520], [925, 930]],
  central: [[150, 520], [930, 470], [150, 940]],
  isan: [[140, 500], [935, 960], [140, 960]],
  south: [[200, 450], [880, 560], [880, 960]],
};
const CLIPBOX = [40, 620, 1000, 562];

// ---------- helpers ----------
function segAt(t) { for (const s of TL.segs) if (t < s.v1) return s; return TL.segs[TL.segs.length - 1]; }
function pop(t, t0, d = .45) { return easeBack(span(t, t0, t0 + d)); }
function fadeIn(t, t0, d = .35) { return easeOut(span(t, t0, t0 + d)); }
let BG = {};
function bgFor(key, col) {
  if (BG[key]) return BG[key];
  const c = mkCanvas(W, H), x = c.getContext('2d'); x.drawImage(paper(), 0, 0);
  const r = rng(key.length * 13 + 5);
  const avoid = (px, py) => px > 120 && px < 960 && py > 330 && py < 1560;
  for (let i = 0; i < 70; i++) {
    const px = r() * W, py = r() * H; if (avoid(px, py)) continue;
    const k = r(); x.save(); x.translate(px, py); x.rotate(r() * 6);
    if (k < .4) dot(x, 0, 0, 5 + r() * 6, col, i);
    else if (k < .7) { x.scale(.18, .18); IC.star(x, i); }
    else cline(x, [[-14, 0], [-5, -8], [5, 8], [14, 0]], { color: col, width: 5, seed: i });
    x.restore();
  }
  return (BG[key] = c);
}
// crayon "card": rounded paper with coloured border
const CARDS = {};
function card(w, h, fill, line) { const k = [w, h, fill, line].join(); return CARDS[k] || (CARDS[k] = sprite(w + 30, h + 30, (x, s) => {
  const p = wob(rrect(-w / 2, -h / 2, w, h, 26), true, 1.5, s); x.save(); polyPath(x, p, true); x.fillStyle = PAPER; x.globalAlpha = .93; x.fill(); x.restore();
  shape(x, rrect(-w / 2, -h / 2, w, h, 26), fill, line, { seed: s, lw: 6, gap: 7, alpha: .55, base: .5 }); })); }
// cut-out photo as a sticker with a thick white edge and a strip of tape
const STK = {};
function sticker(name, maxW, maxH, tape) {
  const k = name + maxW + maxH; if (STK[k]) return STK[k];
  const im = IMG[name], sc = Math.min(maxW / im.width, maxH / im.height), w = im.width * sc, h = im.height * sc, pad = 26;
  const sil = mkCanvas(w + pad * 2, h + pad * 2), sx = sil.getContext('2d');
  sx.drawImage(im, pad, pad, w, h); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, sil.width, sil.height);
  const c = mkCanvas(w + pad * 2, h + pad * 2), x = c.getContext('2d');
  x.save(); x.globalAlpha = .18; x.filter = 'blur(6px)'; x.drawImage(sil, 6, 10); x.restore();
  x.save(); x.filter = 'brightness(0) opacity(.22) blur(5px)'; x.drawImage(sil, 4, 9); x.restore();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; x.drawImage(sil, Math.cos(a) * 13, Math.sin(a) * 13); }
  x.drawImage(im, pad, pad, w, h);
  if (tape) { x.save(); x.translate(c.width / 2, 22); x.rotate(-.06); shape(x, rrect(-70, -20, 140, 40, 4), tape, null, { seed: 3, alpha: .55, base: .5 }); x.restore(); }
  return (STK[k] = { w: c.width, h: c.height, c: [c], scale: 1 });
}
function header(ctx, t, r, k = 1) {   // region name, top-left, with a mini map on the right
  if (k <= 0) return; const C = RC[r];
  ctx.save(); ctx.globalAlpha = k;
  put(ctx, T('hd' + r, C.name, 104, C.dark, { halo: '#fffaf0' }), t, 300, 250, { scale: lerp(.7, 1, easeBack(k)) });
  cline(ctx, wob([[110, 318], [490, 314]], false, 2, 4), { color: C.main, width: 9, seed: 9 + boil(t, 3) });
  ctx.restore();
}
function miniMap(ctx, t, r, x, y, k = 1) {
  if (k <= 0) return; const s = .105 * k;
  ctx.save(); ctx.globalAlpha = k; ctx.translate(x, y); ctx.scale(s / MSC, s / MSC); ctx.translate(-MAP.W * MSC / 2, -MAP.H * MSC / 2);
  const b = MAPS.base.c[boil(t, 2)]; ctx.drawImage(b, 0, 0);
  const rs = MAPS[r]; ctx.drawImage(rs.c[boil(t, 2)], rs.x, rs.y);
  ctx.restore();
}
// ---------- the map ----------
const MSC = .62; let MAPS = null;
function regionPath(x, polys) { x.beginPath(); for (const p of polys) { x.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) x.lineTo(p[i][0], p[i][1]); x.closePath(); } }
function buildMap() {
  MAPS = {};
  const base = [];
  for (let v = 0; v < 2; v++) {
    const c = mkCanvas(MAP.W * MSC, MAP.H * MSC), x = c.getContext('2d'); x.scale(MSC, MSC);
    for (const [wx, wy] of [[800, 1820], [880, 2060], [760, 2330], [960, 2480], [90, 2120], [120, 2420], [930, 1640]]) {
      for (let k = 0; k < 2; k++) { const p = []; for (let i = 0; i <= 6; i++) p.push([wx - 70 + i * 24, wy + k * 26 + Math.sin(i * 1.7 + v) * 9]); cline(x, p, { color: '#9ccbe3', width: 9, seed: wx + k + v * 3 }); }
    }
    for (const r of REGIONS) {
      const P = MAP.regions[r].polys, bb = MAP.regions[r].bbox;
      cfill(x, c2 => regionPath(c2, P), RC[r].light, { seed: 5 + v * 9 + r.length, gap: 9, bbox: bb, base: .7 });
    }
    for (const r of REGIONS) for (const p of MAP.regions[r].polys) cline(x, p, { closed: true, color: '#8d7b6e', width: 6, seed: p.length + v * 13, jit: 2.2 });
    base.push(c);
  }
  MAPS.base = { c: base };
  for (const r of REGIONS) {
    const bb = MAP.regions[r].bbox, m = 30, out = [];
    for (let v = 0; v < 2; v++) {
      const c = mkCanvas((bb[2] - bb[0] + m * 2) * MSC, (bb[3] - bb[1] + m * 2) * MSC), x = c.getContext('2d');
      x.scale(MSC, MSC); x.translate(-bb[0] + m, -bb[1] + m);
      const P = MAP.regions[r].polys;
      cfill(x, c2 => regionPath(c2, P), RC[r].main, { seed: 21 + v * 7, gap: 9, bbox: bb, base: .75, alpha: .85 });
      for (const p of P) cline(x, p, { closed: true, color: RC[r].dark, width: 11, seed: p.length * 3 + v * 17, jit: 2.6 });
      out.push(c);
    }
    MAPS[r] = { c: out, x: (bb[0] - m) * MSC, y: (bb[1] - m) * MSC };
  }
}
// camera: s = screen px per map px, (cx,cy) = map point at screen (sx,sy)
const CAM_FULL = { s: .39, cx: MAP.W / 2, cy: MAP.H / 2, sx: 540, sy: 1060 };
function camFor(r) { const b = MAP.regions[r].bbox, bw = b[2] - b[0], bh = b[3] - b[1]; const fit = { north: [640, 690], central: [640, 700], isan: [600, 600], south: [700, 800] }[r]; return { s: Math.min(fit[0] / bw, fit[1] / bh), cx: (b[0] + b[2]) / 2, cy: (b[1] + b[3]) / 2, sx: 540, sy: r === 'south' ? 800 : 760 }; }
function camMix(a, b, k) { return { s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)), cx: lerp(a.cx, b.cx, k), cy: lerp(a.cy, b.cy, k), sx: lerp(a.sx, b.sx, k), sy: lerp(a.sy, b.sy, k) }; }
function drawMap(ctx, t, cam, regs, regK = {}) {
  ctx.save(); ctx.translate(cam.sx, cam.sy); ctx.scale(cam.s / MSC, cam.s / MSC); ctx.translate(-cam.cx * MSC, -cam.cy * MSC);
  ctx.drawImage(MAPS.base.c[boil(t, 2)], 0, 0);
  for (const r of regs) {
    const k = regK[r] ?? 1; if (k <= 0) continue; const rs = MAPS[r], c = rs.c[boil(t, 2, 1)];
    if (k >= 1) ctx.drawImage(c, rs.x, rs.y);
    else { const cx = rs.x + c.width / 2, cy = rs.y + c.height / 2, sc = easeBack(k); ctx.save(); ctx.globalAlpha = clamp(k * 2); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.drawImage(c, -c.width / 2, -c.height / 2); ctx.restore(); }
  }
  ctx.restore();
}
const toScreen = (cam, mx, my) => [cam.sx + (mx - cam.cx) * cam.s, cam.sy + (my - cam.cy) * cam.s];

// ---------- wipe between segments ----------
function wipe(ctx, t, tb, col) {
  const d = .42; if (t < tb - d || t > tb + d) return;
  const k = (t - tb + d) / (2 * d);          // 0..1 ; covered at .5
  const x0 = k < .5 ? -200 : lerp(-200, W + 200, (k - .5) * 2), x1 = k < .5 ? lerp(-200, W + 260, k * 2) : W + 260;
  ctx.save(); ctx.fillStyle = pat(col); ctx.strokeStyle = pat(col); ctx.lineCap = 'round';
  ctx.beginPath(); const p = [];
  for (let y = -40; y <= H + 40; y += 60) p.push([x1 + Math.sin(y * .02 + tb) * 50, y]);
  ctx.moveTo(x0 - Math.sin(tb) * 40, -40); for (const q of p) ctx.lineTo(q[0], q[1]); ctx.lineTo(x0, H + 40); ctx.closePath(); ctx.globalAlpha = .96; ctx.fill();
  ctx.lineWidth = 36; ctx.beginPath(); p.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
  ctx.restore();
}
// page slide: returns x offset (null = not visible)
function slide(nt, a, b) { if (nt < a - .05 || nt > b + .05) return null; const e = easeOut(span(nt, a - .05, a + .4)), x = easeIn2(span(nt, b - .35, b + .05)); return (1 - e) * 1150 - x * 1150; }
function easeIn2(k) { return k * k * k; }

// ---------- intro ----------
function intro(ctx, t, nt) {
  ctx.drawImage(bgFor('intro', '#f5c3cf'), 0, 0);
  if (nt < 7.75) {
    putWrite(ctx, T('ti1', 'นาฏศิลป์พื้นเมือง', 112, '#b8553a', { halo: '#fffaf0' }), t, 540, 300, span(nt, -.3, 1.0));
    put(ctx, T('ti2', '4 ภาค', 170, '#3f7a48', { halo: '#fffaf0' }), t, 540, 470, { scale: pop(t, .4 + 1.0) * (1 + .03 * Math.sin(t * 5)) });
    put(ctx, icon('star', 90), t, 300, 490, { scale: pop(t, .4 + 1.3), rot: t * .8 });
    put(ctx, icon('star', 70), t, 790, 420, { scale: pop(t, .4 + 1.5), rot: -t * .7 });
    const k = {}; REGIONS.forEach((r, i) => k[r] = span(nt, 1.6 + i * .7, 2.2 + i * .7));
    drawMap(ctx, t, CAM_FULL, REGIONS, k);
    const lab = { north: [-40, 0], central: [-20, 40], isan: [0, 0], south: [30, -80] };
    REGIONS.forEach((r, i) => { const c = MAP.regions[r].c, [sx, sy] = toScreen(CAM_FULL, c[0], c[1]); put(ctx, T('ml' + r, RC[r].name.replace('ภาค', ''), 54, RC[r].dark, { halo: '#fffaf0' }), t, sx + lab[r][0], sy + lab[r][1], { scale: pop(t, .4 + 2.0 + i * .7) }); });
    // "charm & identity" sparkles
    const sp = [[230, 820], [860, 760], [870, 1300], [210, 1400]];
    sp.forEach(([x, y], i) => put(ctx, icon(i % 2 ? 'heart' : 'star', 70), t, x, y + Math.sin(t * 3 + i) * 8, { scale: pop(t, .4 + 4.9 + i * .3) * .9, rot: Math.sin(t * 2 + i) * .2 }));
  } else if (nt < 12.35) {
    const lt = nt - 7.75;
    const sw = span(nt, 10.3, 10.6);
    put(ctx, T('ti3', 'สวัสดีค่ะ!', 84, '#b8553a', { halo: '#fffaf0' }), t, 540, 270, { scale: pop(nt, 7.85) * (1 - sw) });
    put(ctx, T('ti5', 'พาไปเจาะลึก 4 ภาค!', 80, '#3f7a48', { halo: '#fffaf0' }), t, 540, 270, { scale: pop(nt, 10.45) });
    const s = sticker('teacher_cut', 560, 960, '#f5c3cf');
    put(ctx, s, t, 540, 850 + (1 - easeOut(span(lt, 0, .6))) * 500, { scale: lerp(.9, 1, easeOut(span(lt, 0, .6))), rot: Math.sin(t * 1.4) * .012 });
    put(ctx, card(660, 150, '#fff3c4', '#e08a6a'), t, 540, 1420, { scale: pop(nt, 8.2), rot: -.02 });
    put(ctx, T('ti4', 'คุณครูของขวัญ', 92, '#b8553a'), t, 540, 1416, { scale: pop(nt, 8.3), rot: -.02 });
    put(ctx, icon('flower', 110), t, 170, 1250, { scale: pop(nt, 8.6), rot: t * .5 });
    put(ctx, icon('flower', 90), t, 900, 520, { scale: pop(nt, 8.8), rot: -t * .5 });
    put(ctx, icon('star', 80), t, 170, 520, { scale: pop(nt, 9.0), rot: t });
    put(ctx, icon('heart', 80), t, 910, 1220, { scale: pop(nt, 9.2), rot: Math.sin(t * 3) * .2 });
  } else {
    put(ctx, T('ti6', 'วันนี้เรียนอะไรบ้าง?', 80, '#b8553a', { halo: '#fffaf0' }), t, 540, 300, { scale: pop(nt, 12.5) });
    const items = [['scroll', 'ประวัติ', 12.85, '#fbe5ab'], ['hand', 'ท่ารำ', 13.55, '#fad0bd'], ['note', 'ดนตรี', 14.2, '#c3e4f3'], ['dress', 'ชุดการแสดง', 14.8, '#d3ebc7']];
    items.forEach(([ic, lb, t0, col], i) => {
      const x = i % 2 ? 765 : 315, y = 640 + Math.floor(i / 2) * 430, k = pop(nt, t0), bob = Math.sin(t * 3 + i) * 6;
      put(ctx, card(380, 360, col, '#c9a07a'), t, x, y + bob, { scale: k, rot: (i % 2 ? .03 : -.03) });
      put(ctx, icon(ic, 190), t, x, y - 40 + bob, { scale: k });
      put(ctx, T('it' + i, lb, 60, INK), t, x, y + 120 + bob, { scale: k });
    });
    put(ctx, T('ti7', 'ไปดูกันเลย!', 104, '#d0503f', { halo: '#fffaf0' }), t, 540, 1500, { scale: pop(nt, 15.75) * (1 + .04 * Math.sin(t * 9)), rot: Math.sin(t * 4) * .03 });
  }
}

// ---------- a region ----------
function regionScene(ctx, t, nt, r) {
  const D = R[r], X = D.t, C = RC[r];
  ctx.drawImage(bgFor(r, C.light), 0, 0);
  const lt = nt - X.start;
  // page 1: map
  let ox = slide(nt, -99, X.dance);
  if (ox !== null) {
    ctx.save(); ctx.translate(ox, 0);
    const zk = ease(span(lt, .1, 1.5));
    drawMap(ctx, t, camMix(CAM_FULL, camFor(r), zk), [r], { [r]: span(lt, .2, .7) });
    D.icons.forEach(([ic, nm], i) => {
      const [x, y] = SLOTS[r][i], k = pop(nt, X.title + .55 + i * .6), bob = Math.sin(t * 2.4 + i * 2) * 7;
      put(ctx, icon(ic, 180), t, x, y + bob, { scale: k, rot: Math.sin(t * 1.6 + i) * .05 });
      put(ctx, T('in' + r + i, nm, 40, C.dark, { halo: '#fffaf0' }), t, x, y + 118 + bob, { scale: k });
    });
    // history card
    const hk = pop(nt, X.hist[0] - .1), n = D.hist.length, ch = n === 2 ? 250 : 320, cy = 1300 + (n === 2 ? 0 : 20);
    put(ctx, card(940, ch, '#fffaf0', C.main), t, 540, cy, { scale: hk });
    if (hk > .02) {
      put(ctx, icon('scroll', 70), t, 120, cy - ch / 2 + 8, { scale: hk, rot: -.15 });
      D.hist.forEach((s, i) => putWrite(ctx, T('hs' + r + i, s, 50, INK), t, 540, cy - (n - 1) * 38 + i * 76, span(nt, X.hist[i] + .1, X.hist[i] + 1.1)));
    }
    ctx.restore();
  }
  // page 2: popular dances
  ox = slide(nt, X.dance, X.cost);
  if (ox !== null) {
    ctx.save(); ctx.translate(ox, 0);
    put(ctx, T('dt', 'การแสดงยอดฮิต', 88, '#d0503f', { halo: '#fffaf0' }), t, 540, 440, { scale: pop(nt, X.dance + .1) });
    put(ctx, icon('star', 80), t, 150, 430, { rot: t, scale: pop(nt, X.dance + .3) }); put(ctx, icon('star', 64), t, 930, 450, { rot: -t, scale: pop(nt, X.dance + .4) });
    const n = D.dances.length, gap = 215, y0 = n === 2 ? 690 : 635;
    D.dances.forEach(([ic, nm, sub], i) => {
      const y = y0 + i * gap, k = pop(nt, X.chips[i] - .15), bob = Math.sin(t * 3 + i) * 5;
      put(ctx, card(820, 180, i % 2 ? '#fff3c4' : '#fffaf0', C.main), t, 540, y + bob, { scale: k, rot: (i % 2 ? .015 : -.015) });
      put(ctx, icon(ic, 140), t, 230, y + bob, { scale: k, rot: Math.sin(t * 2 + i) * .08 });
      put(ctx, T('dn' + r + i, nm, sub ? 64 : 72, INK, { align: 'left' }), t, 330 + T('dn' + r + i, nm, sub ? 64 : 72, INK, { align: 'left' }).w / 2, y - (sub ? 22 : 0) + bob, { scale: k });
      if (sub) put(ctx, T('ds' + r + i, sub, 40, C.dark, { align: 'left' }), t, 330 + T('ds' + r + i, sub, 40, C.dark, { align: 'left' }).w / 2, y + 44 + bob, { scale: k });
    });
    // the drawn couple dancing at the bottom
    ['f', 'm'].forEach((g, i) => { const k = pop(nt, X.dance + .5 + i * .2), sw = Math.sin(t * Math.PI * 2 * D.bpm / 120 + i * 1.5); put(ctx, figSpr(r, g), t, 380 + i * 320, 1330 + Math.abs(sw) * -12, { scale: .62 * k, rot: sw * .05 }); });
    ctx.restore();
  }
  // page 3: costume
  ox = slide(nt, X.cost, X.music);
  if (ox !== null) {
    ctx.save(); ctx.translate(ox, 0);
    put(ctx, T('ct', 'เครื่องแต่งกาย', 88, '#d0503f', { halo: '#fffaf0' }), t, 540, 430, { scale: pop(nt, X.cost + .1) });
    put(ctx, icon('dress', 90), t, 150, 420, { scale: pop(nt, X.cost + .3), rot: -.1 });
    const st = sticker(r + '_cut', r === 'central' ? 560 : 500, 760, C.main), pk = easeOut(span(nt, X.cost + .2, X.cost + .8));
    const px = r === 'central' ? 320 : 300, py = 900;
    put(ctx, st, t, px, py + (1 - pk) * 200, { alpha: pk, rot: -.03 + Math.sin(t) * .006 });
    put(ctx, card(190, 70, '#e0574f', '#b8403a'), t, px - st.w / 2 + 90, py - st.h / 2 + 30, { scale: pop(nt, X.cost + .65), rot: -.08 });
    put(ctx, T('cr', 'ชุดจริง', 46, '#ffffff'), t, px - st.w / 2 + 90, py - st.h / 2 + 30, { scale: pop(nt, X.cost + .7), rot: -.08 });
    // drawn female and male
    const fx = r === 'central' ? [700, 880] : [665, 865];
    ['f', 'm'].forEach((g, i) => {
      const k = pop(nt, X.cost + .9 + i * .35), sw = Math.sin(t * 2 + i);
      put(ctx, figSpr(r, g), t, fx[i], 800, { scale: .78 * k, rot: sw * .02 });
      put(ctx, card(130, 62, g === 'f' ? '#fbe0ea' : '#d6e6fb', null), t, fx[i], 1100, { scale: k });
      put(ctx, T('g' + g, g === 'f' ? 'หญิง' : 'ชาย', 44, INK), t, fx[i], 1100, { scale: k });
    });
    // bullets
    let y = 1320;
    D.cost.forEach((s, i) => {
      const lines = s.split('\n').length, k = span(nt, X.costB[i], X.costB[i] + 1.0), spr = T('cb' + r + i, s, 44, INK, { align: 'left', lh: 1.35 });
      if (k > 0) { dot(ctx, 92, y + 2, 11 * pop(nt, X.costB[i]), C.main, i + boil(t, 3)); putWrite(ctx, spr, t, 120 + spr.w / 2, y + (lines - 1) * 30, k); }
      y += 78 + (lines - 1) * 62;
    });
    ctx.restore();
  }
  // page 4: music
  ox = slide(nt, X.music, 999);
  if (ox !== null) {
    ctx.save(); ctx.translate(ox, 0);
    put(ctx, T('mt', 'ดนตรี', 96, '#d0503f', { halo: '#fffaf0' }), t, 540, 420, { scale: pop(nt, X.music + .1) });
    put(ctx, icon('note', 90), t, 380, 420, { scale: pop(nt, X.music + .25), rot: Math.sin(t * 3) * .15 });
    put(ctx, icon('note', 70), t, 700, 410, { scale: pop(nt, X.music + .35), rot: -Math.sin(t * 3) * .15 });
    put(ctx, T('mc' + r, D.cap, 48, C.dark, { halo: '#fffaf0' }), t, 540, 525, { scale: pop(nt, X.cap) });
    const n = D.inst.length, rows = n <= 3 ? [n] : n === 4 ? [2, 2] : [3, 2];
    let idx = 0;
    rows.forEach((cnt, ri) => {
      for (let j = 0; j < cnt; j++, idx++) {
        const [ic, nm] = D.inst[idx], x = 540 + (j - (cnt - 1) / 2) * (cnt === 2 ? 340 : 300), y = (n <= 3 ? 820 : 740 + ri * 330);
        const k = pop(nt, X.inst[idx] - .1), bob = Math.sin(t * Math.PI * 2 * D.bpm / 60 / 2 + idx) * 6;
        put(ctx, icon(ic, n <= 3 ? 270 : 200), t, x, y + bob, { scale: k, rot: Math.sin(t * 2 + idx) * .05 });
        put(ctx, T('mn' + ic, nm, 52, INK, { halo: '#fffaf0' }), t, x, y + (n <= 3 ? 200 : 145), { scale: k });
      }
    });
    // tempo strip with notes hopping to the beat
    const tk = pop(nt, X.tempo - .1), beat = t * D.bpm / 60;
    const fk = pop(nt, X.music + .6) * (1 - span(nt, X.tempo - .4, X.tempo - .1));
    if (fk > .01) ['f', 'm'].forEach((g, i) => { const sw = Math.sin(t * Math.PI * D.bpm / 60 + i * 1.5); put(ctx, figSpr(r, g), t, 400 + i * 280, 1360 - Math.abs(sw) * 10, { scale: .5 * fk, rot: sw * .05 }); });
    put(ctx, card(920, 200, '#fff3c4', C.main), t, 540, 1360, { scale: tk });
    if (tk > .05) {
      put(ctx, T('tp' + r, D.tempo, 54, INK), t, 540, 1320, { scale: tk });
      for (let i = 0; i < 6; i++) { const ph = (beat + i * .5) % 1, hop = Math.sin(ph * Math.PI) * 26; put(ctx, icon('note', 46), t, 250 + i * 116, 1420 - hop, { scale: tk * .9, rot: (i % 2 ? .2 : -.2) }); }
    }
    ctx.restore();
  }
  // header + mini map stay put (not on the map page, where the map is the picture)
  header(ctx, t, r, fadeIn(nt, X.title - .2));
  const mk = clamp(span(nt, X.dance - .2, X.dance + .3));
  miniMap(ctx, t, r, 880, 255, mk);
}

// ---------- real performance clip ----------
function clipScene(ctx, t, seg) {
  const r = seg.name, C = RC[r], D = R[r], lt = t - seg.v0;
  ctx.drawImage(bgFor(r, C.light), 0, 0);
  header(ctx, t, r, 1); miniMap(ctx, t, r, 880, 255, 1);
  put(ctx, T('cl1', 'ชมการแสดงจริง!', 88, '#d0503f', { halo: '#fffaf0' }), t, 540, 470, { scale: pop(lt, .05) * (1 + .02 * Math.sin(t * 4)) });
  const [bx, by, bw, bh] = CLIPBOX, fk = span(lt, .1, .9);
  ctx.save(); ctx.fillStyle = '#2b2a33'; ctx.globalAlpha = easeOut(fk); ctx.fillRect(bx, by, bw, bh); ctx.restore();
  const fr = rrect(bx - 14, by - 14, bw + 28, bh + 28, 22), n = Math.floor(fr.length * fk);
  if (n > 1) cline(ctx, fr.slice(0, n), { color: C.dark, width: 14, seed: 3 + boil(t, 3), jit: 2.4 });
  if (fk >= 1) cline(ctx, fr, { closed: true, color: C.dark, width: 14, seed: 3 + boil(t, 3), jit: 2.4 });
  // tape on the corners
  [[bx + 10, by - 6, -.6], [bx + bw - 10, by - 6, .6], [bx + 10, by + bh + 6, .6], [bx + bw - 10, by + bh + 6, -.6]].forEach(([x, y, a], i) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.globalAlpha = pop(lt, .7 + i * .08); shape(ctx, rrect(-55, -18, 110, 36, 4), C.main, null, { seed: i + 40, alpha: .6, base: .55 }); ctx.restore(); });
  const pk = pop(lt, .5) * (1 - span(t, seg.play - .1, seg.play + .2));
  put(ctx, icon('play', 150), t, bx + bw / 2, by + bh / 2, { scale: pk });
  put(ctx, T('ctl' + r, D.clip, 64, INK, { halo: '#fffaf0' }), t, 540, 1290, { scale: pop(lt, .9) });
  D.icons.forEach(([ic], i) => put(ctx, icon(ic, 120), t, 300 + i * 240, 1450 + Math.sin(t * 2.4 + i * 2) * 8, { scale: pop(lt, 1.1 + i * .15) * .9, rot: Math.sin(t * 1.6 + i) * .06 }));
}

// ---------- outro + end card ----------
function outro(ctx, t, nt) {
  ctx.drawImage(bgFor('intro', '#f5c3cf'), 0, 0);
  put(ctx, T('o1', 'นาฏศิลป์พื้นเมือง 4 ภาค', 78, '#b8553a', { halo: '#fffaf0' }), t, 540, 270, { scale: pop(nt, 161.3) });
  REGIONS.forEach((r, i) => {
    const x = i % 2 ? 770 : 310, y = 650 + Math.floor(i / 2) * 460, k = pop(nt, 161.8 + i * .55), bob = Math.sin(t * 2 + i * 1.7) * 6;
    const st = sticker(r + '_cut', 360, 350, RC[r].main);
    put(ctx, card(420, 430, RC[r].light, RC[r].main), t, x, y + bob, { scale: k, rot: i % 2 ? .02 : -.02 });
    put(ctx, st, t, x, y - 26 + bob, { scale: k * .95 });
    put(ctx, T('on' + r, RC[r].name, 50, RC[r].dark, { halo: '#fffaf0' }), t, x, y + 180 + bob, { scale: k });
    put(ctx, card(86, 86, '#ffffff', RC[r].dark), t, x - 170, y - 170 + bob, { scale: pop(nt, 165.6 + i * .2) });
    put(ctx, T('onum' + i, String(i + 1), 60, RC[r].dark), t, x - 170, y - 170 + bob, { scale: pop(nt, 165.6 + i * .2) });
  });
  const bk = pop(nt, 165.5);
  put(ctx, icon('bubble', 150), t, 150, 1450, { scale: bk, rot: Math.sin(t * 3) * .06 });
  put(ctx, T('o2', 'ชอบภาคไหนที่สุด?', 70, INK, { halo: '#fffaf0' }), t, 600, 1410, { scale: bk });
  put(ctx, T('o3', 'คอมเมนต์บอกกันหน่อย!', 58, '#d0503f', { halo: '#fffaf0' }), t, 600, 1505, { scale: pop(nt, 166.9) * (1 + .03 * Math.sin(t * 8)) });
}
function endCard(ctx, t, lt) {
  ctx.drawImage(bgFor('intro', '#f5c3cf'), 0, 0);
  const lk = pop(lt, .1, .6);
  const L = { w: 520, h: 520, c: [IMG.logo_round], scale: 1 };
  shape(ctx, ell(540, 640, 285 * lk, 285 * lk, 40), '#fffaf0', '#7fc6c9', { seed: 3 + boil(t, 3), lw: 10 });
  put(ctx, L, t, 540, 640, { scale: lk, rot: Math.sin(t * 1.5) * .02 });
  const st = sticker('teacher_cut', 430, 760, null), tk = easeOut(span(lt, .5, 1.2));
  put(ctx, st, t, 300, 1330 + (1 - tk) * 700, { rot: -.03 });
  put(ctx, T('e1', 'ขอบคุณที่รับชมค่ะ', 64, '#b8553a', { halo: '#fffaf0' }), t, 790, 1110, { scale: pop(lt, 1.0) * .9 });
  put(ctx, T('e2', 'ฝากติดตาม', 56, INK, { halo: '#fffaf0' }), t, 790, 1230, { scale: pop(lt, 1.4) });
  put(ctx, T('e3', 'ครูของขวัญ TS', 70, '#3f8f8f', { halo: '#fffaf0' }), t, 790, 1320, { scale: pop(lt, 1.6) });
  put(ctx, icon('heart', 110), t, 790, 1470 + Math.sin(t * 4) * 8, { scale: pop(lt, 1.9) * (1 + .06 * Math.sin(t * 6)) });
  put(ctx, icon('star', 80), t, 200, 300, { scale: pop(lt, .6), rot: t }); put(ctx, icon('flower', 100), t, 880, 330, { scale: pop(lt, .8), rot: -t * .6 });
}

// ---------- frame ----------
function init() { buildMap(); }
function drawFrame(ctx, t) {
  const seg = segAt(t);
  if (seg.kind === 'narr') {
    const nt = seg.n0 + (t - seg.v0 - seg.lead);
    if (seg.name === 'intro') intro(ctx, t, nt);
    else if (seg.name === 'outro') outro(ctx, t, nt);
    else regionScene(ctx, t, nt, seg.name);
  } else if (seg.kind === 'clip') clipScene(ctx, t, seg);
  else endCard(ctx, t, t - seg.v0);
  // wipes at segment boundaries (colour of what comes next)
  for (let i = 1; i < TL.segs.length; i++) {
    const s = TL.segs[i], prev = TL.segs[i - 1];
    if (s.kind === 'clip') continue;               // into a clip: no wipe, the page stays
    const col = RC[s.name] ? RC[s.name].main : '#f19bb8';
    wipe(ctx, t, s.v0, col);
  }
  for (const tb of [8.15, 12.75]) wipe(ctx, t, tb, '#f5c3cf');   // inside the intro: title → teacher → topics
}

// ---------- sound cue list (video seconds) for the audio mixer ----------
function n2v(nt) { for (const s of TL.segs) if (s.kind === 'narr' && nt >= s.n0 - 1e-6 && nt <= s.n1 + 1e-6) return s.v0 + s.lead + (nt - s.n0); return null; }
function sfxEvents() {
  const E = [], add = (t, type, g = 1) => { if (t !== null) E.push({ t: +t.toFixed(3), type, g }); };
  // intro
  add(.4 + .9, 'sparkle'); [0, 1, 2, 3].forEach(i => add(n2v(1.6 + i * .7), 'pop', .7));
  add(n2v(4.9), 'sparkle', .6); add(n2v(7.85), 'pop'); add(n2v(8.2), 'sparkle', .8); add(n2v(10.45), 'pop', .7);
  [12.85, 13.55, 14.2, 14.8].forEach(x => add(n2v(x), 'pop')); add(n2v(15.75), 'tada', .8);
  for (const r of REGIONS) {
    const X = R[r].t, v = n2v;
    add(v(X.start) + .1, 'zoom'); add(v(X.title + .2), 'pop', .6);
    [0, 1, 2].forEach(i => add(v(X.title + .55 + i * .6), 'pop'));
    add(v(X.hist[0] - .1), 'pop', .6); X.hist.forEach(h => add(v(h + .1), 'scribble', .8));
    for (const k of ['dance', 'cost', 'music']) add(v(X[k]) - .05, 'whoosh', .7);
    X.chips.forEach(c => add(v(c - .15), 'pop'));
    add(v(X.cost + .2), 'pop', .8); add(v(X.cost + .9), 'pop', .6); add(v(X.cost + 1.25), 'pop', .6);
    X.costB.forEach(c => add(v(c), 'scribble', .7));
    X.inst.forEach(c => add(v(c - .1), 'pop')); add(v(X.tempo - .1), 'pop', .7);
    const cs = TL.segs.find(s => s.kind === 'clip' && s.name === r); add(cs.v0 + .05, 'tada', .8);
  }
  for (const s of TL.segs) if (s.kind !== 'clip' && s.v0 > 0) add(s.v0 - .3, 'whoosh', .9);
  [8.15 - .3, 12.75 - .3].forEach(x => add(x, 'whoosh', .7));
  [0, 1, 2, 3].forEach(i => add(n2v(161.8 + i * .55), 'pop')); add(n2v(165.5), 'pop'); add(n2v(166.9), 'sparkle', .7);
  const end = TL.segs[TL.segs.length - 1]; add(end.v0 + .1, 'pop'); add(end.v0 + 1.0, 'sparkle');
  return E.sort((a, b) => a.t - b.t);
}
