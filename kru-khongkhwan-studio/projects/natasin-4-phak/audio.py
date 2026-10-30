# Soundtrack: narration placed on the video clock, each region's own song (from its performance clip) as a quiet bed
# under the narration, the clips' real sound when they play, a synthesized kid-style tune for intro/outro, and
# synthesized SFX (pops, whooshes, crayon scribbles, sparkles, ta-da).
import json, subprocess, numpy as np
SR = 48000
TL = json.load(open('timeline.json')); EV = json.load(open('sfx.json'))
N = int((TL['total'] + 0.5) * SR)
def load(path, ch=2):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vn', '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
def fade(x, a, b):
    n = len(x); e = np.ones(n, np.float32)
    na, nb = min(n, int(a * SR)), min(n, int(b * SR))
    if na: e[:na] = np.linspace(0, 1, na) ** 2
    if nb: e[n - nb:] = np.minimum(e[n - nb:], np.linspace(1, 0, nb) ** 2)
    return x * e[:, None]
def place(buf, x, t):
    i = int(round(t * SR)); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i]

voice = np.zeros((N, 2), np.float32); clips = np.zeros((N, 2), np.float32); bed = np.zeros((N, 2), np.float32)
music = np.zeros((N, 2), np.float32); sfx = np.zeros((N, 2), np.float32)

# --- narration
nar = load('narr.wav', 1)[:, 0]; nar = nar / rms(nar[nar ** 2 > 1e-5]) * 0.1
for s in TL['segs']:
    if s['kind'] != 'narr': continue
    a, b = int(s['n0'] * SR), int(s['n1'] * SR)
    x = np.repeat(nar[a:b, None], 2, 1); x = fade(x, .02, .06)
    place(voice, x, s['v0'] + s['lead'])

# --- clips and beds
for s in TL['segs']:
    if s['kind'] != 'clip': continue
    r = s['name']; c = load(f'{r}.mov'); c = c / rms(c) * 0.1
    x = fade(c[:int(s['dur'] * SR)], .25, .5)
    place(clips, x, s['play'])
    # bed under that region's narration: the same song, looped with crossfades
    n = next(q for q in TL['segs'] if q['kind'] == 'narr' and q['name'] == r)
    t0, t1 = n['v0'] - .2, s['v0'] + .4
    L = int((t1 - t0) * SR); xf = int(1.2 * SR); loop = np.zeros((L, 2), np.float32); pos = 0
    # the song's strongest stretch (loudest + busiest 8 s, away from the clip's edges), looped as the bed
    mono = c.mean(1); hop = SR // 10; fr = np.array([np.sqrt(np.mean(mono[i:i + hop] ** 2)) for i in range(0, len(mono) - hop, hop)])
    flux = np.abs(np.diff(fr, prepend=fr[0])); score = fr / fr.max() + .6 * flux / (flux.max() + 1e-9)
    win = 80; best = max(range(5, len(score) - win - 5), key=lambda i: score[i:i + win].sum())
    src = c[best * hop:(best + win) * hop]
    print(r, 'highlight', round(best / 10, 1), '-', round((best + win) / 10, 1), 's')
    while pos < L:
        seg = src[:min(len(src), L - pos)].copy(); seg = fade(seg, 1.2 if pos else .6, 1.2)
        loop[pos:pos + len(seg)] += seg
        if pos + len(seg) >= L: break
        pos += len(seg) - xf
    place(bed, fade(loop, .6, .8), t0)

# --- kid tune for intro / outro / end card (marimba + bells + soft bass + shaker), 104 bpm, C major pentatonic
def marimba(f, d, v):
    t = np.arange(int(d * SR)) / SR
    y = (np.sin(2 * np.pi * f * t) + .28 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30) + .1 * np.sin(2 * np.pi * f * 10 * t) * np.exp(-t * 60)) * np.exp(-t * 6.5)
    y *= np.minimum(1, t / .003); return (y * v).astype(np.float32)
def bell(f, d, v):
    t = np.arange(int(d * SR)) / SR
    y = (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 4)) * np.exp(-t * 3.5) * np.minimum(1, t / .002)
    return (y * v).astype(np.float32)
def bass(f, d, v):
    t = np.arange(int(d * SR)) / SR; y = np.sin(2 * np.pi * f * t) * np.exp(-t * 3) * np.minimum(1, t / .01); return (y * v).astype(np.float32)
midi = lambda m: 440 * 2 ** ((m - 69) / 12)
BEAT = 60 / 104
MEL = [72, 74, 76, 79, 76, 74, 72, 69, 72, 74, 76, 74, 72, 74, 76, 79, 81, 79, 76, 74, 76, 74, 72, 72]
CH = [[48, 55], [45, 52], [41, 48], [43, 50]]
rng = np.random.default_rng(3)
def tune(t0, t1, gain):
    out = np.zeros((int((t1 - t0 + 3) * SR), 2), np.float32); k = 0; t = 0.0
    while t < t1 - t0:
        b = int(round(t / BEAT))
        if b % 2 == 0 or rng.random() < .35:
            m = MEL[(b // 1) % len(MEL)]; y = marimba(midi(m), 1.2, .32)
            pan = .5 + .25 * np.sin(b); i = int(t * SR); out[i:i + len(y), 0] += y * (1 - pan) * 1.4; out[i:i + len(y), 1] += y * pan * 1.4
        if b % 4 == 0:
            c = CH[(b // 4) % 4]
            for m in c: y = bass(midi(m), BEAT * 3.5, .22); i = int(t * SR); out[i:i + len(y)] += y[:, None]
        if b % 8 == 4:
            y = bell(midi(MEL[b % len(MEL)] + 12), 1.5, .08); i = int(t * SR); out[i:i + len(y)] += y[:, None]
        # shaker on off-beats
        n = int(.05 * SR); sh = (rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 70) * .035).astype(np.float32)
        sh = np.diff(np.concatenate([[0], sh])).astype(np.float32)
        i = int((t + BEAT / 2) * SR); out[i:i + n] += sh[:, None]
        t += BEAT
    out = fade(out[:int((t1 - t0) * SR)], .3, 1.2)
    place(music, out * gain, t0)
segs = {s['name']: s for s in TL['segs']}
tune(0.0, segs['intro']['v1'] + .3, 1.0)
tune(segs['outro']['v0'] - .2, TL['total'], 1.0)

# --- SFX
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def bp_noise(n, lo, hi, seed):
    x = np.random.default_rng(seed).standard_normal(n); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0; y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)
def s_pop(seed):
    n = int(.12 * SR); t = np.arange(n) / SR; f = 420 + 900 * (t / .12) ** .5 + seed % 5 * 30
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .035); return y * .5
def s_whoosh(seed):
    n = int(.5 * SR); t = np.arange(n) / SR; y = bp_noise(n, 300, 5000, seed)
    e = np.sin(np.pi * t / .5) ** 2; return y * e * .22
def s_scribble(seed):
    n = int(.9 * SR); t = np.arange(n) / SR; y = bp_noise(n, 1800, 7000, seed)
    am = (.5 + .5 * np.sin(2 * np.pi * (9 + 3 * np.sin(2 * np.pi * 1.3 * t)) * t)) ** 2
    return y * am * np.minimum(1, t / .05) * np.minimum(1, (.9 - t) / .15) * .12
def s_sparkle(seed):
    out = np.zeros(int(1.4 * SR))
    for i, m in enumerate([84, 88, 91, 96]):
        y = bell(midi(m), 1.0, .14); j = int(i * .07 * SR); out[j:j + len(y)] += y[:len(out) - j]
    return out
def s_tada(seed):
    out = np.zeros(int(1.6 * SR))
    for i, ms in enumerate([[72, 76], [79, 84]]):
        for m in ms: y = marimba(midi(m), 1.3, .3); j = int(i * .16 * SR); out[j:j + len(y)] += y[:len(out) - j]
    return out
def s_zoom(seed):
    n = int(.7 * SR); t = np.arange(n) / SR; f = 300 + 500 * t / .7
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .7) * .08 + s_whoosh(seed)[:n] * .6 if n <= int(.5 * SR) else np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / .7) * .08
    return y
FX = {'pop': s_pop, 'whoosh': s_whoosh, 'scribble': s_scribble, 'sparkle': s_sparkle, 'tada': s_tada, 'zoom': s_zoom}
for k, e in enumerate(EV):
    y = FX[e['type']](k).astype(np.float32) * e['g']
    pan = .5 + .3 * np.sin(k * 1.7)
    place(sfx, np.stack([y * (1.2 - pan), y * (.2 + pan)], 1) * .8, e['t'])

# --- mix: duck the bed and the tune under the voice
venv = np.abs(voice[:, 0]); k = int(.05 * SR)
venv = np.convolve(venv, np.ones(k) / k, 'same'); venv = np.maximum.accumulate(venv[::-1])[::-1] * 0 + venv
talk = np.clip(venv / .04, 0, 1)
sm = int(.3 * SR); talk = np.convolve(talk, np.ones(sm) / sm, 'same')
duck = (1 - .55 * talk)[:, None]
mix = voice * 1.0 + clips * 1.0 + bed * .22 * duck + music * .55 * duck + sfx * .9
peak = np.abs(mix).max(); print('peak', peak)
mix = mix / max(1, peak / .95)
mix.astype(np.float32).tofile('out/mix.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', 'out/mix.f32',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), 'out/mix.wav'], check=True)
print('ok')
