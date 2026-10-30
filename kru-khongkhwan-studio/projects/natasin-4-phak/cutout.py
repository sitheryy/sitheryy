import sys, cv2 as cv, numpy as np, onnxruntime as ort
M = '/home/claude/deps/sch/02.model/DeepLabV3Plus(timm-mobilenetv3_large_100)_1366_4.71M_0.8606/best_model_simplifier.onnx'
sess = ort.InferenceSession(M)
inp = sess.get_inputs()[0].name

def prior(img):
    h, w = img.shape[:2]
    acc = np.zeros((h, w), np.float32)
    # run on the whole image and on overlapping square tiles (model is 512x512)
    crops = [(0, 0, w, h)]
    s = min(w, h)
    for y in np.linspace(0, h - s, 3).astype(int):
        crops.append((0, y, s if w <= h else w, s))
    cnt = np.zeros((h, w), np.float32)
    for (x0, y0, cw, ch) in crops:
        c = img[y0:y0 + ch, x0:x0 + cw]
        x = cv.cvtColor(cv.resize(c, (512, 512)), cv.COLOR_BGR2RGB) / 255.
        x = ((x - [.485, .456, .406]) / [.229, .224, .225]).transpose(2, 0, 1)[None].astype('float32')
        o = np.array(sess.run(None, {inp: x})).squeeze()  # 3 x 512 x 512 (skin, clothes, hair)
        m = o.max(0)
        acc[y0:y0 + ch, x0:x0 + cw] += cv.resize(m, (cw, ch))
        cnt[y0:y0 + ch, x0:x0 + cw] += 1
    return acc / np.maximum(cnt, 1)

name = sys.argv[1]
img = cv.imread(f'cut/{name}.jpg')
h, w = img.shape[:2]
p = prior(img)
np.save(f'cut/{name}_prior.npy', p)
cv.imwrite(f'cut/{name}_prior.png', (np.clip(p, 0, 1) * 255).astype(np.uint8))
