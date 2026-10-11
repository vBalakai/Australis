"""The Puggly line: slim platypus snipers.
Front sprites face left toward your side of the field; back sprites are three-quarter rear views facing up and right."""
import math
from pixel import Sprite, ramp

BODY = ramp('#2f86a8')
BODY2 = ramp('#21698a')
BELLY = ramp('#efe4bf', 0.01)
BILL = ramp('#5c6a8a', 0.0, dark='#1a1e2c')
WEB = ramp('#3c4660', 0.0, dark='#181b26')
QUILL = ramp('#b6f04a', -0.04)
CYAN = '#5ae0ff'
GLOW = '#e0fcff'


def bill(s, base_x, y0, y1, tip_x, flare=3, scope=None, bands=0, facing=-1):
    """A duck bill: narrow where it meets the face, flared and rounded at the tip, with glowing electrosense marks."""
    d = facing
    mid = (y0 + y1) / 2
    h = (y1 - y0) / 2
    L = abs(tip_x - base_x)
    s.paint(s.tube([(base_x, mid), (tip_x - d * (h + flare * .6), mid + .3)], h * .9, h + flare * .6), BILL)
    s.line(base_x + d * 2, mid + 1, tip_x - d * 4, mid + 1, BILL[1])                    # mouth line
    s.px(tip_x - d * 3, mid - h - flare * .3 + 2, BILL[0]); s.px(tip_x - d * 5, mid - h - flare * .3 + 2, BILL[0])
    for k in range(3):                                                                 # electrosense dashes
        x = base_x + d * (L * (.18 + k * .18))
        s.px(x, mid - h + 1.5, CYAN); s.px(x + d, mid - h + 1.5, CYAN)
    for b in range(bands):                                                             # charge bands near the muzzle
        x = int(round(tip_x - d * (6 + b * 3)))
        for y in range(int(mid - h - flare * .5), int(mid + h + flare * .6) + 1):
            if 0 <= y < s.n and s.fig[y, x] and s.fig[y - 1, x] and s.fig[y + 1, x]:
                s.px(x, y, CYAN)
    s.px(tip_x + d * 0, mid, GLOW); s.px(tip_x - d, mid, CYAN); s.px(tip_x - d, mid - 1, GLOW)   # muzzle glow
    s.anchors['muzzle'] = (round(tip_x), round(mid))
    if scope:
        sx0, sx1, sy = scope
        s.paint(s.tube([(sx0, sy), (sx1, sy)], 1.7), BILL)
        s.px(sx0 + d * -1 if d < 0 else sx1 + 1, sy, CYAN)


def quill(s, bx, by, tx, ty, w=3):
    """A venom quill: dark socket at the base, lime spike above."""
    s.anchors.setdefault('quills', []).append((round(tx), round(ty)))
    s.paint(s.poly([(bx - w, by + 1), (bx + w, by + 1), (tx, ty)], bevel=1.6), QUILL)
    s.paint(s.ellipse(bx, by + 1, w * .9, 1.6), BODY2, line=False, flat=1)


def foot(s, cx, cy, w):
    s.paint(s.ellipse(cx, cy, w, 2.6), WEB)
    for i in range(3):
        s.px(cx - w + 2 + i * (w - 1), cy + 1, WEB[3])


def tail_pattern(s, cx, cy, rx, ry):
    for i in range(-2, 3):
        s.line(cx + i * 4 - 3, cy - ry + 2, cx + i * 4 + 3, cy + ry - 2, BODY2[1])


# ---------------- fronts: three-quarter view turned toward you, bill pointing out to the left ----------------
def face_bill(s, cx, cy, length, width, ang=0.35, flare=2.5, scope=None, bands=0):
    """A bill coming toward the viewer and off to the left: base at (cx, cy), tip down and left."""
    tx, ty = cx - math.cos(ang) * length, cy + math.sin(ang) * length
    sx, sy = tx + math.cos(ang) * (width * .5 + flare), ty - math.sin(ang) * (width * .5 + flare)
    s.paint(s.tube([(cx, cy), (sx, sy)], width * .42, width * .5 + flare), BILL)
    # upper bill lighter, mouth line underneath
    for k in range(int(length * .1), int(length * .85)):
        x, y = cx - math.cos(ang) * k, cy + math.sin(ang) * k + width * .35 + (flare * .5 if k > length * .55 else 0)
        s.px(x, y, BILL[1])
    for k in range(3):
        f = .3 + k * .17
        s.px(cx - math.cos(ang) * length * f, cy + math.sin(ang) * length * f - width * .3, CYAN)
        s.px(cx - math.cos(ang) * length * f - 1, cy + math.sin(ang) * length * f - width * .3, CYAN)
    nx, ny = tx + math.cos(ang) * 4, ty - math.sin(ang) * 4 - width * .25
    s.px(nx, ny, BILL[0]); s.px(nx + 2, ny - 1, BILL[0])
    for b in range(bands):
        f = .62 + b * .1
        bx, by = cx - math.cos(ang) * length * f, cy + math.sin(ang) * length * f
        for d in range(-int(width * .5 + flare * .6), int(width * .5 + flare * .6) + 1):
            x, y = int(round(bx + math.sin(ang) * d * .5)), int(round(by + d))
            if 0 < y < s.n - 1 and s.fig[y, x] and s.fig[y - 1, x] and s.fig[y + 1, x]:
                s.px(x, y, CYAN)
    s.px(tx + 1, ty, GLOW); s.px(tx + 2, ty, CYAN); s.px(tx + 1, ty - 1, CYAN)
    s.anchors['muzzle'] = (round(tx), round(ty))
    if scope:
        x0, y0, x1, y1 = scope
        s.paint(s.tube([(x0, y0), (x1, y1)], 1.8), BILL)
        s.px(x1 - 1, y1, CYAN); s.px(x1 - 1, y1 - 1, GLOW)


def puggly_front():
    s = Sprite()
    s.paint(s.ellipse(72, 74, 13, 6.5, -0.25), BODY2)                 # paddle tail behind
    tail_pattern(s, 72, 74, 13, 6.5)
    s.paint(s.ellipse(66, 78, 6, 5), BODY2)                           # far hind leg
    s.paint(s.ellipse(54, 67, 18, 14), BODY)                          # round body
    s.paint(s.ellipse(50, 71, 11, 9), BELLY, line=False)
    for qx, qy, tx, ty in [(58, 54, 60, 45), (64, 57, 69, 49), (69, 61, 76, 55)]:
        quill(s, qx, qy, tx, ty, 2.8)
    s.paint(s.ellipse(45, 47, 16, 14), BODY)                          # big baby head
    s.paint(s.ellipse(40, 54, 10, 5.5), BELLY, line=False)            # cream cheeks around the bill
    s.eye(37, 44, 5, 6, iris='#3aa8e8', look=-1)
    s.eye(51, 43, 4, 6, iris='#3aa8e8', look=-1)
    for x, y in [(43, 36), (44, 35), (45, 35), (46, 36)]:
        s.px(x, y, BELLY[3])
    face_bill(s, 43, 52, 24, 8, ang=0.42, flare=2.5)
    s.paint(s.ellipse(40, 77, 5, 4.5), BODY)                          # front paws
    foot(s, 39, 81, 5)
    s.paint(s.ellipse(55, 79, 5, 4), BODY)
    foot(s, 55, 82, 5)
    s.paint(s.ellipse(68, 80, 5.5, 3.5), BODY)
    foot(s, 69, 83, 5)
    return s.finish()


def spurbill_front():
    s = Sprite()
    s.paint(s.poly([(66, 68), (86, 60), (93, 66), (88, 74), (68, 76)], bevel=3), BODY2)
    tail_pattern(s, 80, 67, 11, 6)
    s.paint(s.poly([(82, 61), (91, 53), (90, 62)], bevel=1), BODY2)
    s.paint(s.ellipse(70, 80, 6, 5), BODY2)
    s.paint(s.ellipse(56, 68, 24, 12, -0.12), BODY)                   # long body, low and crouched
    s.paint(s.ellipse(50, 75, 15, 5, -0.1), BELLY, line=False)
    for x in range(48, 76, 7):
        y = 66 - (x - 48) * .2
        s.line(x, y, x + 3, y + 3, BODY[4]); s.line(x + 3, y + 3, x + 6, y, BODY[4])
    for i in range(6):
        bx, by = 44 + i * 6, 58 - i * 1.0
        quill(s, bx, by, bx + 7, by - 11, 3)
    s.paint(s.ellipse(34, 58, 13, 11.5), BODY)
    s.paint(s.ellipse(30, 64, 9, 4.5), BELLY, line=False)
    s.eye(28, 55, 5, 3, iris=CYAN, look=-1, style='fierce')
    s.eye(39, 54, 4, 3, iris=CYAN, look=-1, style='fierce')
    face_bill(s, 31, 62, 28, 8, ang=0.18, flare=2.5, scope=(24, 57, 30, 56), bands=2)
    s.paint(s.ellipse(40, 81, 6, 3.5), BODY)
    foot(s, 39, 84, 6)
    s.paint(s.ellipse(66, 82, 7, 3.5), BODY)
    foot(s, 66, 85, 6.5)
    s.paint(s.poly([(72, 79), (80, 75), (75, 81)], bevel=1), QUILL)
    return s.finish()


def platyrant_front():
    s = Sprite()
    s.paint(s.poly([(56, 78), (84, 80), (92, 86), (84, 93), (58, 90)], bevel=3), BODY2)
    tail_pattern(s, 76, 86, 12, 6)
    for i in range(9):                                               # the quill launcher: a fan behind the shoulders
        a = math.radians(-160 + i * 17.5)
        bx, by = 54 + math.cos(a) * 9, 46 + math.sin(a) * 6
        tx, ty = 54 + math.cos(a) * 34, 44 + math.sin(a) * 30
        quill(s, bx, by, tx, ty, 4.6)
    s.paint(s.ellipse(66, 80, 9, 8), BODY2)
    s.paint(s.ellipse(52, 62, 16, 21, 0.15), BODY)                   # slim upright body
    s.paint(s.ellipse(48, 66, 10, 15, 0.15), BELLY, line=False)
    s.paint(s.ellipse(46, 33, 13, 11.5), BODY)                        # head
    s.paint(s.ellipse(42, 40, 9, 4.5), BELLY, line=False)
    for i, (qx, qy) in enumerate([(42, 24), (47, 23), (52, 25)]):
        quill(s, qx, qy, qx - 2 + i * 3, qy - 9, 2.4)
    s.eye(40, 30, 5, 3, iris=CYAN, look=-1, style='fierce')
    s.eye(51, 29, 4, 3, iris=CYAN, look=-1, style='fierce')
    for a in range(0, 360, 24):
        s.px(40 + math.cos(math.radians(a)) * 4.8, 30.6 + math.sin(math.radians(a)) * 3.9, CYAN)
    face_bill(s, 44, 39, 27, 8, ang=0.22, flare=2.6, scope=(32, 32, 39, 31), bands=2)
    s.paint(s.tube([(58, 50), (44, 60), (36, 58)], 3.4, 2.8), BODY)   # forearm braced in front
    s.paint(s.ellipse(32, 58, 4.5, 3.5), WEB)
    for i in range(3):
        s.px(28 + i * 2, 60, '#e8ecf0')
    s.paint(s.ellipse(58, 78, 10, 9), BODY)
    s.paint(s.tube([(58, 82), (54, 89)], 4, 3.4), BODY2)
    foot(s, 53, 91, 7.5)
    s.paint(s.poly([(65, 83), (78, 78), (68, 88)], bevel=1.2), QUILL)
    return s.finish()


# ---------------- backs: three-quarter rear, facing up and right toward the foe ----------------
def puggly_back():
    s = Sprite()
    s.paint(s.ellipse(26, 84, 19, 9, 0.35), BODY2)                    # big paddle tail in front
    tail_pattern(s, 26, 84, 19, 9)
    s.paint(s.ellipse(46, 70, 25, 17, -0.25), BODY)                   # back
    for qx, qy in [(38, 62), (47, 58), (56, 54)]:
        quill(s, qx, qy, qx + 4, qy - 10, 3)
    s.paint(s.ellipse(64, 48, 15, 13), BODY)                          # head, seen from behind
    bill(s, 74, 42, 49, 92, flare=2.5, facing=1)
    s.paint(s.ellipse(71, 53, 6, 4), BELLY, line=False)               # sliver of cheek
    s.eye(71, 42, 3, 4, iris='#3aa8e8', look=1)
    s.paint(s.ellipse(22, 74, 7, 6), BODY2)                           # hind foot
    foot(s, 18, 78, 6)
    s.paint(s.ellipse(70, 74, 6, 6), BODY)
    return s.finish()


def spurbill_back():
    s = Sprite()
    s.paint(s.poly([(4, 82), (22, 74), (34, 86), (16, 94), (2, 92)], bevel=3), BODY2)
    tail_pattern(s, 18, 85, 12, 7)
    s.paint(s.ellipse(44, 70, 30, 15, -0.42), BODY)
    for x in range(26, 60, 8):
        s.line(x, 78 - (x - 26) * .45, x + 4, 74 - (x - 26) * .45, BODY[4])
    for i in range(6):
        bx, by = 28 + i * 7, 68 - i * 5
        quill(s, bx, by, bx + 3, by - 12, 3)
    s.paint(s.ellipse(70, 42, 13, 11), BODY)
    bill(s, 79, 36, 43, 95, flare=2.5, scope=(78, 84, 33), bands=1, facing=1)
    s.eye(76, 37, 4, 3, iris=CYAN, look=1, style='fierce')
    s.paint(s.ellipse(22, 74, 8, 6), BODY2)
    foot(s, 18, 79, 7)
    s.paint(s.ellipse(66, 62, 7, 6), BODY)
    return s.finish()


def platyrant_back():
    s = Sprite()
    s.paint(s.poly([(2, 80), (24, 74), (36, 88), (18, 96), (0, 94)], bevel=3), BODY2)
    tail_pattern(s, 18, 86, 13, 7)
    s.paint(s.ellipse(22, 80, 11, 9), BODY2)
    s.paint(s.poly([(8, 82), (16, 78), (12, 86)], bevel=1), QUILL)
    s.paint(s.ellipse(46, 60, 25, 28, -0.2), BODY)
    for row in range(3):
        n = 5 - (row % 2)
        for i in range(n):
            a = (i / (n - 1) - 0.5) * 2.0
            bx, by = 44 + math.sin(a) * (16 - row * 3) + row * 2, 48 + row * 12 + abs(math.sin(a)) * 3
            tx, ty = bx + math.sin(a) * 12 + 6, by - 20 + abs(a) * 4
            quill(s, bx, by, tx, ty, 4.4)
    s.paint(s.ellipse(68, 30, 13, 11), BODY)
    for i, qx in enumerate((62, 67, 72)):
        quill(s, qx, 24, qx + i * 2 - 1, 12, 2)
    bill(s, 76, 24, 32, 95, flare=3, scope=(74, 81, 21), bands=2, facing=1)
    s.eye(74, 25, 4, 3, iris=CYAN, look=1, style='fierce')
    s.paint(s.ellipse(72, 76, 9, 9), BODY2)
    s.paint(s.poly([(80, 76), (88, 70), (84, 80)], bevel=1), QUILL)
    return s.finish()


FRONT = {'puggly': puggly_front, 'spurbill': spurbill_front, 'platyrant': platyrant_front}
BACK = {'puggly': puggly_back, 'spurbill': spurbill_back, 'platyrant': platyrant_back}
