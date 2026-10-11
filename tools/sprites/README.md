# Battle sprite tool

Draws the starters' 96x96 battle sprites as pixel art, in the style of the Black and White games.

- `pixel.py`: the drawing kit. Shapes (ellipses, polygons, tapered tubes) are shaded in flat bands from hand-picked colour ramps, lit from the top left. Overlapping shapes get a dark inner line, the figure gets a crisp outline, and details such as eyes and markings are placed pixel by pixel.
- `koala.py`, `dino.py`, `platypus.py`: one file per line, with a front sprite (facing left, toward your side) and a back sprite (three-quarter rear view) for each form.
- `build.py`: exports every sprite to `assets/sprites/` along with `sprites.json`, which lists anchor points the battle effects use (bill muzzles, quill tips, frill centres and shields).
- `preview.py`: saves an enlarged contact sheet, e.g. `python3 preview.py sheet.png koala dino platypus`.

Needs Python 3 with numpy, scipy and Pillow. After editing a sprite, run `python3 build.py`.
