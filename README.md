# Echobound — Playable Vertical Slice 0.2

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
- Production SVG rigs for Bop, three regular enemies, and King Squashbuckler
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

Elite encounters, animated multi-pose sprite rigs, sound, and full evolution selection belong to the next checkpoint. This version now contains the entire first-region route through its boss and inheritance.
