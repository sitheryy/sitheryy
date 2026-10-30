# Align the script to the narration: sections, subtitle chunks and a char->time map per section.
import json, re
TOTAL = 378.67
sil = [tuple(map(float, l.split())) for l in open('in/sil.txt')]
lines = [l.strip() for l in open('in/script.txt', encoding='utf-8') if l.strip()]
k = lines[0].index('เริ่มต้นด้วย')
secs = [lines[0][:k].strip(), lines[0][k:].strip()] + lines[1:]
IDS = ['intro', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']
COMB = set(chr(c) for c in [0x0E31] + list(range(0x0E34, 0x0E3B)) + list(range(0x0E47, 0x0E4F)))
w = lambda s: sum(1 for ch in s if ch != ' ' and ch not in COMB)

# speech intervals
speech, t = [], 0.0
for a, b in sil:
    if a > t + .05: speech.append((t, a))
    t = b
if t < TOTAL: speech.append((t, TOTAL))
speech = [(a, b) for a, b in speech if b - a > .08]
st = sum(b - a for a, b in speech)
def s2t(x):            # speech-time -> real time
    acc = 0
    for a, b in speech:
        if acc + (b - a) >= x: return a + (x - acc)
        acc += b - a
    return TOTAL
pauses = [((a + b) / 2, b - a, a, b) for a, b in sil if a > .5]
def snap(t, win, minlen):
    c = [p for p in pauses if abs(p[0] - t) < win and p[1] >= minlen]
    return min(c, key=lambda p: abs(p[0] - t) - p[1] * 2) if c else None

W = [w(s) for s in secs]; tot = sum(W)
starts = [speech[0][0]]
acc = 0
for i in range(1, len(secs)):
    acc += W[i - 1]
    est = s2t(acc / tot * st)
    p = snap(est, 6, .35)
    starts.append(p[3] - .05 if p else est)
starts = [starts[0], 10.86, 44.57, 82.09, 121.71, 164.75, 208.68, 249.02, 286.4, 328.11]
ends = [s for s in starts[1:]] + [TOTAL]
out = {'total': TOTAL, 'secs': [], 'subs': []}
for i, s in enumerate(secs):
    s0, s1 = starts[i], ends[i]
    toks = s.split(' ')
    chunks, cur = [], ''
    for tk in toks:
        if cur and w(cur + tk) > 30: chunks.append(cur.strip()); cur = ''
        cur += tk + ' '
    if cur.strip(): chunks.append(cur.strip())
    # local speech within section
    loc = [(max(a, s0), min(b, s1)) for a, b in speech if b > s0 and a < s1]
    lst = sum(b - a for a, b in loc)
    def l2t(x):
        acc = 0
        for a, b in loc:
            if acc + (b - a) >= x: return a + (x - acc)
            acc += b - a
        return s1
    cw = [w(c) for c in chunks]; T = sum(cw)
    bounds = [loc[0][0]]; a = 0
    for j in range(1, len(chunks)):
        a += cw[j - 1]; est = l2t(a / T * lst)
        p = snap(est, 1.2, .18)
        bounds.append(max(bounds[-1] + .6, p[3] - .03 if p else est))
    bounds.append(min(s1, loc[-1][1] + .1))
    # char map: char index in section text -> time
    cmap, pos = [], 0
    for j, c in enumerate(chunks):
        p = s.index(c, pos); cmap.append([p, round(bounds[j], 3)]); pos = p + len(c)
        out['subs'].append({'t0': round(bounds[j], 3), 't1': round(bounds[j + 1], 3), 'text': c})
    cmap.append([len(s), round(bounds[-1], 3)])
    out['secs'].append({'id': IDS[i], 't0': round(s0, 3), 't1': round(s1, 3), 'text': s, 'cmap': cmap})
    print(IDS[i], round(s0, 1), round(s1, 1), len(chunks), 'chunks')
json.dump(out, open('timing.json', 'w'), ensure_ascii=False, indent=0)
import os; os.makedirs('site', exist_ok=True)
open('site/timing.js', 'w').write('const TM=' + json.dumps(out, ensure_ascii=False) + ';')
