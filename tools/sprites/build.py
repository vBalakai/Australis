"""Export every battle sprite to assets/sprites, plus anchor points for move effects."""
import json, os, importlib
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'assets', 'sprites')
os.makedirs(OUT, exist_ok=True)
meta = {}
for mod in ['koala', 'dino', 'platypus']:
    m = importlib.import_module(mod)
    for k, fn in m.FRONT.items():
        img = fn(); img.save(os.path.join(OUT, f'{k}_front.png'))
        b = m.BACK[k](); b.save(os.path.join(OUT, f'{k}_back.png'))
        bbox = img.getbbox()
        meta[k] = {'anchors': img.anchors, 'bbox': bbox, 'backBbox': b.getbbox()}
json.dump(meta, open(os.path.join(OUT, 'sprites.json'), 'w'), indent=1)
print('exported', len(meta) * 2, 'sprites')
