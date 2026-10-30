# Align script to narration: sections, subtitle chunks, char->time map. Also a loudness envelope for lip flap.
import json, re, numpy as np, subprocess
TOTAL = 310.36
sil = [tuple(map(float, l.split())) for l in open('in/sil.txt')]
raw = open('in/script.txt', encoding='utf-8').read()
raw = re.sub(r'\[[^\]]*\]', ' ', raw)

text = re.sub(r'\s+', ' ', raw.replace("'", '')).strip()
CUTS = [('intro', None), ('what', 'มาเริ่มกันเลย'), ('hist', 'ประวัติย่อๆ'), ('chars', 'ทีนี้ หัวใจสำคัญ'), ('music', 'นอกจากตัวละครแล้ว'), ('how', 'ทีนี้หลายคนอาจจะสงสัย'), ('story', 'คำถามต่อมาคือ'), ('tale', 'และถ้าอยากรู้'), ('outro', 'เห็นไหมคะ')]
idx = [0] + [text.index(k) for _, k in CUTS[1:]] + [len(text)]
secs = [text[idx[i]:idx[i + 1]].strip() for i in range(len(CUTS))]
COMB = set(chr(c) for c in [0x0E31] + list(range(0x0E34, 0x0E3B)) + list(range(0x0E47, 0x0E4F)))
w = lambda s: sum(1 for ch in s if ch != ' ' and ch not in COMB)
speech, t = [], 0.0
for a, b in sil:
    if a > t + .05: speech.append((t, a))
    t = b
if t < TOTAL: speech.append((t, TOTAL))
speech = [(a, b) for a, b in speech if b - a > .08]
st = sum(b - a for a, b in speech)
def s2t(x, sp):
    acc = 0
    for a, b in sp:
        if acc + (b - a) >= x: return a + (x - acc)
        acc += b - a
    return sp[-1][1]
pauses = [((a + b) / 2, b - a, a, b) for a, b in sil if a > .5]
def snap(t, win, minlen):
    c = [p for p in pauses if abs(p[0] - t) < win and p[1] >= minlen]
    return min(c, key=lambda p: abs(p[0] - t) - p[1] * 2) if c else None
W = [w(s) for s in secs]; tot = sum(W)
starts = [speech[0][0]]; acc = 0
for i in range(1, len(secs)):
    acc += W[i - 1]; est = s2t(acc / tot * st, speech); p = snap(est, 5, .3)
    starts.append(p[3] - .05 if p else est)
    print(CUTS[i][0], 'est', round(est, 1), '->', round(starts[-1], 1))
ends = starts[1:] + [TOTAL]
out = {'total': TOTAL, 'secs': [], 'subs': []}
for i, s in enumerate(secs):
    s0, s1 = starts[i], ends[i]
    chunks, cur = [], ''
    for tk in s.split(' '):
        if cur and w(cur + tk) > 30: chunks.append(cur.strip()); cur = ''
        cur += tk + ' '
    if cur.strip(): chunks.append(cur.strip())
    loc = [(max(a, s0), min(b, s1)) for a, b in speech if b > s0 and a < s1]
    lst = sum(b - a for a, b in loc)
    cw = [w(c) for c in chunks]; T = sum(cw)
    bounds = [loc[0][0]]; a = 0
    for j in range(1, len(chunks)):
        a += cw[j - 1]; est = s2t(a / T * lst, loc); p = snap(est, 1.2, .18)
        bounds.append(max(bounds[-1] + .6, p[3] - .03 if p else est))
    bounds.append(min(s1, loc[-1][1] + .1))
    cmap, pos = [], 0
    for j, c in enumerate(chunks):
        p = s.index(c, pos); cmap.append([p, round(bounds[j], 3)]); pos = p + len(c)
        out['subs'].append({'t0': round(bounds[j], 3), 't1': round(bounds[j + 1], 3), 'text': c})
    cmap.append([len(s), round(bounds[-1], 3)])
    out['secs'].append({'id': CUTS[i][0], 't0': round(s0, 3), 't1': round(s1, 3), 'text': s, 'cmap': cmap})
# loudness envelope at 24 fps for mouths
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'in/narr.wav', '-ac', '1', '-ar', '24000', '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32); hop = 1000
env = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
env = env / np.percentile(env[env > 1e-4], 90)
out['env'] = [round(float(v), 2) for v in np.clip(env, 0, 1.5)]
json.dump(out, open('timing.json', 'w'), ensure_ascii=False)
import os; os.makedirs('site', exist_ok=True)
open('site/timing.js', 'w').write('const TM=' + json.dumps(out, ensure_ascii=False) + ';')
for s in out['secs']: print(s['id'], s['t0'], s['t1'], s['text'][:40])
