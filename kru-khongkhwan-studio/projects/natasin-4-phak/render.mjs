// node render.mjs sheet t1,t2,... out.jpg [cols] [w]   |   node render.mjs frames start end worker nworkers
import { chromium } from 'playwright';
import fs from 'fs';
import { execFileSync } from 'child_process';
const [mode, a1, a2, a3, a4] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => { if (m.type() === 'error') console.error('PAGE', m.text()); });
page.on('pageerror', e => console.error('PAGEERR', e.message));
await page.goto('file:///home/claude/work/site/index.html');
await page.waitForFunction('window.READY === true', null, { timeout: 600000 });
if (mode === 'sheet') {
  const ts = a1.split(',').map(Number), out = a2, cols = +(a3 || Math.min(ts.length, 4)), w = +(a4 || 360);
  fs.mkdirSync('/home/claude/work/check/tmp', { recursive: true });
  const files = [];
  for (const [i, t] of ts.entries()) {
    const d = await page.evaluate(t => window.grab(t, .9), t);
    const f = `/home/claude/work/check/tmp/s${i}.jpg`; fs.writeFileSync(f, Buffer.from(d.split(',')[1], 'base64')); files.push(f);
  }
  const h = Math.round(w * 1920 / 1080), rows = Math.ceil(ts.length / cols);
  const inputs = files.flatMap(f => ['-i', f]);
  const filt = files.map((_, i) => `[${i}]scale=${w}:${h},drawtext=text='${ts[i]}':x=8:y=8:fontsize=22:fontcolor=red[v${i}]`).join(';') + ';' +
    files.map((_, i) => `[v${i}]`).join('') + `xstack=inputs=${files.length}:layout=` + files.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join('|') + `:fill=black`;
  if (files.length === 1) execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', files[0], '-vf', `scale=${w}:${h}`, out]);
  else execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', filt, out]);
  console.log('wrote', out);
} else if (mode === 'events') {
  fs.writeFileSync(a1, JSON.stringify(await page.evaluate(() => sfxEvents()), null, 0)); console.log('wrote', a1);
} else if (mode === 'frames') {
  const fps = 24, n0 = +a1, n1 = +a2, wk = +a3, nw = +a4;
  fs.mkdirSync('/home/claude/work/out/frames', { recursive: true });
  let done = 0; const t0 = Date.now();
  for (let n = n0 + wk; n < n1; n += nw) {
    const f = `/home/claude/work/out/frames/f${String(n).padStart(5, '0')}.jpg`;
    if (fs.existsSync(f)) continue;
    const d = await page.evaluate(t => window.grab(t, .92), n / fps);
    fs.writeFileSync(f + '.tmp', Buffer.from(d.split(',')[1], 'base64')); fs.renameSync(f + '.tmp', f);
    if (++done % 200 === 0) console.log(`w${wk} ${done} frames, ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
  }
  console.log(`w${wk} finished`);
}
await browser.close();
