"""The Gumjo line: koala tanks. Fronts face left toward your side; backs are three-quarter rear views."""
import math
from pixel import Sprite, ramp

FUR = ramp('#8e95a6', 0.02)
FUR2 = ramp('#6c7284', 0.02)
CREAM = ramp('#f2ecdc', 0.01)
EARIN = ramp('#e8e2dc', 0.0)
NOSE = ramp('#363644', 0.0, dark='#16161e')
BARK = ramp('#94603a', 0.02)
BARK2 = ramp('#6e4628', 0.02)
LEAF = ramp('#5cb246', -0.03)
LEAF2 = ramp('#3f8e34', -0.03)
NUT = ramp('#a2683a', 0.02)
ROCK = ramp('#8e8270', 0.02)
TRUNK = ramp('#e2d8c6', 0.01)


def gumnut(s, cx, top, w, h):
    """The gumnut cap: a woody cup with a four-valve cross on top."""
    s.paint(s.poly([(cx - w, top + h), (cx - w * .8, top + 1), (cx + w * .8, top + 1), (cx + w, top + h)], bevel=2), NUT)
    s.paint(s.ellipse(cx, top + 1.5, w * .85, 2.2), NUT, flat=3)
    s.line(cx - w * .5, top + 1, cx + w * .5, top + 2, NUT[0]); s.line(cx, top, cx, top + 3, NUT[0])


def leaf(s, cx, cy, w, h, rot, tones=LEAF):
    s.paint(s.ellipse(cx, cy, w, h, rot), tones)
    dx, dy = math.sin(-rot) * h * .8, math.cos(-rot) * h * .8
    s.line(cx - dx, cy - dy, cx + dx, cy + dy, tones[1])


def ear(s, cx, cy, r, tuft=None):
    s.paint(s.ellipse(cx, cy, r, r * .95), FUR)
    s.paint(s.ellipse(cx + (1.5 if cx < 48 else -1.5), cy + 1.5, r * .55, r * .52), EARIN, line=False, flat=2)
    for i in range(4):                                       # fluffy fringe
        a = math.radians(200 + i * 40)
        s.px(cx + math.cos(a) * (r + .5), cy + math.sin(a) * (r + .5), EARIN[4])
    if tuft:
        for i in range(3):
            leaf(s, cx - 3 + i * 3, cy - r - 1, 1.8, 3.6, (i - 1) * .5, tuft)


def nose(s, cx, cy, w, h):
    s.paint(s.ellipse(cx, cy, w, h), NOSE)
    s.px(cx - w * .4, cy - h * .5, NOSE[4]); s.px(cx - w * .4 + 1, cy - h * .5, NOSE[3])


def bark_plate(s, x0, y0, x1, y1, tones=BARK):
    s.paint(s.poly([(x0, y0 + 2), (x1 - 1, y0), (x1, y1 - 2), (x0 + 1, y1)], bevel=1.6), tones)
    for k in range(1, 3):
        y = y0 + (y1 - y0) * k / 3
        s.line(x0 + 2, y + 1, x1 - 2, y - .5, tones[1])


# ---------------- fronts ----------------
def gumjo_front():
    s = Sprite()
    s.paint(s.ellipse(50, 70, 16, 14), FUR)
    s.paint(s.ellipse(48, 73, 10, 10), CREAM, line=False)
    s.paint(s.ellipse(40, 84, 6, 3.5), FUR2); s.paint(s.ellipse(59, 84, 6, 3.5), FUR2)
    s.paint(s.ellipse(39, 84.5, 3.5, 2), CREAM, line=False); s.paint(s.ellipse(58, 84.5, 3.5, 2), CREAM, line=False)
    leaf(s, 46, 68, 6.5, 13, 0.32)                          # the gum-leaf shield it hugs
    s.anchors['shield'] = (46, 66)
    for i in range(4):
        s.px(40 + i, 59 + i * 3, LEAF[4])
    s.paint(s.ellipse(37, 67, 4.5, 4), FUR); s.paint(s.ellipse(54, 64, 4.5, 4), FUR)
    ear(s, 31, 38, 9); ear(s, 65, 35, 9)
    s.paint(s.ellipse(48, 46, 18, 14.5), FUR)
    gumnut(s, 48, 27, 8, 6)
    s.eye(40, 45, 4, 5, iris='#4a9a3a', look=-1)
    s.eye(55, 44, 4, 5, iris='#4a9a3a', look=-1)
    nose(s, 46, 51, 4.5, 5.5)
    s.line(44, 57, 47, 57, NOSE[1])
    return s.finish()


def bellowala_front():
    s = Sprite()
    s.paint(s.ellipse(40, 86, 8, 5), FUR2); s.paint(s.ellipse(61, 86, 8, 5), FUR2)
    s.paint(s.ellipse(51, 66, 21, 20), FUR)
    s.paint(s.ellipse(49, 70, 13, 14), CREAM, line=False)
    for i in range(2):                                      # bark shoulder pads
        bark_plate(s, 62 + i * 2, 46 + i * 5, 76 + i * 2, 54 + i * 5, BARK2 if i else BARK)
    s.paint(s.tube([(70, 58), (74, 74)], 5.5, 5), FUR)      # right arm with a bark bracer
    for i in range(3):
        bark_plate(s, 67, 64 + i * 4, 80, 69 + i * 4, BARK2 if i % 2 else BARK)
    s.paint(s.ellipse(74, 80, 5, 4), FUR2)
    for i in range(9):                                      # collar of gum leaves
        a = math.radians(200 + i * 17)
        leaf(s, 51 + math.cos(a) * 15, 50 + math.sin(a) * -4 + 2, 3, 6, -math.cos(a) * .9, LEAF if i % 2 else LEAF2)
    ear(s, 31, 26, 10, LEAF); ear(s, 70, 23, 10, LEAF)
    s.paint(s.ellipse(50, 36, 17, 14), FUR)
    gumnut(s, 50, 17, 10, 7)
    s.eye(42, 34, 5, 4, iris='#4a9a3a', look=-1, style='fierce')
    s.eye(57, 33, 4, 4, iris='#4a9a3a', look=-1, style='fierce')
    nose(s, 48, 42, 5.5, 6.5)
    s.line(45, 49, 50, 49, NOSE[1])
    # the leaf shield on its left arm
    s.anchors['shield'] = (26, 66)
    s.paint(s.tube([(34, 56), (28, 68)], 5.5, 5), FUR)
    s.paint(s.poly([(14, 54), (36, 52), (38, 70), (26, 84), (14, 72)], bevel=3), LEAF2)
    s.paint(s.poly([(18, 57), (33, 56), (34, 69), (26, 79), (18, 70)], bevel=2), LEAF, line=False)
    s.line(26, 54, 26, 82, LEAF2[1])
    for i in range(5):
        s.line(26, 58 + i * 5, 20, 55 + i * 5, LEAF2[2]); s.line(26, 58 + i * 5, 32, 55 + i * 5, LEAF2[2])
    return s.finish()


def koalossus_front():
    s = Sprite()
    for tx, top, col in [(44, 6, LEAF2), (60, 2, LEAF), (73, 10, LEAF2)]:   # the grove on its back
        s.paint(s.tube([(tx, 34), (tx + 1, top + 8)], 2.2, 1.6), TRUNK)
        for dx, dy, r in [(0, 0, 8), (-6, 4, 6), (6, 4, 6), (0, -5, 5.5)]:
            s.paint(s.ellipse(tx + dx, top + 6 + dy, r, r * .85), col)
    s.paint(s.ellipse(40, 90, 9, 5), FUR2); s.paint(s.ellipse(62, 90, 9, 5), FUR2)
    s.paint(s.ellipse(51, 60, 31, 25), FUR)                 # massive body
    s.anchors['shield'] = (50, 56)
    for row in range(3):                                    # shingled ironbark across the back
        for c in range(4):
            x = 27 + c * 12 + row * 4
            bark_plate(s, x, 36 + row * 6, x + 13, 44 + row * 6, BARK if (row + c) % 2 else BARK2)
    s.paint(s.ellipse(48, 68, 18, 15), CREAM, line=False)
    for side, x in [(-1, 22), (1, 80)]:                     # tree-trunk arms and boulder fists
        s.paint(s.tube([(x - side * 4, 50), (x, 76)], 8, 8.5), FUR)
        for i in range(3):
            bark_plate(s, x - 9, 56 + i * 5, x + 9, 62 + i * 5, BARK2 if i % 2 else BARK)
        s.paint(s.poly([(x - 10, 78), (x - 4, 74), (x + 6, 74), (x + 11, 80), (x + 8, 90), (x - 8, 91)], bevel=3), ROCK)
        s.line(x - 3, 80, x + 2, 86, ROCK[1])
    ear(s, 30, 30, 10, LEAF2); ear(s, 68, 28, 10, LEAF2)
    s.paint(s.ellipse(49, 40, 17, 14), FUR)
    s.paint(s.poly([(33, 34), (66, 32), (64, 37), (35, 39)], bevel=1.5), FUR2)   # heavy brow
    gumnut(s, 50, 23, 7, 5)
    s.eye(42, 39, 5, 3, iris='#5ab040', look=-1, style='fierce')
    s.eye(57, 38, 4, 3, iris='#5ab040', look=-1, style='fierce')
    nose(s, 48, 46, 6.5, 7)
    s.paint(s.ellipse(48, 54, 8, 3.5), CREAM, line=False)
    s.line(44, 54, 52, 54, NOSE[1])
    return s.finish()


# ---------------- backs: three-quarter rear, facing up and right ----------------
def gumjo_back():
    s = Sprite()
    s.paint(s.ellipse(42, 76, 26, 20), FUR)
    s.paint(s.ellipse(24, 90, 9, 4.5), FUR2)
    leaf(s, 76, 66, 5, 11, -0.4)
    s.paint(s.ellipse(70, 72, 6, 6), FUR)
    ear(s, 38, 40, 11); ear(s, 76, 36, 10)
    s.paint(s.ellipse(56, 54, 21, 17), FUR)
    gumnut(s, 56, 32, 9, 6)
    s.eye(70, 54, 3, 5, iris='#4a9a3a', look=1)
    s.paint(s.ellipse(76, 60, 3, 4), NOSE)
    return s.finish()


def bellowala_back():
    s = Sprite()
    s.paint(s.ellipse(44, 72, 26, 24), FUR)
    for i in range(2):
        bark_plate(s, 18 + i * 2, 54 + i * 6, 34 + i * 2, 62 + i * 6, BARK2 if i else BARK)
    s.paint(s.tube([(24, 64), (20, 84)], 6, 6), FUR)
    for i in range(3):
        bark_plate(s, 13, 70 + i * 5, 28, 76 + i * 5, BARK2 if i % 2 else BARK)
    s.paint(s.poly([(70, 52), (90, 48), (92, 66), (82, 80), (70, 70)], bevel=3), LEAF2)   # shield on the far arm
    s.paint(s.poly([(73, 55), (87, 52), (88, 65), (81, 75), (73, 68)], bevel=2), LEAF, line=False)
    for i in range(9):
        a = math.radians(i * 20)
        leaf(s, 56 + math.cos(a) * 17, 52 + math.sin(a) * 4, 3, 6, math.cos(a) * .9, LEAF if i % 2 else LEAF2)
    ear(s, 40, 30, 11, LEAF); ear(s, 76, 26, 10, LEAF)
    s.paint(s.ellipse(58, 42, 19, 15), FUR)
    gumnut(s, 58, 21, 10, 7)
    s.eye(72, 42, 4, 4, iris='#4a9a3a', look=1, style='fierce')
    return s.finish()


def koalossus_back():
    s = Sprite()
    s.paint(s.ellipse(48, 66, 36, 30), FUR)
    for row in range(4):
        for c in range(5):
            x = 14 + c * 13 + row * 3
            bark_plate(s, x, 44 + row * 8, x + 14, 54 + row * 8, BARK if (row + c) % 2 else BARK2)
    for tx, top, col in [(30, 18, LEAF2), (48, 10, LEAF), (64, 20, LEAF2)]:
        s.paint(s.tube([(tx, 46), (tx + 1, top + 8)], 2.6, 1.8), TRUNK)
        for dx, dy, r in [(0, 0, 9), (-7, 4, 7), (7, 4, 7), (0, -6, 6)]:
            s.paint(s.ellipse(tx + dx, top + 6 + dy, r, r * .85), col)
    s.paint(s.tube([(16, 60), (10, 86)], 9, 9.5), FUR)
    s.paint(s.poly([(0, 86), (6, 80), (18, 80), (22, 88), (18, 96), (2, 96)], bevel=3), ROCK)
    ear(s, 70, 26, 9, LEAF2); ear(s, 90, 24, 7, LEAF2)
    s.paint(s.ellipse(80, 38, 13, 12), FUR)
    s.eye(88, 38, 4, 3, iris='#5ab040', look=1, style='fierce')
    return s.finish()


FRONT = {'gumjo': gumjo_front, 'bellowala': bellowala_front, 'koalossus': koalossus_front}
BACK = {'gumjo': gumjo_back, 'bellowala': bellowala_back, 'koalossus': koalossus_back}
