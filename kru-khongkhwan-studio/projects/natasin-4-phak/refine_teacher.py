import cv2 as cv, numpy as np
from PIL import Image
img = cv.imread('cut/teacher.jpg'); h, w = img.shape[:2]
P = np.array([(0.38,0.165),(0.42,0.151),(0.48,0.149),(0.54,0.158),(0.578,0.178),(0.615,0.228),(0.632,0.30),(0.645,0.34),(0.672,0.385),(0.70,0.41),(0.75,0.51),(0.768,0.60),
              (0.74,0.65),(0.68,0.69),(0.672,0.74),(0.705,1.0),(0.25,1.0),(0.248,0.73),(0.225,0.685),(0.115,0.62),(0.105,0.54),(0.13,0.46),
              (0.21,0.385),(0.27,0.36),(0.285,0.27),(0.30,0.215),(0.34,0.18)]) * [w, h]
pm = np.zeros((h, w), np.uint8); cv.fillPoly(pm, [P.astype(np.int32)], 1)
yy, xx = np.mgrid[0:h, 0:w]
head = ((xx - .47 * w) / (.178 * w)) ** 2 + ((yy - .258 * h) / (.108 * h)) ** 2 <= 1
pm[(yy < .26 * h) & ~head] = 0
k = int(w * 0.035) | 1
mask = np.full((h, w), cv.GC_BGD, np.uint8)
mask[cv.dilate(pm, np.ones((k, k), np.uint8)) > 0] = cv.GC_PR_BGD
mask[pm > 0] = cv.GC_PR_FGD
mask[cv.erode(pm, np.ones((k * 2 + 1, k * 2 + 1), np.uint8)) > 0] = cv.GC_FGD
bg, fg = np.zeros((1, 65)), np.zeros((1, 65))
mask[(yy < .26 * h) & ~head] = cv.GC_BGD
cv.grabCut(img, mask, None, bg, fg, 8, cv.GC_INIT_WITH_MASK)
a = ((mask == 1) | (mask == 3)).astype(np.uint8)
n, lab, st, _ = cv.connectedComponentsWithStats(a); big = 1 + np.argmax(st[1:, 4]); a = (lab == big).astype(np.uint8)
inv = 1 - a; n2, lab2, st2, _ = cv.connectedComponentsWithStats(inv)
for i in range(1, n2):
    if st2[i, 4] < 0.01 * h * w: a[lab2 == i] = 1
a = cv.morphologyEx(a, cv.MORPH_CLOSE, np.ones((9, 9), np.uint8))
al = cv.GaussianBlur(a.astype(np.float32), (0, 0), 1.6); al = np.clip((al - .5) * 2.2 + .5, 0, 1)
ys, xs = np.where(al > .1); x0, x1, y0, y1 = max(0, xs.min() - 10), min(w, xs.max() + 10), max(0, ys.min() - 10), min(h, ys.max() + 10)
rgba = np.dstack([cv.cvtColor(img, cv.COLOR_BGR2RGB), (al * 255).astype(np.uint8)])[y0:y1, x0:x1]
im = Image.fromarray(rgba); s = 1100 / max(im.size); im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS); im.save('cut/teacher_cut.png')
pv = Image.new('RGB', im.size, (255, 0, 255)); pv.paste(im, (0, 0), im); pv.thumbnail((500, 700)); pv.save('cut/teacher_pv.jpg'); print(im.size)
