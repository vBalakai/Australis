# Australis

A fan-made Pokémon region inspired by Australia, with a playable 2.5D game covering the start of the journey: Wattle Town, Bloomridge and the first three gym cities.

Australis is a road trip clockwise around the country. You start in Wattle Town on the Darling Downs, take on eight gyms, and end at Glasshouse Sanctuary, a wildlife sanctuary that doubles as the Pokémon League. The villains are Team Snare, a poaching syndicate quietly protected by a corrupt government. The heroes are the people who heal and protect Pokémon.

## Play it

The game runs in any modern browser. Open `index.html`, or turn on GitHub Pages (see below) for a shareable link.

| Action | Phone | Keyboard |
| --- | --- | --- |
| Walk | D-pad | Arrow keys or WASD |
| Run | Hold B | Hold Shift or X |
| Talk, interact or choose | A button | Space, Enter or Z |
| Back out of a menu | B | Escape |

### The journey so far

1. **Wattle Town** (Darling Downs): talk to the Professor, your rival and Gumjo. The wheat field is tall grass.
2. **Route 1 → Bloomridge** (Toowoomba): walk east over the creek bridge. At the lookout, chase off the Team Snare grunt to rescue Sugrette, who then follows you.
3. **Route 2 → Riverbend City** (Brisbane): take the stairs down the cliff and walk east through the valley. Riverbend has the river, a steel bridge, Queenslander houses and a jacaranda park.
4. **Riverbend Gym**: Jacara's botanic glasshouse. Win the **Jacaranda Badge**.
5. **Australis Air**: walk into the airport terminal to fly. Each badge unlocks the next flight, and you can fly back to any city you've reached.
6. **Coralport** (Cairns): the esplanade, lagoon, marina and reef. Walk to the end of the jetty and board Marlee's glass-bottomed boat for the **Reef Badge**.
7. **Stormhaven** (Darwin): stilt houses, a crocodile creek, spear-grass encounters and wet-season storms. Ray's storm observatory awards the **Thunderhead Badge**.

Gym battles are short story scenes for now, until a battle system is built. Switch between Day, Golden hour and Night at the top of the screen.

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
js/world.js             Walkable grids, NPCs, talk spots, locations, badges, doors, flights and gym leaders
js/towns/wattle-town.js Wattle Town
js/towns/bloomridge.js  Bloomridge and the valley below the escarpment (Route 2)
js/props.js             Shared props: Queenslanders, palms, boats, towers, airports, gym buildings, interiors
js/towns/riverbend.js   Riverbend City and Jacara's glasshouse gym
js/towns/coralport.js   Coralport and Marlee's glass-bottomed boat gym
js/towns/stormhaven.js  Stormhaven, its storms, and Ray's storm observatory gym
js/game.js              Player, follower, dialogue, menus, movement, flights, lighting, camera and the main loop
docs/design-bible.md    The full region design: map, story, legendaries, starters, gyms and teams
docs/pokedex.md         The 150-entry regional Pokédex
```

The scripts are plain JavaScript loaded in the order listed in `index.html`, so no build step is needed.

### Adding a town

1. Create `js/towns/<name>.js` using `newLoc(...)`, and build its scene inside the location's group (see `riverbend.js`). `newLoc` registers the town automatically.
2. Mark blocked tiles, heights, tall grass and talk spots on its grid, and add `door(...)` entries for buildings.
3. Connect it: an `exit` rule in a neighbouring town, or an entry in `AIRPORTS` in `world.js` plus an `airport` spawn tile.
4. Add the script to `index.html` before `js/game.js`.

## Host it with GitHub Pages

1. In this repo, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/ (root)**.
3. After a minute or two the game is live at `https://<your-username>.github.io/<repo-name>/`.

## Notes

This is a non-commercial fan project. Pokémon is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc. All creatures, characters, towns and art here are original designs.

The region's legendary serpent is an original creature inspired by the idea of a great serpent; it deliberately does not depict the Rainbow Serpent, a sacred ancestral being for many First Nations peoples. The Red Centre likewise uses a fictional giant rock instead of Uluru.
