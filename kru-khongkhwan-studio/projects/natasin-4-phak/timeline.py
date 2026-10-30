# Video timeline: narration chunks with the performance clips slotted in after each region.
import json
LEAD, PRE, POST, END = 0.4, 1.6, 0.7, 5.0
NARR = [('intro', 0.0, 17.0), ('north', 17.0, 50.5), ('central', 50.5, 89.85), ('isan', 89.85, 125.6),
        ('south', 125.6, 161.2), ('outro', 161.2, 168.52)]
CLIP = {'north': 14.0, 'central': 18.2, 'isan': 17.35, 'south': 16.75}
segs, v = [], 0.0
for name, a, b in NARR:
    lead = LEAD if name == 'intro' else 0.0
    segs.append({'kind': 'narr', 'name': name, 'v0': v, 'v1': v + lead + (b - a), 'n0': a, 'n1': b, 'lead': lead})
    v += lead + (b - a)
    if name in CLIP:
        segs.append({'kind': 'clip', 'name': name, 'v0': v, 'v1': v + PRE + CLIP[name] + POST, 'play': v + PRE, 'dur': CLIP[name]})
        v += PRE + CLIP[name] + POST
segs.append({'kind': 'end', 'name': 'end', 'v0': v, 'v1': v + END})
v += END
T = {'segs': segs, 'total': round(v, 3), 'PRE': PRE, 'POST': POST}
json.dump(T, open('timeline.json', 'w'), indent=1)
open('site/timeline.js', 'w').write('const TL=' + json.dumps(T) + ';')
for s in segs: print(s['kind'], s['name'], round(s['v0'], 2), round(s['v1'], 2))
print('total', v)
