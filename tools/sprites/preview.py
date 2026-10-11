import sys,importlib
from pixel import sheet
mods=sys.argv[2:] or ['platypus']
out=sys.argv[1]
ims=[]
for name in mods:
    m=importlib.import_module(name)
    for k in m.FRONT: ims.append(m.FRONT[k]())
    for k in m.BACK: ims.append(m.BACK[k]())
sheet(ims,scale=4,cols=3).save(out)
print('ok',len(ims))
