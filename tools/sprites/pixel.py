"""Australis pixel-art sprite tool.

Sprites are drawn as layered shapes on a small canvas (96x96, like Black and White battle sprites).
Each shape gets lit from the top left and shaded in flat bands from a hand-picked colour ramp,
overlapping shapes get a dark inner line, and the finished figure gets a crisp outline.
Small details (eyes, markings, glints) are placed pixel by pixel.
"""
import colorsys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

SIZE = 96
OUTLINE = (28, 22, 36)
LIGHT = np.array([-0.55, -0.7, 0.62])
LIGHT = LIGHT / np.linalg.norm(LIGHT)


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def ramp(base, hue_shift=0.03, dark=None):
    """Five tones, darkest to lightest. Shadows lean cooler and lights warmer, as pixel artists do."""
    r, g, b = [c / 255 for c in hexrgb(base)]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    tones = []
    for dv, ds, dh in [(-0.48, 0.12, hue_shift * 1.6), (-0.22, 0.08, hue_shift), (0, 0, 0), (0.12, -0.08, -hue_shift), (0.22, -0.16, -hue_shift * 1.4)]:
        hh = (h + dh) % 1
        ss = min(1, max(0, s + ds))
        vv = min(1, max(0, v + dv))
        tones.append(tuple(int(round(c * 255)) for c in colorsys.hsv_to_rgb(hh, ss, vv)))
    if dark:
        tones[0] = hexrgb(dark)
    return tones


class Sprite:
    def __init__(self, size=SIZE):
        self.n = size
        self.rgb = np.zeros((size, size, 3), np.uint8)
        self.fig = np.zeros((size, size), bool)
        self.yy, self.xx = np.mgrid[0:size, 0:size] + 0.5
        self.anchors = {}

    # ---------- shapes: each returns (mask, height in pixels) ----------
    def ellipse(self, cx, cy, rx, ry, rot=0.0):
        x, y = self.xx - cx, self.yy - cy
        c, s = np.cos(rot), np.sin(rot)
        u, v = (x * c + y * s) / rx, (-x * s + y * c) / ry
        d2 = u * u + v * v
        m = d2 <= 1
        hgt = np.sqrt(np.clip(1 - d2, 0, 1)) * min(rx, ry)
        return m, hgt

    def poly(self, pts, bevel=3.0):
        im = Image.new('L', (self.n, self.n), 0)
        ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255)
        m = np.array(im) > 0
        d = ndimage.distance_transform_edt(m)
        t = np.clip(d / bevel, 0, 1)
        hgt = np.sqrt(1 - (1 - t) ** 2) * bevel
        return m, hgt

    def tube(self, pts, r0, r1=None):
        """A tapered tube along a polyline, round in cross-section."""
        r1 = r0 if r1 is None else r1
        pts = np.array(pts, float)
        segs = len(pts) - 1
        best = np.full((self.n, self.n), 1e9)
        rad = np.zeros((self.n, self.n))
        total = sum(np.linalg.norm(pts[i + 1] - pts[i]) for i in range(segs))
        acc = 0
        for i in range(segs):
            a, b = pts[i], pts[i + 1]
            ab = b - a
            L = np.linalg.norm(ab)
            t = np.clip(((self.xx - a[0]) * ab[0] + (self.yy - a[1]) * ab[1]) / (L * L), 0, 1)
            px, py = a[0] + ab[0] * t, a[1] + ab[1] * t
            dist = np.hypot(self.xx - px, self.yy - py)
            k = (acc + t * L) / total
            r = r0 + (r1 - r0) * k
            closer = dist / r < best
            best = np.where(closer, dist / r, best)
            rad = np.where(closer, r, rad)
            acc += L
        m = best <= 1
        hgt = np.sqrt(np.clip(1 - best ** 2, 0, 1)) * rad
        return m, hgt

    def union(self, *shapes):
        m = shapes[0][0].copy(); h = shapes[0][1].copy()
        for mm, hh in shapes[1:]:
            m |= mm; h = np.maximum(h, np.where(mm, hh, 0))
        return m, h

    # ---------- painting ----------
    def paint(self, shape, tones, line=True, flat=None, light=None, smooth=True, band=(0.08, 0.5, 0.86)):
        """Shade a shape in flat bands and lay it over the figure."""
        m, hgt = shape
        if not m.any():
            return m
        gy, gx = np.gradient(hgt)
        nz = np.ones_like(hgt)
        nrm = np.sqrt(gx * gx + gy * gy + nz)
        L = LIGHT if light is None else light
        inten = (-gx * L[0] - gy * L[1] + nz * L[2]) / nrm
        idx = np.full(hgt.shape, 2)
        idx[inten < band[0]] = 1
        idx[(inten >= band[1])] = 3
        idx[(inten >= band[2])] = 4
        if flat is not None:
            idx[:] = flat
        if smooth:
            idx = self._mode_filter(idx, m)
        col = np.array(tones)[idx]
        under = self.fig.copy()
        self.rgb[m] = col[m]
        if line:
            edge = m & ~ndimage.binary_erosion(m)
            # inner line art only where this shape sits on top of something already drawn
            near = ndimage.binary_dilation(under & ~m)
            self.rgb[edge & near] = tones[0]
        self.fig |= m
        return m

    def _mode_filter(self, idx, m):
        out = idx.copy()
        for _ in range(1):
            pad = np.pad(out, 1, mode='edge')
            stack = np.stack([pad[dy:dy + self.n, dx:dx + self.n] for dy in range(3) for dx in range(3)])
            counts = np.stack([(stack == k).sum(0) for k in range(5)])
            mode = counts.argmax(0)
            single = counts[out, np.arange(self.n)[:, None], np.arange(self.n)[None, :]] <= 2
            out = np.where(m & single, mode, out)
        return out

    def px(self, x, y, c, figure=True):
        x, y = int(round(x)), int(round(y))
        if 0 <= x < self.n and 0 <= y < self.n:
            self.rgb[y, x] = hexrgb(c) if isinstance(c, str) else c
            if figure:
                self.fig[y, x] = True

    def line(self, x0, y0, x1, y1, c):
        x0, y0, x1, y1 = int(round(x0)), int(round(y0)), int(round(x1)), int(round(y1))
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            self.px(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    def fill(self, mask, c):
        self.rgb[mask] = hexrgb(c) if isinstance(c, str) else c
        self.fig |= mask

    def eye(self, x, y, w=3, h=4, iris=None, look=-1, style='cute'):
        """Pixel eyes. cute: dark oval with a glint. fierce: white with a dark pupil and a heavy lid."""
        if style == 'cute':
            m, _ = self.ellipse(x, y, w / 2 + .2, h / 2 + .2)
            self.fill(m, '#1a1420')
            if iris:
                for i in range(max(1, w - 1)):
                    self.px(int(x - w / 2 + 1 + i), int(y + h / 2 - 1), iris)
            self.px(int(x - w / 2 + 1 + (1 if look > 0 else 0)), int(y - h / 2 + 1), '#ffffff')
        else:
            m, _ = self.ellipse(x, y, w / 2 + .3, h / 2 + .2)
            self.fill(m, '#f8f4ec')
            px_ = int(x + look * (w / 4))
            for dy in range(-1, h // 2):
                self.px(px_, int(y + dy), iris or '#1a1420')
                self.px(px_ + (1 if look < 0 else -1), int(y + dy), iris or '#1a1420')
            self.px(px_, int(y), '#1a1420')
            for i in range(-int(w / 2) - 1, int(w / 2) + 2):
                self.px(int(x + i), int(y - h / 2), '#1a1420')

    # ---------- finishing ----------
    def finish(self, outline=OUTLINE):
        ring = ndimage.binary_dilation(self.fig) & ~self.fig
        self.rgb[ring] = outline
        alpha = (self.fig | ring).astype(np.uint8) * 255
        img = Image.fromarray(np.dstack([self.rgb, alpha]), 'RGBA')
        img.anchors = self.anchors
        return img


def sheet(images, scale=4, cols=4, bg=(236, 232, 220), labels=None):
    w, h = images[0].size
    rows = (len(images) + cols - 1) // cols
    out = Image.new('RGB', (cols * w * scale + (cols + 1) * 8, rows * h * scale + (rows + 1) * 8), bg)
    for i, im in enumerate(images):
        big = im.resize((w * scale, h * scale), Image.NEAREST)
        x, y = 8 + (i % cols) * (w * scale + 8), 8 + (i // cols) * (h * scale + 8)
        tile = Image.new('RGB', big.size, (200, 230, 190))
        tile.paste(big, (0, 0), big)
        out.paste(tile, (x, y))
    return out
