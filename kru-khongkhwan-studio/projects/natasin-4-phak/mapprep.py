# Rasterise the 77 provinces into the 4 traditional regions, trace each region's outline, write map.js
import json, cv2 as cv, numpy as np, math
d = json.load(open('/home/claude/deps/thjson/thailand.json'))
N = ['Chiang Rai', 'Chiang Mai', 'Nan', 'Phayao', 'Phrae', 'Mae Hong Son', 'Lampang', 'Lamphun', 'Uttaradit', 'Kamphaeng Phet',
     'Tak', 'Nakhon Sawan', 'Phichit', 'Phitsanulok', 'Phetchabun', 'Sukhothai', 'Uthai Thani']
NE = ['Amnat Charoen', 'Bueng Kan', 'Buri Ram', 'Chaiyaphum', 'Kalasin', 'Khon Kaen', 'Loei', 'Maha Sarakham', 'Mukdahan',
      'Nakhon Phanom', 'Nakhon Ratchasima', 'Nong Bua Lam Phu', 'Nong Khai', 'Roi Et', 'Sakon Nakhon', 'Si Sa Ket', 'Surin',
      'Ubon Ratchathani', 'Udon Thani', 'Yasothon']
S = ['Chumphon', 'Krabi', 'Nakhon Si Thammarat', 'Narathiwat', 'Pattani', 'Phangnga', 'Phatthalung', 'Phuket', 'Ranong',
     'Satun', 'Songkhla', 'Surat Thani', 'Trang', 'Yala']
reg = lambda n: 1 if n in N else 3 if n in NE else 4 if n in S else 2
LON0, LAT0, K = 97.2, 20.6, math.cos(math.radians(13))
H = 3000; sc = H / (20.6 - 5.5); W = int((105.8 - 97.2) * K * sc)
P = lambda lon, lat: ((lon - LON0) * K * sc, (LAT0 - lat) * sc)
lab = np.zeros((H, W), np.uint8)
for f in d['features']:
    g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    r = reg(f['properties']['name'])
    for poly in polys:
        pts = np.array([P(*c[:2]) for c in poly[0]], np.int32)
        cv.fillPoly(lab, [pts], r)
out = {'W': W, 'H': H, 'regions': {}}
names = {1: 'north', 2: 'central', 3: 'isan', 4: 'south'}
for r, nm in names.items():
    m = (lab == r).astype(np.uint8)
    m = cv.morphologyEx(m, cv.MORPH_CLOSE, np.ones((7, 7), np.uint8))
    cs, _ = cv.findContours(m, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_NONE)
    polys = []
    for c in cs:
        if cv.contourArea(c) < 60: continue
        a = cv.approxPolyDP(c, 2.0, True)[:, 0, :]
        polys.append([[int(x), int(y)] for x, y in a])
    ys, xs = np.where(m > 0)
    out['regions'][nm] = {'polys': polys, 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())],
                          'c': [int(xs.mean()), int(ys.mean())]}
    print(nm, len(polys), sum(len(p) for p in polys), out['regions'][nm]['bbox'])
open('/home/claude/work/site/map.js', 'w').write('const MAP=' + json.dumps(out, separators=(',', ':')) + ';')
print(W, H)
