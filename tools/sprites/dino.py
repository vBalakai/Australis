"""The Kindrill line: frilled dinosaurs, the all-rounders. Fronts face left toward your side; backs are three-quarter rear views."""
import math
from pixel import Sprite, ramp

ORA = ramp('#f0782c', 0.03)
ORA2 = ramp('#c64a1c', 0.03)
BELLY = ramp('#ffd27c', 0.02)
FRILL = ramp('#e2402a', 0.03)
FRILL2 = ramp('#f2902c', 0.03)
FLAME = ramp('#ffc23a', 0.04)
PYR = ramp('#8a2a1e', 0.03)
PYR2 = ramp('#5a1a14', 0.03)
BONE = ramp('#efe2c8', 0.02)
SHELL = ramp('#f6efe0', 0.01)
GOLD = '#ffe860'
SPARK = '#fff6c0'
EMBER = '#ff8a20'


def flame(s, x, y, size, ang=-1.2):
    """A teardrop flame pointing along ang."""
    tx, ty = x + math.cos(ang) * size * 2.2, y + math.sin(ang) * size * 2.2
    s.paint(s.union(s.ellipse(x, y, size, size), s.poly([(x - size * .8, y), (x + size * .8, y), (tx, ty)], bevel=1)), FLAME)
    s.paint(s.ellipse(x, y + size * .2, size * .5, size * .55), ramp('#fff4b0', 0.0), line=False, flat=3)


def fan(s, cx, cy, n, a0, a1, r0, r1, w, tones, tips=None, bolts=False, bone=False):
    """A frill: plates radiating from (cx, cy) between angles a0 and a1 (degrees)."""
    s.anchors.setdefault('frill', (round(cx), round(cy)))
    for i in range(n):
        a = math.radians(a0 + (a1 - a0) * i / max(1, n - 1))
        bx, by = cx + math.cos(a) * r0, cy + math.sin(a) * r0
        tx, ty = cx + math.cos(a) * r1, cy + math.sin(a) * r1
        nx, ny = -math.sin(a) * w, math.cos(a) * w
        tone = tones[i % len(tones)]
        s.paint(s.poly([(bx - nx * .6, by - ny * .6), (bx + nx * .6, by + ny * .6), (tx + nx * .45, ty + ny * .45), (tx + math.cos(a) * w * .6, ty + math.sin(a) * w * .6), (tx - nx * .45, ty - ny * .45)], bevel=1.6), tone)
        if bone:
            ex, ey = tx + math.cos(a) * w * 1.6, ty + math.sin(a) * w * 1.6
            s.paint(s.poly([(tx - nx * .35, ty - ny * .35), (tx + nx * .35, ty + ny * .35), (ex, ey)], bevel=1), BONE)
        if tips:
            flame(s, tx + math.cos(a) * w * .6, ty + math.sin(a) * w * .6, w * .45, a)
        if bolts and i % 2 == 0:
            mx, my = cx + math.cos(a) * (r0 + (r1 - r0) * .35), cy + math.sin(a) * (r0 + (r1 - r0) * .35)
            px, py = mx, my
            for k in range(4):                                   # a zigzag of lightning along the plate
                step = (r1 - r0) * .14
                qx = px + math.cos(a) * step + nx * (.35 if k % 2 == 0 else -.35)
                qy = py + math.sin(a) * step + ny * (.35 if k % 2 == 0 else -.35)
                s.line(px, py, qx, qy, GOLD)
                px, py = qx, qy


def stripes(s, pts, tone):
    for x0, y0, x1, y1 in pts:
        s.line(x0, y0, x1, y1, tone)


def claws(s, x, y, n=3, d=-1, tone=BONE):
    for i in range(n):
        s.px(x + d * 1 + i * 2, y, tone[3]); s.px(x + d * 2 + i * 2, y + 1, tone[2])


# ---------------- fronts ----------------
def kindrill_front():
    s = Sprite()
    s.paint(s.tube([(58, 78), (72, 76), (80, 66)], 5, 2.2), ORA)          # tail curling up behind
    flame(s, 81, 62, 3.5, -1.3)
    s.paint(s.ellipse(58, 79, 6, 6), ORA2)
    s.paint(s.ellipse(50, 68, 13, 13), ORA)
    s.paint(s.ellipse(47, 72, 8, 9), BELLY, line=False)
    stripes(s, [(56, 60, 60, 63), (59, 66, 62, 69)], ORA2[1])
    fan(s, 50, 50, 4, 160, 260, 5, 13, 3.6, [FRILL, FRILL2])               # folded frill behind the head
    s.paint(s.ellipse(44, 48, 15, 13), ORA)
    s.paint(s.ellipse(32, 54, 9, 6.5), ORA)                                 # snout
    s.paint(s.ellipse(34, 57, 7, 3), BELLY, line=False)
    s.line(25, 56, 36, 57, ORA2[0]); s.px(30, 58, '#ffffff')
    s.px(26, 52, ORA2[0])
    s.paint(s.poly([(36, 34), (40, 31), (44, 34), (48, 30), (52, 34), (56, 32), (58, 38), (36, 39)], bevel=1.6), SHELL)   # eggshell cap
    s.eye(40, 45, 4, 5, iris='#ffa020', look=-1)
    s.eye(53, 44, 4, 5, iris='#ffa020', look=-1)
    stripes(s, [(52, 51, 55, 54), (56, 49, 58, 52)], ORA2[1])
    s.paint(s.tube([(42, 64), (37, 67)], 2.2, 1.8), ORA)
    s.paint(s.ellipse(43, 80, 6, 5.5), ORA)
    s.paint(s.ellipse(41, 85, 6, 2.6), ORA2)
    claws(s, 37, 86)
    s.paint(s.ellipse(58, 86, 5, 2.4), ORA2)
    claws(s, 55, 87)
    return s.finish()


def frillblaze_front():
    s = Sprite()
    s.paint(s.tube([(62, 64), (78, 58), (90, 44)], 6, 2.4), ORA)           # long tail sweeping up
    flame(s, 90, 41, 4, -1.4)
    for i in range(4):
        s.px(70 + i * 4, 58 - i * 3, ORA2[1])
    s.paint(s.tube([(62, 70), (66, 82), (62, 90)], 5, 3), ORA2)             # far leg
    s.paint(s.ellipse(56, 58, 13, 17, -0.45), ORA)                          # lean body
    s.paint(s.ellipse(52, 62, 7, 12, -0.45), BELLY, line=False)
    for i in range(5):                                                       # spiked back ridge
        x, y = 60 + i * 3, 42 + i * 4
        s.paint(s.poly([(x - 2, y + 2), (x + 3, y + 1), (x + 5, y - 4)], bevel=1), ORA2)
    stripes(s, [(62, 52, 66, 56), (64, 60, 68, 64), (60, 66, 63, 70)], ORA2[1])
    fan(s, 38, 30, 7, 150, 300, 6, 22, 5, [FRILL, FRILL2], tips=True)      # half-open blazing frill
    s.paint(s.tube([(50, 46), (40, 34)], 6, 5.5), ORA)                       # neck
    s.paint(s.ellipse(37, 30, 11, 9.5), ORA)
    s.paint(s.poly([(30, 30), (16, 31), (12, 35), (16, 39), (30, 38)], bevel=2.5), ORA)   # long snout
    s.line(14, 36, 30, 36, ORA2[0])
    for x in (17, 21, 25):
        s.px(x, 37, '#ffffff')
    s.px(15, 32, ORA2[0])
    s.eye(33, 27, 5, 3, iris='#ffd030', look=-1, style='fierce')
    s.eye(42, 26, 4, 3, iris='#ffd030', look=-1, style='fierce')
    s.paint(s.tube([(48, 52), (40, 58), (36, 55)], 2.4, 2), ORA)                 # raptor arm
    claws(s, 33, 55)
    s.paint(s.ellipse(48, 72, 8, 10, -0.2), ORA)                            # near leg: thigh, shin, foot
    s.paint(s.tube([(48, 78), (52, 86), (46, 90)], 4, 3), ORA2)
    s.paint(s.ellipse(43, 91, 7, 2.6), ORA2)
    s.paint(s.poly([(36, 90), (39, 86), (40, 91)], bevel=1), BONE)          # sickle claw
    claws(s, 41, 92)
    return s.finish()


def pyragon_front():
    s = Sprite()
    s.paint(s.tube([(66, 74), (82, 72), (92, 60)], 8, 3), PYR)             # tail with a lightning-bolt tip
    s.paint(s.poly([(88, 58), (95, 50), (92, 56), (96, 56), (88, 66), (91, 59)], bevel=1), ramp('#ffe24a', 0.02))
    fan(s, 46, 36, 11, 140, 325, 10, 27, 6.5, [PYR, PYR2], bolts=True, bone=True)   # the great bony frill
    s.paint(s.ellipse(64, 86, 9, 7), PYR2)
    s.paint(s.ellipse(52, 62, 24, 23), PYR)
    for i in range(5):                                                      # armoured belly plates with glowing seams
        y = 52 + i * 6
        s.paint(s.ellipse(48, y, 13 - abs(i - 2) * 1.6, 3), BELLY, line=False, flat=1 if i % 2 else 2)
        s.line(37 + abs(i - 2) * 2, y + 3, 59 - abs(i - 2) * 2, y + 3, EMBER)
    for i in range(4):                                                      # shoulder scutes
        s.paint(s.poly([(64 + i * 4, 42 + i * 3), (70 + i * 4, 40 + i * 3), (71 + i * 4, 47 + i * 3), (64 + i * 4, 48 + i * 3)], bevel=1.4), PYR2)
    s.paint(s.ellipse(44, 38, 15, 12), PYR)
    s.paint(s.poly([(32, 38), (14, 40), (10, 46), (14, 50), (34, 48)], bevel=3), PYR)    # heavy snout
    s.paint(s.poly([(14, 50), (32, 50), (30, 54), (16, 54)], bevel=1.5), PYR2)           # lower jaw, open
    for x in (16, 20, 24, 28):
        s.paint(s.poly([(x, 49), (x + 2, 49), (x + 1, 52)], bevel=.6), BONE, line=False)
    s.paint(s.poly([(14, 41), (17, 40), (10, 32)], bevel=1), BONE)          # nose horn
    s.paint(s.poly([(38, 30), (42, 29), (32, 16)], bevel=1.2), BONE)        # brow horns
    s.paint(s.poly([(49, 29), (53, 30), (52, 15)], bevel=1.2), BONE)
    s.eye(37, 35, 5, 3, iris='#ffe040', look=-1, style='fierce')
    s.eye(50, 34, 4, 3, iris='#ffe040', look=-1, style='fierce')
    s.paint(s.tube([(36, 56), (28, 62), (24, 60)], 3.4, 3), PYR)                 # small clawed arm
    claws(s, 20, 60)
    s.paint(s.ellipse(40, 82, 11, 10), PYR)
    s.paint(s.ellipse(38, 91, 10, 3.5), PYR2)
    claws(s, 30, 92, 4)
    return s.finish()


# ---------------- backs ----------------
def kindrill_back():
    s = Sprite()
    s.paint(s.tube([(40, 84), (22, 86), (12, 74)], 6, 2.6), ORA)
    flame(s, 11, 70, 4, -1.6)
    s.paint(s.ellipse(48, 72, 20, 18), ORA)
    stripes(s, [(40, 62, 46, 66), (46, 58, 52, 62), (52, 66, 58, 70)], ORA2[1])
    fan(s, 58, 52, 4, 120, 230, 5, 15, 4, [FRILL, FRILL2])
    s.paint(s.ellipse(62, 48, 16, 14), ORA)
    s.paint(s.poly([(52, 34), (56, 31), (60, 34), (64, 30), (68, 34), (72, 32), (74, 38), (52, 39)], bevel=1.6), SHELL)
    s.paint(s.ellipse(76, 54, 8, 6), ORA)
    s.eye(70, 46, 3, 5, iris='#ffa020', look=1)
    s.paint(s.ellipse(30, 90, 8, 4), ORA2)
    return s.finish()


def frillblaze_back():
    s = Sprite()
    s.paint(s.tube([(40, 80), (20, 86), (6, 76)], 8, 3), ORA)
    flame(s, 5, 72, 4.5, -1.7)
    s.paint(s.ellipse(44, 66, 20, 22, 0.3), ORA)
    for i in range(6):
        x, y = 36 + i * 4, 82 - i * 6
        s.paint(s.poly([(x - 3, y + 2), (x + 3, y + 1), (x + 1, y - 6)], bevel=1), ORA2)
    stripes(s, [(30, 60, 36, 64), (28, 70, 34, 74), (52, 56, 58, 58)], ORA2[1])
    s.paint(s.tube([(52, 52), (64, 38)], 7, 6), ORA)
    s.paint(s.ellipse(68, 34, 11, 9.5), ORA)
    s.paint(s.poly([(74, 32), (88, 30), (92, 34), (88, 38), (74, 38)], bevel=2), ORA)
    fan(s, 62, 40, 7, 175, 300, 5, 21, 5, [FRILL2, FRILL], tips=True)
    s.eye(74, 31, 4, 3, iris='#ffd030', look=1, style='fierce')
    s.paint(s.ellipse(26, 88, 10, 5), ORA2)
    return s.finish()


def pyragon_back():
    s = Sprite()
    s.paint(s.tube([(40, 84), (18, 88), (4, 76)], 10, 4), PYR)
    s.paint(s.poly([(0, 74), (6, 64), (4, 72), (9, 72), (1, 84), (3, 76)], bevel=1), ramp('#ffe24a', 0.02))
    fan(s, 64, 34, 10, 150, 330, 10, 30, 7, [PYR, PYR2], bolts=True, bone=True)
    s.paint(s.ellipse(46, 64, 30, 28), PYR)
    for i in range(6):                                                       # a spine of armoured scutes
        x, y = 36 + i * 5, 84 - i * 8
        s.paint(s.poly([(x - 6, y + 3), (x + 5, y + 1), (x + 3, y - 7)], bevel=1.6), PYR2)
    for k in range(3):                                                       # glowing seams down the flanks
        s.line(22 + k * 3, 58 + k * 9, 30 + k * 3, 64 + k * 9, EMBER)
        s.line(58 + k * 3, 62 + k * 8, 66 + k * 3, 58 + k * 8, EMBER)
    s.paint(s.ellipse(66, 32, 14, 12), PYR)
    s.paint(s.poly([(76, 30), (90, 30), (94, 36), (90, 40), (76, 40)], bevel=2.5), PYR)
    s.paint(s.poly([(62, 22), (66, 21), (72, 8)], bevel=1.2), BONE)
    s.paint(s.poly([(72, 23), (76, 24), (84, 12)], bevel=1.2), BONE)
    s.eye(76, 30, 4, 3, iris='#ffe040', look=1, style='fierce')
    s.paint(s.ellipse(24, 86, 12, 9), PYR2)
    return s.finish()


FRONT = {'kindrill': kindrill_front, 'frillblaze': frillblaze_front, 'pyragon': pyragon_front}
BACK = {'kindrill': kindrill_back, 'frillblaze': frillblaze_back, 'pyragon': pyragon_back}
