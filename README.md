# Australis

A fan-made Pokémon region inspired by Australia, with a playable 2.5D diorama of its first two towns.

Australis is a road trip clockwise around the country. You start in Wattle Town on the Darling Downs, take on eight gyms, and end at Glasshouse Sanctuary, a wildlife sanctuary that doubles as the Pokémon League. The villains are Team Snare, a poaching syndicate quietly protected by a corrupt government. The heroes are the people who heal and protect Pokémon.

## Play it

The game runs in any modern browser. Open `index.html`, or turn on GitHub Pages (see below) for a shareable link.

| Action | Phone | Keyboard |
| --- | --- | --- |
| Walk | D-pad | Arrow keys or WASD |
| Talk or interact | A button | Space, Enter or Z |

Things to try:

- Talk to the Professor, your rival, Gumjo and the signs in **Wattle Town**.
- Walk through the wheat field for a chance at a wild Warblet or Burrowlet (Possnack at night).
- Head east over the creek bridge to reach **Bloomridge**, the garden town on the range.
- Chase off the Team Snare grunt at the lookout to rescue Sugrette, who then follows you.
- Take the stone stairs down the cliff into the green valley and its corn field.
- Switch between Day, Golden hour and Night at the top of the screen.

## Art style

The towns are low-poly 3D scenes with pixel-art textures. Trainers, NPCs and Pokémon are small low-poly models, while trees, crops and flowers are pixel-art sprites, giving an HD-2D look. The camera is locked at a Pokémon-style angle and follows the player. Everything is drawn in code with [three.js](https://threejs.org/) r128; there are no image files.

## Project layout

```
index.html              Page markup: the stage, location plate, dialogue box and controls
css/style.css           Styles for the on-screen interface
js/core.js              Renderer, scene, camera and shared setup
js/textures.js          Pixel-art textures and sprites, drawn on canvases
js/builders.js          Helpers for terrain, buildings, props, lamps and sprites
js/characters.js        Low-poly models for trainers, NPCs and Pokémon
js/world.js             Walkable grids, NPCs, talk spots and locations
js/towns/wattle-town.js Wattle Town
js/towns/bloomridge.js  Bloomridge and the valley below the escarpment
js/game.js              Player, follower, dialogue, movement, lighting, camera and the main loop
docs/design-bible.md    The full region design: map, story, legendaries, starters, gyms and teams
docs/pokedex.md         The 150-entry regional Pokédex
```

The scripts are plain JavaScript loaded in the order listed in `index.html`, so no build step is needed.

### Adding a town

1. Create `js/towns/<name>.js` using `newLoc(...)`, and build its scene inside the location's group (see `bloomridge.js`).
2. Mark blocked tiles, heights, tall grass and talk spots on its grid.
3. Add an `exit` rule in a neighbouring town that sends the player there.
4. Add the script to `index.html` before `js/game.js`, and register the town in `LOCS` in `game.js`.

## Host it with GitHub Pages

1. In this repo, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/ (root)**.
3. After a minute or two the game is live at `https://<your-username>.github.io/<repo-name>/`.

## Notes

This is a non-commercial fan project. Pokémon is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc. All creatures, characters, towns and art here are original designs.

The region's legendary serpent is an original creature inspired by the idea of a great serpent; it deliberately does not depict the Rainbow Serpent, a sacred ancestral being for many First Nations peoples. The Red Centre likewise uses a fictional giant rock instead of Uluru.
