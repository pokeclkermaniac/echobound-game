# Echobound — Playable Vertical Slice 0.3

This is a dependency-free, GitHub Pages-ready first playable checkpoint for Echobound.

## Included

- Responsive title, route-map, battle, reward, and inheritance screens
- Functional turn-based combat with energy, guard, enemy intents, statuses, and ability costs
- Three playable encounters: Crumbler, Syrup Slug, and Springbean
- Complete King Squashbuckler boss encounter
- Three boss phases with unique visual treatments and intent patterns
- Seedling court, Seed Cannonade scaling, Rind Guard, and Mustache Power
- Quickstep counterplay that removes summoned Seedlings
- Four Bop abilities
- Run rewards and three inheritable family traits
- Generation advancement
- Local persistence
- Offline service worker
- Installable app manifest and Bop app icon
- Twenty production transparent PNG combat assets matching the selected Concept 2 art direction
- Four visual combat states each for Bop, Crumbler, Syrup Slug, Springbean, and King Squashbuckler
- Dynamic combat pose swapping for attacks, guards, enemy intents, damage, and defeat
- Explicit run upgrades with visible before-and-after values
- Correctly separated temporary run upgrades and permanent inherited traits
- Live Bonk, HP, and starting-Guard statistics on the route and battle screens
- Save schema v3 to prevent broken older progression data from contaminating the corrected model
- Automated engine tests
- GitHub Pages deployment workflow

## Run locally

```bash
npm start
```

Then open the local URL printed by `serve`. The game must be served over HTTP for the service worker and external SVG symbols.

## Test

```bash
npm test
```

## GitHub Pages

Upload the contents of this directory to a repository, enable GitHub Pages with **GitHub Actions** as the source, and push to `main`. The included workflow tests and deploys the game. All asset paths are relative, so repository subpaths are supported.

## Checkpoint boundary

Elite encounters, sound, and full evolution selection belong to the next checkpoint. This version contains the entire corrected first-region route through its boss, inheritance, and a visibly stronger next generation.
