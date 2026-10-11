# Australis

A fan-made Pokémon region inspired by Australia, with a playable 2.5D game covering the start of the journey: Wattle Town, Bloomridge, the first three gym cities and the routes around them.

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

1. **Wattle Town** (Darling Downs): walk into the Professor's lab and choose your partner: Gumjo, Kindrill or Puggly. Your rival picks the one that beats yours. Your partner follows you from then on; face it and press A to check on it.
2. **Route 1 → Bloomridge** (Toowoomba): walk east over the creek bridge. At the lookout, chase off the Team Snare grunt to rescue Sugrette, who joins your team.
3. **Route 2 → Riverbend City** (Brisbane): a big city on a winding river. Explore the botanic gardens, the Queenslanders and cliff lookout on Paddington Hill, the CBD towers and City Hall, and South Bank with its city beach, lagoon and big wheel. Jacara's glasshouse gym awards the **Jacaranda Badge**.
4. **Route 3, the Surf Coast**: east of Riverbend. Coastal heath and dune grass full of wild Pokémon, a surf club, surfers and a lighthouse on the headland.
5. **Australis Air**: walk into any airport terminal to fly. Each badge unlocks the next flight, and you can fly back to any city you've reached.
6. **Coralport** (Cairns): a curved bay with an esplanade boardwalk, a swimming lagoon, a marina, a mangrove boardwalk and night markets. Follow the long jetty out to Marlee's glass-bottomed boat for the **Reef Badge**. Your partner evolves after this battle.
7. **Canopy Forest**: north of Coralport. Rainforest tracks, ferns full of wild Pokémon, a curtain fig, a cassowary and a waterfall where glow-worms shine at night.
8. **Stormhaven** (Darwin): a clifftop town above a sunset beach market, with a high bridge over a crocodile creek, a wharf and storms. Ray's headland observatory awards the **Thunderhead Badge**.
9. **Billabong Wetlands**: east of Stormhaven. A boardwalk across a billabong full of lily pads, a bird hide, dancing brolga and crocodiles.

Gym battles are short story scenes for now, until a battle system is built. Switch between Day, Golden hour and Night at the top of the screen. See all nine starter designs on the [starter gallery](starters.html), and the pixel-art battle scenes for all nine on the [battle preview](battle.html).

## Art style

The towns are low-poly 3D scenes with pixel-art textures. Trainers, NPCs and Pokémon are small low-poly models, while trees, crops and flowers are pixel-art sprites, giving an HD-2D look. The camera is locked at a Pokémon-style angle and follows the player. Everything is drawn in code with [three.js](https://threejs.org/) r128; there are no image files.

## Project layout

```
index.html                Page markup: the stage, location plate, dialogue box and controls
starters.html             Gallery of the nine starter models
battle.html               Pixel-art battle preview: battle models, fields, stats and signature moves
css/style.css             Styles for the on-screen interface
js/core.js                Renderer, scene, camera and shared setup
js/textures.js            Pixel-art textures and sprites, drawn on canvases
js/builders.js            Helpers for terrain, buildings, props, lamps, sprites and fading tall buildings
js/characters.js          Low-poly models for trainers and NPCs
js/starters.js            The nine starter models (overworld), your partner, evolution and your team
js/mon-designs.js         Starter designs, built as overworld models and detailed battle models
js/world.js               Walkable grids, NPCs, talk spots, locations, badges, doors, flights and gym leaders
js/props.js               Shared props: Queenslanders, palms, boats, towers, airports, gym buildings, interiors
js/mapkit.js              The map kit: paint a map as characters and build soft-edged 3D ground from it
js/towns/wattle-town.js   Wattle Town
js/towns/lab.js           The Professor's lab, where you choose your starter
js/towns/bloomridge.js    Bloomridge and the valley below the escarpment (Route 2)
js/towns/riverbend.js     Riverbend City and Jacara's glasshouse gym
js/towns/route3.js        Route 3, the Surf Coast
js/towns/coralport.js     Coralport and Marlee's glass-bottomed boat gym
js/towns/canopy.js        Canopy Forest
js/towns/stormhaven.js    Stormhaven, its storms, and Ray's storm observatory gym
js/towns/billabong.js     Billabong Wetlands
js/game.js                Player, partner, dialogue, menus, movement, flights, lighting, camera and the main loop
docs/design-bible.md      The full region design: map, story, legendaries, starters, gyms and teams
docs/pokedex.md           The 150-entry regional Pokédex
docs/starters.md          Starter design sheet
```

The scripts are plain JavaScript loaded in the order listed in `index.html`, so no build step is needed.

### Adding a town with the map kit

Bigger maps are painted with the map kit in `js/mapkit.js`. A map is two layers of characters the same size as the town: terrain (grass, sand, roads, water, raised terraces, stairs, bridges) and objects (trees, tall grass, rocks, lamps, buildings). The legend is at the top of `mapkit.js`.

1. Create `js/towns/<name>.js`. Make a location with `newLoc(...)` and a plan with `Plan(width, height)`.
2. Paint the terrain with `ter.rect`, `ter.ellipse`, `ter.path` and `ter.each`, and the objects with `obj.set`, `p.sprinkle` and `p.border`. Reserve buildings with `p.build(x0, y0, x1, y1, fn)`.
3. Call `buildMap(L, p, options)`. It builds the ground with soft corners, cliffs and banks, water, stairs, bridges, batched trees and tall grass, and the walkable grid with heights.
4. Add doors, signs, people and exits, then add the script to `index.html` before `js/game.js`.

`riverbend.js` and `route3.js` are good examples to copy.

## Host it with GitHub Pages

1. In this repo, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/ (root)**.
3. After a minute or two the game is live at `https://<your-username>.github.io/<repo-name>/`.

## Notes

This is a non-commercial fan project. Pokémon is a trademark of Nintendo, Creatures Inc. and GAME FREAK inc. All creatures, characters, towns and art here are original designs.

The region's legendary serpent is an original creature inspired by the idea of a great serpent; it deliberately does not depict the Rainbow Serpent, a sacred ancestral being for many First Nations peoples. The Red Centre likewise uses a fictional giant rock instead of Uluru.
