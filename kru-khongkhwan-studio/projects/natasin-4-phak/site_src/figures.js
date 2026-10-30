// Kid-crayon dancers in each region's costume (female and male). Local coords: feet at y=+215, head centre at y=-175.
const SKIN = '#f3c9a5', HAIR = '#2e2420';

function motif(x, pts, type, color, seed) {   // fabric pattern clipped to a shape
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  x.save(); polyPath(x, pts, true); x.clip();
  if (type === 'stripe') for (let y = y0 + 6; y < y1; y += 11) cline(x, [[x0 - 4, y], [x1 + 4, y + 1]], { color, width: 3, seed: seed + y, passes: 1 });
  if (type === 'check') { for (let y = y0 + 4; y < y1; y += 14) cline(x, [[x0 - 4, y], [x1 + 4, y]], { color, width: 4, seed: seed + y, passes: 1 }); for (let xx = x0 + 4; xx < x1; xx += 14) cline(x, [[xx, y0 - 4], [xx, y1 + 4]], { color, width: 4, seed: seed + xx, passes: 1 }); }
  if (type === 'mudmee') for (let y = y0 + 10; y < y1; y += 22) { const p = []; for (let xx = x0 - 10; xx < x1 + 12; xx += 12) p.push([xx, y + ((xx - x0) / 12 % 2 < 1 ? -6 : 6)]); cline(x, p, { color, width: 3, seed: seed + y, passes: 1 }); }
  if (type === 'dots') { const r = rng(seed); for (let y = y0 + 8; y < y1; y += 16) for (let xx = x0 + 8 + (y % 32 ? 8 : 0); xx < x1; xx += 16) dot(x, xx + (r() - .5) * 3, y, 2.6, color, seed + xx); }
  if (type === 'beads') { for (let y = y0 + 6; y < y1; y += 12) for (let xx = x0 + 6; xx < x1; xx += 12) { const k = (Math.floor((xx - x0) / 12) + Math.floor((y - y0) / 12)) % 3; dot(x, xx, y, 3.6, ['#e0574f', '#f6c34a', '#3f9e7a'][k], seed + xx * 3 + y); } }
  x.restore();
}
function limb(x, a, b, c, color, w, seed) { cline(x, [a, b, c], { color, width: w, seed, jit: 1, passes: 2 }); cline(x, [a, b, c], { color: INK, width: 2.2, seed: seed + 5, passes: 1, alpha: .35 }); }

function figure(x, F, s) {
  const male = F.g === 'm';
  // pose: a = shoulder, e = elbow, h = hand (left side of the picture = figure's right arm, raised)
  const P = male
    ? { R: [[-44, -112], [-104, -138], [-98, -206]], L: [[44, -112], [100, -88], [114, -132]] }
    : { R: [[-40, -112], [-90, -146], [-72, -214]], L: [[40, -112], [84, -72], [62, -34]] };
  // back pieces
  if (F.tail) { shape(x, [...bez([20, -30], [80, -40], [110, -110], [96, -170]), [86, -168], ...bez([90, -120], [70, -60], [30, -40], [20, -10])], GOLD, INK, { seed: s + 1, lw: 3 }); motif(x, [[30, -30], [96, -170], [86, -160], [20, -10]], 'beads', 0, s); }
  if (F.sabaiTail) shape(x, [[-40, -118], [-14, -118], [-26, 40], [-56, 60], [-60, 0]], F.sabaiTail, INK, { seed: s + 2, lw: 3 });
  // legs / feet
  const legBottom = { sin: 196, chong: 100, sado: 150, khakuay: 136, nora: 186 }[F.bottom.t];
  for (const sx of [-1, 1]) {
    cline(x, [[sx * 18, legBottom - 6], [sx * 18, 206]], { color: SKIN, width: 22, seed: s + 10 + sx });
    shape(x, ell(sx * 24, 212, 20, 9, 14), SKIN, INK, { seed: s + 12 + sx, lw: 3 });
    if (F.anklet) cline(x, [[sx * 18 - 12, 196], [sx * 18 + 12, 196]], { color: GOLD, width: 6, seed: s + 14 + sx });
  }
  // lower garment
  const B = F.bottom;
  if (B.t === 'sin') {
    const sk = [[-34, -42], [34, -42], [40, 120], [44, 200], [-44, 200], [-40, 120]];
    shape(x, sk, B.c, INK, { seed: s + 20 }); if (B.p) motif(x, sk, B.p, B.pc, s + 21);
    const hem = [[-41, 150], [41, 150], [44, 200], [-44, 200]]; shape(x, hem, B.hem, INK, { seed: s + 22, lw: 3 }); motif(x, hem, B.hemP || 'dots', B.hemC || GOLD, s + 23);
  } else {
    const kneeY = { chong: 100, sado: 150, khakuay: 136, nora: 186 }[B.t], wide = { chong: 54, sado: 44, khakuay: 52, nora: 38 }[B.t];
    const pants = [[-36, -42], [36, -42], [wide, 30], [wide - 4, kneeY - 14], [8, kneeY], [4, 40], [-4, 40], [-8, kneeY], [-(wide - 4), kneeY - 14], [-wide, 30]];
    shape(x, pants, B.c, INK, { seed: s + 20 }); if (B.p) motif(x, pants, B.p, B.pc, s + 21);
    if (B.t === 'chong') cline(x, quad([-4, -36], [10, 30], [0, 60]), { color: INK, width: 2.5, seed: s + 24, alpha: .6 });   // the tucked tail of the jong kraben
    if (B.cuff) for (const sx of [-1, 1]) { const cuff = [[sx * 6, kneeY - 18], [sx * (wide - 2), kneeY - 30], [sx * (wide - 4), kneeY - 12], [sx * 8, kneeY]]; shape(x, cuff, B.cuff, INK, { seed: s + 25 + sx, lw: 2.5 }); motif(x, cuff, 'beads', 0, s + 26 + sx); }
    if (B.over) { const ov = [[-40, -42], [40, -42], [46, 60], [-46, 60]]; shape(x, ov, B.over, INK, { seed: s + 27 }); if (B.overP) motif(x, ov, B.overP, B.overPC, s + 28); }
    if (B.front) { const fr = [[-16, -30], [16, -30], [20, 110], [0, 124], [-20, 110]]; shape(x, fr, B.front, INK, { seed: s + 29, lw: 3 }); motif(x, fr, 'beads', 0, s + 30); }
  }
  // torso
  const Tp = F.top, torso = [[-40, -120], [40, -120], [36, -40], [-36, -40]];
  const sleeved = Tp.t === 'sleeve' || Tp.t === 'mohom';
  const armColor = Tp.t === 'sleeve' || (Tp.t === 'mohom' && Tp.long) ? Tp.c : SKIN;
  if (Tp.t === 'sabai') {
    shape(x, [[-30, -100], [30, -100], [34, -42], [-34, -42]], Tp.c, INK, { seed: s + 40 });
    shape(x, ell(0, -120, 22, 10, 12, 0, Math.PI), SKIN, null, { seed: s + 41 });
    const sb = [[-44, -124], [-16, -124], [38, -60], [36, -36], [10, -44]]; shape(x, sb, Tp.c2, INK, { seed: s + 42 }); if (Tp.p2) motif(x, sb, Tp.p2, Tp.pc2, s + 43);
  } else if (Tp.t === 'beads') {
    shape(x, torso, SKIN, INK, { seed: s + 40 });
    const vest = [[-44, -124], [44, -124], [40, -70], [0, -50], [-40, -70]]; shape(x, vest, '#e9c45a', INK, { seed: s + 41 }); motif(x, vest, 'beads', 0, s + 42);
    for (const sx of [-1, 1]) { const ep = [[sx * 30, -126], [sx * 58, -118], [sx * 50, -96], [sx * 28, -106]]; shape(x, ep, GOLD, INK, { seed: s + 44 + sx, lw: 2.5 }); }
  } else {
    shape(x, torso, Tp.c, INK, { seed: s + 40 }); if (Tp.p) motif(x, torso, Tp.p, Tp.pc, s + 41);
    shape(x, ell(0, -121, 14, 8, 12, 0, Math.PI), SKIN, INK, { seed: s + 42, lw: 2.5 });
    if (Tp.t === 'mohom') for (let i = 0; i < 4; i++) dot(x, 0, -104 + i * 18, 3.2, '#f3efe2', s + 43 + i);
  }
  if (F.belt) shape(x, rrect(-38, -50, 76, 14, 6), F.belt, INK, { seed: s + 50, lw: 2.5 });
  if (F.sash) { const sh = [[-38, -52], [38, -52], [38, -36], [-38, -36]]; shape(x, sh, F.sash, INK, { seed: s + 51, lw: 3 }); motif(x, sh, 'check', F.sashC || '#ffffff', s + 52);
    const tl = [[16, -40], [30, -40], [34, 30], [18, 34]]; shape(x, tl, F.sash, INK, { seed: s + 53, lw: 2.5 }); motif(x, tl, 'check', F.sashC || '#ffffff', s + 54); }
  if (F.shoulderCloth) { const sc = [[-40, -126], [-18, -126], [40, -46], [20, -40]]; shape(x, sc, F.shoulderCloth, INK, { seed: s + 55, lw: 3 }); motif(x, sc, 'check', F.sashC || '#ffffff', s + 56); }
  if (F.wings) for (const sx of [-1, 1]) { const wg = [...bez([sx * 36, -44], [sx * 80, -50], [sx * 96, -10], [sx * 92, 22]), ...bez([sx * 92, 22], [sx * 74, 0], [sx * 56, -10], [sx * 34, -18])]; shape(x, wg, '#d6dde4', INK, { seed: s + 57 + sx }); cline(x, bez([sx * 40, -36], [sx * 70, -36], [sx * 82, -12], [sx * 86, 10]), { color: GOLD, width: 3, seed: s + 59 + sx }); }
  if (F.kratib) { cline(x, [[-30, -118], [52, -20]], { color: '#8a5a3b', width: 4, seed: s + 60 }); shape(x, rrect(40, -30, 36, 44, 8), '#d9a65a', INK, { seed: s + 61, lw: 3 }); for (let i = 0; i < 3; i++) cline(x, [[42, -18 + i * 12], [74, -18 + i * 12]], { color: '#a8743a', width: 2, seed: s + 62 + i }); }
  // arms
  for (const k of ['R', 'L']) {
    const [a, e, h] = P[k];
    if (sleeved && armColor !== SKIN) { limb(x, a, e, [lerp(e[0], h[0], .82), lerp(e[1], h[1], .82)], armColor, 24, s + 70 + (k === 'R')); }
    else if (Tp.t === 'mohom') { limb(x, a, e, h, SKIN, 18, s + 72 + (k === 'R')); limb(x, a, [lerp(a[0], e[0], .7), lerp(a[1], e[1], .7)], [lerp(a[0], e[0], .72), lerp(a[1], e[1], .72)], Tp.c, 26, s + 74); }
    else if (Tp.t === 'sabai' && k === 'R' && F.sabaiArm) { limb(x, a, e, h, SKIN, 18, s + 76); }
    else limb(x, a, e, h, SKIN, 18, s + 78 + (k === 'R'));
    if (sleeved && armColor !== SKIN) limb(x, [lerp(e[0], h[0], .8), lerp(e[1], h[1], .8)], h, h, SKIN, 16, s + 80);
    shape(x, ell(h[0], h[1], 11, 11, 12), SKIN, INK, { seed: s + 82 + (k === 'R'), lw: 2.5 });
    if (F.bangle) cline(x, [[lerp(e[0], h[0], .7) - 10, lerp(e[1], h[1], .7)], [lerp(e[0], h[0], .7) + 10, lerp(e[1], h[1], .7)]], { color: F.bangle, width: 6, seed: s + 84 });
    if (F.nails) { const dir = Math.atan2(h[1] - e[1], h[0] - e[0]); for (let i = -1; i <= 2; i++) { const d2 = dir + i * .22; const p0 = [h[0] + Math.cos(d2) * 9, h[1] + Math.sin(d2) * 9]; const p1 = [p0[0] + Math.cos(d2) * 22, p0[1] + Math.sin(d2) * 22]; const p2 = [p1[0] + Math.cos(d2 + .6) * 14, p1[1] + Math.sin(d2 + .6) * 14]; cline(x, F.nails === 'curve' ? [p0, p1, p2] : [p0, p1, [p1[0] + Math.cos(d2) * 10, p1[1] + Math.sin(d2) * 10]], { color: GOLD, width: 3.6, seed: s + 86 + i, passes: 1 }); } }
  }
  // props in hands
  if (F.sickle) { const h = P.L[2]; x.save(); x.translate(h[0] + 6, h[1] - 4); x.scale(.42, .42); x.rotate(.5); IC.sickle(x, s + 90); x.restore(); }
  if (F.rice) { const h = P.R[2]; x.save(); x.translate(h[0] - 6, h[1] - 30); x.scale(.38, .38); IC.rice(x, s + 92); x.restore(); }
  // head
  shape(x, ell(0, -175, 50, 52, 30), SKIN, INK, { seed: s + 100 });
  const H0 = F.hair;
  if (H0 === 'bun' || H0 === 'bunTall') {
    shape(x, [...ell(0, -178, 52, 52, 20, Math.PI, Math.PI * 2), [40, -186], [0, -196], [-40, -186]], HAIR, null, { seed: s + 101 });
    shape(x, ell(0, -238, 26, 22, 18), HAIR, INK, { seed: s + 102, lw: 3 });
  } else if (H0 === 'short') shape(x, [...ell(0, -180, 52, 50, 20, Math.PI * 1.02, Math.PI * 1.98), [44, -180], [20, -200], [-10, -192], [-44, -176]], HAIR, null, { seed: s + 101 });
  // face
  dot(x, -18, -172, 5, INK, s + 103); dot(x, 18, -172, 5, INK, s + 104);
  shape(x, ell(-30, -154, 10, 6, 10), '#f39aa0', null, { seed: s + 105, alpha: .6 }); shape(x, ell(30, -154, 10, 6, 10), '#f39aa0', null, { seed: s + 106, alpha: .6 });
  cline(x, quad([-12, -148], [0, -138], [12, -148]), { color: male ? INK : '#d0504f', width: 3.4, seed: s + 107 });
  if (!male) { cline(x, [[-26, -184], [-12, -186]], { color: INK, width: 2.4, seed: s + 108 }); cline(x, [[12, -186], [26, -184]], { color: INK, width: 2.4, seed: s + 109 }); }
  if (F.earring) for (const sx of [-1, 1]) dot(x, sx * 50, -158, 5, GOLD, s + 110 + sx);
  // headwear
  if (F.flowers) { for (let i = 0; i < 5; i++) { const a = Math.PI * (1.05 + i * .22); dot(x, Math.cos(a) * 30, -238 + Math.sin(a) * 22 + 10, 9, F.flowers, s + 112 + i); } }
  if (F.flower) { shape(x, ell(-30, -226, 15, 15, 14), F.flower, INK, { seed: s + 118, lw: 2.5 }); dot(x, -30, -226, 5, '#f8cf4a', s + 119); }
  if (F.pin) cline(x, [[10, -250], [40, -270]], { color: GOLD, width: 4, seed: s + 120 });
  if (F.headband) { cline(x, quad([-50, -196], [0, -216], [50, -196]), { color: F.headband, width: 12, seed: s + 121 }); cline(x, [[48, -198], [64, -176], [60, -160]], { color: F.headband, width: 7, seed: s + 122 }); }
  if (F.ngob) { shape(x, [[-86, -206], [0, -262], [86, -206], [52, -196], [-52, -196]], '#e8c77a', INK, { seed: s + 123 }); for (let i = -2; i <= 2; i++) cline(x, [[0, -258], [i * 34, -202]], { color: '#b48d43', width: 2, seed: s + 124 + i }); }
  if (F.serid) { shape(x, [[-44, -206], [44, -206], [36, -232], [14, -262], [6, -300], [0, -322], [-6, -300], [-14, -262], [-36, -232]], GOLD, INK, { seed: s + 130 });
    for (let i = 0; i < 3; i++) cline(x, [[-34 + i * 8, -222 - i * 28], [34 - i * 8, -222 - i * 28]], { color: '#c88a1c', width: 3.5, seed: s + 131 + i }); dot(x, 0, -224, 6, RED, s + 135);
    for (const sx of [-1, 1]) shape(x, [[sx * 44, -204], [sx * 66, -190], [sx * 56, -150], [sx * 46, -166]], GOLD, INK, { seed: s + 136 + sx, lw: 2.5 }); }
}

const FIG = {
  north: {
    f: { g: 'f', hair: 'bun', flowers: '#fffaf0', pin: true, earring: true, top: { t: 'sabai', c: '#fffaf0', c2: '#e7c77a', p2: 'dots', pc2: '#c9962a' }, sabaiTail: '#e7c77a', bottom: { t: 'sin', c: '#c98a3a', p: 'stripe', pc: '#e8b560', hem: '#4a2f3a', hemP: 'mudmee', hemC: GOLD }, belt: GOLD, nails: 'long', bangle: GOLD },
    m: { g: 'm', hair: 'short', headband: '#e9e0c9', top: { t: 'mohom', c: '#34457a', long: true }, bottom: { t: 'sado', c: '#34457a' }, sash: '#d0503f', sashC: '#f6c34a' },
  },
  central: {
    f: { g: 'f', hair: 'bun', ngob: true, earring: true, top: { t: 'sleeve', c: '#7cc3ea' }, bottom: { t: 'chong', c: '#2f3f7a' }, belt: '#f3efe2', sickle: true, rice: true },
    m: { g: 'm', hair: 'short', ngob: true, top: { t: 'mohom', c: '#2f3f7a', long: true }, bottom: { t: 'chong', c: '#2f3f7a' }, sash: '#d0503f', sashC: '#f6c34a', sickle: true, rice: true },
  },
  isan: {
    f: { g: 'f', hair: 'bun', flower: '#e0574f', earring: true, top: { t: 'sleeve', c: '#f08a4b' }, shoulderCloth: '#c0392b', sashC: '#f6c34a', bottom: { t: 'sin', c: '#4a3550', p: 'mudmee', pc: '#e8b560', hem: '#2a1f30', hemP: 'dots', hemC: '#f08a4b' }, belt: SILVER, kratib: true, bangle: SILVER },
    m: { g: 'm', hair: 'short', top: { t: 'mohom', c: '#3c4f86' }, bottom: { t: 'khakuay', c: '#3c4f86' }, sash: '#3f9e5a', sashC: '#e0574f', shoulderCloth: '#3f9e5a' },
  },
  south: {
    f: { g: 'f', hair: 'bun', serid: true, top: { t: 'beads' }, bottom: { t: 'nora', c: '#c73a3a', cuff: GOLD, over: '#e9b83a', overP: 'stripe', overPC: '#c88a1c', front: '#e9c45a' }, wings: true, tail: true, nails: 'curve', bangle: GOLD, earring: true },
    m: { g: 'm', hair: 'short', serid: true, top: { t: 'beads' }, bottom: { t: 'nora', c: '#2f8f6a', cuff: GOLD, over: '#c73a3a', overP: 'stripe', overPC: '#e08a6a', front: '#e9c45a' }, wings: true, tail: true, nails: 'curve', bangle: GOLD },
  },
};
const FIGS = {};
function figSpr(r, g) { const k = r + g; return FIGS[k] || (FIGS[k] = sprite(330, 600, (x, s) => { x.translate(0, 40); figure(x, FIG[r][g], s); })); }
