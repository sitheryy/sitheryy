# sticker cutout: find the drawing, close it, fill holes, grow by the sticker border, soft edge -> PNG
import sys, cv2 as cv, numpy as np
from PIL import Image
for name in sys.argv[1:]:
    img = cv.imread(f'raw/{name}.jpg'); h, w = img.shape[:2]
    if ("_bg_" in name or name.startswith("bg_")):
        Image.open(f'raw/{name}.jpg').convert('RGB').resize((1920, 1080), Image.LANCZOS).save(f'assets/{name}.jpg', quality=92); continue
    lab = cv.cvtColor(cv.GaussianBlur(img, (5, 5), 0), cv.COLOR_BGR2LAB).astype(np.float32)
    border = np.concatenate([lab[:6].reshape(-1, 3), lab[-6:].reshape(-1, 3), lab[:, :6].reshape(-1, 3), lab[:, -6:].reshape(-1, 3)])
    d = np.linalg.norm(lab - np.median(border, 0), axis=2)
    obj = (d >= 10).astype(np.uint8)
    obj = cv.morphologyEx(obj, cv.MORPH_CLOSE, cv.getStructuringElement(cv.MORPH_ELLIPSE, (21, 21)))
    ff = obj.copy(); m = np.zeros((h + 2, w + 2), np.uint8); cv.floodFill(ff, m, (0, 0), 2); obj = (ff != 2).astype(np.uint8)
    n, lab_, st, _ = cv.connectedComponentsWithStats(obj)
    keep = np.zeros_like(obj)
    for i in range(1, n):
        if st[i, 4] > 0.12 * st[1:, 4].max(): keep[lab_ == i] = 1
    grow = int(round(w * 0.012))
    keep = cv.dilate(keep, cv.getStructuringElement(cv.MORPH_ELLIPSE, (2 * grow + 1, 2 * grow + 1)))
    a = cv.GaussianBlur(keep.astype(np.float32), (0, 0), 2.0); a = np.clip((a - .5) * 2.5 + .5, 0, 1)
    ys, xs = np.where(a > .05); x0, x1, y0, y1 = max(0, xs.min() - 4), min(w, xs.max() + 5), max(0, ys.min() - 4), min(h, ys.max() + 5)
    rgba = np.dstack([cv.cvtColor(img, cv.COLOR_BGR2RGB), (a * 255).astype(np.uint8)])[y0:y1, x0:x1]
    Image.fromarray(rgba).save(f'assets/{name}.png')
