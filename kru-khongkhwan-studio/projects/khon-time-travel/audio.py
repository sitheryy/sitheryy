# Soundtrack: narration + Thai-flavoured score per era (ranat-like mallets, ching/chap, drums) + ambience + SFX.
import json, subprocess, numpy as np
SR = 48000
TM = json.load(open('timing.json')); EV = json.load(open('sfx.json'))
SEC = {s['id']: s for s in TM['secs']}
TOTAL = TM['total'] + 3.5
N = int((TOTAL + .5) * SR)
rng = np.random.default_rng(7)
def load(path, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()
def place(buf, x, t, pan=.5):
    i = int(round(t * SR)); j = min(len(buf), i + len(x))
    if j > i and i >= 0: buf[i:j, 0] += x[:j - i] * (1.2 - pan) * .9; buf[i:j, 1] += x[:j - i] * (.2 + pan) * .9
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def noise(n, lo, hi, seed=0):
    x = np.random.default_rng(seed).standard_normal(n); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
def tone(f, d, partials, dec, v):
    t = np.arange(int(d * SR)) / SR; y = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * dc) for m, a, dc in partials)
    return (y * np.minimum(1, t / .003) * np.exp(-t * dec) * v).astype(np.float32)
ranat = lambda m, v=.3: tone(midi(m), 1.0, [(1, 1, 0), (3.9, .35, 25), (9.2, .12, 60)], 5.5, v)
khong = lambda m, v=.25: tone(midi(m), 2.0, [(1, 1, 0), (2.4, .5, 3), (5.1, .2, 8)], 1.6, v)
bass = lambda m, v=.3: tone(midi(m), 1.2, [(1, 1, 0), (2, .3, 4)], 3.0, v)
bellt = lambda m, v=.15: tone(midi(m), 2.0, [(1, 1, 0), (2.76, .5, 3), (5.4, .25, 6)], 1.4, v)
def ching(v=.12, open_=True):
    n = int((.9 if open_ else .12) * SR); t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * f * t) for f in [3150, 4720, 6210, 7830]) * .25 + noise(n, 5000, 12000, 3) * .2
    return (y * env(n, .001, .35 if open_ else .03) * v).astype(np.float32)
def drum(f0=90, v=.5, d=.35):
    n = int(d * 2 * SR); t = np.arange(n) / SR; f = f0 * (1 + .6 * np.exp(-t * 30))
    return ((np.sin(2 * np.pi * np.cumsum(f) / SR) + noise(n, 80, 900, 5) * .15) * env(n, .002, d * .5) * v).astype(np.float32)
PENT = [0, 2, 4, 7, 9]
def melody(seed, n):
    r = np.random.default_rng(seed); deg = 7; out = []
    for i in range(n):
        deg = int(np.clip(deg + r.choice([-2, -1, -1, 0, 1, 1, 2]), 0, 14)); out.append(deg)
    return out
def deg2m(d, root=60): return root + 12 * (d // 5) + PENT[d % 5]
music = np.zeros((N, 2), np.float32)
def cue(t0, t1, bpm, seed, mood):
    beat = 60 / bpm; n = int((t1 - t0) / (beat / 2)); mel = melody(seed, n); buf = np.zeros((int((t1 - t0 + 3) * SR), 2), np.float32)
    root = {'calm': 62, 'bright': 62, 'grand': 60, 'play': 64, 'grace': 62, 'night': 57}[mood]
    for i in range(n):
        tt = i * beat / 2
        if mood in ('calm', 'night'):
            if i % 4 == 0: place(buf, bellt(deg2m(mel[i], root + 12), .09), tt, .3 + .4 * (i % 8 == 0))
            if i % 16 == 0: place(buf, khong(root - 12, .18), tt, .5)
            if i % 8 == 4: place(buf, ching(.06), tt, .7)
        else:
            dens = {'bright': .9, 'grand': .95, 'play': .8, 'grace': .55}[mood]
            if rng.random() < dens: m = deg2m(mel[i], root); place(buf, ranat(m, .22), tt, .35); place(buf, ranat(m + 12, .1), tt + .005, .65)
            if i % 2 == 0: place(buf, ching(.08, open_=(i % 4 == 0)), tt, .75)          # ching (open) - chap (closed) cycle
            if i % 8 == 0: place(buf, bass(root - 24 + PENT[(i // 8) % 3 * 2 % 5], .26), tt, .5)
            if mood in ('bright', 'grand', 'play') and i % 4 in (0, 3): place(buf, drum(110 if i % 4 == 0 else 160, .35 if mood == 'grand' else .25), tt, .5)
            if mood == 'grand' and i % 16 == 0: place(buf, drum(60, .6, .6), tt, .5); place(buf, khong(root - 12, .2), tt, .5)
            if mood == 'grace' and i % 8 == 0: place(buf, khong(deg2m(mel[i], root - 12), .14), tt, .4)
    L = int((t1 - t0) * SR); x = buf[:L]; fi, fo = int(.8 * SR), int(1.2 * SR)
    e = np.ones(L, np.float32); e[:fi] = np.linspace(0, 1, fi); e[-fo:] = np.linspace(1, 0, fo); x = x * e[:, None]
    i0 = int(t0 * SR); music[i0:i0 + L] += x[:N - i0]
# find "travel" moment: the intro gets brighter once the train enters the time tunnel
TRAVEL = json.load(open('times.json'))['travel'] if False else None
s = SEC
cue(0, 22.5, 70, 1, 'night'); cue(22.3, s['s1']['t0'] + .3, 118, 2, 'bright')
cue(s['s1']['t0'], s['s2']['t0'] + .3, 124, 3, 'bright'); cue(s['s2']['t0'], s['s3']['t0'] + .3, 100, 4, 'play')
cue(s['s3']['t0'], s['s4']['t0'] + .3, 74, 5, 'grace'); cue(s['s4']['t0'], s['s5']['t0'] + .3, 108, 6, 'play')
cue(s['s5']['t0'], s['outro']['t0'] + .3, 114, 7, 'grand'); cue(s['outro']['t0'], TOTAL, 80, 8, 'calm')
# ambience
amb = np.zeros((N, 2), np.float32)
def ambient(t0, t1, kind, v):
    L = int((t1 - t0) * SR)
    if kind == 'crickets':
        t = np.arange(L) / SR; y = np.sin(2 * np.pi * 4300 * t) * (np.sin(2 * np.pi * 28 * t) > .6) * (np.sin(2 * np.pi * .7 * t) > 0) * .3 + noise(L, 200, 900, 9) * .3
    elif kind == 'rain': y = noise(L, 1500, 9000, 11) * .7 + noise(L, 200, 1200, 12) * .3
    elif kind == 'fire': y = noise(L, 300, 3000, 13) * .2 * (1 + np.repeat(np.random.default_rng(1).random(L // 2400 + 1) ** 6 * 6, 2400)[:L])
    elif kind == 'wind': y = noise(L, 100, 700, 14) * (.6 + .4 * np.sin(np.arange(L) / SR * .5))
    elif kind == 'birds':
        y = np.zeros(L)
        for k in range(int((t1 - t0) / 1.7)):
            n = int(.25 * SR); tt = np.arange(n) / SR; f = 3000 + 1500 * np.sin(tt * 60); c = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .01, .06)
            i = int((k * 1.7 + rng.random()) * SR); y[i:i + n] += c[:max(0, min(n, L - i))]
    e = np.ones(L); f = int(1.5 * SR); e[:f] = np.linspace(0, 1, f); e[-f:] = np.linspace(1, 0, f)
    i0 = int(t0 * SR); y = (y * e * v).astype(np.float32); amb[i0:i0 + L, 0] += y[:N - i0]; amb[i0:i0 + L, 1] += np.roll(y, 300)[:N - i0]
ambient(0, 22.5, 'crickets', .05); ambient(0, 22.5, 'wind', .06)
ambient(s['s1']['t0'], s['s2']['t0'], 'wind', .04); ambient(s['s2']['t0'] + 12, s['s3']['t0'] + .5, 'rain', .08)
ambient(s['s4']['t0'], s['s5']['t0'], 'fire', .06); ambient(s['outro']['t0'], TOTAL, 'birds', .05)
# sfx
sfx = np.zeros((N, 2), np.float32)
def sweep(f0, f1, d, v, kind='sin'):
    n = int(d * SR); t = np.arange(n) / SR; f = f0 * (f1 / f0) ** (t / d); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * v).astype(np.float32), n
def S_pop(k): y, n = sweep(400, 1300, .12, .5); return y * env(n, .002, .035)
def S_whoosh(k): n = int(.5 * SR); t = np.arange(n) / SR; return (noise(n, 300, 5000, k) * np.sin(np.pi * t / .5) ** 2 * .25).astype(np.float32)
def S_scribble(k): n = int(.6 * SR); t = np.arange(n) / SR; return (noise(n, 1800, 7000, k) * (.5 + .5 * np.sin(2 * np.pi * 11 * t)) ** 2 * .12).astype(np.float32)
def S_sparkle(k):
    o = np.zeros(int(1.4 * SR), np.float32)
    for i, m in enumerate([84, 88, 91, 96]): y = bellt(m, .14); j = int(i * .07 * SR); o[j:j + len(y)] += y[:len(o) - j]
    return o
def S_tada(k):
    o = np.zeros(int(1.8 * SR), np.float32)
    for i, ms in enumerate([[72, 76], [79, 84]]):
        for m in ms: y = ranat(m, .35); j = int(i * .16 * SR); o[j:j + len(y)] += y[:len(o) - j]
    y = ching(.15); o[int(.16 * SR):int(.16 * SR) + len(y)] += y[:len(o) - int(.16 * SR)]
    return o
def S_boing(k): y, n = sweep(180, 520, .35, .4); t = np.arange(n) / SR; return y * (1 + .5 * np.sin(2 * np.pi * 18 * t)) * env(n, .005, .12)
def S_boom(k): return drum(55, .9, .7) + (noise(int(1.4 * SR), 30, 300, k) * env(int(1.4 * SR), .005, .3) * .5).astype(np.float32)
def S_clang(k): n = int(.5 * SR); t = np.arange(n) / SR; return (sum(np.sin(2 * np.pi * f * t) for f in [820, 1340, 2210]) * env(n, .001, .09) * .18 + noise(n, 2000, 8000, k) * env(n, .001, .03) * .3).astype(np.float32)
def S_step(k): n = int(.12 * SR); return (noise(n, 100, 1200, k) * env(n, .002, .02) * .35).astype(np.float32)
def S_train(k):
    n = int(3.2 * SR); t = np.arange(n) / SR; rum = noise(n, 40, 400, k) * .4 * np.sin(np.pi * t / 3.2) ** .5
    clk = np.zeros(n); per = int(.32 * SR)
    for i in range(0, n - 2000, per): clk[i:i + 2000] += noise(2000, 800, 4000, i) * env(2000, .001, .01)
    whine, _ = sweep(900, 500, 3.2, .05)
    return ((rum + clk * .5 * np.sin(np.pi * t / 3.2)) + whine * np.sin(np.pi * t / 3.2)).astype(np.float32)
def S_ding(k):
    o = np.zeros(int(1.6 * SR), np.float32)
    for i, m in enumerate([79, 76]): y = bellt(m, .3); j = int(i * .45 * SR); o[j:j + len(y)] += y[:len(o) - j]
    return o
def S_door(k): n = int(.6 * SR); t = np.arange(n) / SR; return (noise(n, 400, 3000, k) * np.exp(-((t - .25) / .12) ** 2) * .25).astype(np.float32)
def S_warp(k): y, n = sweep(150, 1800, 1.4, .12); t = np.arange(n) / SR; return (y + noise(n, 500, 6000, k) * .1) * np.sin(np.pi * t / 1.4) * (1 + .4 * np.sin(2 * np.pi * 9 * t))
def S_bell(k):
    o = np.zeros(int(4 * SR), np.float32)
    for i in range(3): y = tone(midi(69), 3, [(1, 1, 0), (2.4, .6, 1), (3.9, .3, 2), (5.6, .15, 3)], .9, .3); j = int(i * 1.1 * SR); o[j:j + len(y)] += y[:len(o) - j]
    return o
def S_stretch(k): n = int(.5 * SR); t = np.arange(n) / SR; y, _ = sweep(120, 260, .5, .1); return (y * np.minimum(1, t / .4) + noise(n, 200, 1000, k) * .05).astype(np.float32)
def S_zing(k): y, n = sweep(2400, 600, .8, .25); t = np.arange(n) / SR; return (y + noise(n, 3000, 9000, k) * .15) * env(n, .003, .3)
def S_laugh(k):
    o = np.zeros(int(2.4 * SR), np.float32)
    for p in range(14):
        n = int(.13 * SR); t = np.arange(n) / SR; f0 = 220 + 160 * rng.random()
        v = sum(np.sin(2 * np.pi * f0 * h * t) / h for h in range(1, 6)) * np.sin(np.pi * t / .13) * .1
        j = int((p * .15 + rng.random() * .05) * SR); o[j:j + n] += v[:len(o) - j]
    return o + (noise(len(o), 300, 3000, k) * .04).astype(np.float32)
FX = {k[2:].lower(): v for k, v in globals().items() if k.startswith('S_')}
for k, e in enumerate(EV):
    y = FX[e['type']](k) * e['g']; place(sfx, y.astype(np.float32), e['t'], .5 + .25 * np.sin(k * 1.7))
# narration + mix with ducking
nar = load('in/narr.wav'); rmsn = np.sqrt(np.mean(nar[nar ** 2 > 1e-5] ** 2)); nar = nar / rmsn * .1
voice = np.zeros((N, 2), np.float32); voice[:len(nar), 0] = nar; voice[:len(nar), 1] = nar
venv = np.convolve(np.abs(nar), np.ones(2400) / 2400, 'same'); talk = np.clip(venv / .04, 0, 1); talk = np.convolve(talk, np.ones(14400) / 14400, 'same')
duck = np.ones(N, np.float32); duck[:len(talk)] = 1 - .55 * talk
mix = voice + music * .34 * duck[:, None] + amb * duck[:, None] + sfx * .7
mix = mix / max(1, np.abs(mix).max() / .95)
mix.astype(np.float32).tofile('out/mix.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'out/mix.f32', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), 'out/mix.wav'], check=True)
print('ok', FX.keys())
