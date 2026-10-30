// ประวัติโขน — Thai-mural cartoon. Every frame is a pure function of t. Helpers from base.js / lib.js.
const T = {};
const SECT = ['intro', 'what', 'hist', 'chars', 'music', 'how', 'story', 'tale', 'outro'];
const COL = { what: '#d0503f', hist: '#c8902a', chars: '#3f8f8f', music: '#a0473c', how: '#5a7fb0', story: '#7a5aa0', tale: '#2f8fa0', outro: '#d0503f' };
const NAMES = { what: 'โขนคืออะไร?', hist: 'ประวัติโขน', chars: '4 เสาหลักตัวละคร', music: 'ดนตรี & หัวโขน', how: 'แสดงกันยังไง?', story: 'เล่นเรื่องอะไร?', tale: 'ตอนจองถนน', outro: '' };
function secTitle(ctx, t, id) {
  const name = NAMES[id]; if (!name) return; const t0 = S(id).t0 + .15, s = cutoutSpr(name, 92, id.length * 7 + 3);
  const k0 = easeBack(span(t, t0, t0 + .45)), fk = ease(span(t, t0 + 2.2, t0 + 2.9));
  if (fk < 1) { ctx.fillStyle = `rgba(40,20,10,${.3 * (1 - fk) * k0})`; ctx.fillRect(0, 0, W, H); }
  blit(ctx, s, lerp(960, 70 + s.w * .5 / 2, fk), lerp(470, 88, fk), { k: lerp(1.3, .5, fk) * k0, rot: Math.sin(t * 1.3) * .01 });
}
function chapters(ctx, t, id) {   // little dots top-right: where we are
  const ids = SECT.slice(1, 8), cur = ids.indexOf(id); if (cur < 0) return;
  ctx.save(); ids.forEach((s, i) => { const x = 1420 + i * 62, y = 70, on = i === cur, r = on ? 24 + 2 * Math.sin(t * 4) : 15;
    ctx.fillStyle = on ? COL[s] : i < cur ? '#d8c9a8' : CREAM; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = on ? '#fff' : INK; ctx.font = FONT(on ? 26 : 18); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i + 1, x, y + 2); }); ctx.restore();
}
function bubbles(ctx, t, n = 30, k = 1) {
  ctx.save(); ctx.strokeStyle = `rgba(255,255,255,${.6 * k})`; ctx.lineWidth = 3;
  for (let i = 0; i < n; i++) { const x = (hash(i) * 2000 + Math.sin(t + i) * 30) % 1980, y = 1150 - ((t * (60 + hash(i + 3) * 90) + hash(i + 7) * 1200) % 1250), r = 5 + hash(i + 2) * 14;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); } ctx.restore();
}
function zzz(ctx, t, x, y, k = 1) { ctx.save(); ctx.font = FONT(58); ctx.fillStyle = '#5a7fb0'; for (let i = 0; i < 3; i++) { const p = (t * .5 + i / 3) % 1; ctx.globalAlpha = Math.sin(p * Math.PI) * k; ctx.fillText('z', x + p * 120 + i * 10, y - p * 160); } ctx.restore(); }
function arts(ctx, t, i, x, y, size, k) {   // one quadrant of the 4-arts icon sheet
  const im = IMG.m_arts4; if (!im || k <= .01) return; const w = im.width / 2, h = im.height / 2, qx = (i % 2) * w, qy = Math.floor(i / 2) * h;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.rotate(Math.sin(t * 2 + i) * .05); ctx.shadowColor = 'rgba(50,30,15,.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.drawImage(im, qx, qy, w, h, -size / 2, -size / 2, size, size * h / w); ctx.restore();
}
function label(ctx, t, text, x, y, t0, t1, size = 44, col = CREAM) { const k = pop(t, t0) * out(t, t1); if (k > .01) blit(ctx, tagSpr(text, size, col, text.length * 5), x, y, { k, rot: (hash(text.length) - .5) * .06 }); }
const alt = (t, a, b, hz = 2) => Math.floor(t * hz) % 2 ? a : b;
function spot(ctx, x, a = .55) { ctx.save(); const g = ctx.createRadialGradient(x, 700, 60, x, 700, 520); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(20,10,20,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; glow(ctx, x, 620, 420, '255,235,190', .16); ctx.restore(); }

function init() {
  const k = (id, kw, n) => (T[id + '.' + kw] = K(id, kw, n));
  [['intro', ['หลับแน่ๆ', 'ฟังไม่ออก', 'รำอะไรช้าๆ', 'แต่เดี๋ยวก่อน', 'แอ็กชัน', 'เอฟเฟกต์', 'มรดกโลก', 'ยูเนสโก', 'ไม่ถึง 5 นาที', 'ครูของขวัญ', 'ถอดรหัส', 'คุยกับเพื่อน', 'ไปลุยกัน']],
   ['what', ['โขนคืออะไร', 'ละครรำ', 'ใส่หัวโขน', 'ผู้ชายแสดงล้วน', 'หลายแขนง', 'การแสดง', 'ดนตรี', 'วรรณกรรม', 'รามเกียรติ์', 'งานฝีมือ']],
   ['hist', ['อยุธยา', 'กระบี่กระบอง', 'หนังใหญ่', 'ชักนาค', 'มารวมกัน', 'ปัจจุบัน', 'พ.ศ. 2561', 'ยูเนสโก', 'มรดกภูมิปัญญา', 'โคตรเจ๋ง']],
   ['chars', ['ตัวละคร', '4 เสาหลัก', 'ตัวพระ', 'พระลักษมณ์', 'สง่างาม', 'น่าเกรงขาม', 'ตัวนาง', 'จีบนิ้ว', 'การเดิน', 'ตัวยักษ์', 'ดุดัน', 'ขย่ม', 'ตัวลิง', 'ซุกซน', 'กระโดด', 'เหมือนลิงจริงๆ']],
   ['music', ['ขาดสิ่งนี้', 'ดนตรี', 'เพลงแผ่น', 'วงปี่พาทย์', 'เพลงเชิด', 'ตระนอน', 'อินตาม', 'หัวโขนและเครื่องแต่งกาย', 'กระดาษสา', 'รักปั้น', 'ปิดทอง', 'ช่างหลวง', 'มูลค่าสูง']],
   ['how', ['สงสัย', 'ไม่พูดเอง', 'ภาษาท่า', 'ดีใจ', 'เสียใจ', 'โกรธ', 'เสียงพากย์', 'ผู้พากย์', '2 แบบ', 'แบบใส่หัวโขน', 'ยศฐาบรรดาศักดิ์', 'แบบไม่ใส่หัวโขน', 'เปิดหน้า', 'ขับร้อง']],
   ['story', ['เรื่องอะไร', 'เกือบ', 'รามเกียรติ์', 'รามายณะ', 'วัฒนธรรมไทย', 'ความดี', 'ความชั่ว']],
   ['tale', ['ตอนจองถนน', 'เรื่องมีอยู่ว่า', 'ยกทัพ', 'สั่งให้', 'ขนหิน', 'เป็น ถนน', 'ปัญหา', 'หายเกลี้ยง', 'จมลง', 'สงสัย', 'ดำดิ่ง', 'โป๊ะแตก', 'ว่า นางสุพรรณมัจฉา', 'ลูกสาว', 'ฝูงปลา', 'ฉากแอ็กชัน', 'ไล่จับ', 'เกี้ยวพาราสี', 'จับตัว', 'ความรัก', 'มัจฉานุ']],
   ['outro', ['ไม่ใช่เรื่องไกลตัว', 'มหัศจรรย์', 'ศิลปะ', 'ดนตรี', 'วรรณกรรม', 'การต่อสู้', 'กดไลค์']]].forEach(([id, kws]) => kws.forEach(w => k(id, w)));
  console.log(JSON.stringify(Object.fromEntries(Object.entries(T).map(([a, v]) => [a, +v.toFixed(1)]))));
}
const Q = (id, kw) => T[id + '.' + kw];

// one-colour title banner (replaces the multicolour letter tiles): cream torn paper, deep red text, gold edge
function cutoutSpr(text, size, seed) {
  const key = 'ttl' + text + size; if (SPR[key]) return SPR[key];
  const m = mk(4, 4).getContext('2d'); m.font = FONT(size); const tw = m.measureText(text).width;
  const w = tw + size * 1.1, h = size * 1.6, pad = 40, c = mk(w + pad * 2, h + pad * 2), x = c.getContext('2d'); x.translate(pad, pad);
  x.shadowColor = 'rgba(60,30,15,.4)'; x.shadowBlur = 18; x.shadowOffsetY = 9;
  const p = torn(w, h, seed + 5, 5); path(x, p); x.fillStyle = '#c9963a'; x.fill(); x.shadowColor = 'transparent';
  x.save(); x.translate(w * .025, h * .07); x.scale(.95, .86); const p2 = torn(w, h, seed + 9, 4); path(x, p2); x.fillStyle = '#fff6e2'; x.fill(); x.restore();
  x.font = FONT(size); x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round';
  x.lineWidth = size * .12; x.strokeStyle = '#fff6e2'; x.strokeText(text, w / 2, h / 2 + size * .08);
  x.fillStyle = '#8c2418'; x.fillText(text, w / 2, h / 2 + size * .08);
  return (SPR[key] = { c, w: c.width, h: c.height });
}
function floaters(ctx, t, id) {   // drifting gold petals / bubbles for life in every scene
  const under = id === 'tale' && t > Q('tale', 'ดำดิ่ง') + 1; if (under) return;
  ctx.save(); for (let i = 0; i < 16; i++) { const sp = 25 + hash(i) * 35, x = (hash(i + 1) * 2200 + t * sp) % 2100 - 90, y = (hash(i + 2) * 1100 + t * (14 + hash(i + 5) * 20)) % 1150 - 40;
    ctx.save(); ctx.translate(x + Math.sin(t + i) * 30, y); ctx.rotate(t * (.5 + hash(i)) + i); ctx.globalAlpha = .55; ctx.fillStyle = i % 3 ? '#e8b84a' : '#e07a5f';
    ctx.beginPath(); ctx.ellipse(0, 0, 9, 4.5, 0, 0, 7); ctx.fill(); ctx.restore(); } ctx.restore();
}
// ---------------- scenes ----------------
function intro(ctx, t) {
  const q = w => Q('intro', w), awake = t > q('แต่เดี๋ยวก่อน') - .1;
  bg(ctx, 'm_bg_mural', t, { z: 1.05 + .02 * Math.sin(t * .2) });
  if (!awake) { tint(ctx, 'rgba(40,40,80,.18)'); }
  const kx = awake ? go(t, q('แอ็กชัน') - .3, q('แอ็กชัน') + .4, 960, 330) : 960;
  if (!awake) { actor(ctx, '', 'm_sleepy_kid', t, 960, 930, { h: 480, rot: Math.sin(t * 1.2) * .06 }); zzz(ctx, t, 1120, 520, span(t, .5, 1.5));
    label(ctx, t, 'หลับแน่ๆ...', 600, 360, q('หลับแน่ๆ') - .1, q('แต่เดี๋ยวก่อน') - .1); label(ctx, t, 'ฟังไม่ออก...', 1350, 300, q('ฟังไม่ออก') - .1, q('แต่เดี๋ยวก่อน') - .1); label(ctx, t, 'รำช้าๆ...', 1380, 470, q('รำอะไรช้าๆ') - .1, q('แต่เดี๋ยวก่อน') - .1); }
  else { burst(ctx, t, q('แต่เดี๋ยวก่อน'), 960, 600, '255,230,140', 420);
    actor(ctx, '', 'm_kid_wow', t, kx, 930, { h: lerp(480, 380, span(t, q('แอ็กชัน') - .3, q('แอ็กชัน') + .4)), k: pop(t, q('แต่เดี๋ยวก่อน') - .1, .35) });
    blit(ctx, cutoutSpr('เดี๋ยวก่อน!', 96, 5), 960, 250, { k: pop(t, q('แต่เดี๋ยวก่อน')) * out(t, q('แอ็กชัน')), rot: Math.sin(t * 9) * .03 }); }
  // the surprises
  const a0 = q('แอ็กชัน'), [sx, sy] = shake(t, a0 + .2, 12, .4);
  if (t > a0 - .2 && t < q('ครูของขวัญ')) { actor(ctx, '', 'm_krabi', t, 980 + sx, 900 + sy, { h: 430, k: pop(t, a0 - .2) }); burst(ctx, t, a0 + .2, 990, 560, '255,220,120', 300); }
  if (t > q('เอฟเฟกต์') - .1 && t < q('ครูของขวัญ')) sparkles(ctx, t, 960, 500, 700, 36, '255,236,160', span(t, q('เอฟเฟกต์'), q('เอฟเฟกต์') + .5), 4);
  if (t > q('มรดกโลก') - .2 && t < q('ครูของขวัญ')) prop(ctx, 'm_heritage', 1520, 560, 380, { k: pop(t, q('มรดกโลก') - .2), rot: Math.sin(t * 2) * .04 });
  if (t > q('ไม่ถึง 5 นาที') - .1 && t < q('ครูของขวัญ')) { const k = pop(t, q('ไม่ถึง 5 นาที') - .1); ctx.save(); ctx.translate(1520, 230); ctx.scale(k, k); ctx.fillStyle = '#fffaf0'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 80, 0, 7); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -55); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, 0); const a = (t - q('ไม่ถึง 5 นาที')) * 6; ctx.lineTo(Math.sin(a) * 60, -Math.cos(a) * 60); ctx.stroke(); ctx.font = FONT(30); ctx.fillStyle = '#d0503f'; ctx.textAlign = 'center'; ctx.fillText('< 5 นาที', 0, 125); ctx.restore(); }
  if (t > q('ครูของขวัญ') - .2) { const k = pop(t, q('ครูของขวัญ') - .2); actor(ctx, '', 'm_students', t, 1450, 930, { h: 400, k });
    blit(ctx, cutoutSpr('ถอดรหัสโขน!', 100, 21), 960, 300, { k: pop(t, q('ถอดรหัส')), rot: Math.sin(t * 2) * .02 });
    if (t > q('คุยกับเพื่อน')) bubble(ctx, t, 1500, 470, 'เท่สุดๆ!', pop(t, q('คุยกับเพื่อน')) * out(t, q('ไปลุยกัน'))); }
  if (t > q('ไปลุยกัน') - .3) { const p = span(t, q('ไปลุยกัน') - .3, S('what').t0 + .3); actor(ctx, '', 'm_hanuman_khon_leap', t, lerp(-200, 2200, p), 930, { h: 420, lift: Math.sin(p * Math.PI) * 260, noShadow: 1 }); speedLines(ctx, t, 400, 800, Math.sin(p * Math.PI)); }
  vignette(ctx, .3);
}
function what(ctx, t) {
  const q = w => Q('what', w), t0 = S('what').t0, t1 = S('what').t1;
  bg(ctx, 'm_bg_stage', t, { z: 1.04 + .03 * span(t, t0, t1) });
  const arts_on = t > q('หลายแขนง') - .3;
  if (!arts_on) {
    actor(ctx, '', alt(t, 'm_hanuman_khon', 'm_hanuman_khon_leap', 1.6), t, 1180, 930, { h: 430, k: pop(t, q('ละครรำ') - .2), lift: Math.floor(t * 1.6) % 2 ? 60 : 0 });
    actor(ctx, '', 'm_thotsakan', t, 760, 930, { h: 450, k: pop(t, q('ใส่หัวโขน') - .2) });
    label(ctx, t, 'ละครรำ + ใส่หัวโขน', 960, 280, q('ละครรำ'), q('หลายแขนง') - .3, 56, '#fff3c4');
    label(ctx, t, 'ยุคแรก: ผู้ชายแสดงล้วน', 960, 380, q('ผู้ชายแสดงล้วน') - .1, q('หลายแขนง') - .3);
  } else {
    blit(ctx, cutoutSpr('ศิลปะหลายแขนง', 80, 11), 960, 250, { k: pop(t, q('หลายแขนง') - .2) });
    [['การแสดง', 0], ['ดนตรี', 1], ['วรรณกรรม', 2], ['งานฝีมือ', 3]].forEach(([w, i], j) => { const x = 360 + j * 400, y = 600, k = pop(t, q(w) - .15);
      arts(ctx, t, i, x, y + Math.sin(t * 2 + j) * 8, 300, k); label(ctx, t, w, x, y + 210, q(w), t1 + 1, 46); });
    if (t > q('รามเกียรติ์') - .1) prop(ctx, 'm_palmbook', 1170, 420, 150, { k: pop(t, q('รามเกียรติ์') - .1) * out(t, q('งานฝีมือ')) });
  }
  vignette(ctx, .32);
}
function hist(ctx, t) {
  const q = w => Q('hist', w), world = t > q('พ.ศ. 2561') - .4;
  if (!world) {
    bg(ctx, 'm_bg_ayutthaya', t, { x: lerp(-40, 40, span(t, S('hist').t0, q('พ.ศ. 2561'))), z: 1.05 });
    label(ctx, t, 'สมัยอยุธยา', 960, 230, q('อยุธยา'), q('มารวมกัน') - .4, 60, '#fff3c4');
    const merge = ease(span(t, q('มารวมกัน') - .4, q('มารวมกัน') + .6)), done = t > q('มารวมกัน') + .6;
    const parts = [['m_krabi', 'กระบี่กระบอง', q('กระบี่กระบอง'), 360], ['m_nangyai', 'หนังใหญ่', q('หนังใหญ่'), 960], ['m_chaknak', 'ชักนาคดึกดำบรรพ์', q('ชักนาค'), 1560]];
    parts.forEach(([im, lb, tt, x], i) => { if (done) return; const xx = lerp(x, 960, merge), k = pop(t, tt - .2) * (1 - merge * .7);
      const name = im === 'm_nangyai' ? alt(t, 'm_nangyai', 'm_nangyai_b', 1.5) : im;
      actor(ctx, '', name, t, xx, 880, { h: 400, k, rot: im === 'm_krabi' ? Math.sin(t * 6) * .03 : 0 }); if (merge < .3) label(ctx, t, lb, x, 420, tt, q('มารวมกัน') - .2, 50);
      if (i < 2 && merge < .1 && t > parts[i + 1][2] - .2) { ctx.save(); ctx.font = FONT(90); ctx.fillStyle = '#d0503f'; ctx.textAlign = 'center'; ctx.globalAlpha = pop(t, parts[i + 1][2] - .2); ctx.fillText('+', x + 300, 700); ctx.restore(); } });
    burst(ctx, t, q('มารวมกัน') + .55, 960, 640, '255,230,140', 420);
    if (done) { actor(ctx, '', 'm_masked_open', t, 960, 920, { h: 520, k: pop(t, q('มารวมกัน') + .55, .5) }); label(ctx, t, '= โขน!', 960, 320, q('มารวมกัน') + .8, q('พ.ศ. 2561') - .4, 80, '#fff3c4'); }
  } else {
    bg(ctx, 'm_bg_world', t, { z: 1.04 + .03 * Math.sin(t * .5) });
    for (let i = 0; i < 40; i++) { const p = (t * .3 + hash(i)) % 1; ctx.fillStyle = PAL[i % PAL.length]; ctx.save(); ctx.translate(hash(i + 4) * W, p * H); ctx.rotate(t * 3 + i); ctx.fillRect(-8, -5, 16, 10); ctx.restore(); }
    prop(ctx, 'm_heritage', 960, 560, 480, { k: pop(t, q('ยูเนสโก') - .2, .6), rot: Math.sin(t * 2) * .03 });
    blit(ctx, cutoutSpr('พ.ศ. 2561', 90, 61), 960, 220, { k: pop(t, q('พ.ศ. 2561') - .2) });
    label(ctx, t, 'ยูเนสโก: มรดกภูมิปัญญาทางวัฒนธรรมที่จับต้องไม่ได้', 960, 860, q('มรดกภูมิปัญญา'), S('chars').t0 + 1, 46, '#fff3c4');
    if (t > q('โคตรเจ๋ง') - .2) sparkles(ctx, t, 960, 540, 600, 40, '255,240,170', 1, 9);
  }
  vignette(ctx, .3);
}
function chars(ctx, t) {
  const q = w => Q('chars', w), t1 = S('chars').t1;
  bg(ctx, 'm_bg_stage', t, { z: 1.05 });
  const roles = [['ตัวพระ', q('ตัวพระ'), q('ตัวนาง')], ['ตัวนาง', q('ตัวนาง'), q('ตัวยักษ์')], ['ตัวยักษ์', q('ตัวยักษ์'), q('ตัวลิง')], ['ตัวลิง', q('ตัวลิง'), t1]];
  if (t < q('ตัวพระ') - .3) { blit(ctx, cutoutSpr('4', 160, 2), 960, 520, { k: pop(t, q('4 เสาหลัก') - .2), rot: Math.sin(t * 2) * .05 });
    ['พระ', 'นาง', 'ยักษ์', 'ลิง'].forEach((w, i) => label(ctx, t, w, 420 + i * 360, 820, q('4 เสาหลัก') + .3 + i * .25, q('ตัวพระ') - .3, 60, '#fff3c4')); }
  // back row: roles already shown
  roles.forEach(([n, a], i) => { if (t < roles[i][2] || i === 3) return; const im = ['m_rama', 'm_sida', 'm_thotsakan', 'm_hanuman_khon'][i];
    actor(ctx, '', im, t, 300 + i * 200, 610, { h: 230, alpha: .85, k: pop(t, roles[i][2] - .1) }); });
  const cur = roles.findIndex(([n, a, b]) => t >= a - .3 && t < b);
  if (cur >= 0) {
    const [n, a, b] = roles[cur], cx = 1080; spot(ctx, cx, .45);
    blit(ctx, cutoutSpr(n, 84, cur * 9 + 3), 1500, 280, { k: pop(t, a - .2) * out(t, b) });
    if (cur === 0) { actor(ctx, '', alt(t, 'm_rama_dance', 'm_rama', .7), t, cx - 60, 940, { h: 520, k: pop(t, a - .3) }); actor(ctx, '', 'm_lak', t, cx + 260, 940, { h: 470, k: pop(t, q('พระลักษมณ์') - .2) });
      label(ctx, t, 'สง่างาม อ่อนช้อย', 1500, 420, q('สง่างาม'), b); label(ctx, t, 'นิ่ง น่าเกรงขาม', 1500, 510, q('น่าเกรงขาม') - .4, b); }
    if (cur === 1) { const x = go(t, a - .3, a + 2.5, 1700, cx); actor(ctx, '', t < a + 2.5 ? alt(t, 'm_sida_walk', 'm_sida', 1.2) : 'm_sida', t, x, 940, { h: 520 });
      label(ctx, t, 'จีบนิ้วอ่อนช้อย', 1500, 420, q('จีบนิ้ว'), b); label(ctx, t, 'เดินนิ่มนวล', 1500, 510, q('การเดิน'), b); }
    if (cur === 2) { const bob = t > q('ขย่ม') - .2 ? Math.abs(Math.sin(t * 7)) * -26 : 0; actor(ctx, '', alt(t, 'm_thotsakan_angry', 'm_thotsakan', .9), t, cx, 940, { h: 540, dy: bob, k: pop(t, a - .3) });
      label(ctx, t, 'ท่ากว้าง ดุดัน', 1500, 420, q('ดุดัน'), b); label(ctx, t, 'เท้าสะเอว แผ่อก ขย่มตัว', 1500, 510, q('ขย่ม') - .5, b); if (t > q('ขย่ม')) dust(ctx, t, Math.floor((t - q('ขย่ม')) * 2.2) / 2.2 + q('ขย่ม'), cx, 940, 6, .5); }
    if (cur === 3) { const ph = Math.floor(t * 2.5) % 3; actor(ctx, '', ph === 1 ? 'm_hanuman_khon_leap' : 'm_hanuman_khon', t, cx + Math.sin(t * 1.7) * 220, 940, { h: 480, lift: ph === 1 ? 160 : 0, k: pop(t, a - .3) });
      label(ctx, t, 'ซุกซน ว่องไว', 1500, 420, q('ซุกซน'), b + 1); label(ctx, t, 'กระโดดโลดเต้น ย่อตัว', 1500, 510, q('กระโดด'), b + 1); }
  }
  vignette(ctx, .3);
}
function music(ctx, t) {
  const q = w => Q('music', w), mask = t > q('หัวโขนและเครื่องแต่งกาย') - .4;
  if (!mask) {
    bg(ctx, 'm_bg_stage', t, { z: 1.05 });
    if (t < q('ดนตรี') - .2) blit(ctx, cutoutSpr('ขาดไม่ได้!', 90, 31), 960, 450, { k: pop(t, q('ขาดสิ่งนี้') - .2) });
    if (t > q('เพลงแผ่น') - .2 && t < q('วงปี่พาทย์')) { const k = pop(t, q('เพลงแผ่น') - .2); ctx.save(); ctx.translate(960, 450); ctx.scale(k, k); ctx.rotate(t * 4); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, 130, 0, 7); ctx.fill(); ctx.fillStyle = '#d0503f'; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.fill(); ctx.restore();
      ctx.save(); ctx.strokeStyle = '#d0403a'; ctx.lineWidth = 16; ctx.lineCap = 'round'; const c = span(t, q('เพลงแผ่น') + .3, q('เพลงแผ่น') + .7); ctx.beginPath(); ctx.moveTo(820, 310); ctx.lineTo(lerp(820, 1100, c), lerp(310, 590, c)); ctx.stroke(); ctx.restore(); }
    if (t > q('วงปี่พาทย์') - .3) { prop(ctx, 'm_piphat', 960, 990 + (1 - easeOut(span(t, q('วงปี่พาทย์') - .3, q('วงปี่พาทย์') + .4))) * 400, 400, { base: 1, rot: Math.sin(t * 6) * .01 }); notes(ctx, t, 520, 640, span(t, q('วงปี่พาทย์'), q('วงปี่พาทย์') + .6)); label(ctx, t, 'บรรเลงสดๆ!', 960, 230, q('วงปี่พาทย์'), q('เพลงเชิด') - .2, 54, '#fff3c4'); }
    if (t > q('เพลงเชิด') - .3 && t < q('ตระนอน') - .2) { const p = ((t - q('เพลงเชิด') + .3) / 2.6) % 1; label(ctx, t, 'เพลงเชิด = วิ่งไล่ตีกัน', 960, 230, q('เพลงเชิด'), q('ตระนอน') - .2, 50, '#fff3c4');
      actor(ctx, '', alt(t, 'm_thotsakan_angry', 'm_thotsakan', 5), t, lerp(-200, 2200, p), 700, { h: 330 }); actor(ctx, '', alt(t, 'm_hanuman_khon_leap', 'm_hanuman_khon', 5), t, lerp(-200, 2200, p) - 380, 700, { h: 310, lift: Math.floor(t * 5) % 2 ? 60 : 0 }); speedLines(ctx, t, 300, 700, 1); }
    if (t > q('ตระนอน') - .2) { label(ctx, t, 'เพลงตระนอน = นอนหลับ', 960, 230, q('ตระนอน'), q('หัวโขนและเครื่องแต่งกาย') - .4, 50, '#fff3c4'); prop(ctx, 'm_sleeping_yak', 960, 600, 260, { k: pop(t, q('ตระนอน') - .2), sy: 1 + Math.sin(t * 2) * .02 }); zzz(ctx, t, 1090, 520); }
  } else {
    bg(ctx, 'm_bg_workshop', t, { z: 1.04 + .03 * span(t, q('หัวโขนและเครื่องแต่งกาย'), S('how').t0) });
    glow(ctx, 960, 360, 700, '255,200,120', .15);
    actor(ctx, '', 'm_mask_maker', t, 600, 950, { h: 460, k: pop(t, q('หัวโขนและเครื่องแต่งกาย') - .3) });
    [['กระดาษสา', 'กระดาษสา'], ['รักปั้น', 'รักปั้นปะลวดลาย'], ['ปิดทอง', 'ปิดทอง ประดับกระจก']].forEach(([w, lb], i) => label(ctx, t, lb, 1470, 300 + i * 92, Q('music', w), S('how').t0 + 1, 44));
    if (t > q('ปิดทอง') - .2) { const k = pop(t, q('ปิดทอง') - .2, .6); glow(ctx, 1400, 720, 300, '255,220,120', .4 * k); prop(ctx, 'm_goldmask', 1400, 720, 330, { k, rot: Math.sin(t * 1.5) * .04 }); sparkles(ctx, t, 1400, 700, 230, 18, '255,245,190', k, 2); }
    label(ctx, t, 'งานช่างหลวง มูลค่าสูง!', 1000, 210, q('ช่างหลวง'), S('how').t0 + 1, 50, '#fff3c4');
  }
  vignette(ctx, .32);
}
function how(ctx, t) {
  const q = w => Q('how', w), split = t > q('2 แบบ') - .3;
  bg(ctx, 'm_bg_stage', t, { z: 1.05 });
  if (!split) {
    if (t < q('ไม่พูดเอง') - .2) blit(ctx, cutoutSpr('แสดงกันยังไง?', 84, 41), 960, 460, { k: pop(t, q('สงสัย') - .2) * out(t, q('ไม่พูดเอง') - .2) });
    if (t > q('ไม่พูดเอง') - .3) { const em = t > q('โกรธ') - .1 ? 'm_thotsakan_angry' : t > q('เสียใจ') - .1 ? 'm_hanuman_khon' : t > q('ดีใจ') - .1 ? 'm_hanuman_khon_leap' : 'm_hanuman_khon';
      actor(ctx, '', em, t, 820, 940, { h: 470, k: pop(t, q('ไม่พูดเอง') - .3), lift: em === 'm_hanuman_khon_leap' ? 80 : 0 });
      bubble(ctx, t, 1040, 380, '. . . (ไม่พูด)', pop(t, q('ไม่พูดเอง')) * out(t, q('ภาษาท่า') + .5));
      label(ctx, t, 'ท่ารำ + ภาษาท่า', 960, 230, q('ภาษาท่า'), q('2 แบบ') - .3, 56, '#fff3c4');
      [['ดีใจ ♥', 'ดีใจ'], ['เสียใจ ㅠㅠ', 'เสียใจ'], ['โกรธ!!', 'โกรธ']].forEach(([lb, w], i) => label(ctx, t, lb, 1250 + i * 0, 340 + i * 100, q(w) - .1, q('เสียงพากย์') + .5, 44, ['#fbe0ea', '#d6e6fb', '#f9d0c0'][i])); }
    if (t > q('เสียงพากย์') - .4) { const k = easeOut(span(t, q('เสียงพากย์') - .4, q('เสียงพากย์') + .3)); actor(ctx, '', mouth(t) ? 'm_phak_talk' : 'm_phak', t, lerp(2200, 1560, k), 950, { h: 460 });
      bubble(ctx, t, 1500, 400, 'ผู้พากย์ข้างเวที', pop(t, q('ผู้พากย์')) * out(t, q('2 แบบ') - .3)); }
  } else {
    ctx.save(); ctx.strokeStyle = 'rgba(74,50,40,.7)'; ctx.lineWidth = 8; ctx.setLineDash([20, 16]); ctx.beginPath(); ctx.moveTo(960, 170); ctx.lineTo(960, 900); ctx.stroke(); ctx.restore();
    const L = pop(t, q('แบบใส่หัวโขน') - .2), R = pop(t, q('แบบไม่ใส่หัวโขน') - .2);
    blit(ctx, cutoutSpr('ใส่หัวโขน', 70, 51), 480, 230, { k: L }); blit(ctx, cutoutSpr('ไม่ใส่หัวโขน', 70, 52), 1440, 230, { k: R });
    actor(ctx, '', 'm_thotsakan', t, 330, 930, { h: 440, k: L }); actor(ctx, '', 'm_hanuman_khon', t, 630, 930, { h: 400, k: pop(t, q('แบบใส่หัวโขน') + .3) });
    label(ctx, t, 'บอกยศ · ต้องใช้คนพากย์', 480, 360, q('ยศฐาบรรดาศักดิ์'), S('story').t0 + 1, 40);
    actor(ctx, '', 'm_rama', t, 1290, 930, { h: 460, k: R }); actor(ctx, '', 'm_sida', t, 1590, 930, { h: 440, k: pop(t, q('แบบไม่ใส่หัวโขน') + .3) });
    label(ctx, t, 'เปิดหน้า · ร้อง-เจรจาเองได้', 1440, 360, q('เปิดหน้า'), S('story').t0 + 1, 40);
    if (t > q('ขับร้อง')) notes(ctx, t, 1300, 560, span(t, q('ขับร้อง'), q('ขับร้อง') + .5));
  }
  vignette(ctx, .32);
}
function story(ctx, t) {
  const q = w => Q('story', w), vs = t > q('ความดี') - .3;
  bg(ctx, 'm_bg_mural', t, { z: 1.05 });
  if (t < q('รามเกียรติ์') - .3) { const k = pop(t, q('เรื่องอะไร') - .3) * out(t, q('รามเกียรติ์') - .3);
    actor(ctx, '', 'm_hanu_think', t, 700, 940, { h: 440, k }); blit(ctx, cutoutSpr('?', 140, 7), 920, 430, { k: k * pop(t, q('เรื่องอะไร')), rot: Math.sin(t * 4) * .12 });
    if (t > q('เกือบ') - .2) { const c = Math.round(100 * easeOut(span(t, q('เกือบ'), q('เกือบ') + 1.4))); blit(ctx, cutoutSpr(c + '%', 120, 9 + c % 3), 1350, 520, { k: pop(t, q('เกือบ') - .2) * out(t, q('รามเกียรติ์') - .3) }); } }
  if (!vs) { prop(ctx, 'm_palmbook', 960, 560, 360, { k: pop(t, q('รามเกียรติ์') - .3), rot: Math.sin(t) * .03 });
    blit(ctx, cutoutSpr('รามเกียรติ์', 96, 71), 960, 260, { k: pop(t, q('รามเกียรติ์') - .1) });
    label(ctx, t, 'รามายณะ (อินเดีย) → รามเกียรติ์ (ไทย)', 960, 820, q('รามายณะ'), q('ความดี') - .3, 46, '#fff3c4'); }
  else {
    const g = pop(t, q('ความดี') - .3), b = pop(t, q('ความชั่ว') - .3);
    glow(ctx, 480, 560, 420, '255,230,150', .4 * g); actor(ctx, '', 'm_rama_dance', t, 480, 930, { h: 520, k: g }); label(ctx, t, 'ความดี · ฝ่ายพระราม', 480, 230, q('ความดี'), S('tale').t0 + 1, 48, '#fff3c4');
    glow(ctx, 1440, 560, 420, '150,90,200', .35 * b); actor(ctx, '', 'm_thotsakan_angry', t, 1440, 930, { h: 520, k: b, flip: 1 }); label(ctx, t, 'ความชั่ว · ฝ่ายทศกัณฐ์', 1440, 230, q('ความชั่ว'), S('tale').t0 + 1, 48, '#e8d8f0');
    if (t > q('ความชั่ว')) { blit(ctx, cutoutSpr('VS', 120, 3), 960, 560, { k: pop(t, q('ความชั่ว') + .2), rot: Math.sin(t * 8) * .05 }); burst(ctx, t, q('ความชั่ว') + .2, 960, 560, '255,200,120', 300); }
  }
  vignette(ctx, .3);
}
function tale(ctx, t) {
  const q = w => Q('tale', w), t0 = S('tale').t0, t1 = S('tale').t1;
  const under = t > q('ดำดิ่ง') + 1.0;
  if (t < q('ยกทัพ') - .4) {   // title card over Lanka
    bg(ctx, 'm_bg_lanka', t, { z: 1.05 + .03 * span(t, t0, q('ยกทัพ')) });
    blit(ctx, cutoutSpr('ตอนจองถนน', 96, 81), 960, 380, { k: pop(t, q('ตอนจองถนน') - .1) });
    label(ctx, t, '& หนุมานจับนางสุพรรณมัจฉา', 960, 520, q('ตอนจองถนน') + .6, q('ยกทัพ') - .4, 54, '#fff3c4');
    prop(ctx, 'm_hanu', 600, 900, 330, { base: 1, k: pop(t, q('ตอนจองถนน') + 1) }); prop(ctx, 'm_suphan', 1350, 830, 280, { k: pop(t, q('ตอนจองถนน') + 1.3), rot: Math.sin(t * 2) * .05 });
  } else if (!under) {
    // the shore: the monkeys build a road of rocks into the sea
    const dive = t > q('ดำดิ่ง') - .2, camY = dive ? ease(span(t, q('ดำดิ่ง') + .2, q('ดำดิ่ง') + 1.0)) * -500 : 0;
    ctx.save(); ctx.translate(0, camY);
    bg(ctx, 'm_bg_shore', t, { z: 1.05 });
    actor(ctx, '', 'm_rama', t, 260, 860, { h: 360, k: pop(t, q('ยกทัพ') - .3) });
    if (t > q('ยกทัพ')) label(ctx, t, '→ เมืองลงกา', 1500, 330, q('ยกทัพ'), q('สั่งให้'), 48, '#fff3c4');
    // rocks dropped into the sea; they sink after "หายเกลี้ยง"
    const sink = span(t, q('หายเกลี้ยง') - .3, q('จมลง') + 1.2);
    for (let i = 0; i < 6; i++) { const td = q('ขนหิน') + .6 + i * .7; if (t < td) continue; const fall = easeOut(span(t, td, td + .35));
      prop(ctx, 'm_rock', 900 + i * 150, lerp(600, 830, fall) + sink * 260, 120, { alpha: 1 - sink * .9, rot: i * .7 }); if (t < td + .6) burst(ctx, t, td + .35, 900 + i * 150, 840, '220,240,255', 120); }
    // monkeys carrying rocks, a loop of porters
    if (t > q('ขนหิน') - .6 && t < q('หายเกลี้ยง')) for (let i = 0; i < 4; i++) { const p = ((t - q('ขนหิน') + .6) * .28 + i / 4) % 1; actor(ctx, '', Math.floor(t * 4 + i) % 2 ? 'm_monkey_carry_a' : 'm_monkey_carry_b', t, lerp(300, 1000, p), 900 + (i % 2) * 30, { h: 300, alpha: Math.min(1, Math.sin(p * Math.PI) * 3) }); }
    // Hanuman: arrives, lifts a rock, wonders, dives
    let hb = 'm_hanu', hx = go(t, q('สั่งให้') - .3, q('สั่งให้') + 1.2, -200, 620), hy = 920, lift = 0;
    if (t < q('สั่งให้') + 1.2) hb = alt(t, 'm_hanu_walk_a', 'm_hanu_walk_b', 4); else if (t < q('หายเกลี้ยง') - .3) hb = 'm_hanu_carry'; else if (t < q('ดำดิ่ง') - .2) hb = 'm_hanu_think';
    else { hb = 'm_hanu_dive'; const p = span(t, q('ดำดิ่ง') - .2, q('ดำดิ่ง') + .8); hx = lerp(620, 1150, p); lift = Math.sin(p * Math.PI) * 260 - p * 500; }
    if (t > q('สั่งให้') - .3) actor(ctx, '', hb, t, hx, hy, { h: 360, lift, noShadow: hb === 'm_hanu_dive' });
    if (t > q('สงสัย') - .2 && t < q('ดำดิ่ง') - .2) { blit(ctx, cutoutSpr('?', 120, 5), hx + 150, 520, { k: pop(t, q('สงสัย') - .2), rot: Math.sin(t * 5) * .1 }); }
    if (t > q('หายเกลี้ยง') - .2 && t < q('ดำดิ่ง')) blit(ctx, cutoutSpr('หายเกลี้ยง!', 84, 13), 1200, 380, { k: pop(t, q('หายเกลี้ยง') - .2) * out(t, q('ดำดิ่ง')) });
    strip(ctx, 'm_fg_waves', t, 1120 + Math.sin(t * 1.5) * 8, { w: 2300, h: 230, dx: Math.sin(t * .8) * 40 });
    ctx.restore();
    if (dive) { const p = span(t, q('ดำดิ่ง') + .2, q('ดำดิ่ง') + 1.0); ctx.fillStyle = `rgba(20,60,110,${p})`; ctx.fillRect(0, 0, W, H); }
  } else {
    // under the sea
    bg(ctx, 'm_bg_underwater', t, { z: 1.05, x: Math.sin(t * .3) * 40 });
    bubbles(ctx, t, 34);
    const fishOn = t > q('ฝูงปลา') - .4 && t < q('ไล่จับ');
    if (t > q('โป๊ะแตก') - .2 && t < q('ฉากแอ็กชัน')) { blit(ctx, cutoutSpr('โป๊ะแตก!', 90, 17), 960, 260, { k: pop(t, q('โป๊ะแตก') - .2) * out(t, q('ว่า นางสุพรรณมัจฉา')) }); }
    if (fishOn) for (let i = 0; i < 7; i++) { const p = ((t - q('ฝูงปลา')) * .18 + i / 7) % 1; prop(ctx, 'm_fish', lerp(2100, -200, p), 560 + (i % 3) * 130 + Math.sin(t * 2 + i) * 20, 150, { flip: 0, rot: Math.sin(t * 4 + i) * .08 }); }
    const sOn = t > q('ว่า นางสุพรรณมัจฉา') - .3;
    const chase = t > q('ฉากแอ็กชัน') - .3 && t < q('เกี้ยวพาราสี') - .3, love = t > q('เกี้ยวพาราสี') - .3;
    if (!chase && !love) {
      if (sOn) { prop(ctx, 'm_suphan', 1180 + Math.sin(t) * 40, 560 + Math.sin(t * 1.4) * 30, 340, { k: pop(t, q('ว่า นางสุพรรณมัจฉา') - .3), rot: Math.sin(t * 2) * .05 }); label(ctx, t, 'นางสุพรรณมัจฉา', 1180, 300, q('ว่า นางสุพรรณมัจฉา'), q('ฉากแอ็กชัน') - .3, 48, '#fff3c4');
        if (t > q('ลูกสาว')) bubble(ctx, t, 1560, 380, 'ลูกสาวทศกัณฐ์', pop(t, q('ลูกสาว')) * out(t, q('ฝูงปลา'))); }
      prop(ctx, 'm_hanu_swim', 480 + Math.sin(t * 1.2) * 40, 520, 300, { rot: Math.sin(t * 2) * .05, k: easeOut(span(t, q('ดำดิ่ง') + 1, q('ดำดิ่ง') + 1.6)) });
    } else if (chase) {
      const p = ((t - q('ฉากแอ็กชัน') + .3) / 3.2), ph = p % 1, dir = Math.floor(p) % 2 ? -1 : 1, x = dir > 0 ? lerp(-300, 2200, ph) : lerp(2200, -300, ph), y = 560 + Math.sin(ph * 6.28) * 140;
      prop(ctx, 'm_suphan_swim', x + 300 * dir, y - 40, 300, { flip: dir > 0 ? 1 : 0 }); prop(ctx, 'm_hanu_swim', x - 80 * dir, y + 40, 280, { flip: dir > 0 ? 0 : 1 }); speedLines(ctx, t, 300, 800, .8);
      blit(ctx, cutoutSpr('ไล่จับ!', 80, 23), 960, 200, { k: pop(t, q('ไล่จับ') - .1) * out(t, q('เกี้ยวพาราสี') - .3) });
    } else {
      const k = pop(t, q('เกี้ยวพาราสี') - .3);
      actor(ctx, '', 'm_hanu_love', t, 640, 900, { h: 400, k, noShadow: 1 }); prop(ctx, 'm_suphan_shy', 1280, 640, 380, { k, flip: 1, rot: Math.sin(t * 1.5) * .04 });
      ctx.save(); ctx.font = FONT(60); ctx.fillStyle = '#e0574f'; for (let i = 0; i < 10; i++) { const p = (t * .35 + i / 10) % 1; ctx.globalAlpha = Math.sin(p * Math.PI) * k; ctx.fillText('♥', 860 + hash(i) * 260, 700 - p * 400); } ctx.restore();
      if (t > q('มัจฉานุ') - .4) { const m = pop(t, q('มัจฉานุ') - .4, .6); glow(ctx, 960, 470, 300, '255,230,150', .45 * m); prop(ctx, 'm_matchanu', 960, 470, 300, { k: m, rot: Math.sin(t * 2) * .05 }); sparkles(ctx, t, 960, 470, 260, 18, '255,245,190', m, 3);
        blit(ctx, cutoutSpr('มัจฉานุ', 84, 33), 960, 210, { k: pop(t, q('มัจฉานุ')) }); }
    }
    strip(ctx, 'm_fg_seaweed', t, 1120, { w: 2300, h: 230, dx: Math.sin(t * .6) * 30 });
    tint(ctx, 'rgba(20,60,110,.10)');
  }
  vignette(ctx, .34);
}
function outro(ctx, t) {
  const q = w => Q('outro', w), tE = TM.total;
  bg(ctx, 'm_bg_mural', t, { z: 1.05 });
  const cast = [['m_rama', 330], ['m_sida', 640], ['m_hanuman_khon', 1280], ['m_thotsakan', 1590]];
  cast.forEach(([im, x], i) => actor(ctx, '', im, t, x, 930, { h: 420, k: pop(t, S('outro').t0 + .2 + i * .25) }));
  [['ศิลปะ', 0], ['ดนตรี', 1], ['วรรณกรรม', 2]].forEach(([w, i], j) => arts(ctx, t, [0, 1, 2][j], 760 + j * 200, 330, 170, pop(t, q(w) - .15) * out(t, q('กดไลค์'))));
  if (t > q('การต่อสู้') - .15) prop(ctx, 'm_krabi', 1360, 330, 200, { k: pop(t, q('การต่อสู้') - .15) * out(t, q('กดไลค์')) });
  if (t > q('มหัศจรรย์') - .2 && t < q('ศิลปะ')) blit(ctx, cutoutSpr('ภูมิปัญญาไทย', 90, 91), 960, 300, { k: pop(t, q('มหัศจรรย์') - .2) });
  if (t > q('กดไลค์') - .2) prop(ctx, 'm_like_share', 960, 600, 360, { k: pop(t, q('กดไลค์') - .2), rot: Math.sin(t * 3) * .05 });
  sparkles(ctx, t, 960, 500, 800, 24, '255,236,160', 1, 13);
  const ek = span(t, tE - .2, tE + .6);
  if (ek > 0) { ctx.fillStyle = `rgba(253,246,232,${ek})`; ctx.fillRect(0, 0, W, H); const k = easeBack(span(t, tE + .1, tE + .7));
    ctx.save(); ctx.globalAlpha = ek; ctx.drawImage(IMG.logo_round, 960 - 200 * k, 380 - 200 * k, 400 * k, 400 * k); ctx.restore();
    blit(ctx, cutoutSpr('ครูของขวัญ TS', 70, 4), 960, 700, { k: easeBack(span(t, tE + .5, tE + 1)) });
    actor(ctx, '', 'm_hanu_jump', t, 420, 980, { h: 360, k: ek }); actor(ctx, '', 'm_sida', t, 1500, 980, { h: 380, k: ek }); }
  vignette(ctx, .3);
}
const END = TM.total + 3.5;
const FN = { intro, what, hist, chars, music, how, story, tale, outro };
let KICKS = null;
function kick(t) { if (!KICKS) KICKS = sfxEvents().filter(e => ['pop', 'boom', 'tada', 'clang', 'splash'].includes(e.type) && e.g >= .7).map(e => [e.t, e.type === 'pop' ? .5 : 1]);
  let k = 0; for (const [a, g] of KICKS) { const d = t - a; if (d > 0 && d < 1.2) k += g * Math.exp(-d * 5) * Math.sin(Math.min(1, d * 12) * Math.PI / 2); } return Math.min(k, 1.4); }
function drawFrame(ctx, t) {
  NOW = t; ctx.fillStyle = '#20180f'; ctx.fillRect(0, 0, W, H);
  let id = 'intro'; for (const s of SECT) if (t >= S(s).t0) id = s;
  const ks = kick(t), z = 1.03 + .025 * Math.sin(t * .23) + .035 * ks;
  ctx.save(); ctx.translate(W / 2 + Math.sin(t * .17) * 18, H / 2 + Math.cos(t * .21) * 10); ctx.rotate(Math.sin(t * .29) * .006 + ks * .006 * Math.sin(t * 9)); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
  FN[id](ctx, t); floaters(ctx, t, id); ctx.restore(); secTitle(ctx, t, id); chapters(ctx, t, id);
  if (t < TM.total) subtitles(ctx, t);
  if (t < TM.total - .2) { ctx.save(); ctx.globalAlpha = .5; ctx.drawImage(IMG.logo_round, 34, H - 112, 78, 78); ctx.restore(); }
  SECT.slice(1).forEach(s => { if (s !== 'tale' || true) wipe(ctx, t, S(s).t0, COL[s]); });
  if (t < .5) { ctx.fillStyle = `rgba(20,15,10,${1 - t / .5})`; ctx.fillRect(0, 0, W, H); }
}
function sfxEvents() {
  const E = [], add = (t, type, g = 1) => { if (t >= 0) E.push({ t: +t.toFixed(3), type, g }); };
  const q = (id, w) => Q(id, w);
  add(q('intro', 'หลับแน่ๆ'), 'pop', .4); add(q('intro', 'ฟังไม่ออก'), 'pop', .4); add(q('intro', 'รำอะไรช้าๆ'), 'pop', .4);
  add(q('intro', 'แต่เดี๋ยวก่อน') - .1, 'boing', 1); add(q('intro', 'แต่เดี๋ยวก่อน'), 'tada', .8); add(q('intro', 'แอ็กชัน') + .2, 'clang', 1); add(q('intro', 'แอ็กชัน') + .2, 'boom', .7);
  add(q('intro', 'เอฟเฟกต์'), 'sparkle', .9); add(q('intro', 'มรดกโลก') - .2, 'pop', .9); add(q('intro', 'ไม่ถึง 5 นาที'), 'ding', .6); add(q('intro', 'ครูของขวัญ') - .2, 'pop', .8); add(q('intro', 'ถอดรหัส'), 'tada', .9); add(q('intro', 'ไปลุยกัน') - .3, 'zing', .9);
  for (const s of SECT.slice(1)) { add(S(s).t0 - .35, 'whoosh', 1); if (NAMES[s]) { add(S(s).t0 + .15, 'pop', .9); add(S(s).t0 + 2.2, 'whoosh', .4); } }
  ['ละครรำ', 'ใส่หัวโขน', 'ผู้ชายแสดงล้วน', 'หลายแขนง', 'การแสดง', 'ดนตรี', 'วรรณกรรม', 'งานฝีมือ'].forEach(w => add(q('what', w) - .15, 'pop', .7));
  add(q('hist', 'อยุธยา'), 'pop', .6); add(q('hist', 'กระบี่กระบอง') - .2, 'clang', .8); add(q('hist', 'หนังใหญ่') - .2, 'pop', .8); add(q('hist', 'ชักนาค') - .2, 'pop', .8);
  add(q('hist', 'มารวมกัน') - .4, 'warp', .8); add(q('hist', 'มารวมกัน') + .55, 'tada', 1); add(q('hist', 'พ.ศ. 2561') - .4, 'whoosh', .8); add(q('hist', 'ยูเนสโก') - .2, 'tada', 1); add(q('hist', 'โคตรเจ๋ง'), 'sparkle', 1);
  add(q('chars', '4 เสาหลัก') - .2, 'boom', .7); ['ตัวพระ', 'ตัวนาง', 'ตัวยักษ์', 'ตัวลิง'].forEach(w => { add(q('chars', w) - .3, 'whoosh', .6); add(q('chars', w) - .2, 'pop', .9); });
  ['สง่างาม', 'น่าเกรงขาม', 'จีบนิ้ว', 'การเดิน', 'ดุดัน', 'ซุกซน', 'กระโดด'].forEach(w => add(q('chars', w), 'scribble', .5));
  for (let s = q('chars', 'ขย่ม'); s < q('chars', 'ตัวลิง') - .4; s += 1 / 2.2) add(s, 'boom', .35);
  for (let s = q('chars', 'ตัวลิง'); s < S('music').t0 - .5; s += 1.2) add(s, 'boing', .5);
  add(q('music', 'ขาดสิ่งนี้') - .2, 'pop', .8); add(q('music', 'เพลงแผ่น') + .3, 'scribble', .7); add(q('music', 'วงปี่พาทย์') - .3, 'whoosh', .6);
  add(q('music', 'เพลงเชิด') - .3, 'zing', .7); for (let s = q('music', 'เพลงเชิด'); s < q('music', 'ตระนอน') - .3; s += .3) add(s, 'step', .5);
  add(q('music', 'ตระนอน') - .2, 'pop', .6); add(q('music', 'หัวโขนและเครื่องแต่งกาย') - .4, 'whoosh', .8); ['กระดาษสา', 'รักปั้น'].forEach(w => add(q('music', w), 'scribble', .6)); add(q('music', 'ปิดทอง') - .2, 'sparkle', 1);
  add(q('how', 'สงสัย') - .2, 'pop', .7); add(q('how', 'ไม่พูดเอง') - .3, 'pop', .8); ['ดีใจ', 'เสียใจ', 'โกรธ'].forEach(w => add(q('how', w) - .1, 'pop', .7)); add(q('how', 'เสียงพากย์') - .4, 'whoosh', .6);
  add(q('how', '2 แบบ') - .3, 'whoosh', .8); add(q('how', 'แบบใส่หัวโขน') - .2, 'pop', .9); add(q('how', 'แบบไม่ใส่หัวโขน') - .2, 'pop', .9);
  add(q('story', 'รามเกียรติ์') - .3, 'pop', .9); add(q('story', 'รามายณะ'), 'scribble', .6); add(q('story', 'ความดี') - .3, 'sparkle', .8); add(q('story', 'ความชั่ว') - .3, 'boom', .7); add(q('story', 'ความชั่ว') + .2, 'clang', 1);
  add(q('tale', 'ตอนจองถนน') - .1, 'tada', .9); add(q('tale', 'ยกทัพ') - .4, 'whoosh', .8);
  for (let s = q('tale', 'สั่งให้') - .3; s < q('tale', 'สั่งให้') + 1.2; s += .25) add(s, 'step', .5);
  for (let i = 0; i < 6; i++) add(q('tale', 'ขนหิน') + .6 + i * .7 + .3, 'splash', .7);
  add(q('tale', 'หายเกลี้ยง') - .3, 'bloop', 1); add(q('tale', 'สงสัย') - .2, 'boing', .6); add(q('tale', 'ดำดิ่ง') - .2, 'splash', 1); add(q('tale', 'ดำดิ่ง') + .3, 'bloop', .8);
  add(q('tale', 'โป๊ะแตก') - .2, 'tada', .8); add(q('tale', 'ว่า นางสุพรรณมัจฉา') - .3, 'sparkle', .8); add(q('tale', 'ฝูงปลา') - .4, 'bloop', .6);
  for (let s = q('tale', 'ฉากแอ็กชัน') - .3; s < q('tale', 'เกี้ยวพาราสี') - .3; s += 1.6) add(s, 'whoosh', .7);
  add(q('tale', 'เกี้ยวพาราสี') - .3, 'sparkle', .7); add(q('tale', 'มัจฉานุ') - .4, 'tada', 1);
  ['ศิลปะ', 'ดนตรี', 'วรรณกรรม', 'การต่อสู้'].forEach(w => add(q('outro', w) - .15, 'pop', .8)); add(q('outro', 'กดไลค์') - .2, 'pop', 1); add(TM.total, 'tada', 1);
  return E.sort((a, b) => a.t - b.t);
}
