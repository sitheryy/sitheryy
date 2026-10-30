import cv2 as cv, numpy as np
from PIL import Image
img = cv.imread('cut/teacher.jpg'); h, w = img.shape[:2]
P = [(340,222),(400,228),(455,250),(490,285),(522,310),(525,370),(522,400),(528,460),(538,520),(575,568),(612,612),(628,660),(642,740),(656,820),(664,880),
     (662,930),(645,975),(610,1005),(590,1030),(586,1095),(578,1200),(592,1400),(600,1547),(250,1547),(238,1400),(224,1200),(220,1095),(215,1050),(205,1012),
     (150,995),(110,950),(100,900),(102,830),(108,745),(130,680),(188,612),(238,582),(246,510),(254,380),(262,292),(290,250),(312,232)]
def chaikin(p, n=3):
    p = np.array(p, float)
    for _ in range(n):
        q = np.roll(p, -1, 0); p = np.stack([.75 * p + .25 * q, .25 * p + .75 * q], 1).reshape(-1, 2)
    return p
S = (chaikin(P) * 4).astype(np.int32)
m = np.zeros((h * 4, w * 4), np.uint8); cv.fillPoly(m, [S], 255, lineType=cv.LINE_AA)
poly = cv.resize(m, (w, h), interpolation=cv.INTER_AREA) > 127
pm = poly.astype(np.uint8)
mask = np.full((h, w), cv.GC_BGD, np.uint8)
mask[pm > 0] = cv.GC_PR_FGD
mask[cv.erode(pm, cv.getStructuringElement(cv.MORPH_ELLIPSE, (29, 29))) > 0] = cv.GC_FGD
bgm, fgm = np.zeros((1, 65)), np.zeros((1, 65))
cv.grabCut(img, mask, None, bgm, fgm, 10, cv.GC_INIT_WITH_MASK)
g = ((mask == 1) | (mask == 3)).astype(np.uint8)
n, lab, st, _ = cv.connectedComponentsWithStats(g); g = (lab == 1 + np.argmax(st[1:, 4])).astype(np.uint8)
inv = 1 - g; n2, lab2, st2, _ = cv.connectedComponentsWithStats(inv)
for i in range(1, n2):
    if st2[i, 4] < 1500: g[lab2 == i] = 1
g = cv.morphologyEx(g, cv.MORPH_OPEN, cv.getStructuringElement(cv.MORPH_ELLIPSE, (5, 5)))
g = cv.morphologyEx(g, cv.MORPH_CLOSE, cv.getStructuringElement(cv.MORPH_ELLIPSE, (9, 9)))
a = cv.GaussianBlur(g.astype(np.float32), (0, 0), 1.3); a = np.clip((a - .5) * 2 + .5, 0, 1)
ys, xs = np.where(a > .05); x0, x1, y0, y1 = xs.min() - 8, xs.max() + 8, ys.min() - 8, h
rgba = np.dstack([cv.cvtColor(img, cv.COLOR_BGR2RGB), (a * 255).astype(np.uint8)])[y0:y1, x0:x1]
im = Image.fromarray(rgba); s = 1100 / im.height; im = im.resize((int(im.width * s), 1100), Image.LANCZOS); im.save('site/img/teacher_cut.png')
pv = Image.new('RGB', im.size, (253, 246, 232)); pv.paste(im, (0, 0), im); pv.save('check/tfull.jpg'); print(im.size)
