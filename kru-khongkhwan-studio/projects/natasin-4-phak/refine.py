import sys, cv2 as cv, numpy as np
from PIL import Image
name = sys.argv[1]
img = cv.imread(f'cut/{name}.jpg'); h, w = img.shape[:2]
p = np.load(f'cut/{name}_prior.npy')
limit = np.ones((h, w), bool)
if name == 'teacher':              # flags at the sides are not the person
    xs = np.arange(w)[None, :].repeat(h, 0); ys = np.arange(h)[:, None].repeat(w, 1)
    limit &= ~(xs < 0.075 * w)
    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV); limit &= ~(((hsv[..., 0] < 8) | (hsv[..., 0] > 170)) & (hsv[..., 1] > 120) & (xs < 0.2 * w))
    limit &= ~((xs < 0.24 * w) & (ys < 0.48 * h))
    limit &= ~((xs > 0.755 * w) & (ys < 0.62 * h))
    limit &= ~((xs > 0.79 * w))
    poly = np.array([(0.29,0.23),(0.33,0.2),(0.42,0.185),(0.52,0.195),(0.58,0.225),(0.60,0.262),(0.612,0.30),(0.64,0.34),(0.69,0.365),(0.745,0.42),
        (0.775,0.5),(0.785,1.0),(0.07,1.0),(0.075,0.5),(0.18,0.43),(0.255,0.385),(0.27,0.30)]) * [w, h]
    pm = np.zeros((h, w), np.uint8); cv.fillPoly(pm, [poly.astype(np.int32)], 1)
    limit &= pm > 0
if name == 'isan':                 # the mint curtain showing between sleeve and sash
    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
    green = (hsv[..., 0] > 38) & (hsv[..., 0] < 95) & (hsv[..., 1] > 50)
    green = cv.morphologyEx(green.astype(np.uint8), cv.MORPH_OPEN, np.ones((5, 5), np.uint8)) > 0
    limit &= ~green
p = p * limit
mask = np.full((h, w), cv.GC_PR_BGD, np.uint8)
k = max(3, int(min(h, w) * 0.012)) | 1
fg = (p > 0.6).astype(np.uint8)
mask[p > 0.35] = cv.GC_PR_FGD
mask[cv.erode(fg, np.ones((k, k), np.uint8), iterations=3) > 0] = cv.GC_FGD
far = cv.dilate((p > 0.25).astype(np.uint8), np.ones((k, k), np.uint8), iterations=6) == 0
mask[far | ~limit] = cv.GC_BGD
# grabcut at reduced size for speed, then upsample
sc = 900 / max(h, w)
small = cv.resize(img, None, fx=sc, fy=sc); ms = cv.resize(mask, (small.shape[1], small.shape[0]), interpolation=cv.INTER_NEAREST)
bg, fgm = np.zeros((1, 65)), np.zeros((1, 65))
cv.grabCut(small, ms, None, bg, fgm, 6, cv.GC_INIT_WITH_MASK)
a = np.where((ms == cv.GC_FGD) | (ms == cv.GC_PR_FGD), 1., 0.).astype(np.float32)
a = cv.resize(a, (w, h), interpolation=cv.INTER_LINEAR)
# keep the big components only, fill holes
b = (a > 0.5).astype(np.uint8)
n, lab, st, _ = cv.connectedComponentsWithStats(b)
keep = np.zeros_like(b)
big = sorted(range(1, n), key=lambda i: -st[i, 4])
for i in big:
    if st[i, 4] > 0.08 * st[big[0], 4]: keep[lab == i] = 1
inv = 1 - keep; n2, lab2, st2, _ = cv.connectedComponentsWithStats(inv)
for i in range(1, n2):
    if st2[i, 4] < 0.004 * h * w: keep[lab2 == i] = 1
keep = cv.morphologyEx(keep, cv.MORPH_OPEN, np.ones((5, 5), np.uint8))
alpha = cv.GaussianBlur(keep.astype(np.float32), (0, 0), max(1.2, min(h, w) / 700))
alpha = np.clip((alpha - 0.5) * 2.2 + 0.5, 0, 1)
ys, xs = np.where(alpha > 0.1)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
pad = 10
x0, y0 = max(0, x0 - pad), max(0, y0 - pad); x1, y1 = min(w, x1 + pad), min(h, y1 + pad)
rgba = np.dstack([cv.cvtColor(img, cv.COLOR_BGR2RGB), (alpha * 255).astype(np.uint8)])[y0:y1, x0:x1]
im = Image.fromarray(rgba)
s = 1100 / max(im.size)
if s < 1: im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
im.save(f'cut/{name}_cut.png')
# preview on magenta
pv = Image.new('RGB', im.size, (255, 0, 255)); pv.paste(im, (0, 0), im)
pv.thumbnail((400, 600)); pv.save(f'cut/{name}_pv.jpg')
print(name, im.size)
