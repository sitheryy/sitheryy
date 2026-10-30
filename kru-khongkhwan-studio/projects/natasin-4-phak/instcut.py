import cv2 as cv, numpy as np
from PIL import Image
m = dict(zip(['mong','klongaew','chap','ching','phin','krap','khaen','salo','sueng','ponglang','klongyao','wot'],
 ['56d61735','b0acca2b','23dedc7f','b0741aae','afa4bb15','d40e69ef','18f7a321','489e2c0e','5772e648','7cbcd076','a6407ba0','ec06801f']))
for k, f in m.items():
    img = cv.imread(f'/mnt/user-data/attachments/e208316f-78bd-5c2e-b1e0-fdf22d146cdb/{f}-image.jpg'); h, w = img.shape[:2]
    lab = cv.cvtColor(cv.GaussianBlur(img, (5, 5), 0), cv.COLOR_BGR2LAB).astype(np.float32)
    border = np.concatenate([lab[:8].reshape(-1,3), lab[-8:].reshape(-1,3), lab[:, :8].reshape(-1,3), lab[:, -8:].reshape(-1,3)])
    d = np.linalg.norm(lab - np.median(border, 0), axis=2)
    obj = (d >= 13).astype(np.uint8)
    closed = cv.morphologyEx(obj, cv.MORPH_CLOSE, cv.getStructuringElement(cv.MORPH_ELLIPSE, (15, 15)))
    n, lab_, st, _ = cv.connectedComponentsWithStats(1 - closed)
    bg = np.zeros((h, w), bool)
    for i in range(1, n):
        comp = lab_ == i; x, y, cw, ch, area = st[i]
        touches = x == 0 or y == 0 or x + cw >= w or y + ch >= h
        top_head = k in ("klongyao", "klongaew") and (y + ch / 2) < 0.3 * h
        if touches or (area > 1500 and d[comp].mean() < 8.5 and not top_head): bg |= comp
    fgm = (~bg).astype(np.float32)
    # soft edge only where the object meets the removed paper
    edge = cv.dilate(bg.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    a = np.where(edge & ~bg, np.clip((d - 5) / 12, 0, 1), fgm)
    a = cv.GaussianBlur(a.astype(np.float32), (0, 0), .8)
    ys, xs = np.where(a > .05); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    rgba = np.dstack([cv.cvtColor(img, cv.COLOR_BGR2RGB), (a * 255).astype(np.uint8)])[max(0,y0-6):y1+6, max(0,x0-6):x1+6]
    im = Image.fromarray(rgba); s = 640 / max(im.size); im = im.resize((int(im.width*s), int(im.height*s)), Image.LANCZOS)
    im.save(f'site/img/i_{k}.png')
    pv = Image.new('RGB', im.size, (60, 160, 90)); pv.paste(im, (0,0), im); pv.thumbnail((220,220)); pv.save(f'inst/{k}.jpg')
