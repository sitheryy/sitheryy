// Kid-crayon icons, each drawn around (0,0) in a ~220 px box.
const IC = {};
const BROWN = '#8a5a3b', WOOD = '#c98b52', GOLD = '#e9b83a', SILVER = '#b9c3cc', RED = '#e0574f', GREEN = '#6db36a', BLUE = '#5aa9d6', PINK = '#f19bb8', PURPLE = '#a68bd6', CREAM = '#fff6dc', DARK = '#3d3d4a';

IC.umbrella = (x, s) => {   // Bo Sang paper umbrella
  const R = 92, pts = []; for (let i = 0; i <= 8; i++) { const a = Math.PI + Math.PI * i / 8; pts.push([Math.cos(a) * R, Math.sin(a) * R * .62 - 10]); }
  const canopy = [...pts, ...[...Array(9)].map((_, i) => { const a = -Math.PI * i / 8; return [Math.cos(a) * R, -10 + Math.abs(Math.sin(a * 4)) * 10]; })];
  shape(x, canopy, '#f07d6a', INK, { seed: s });
  for (let i = 1; i < 8; i++) { const a = Math.PI + Math.PI * i / 8; cline(x, [[0, -66], [Math.cos(a) * R * .97, Math.sin(a) * R * .6 - 8]], { color: '#b8473d', width: 2.5, seed: s + i }); }
  shape(x, ell(0, -40, 26, 14), GOLD, null, { seed: s + 2 });
  for (let i = 0; i < 6; i++) dot(x, -60 + i * 24, -24 + Math.abs(i - 2.5) * -3, 5, '#ffe08a', s + i);
  cline(x, [[0, -66], [0, 80]], { color: BROWN, width: 6, seed: s + 3 });
  cline(x, [[0, 80], [0, 92], [-14, 96]], { color: BROWN, width: 6, seed: s + 4 });
};
IC.mountain = (x, s) => {
  shape(x, [[-110, 70], [-50, -40], [-20, 0], [20, -75], [110, 70]], '#7cb77a', INK, { seed: s });
  shape(x, [[20, -75], [0, -40], [14, -46], [24, -34], [40, -48]], '#ffffff', INK, { seed: s + 1, lw: 3 });
  shape(x, [[-50, -40], [-63, -16], [-48, -22], [-38, -14]], '#ffffff', INK, { seed: s + 2, lw: 3 });
  shape(x, [[-110, 70], [-80, 30], [-40, 70]], '#4f9a56', null, { seed: s + 3 });
  cline(x, quad([-100, 20], [-70, 8], [-40, 22]), { color: '#a9c9e0', width: 6, seed: s + 4 });   // mist
  cline(x, quad([30, 10], [70, -2], [104, 14]), { color: '#a9c9e0', width: 6, seed: s + 5 });
  shape(x, ell(72, -70, 20, 20, 16), '#f6c34a', null, { seed: s + 6 });
};
IC.lantern = (x, s) => {   // Lanna khom (yi peng)
  cline(x, [[0, -95], [0, -70]], { color: INK, width: 3, seed: s });
  shape(x, [[-30, -70], [30, -70], [62, -20], [40, 40], [-40, 40], [-62, -20]], '#f6c34a', INK, { seed: s + 1 });
  cline(x, [[-62, -20], [62, -20]], { color: '#d2463c', width: 5, seed: s + 2 });
  cline(x, [[-50, 12], [50, 12]], { color: '#d2463c', width: 5, seed: s + 3 });
  for (let i = -2; i <= 2; i++) cline(x, [[i * 14, 40], [i * 16, 90]], { color: i % 2 ? '#d2463c' : GOLD, width: 4, seed: s + 4 + i });
  shape(x, ell(0, -24, 10, 14, 12), '#fff2b5', null, { seed: s + 9 });
};
IC.sickle = (x, s) => {
  const blade = [...bez([-40, 40], [-90, -30], [-10, -100], [70, -70]), ...bez([70, -70], [10, -76], [-50, -40], [-28, 36])];
  shape(x, blade, SILVER, INK, { seed: s });
  shape(x, rrect(-50, 34, 26, 70, 10).map(([a, b]) => [a + Math.sin(.4) * (b - 34) * .5, b]), WOOD, INK, { seed: s + 1 });
};
IC.rice = (x, s) => {   // a rice plant with drooping golden ears
  for (let i = -2; i <= 2; i++) cline(x, quad([i * 8, 95], [i * 18, 20], [i * 30 + (i > 0 ? 25 : -25), -40]), { color: '#5ea85a', width: 6, seed: s + i });
  const ear = (x0, y0, dir) => { for (let k = 0; k < 6; k++) shape(x, ell(x0 + dir * k * 9, y0 + k * 11, 7, 11, 10), GOLD, null, { seed: s + k + 20 }); };
  ear(-50, -60, -.4); ear(55, -64, .4); ear(-8, -96, .1);
  cline(x, [[-30, 95], [30, 95]], { color: '#8a6b3b', width: 5, seed: s + 9 });
};
IC.ngob = (x, s) => {   // ngob farmer's hat
  shape(x, [[-110, 30], [0, -70], [110, 30], [70, 44], [-70, 44]], '#e8c77a', INK, { seed: s });
  for (let i = -3; i <= 3; i++) cline(x, [[0, -66], [i * 30, 38]], { color: '#b48d43', width: 2.5, seed: s + i });
  cline(x, quad([-60, 14], [0, -4], [60, 14]), { color: '#b48d43', width: 3, seed: s + 9 });
  shape(x, ell(0, 30, 46, 14, 20), '#c9a35a', null, { seed: s + 10 });
};
IC.kratib = (x, s) => {   // sticky-rice basket
  shape(x, [[-52, -30], [52, -30], [60, 70], [-60, 70]], '#d9a65a', INK, { seed: s });
  for (let i = 0; i < 5; i++) cline(x, [[-56 + i * .6, -10 + i * 18], [56 - i * .6, -10 + i * 18]], { color: '#a8743a', width: 3, seed: s + i });
  for (let i = -2; i <= 2; i++) cline(x, [[i * 22, -30], [i * 24, 70]], { color: '#b88447', width: 2, seed: s + 10 + i });
  shape(x, [[-56, -62], [56, -62], [52, -30], [-52, -30]], '#c48f4b', INK, { seed: s + 2 });
  cline(x, bez([-50, -62], [-60, -140], [60, -140], [50, -62]), { color: '#8a5a3b', width: 5, seed: s + 3 });
  shape(x, rrect(-62, 70, 124, 18, 6), '#a8743a', INK, { seed: s + 4, lw: 3 });
};
IC.somtam = (x, s) => {   // mortar, pestle, papaya salad
  shape(x, [[-80, -10], [80, -10], [60, 60], [36, 84], [-36, 84], [-60, 60]], '#b07a4a', INK, { seed: s });
  shape(x, ell(0, -10, 80, 18, 24), '#f4d76a', INK, { seed: s + 1, lw: 3 });
  for (let i = 0; i < 9; i++) cline(x, [[-56 + i * 14, -14 + (i % 2) * 6], [-44 + i * 14, -22]], { color: '#9ccf6a', width: 4, seed: s + i });
  dot(x, -30, -18, 9, RED, s + 30); dot(x, 24, -16, 8, RED, s + 31); dot(x, 46, -22, 6, '#5a9e4f', s + 32);
  shape(x, rrect(30, -110, 22, 96, 10).map(([a, b]) => [a + (b + 110) * .25, b]), '#c98b52', INK, { seed: s + 5 });
  cline(x, [[-50, 36], [50, 36]], { color: '#8a5a3b', width: 3, seed: s + 6 });
};
IC.khaen = (x, s) => {
  for (let i = 0; i < 7; i++) { const dx = -36 + i * 12, top = -100 + Math.abs(i - 3) * 14; shape(x, rrect(dx - 5, top, 10, 190 - Math.abs(i - 3) * 22, 4), '#d9b26a', INK, { seed: s + i, lw: 2.2 }); }
  shape(x, ell(0, 30, 30, 22, 20), '#8a5a3b', INK, { seed: s + 9 });
  shape(x, rrect(-8, 46, 16, 36, 6), '#6b4329', null, { seed: s + 10 });
  for (let k = 0; k < 3; k++) cline(x, [[-42, -40 + k * 34], [42, -40 + k * 34]], { color: '#8a5a3b', width: 3, seed: s + 20 + k });
};
IC.sea = (x, s) => {
  shape(x, ell(54, -58, 26, 26, 18), '#f6c34a', null, { seed: s });
  shape(x, [[-46, -16], [-46, -94], [6, -16]], '#ffffff', INK, { seed: s + 1, lw: 3 });                     // sail
  shape(x, [[-86, -10], [40, -10], [20, 16], [-70, 16]], '#d0503f', INK, { seed: s + 2 });                  // boat (kor lae)
  cline(x, [[-46, -94], [-46, -10]], { color: BROWN, width: 4, seed: s + 3 });
  for (let r = 0; r < 3; r++) { const y = 34 + r * 26, p = []; for (let i = 0; i <= 10; i++) p.push([-110 + i * 22, y + Math.sin(i * 1.6 + r) * 8]); cline(x, p, { color: r === 1 ? '#3f8fbf' : BLUE, width: 7, seed: s + 5 + r }); }
};
IC.serid = (x, s) => {   // nora's serid crown
  shape(x, [[-50, 40], [50, 40], [40, -10], [16, -50], [8, -100], [0, -126], [-8, -100], [-16, -50], [-40, -10]], GOLD, INK, { seed: s });
  for (let i = 0; i < 4; i++) cline(x, [[-38 + i * 4, 22 - i * 34], [38 - i * 4, 22 - i * 34]], { color: '#c88a1c', width: 4, seed: s + i });
  dot(x, 0, 10, 9, RED, s + 7); dot(x, -24, 14, 6, '#4fb08a', s + 8); dot(x, 24, 14, 6, '#4fb08a', s + 9); dot(x, 0, -38, 6, RED, s + 10);
  shape(x, rrect(-58, 40, 116, 18, 8), '#d79b2a', INK, { seed: s + 11, lw: 3 });
  for (let i = -1; i <= 1; i += 2) shape(x, [[i * 52, 40], [i * 84, 30], [i * 76, 60]], GOLD, INK, { seed: s + 12 + i, lw: 3 });
};
IC.puppet = (x, s) => {  // nang talung shadow puppet
  cline(x, [[0, -40], [0, 110]], { color: BROWN, width: 5, seed: s });
  shape(x, [[-6, -110], [10, -128], [16, -96], [30, -70], [26, -50], [40, -30], [34, 20], [42, 60], [-36, 60], [-30, 20], [-40, -20], [-20, -50], [-24, -84]], '#3c3a46', INK, { seed: s + 1 });
  shape(x, ell(4, -82, 14, 18, 14), '#d79b6a', null, { seed: s + 2 });
  for (let i = 0; i < 5; i++) dot(x, -20 + i * 10, 0 + (i % 2) * 14, 3.5, GOLD, s + 3 + i);
  cline(x, [[30, -30], [70, -60], [86, -40]], { color: '#3c3a46', width: 6, seed: s + 9 });
  cline(x, [[86, -40], [96, 100]], { color: BROWN, width: 3.5, seed: s + 10 });
  cline(x, [[-34, -20], [-70, 10], [-62, 40]], { color: '#3c3a46', width: 6, seed: s + 11 });
  shape(x, [[-36, 60], [42, 60], [30, 96], [-26, 96]], '#d0503f', INK, { seed: s + 12, lw: 3 });
};
// topic icons
IC.scroll = (x, s) => {
  shape(x, rrect(-70, -70, 140, 150, 10), CREAM, INK, { seed: s });
  shape(x, rrect(-86, -86, 172, 26, 13), '#d8b47a', INK, { seed: s + 1 });
  shape(x, rrect(-86, 70, 172, 26, 13), '#d8b47a', INK, { seed: s + 2 });
  for (let i = 0; i < 4; i++) cline(x, [[-48, -36 + i * 28], [48 - (i === 3) * 40, -36 + i * 28]], { color: '#b08a6a', width: 4, seed: s + 3 + i });
};
IC.hand = (x, s) => {   // a dancer's jeep hand
  shape(x, [[-30, 100], [-34, 10], [-56, -40], [-40, -54], [-20, -20], [-18, -70], [0, -96], [14, -70], [22, -96], [38, -70], [44, -40], [56, -54], [60, -24], [30, 10], [30, 100]], '#f1c6a1', INK, { seed: s });
  shape(x, ell(-26, -40, 14, 14, 12), '#f1c6a1', INK, { seed: s + 1, lw: 3 });
  shape(x, rrect(-36, 70, 72, 28, 8), GOLD, INK, { seed: s + 2, lw: 3 });
};
IC.note = (x, s) => {
  shape(x, ell(-40, 50, 26, 20, 18), PURPLE, INK, { seed: s });
  shape(x, ell(46, 30, 26, 20, 18), PURPLE, INK, { seed: s + 1 });
  cline(x, [[-16, 48], [-16, -70]], { color: INK, width: 7, seed: s + 2 });
  cline(x, [[70, 28], [70, -90]], { color: INK, width: 7, seed: s + 3 });
  shape(x, [[-16, -70], [70, -90], [70, -60], [-16, -40]], INK, null, { seed: s + 4 });
};
IC.dress = (x, s) => {   // a sabai and sin
  shape(x, [[-36, -90], [36, -90], [44, -20], [-44, -20]], PINK, INK, { seed: s });
  shape(x, [[-36, -90], [-6, -90], [50, 0], [40, 30], [10, -20]], '#e86f9a', INK, { seed: s + 1, lw: 3 });
  shape(x, [[-44, -20], [44, -20], [56, 100], [-56, 100]], PURPLE, INK, { seed: s + 2 });
  shape(x, rrect(-56, 76, 112, 24, 4), GOLD, null, { seed: s + 3 });
  shape(x, rrect(-46, -28, 92, 14, 6), GOLD, INK, { seed: s + 4, lw: 3 });
};
// dance chip icons
IC.nails = (x, s) => {
  shape(x, [[-40, 90], [-44, 0], [-30, -20], [30, -20], [44, 0], [40, 90]], '#f1c6a1', INK, { seed: s });
  for (let i = 0; i < 4; i++) { const bx = -30 + i * 20; cline(x, [[bx, -18], [bx - 6 + i * 4, -60], [bx - 16 + i * 10, -100]], { color: GOLD, width: 8, seed: s + i }); }
  cline(x, [[-44, 0], [-70, -40], [-90, -70]], { color: GOLD, width: 8, seed: s + 9 });
};
IC.candle = (x, s) => {
  shape(x, rrect(-18, -40, 36, 110, 8), '#fff4d6', INK, { seed: s });
  const fl = [...bez([0, -112], [24, -84], [18, -56], [0, -48]), ...bez([0, -48], [-18, -56], [-24, -84], [0, -112])];
  shape(x, fl, '#f6a23a', null, { seed: s + 1 }); shape(x, ell(0, -66, 7, 12, 10), '#fff1a0', null, { seed: s + 2 });
  shape(x, ell(0, 76, 60, 16, 20), GOLD, INK, { seed: s + 3 });
};
IC.ramwong = (x, s) => {   // dancers in a ring
  shape(x, ell(0, 30, 96, 40, 30), '#fbe5ab', '#c2872a', { seed: s, lw: 3 });
  const ppl = [[-70, 10, PINK], [0, -4, BLUE], [70, 10, GREEN], [-36, 50, PURPLE], [40, 52, RED]];
  ppl.forEach(([px, py, c], i) => { shape(x, [[px - 14, py + 6], [px + 14, py + 6], [px + 18, py - 40], [px - 18, py - 40]], c, INK, { seed: s + i, lw: 2.5 }); shape(x, ell(px, py - 54, 13, 13, 12), '#f1c6a1', INK, { seed: s + 10 + i, lw: 2.5 }); });
};
IC.klongyao = (x, s) => {
  shape(x, [[-40, -70], [40, -70], [30, -20], [18, 80], [-18, 80], [-30, -20]], '#c9814a', INK, { seed: s });
  shape(x, ell(0, -70, 40, 12, 20), CREAM, INK, { seed: s + 1, lw: 3 });
  shape(x, [[-34, -30], [34, -30], [26, 20], [-26, 20]], RED, INK, { seed: s + 2, lw: 3 });
  for (let i = -2; i <= 2; i++) cline(x, [[i * 12, 20], [i * 13, 46]], { color: GOLD, width: 4, seed: s + 3 + i });
  shape(x, ell(0, 80, 26, 8, 14), '#8a5a3b', INK, { seed: s + 9, lw: 3 });
};
IC.ponglang = (x, s) => {
  cline(x, [[-80, -90], [70, 96]], { color: '#8a5a3b', width: 4, seed: s }); cline(x, [[-40, -100], [100, 76]], { color: '#8a5a3b', width: 4, seed: s + 1 });
  for (let i = 0; i < 7; i++) { const k = i / 6, cx = lerp(-60, 86, k), cy = lerp(-95, 86, k), w2 = lerp(40, 22, k); shape(x, rrect(cx - w2, cy - 8, w2 * 2, 16, 6).map(([a, b]) => [cx + (a - cx) * .9 + (b - cy) * .5, cy + (b - cy) - (a - cx) * .55]), i % 2 ? '#d9a65a' : '#c48f4b', INK, { seed: s + 2 + i, lw: 2.5 }); }
};
IC.apsara = (x, s) => {   // a khmer-style crown and hand
  shape(x, [[-50, 50], [50, 50], [40, 0], [20, -40], [0, -100], [-20, -40], [-40, 0]], GOLD, INK, { seed: s });
  for (let i = 0; i < 3; i++) shape(x, [[-30 + i * 30, 10], [-20 + i * 30, -10], [-10 + i * 30, 10]], '#f6dd84', INK, { seed: s + i + 1, lw: 2 });
  shape(x, rrect(-56, 46, 112, 18, 8), '#d79b2a', INK, { seed: s + 5, lw: 3 }); dot(x, 0, -30, 8, RED, s + 6);
};
IC.fan = (x, s) => {   // rong ngeng scarf / fan
  const p = [[0, 60]]; for (let i = 0; i <= 10; i++) { const a = -Math.PI * .9 + Math.PI * .8 * i / 10; p.push([Math.cos(a) * 100, 60 + Math.sin(a) * 100]); }
  shape(x, p, RED, INK, { seed: s });
  for (let i = 0; i <= 6; i++) { const a = -Math.PI * .9 + Math.PI * .8 * i / 6; cline(x, [[0, 60], [Math.cos(a) * 96, 60 + Math.sin(a) * 96]], { color: '#a8352e', width: 2.5, seed: s + i }); }
  shape(x, ell(0, 60, 10, 10, 10), GOLD, INK, { seed: s + 9, lw: 2 });
};
// instruments
IC.salo = (x, s) => {   // saw-like fiddle with a coconut body
  cline(x, [[10, -110], [10, 70]], { color: BROWN, width: 7, seed: s });
  shape(x, ell(10, 70, 36, 30, 20), '#a8743a', INK, { seed: s + 1 });
  shape(x, ell(10, 70, 18, 14, 14), '#e9cf9a', null, { seed: s + 2 });
  cline(x, [[2, -96], [-10, -100]], { color: BROWN, width: 6, seed: s + 3 }); cline(x, [[18, -82], [30, -86]], { color: BROWN, width: 6, seed: s + 4 });
  cline(x, quad([-80, -40], [10, -90], [90, 30]), { color: '#8a5a3b', width: 4, seed: s + 5 });        // bow
  cline(x, [[-76, -38], [86, 28]], { color: '#e9e0c9', width: 2, seed: s + 6 });
};
IC.sueng = (x, s) => {   // plucked lute
  shape(x, ell(0, 52, 52, 54, 24), '#c98b52', INK, { seed: s });
  shape(x, ell(0, 44, 15, 15, 14), '#5b3a26', null, { seed: s + 1 });
  shape(x, rrect(-9, -110, 18, 110, 6), '#a8743a', INK, { seed: s + 2, lw: 3 });
  for (let i = 0; i < 2; i++) { cline(x, [[-9, -96 + i * 22], [-24, -98 + i * 22]], { color: BROWN, width: 5, seed: s + 3 + i }); cline(x, [[9, -86 + i * 22], [24, -88 + i * 22]], { color: BROWN, width: 5, seed: s + 5 + i }); }
  for (let i = -1; i <= 1; i += 2) cline(x, [[i * 4, -104], [i * 4, 90]], { color: '#e9e0c9', width: 1.6, seed: s + 9 + i });
};
IC.klongaew = (x, s) => {   // long Lanna drum: wide head, long body, flared foot
  shape(x, [[-40, -100], [40, -100], [30, -40], [12, 10], [10, 70], [34, 100], [-34, 100], [-10, 70], [-12, 10], [-30, -40]], '#c9814a', INK, { seed: s });
  shape(x, ell(0, -100, 40, 11, 20), CREAM, INK, { seed: s + 1, lw: 3 });
  shape(x, [[-36, -76], [36, -76], [30, -46], [-30, -46]], RED, null, { seed: s + 2 });
  for (let i = -3; i <= 3; i++) cline(x, [[i * 10, -100], [i * 6, -50]], { color: '#8a5a3b', width: 2, seed: s + 3 + i });
  shape(x, ell(0, 100, 34, 8, 16), GOLD, INK, { seed: s + 9, lw: 3 });
};
IC.ching = (x, s) => {   // a pair of small cymbal-cups joined by a cord
  cline(x, bez([-44, -40], [-30, -120], [30, -120], [44, -40]), { color: RED, width: 4, seed: s });
  for (const cx of [-44, 44]) { shape(x, [...ell(cx, 0, 40, 40, 18, Math.PI, Math.PI * 2), [cx + 40, 6], [cx - 40, 6]], GOLD, INK, { seed: s + cx }); shape(x, ell(cx, -40, 8, 6, 10), '#c88a1c', INK, { seed: s + cx + 1, lw: 2 }); }
  cline(x, quad([-30, 40], [0, 56], [30, 40]), { color: INK, width: 3, seed: s + 5 });
};
IC.chap = (x, s) => {
  shape(x, ell(-36, 0, 50, 22, 26).map(([a, b]) => [a, b - (a + 36) * .5]), GOLD, INK, { seed: s });
  shape(x, ell(-36, -10, 14, 8, 12), '#c88a1c', null, { seed: s + 1 });
  shape(x, ell(40, 30, 50, 22, 26).map(([a, b]) => [a, b + (a - 40) * .5]), GOLD, INK, { seed: s + 2 });
  shape(x, ell(40, 20, 14, 8, 12), '#c88a1c', null, { seed: s + 3 });
  for (let i = 0; i < 3; i++) cline(x, [[-2 + i * 6, 60 + i * 6], [8 + i * 10, 80 + i * 10]], { color: INK, width: 3, seed: s + 4 + i });
};
IC.krap = (x, s) => {
  shape(x, rrect(-50, -90, 30, 180, 10).map(([a, b]) => [a + b * .18, b]), '#b07a4a', INK, { seed: s });
  shape(x, rrect(20, -90, 30, 180, 10).map(([a, b]) => [a - b * .18, b]), '#c98b52', INK, { seed: s + 1 });
  cline(x, [[-6, -94], [-2, -110]], { color: INK, width: 3, seed: s + 2 }); cline(x, [[8, -94], [14, -108]], { color: INK, width: 3, seed: s + 3 });
};
IC.mong = (x, s) => {   // a hanging gong with a boss
  cline(x, [[-60, -100], [60, -100]], { color: BROWN, width: 7, seed: s }); cline(x, [[-56, -100], [-70, 100]], { color: BROWN, width: 7, seed: s + 1 }); cline(x, [[56, -100], [70, 100]], { color: BROWN, width: 7, seed: s + 2 });
  cline(x, [[-20, -100], [-20, -60]], { color: INK, width: 2.5, seed: s + 3 }); cline(x, [[20, -100], [20, -60]], { color: INK, width: 2.5, seed: s + 4 });
  shape(x, ell(0, 0, 54, 54, 28), '#d6a03a', INK, { seed: s + 5 });
  shape(x, ell(0, 0, 20, 20, 18), '#f0c860', INK, { seed: s + 6, lw: 3 });
};
IC.phin = (x, s) => {   // Isan lute with a leaf-shaped head
  shape(x, [[-46, 40], [0, -10], [46, 40], [40, 96], [-40, 96]], '#c98b52', INK, { seed: s });
  shape(x, ell(0, 54, 12, 12, 12), '#5b3a26', null, { seed: s + 1 });
  shape(x, rrect(-8, -110, 16, 110, 6), '#a8743a', INK, { seed: s + 2, lw: 3 });
  shape(x, [[0, -150], [26, -118], [0, -98], [-26, -118]], '#e2a050', INK, { seed: s + 3, lw: 3 });
  for (let i = -1; i <= 1; i++) cline(x, [[i * 4, -100], [i * 4, 90]], { color: '#e9e0c9', width: 1.5, seed: s + 5 + i });
};
IC.wot = (x, s) => {   // khaen-wot: short pipes bound in a ring AROUND a central stick, parallel to it, lengths stepping down
  const n = 9, pipes = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pipes.push({ i, x: Math.cos(a) * 34, z: Math.sin(a), L: 150 - i * 11 }); }
  const draw = p => shape(x, rrect(p.x - 9, -70 + p.z * 8, 18, p.L, 7), p.z < 0 ? '#c9a050' : '#dcb86a', INK, { seed: s + p.i, lw: 2.2 });
  pipes.filter(p => p.z < 0).forEach(draw);
  shape(x, rrect(-7, -120, 14, 250, 6), '#a8743a', INK, { seed: s + 20, lw: 2.5 });          // the central stick
  pipes.filter(p => p.z >= 0).forEach(draw);
  shape(x, ell(0, -70, 46, 14, 22), '#4a2c1c', INK, { seed: s + 21, lw: 2.5 });               // beeswax that seals the top
  cline(x, quad([-40, -20], [0, -8], [40, -20]), { color: '#8a5a3b', width: 4, seed: s + 22 });   // binding
};
IC.thap = (x, s) => {   // pair of goblet drums
  const one = (cx, sc, sd) => { shape(x, [[cx - 34 * sc, -50], [cx + 34 * sc, -50], [cx + 22 * sc, 0], [cx + 10 * sc, 30], [cx + 26 * sc, 80], [cx - 26 * sc, 80], [cx - 10 * sc, 30], [cx - 22 * sc, 0]], '#a8743a', INK, { seed: sd });
    shape(x, ell(cx, -50, 34 * sc, 10, 18), CREAM, INK, { seed: sd + 1, lw: 3 }); for (let i = 0; i < 3; i++) cline(x, [[cx - 26 * sc, -40 + i * 14], [cx + 26 * sc, -40 + i * 14]], { color: RED, width: 3, seed: sd + 2 + i }); };
  one(-44, 1, s); one(48, .86, s + 10);
};
IC.mongkhu = (x, s) => {   // pair of gongs in a box frame
  shape(x, rrect(-100, 20, 200, 60, 10), '#a8743a', INK, { seed: s });
  shape(x, ell(-46, 14, 40, 18, 22), '#d6a03a', INK, { seed: s + 1 }); shape(x, ell(-46, 4, 14, 10, 12), '#f0c860', INK, { seed: s + 2, lw: 2 });
  shape(x, ell(46, 14, 36, 16, 22), '#d6a03a', INK, { seed: s + 3 }); shape(x, ell(46, 4, 12, 9, 12), '#f0c860', INK, { seed: s + 4, lw: 2 });
  cline(x, [[60, -80], [20, -10]], { color: BROWN, width: 5, seed: s + 5 }); shape(x, ell(64, -86, 12, 12, 10), '#e0e0d0', INK, { seed: s + 6, lw: 2 });
};
IC.pinok = (x, s) => {   // small oboe
  shape(x, [[-8, -110], [8, -110], [14, -40], [22, 40], [40, 100], [-40, 100], [-22, 40], [-14, -40]], '#7a4a2c', INK, { seed: s });
  for (let i = 0; i < 5; i++) dot(x, 0, -60 + i * 24, 5, '#2a1a12', s + i + 1);
  shape(x, rrect(-4, -140, 8, 32, 3), '#e9cf9a', INK, { seed: s + 9, lw: 2 });
  for (let i = 0; i < 3; i++) cline(x, [[-20 + i * 2, 20 + i * 30], [20 - i * 2, 20 + i * 30]], { color: GOLD, width: 4, seed: s + 10 + i });
};
// misc
IC.bubble = (x, s) => {
  shape(x, [[-40, 40], [-80, 104], [10, 50]], '#ffffff', INK, { seed: s + 1 });
  shape(x, ell(0, -10, 112, 74, 36), '#ffffff', INK, { seed: s });
  for (let i = -1; i <= 1; i++) dot(x, i * 44, -10, 12, PINK, s + i + 3);
};
IC.heart = (x, s) => { const p = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; p.push([16 * Math.pow(Math.sin(a), 3) * 4.2, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * 4.2]); } shape(x, p, '#f07a8c', INK, { seed: s }); };
IC.star = (x, s) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 34 : 80; p.push([Math.cos(a) * r, Math.sin(a) * r]); } shape(x, p, '#f8cf4a', INK, { seed: s }); };
IC.flower = (x, s) => { for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; shape(x, ell(Math.cos(a) * 40, Math.sin(a) * 40, 34, 34, 16), '#fbe0ea', INK, { seed: s + i, lw: 3 }); } shape(x, ell(0, 0, 26, 26, 16), '#f8cf4a', INK, { seed: s + 9, lw: 3 }); };
IC.play = (x, s) => { shape(x, ell(0, 0, 90, 90, 30), '#f07a6a', INK, { seed: s }); shape(x, [[-26, -44], [50, 0], [-26, 44]], '#ffffff', INK, { seed: s + 1 }); };

const ICS = {};
function icon(name, size = 220) {
  const k = name + size; if (ICS[k]) return ICS[k];
  const im = typeof IMG !== 'undefined' && IMG['i_' + name];
  if (im) {   // a crayon picture the teacher generated: fit it into the icon box
    const box = size * 1.2, sc = Math.min(box / im.width, box / im.height), c = mkCanvas(box * 1.1, box * 1.1), x = c.getContext('2d');
    x.drawImage(im, (c.width - im.width * sc) / 2, (c.height - im.height * sc) / 2, im.width * sc, im.height * sc);
    return (ICS[k] = { w: c.width, h: c.height, c: [c], scale: 1 });
  }
  return ICS[k] || (ICS[k] = sprite(size * 1.45, size * 1.45, (x, s) => { x.scale(size / 220, size / 220); IC[name](x, s); })); }
